-- Lanka Wear schema (MySQL 5.7+ / MariaDB 10.3+)
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  sort INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(160) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  description TEXT NULL,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2) NULL,
  category_id INT UNSIGNED NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  is_new TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_products_category (category_id),
  KEY idx_products_active (is_active, created_at),
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS product_variants (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_id INT UNSIGNED NOT NULL,
  size VARCHAR(30) NOT NULL,
  color VARCHAR(60) NOT NULL DEFAULT '',
  color_hex VARCHAR(9) NOT NULL DEFAULT '',
  stock INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_variant (product_id, size, color),
  CONSTRAINT fk_variants_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS product_images (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_id INT UNSIGNED NOT NULL,
  url VARCHAR(400) NOT NULL,
  sort INT NOT NULL DEFAULT 0,
  KEY idx_images_product (product_id, sort),
  CONSTRAINT fk_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_no VARCHAR(30) NOT NULL UNIQUE,
  customer_name VARCHAR(160) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(190) NULL,
  address VARCHAR(400) NOT NULL,
  city VARCHAR(120) NOT NULL,
  district VARCHAR(60) NOT NULL,
  notes VARCHAR(600) NULL,
  payment_method ENUM('cod','bank') NOT NULL,
  payment_status ENUM('pending','paid') NOT NULL DEFAULT 'pending',
  status ENUM('pending','confirmed','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  slip_url VARCHAR(400) NULL,
  tracking_note VARCHAR(300) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_orders_status (status, created_at),
  KEY idx_orders_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_items (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id INT UNSIGNED NOT NULL,
  product_id INT UNSIGNED NULL,
  variant_id INT UNSIGNED NULL,
  name VARCHAR(200) NOT NULL,
  size VARCHAR(30) NOT NULL,
  color VARCHAR(60) NOT NULL DEFAULT '',
  price DECIMAL(10,2) NOT NULL,
  qty INT NOT NULL,
  KEY idx_items_order (order_id),
  CONSTRAINT fk_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS settings (
  k VARCHAR(60) NOT NULL PRIMARY KEY,
  v TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
