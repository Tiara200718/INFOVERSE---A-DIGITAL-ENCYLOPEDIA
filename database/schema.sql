-- InfoVerse MySQL schema (MySQL 8+). Safe to re-run: it never drops data.
-- Legacy installs may still have an email_verified column on users and an
-- auth_tokens table from earlier email-based versions. They are no longer used
-- and this script leaves them (and all existing records) untouched.
CREATE DATABASE IF NOT EXISTS infoverse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE infoverse;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,            -- bcrypt hash only, never plain text
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id INT UNSIGNED PRIMARY KEY,
  display_name VARCHAR(120) NOT NULL DEFAULT 'Scholar',
  interest VARCHAR(120) NOT NULL DEFAULT 'General Knowledge',
  role ENUM('scholar','admin') NOT NULL DEFAULT 'scholar',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS login_activity (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  login_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(64) NULL,
  INDEX idx_login_user (user_id),
  INDEX idx_login_time (login_time),
  CONSTRAINT fk_login_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Server-side login sessions (cookie holds a random id; DB stores its hash).
CREATE TABLE IF NOT EXISTS sessions (
  id_hash CHAR(64) PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Promote your own account to admin (run manually, replace the email):
-- UPDATE user_profiles p JOIN users u ON u.id = p.user_id SET p.role = 'admin' WHERE u.email = 'you@example.com';
