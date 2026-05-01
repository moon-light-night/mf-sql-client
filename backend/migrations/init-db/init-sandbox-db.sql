-- Sandbox database schema
-- Demo tables for user SQL query execution
-- User queries run ONLY against this database, never against the app database.

-- Customers
CREATE TABLE IF NOT EXISTS customers (
    id         SERIAL       PRIMARY KEY,
    name       VARCHAR(200) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    city       VARCHAR(100),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
    id             SERIAL         PRIMARY KEY,
    name           VARCHAR(255)   NOT NULL,
    category       VARCHAR(100),
    price          NUMERIC(10, 2) NOT NULL,
    stock_quantity INTEGER        NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id           SERIAL         PRIMARY KEY,
    customer_id  INTEGER        NOT NULL REFERENCES customers(id),
    status       VARCHAR(50)    NOT NULL DEFAULT 'pending',
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
    id          SERIAL         PRIMARY KEY,
    order_id    INTEGER        NOT NULL REFERENCES orders(id),
    product_id  INTEGER        NOT NULL REFERENCES products(id),
    quantity    INTEGER        NOT NULL DEFAULT 1,
    unit_price  NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL
);

-- Payments 
CREATE TABLE IF NOT EXISTS payments (
    id       SERIAL         PRIMARY KEY,
    order_id INTEGER        NOT NULL REFERENCES orders(id),
    amount   NUMERIC(10, 2) NOT NULL,
    method   VARCHAR(50)    NOT NULL DEFAULT 'card',
    status   VARCHAR(50)    NOT NULL DEFAULT 'pending',
    paid_at  TIMESTAMPTZ
);
