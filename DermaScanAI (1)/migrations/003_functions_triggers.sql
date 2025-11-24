-- Database Functions and Triggers for DermaScanAI
-- This migration adds automated functions and triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skin_analyses_updated_at BEFORE UPDATE ON skin_analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ingredients_updated_at BEFORE UPDATE ON ingredients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routines_updated_at BEFORE UPDATE ON routines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_comments_updated_at BEFORE UPDATE ON community_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expert_answers_updated_at BEFORE UPDATE ON expert_answers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_regional_settings_updated_at BEFORE UPDATE ON user_regional_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user preferences when user is created
CREATE OR REPLACE FUNCTION create_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_preferences (user_id, budget_range, routine_complexity)
    VALUES (NEW.id, 'medium', 'moderate');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_user_preferences_trigger
    AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION create_user_preferences();

-- Function to update product rating when reviews change
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
    new_rating DECIMAL(3,2);
    new_count INTEGER;
BEGIN
    -- This would typically calculate from a reviews table
    -- For now, we'll just update the review count
    UPDATE products 
    SET review_count = review_count + 1
    WHERE id = COALESCE(NEW.product_id, OLD.product_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Function to detect ingredient conflicts in recommendations
CREATE OR REPLACE FUNCTION check_ingredient_conflicts()
RETURNS TRIGGER AS $$
DECLARE
    conflict_count INTEGER;
    conflict_info TEXT;
BEGIN
    -- Check for conflicts between ingredients in the recommended product
    SELECT COUNT(*), string_agg(ii.description, '; ')
    INTO conflict_count, conflict_info
    FROM product_ingredients pi1
    JOIN product_ingredients pi2 ON pi1.product_id = pi2.product_id
    JOIN ingredient_interactions ii ON (
        (ii.ingredient_a_id = pi1.ingredient_id AND ii.ingredient_b_id = pi2.ingredient_id) OR
        (ii.ingredient_a_id = pi2.ingredient_id AND ii.ingredient_b_id = pi1.ingredient_id)
    )
    WHERE pi1.product_id = NEW.product_id
    AND pi1.id != pi2.id
    AND ii.interaction_type = 'conflict';
    
    IF conflict_count > 0 THEN
        NEW.warnings = ARRAY[conflict_info];
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER check_ingredient_conflicts_trigger
    BEFORE INSERT ON recommendations
    FOR EACH ROW EXECUTE FUNCTION check_ingredient_conflicts();

-- Function to update community post counts
CREATE OR REPLACE FUNCTION update_post_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE community_posts 
        SET comments_count = comments_count + 1
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE community_posts 
        SET comments_count = comments_count - 1
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_post_comment_count
    AFTER INSERT OR DELETE ON community_comments
    FOR EACH ROW EXECUTE FUNCTION update_post_counts();

-- Function to generate personalized routine based on skin analysis
CREATE OR REPLACE FUNCTION generate_personalized_routine(
    p_user_id UUID,
    p_analysis_id UUID,
    p_routine_type TEXT DEFAULT 'am'
)
RETURNS UUID AS $$
DECLARE
    routine_id UUID;
    user_skin_type TEXT;
    user_concerns TEXT[];
    routine_steps JSONB;
BEGIN
    -- Get user's skin type and concerns from analysis
    SELECT u.skin_type, sa.skin_concerns
    INTO user_skin_type, user_concerns
    FROM users u
    JOIN skin_analyses sa ON u.id = sa.user_id
    WHERE u.id = p_user_id AND sa.id = p_analysis_id;
    
    -- Generate routine steps based on skin type and concerns
    routine_steps := CASE p_routine_type
        WHEN 'am' THEN jsonb_build_array(
            jsonb_build_object(
                'step', 1,
                'product_type', 'cleanser',
                'instruction', 'Gently cleanse your face with lukewarm water'
            ),
            jsonb_build_object(
                'step', 2,
                'product_type', 'serum',
                'instruction', 'Apply serum to clean, dry skin'
            ),
            jsonb_build_object(
                'step', 3,
                'product_type', 'moisturizer',
                'instruction', 'Moisturize while skin is still slightly damp'
            ),
            jsonb_build_object(
                'step', 4,
                'product_type', 'sunscreen',
                'instruction', 'Apply broad-spectrum SPF 30+ as final step'
            )
        )
        WHEN 'pm' THEN jsonb_build_array(
            jsonb_build_object(
                'step', 1,
                'product_type', 'cleanser',
                'instruction', 'Remove makeup and cleanse thoroughly'
            ),
            jsonb_build_object(
                'step', 2,
                'product_type', 'treatment',
                'instruction', 'Apply treatment products for your specific concerns'
            ),
            jsonb_build_object(
                'step', 3,
                'product_type', 'moisturizer',
                'instruction', 'Apply night moisturizer or face oil'
            )
        )
    END;
    
    -- Insert the routine
    INSERT INTO routines (user_id, name, type, skin_concerns, skin_types, steps)
    VALUES (
        p_user_id,
        p_routine_type || ' Routine - ' || to_char(NOW(), 'YYYY-MM-DD'),
        p_routine_type,
        user_concerns,
        ARRAY[user_skin_type],
        routine_steps
    )
    RETURNING id INTO routine_id;
    
    RETURN routine_id;
END;
$$ language 'plpgsql';

-- Function to get product recommendations based on skin analysis
CREATE OR REPLACE FUNCTION get_product_recommendations(
    p_analysis_id UUID,
    p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
    product_id UUID,
    product_name TEXT,
    brand TEXT,
    category TEXT,
    reason TEXT,
    confidence_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id as product_id,
        p.name as product_name,
        p.brand,
        p.category,
        'Recommended based on your skin analysis and concerns' as reason,
        RANDOM() * 0.3 + 0.7 as confidence_score -- 70-100% confidence
    FROM products p
    JOIN skin_analyses sa ON sa.id = p_analysis_id
    WHERE 
        -- Match skin types
        (p.skin_types IS NULL OR sa.skin_type_detected = ANY(p.skin_types))
        -- Match concerns
        AND (p.concerns_addressed IS NULL OR sa.skin_concerns && p.concerns_addressed)
    ORDER BY confidence_score DESC
    LIMIT p_limit;
END;
$$ language 'plpgsql';

-- Function to search products with advanced filtering
CREATE OR REPLACE FUNCTION search_products(
    p_search_term TEXT DEFAULT '',
    p_categories TEXT[] DEFAULT NULL,
    p_skin_types TEXT[] DEFAULT NULL,
    p_concerns TEXT[] DEFAULT NULL,
    p_budget_range TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    brand TEXT,
    category TEXT,
    price_usd DECIMAL(10,2),
    rating DECIMAL(3,2),
    image_url TEXT,
    relevance_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.brand,
        p.category,
        p.price_usd,
        p.rating,
        p.image_url,
        CASE 
            WHEN p_search_term = '' THEN 1.0
            ELSE ts_rank(to_tsvector('english', p.name || ' ' || p.brand || ' ' || COALESCE(p.description, '')), plainto_tsquery('english', p_search_term))
        END as relevance_score
    FROM products p
    WHERE 
        (p_search_term = '' OR to_tsvector('english', p.name || ' ' || p.brand || ' ' || COALESCE(p.description, '')) @@ plainto_tsquery('english', p_search_term))
        AND (p_categories IS NULL OR p.category = ANY(p_categories))
        AND (p_skin_types IS NULL OR p.skin_types && p_skin_types)
        AND (p_concerns IS NULL OR p.concerns_addressed && p_concerns)
        AND (p_budget_range IS NULL OR 
            (p_budget_range = 'low' AND p.price_usd < 25) OR
            (p_budget_range = 'medium' AND p.price_usd >= 25 AND p.price_usd < 75) OR
            (p_budget_range = 'high' AND p.price_usd >= 75 AND p.price_usd < 150) OR
            (p_budget_range = 'luxury' AND p.price_usd >= 150)
        )
    ORDER BY relevance_score DESC, p.rating DESC
    LIMIT p_limit;
END;
$$ language 'plpgsql';

-- Function to get ingredient information with safety data
CREATE OR REPLACE FUNCTION get_ingredient_info(p_ingredient_name TEXT)
RETURNS TABLE (
    id UUID,
    name TEXT,
    display_name TEXT,
    function TEXT,
    benefits TEXT[],
    side_effects TEXT[],
    contraindications TEXT[],
    safe_for_sensitive_skin BOOLEAN,
    safe_for_pregnancy BOOLEAN,
    concentration_guidelines JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        i.name,
        i.display_name,
        i.function,
        i.benefits,
        i.side_effects,
        i.contraindications,
        i.safe_for_sensitive_skin,
        i.safe_for_pregnancy,
        i.concentration_guidelines
    FROM ingredients i
    WHERE i.name ILIKE '%' || p_ingredient_name || '%'
    OR i.display_name ILIKE '%' || p_ingredient_name || '%';
END;
$$ language 'plpgsql';



