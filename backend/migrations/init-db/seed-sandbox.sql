-- Seed data for sandbox database

-- Customers
INSERT INTO customers (name, email, city) VALUES
  ('Alice Johnson',  'alice@example.com',   'New York'),
  ('Bob Smith',      'bob@example.com',     'London'),
  ('Carlos Mendez',  'carlos@example.com',  'Madrid'),
  ('Diana Chen',     'diana@example.com',   'Shanghai'),
  ('Eva Müller',     'eva@example.com',     'Berlin'),
  ('Frank Dubois',   'frank@example.com',   'Paris'),
  ('Grace Kim',      'grace@example.com',   'Seoul'),
  ('Hiro Tanaka',    'hiro@example.com',    'Tokyo'),
  ('Ivan Petrov',    'ivan@example.com',    'Moscow'),
  ('Julia Santos',   'julia@example.com',   'São Paulo');

-- Products
INSERT INTO products (name, category, price, stock_quantity) VALUES
  ('Laptop Pro 15',       'Electronics',  1299.99,  50),
  ('Wireless Mouse',      'Electronics',    29.99, 200),
  ('USB-C Hub',           'Electronics',    49.99, 150),
  ('Standing Desk',       'Furniture',     499.00,  30),
  ('Ergonomic Chair',     'Furniture',     349.00,  40),
  ('Mechanical Keyboard', 'Electronics',   129.99,  80),
  ('Monitor 27"',         'Electronics',   449.99,  60),
  ('Webcam HD',           'Electronics',    89.99, 100),
  ('Desk Lamp',           'Furniture',      39.99, 120),
  ('Notebook A5',         'Stationery',      4.99, 500),
  ('Pen Set',             'Stationery',      9.99, 300),
  ('Coffee Maker',        'Appliances',     79.99,  70);

-- Orders
INSERT INTO orders (customer_id, status, total_amount) VALUES
  (1,  'completed', 1329.98),
  (1,  'completed',   49.99),
  (2,  'completed',  349.00),
  (3,  'pending',    479.99),
  (4,  'completed', 1379.98),
  (5,  'completed',  169.98),
  (6,  'cancelled',  499.00),
  (7,  'completed',  449.99),
  (8,  'pending',    179.98),
  (9,  'completed',   14.98),
  (10, 'completed',  449.99);

-- Order items
-- total_price = quantity * unit_price
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES
  (1,  1, 1, 1299.99, 1299.99),
  (1,  2, 1,   29.99,   29.99),
  (2,  3, 1,   49.99,   49.99),
  (3,  5, 1,  349.00,  349.00),
  (4,  6, 1,  129.99,  129.99),
  (4,  8, 1,   89.99,   89.99),
  (4,  9, 1,   39.99,   39.99),
  (4, 12, 1,   79.99,   79.99),
  (5,  1, 1, 1299.99, 1299.99),
  (5,  2, 1,   29.99,   29.99),
  (5,  3, 1,   49.99,   49.99),
  (6,  2, 1,   29.99,   29.99),
  (6,  6, 1,  129.99,  129.99),
  (7,  4, 1,  499.00,  499.00),
  (8,  7, 1,  449.99,  449.99),
  (9,  6, 1,  129.99,  129.99),
  (9,  8, 1,   49.99,   49.99),
  (10, 10, 1,   4.99,    4.99),
  (10, 11, 1,   9.99,    9.99),
  (11,  7, 1, 449.99,  449.99);

-- Payments
INSERT INTO payments (order_id, amount, method, status, paid_at) VALUES
  (1,  1329.98, 'card',   'paid',    NOW() - INTERVAL '10 days'),
  (2,    49.99, 'paypal', 'paid',    NOW() - INTERVAL '8 days'),
  (3,   349.00, 'card',   'paid',    NOW() - INTERVAL '7 days'),
  (5,  1379.98, 'card',   'paid',    NOW() - INTERVAL '5 days'),
  (6,   169.98, 'card',   'paid',    NOW() - INTERVAL '4 days'),
  (8,   449.99, 'card',   'paid',    NOW() - INTERVAL '2 days'),
  (10,   14.98, 'card',   'paid',    NOW() - INTERVAL '1 day'),
  (11,  449.99, 'crypto', 'paid',    NOW() - INTERVAL '12 hours');
