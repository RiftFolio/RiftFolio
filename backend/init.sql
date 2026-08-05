CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       username VARCHAR(50) UNIQUE NOT NULL,
                       created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE stock_entries (
                               id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                               user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                               riftcodex_card_id VARCHAR(64) NOT NULL,
                               quantity INT NOT NULL CHECK (quantity >= 0),
                               UNIQUE (user_id, riftcodex_card_id)
);