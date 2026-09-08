-- Create the calculator database.
CREATE DATABASE IF NOT EXISTS calculator_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE calculator_db;

-- Store registered users.
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Store each calculation and connect it to its user.
CREATE TABLE IF NOT EXISTS calculations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    expression VARCHAR(255) NOT NULL,
    result VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_calculations_user_created (user_id, created_at),
    CONSTRAINT fk_calculations_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

