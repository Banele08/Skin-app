-- Seed data for DermaScanAI
-- This migration populates the database with initial data

-- Insert skin concerns
INSERT INTO skin_concerns (name, display_name, description, category, severity_levels, common_causes, treatment_approaches) VALUES
('acne', 'Acne', 'Inflammatory skin condition characterized by pimples, blackheads, and whiteheads', 'inflammatory', 
 '[{"level": "mild", "description": "Few comedones and occasional pimples"}, {"level": "moderate", "description": "Multiple pimples and some inflammation"}, {"level": "severe", "description": "Many inflamed lesions, cysts, and nodules"}]',
 '["hormonal changes", "excess oil production", "bacteria", "clogged pores", "stress", "diet"]',
 '["gentle cleansing", "salicylic acid", "benzoyl peroxide", "retinoids", "professional treatments"]'),

('dryness', 'Dry Skin', 'Lack of moisture in the skin leading to tightness, flaking, and rough texture', 'moisture',
 '[{"level": "mild", "description": "Slight tightness and occasional flaking"}, {"level": "moderate", "description": "Visible flaking and rough texture"}, {"level": "severe", "description": "Severe flaking, cracking, and irritation"}]',
 '["weather", "harsh products", "aging", "medical conditions", "hot water", "low humidity"]',
 '["gentle cleansers", "hyaluronic acid", "ceramides", "moisturizers", "humectants"]'),

('oiliness', 'Oily Skin', 'Excessive sebum production leading to shiny appearance and enlarged pores', 'sebum',
 '[{"level": "mild", "description": "Slight shine in T-zone"}, {"level": "moderate", "description": "Visible shine across face"}, {"level": "severe", "description": "Excessive oil production, very shiny skin"}]',
 '["genetics", "hormones", "weather", "over-cleansing", "wrong products"]',
 '["oil-free products", "salicylic acid", "clay masks", "blotting papers", "balanced routine"]'),

('dark_spots', 'Dark Spots', 'Hyperpigmentation caused by sun damage, acne scars, or hormonal changes', 'pigmentation',
 '[{"level": "mild", "description": "Few small spots"}, {"level": "moderate", "description": "Multiple visible spots"}, {"level": "severe", "description": "Large, dark patches"}]',
 '["sun exposure", "acne scars", "hormonal changes", "aging", "inflammation"]',
 '["vitamin C", "niacinamide", "retinoids", "sunscreen", "professional treatments"]'),

('wrinkles', 'Wrinkles', 'Fine lines and creases that develop with age and sun exposure', 'aging',
 '[{"level": "mild", "description": "Fine lines around eyes and mouth"}, {"level": "moderate", "description": "Visible lines in multiple areas"}, {"level": "severe", "description": "Deep wrinkles and sagging"}]',
 '["aging", "sun exposure", "smoking", "facial expressions", "genetics", "dehydration"]',
 '["retinoids", "peptides", "antioxidants", "sunscreen", "professional treatments"]'),

('redness', 'Redness', 'Inflammation or irritation causing red, flushed appearance', 'inflammatory',
 '[{"level": "mild", "description": "Slight redness or flushing"}, {"level": "moderate", "description": "Visible redness in patches"}, {"level": "severe", "description": "Intense redness and inflammation"}]',
 '["rosacea", "sensitivity", "allergic reactions", "weather", "harsh products", "stress"]',
 '["gentle products", "anti-inflammatory ingredients", "cooling treatments", "avoiding triggers"]'),

('sensitivity', 'Sensitive Skin', 'Skin that reacts easily to products, weather, or other triggers', 'reactive',
 '[{"level": "mild", "description": "Occasional mild reactions"}, {"level": "moderate", "description": "Frequent mild to moderate reactions"}, {"level": "severe", "description": "Frequent severe reactions"}]',
 '["genetics", "skin barrier damage", "harsh products", "environmental factors", "stress"]',
 '["gentle, fragrance-free products", "soothing ingredients", "patch testing", "minimal routine"]');

-- Insert ingredients
INSERT INTO ingredients (name, display_name, scientific_name, category, function, benefits, side_effects, contraindications, safe_for_sensitive_skin, safe_for_pregnancy, concentration_guidelines, sources) VALUES
('hyaluronic_acid', 'Hyaluronic Acid', 'Sodium Hyaluronate', 'humectant', 'Attracts and retains moisture in the skin', 
 '["intense hydration", "plumps skin", "reduces fine lines", "improves skin texture", "non-comedogenic"]',
 '["rare allergic reactions"]', '["none known"]', true, true, '{"serum": "0.5-2%", "moisturizer": "0.1-1%"}', '["fermentation", "bacterial synthesis"]'),

('niacinamide', 'Niacinamide', 'Nicotinamide', 'vitamin', 'Improves skin barrier function and reduces inflammation',
 '["reduces oiliness", "minimizes pores", "reduces redness", "improves skin texture", "brightens skin"]',
 '["mild irritation in high concentrations", "temporary flushing"]', '["none known"]', true, true, '{"serum": "2-10%", "moisturizer": "2-5%"}', '["synthetic", "natural sources"]'),

('vitamin_c', 'Vitamin C', 'L-Ascorbic Acid', 'antioxidant', 'Neutralizes free radicals and stimulates collagen production',
 '["brightens skin", "reduces dark spots", "stimulates collagen", "protects from sun damage", "reduces inflammation"]',
 '["irritation in sensitive skin", "staining", "oxidation"]', '["avoid with retinol", "photosensitive"]', false, true, '{"serum": "5-20%", "moisturizer": "2-10%"}', '["citrus fruits", "synthetic"]'),

('retinol', 'Retinol', 'Vitamin A', 'retinoid', 'Increases cell turnover and stimulates collagen production',
 '["reduces wrinkles", "improves skin texture", "reduces acne", "evens skin tone", "stimulates collagen"]',
 '["irritation", "dryness", "photosensitivity", "peeling"]', '["pregnancy", "breastfeeding", "avoid with AHAs/BHAs"]', false, false, '{"serum": "0.1-1%", "moisturizer": "0.01-0.1%"}', '["synthetic", "animal sources"]'),

('salicylic_acid', 'Salicylic Acid', 'Beta Hydroxy Acid', 'acid', 'Exfoliates skin and unclogs pores',
 '["treats acne", "unclogs pores", "reduces blackheads", "improves skin texture", "anti-inflammatory"]',
 '["irritation", "dryness", "photosensitivity"]', '["pregnancy", "avoid with other acids"]', false, false, '{"cleanser": "0.5-2%", "serum": "1-2%", "spot treatment": "2-5%"}', '["willow bark", "synthetic"]'),

('ceramides', 'Ceramides', 'Ceramide NP, AP, EOP', 'emollient', 'Restores and maintains skin barrier function',
 '["repairs skin barrier", "retains moisture", "reduces sensitivity", "improves skin texture", "anti-aging"]',
 '["none known"]', '["none known"]', true, true, '{"moisturizer": "0.5-5%", "serum": "1-3%"}', '["synthetic", "plant-derived"]'),

('peptides', 'Peptides', 'Palmitoyl Pentapeptide-4', 'peptide', 'Stimulates collagen production and improves skin firmness',
 '["reduces wrinkles", "improves firmness", "stimulates collagen", "reduces inflammation", "heals skin"]',
 '["mild irritation in sensitive skin"]', '["none known"]', true, true, '{"serum": "1-10%", "moisturizer": "0.5-5%"}', '["synthetic"]'),

('azelaic_acid', 'Azelaic Acid', 'Azelaic Acid', 'acid', 'Reduces inflammation and treats hyperpigmentation',
 '["treats acne", "reduces redness", "treats rosacea", "reduces dark spots", "anti-inflammatory"]',
 '["mild irritation", "dryness"]', '["pregnancy", "breastfeeding"]', true, false, '{"serum": "10-20%", "moisturizer": "5-10%"}', '["synthetic", "natural sources"]'),

('alpha_arbutin', 'Alpha Arbutin', 'Alpha-Arbutin', 'brightening', 'Inhibits melanin production to reduce dark spots',
 '["reduces dark spots", "brightens skin", "evens skin tone", "gentle on skin", "stable"]',
 '["none known"]', '["none known"]', true, true, '{"serum": "1-2%", "moisturizer": "0.5-1%"}', '["bearberry", "synthetic"]'),

('centella_asiatica', 'Centella Asiatica', 'Madecassoside', 'soothing', 'Reduces inflammation and promotes healing',
 '["soothes skin", "reduces redness", "promotes healing", "anti-inflammatory", "antioxidant"]',
 '["none known"]', '["none known"]', true, true, '{"serum": "0.1-1%", "moisturizer": "0.05-0.5%"}', '["centella asiatica plant"]');

-- Insert ingredient interactions
INSERT INTO ingredient_interactions (ingredient_a_id, ingredient_b_id, interaction_type, severity, description, recommendation) VALUES
((SELECT id FROM ingredients WHERE name = 'retinol'), (SELECT id FROM ingredients WHERE name = 'vitamin_c'), 'conflict', 'moderate', 'Can cause irritation when used together', 'Use at different times - retinol at night, vitamin C in morning'),
((SELECT id FROM ingredients WHERE name = 'retinol'), (SELECT id FROM ingredients WHERE name = 'salicylic_acid'), 'conflict', 'high', 'Can cause excessive irritation and dryness', 'Avoid using together, alternate days or use at different times'),
((SELECT id FROM ingredients WHERE name = 'vitamin_c'), (SELECT id FROM ingredients WHERE name = 'niacinamide'), 'conflict', 'low', 'May reduce effectiveness when mixed', 'Use at different times or in separate products'),
((SELECT id FROM ingredients WHERE name = 'hyaluronic_acid'), (SELECT id FROM ingredients WHERE name = 'ceramides'), 'enhancement', 'low', 'Work together to improve skin barrier and hydration', 'Use together for maximum hydration benefits'),
((SELECT id FROM ingredients WHERE name = 'niacinamide'), (SELECT id FROM ingredients WHERE name = 'azelaic_acid'), 'enhancement', 'low', 'Both help reduce inflammation and improve skin texture', 'Safe to use together for acne-prone skin');

-- Insert regional data
INSERT INTO regional_data (region_code, region_name, country, climate_type, uv_index_average, humidity_average, pollution_level, recommended_spf, common_concerns) VALUES
('US-CA', 'California', 'United States', 'mediterranean', 7.5, 65.0, 'moderate', 30, '["sun_damage", "dryness", "pollution"]'),
('US-NY', 'New York', 'United States', 'continental', 5.2, 70.0, 'high', 15, '["pollution", "stress", "dryness"]'),
('UK-LON', 'London', 'United Kingdom', 'temperate', 3.8, 80.0, 'moderate', 15, '["dullness", "dryness", "sensitivity"]'),
('AU-SYD', 'Sydney', 'Australia', 'subtropical', 8.2, 75.0, 'low', 50, '["sun_damage", "hyperpigmentation", "dryness"]'),
('JP-TOK', 'Tokyo', 'Japan', 'temperate', 6.1, 70.0, 'moderate', 30, '["pollution", "sensitivity", "dullness"]'),
('IN-MUM', 'Mumbai', 'India', 'tropical', 8.5, 85.0, 'high', 50, '["pollution", "oiliness", "hyperpigmentation"]'),
('BR-SP', 'São Paulo', 'Brazil', 'subtropical', 7.8, 80.0, 'high', 30, '["pollution", "oiliness", "hyperpigmentation"]'),
('DE-BER', 'Berlin', 'Germany', 'continental', 4.2, 70.0, 'low', 15, '["dryness", "sensitivity", "dullness"]');

-- Insert sample products
INSERT INTO products (name, brand, category, subcategory, description, ingredients, skin_types, concerns_addressed, price_usd, size_ml, cruelty_free, vegan, fragrance_free, image_url, rating, review_count) VALUES
('Gentle Foaming Cleanser', 'CeraVe', 'cleanser', 'foaming_cleanser', 'A gentle, foaming cleanser that removes dirt and oil without stripping the skin', 
 '["ceramides", "hyaluronic_acid", "niacinamide"]', '["oily", "combination", "normal"]', '["acne", "oiliness", "sensitivity"]', 12.99, 236, true, true, true, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', 4.5, 1250),

('Vitamin C Serum', 'Skinceuticals', 'serum', 'vitamin_c_serum', 'High-potency vitamin C serum for brightening and anti-aging', 
 '["vitamin_c", "vitamin_e", "ferulic_acid"]', '["all"]', '["dark_spots", "dullness", "wrinkles", "sun_damage"]', 166.00, 30, true, true, true, 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400', 4.7, 890),

('Daily Moisturizer SPF 30', 'Neutrogena', 'moisturizer', 'sunscreen_moisturizer', 'Lightweight daily moisturizer with broad-spectrum SPF protection', 
 '["zinc_oxide", "hyaluronic_acid", "dimethicone"]', '["oily", "combination"]', '["sun_protection", "hydration"]', 15.99, 88, true, false, true, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400', 4.3, 2100),

('Retinol Night Cream', 'Olay', 'moisturizer', 'night_cream', 'Anti-aging night cream with retinol for smoother, firmer skin', 
 '["retinol", "niacinamide", "peptides"]', '["normal", "dry", "combination"]', '["wrinkles", "fine_lines", "dullness"]', 28.99, 48, true, true, true, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', 4.2, 1800),

('Salicylic Acid Cleanser', 'Paula''s Choice', 'cleanser', 'acne_cleanser', 'Gentle exfoliating cleanser with salicylic acid for acne-prone skin', 
 '["salicylic_acid", "chamomile", "green_tea"]', '["oily", "combination"]', '["acne", "blackheads", "large_pores"]', 22.00, 177, true, true, true, 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400', 4.6, 950),

('Hyaluronic Acid Serum', 'The Ordinary', 'serum', 'hydrating_serum', 'Intense hydrating serum with hyaluronic acid for plump, dewy skin', 
 '["hyaluronic_acid", "vitamin_b5"]', '["all"]', '["dryness", "dehydration", "fine_lines"]', 6.80, 30, true, true, true, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400', 4.4, 3200),

('Niacinamide 10% + Zinc 1%', 'The Ordinary', 'serum', 'treatment_serum', 'High-strength niacinamide serum for oil control and pore refinement', 
 '["niacinamide", "zinc"]', '["oily", "combination"]', '["oiliness", "large_pores", "acne", "redness"]', 5.90, 30, true, true, true, 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400', 4.3, 2800),

('Ceramide Moisturizer', 'Drunk Elephant', 'moisturizer', 'repair_moisturizer', 'Rich moisturizer with ceramides to repair and strengthen skin barrier', 
 '["ceramides", "cholesterol", "fatty_acids"]', '["dry", "sensitive", "normal"]', '["dryness", "sensitivity", "irritation"]', 68.00, 50, true, true, true, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', 4.5, 1200),

('Azelaic Acid Suspension 10%', 'The Ordinary', 'serum', 'treatment_serum', 'Gentle exfoliating treatment for acne and hyperpigmentation', 
 '["azelaic_acid", "dimethicone"]', '["all"]', '["acne", "redness", "dark_spots", "rosacea"]', 7.20, 30, true, true, true, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400', 4.1, 1500),

('Alpha Arbutin 2% + HA', 'The Ordinary', 'serum', 'brightening_serum', 'Gentle brightening serum to reduce dark spots and even skin tone', 
 '["alpha_arbutin", "hyaluronic_acid"]', '["all"]', '["dark_spots", "hyperpigmentation", "dullness"]', 8.90, 30, true, true, true, 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400', 4.2, 1900);

-- Insert product ingredients relationships
INSERT INTO product_ingredients (product_id, ingredient_id, concentration, position, is_active) VALUES
-- CeraVe Gentle Foaming Cleanser
((SELECT id FROM products WHERE name = 'Gentle Foaming Cleanser'), (SELECT id FROM ingredients WHERE name = 'ceramides'), 0.5, 1, true),
((SELECT id FROM products WHERE name = 'Gentle Foaming Cleanser'), (SELECT id FROM ingredients WHERE name = 'hyaluronic_acid'), 0.1, 2, true),
((SELECT id FROM products WHERE name = 'Gentle Foaming Cleanser'), (SELECT id FROM ingredients WHERE name = 'niacinamide'), 2.0, 3, true),

-- Skinceuticals Vitamin C Serum
((SELECT id FROM products WHERE name = 'Vitamin C Serum'), (SELECT id FROM ingredients WHERE name = 'vitamin_c'), 15.0, 1, true),

-- Neutrogena Daily Moisturizer SPF 30
((SELECT id FROM products WHERE name = 'Daily Moisturizer SPF 30'), (SELECT id FROM ingredients WHERE name = 'hyaluronic_acid'), 0.5, 1, true),

-- Olay Retinol Night Cream
((SELECT id FROM products WHERE name = 'Retinol Night Cream'), (SELECT id FROM ingredients WHERE name = 'retinol'), 0.1, 1, true),
((SELECT id FROM products WHERE name = 'Retinol Night Cream'), (SELECT id FROM ingredients WHERE name = 'niacinamide'), 5.0, 2, true),
((SELECT id FROM products WHERE name = 'Retinol Night Cream'), (SELECT id FROM ingredients WHERE name = 'peptides'), 2.0, 3, true),

-- Paula's Choice Salicylic Acid Cleanser
((SELECT id FROM products WHERE name = 'Salicylic Acid Cleanser'), (SELECT id FROM ingredients WHERE name = 'salicylic_acid'), 2.0, 1, true),

-- The Ordinary Hyaluronic Acid Serum
((SELECT id FROM products WHERE name = 'Hyaluronic Acid Serum'), (SELECT id FROM ingredients WHERE name = 'hyaluronic_acid'), 2.0, 1, true),

-- The Ordinary Niacinamide 10% + Zinc 1%
((SELECT id FROM products WHERE name = 'Niacinamide 10% + Zinc 1%'), (SELECT id FROM ingredients WHERE name = 'niacinamide'), 10.0, 1, true),

-- Drunk Elephant Ceramide Moisturizer
((SELECT id FROM products WHERE name = 'Ceramide Moisturizer'), (SELECT id FROM ingredients WHERE name = 'ceramides'), 3.0, 1, true),

-- The Ordinary Azelaic Acid Suspension 10%
((SELECT id FROM products WHERE name = 'Azelaic Acid Suspension 10%'), (SELECT id FROM ingredients WHERE name = 'azelaic_acid'), 10.0, 1, true),

-- The Ordinary Alpha Arbutin 2% + HA
((SELECT id FROM products WHERE name = 'Alpha Arbutin 2% + HA'), (SELECT id FROM ingredients WHERE name = 'alpha_arbutin'), 2.0, 1, true),
((SELECT id FROM products WHERE name = 'Alpha Arbutin 2% + HA'), (SELECT id FROM ingredients WHERE name = 'hyaluronic_acid'), 1.0, 2, true);

-- Insert sample users (for testing)
INSERT INTO users (id, email, name, age, skin_type, skin_tone, climate_zone, subscription_tier) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'test@example.com', 'Test User', 25, 'combination', 'medium', 'US-CA', 'free'),
('550e8400-e29b-41d4-a716-446655440002', 'premium@example.com', 'Premium User', 30, 'oily', 'fair', 'US-NY', 'premium'),
('550e8400-e29b-41d4-a716-446655440003', 'expert@example.com', 'Expert User', 35, 'sensitive', 'light', 'UK-LON', 'expert');

-- Insert user preferences
INSERT INTO user_preferences (user_id, budget_range, preferred_brands, avoided_ingredients, preferred_ingredients, skin_goals, routine_complexity) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'medium', '["CeraVe", "The Ordinary"]', '["fragrance", "alcohol"]', '["niacinamide", "hyaluronic_acid"]', '["clear_skin", "even_tone"]', 'moderate'),
('550e8400-e29b-41d4-a716-446655440002', 'high', '["Skinceuticals", "Drunk Elephant"]', '["sulfates"]', '["vitamin_c", "retinol"]', '["anti_aging", "bright_skin"]', 'advanced'),
('550e8400-e29b-41d4-a716-446655440003', 'low', '["CeraVe", "Neutrogena"]', '["fragrance", "alcohol", "sulfates"]', '["ceramides", "centella_asiatica"]', '["calm_skin", "reduce_redness"]', 'simple');

-- Insert user regional settings
INSERT INTO user_regional_settings (user_id, region_id, current_season, uv_exposure_level, pollution_exposure_level) VALUES
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM regional_data WHERE region_code = 'US-CA'), 'summer', 'high', 'moderate'),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM regional_data WHERE region_code = 'US-NY'), 'winter', 'low', 'high'),
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM regional_data WHERE region_code = 'UK-LON'), 'autumn', 'low', 'moderate');



