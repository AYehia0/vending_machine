CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a postgresql table for users
-- the users table will have the following columns: id, username (unique), password, role (buyer, seller) and created_at
-- the id column should be uuid and should be the primary key
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role text NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_role CHECK (role in ('buyer', 'seller'))
);

-- Create a postgresql table for accounts
-- each user will have an account, the accounts table will have the following columns: id, user_id, balance and created_at
-- the id column should be uuid and should be the primary key, the user_id column should be a foreign key to the users tables
-- the account table is used to store the balance of each user and to keep track of the transactions
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    balance BIGINT NOT NULL DEFAULT 0, -- balance is stored in cents to avoid floating point arithmetic
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create a postgresql table for products
-- the products table will have the following columns: id, name, price, quantity, seller_id and created_at
-- the id column should be uuid and should be the primary key, the seller_id column should be a foreign key to the users table with role=seller
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    price BIGINT NOT NULL DEFAULT 0,
    quantity INT NOT NULL,
    seller_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id)
);

-- Create a postgresql table for orders
-- the orders table will have the following columns: id, product_id, buyer_id, quantity, total_price and created_at
-- the id column should be uuid and should be the primary key, the product_id and buyer_id columns should be foreign keys to the products and users tables respectively
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL,
    buyer_id UUID NOT NULL,
    quantity INT NOT NULL,
    total_price BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (buyer_id) REFERENCES users(id)
);
