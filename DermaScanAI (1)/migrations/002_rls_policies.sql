-- Row Level Security (RLS) Policies for DermaScanAI
-- This migration adds security policies to protect user data

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE skin_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE skin_concerns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE regional_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_regional_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- USERS TABLE POLICIES
-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- SKIN ANALYSES TABLE POLICIES
-- Users can only access their own analyses
CREATE POLICY "Users can view own analyses" ON skin_analyses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses" ON skin_analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses" ON skin_analyses
    FOR UPDATE USING (auth.uid() = user_id);

-- SKIN CONCERNS TABLE POLICIES
-- Public read access for skin concerns (reference data)
CREATE POLICY "Anyone can view skin concerns" ON skin_concerns
    FOR SELECT USING (true);

-- INGREDIENTS TABLE POLICIES
-- Public read access for ingredients (reference data)
CREATE POLICY "Anyone can view ingredients" ON ingredients
    FOR SELECT USING (true);

-- PRODUCTS TABLE POLICIES
-- Public read access for products
CREATE POLICY "Anyone can view products" ON products
    FOR SELECT USING (true);

-- PRODUCT_INGREDIENTS TABLE POLICIES
-- Public read access for product ingredients
CREATE POLICY "Anyone can view product ingredients" ON product_ingredients
    FOR SELECT USING (true);

-- ROUTINES TABLE POLICIES
-- Users can only access their own routines
CREATE POLICY "Users can view own routines" ON routines
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own routines" ON routines
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own routines" ON routines
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own routines" ON routines
    FOR DELETE USING (auth.uid() = user_id);

-- RECOMMENDATIONS TABLE POLICIES
-- Users can only access their own recommendations
CREATE POLICY "Users can view own recommendations" ON recommendations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations" ON recommendations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- PROGRESS_TRACKING TABLE POLICIES
-- Users can only access their own progress data
CREATE POLICY "Users can view own progress" ON progress_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON progress_tracking
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON progress_tracking
    FOR UPDATE USING (auth.uid() = user_id);

-- COMMUNITY_POSTS TABLE POLICIES
-- Users can view public posts and their own posts
CREATE POLICY "Users can view public posts" ON community_posts
    FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert own posts" ON community_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON community_posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON community_posts
    FOR DELETE USING (auth.uid() = user_id);

-- COMMUNITY_COMMENTS TABLE POLICIES
-- Users can view comments on posts they can see
CREATE POLICY "Users can view comments on visible posts" ON community_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM community_posts 
            WHERE id = community_comments.post_id 
            AND (is_public = true OR user_id = auth.uid())
        )
    );

CREATE POLICY "Users can insert own comments" ON community_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON community_comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON community_comments
    FOR DELETE USING (auth.uid() = user_id);

-- EXPERT_ANSWERS TABLE POLICIES
-- Public read access for expert answers
CREATE POLICY "Anyone can view expert answers" ON expert_answers
    FOR SELECT USING (true);

-- Only experts can insert/update answers
CREATE POLICY "Experts can insert answers" ON expert_answers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND subscription_tier = 'expert'
        )
    );

-- REGIONAL_DATA TABLE POLICIES
-- Public read access for regional data
CREATE POLICY "Anyone can view regional data" ON regional_data
    FOR SELECT USING (true);

-- USER_REGIONAL_SETTINGS TABLE POLICIES
-- Users can only access their own regional settings
CREATE POLICY "Users can view own regional settings" ON user_regional_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own regional settings" ON user_regional_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own regional settings" ON user_regional_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- INGREDIENT_INTERACTIONS TABLE POLICIES
-- Public read access for ingredient interactions
CREATE POLICY "Anyone can view ingredient interactions" ON ingredient_interactions
    FOR SELECT USING (true);

-- USER_PREFERENCES TABLE POLICIES
-- Users can only access their own preferences
CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);



