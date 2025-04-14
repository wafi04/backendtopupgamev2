-- dev-init.sql
-- Initialization script for DEVELOPMENT database

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create developer role with relaxed permissions
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_dev_user') THEN
    CREATE ROLE app_dev_user WITH LOGIN PASSWORD 'dev_password';
    COMMENT ON ROLE app_dev_user IS 'Application user for development';
  END IF;
END $$;

-- Grant all privileges for development convenience
GRANT ALL PRIVILEGES ON DATABASE myapp_dev TO app_dev_user;

-- Create schema
CREATE SCHEMA IF NOT EXISTS app_dev_schema AUTHORIZATION app_dev_user;

-- Sample data for development
