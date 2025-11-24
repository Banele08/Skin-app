-- DermaScanAI Comprehensive Database Schema
-- This migration creates all tables for the 7 core features

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. USERS TABLE (Enhanced for comprehensive user profiles)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    age INTEGER CHECK (age > 0 AND age < 120),
    skin_type TEXT CHECK (skin_type IN ('oily', 'dry', 'combination', 'sensitive', 'normal')),
    skin_tone TEXT CHECK (skin_tone IN ('fair', 'light', 'medium', 'olive', 'tan', 'deep', 'rich')),
    climate_zone TEXT,
    lifestyle_factors JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'expert')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SKIN ANALYSES TABLE (Core AI Analysis Feature)
CREATE TABLE IF NOT EXISTS skin_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_metadata JSONB DEFAULT '{}',
    skin_concerns TEXT[],
    ai_detected_concerns JSONB DEFAULT '{}',
    skin_type_detected TEXT,
    skin_type_confidence REAL CHECK (skin_type_confidence >= 0 AND skin_type_confidence <= 1),
    ai_analysis TEXT,
    confidence_score REAL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    severity_scores JSONB DEFAULT '{}',
    recommendations TEXT,
    analysis_version TEXT DEFAULT '1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SKIN CONCERNS TABLE
CREATE TABLE IF NOT EXISTS skin_concerns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    severity_levels JSONB DEFAULT '[]',
    common_causes TEXT[],
    treatment_approaches TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. INGREDIENTS TABLE
CREATE TABLE IF NOT EXISTS ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    scientific_name TEXT,
    category TEXT,
    function TEXT NOT NULL,
    benefits TEXT[],
    side_effects TEXT[],
    contraindications TEXT[],
    safe_for_sensitive_skin BOOLEAN DEFAULT false,
    safe_for_pregnancy BOOLEAN DEFAULT false,
    concentration_guidelines JSONB DEFAULT '{}',
    interactions JSONB DEFAULT '{}',
    sources TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    description TEXT,
    ingredients TEXT[],
    ingredient_details JSONB DEFAULT '{}',
    skin_types TEXT[],
    concerns_addressed TEXT[],
    price_usd DECIMAL(10,2),
    price_eur DECIMAL(10,2),
    price_gbp DECIMAL(10,2),
    size_ml INTEGER,
    spf_rating INTEGER,
    ph_level DECIMAL(3,1),
    cruelty_free BOOLEAN DEFAULT false,
    vegan BOOLEAN DEFAULT false,
    fragrance_free BOOLEAN DEFAULT false,
    paraben_free BOOLEAN DEFAULT false,
    image_url TEXT,
    product_url TEXT,
    availability_regions TEXT[],
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PRODUCT_INGREDIENTS TABLE
CREATE TABLE IF NOT EXISTS product_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
    concentration DECIMAL(5,2),
    position INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, ingredient_id)
);

-- 7. ROUTINES TABLE
CREATE TABLE IF NOT EXISTS routines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('am', 'pm', 'weekly', 'custom')),
    skin_concerns TEXT[],
    skin_types TEXT[],
    steps JSONB NOT NULL,
    frequency TEXT DEFAULT 'daily',
    duration_weeks INTEGER DEFAULT 4,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID REFERENCES skin_analyses(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    priority INTEGER DEFAULT 1 CHECK (priority > 0),
    confidence_score REAL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    ingredient_insights JSONB DEFAULT '{}',
    usage_instructions TEXT,
    warnings TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. PROGRESS_TRACKING TABLE
CREATE TABLE IF NOT EXISTS progress_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    analysis_id UUID REFERENCES skin_analyses(id) ON DELETE CASCADE,
    before_image_url TEXT,
    after_image_url TEXT,
    symptom_scores JSONB DEFAULT '{}',
    routine_adherence_score REAL CHECK (routine_adherence_score >= 0 AND routine_adherence_score <= 1),
    notes TEXT,
    mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
    tracking_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. COMMUNITY_POSTS TABLE
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    post_type TEXT CHECK (post_type IN ('routine_share', 'progress_update', 'question', 'review')),
    skin_concerns TEXT[],
    skin_type TEXT,
    before_images TEXT[],
    after_images TEXT[],
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. COMMUNITY_COMMENTS TABLE
CREATE TABLE IF NOT EXISTS community_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. EXPERT_ANSWERS TABLE
CREATE TABLE IF NOT EXISTS expert_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    expert_id UUID REFERENCES users(id) ON DELETE CASCADE,
    answer TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. REGIONAL_DATA TABLE
CREATE TABLE IF NOT EXISTS regional_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_code TEXT UNIQUE NOT NULL,
    region_name TEXT NOT NULL,
    country TEXT NOT NULL,
    climate_type TEXT,
    uv_index_average DECIMAL(3,1),
    humidity_average DECIMAL(4,1),
    pollution_level TEXT,
    seasonal_variations JSONB DEFAULT '{}',
    recommended_spf INTEGER,
    common_concerns TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. USER_REGIONAL_SETTINGS TABLE
CREATE TABLE IF NOT EXISTS user_regional_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    region_id UUID REFERENCES regional_data(id) ON DELETE CASCADE,
    current_season TEXT,
    uv_exposure_level TEXT,
    pollution_exposure_level TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. INGREDIENT_INTERACTIONS TABLE
CREATE TABLE IF NOT EXISTS ingredient_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ingredient_a_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
    ingredient_b_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
    interaction_type TEXT CHECK (interaction_type IN ('conflict', 'enhancement', 'neutralization')),
    severity TEXT CHECK (severity IN ('low', 'moderate', 'high')),
    description TEXT NOT NULL,
    recommendation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(ingredient_a_id, ingredient_b_id)
);

-- 16. USER_PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    budget_range TEXT,
    preferred_brands TEXT[],
    avoided_ingredients TEXT[],
    preferred_ingredients TEXT[],
    skin_goals TEXT[],
    routine_complexity TEXT CHECK (routine_complexity IN ('simple', 'moderate', 'advanced')),
    notification_preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_skin_type ON users(skin_type);
CREATE INDEX IF NOT EXISTS idx_skin_analyses_user_id ON skin_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_skin_analyses_created_at ON skin_analyses(created_at);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_skin_types ON products USING GIN(skin_types);
CREATE INDEX IF NOT EXISTS idx_products_concerns ON products USING GIN(concerns_addressed);
CREATE INDEX IF NOT EXISTS idx_recommendations_analysis_id ON recommendations(analysis_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_routines_user_id ON routines(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_tracking_user_id ON progress_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_type ON community_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_ingredients_name ON ingredients(name);
CREATE INDEX IF NOT EXISTS idx_ingredients_category ON ingredients(category);
CREATE INDEX IF NOT EXISTS idx_ingredient_interactions_ingredient_a ON ingredient_interactions(ingredient_a_id);
CREATE INDEX IF NOT EXISTS idx_ingredient_interactions_ingredient_b ON ingredient_interactions(ingredient_b_id);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN(to_tsvector('english', name || ' ' || brand || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_ingredients_search ON ingredients USING GIN(to_tsvector('english', name || ' ' || display_name || ' ' || function));
CREATE INDEX IF NOT EXISTS idx_community_posts_search ON community_posts USING GIN(to_tsvector('english', title || ' ' || content));