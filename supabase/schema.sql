-- Lanka Wear schema for Postgres / Supabase (preview deployment).
-- The app connects with the database URL (bypasses RLS). RLS is enabled with NO policies,
-- so the public Supabase API (anon key) can read/write nothing.

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  sort INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(160) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  description TEXT NULL,
  price NUMERIC(10,2) NOT NULL,
  compare_price NUMERIC(10,2) NULL,
  category_id INT NULL REFERENCES categories(id) ON DELETE SET NULL,
  is_active SMALLINT NOT NULL DEFAULT 1,
  is_featured SMALLINT NOT NULL DEFAULT 0,
  is_new SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active, created_at);

CREATE TABLE IF NOT EXISTS product_variants (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size VARCHAR(30) NOT NULL,
  color VARCHAR(60) NOT NULL DEFAULT '',
  color_hex VARCHAR(9) NOT NULL DEFAULT '',
  stock INT NOT NULL DEFAULT 0,
  UNIQUE (product_id, size, color)
);

CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url VARCHAR(400) NOT NULL,
  sort INT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_images_product ON product_images(product_id, sort);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_no VARCHAR(30) NOT NULL UNIQUE,
  customer_name VARCHAR(160) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(190) NULL,
  address VARCHAR(400) NOT NULL,
  city VARCHAR(120) NOT NULL,
  district VARCHAR(60) NOT NULL,
  notes VARCHAR(600) NULL,
  payment_method VARCHAR(10) NOT NULL CHECK (payment_method IN ('cod','bank')),
  payment_status VARCHAR(10) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid')),
  status VARCHAR(12) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
  subtotal NUMERIC(10,2) NOT NULL,
  shipping NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  slip_url VARCHAR(400) NULL,
  tracking_note VARCHAR(300) NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT NULL,
  variant_id INT NULL,
  name VARCHAR(200) NOT NULL,
  size VARCHAR(30) NOT NULL,
  color VARCHAR(60) NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL,
  qty INT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_items_order ON order_items(order_id);

CREATE TABLE IF NOT EXISTS settings (
  k VARCHAR(60) PRIMARY KEY,
  v TEXT NOT NULL
);

-- uploaded photos / payment slips (used when no Supabase Storage keys are configured)
CREATE TABLE IF NOT EXISTS media_files (
  path VARCHAR(300) PRIMARY KEY,
  content_type VARCHAR(60) NOT NULL,
  data BYTEA NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
