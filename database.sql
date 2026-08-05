CREATE DATABASE IF NOT EXISTS art_marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE art_marketplace;

DROP TABLE IF EXISTS disputes;
DROP TABLE IF EXISTS wishlist_items;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS withdrawals;
DROP TABLE IF EXISTS artist_applications;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS settings;

CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  role VARCHAR(30) NOT NULL,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(50) DEFAULT '',
  address TEXT,
  coins INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  avatar VARCHAR(20) DEFAULT '👤',
  bio TEXT,
  cancel_reason TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE products (
  id VARCHAR(50) PRIMARY KEY,
  image VARCHAR(255) DEFAULT '',
  artist_id VARCHAR(50) DEFAULT '',
  creator VARCHAR(150) DEFAULT '',
  verified TINYINT(1) DEFAULT 0,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) DEFAULT '',
  type VARCHAR(100) DEFAULT '',
  tags LONGTEXT,
  price_coins INT DEFAULT 0,
  price_baht DECIMAL(10,2) DEFAULT 0,
  stock INT DEFAULT 0,
  sold INT DEFAULT 0,
  rating DECIMAL(3,1) DEFAULT 0,
  reviews_count INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft',
  featured TINYINT(1) DEFAULT 0,
  unique_item TINYINT(1) DEFAULT 0,
  badge VARCHAR(100) DEFAULT '',
  delivery VARCHAR(100) DEFAULT '',
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_artist_id (artist_id),
  INDEX idx_category (category),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reviews (
  id VARCHAR(50) PRIMARY KEY,
  product_id VARCHAR(50) DEFAULT '',
  user_name VARCHAR(150) DEFAULT '',
  rating INT DEFAULT 0,
  text TEXT,
  date VARCHAR(50) DEFAULT '',
  reply TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE orders (
  id VARCHAR(80) PRIMARY KEY,
  buyer_id VARCHAR(50) DEFAULT '',
  artist_id VARCHAR(50) DEFAULT '',
  items LONGTEXT,
  total_coins INT DEFAULT 0,
  status VARCHAR(80) DEFAULT '',
  tracking VARCHAR(100) DEFAULT '',
  date VARCHAR(50) DEFAULT '',
  problem TINYINT(1) DEFAULT 0,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_buyer_id (buyer_id),
  INDEX idx_artist_id (artist_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE transactions (
  id VARCHAR(80) PRIMARY KEY,
  user_id VARCHAR(50) DEFAULT '',
  type VARCHAR(80) DEFAULT '',
  amount INT DEFAULT 0,
  note VARCHAR(255) DEFAULT '',
  date VARCHAR(50) DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE messages (
  id VARCHAR(80) PRIMARY KEY,
  room VARCHAR(100) DEFAULT '',
  from_user VARCHAR(50) DEFAULT '',
  text TEXT,
  date VARCHAR(80) DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_room (room)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE artist_applications (
  id VARCHAR(80) PRIMARY KEY,
  user_id VARCHAR(50) DEFAULT '',
  name VARCHAR(150) DEFAULT '',
  portfolio TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  date VARCHAR(50) DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE withdrawals (
  id VARCHAR(80) PRIMARY KEY,
  artist_id VARCHAR(50) DEFAULT '',
  artist VARCHAR(150) DEFAULT '',
  coins INT DEFAULT 0,
  baht DECIMAL(10,2) DEFAULT 0,
  channel VARCHAR(100) DEFAULT '',
  status VARCHAR(50) DEFAULT 'pending',
  date VARCHAR(50) DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_artist_id (artist_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE disputes (
  id VARCHAR(80) PRIMARY KEY,
  order_id VARCHAR(80) DEFAULT '',
  buyer VARCHAR(150) DEFAULT '',
  reason TEXT,
  status VARCHAR(50) DEFAULT 'open',
  date VARCHAR(50) DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE cart_items (
  user_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  qty INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, product_id),
  INDEX idx_cart_user (user_id),
  INDEX idx_cart_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE wishlist_items (
  user_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, product_id),
  INDEX idx_wishlist_user (user_id),
  INDEX idx_wishlist_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE settings (
  id INT PRIMARY KEY,
  coin_rate DECIMAL(10,2) DEFAULT 1,
  platform_fee DECIMAL(5,2) DEFAULT 10,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO users (id, role, name, email, password, phone, address, coins, status, avatar, bio, cancel_reason, sort_order) VALUES
  ('b001', 'buyer', 'ผู้ซื้อ Demo', 'buyer@example.com', '12345678', '080-000-0001', 'มหาสารคาม', 3200, 'active', '👤', '', '', 0),
  ('a001', 'artist', 'RENKA', 'artist@example.com', '12345678', '080-000-0002', 'กรุงเทพฯ', 4890, 'approved', '🎨', 'ศิลปินงานพิมพ์และโปสเตอร์โทนแฟนตาซี', '', 1),
  ('admin001', 'admin', 'Admin Demo', 'admin@example.com', '12345678', '', '', 0, 'active', '🛡️', '', '', 2);

INSERT INTO products (id, image, artist_id, creator, verified, title, category, type, tags, price_coins, price_baht, stock, sold, rating, reviews_count, status, featured, unique_item, badge, delivery, description, sort_order) VALUES
  ('p001', 'assets/art_01.jpg', 'a001', 'RENKA', 1, 'A4 Art Print | Butterfly Noir', 'ภาพพิมพ์', 'สินค้าจัดส่ง', '["wallpaper", "dark", "poster"]', 290, 290, 18, 3981, 4.9, 126, 'published', 1, 0, 'ลด 10%', 'พร้อมส่ง', 'ภาพพิมพ์โทนม่วงดำ ลายเส้นน่ารัก เหมาะสำหรับตกแต่งห้องหรือสะสมเป็นคอลเลกชันส่วนตัว', 0),
  ('p002', 'assets/art_02.jpg', 'a002', 'neko.day', 0, 'Space Cats Sticker Set', 'สติกเกอร์', 'สินค้าจัดส่ง', '["sticker", "cat", "cute"]', 69, 69, 52, 128, 4.8, 44, 'published', 1, 0, 'ขายดี', 'พร้อมส่ง', 'สติกเกอร์แมวอวกาศสีพาสเทล เหมาะสำหรับตกแต่งสมุด โน้ตบุ๊ก และของใช้ส่วนตัว', 1),
  ('p003', 'assets/art_03.jpg', 'a003', 'MochiMochi', 1, 'VTuber Model | Kira', 'VTuber & Streamer', 'สินค้าดิจิทัล', '["vtuber", "digital", "model"]', 1890, 1890, 5, 1245, 4.9, 89, 'published', 1, 0, 'ขายดี', 'ดาวน์โหลดไฟล์', 'โมเดล VTuber สำหรับสตรีมเมอร์ โทนพาสเทล ใช้งานเป็นตัวอย่างต้นแบบสำหรับหน้ารายละเอียดสินค้า', 2),
  ('p004', 'assets/art_04.jpg', 'a004', 'HOSHI STUDIO', 1, 'Sakura Train - Poster A3', 'ภาพพิมพ์', 'สินค้าจัดส่ง', '["wallpaper", "poster", "sakura"]', 199, 199, 25, 2102, 4.7, 51, 'published', 1, 0, 'ลด 15%', 'พร้อมส่ง', 'โปสเตอร์ซากุระโทนชมพูสดใสสำหรับตกแต่งผนังห้องหรือใช้เป็นของขวัญ', 3),
  ('p005', 'assets/art_05.jpg', 'a005', 'Purin Works', 0, 'Acrylic Keychain - Momo', 'พวงกุญแจ', 'สินค้าจัดส่ง', '["keychain", "acrylic", "cute"]', 129, 129, 40, 88, 4.6, 19, 'published', 0, 0, 'พรีออเดอร์', 'จัดส่ง ก.ค. 2567', 'พวงกุญแจอะคริลิกตัวละคร Momo ขนาดพกพา แข็งแรงและน่ารัก', 4),
  ('p006', 'assets/art_06.jpg', 'a006', 'butter.bear', 0, 'Bread Time Sticker Set', 'สติกเกอร์', 'สินค้าจัดส่ง', '["sticker", "bread", "cute"]', 59, 59, 76, 306, 4.8, 37, 'published', 0, 0, 'ขายดี', 'พร้อมส่ง', 'ชุดสติกเกอร์ขนมปังสีอบอุ่น เหมาะกับสายจดบันทึกและตกแต่ง Planner', 5),
  ('p007', 'assets/art_07.jpg', 'a007', 'Dusk Atelier', 1, 'PRE-ORDER | Crimson Oath', 'ภาพวาด', 'สินค้าจัดส่ง', '["brush", "dark", "red"]', 890, 890, 8, 67, 4.9, 12, 'published', 1, 0, 'พรีออเดอร์', 'จัดส่ง ส.ค. 2567', 'ผลงานภาพวาดโทนแดงเข้มสำหรับนักสะสม มีจำนวนจำกัดและเปิดพรีออเดอร์', 6),
  ('p008', 'assets/art_08.jpg', 'a008', 'littlevoyage', 0, 'Journey Log Sticker Set', 'สติกเกอร์', 'สินค้าจัดส่ง', '["sticker", "journey", "blue"]', 75, 75, 61, 214, 4.7, 28, 'published', 0, 0, 'ขายดี', 'พร้อมส่ง', 'สติกเกอร์ธีมบันทึกการเดินทาง สีฟ้าอ่อน เหมาะสำหรับตกแต่งสมุดท่องเที่ยว', 7),
  ('p009', 'assets/art_09.jpg', 'a009', 'Morninzoe', 1, 'ปกนิยายสำเร็จรูป ebook no.01', 'หนังสือและอีบุ๊ก', 'สินค้าดิจิทัล', '["ebook", "cover", "forest"]', 159, 159, 1, 31, 4.6, 9, 'published', 0, 1, 'หนึ่งเดียวในโลก', 'ดาวน์โหลดไฟล์', 'ปกนิยายสำเร็จรูปโทนป่าแฟนตาซี เหมาะสำหรับนิยายออนไลน์และอีบุ๊ก', 8),
  ('p010', 'assets/art_10.jpg', 'a010', 'sixzigsick', 0, 'Adoptable : New Moon', 'ดิจิทัลอาร์ต', 'สินค้าดิจิทัล', '["adoptable", "character", "moon"]', 1250, 1250, 1, 5, 4.9, 4, 'published', 0, 1, 'หนึ่งเดียวในโลก', 'ดาวน์โหลดไฟล์', 'ตัวละคร Adoptable ธีม New Moon ซื้อแล้วถือสิทธิ์ใช้งานตามเงื่อนไขของศิลปิน', 9),
  ('p011', 'assets/art_11.jpg', 'a011', 'Nobuchika12', 0, 'Adoptable #NBCK253', 'ดิจิทัลอาร์ต', 'สินค้าดิจิทัล', '["adoptable", "character", "blue"]', 2300, 2300, 1, 2, 4.8, 3, 'published', 0, 1, 'หนึ่งเดียวในโลก', 'ดาวน์โหลดไฟล์', 'ตัวละคร Adoptable โทนม่วงฟ้า เหมาะสำหรับนำไปพัฒนาเป็น OC หรือคาแรกเตอร์เกม', 10),
  ('p012', 'assets/art_12.jpg', 'a012', 'D.dade', 1, 'Dark Romance', 'ภาพวาด', 'สินค้าดิจิทัล', '["cover", "dark", "romance"]', 189, 189, 1, 48, 4.7, 16, 'published', 0, 1, 'หนึ่งเดียวในโลก', 'ดาวน์โหลดไฟล์', 'ภาพประกอบแนวโรแมนซ์ลึกลับ เหมาะสำหรับปกนิยาย โพสต์โปรโมชัน หรือภาพสะสม', 11),
  ('p013', 'assets/art_13.jpg', 'a013', 'Siva', 0, 'นางรำมหานคร', 'ภาพวาด', 'สินค้าดิจิทัล', '["thai", "dance", "art"]', 990, 990, 1, 13, 4.9, 8, 'published', 1, 1, 'งานไทย', 'ดาวน์โหลดไฟล์', 'ผลงานดิจิทัลอาร์ตแรงบันดาลใจจากนาฏศิลป์ไทย ใช้โทนสีอบอุ่นและองค์ประกอบร่วมสมัย', 12),
  ('p014', 'assets/art_14.jpg', 'a011', 'Nobuchika12', 0, 'Adoptable #NBCK246', 'ดิจิทัลอาร์ต', 'สินค้าดิจิทัล', '["adoptable", "character"]', 2100, 2100, 1, 1, 4.6, 2, 'published', 0, 1, 'หนึ่งเดียวในโลก', 'ดาวน์โหลดไฟล์', 'คาแรกเตอร์ Adoptable โทนขาวดำ ใช้เป็นต้นแบบตัวละครหรือสะสมได้', 13),
  ('p015', 'assets/art_15.jpg', 'a014', 'Saol-KuMoo (2D)', 0, 'Adoptable - Snowdrop', 'ดิจิทัลอาร์ต', 'สินค้าดิจิทัล', '["adoptable", "snow", "pink"]', 1350, 1350, 1, 4, 4.5, 3, 'published', 0, 1, 'หนึ่งเดียวในโลก', 'ดาวน์โหลดไฟล์', 'Adoptable ธีม Snowdrop สีอ่อนนุ่ม เหมาะกับผู้ที่ต้องการคาแรกเตอร์สายหวาน', 14),
  ('p016', 'assets/art_16.jpg', 'a015', 'ESSER', 1, 'DCST | The Dragon’s Bride', 'หนังสือและอีบุ๊ก', 'สินค้าจัดส่ง', '["book", "dragon", "fantasy"]', 210, 210, 22, 5447, 4.9, 160, 'published', 1, 0, 'ร้อนแรง', 'สินค้าจัดส่ง', 'ภาพประกอบธีมเจ้าสาวมังกร โทนน้ำตาลทอง เหมาะสำหรับแฟนงานแฟนตาซี', 15);

INSERT INTO reviews (id, product_id, user_name, rating, text, date, reply, sort_order) VALUES
  ('r001', 'p001', 'Mali', 5, 'งานสีสวยมาก แพ็กมาดี ส่งไว', '2026-06-18', 'ขอบคุณมากค่ะ', 0),
  ('r002', 'p003', 'Beam', 5, 'ไฟล์เรียบร้อย ใช้งานเป็นตัวอย่างได้ดี', '2026-06-20', '', 1),
  ('r003', 'p016', 'Ning', 4, 'ภาพน่ารัก สีอบอุ่น ถูกใจมาก', '2026-06-28', 'ขอบคุณที่อุดหนุนครับ', 2),
  ('r004', 'p006', 'Korn', 5, 'สติกเกอร์น่ารักเกินราคา', '2026-07-01', '', 3);

INSERT INTO orders (id, buyer_id, artist_id, items, total_coins, status, tracking, date, problem, sort_order) VALUES
  ('ORD-1001', 'b001', 'a001', '[{"productId": "p001", "qty": 1, "priceCoins": 290}]', 290, 'กำลังจัดส่ง', 'TH123456789', '2026-07-01', 0, 0),
  ('ORD-1002', 'b001', 'a015', '[{"productId": "p016", "qty": 1, "priceCoins": 210}]', 210, 'รอยืนยันคำสั่งซื้อ', '', '2026-07-03', 0, 1);

INSERT INTO transactions (id, user_id, type, amount, note, date, sort_order) VALUES
  ('TX-9001', 'b001', 'เติมเหรียญ', 3000, 'QR Code PromptPay', '2026-06-30', 0),
  ('TX-9002', 'b001', 'ซื้อสินค้า', -290, 'ORD-1001', '2026-07-01', 1),
  ('TX-9003', 'a001', 'รับเหรียญจากการขาย', 261, 'หลังหักค่าธรรมเนียม 10%', '2026-07-01', 2);

INSERT INTO messages (id, room, from_user, text, date, sort_order) VALUES
  ('m001', 'b001-a001', 'a001', 'สวัสดีค่ะ สนใจสอบถามเรื่องโปสเตอร์ได้เลยนะคะ', '2026-07-01 10:10', 0),
  ('m002', 'b001-a001', 'b001', 'ถ้าสั่งวันนี้จัดส่งวันไหนครับ', '2026-07-01 10:12', 1),
  ('m003', 'b001-a001', 'a001', 'จัดส่งภายใน 1-2 วันค่ะ', '2026-07-01 10:14', 2);

INSERT INTO artist_applications (id, user_id, name, portfolio, status, date, sort_order) VALUES
  ('APP-001', 'a002', 'neko.day', 'สติกเกอร์และงานคาแรกเตอร์', 'pending', '2026-07-02', 0),
  ('APP-002', 'a003', 'MochiMochi', 'VTuber Model และภาพประกอบ', 'pending', '2026-07-03', 1);

INSERT INTO withdrawals (id, artist_id, artist, coins, baht, channel, status, date, sort_order) VALUES
  ('WD-001', 'a001', 'RENKA', 1500, 1500, 'บัญชีธนาคาร', 'pending', '2026-07-04', 0),
  ('WD-002', 'a015', 'ESSER', 2000, 2000, 'PromptPay', 'approved', '2026-07-01', 1);

INSERT INTO disputes (id, order_id, buyer, reason, status, date, sort_order) VALUES
  ('DP-001', 'ORD-1001', 'ผู้ซื้อ Demo', 'ต้องการสอบถามสถานะพัสดุ', 'open', '2026-07-04', 0);

INSERT INTO settings (id, coin_rate, platform_fee) VALUES (1, 1, 10);