-- Initialization script for DEVELOPMENT database

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create vazzuniverse role with necessary permissions
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'vazzuniverse') THEN
    CREATE ROLE vazzuniverse WITH LOGIN PASSWORD 'vazzuniverse' CREATEDB;
    COMMENT ON ROLE vazzuniverse IS 'Application user for development';
  END IF;
END $$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE vazzuniverse TO vazzuniverse;

-- Create schema if needed
CREATE SCHEMA IF NOT EXISTS public;
GRANT ALL ON SCHEMA public TO vazzuniverse;
GRANT ALL ON SCHEMA public TO public;

-- Set default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO vazzuniverse;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO vazzuniverse;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO vazzuniverse;