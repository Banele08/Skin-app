
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  age INTEGER,
  skin_type TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE skin_analyses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  image_url TEXT NOT NULL,
  skin_concerns TEXT,
  ai_analysis TEXT,
  confidence_score REAL,
  recommendations TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  ingredients TEXT,
  skin_types TEXT,
  concerns_addressed TEXT,
  price REAL,
  rating REAL,
  image_url TEXT,
  product_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recommendations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  analysis_id INTEGER,
  product_id INTEGER,
  reason TEXT,
  priority INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_skin_analyses_user_id ON skin_analyses(user_id);
CREATE INDEX idx_recommendations_analysis_id ON recommendations(analysis_id);
CREATE INDEX idx_products_category ON products(category);
