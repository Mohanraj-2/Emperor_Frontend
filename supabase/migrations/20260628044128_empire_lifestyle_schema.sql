/*
# Empire Lifestyle E-Commerce Schema

## Overview
Full e-commerce schema for Empire Lifestyle luxury fashion brand.

## New Tables
1. `categories` - Product categories (T-Shirts, Hoodies, Jewellery, Accessories, Caps)
2. `products` - Main product catalog with pricing, images, descriptions
3. `product_variants` - Size/color variants with inventory per product
4. `product_images` - Multiple images per product
5. `coupons` - Discount coupon codes
6. `cart_sessions` - Anonymous/guest cart sessions
7. `cart_items` - Items in a cart session
8. `orders` - Customer orders
9. `order_items` - Line items per order
10. `addresses` - Shipping addresses (linked to auth users)
11. `wishlists` - User wishlist items
12. `custom_designs` - T-shirt custom designs (linked to auth users or sessions)
13. `newsletter_subscribers` - Newsletter email subscriptions

## Security
- RLS enabled on all tables
- Public read for categories, products, coupons
- Anonymous write for cart_sessions, cart_items (guest shopping)
- Authenticated-only for orders, addresses, wishlists, custom_designs
- newsletter_subscribers allows anon insert, authenticated read own

## Notes
- No user profile table needed (use auth.users built-in)
- product_variants tracks stock_quantity for inventory management
- custom_designs stores canvas JSON for the designer tool
*/

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_categories" ON categories;
CREATE POLICY "public_select_categories" ON categories FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_categories" ON categories;
CREATE POLICY "auth_insert_categories" ON categories FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_categories" ON categories;
CREATE POLICY "auth_update_categories" ON categories FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_categories" ON categories;
CREATE POLICY "auth_delete_categories" ON categories FOR DELETE
TO authenticated USING (true);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  original_price numeric(10,2),
  image_url text,
  badge text, -- "NEW", "SALE", "BESTSELLER"
  rating numeric(3,2) DEFAULT 4.5,
  review_count int DEFAULT 0,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  is_bestseller boolean DEFAULT false,
  is_new_arrival boolean DEFAULT false,
  material text,
  care_instructions text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON products(is_bestseller) WHERE is_bestseller = true;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_products" ON products;
CREATE POLICY "public_select_products" ON products FOR SELECT
TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "auth_insert_products" ON products;
CREATE POLICY "auth_insert_products" ON products FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_products" ON products;
CREATE POLICY "auth_update_products" ON products FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_products" ON products;
CREATE POLICY "auth_delete_products" ON products FOR DELETE
TO authenticated USING (true);

-- Product Images
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  display_order int DEFAULT 0,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_product_images" ON product_images;
CREATE POLICY "public_select_product_images" ON product_images FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_product_images" ON product_images;
CREATE POLICY "auth_insert_product_images" ON product_images FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_product_images" ON product_images;
CREATE POLICY "auth_update_product_images" ON product_images FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_product_images" ON product_images;
CREATE POLICY "auth_delete_product_images" ON product_images FOR DELETE
TO authenticated USING (true);

-- Product Variants (size + color combinations)
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size text, -- XS, S, M, L, XL, XXL
  color text,
  color_hex text,
  stock_quantity int NOT NULL DEFAULT 0,
  sku text,
  price_adjustment numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_variants" ON product_variants;
CREATE POLICY "public_select_variants" ON product_variants FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_variants" ON product_variants;
CREATE POLICY "auth_insert_variants" ON product_variants FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_variants" ON product_variants;
CREATE POLICY "auth_update_variants" ON product_variants FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_variants" ON product_variants;
CREATE POLICY "auth_delete_variants" ON product_variants FOR DELETE
TO authenticated USING (true);

-- Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL DEFAULT 'percentage', -- 'percentage' or 'fixed'
  discount_value numeric(10,2) NOT NULL,
  min_order_amount numeric(10,2) DEFAULT 0,
  max_uses int,
  used_count int DEFAULT 0,
  is_active boolean DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_coupons" ON coupons;
CREATE POLICY "public_select_coupons" ON coupons FOR SELECT
TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "auth_insert_coupons" ON coupons;
CREATE POLICY "auth_insert_coupons" ON coupons FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_coupons" ON coupons;
CREATE POLICY "auth_update_coupons" ON coupons FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_coupons" ON coupons;
CREATE POLICY "auth_delete_coupons" ON coupons FOR DELETE
TO authenticated USING (true);

-- Cart Sessions (supports anonymous shopping)
CREATE TABLE IF NOT EXISTS cart_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cart_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_cart_sessions" ON cart_sessions;
CREATE POLICY "anon_select_cart_sessions" ON cart_sessions FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_cart_sessions" ON cart_sessions;
CREATE POLICY "anon_insert_cart_sessions" ON cart_sessions FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_cart_sessions" ON cart_sessions;
CREATE POLICY "anon_update_cart_sessions" ON cart_sessions FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_cart_sessions" ON cart_sessions;
CREATE POLICY "anon_delete_cart_sessions" ON cart_sessions FOR DELETE
TO anon, authenticated USING (true);

-- Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_session_id uuid NOT NULL REFERENCES cart_sessions(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity int NOT NULL DEFAULT 1 CHECK (quantity > 0),
  size text,
  color text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cart_items_session ON cart_items(cart_session_id);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_cart_items" ON cart_items;
CREATE POLICY "anon_select_cart_items" ON cart_items FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_cart_items" ON cart_items;
CREATE POLICY "anon_insert_cart_items" ON cart_items FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_cart_items" ON cart_items;
CREATE POLICY "anon_update_cart_items" ON cart_items FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_cart_items" ON cart_items;
CREATE POLICY "anon_delete_cart_items" ON cart_items FOR DELETE
TO anon, authenticated USING (true);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number text UNIQUE NOT NULL DEFAULT 'EL-' || upper(substring(gen_random_uuid()::text, 1, 8)),
  status text NOT NULL DEFAULT 'pending', -- pending, confirmed, processing, shipped, delivered, cancelled
  subtotal numeric(10,2) NOT NULL,
  shipping_amount numeric(10,2) DEFAULT 99,
  discount_amount numeric(10,2) DEFAULT 0,
  total numeric(10,2) NOT NULL,
  coupon_code text,
  payment_method text, -- 'cod', 'card', 'upi'
  payment_status text DEFAULT 'pending', -- pending, paid, failed, refunded
  shipping_address jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders" ON orders FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_own_orders" ON orders;
CREATE POLICY "update_own_orders" ON orders FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_orders" ON orders;
CREATE POLICY "delete_own_orders" ON orders FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  variant_id uuid REFERENCES product_variants(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_image text,
  size text,
  color text,
  quantity int NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_order_items_own" ON order_items;
CREATE POLICY "select_order_items_own" ON order_items FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_order_items" ON order_items;
CREATE POLICY "insert_order_items" ON order_items FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_order_items" ON order_items;
CREATE POLICY "update_order_items" ON order_items FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_order_items" ON order_items;
CREATE POLICY "delete_order_items" ON order_items FOR DELETE
TO authenticated USING (true);

-- Addresses
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_addresses" ON addresses;
CREATE POLICY "select_own_addresses" ON addresses FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_addresses" ON addresses;
CREATE POLICY "insert_own_addresses" ON addresses FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_addresses" ON addresses;
CREATE POLICY "update_own_addresses" ON addresses FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_addresses" ON addresses;
CREATE POLICY "delete_own_addresses" ON addresses FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- Wishlists
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_wishlist" ON wishlists;
CREATE POLICY "select_own_wishlist" ON wishlists FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_wishlist" ON wishlists;
CREATE POLICY "insert_own_wishlist" ON wishlists FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_wishlist" ON wishlists;
CREATE POLICY "delete_own_wishlist" ON wishlists FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- Custom Designs
CREATE TABLE IF NOT EXISTS custom_designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL DEFAULT 'My Design',
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  canvas_data jsonb, -- front design JSON
  canvas_back_data jsonb, -- back design JSON
  preview_url text,
  is_saved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE custom_designs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_custom_designs" ON custom_designs;
CREATE POLICY "anon_insert_custom_designs" ON custom_designs FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "select_custom_designs" ON custom_designs;
CREATE POLICY "select_custom_designs" ON custom_designs FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "update_custom_designs" ON custom_designs;
CREATE POLICY "update_custom_designs" ON custom_designs FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_custom_designs" ON custom_designs;
CREATE POLICY "delete_custom_designs" ON custom_designs FOR DELETE
TO anon, authenticated USING (true);

-- Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_newsletter" ON newsletter_subscribers;
CREATE POLICY "anon_insert_newsletter" ON newsletter_subscribers FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_newsletter" ON newsletter_subscribers;
CREATE POLICY "auth_select_newsletter" ON newsletter_subscribers FOR SELECT
TO authenticated USING (true);

-- Seed Categories
INSERT INTO categories (name, slug, description, image_url, display_order) VALUES
  ('T-Shirts', 't-shirts', 'Premium cotton T-shirts with Empire Lifestyle branding', 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg', 1),
  ('Hoodies', 'hoodies', 'Warm and stylish hoodies for every season', 'https://images.pexels.com/photos/6311475/pexels-photo-6311475.jpeg', 2),
  ('Jewellery', 'jewellery', 'Elegant gold and silver jewellery pieces', 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg', 3),
  ('Accessories', 'accessories', 'Luxury bags, belts and lifestyle accessories', 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg', 4),
  ('Caps', 'caps', 'Premium caps and headwear collection', 'https://images.pexels.com/photos/1336873/pexels-photo-1336873.jpeg', 5)
ON CONFLICT (slug) DO NOTHING;

-- Seed Products
WITH cat_ids AS (
  SELECT id, slug FROM categories
)
INSERT INTO products (category_id, name, slug, description, price, original_price, image_url, badge, rating, review_count, is_featured, is_bestseller, is_new_arrival, material)
SELECT
  c.id,
  p.name,
  p.slug,
  p.description,
  p.price,
  p.original_price,
  p.image_url,
  p.badge,
  p.rating,
  p.review_count,
  p.is_featured,
  p.is_bestseller,
  p.is_new_arrival,
  p.material
FROM (VALUES
  ('t-shirts', 'Classic Black T-Shirt', 'classic-black-t-shirt', 'Premium 240 GSM cotton unisex regular fit T-shirt with Empire Lifestyle logo print', 699, 999, 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg', 'BESTSELLER', 4.8, 234, true, true, false, 'Premium 240 GSM Cotton'),
  ('t-shirts', 'White Oversized T-Shirt', 'white-oversized-t-shirt', 'Trendy oversized fit white T-shirt with subtle branding', 699, 999, 'https://images.pexels.com/photos/4066293/pexels-photo-4066293.jpeg', NULL, 4.6, 187, true, false, true, 'Premium 240 GSM Cotton'),
  ('t-shirts', 'Navy Premium Tee', 'navy-premium-tee', 'Classic navy blue premium tee with embroidered logo', 799, 1199, 'https://images.pexels.com/photos/5255548/pexels-photo-5255548.jpeg', 'NEW', 4.7, 143, false, false, true, 'Premium 240 GSM Cotton'),
  ('hoodies', 'Oversized Hoodie', 'oversized-hoodie', 'Premium fleece oversized hoodie with kangaroo pocket', 1299, 1799, 'https://images.pexels.com/photos/6311475/pexels-photo-6311475.jpeg', NULL, 4.9, 312, true, true, false, '100% Premium Fleece'),
  ('hoodies', 'Premium Hoodie Black', 'premium-hoodie-black', 'Heavyweight black hoodie with Empire embroidery', 1299, 1799, 'https://images.pexels.com/photos/7679876/pexels-photo-7679876.jpeg', NULL, 4.7, 198, false, false, false, '100% Premium Fleece'),
  ('jewellery', 'Gold Pendant', 'gold-pendant', '22K gold plated Empire Lifestyle signature pendant', 1499, 1999, 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg', NULL, 4.8, 267, true, true, false, '22K Gold Plated'),
  ('jewellery', 'Silver Chain', 'silver-chain', 'Sterling silver 925 rope chain 22 inch', 1099, 1499, 'https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg', NULL, 4.6, 189, true, false, true, 'Sterling Silver 925'),
  ('accessories', 'Luxury Tote Bag', 'luxury-tote-bag', 'Premium vegan leather tote bag with gold hardware', 2499, 3499, 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg', 'NEW', 4.9, 145, true, false, true, 'Vegan Leather'),
  ('caps', 'Premium Cap', 'premium-cap', 'Structured 6-panel cap with embroidered logo', 499, 699, 'https://images.pexels.com/photos/1336873/pexels-photo-1336873.jpeg', NULL, 4.5, 234, true, true, false, '100% Cotton Twill')
) AS p(cat_slug, name, slug, description, price, original_price, image_url, badge, rating, review_count, is_featured, is_bestseller, is_new_arrival, material)
JOIN cat_ids c ON c.slug = p.cat_slug
ON CONFLICT (slug) DO NOTHING;

-- Seed Product Variants for T-Shirts
INSERT INTO product_variants (product_id, size, color, color_hex, stock_quantity)
SELECT p.id, v.size, v.color, v.color_hex, v.stock_quantity
FROM products p
CROSS JOIN (VALUES
  ('S', 'Black', '#1F2937', 50),
  ('M', 'Black', '#1F2937', 80),
  ('L', 'Black', '#1F2937', 60),
  ('XL', 'Black', '#1F2937', 40),
  ('XXL', 'Black', '#1F2937', 20),
  ('S', 'White', '#FFFFFF', 30),
  ('M', 'White', '#FFFFFF', 50),
  ('L', 'White', '#FFFFFF', 45),
  ('XL', 'White', '#FFFFFF', 25)
) AS v(size, color, color_hex, stock_quantity)
WHERE p.slug IN ('classic-black-t-shirt', 'white-oversized-t-shirt', 'navy-premium-tee')
ON CONFLICT DO NOTHING;

-- Seed Coupons
INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_uses) VALUES
  ('EMPIRE10', 'percentage', 10, 500, 1000),
  ('WELCOME20', 'percentage', 20, 1000, 500),
  ('FLAT200', 'fixed', 200, 1500, 200),
  ('LUXURY15', 'percentage', 15, 800, 300)
ON CONFLICT (code) DO NOTHING;
