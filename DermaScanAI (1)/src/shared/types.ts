import z from "zod";

// User schemas
export const UserSchema = z.object({
  id: z.number().optional(),
  email: z.string().email(),
  name: z.string().optional(),
  age: z.number().optional(),
  skin_type: z.enum(['oily', 'dry', 'combination', 'sensitive', 'normal']).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

// Skin analysis schemas
export const SkinAnalysisSchema = z.object({
  id: z.number().optional(),
  user_id: z.number().optional(),
  image_url: z.string(),
  skin_concerns: z.string(),
  ai_analysis: z.string().optional(),
  confidence_score: z.number().min(0).max(1).optional(),
  recommendations: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type SkinAnalysis = z.infer<typeof SkinAnalysisSchema>;

// Product schemas
export const ProductSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  brand: z.string().optional(),
  category: z.string(),
  ingredients: z.string().optional(),
  skin_types: z.string().optional(),
  concerns_addressed: z.string().optional(),
  price: z.number().optional(),
  rating: z.number().optional(),
  image_url: z.string().optional(),
  product_url: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Product = z.infer<typeof ProductSchema>;

// Recommendation schemas
export const RecommendationSchema = z.object({
  id: z.number().optional(),
  analysis_id: z.number(),
  product_id: z.number(),
  reason: z.string().optional(),
  priority: z.number().default(1),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Recommendation = z.infer<typeof RecommendationSchema>;

// API request/response schemas
export const CreateAnalysisRequestSchema = z.object({
  image: z.string(), // base64 encoded image
  skin_concerns: z.string(),
  user_info: UserSchema.pick({ email: true, name: true, age: true, skin_type: true }).optional(),
});

export type CreateAnalysisRequest = z.infer<typeof CreateAnalysisRequestSchema>;

export const AnalysisResponseSchema = z.object({
  id: z.number(),
  analysis: z.string(),
  confidence_score: z.number(),
  recommendations: z.array(z.object({
    product: ProductSchema,
    reason: z.string(),
    priority: z.number(),
  })),
  image_url: z.string(),
});

export type AnalysisResponse = z.infer<typeof AnalysisResponseSchema>;

// Skin concern types
export const SKIN_CONCERNS = [
  'acne',
  'dryness',
  'oiliness',
  'dark_spots',
  'wrinkles',
  'redness',
  'blackheads',
  'large_pores',
  'uneven_texture',
  'sensitivity',
  'dullness',
  'hyperpigmentation',
] as const;

export type SkinConcern = typeof SKIN_CONCERNS[number];

// Skin types
export const SKIN_TYPES = [
  'normal',
  'oily',
  'dry',
  'combination',
  'sensitive',
] as const;

export type SkinType = typeof SKIN_TYPES[number];
