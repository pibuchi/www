-- iknowyou.cloud Database Initialization Script

-- Create database
CREATE DATABASE IF NOT EXISTS iknowyou_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE iknowyou_db;

-- Create user
CREATE USER IF NOT EXISTS 'iknowyou_user'@'localhost' IDENTIFIED BY 'iknowyou_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON iknowyou_db.* TO 'iknowyou_user'@'localhost';
GRANT ALL PRIVILEGES ON iknowyou_db.* TO 'iknowyou_user'@'%';

-- Flush privileges
FLUSH PRIVILEGES;

-- Create users table (will be created by JPA, but adding for reference)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Insert sample admin user
INSERT INTO users (email, password, name, role) VALUES 
('admin@iknowyou.cloud', '$2a$10$rAMyMqLf1B8Ux8Ux8Ux8UO8Ux8Ux8Ux8Ux8Ux8Ux8Ux8Ux8Ux8Ux8U', 'System Administrator', 'ADMIN')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Create additional tables for future use
CREATE TABLE IF NOT EXISTS documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

CREATE TABLE IF NOT EXISTS search_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    query TEXT NOT NULL,
    results_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- Show tables
SHOW TABLES; 
