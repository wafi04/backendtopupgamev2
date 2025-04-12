-- prod-init.sql
-- Initialization script for PRODUCTION database

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set stricter security for production
REVOKE ALL ON DATABASE vazzuniverse FROM PUBLIC;

-- Create application roles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_prod_user') THEN
    CREATE ROLE app_prod_user WITH LOGIN PASSWORD 'strong_prod_password_123!';
    COMMENT ON ROLE app_prod_user IS 'Application user for production';
  END IF;
END $$;

-- Grant permissions
GRANT CONNECT ON DATABASE vazzuniverse TO app_prod_user;

-- Create schema
CREATE SCHEMA IF NOT EXISTS app_prod_schema AUTHORIZATION app_prod_user;

-- Set permissions for schema
GRANT USAGE ON SCHEMA app_prod_schema TO app_prod_user;
GRANT CREATE ON SCHEMA app_prod_schema TO app_prod_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA app_prod_schema
GRANT ALL ON TABLES TO app_prod_user;

-- Create admin user (for emergency access)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'prod_admin') THEN
    CREATE ROLE prod_admin WITH LOGIN PASSWORD 'very_strong_admin_password_456!';
    GRANT ALL PRIVILEGES ON DATABASE vazzuniverse TO prod_admin;
    GRANT ALL PRIVILEGES ON SCHEMA app_prod_schema TO prod_admin;
  END IF;
END $$;

-- Enable logging (production-specific)
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_duration = on;