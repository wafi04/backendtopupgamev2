#!/bin/bash
set -e

# Configuration
BLUE_APP_PORT=4001
GREEN_APP_PORT=4002
PRODUCTION_APP_PORT=4000
BLUE_DB_PORT=5433
GREEN_DB_PORT=5434
PRODUCTION_DB_PORT=5432

# Debug: List running containers
echo "Currently running containers:"
docker ps

# Determine which environment to deploy to
if docker ps | grep -q "backend_topup"; then
  # Production is running, deploy to blue
  NEW_ENV="blue"
  NEW_APP_PORT=$BLUE_APP_PORT
  NEW_DB_PORT=$BLUE_DB_PORT
elif docker ps | grep -q "backend_blue"; then
  # Blue is running, deploy to green
  NEW_ENV="green"
  NEW_APP_PORT=$GREEN_APP_PORT
  NEW_DB_PORT=$GREEN_DB_PORT
elif docker ps | grep -q "backend_green"; then
  # Green is running, deploy to blue
  NEW_ENV="blue"
  NEW_APP_PORT=$BLUE_APP_PORT
  NEW_DB_PORT=$BLUE_DB_PORT
else
  # Nothing is running or couldn't detect, deploy to production
  echo "No matching containers found, defaulting to production environment"
  NEW_ENV="prod"
  NEW_APP_PORT=$PRODUCTION_APP_PORT
  NEW_DB_PORT=$PRODUCTION_DB_PORT
fi

# Safety check to ensure NEW_ENV is set
if [ -z "$NEW_ENV" ]; then
  echo "Failed to determine deployment environment. Setting to prod as fallback."
  NEW_ENV="prod"
  NEW_APP_PORT=$PRODUCTION_APP_PORT
  NEW_DB_PORT=$PRODUCTION_DB_PORT
fi


echo "Deploying to $NEW_ENV environment"

# Create environment-specific docker-compose file
cat > ~/backend/docker/docker-compose.$NEW_ENV.yml << EOF
version: '3'

services:
  db_$NEW_ENV:
    image: postgres:15-alpine
    container_name: db_$NEW_ENV
    restart: unless-stopped
    environment:
      POSTGRES_USER: vazzuniverse
      POSTGRES_PASSWORD: vazzuniverse
      POSTGRES_DB: vazzuniverse
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8 --lc-collate=C --lc-ctype=C"
      TZ: Asia/Jakarta
    volumes:
      - postgres_data_$NEW_ENV:/var/lib/postgresql/data
      - ./init-scripts/prod-init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "$NEW_DB_PORT:5432"
    networks:
      - backend-network-$NEW_ENV
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U vazzuniverse -d vazzuniverse"]
      interval: 5s
      timeout: 5s
      retries: 10
    logging:
      driver: json-file
      options:
        max-size: 10m
        max-file: 3

  backend_$NEW_ENV:
    build:
      context: ..
      dockerfile: docker/Dockerfile.prod
    container_name: backend_$NEW_ENV
    ports:
      - "$NEW_APP_PORT:4000"
    depends_on:
      - db_$NEW_ENV
    networks:
      - backend-network-$NEW_ENV
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://vazzuniverse:vazzuniverse@db_$NEW_ENV:5432/vazzuniverse?schema=public
    env_file:
      - ../.env.production
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://0.0.0.0:4000/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 20s

volumes:
  postgres_data_$NEW_ENV:

networks:
  backend-network-$NEW_ENV:
    driver: bridge
EOF

# Start the new environment
cd ~/backend/docker
docker compose -f docker-compose.$NEW_ENV.yml up -d --build

# Wait for the new service to be ready
echo "Waiting for new service to be ready..."
sleep 15

# Health check
HEALTH_CHECK_MAX_ATTEMPTS=30
HEALTH_CHECK_ATTEMPT=0
HEALTH_CHECK_SUCCESS=false

while [ $HEALTH_CHECK_ATTEMPT -lt $HEALTH_CHECK_MAX_ATTEMPTS ]; do
  if curl -s http://103.127.98.128:$NEW_APP_PORT/health | grep -q '"status":true'; then
    HEALTH_CHECK_SUCCESS=true
    break
  fi
  HEALTH_CHECK_ATTEMPT=$((HEALTH_CHECK_ATTEMPT+1))
  echo "Health check attempt $HEALTH_CHECK_ATTEMPT failed. Retrying..."
  sleep 2
done

if [ "$HEALTH_CHECK_SUCCESS" = false ]; then
  echo "Health check failed after $HEALTH_CHECK_MAX_ATTEMPTS attempts. Rolling back."
  docker compose -f docker-compose.$NEW_ENV.yml down
  exit 1
fi

cat > ~/backend/nginx-backend.conf << EOF
server {
    listen 80;
    server_name api.vazzuniverse.id;

    location / {
        proxy_pass http://localhost:$NEW_APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # WebSocket support if needed
    location /socket.io/ {
        proxy_pass http://localhost:$NEW_APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Copy Nginx config to proper location with sudo
sudo cp ~/backend/nginx-backend.conf /etc/nginx/conf.d/backend.conf

# Reload nginx configuration
sudo nginx -s reload || sudo systemctl restart nginx

# Wait to ensure everything is working properly with the new environment
echo "Waiting to verify new deployment stability..."
sleep 5

# If this is not the first deployment, determine what should be shut down
if [ "$NEW_ENV" = "blue" ]; then
  if docker ps | grep -q "backend_green"; then
    echo "Stopping green environment"
    cd ~/backend/docker
    docker-compose -f docker-compose.green.yml down
  elif docker ps | grep -q "backend_topup"; then
    echo "Stopping production environment"
    cd ~/backend/docker
    docker-compose down || true
  fi
elif [ "$NEW_ENV" = "green" ]; then
  if docker ps | grep -q "backend_blue"; then
    echo "Stopping blue environment"
    cd ~/backend/docker
    docker compose -f docker-compose.blue.yml down
  elif docker ps | grep -q "backend_topup"; then
    echo "Stopping production environment"
    cd ~/backend/docker
    docker compose down || true
  fi
fi

echo "Deployment to $NEW_ENV environment completed successfully!"