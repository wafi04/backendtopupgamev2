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
CREATE TABLE IF NOT EXISTS app_dev_schema.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert test data
INSERT INTO app_dev_schema.users (username, email) VALUES
  ('developer1', 'dev1@example.com'),
  ('developer2', 'dev2@example.com'),
  ('tester', 'qa@example.com')
ON CONFLICT DO NOTHING;

-- Create helper functions for development
CREATE OR REPLACE FUNCTION app_dev_schema.random_email() RETURNS VARCHAR AS $$
BEGIN
  RETURN CONCAT(
    substr(md5(random()::text), 0, 10),
    '@example.com'
  );
END;
$$ LANGUAGE plpgsql;