import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator';
import { cors } from 'hono/cors';
import { getCookie, setCookie } from 'hono/cookie';
import OpenAI from 'openai';
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { 
  CreateAnalysisRequestSchema,
  AnalysisResponse,
  SKIN_CONCERNS,
  SKIN_TYPES 
} from '../shared/types';

const app = new Hono<{ Bindings: Env }>();

// Enable CORS
app.use('*', cors());

// Initialize OpenAI client
const getOpenAI = (env: Env) => new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});



// Analyze skin image with OpenAI
const analyzeSkinImage = async (openai: OpenAI, imageBase64: string, skinConcerns: string) => {
  const prompt = `You are an expert dermatologist analyzing a skin image. 

User's reported concerns: ${skinConcerns}

Please analyze this image and provide:
1. Detailed assessment of visible skin conditions
2. Identification of skin type (oily, dry, combination, sensitive, normal)
3. Specific concerns observed (acne, dryness, oiliness, dark spots, wrinkles, redness, etc.)
4. Severity assessment (mild, moderate, severe)
5. Recommended skincare routine and ingredients
6. Confidence level in your assessment (0-100%)

Format your response as a detailed analysis that would help recommend appropriate skincare products.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || 'Unable to analyze image';
  } catch (error) {
    console.error('OpenAI analysis error:', error);
    throw new Error('Failed to analyze image');
  }
};

// Get product recommendations based on analysis
const getProductRecommendations = async () => {
  // For now, return sample products - in a real app, this would query external APIs
  const sampleProducts = [
    {
      id: 1,
      name: "Gentle Foaming Cleanser",
      brand: "CeraVe",
      category: "cleanser",
      ingredients: "ceramides, hyaluronic acid, niacinamide",
      skin_types: "all",
      concerns_addressed: "dryness, sensitivity",
      price: 12.99,
      rating: 4.5,
      image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
      product_url: "https://example.com/product/1"
    },
    {
      id: 2,
      name: "Vitamin C Serum",
      brand: "Skinceuticals",
      category: "serum",
      ingredients: "l-ascorbic acid, vitamin e, ferulic acid",
      skin_types: "all",
      concerns_addressed: "dark spots, dullness, aging",
      price: 166.00,
      rating: 4.7,
      image_url: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400",
      product_url: "https://example.com/product/2"
    },
    {
      id: 3,
      name: "Daily Moisturizer SPF 30",
      brand: "Neutrogena",
      category: "moisturizer",
      ingredients: "zinc oxide, hyaluronic acid, dimethicone",
      skin_types: "oily, combination",
      concerns_addressed: "sun protection, hydration",
      price: 15.99,
      rating: 4.3,
      image_url: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400",
      product_url: "https://example.com/product/3"
    }
  ];

  return sampleProducts.map((product, index) => ({
    product,
    reason: `Recommended based on your skin analysis. This ${product.category} addresses your specific concerns.`,
    priority: index + 1
  }));
};

// Upload and store image (simplified - in production, use cloud storage)
const storeImage = (): string => {
  // In a real app, upload to cloud storage and return URL
  // For now, return a placeholder
  return `https://images.unsplash.com/photo-1559156336-c623acd14a96?w=400&h=400&fit=crop`;
};

// API Routes

// Health check
app.get('/', (c) => {
  return c.json({ message: 'DermaScanAI API is running' });
});

// Create new skin analysis
app.post('/api/analyze', zValidator('json', CreateAnalysisRequestSchema), async (c) => {
  try {
    const { image, skin_concerns, user_info } = c.req.valid('json');
    const openai = getOpenAI(c.env);

    // Analyze image with OpenAI
    const aiAnalysis = await analyzeSkinImage(openai, image, skin_concerns);
    
    // Store image (simplified)
    const imageUrl = storeImage();
    
    // Extract confidence score from analysis (simplified)
    const confidenceScore = Math.random() * 0.3 + 0.7; // 70-100% for demo
    
    // Get or create user
    let userId = null;
    if (user_info?.email) {
      const existingUser = await c.env.DB.prepare(
        'SELECT id FROM users WHERE email = ?'
      ).bind(user_info.email).first();

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const userResult = await c.env.DB.prepare(
          'INSERT INTO users (email, name, age, skin_type) VALUES (?, ?, ?, ?) RETURNING id'
        ).bind(
          user_info.email,
          user_info.name || null,
          user_info.age || null,
          user_info.skin_type || null
        ).first();
        userId = userResult?.id;
      }
    }

    // Store analysis
    const analysisResult = await c.env.DB.prepare(`
      INSERT INTO skin_analyses (user_id, image_url, skin_concerns, ai_analysis, confidence_score)
      VALUES (?, ?, ?, ?, ?)
      RETURNING id
    `).bind(userId, imageUrl, skin_concerns, aiAnalysis, confidenceScore).first();

    const analysisId = analysisResult?.id;

    if (!analysisId) {
      throw new Error('Failed to create analysis');
    }

    // Get product recommendations
    const recommendations = await getProductRecommendations();

    // Store recommendations
    for (const rec of recommendations) {
      await c.env.DB.prepare(`
        INSERT INTO recommendations (analysis_id, product_id, reason, priority)
        VALUES (?, ?, ?, ?)
      `).bind(analysisId, rec.product.id, rec.reason, rec.priority).run();
    }

    const response: AnalysisResponse = {
      id: analysisId as number,
      analysis: aiAnalysis,
      confidence_score: confidenceScore,
      recommendations,
      image_url: imageUrl,
    };

    return c.json(response);
  } catch (error) {
    console.error('Analysis error:', error);
    return c.json({ error: 'Failed to analyze image' }, 500);
  }
});

// Get analysis by ID
app.get('/api/analysis/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const analysis = await c.env.DB.prepare(
      'SELECT * FROM skin_analyses WHERE id = ?'
    ).bind(id).first();

    if (!analysis) {
      return c.json({ error: 'Analysis not found' }, 404);
    }

    // Get recommendations for this analysis
    const recommendations = await c.env.DB.prepare(`
      SELECT r.*, p.* FROM recommendations r
      JOIN products p ON r.product_id = p.id
      WHERE r.analysis_id = ?
      ORDER BY r.priority
    `).bind(id).all();

    const response = {
      ...analysis,
      recommendations: recommendations.results || []
    };

    return c.json(response);
  } catch (error) {
    console.error('Get analysis error:', error);
    return c.json({ error: 'Failed to get analysis' }, 500);
  }
});

// Get user's analysis history
app.get('/api/user/:email/analyses', async (c) => {
  try {
    const email = c.req.param('email');
    
    const analyses = await c.env.DB.prepare(`
      SELECT sa.* FROM skin_analyses sa
      JOIN users u ON sa.user_id = u.id
      WHERE u.email = ?
      ORDER BY sa.created_at DESC
    `).bind(email).all();

    return c.json(analyses.results || []);
  } catch (error) {
    console.error('Get user analyses error:', error);
    return c.json({ error: 'Failed to get user analyses' }, 500);
  }
});

// Get skin concerns and types
app.get('/api/skin-data', (c) => {
  return c.json({
    concerns: SKIN_CONCERNS,
    types: SKIN_TYPES
  });
});

// Authentication routes

// Obtain redirect URL from the Mocha Users Service
app.get('/api/oauth/google/redirect_url', async (c) => {
  try {
    const redirectUrl = await getOAuthRedirectUrl('google', {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });

    return c.json({ redirectUrl }, 200);
  } catch (error) {
    console.error('OAuth redirect URL error:', error);
    return c.json({ error: 'Failed to get redirect URL' }, 500);
  }
});

// Exchange the code for a session token
app.post("/api/sessions", async (c) => {
  try {
    const body = await c.req.json();

    if (!body.code) {
      return c.json({ error: "No authorization code provided" }, 400);
    }

    const sessionToken = await exchangeCodeForSessionToken(body.code, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });

    setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      path: "/",
      sameSite: "none",
      secure: true,
      maxAge: 60 * 24 * 60 * 60, // 60 days
    });

    return c.json({ success: true }, 200);
  } catch (error) {
    console.error('Session exchange error:', error);
    return c.json({ error: 'Failed to exchange code for session' }, 500);
  }
});

// Get the current user object for the frontend
app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

// Logout endpoint
app.get('/api/logout', async (c) => {
  try {
    const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

    if (typeof sessionToken === 'string') {
      await deleteSession(sessionToken, {
        apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
        apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
      });
    }

    // Delete cookie by setting max age to 0
    setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
      maxAge: 0,
    });

    return c.json({ success: true }, 200);
  } catch (error) {
    console.error('Logout error:', error);
    return c.json({ error: 'Failed to logout' }, 500);
  }
});

export default app;
