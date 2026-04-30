-- Notes Marketplace Database Schema
-- Run this file to set up your database

CREATE DATABASE IF NOT EXISTS notes_marketplace;
USE notes_marketplace;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('buyer', 'admin') DEFAULT 'buyer',
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products (Notes) table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id INT,
  subject VARCHAR(100),
  pages INT DEFAULT 0,
  preview_images JSON,
  pdf_file VARCHAR(255),
  is_featured BOOLEAN DEFAULT FALSE,
  download_count INT DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  review_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_ref VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_review (user_id, product_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_cart_item (user_id, product_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Seed categories
INSERT IGNORE INTO categories (name, slug, icon) VALUES
  ('Mathematics', 'mathematics', 'math'),
  ('Physics', 'physics', 'physics'),
  ('Chemistry', 'chemistry', 'chemistry'),
  ('Biology', 'biology', 'biology'),
  ('Computer Science', 'computer-science', 'cs'),
  ('History', 'history', 'history'),
  ('Economics', 'economics', 'economics'),
  ('English', 'english', 'english');

-- Seed sample products
INSERT IGNORE INTO products (title, description, price, category_id, subject, pages, is_featured) VALUES
  ('Calculus Complete Notes', 'Comprehensive handwritten calculus notes covering limits, derivatives, and integrals with worked examples.', 9.99, 1, 'Calculus', 120, TRUE),
  ('Quantum Mechanics Fundamentals', 'Clear handwritten notes on quantum mechanics basics, wave functions, and Schrödinger equation.', 12.99, 2, 'Physics', 85, TRUE),
  ('Organic Chemistry Reactions', 'All major organic chemistry reactions with mechanisms, handwritten and color-coded.', 11.99, 3, 'Chemistry', 95, TRUE),
  ('Data Structures & Algorithms', 'Handwritten notes on arrays, trees, graphs, sorting, and searching algorithms.', 14.99, 5, 'Computer Science', 110, TRUE),
  ('Cell Biology Deep Dive', 'Detailed notes on cell structure, function, division, and molecular biology.', 8.99, 4, 'Biology', 75, FALSE),
  ('World History: Modern Era', 'Chronological notes on modern world history from 1800 to present.', 7.99, 6, 'History', 90, FALSE);
