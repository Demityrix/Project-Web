USE art_marketplace;

ALTER TABLE users ADD COLUMN IF NOT EXISTS cancel_reason TEXT NULL AFTER bio;

CREATE TABLE IF NOT EXISTS cart_items (
  user_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  qty INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, product_id),
  INDEX idx_cart_user (user_id),
  INDEX idx_cart_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS wishlist_items (
  user_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, product_id),
  INDEX idx_wishlist_user (user_id),
  INDEX idx_wishlist_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
