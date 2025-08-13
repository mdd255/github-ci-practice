-- Initialize database for learning API

-- Create database if it doesn't exist (this is handled by POSTGRES_DB environment variable)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- You can add any initial data or setup scripts here
-- For example:

-- Create initial admin user (password will be hashed by the application)
-- INSERT INTO users (id, email, firstName, lastName, password, role, isActive)
-- VALUES (
--   uuid_generate_v4(),
--   'admin@example.com',
--   'Admin',
--   'User',
--   '$2b$10$placeholder', -- This will be replaced by proper hashed password
--   'admin',
--   true
-- );