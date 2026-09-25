import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, GenerateVideosOperation, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Body parsing with generous limits for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Gemini client strictly on server-side with required User-Agent
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to sanitize base64
function extractBase64Data(dataUrlOrBase64: string): { base64: string; mimeType: string } {
  const match = dataUrlOrBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (match) {
    return { mimeType: match[1], base64: match[2] };
  }
  return { mimeType: 'image/png', base64: dataUrlOrBase64 };
}

// 1. Logo Generation using gemini-3-pro-image-preview with image size affordance (1K, 2K, 4K)
app.post('/api/generate-logo', async (req, res) => {
  try {
    const {
      companyName,
      tagline,
      industry,
      description,
      style = 'modern-minimalist',
      colorPalette = 'vibrant-modern',
      customColors,
      imageSize = '1K',
      symbolType = 'icon-and-text',
      additionalPrompt = '',
    } = req.body;

    if (!companyName || !description) {
      return res.status(400).json({ error: 'Company name and description are required.' });
    }

    // Validate size: 1K, 2K, 4K
    const validSizes = ['1K', '2K', '4K'];
    const chosenSize = validSizes.includes(imageSize) ? imageSize : '1K';

    // Style guidance descriptions
    const styleDescriptions: Record<string, string> = {
      'modern-minimalist': 'Clean modern minimalist vector logo, bold geometric shapes, elegant negative space, timeless Swiss design aesthetic, perfect balance',
      'tech-futuristic': 'High-tech cyberpunk aesthetic, sleek cyber contours, subtle neon luminescent accents, modern fintech/AI tech company branding',
      'luxury-prestige': 'Opulent luxury emblem, gold leaf or platinum accents, sophisticated serif accents or sleek minimal monogram, haute couture aesthetic',
      'playful-mascot': 'Friendly charismatic brand mascot character, vibrant vector illustration, memorable silhouette, expressive and modern',
      'vintage-heritage': 'Artisanal craft badge emblem, heritage typography, vintage linework, premium crafted stamp aesthetic',
      'abstract-geometric': 'Pure abstract mathematical geometry, sacred geometry, intersecting gradient ribbons, optical harmony',
      'organic-botanical': 'Natural organic hand-drawn botanical lines, earth tones, eco-conscious aesthetic, soft flowing curves',
      'bold-typography': 'Custom bespoke typographic logotype, distinctive letterforms, stylized font ligature, iconic wordmark',
    };

    const styleDetail = styleDescriptions[style] || style;

    // Build comprehensive, high-quality prompt for gemini-3-pro-image-preview
    const logoPrompt = [
      `Professional corporate logo design for "${companyName}".`,
      tagline ? `Brand slogan/tagline: "${tagline}".` : '',
      `Industry: ${industry || 'General'}.`,
      `Core business description & concept: ${description}.`,
      `Logo Type: ${symbolType}.`,
      `Design Style: ${styleDetail}.`,
      `Color Palette: ${colorPalette} ${customColors ? `(Specified accent colors: ${customColors})` : ''}.`,
      additionalPrompt ? `Additional creative direction: ${additionalPrompt}.` : '',
      'Requirements: High-end graphic designer output, centered on a clean, solid or subtle neutral backdrop, crisp vector lines, professional branding suite standard, iconic mark easily recognizable at both favicon and billboard scale, balanced composition, zero blur, no photographic backgrounds, no mockups on paper or walls—just the pristine logo art asset itself.',
    ]
      .filter(Boolean)
      .join(' ');

    console.log(`Generating logo for "${companyName}" with size ${chosenSize}...`);

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: logoPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: '1:1',
          imageSize: chosenSize as '1K' | '2K' | '4K',
        },
      },
    });

    let imageUrl = '';
    let textFeedback = '';

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
      } else if (part.text) {
        textFeedback += part.text;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        error: 'The image generation model did not return image data. Please try rephrasing your description.',
        details: textFeedback,
      });
    }

    res.json({
      success: true,
      image: imageUrl,
      promptUsed: logoPrompt,
      size: chosenSize,
      feedback: textFeedback,
    });
  } catch (error: any) {
    console.error('Error generating logo:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate logo. Please check your request and try again.',
    });
  }
});

// 2. Creative Concept Suggestion using gemini-3.8-flash
app.post('/api/suggest-concepts', async (req, res) => {
  try {
    const { companyName, industry, description } = req.body;
    if (!companyName) {
      return res.status(400).json({ error: 'Company name is required.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are a world-class creative brand identity director.
For the company "${companyName}" in the "${industry || 'general'}" industry with the description: "${description || 'innovative business'}", propose 3 distinct creative logo concepts.
Return JSON with the following structure:
{
  "concepts": [
    {
      "title": "Short concept name",
      "tagline": "Catchy 3-5 word slogan",
      "symbolMetaphor": "What the visual symbol represents",
      "recommendedStyle": "modern-minimalist | tech-futuristic | luxury-prestige | playful-mascot | vintage-heritage | abstract-geometric | organic-botanical | bold-typography",
      "colorTheme": "Recommended color scheme",
      "promptAddition": "Specific descriptive sentence to include in prompt",
      "animationIdea": "How this logo would dramatically animate in video (e.g., light sweep, particle assembly, 3D rotation)"
    }
  ]
}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            concepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  tagline: { type: Type.STRING },
                  symbolMetaphor: { type: Type.STRING },
                  recommendedStyle: { type: Type.STRING },
                  colorTheme: { type: Type.STRING },
                  promptAddition: { type: Type.STRING },
                  animationIdea: { type: Type.STRING },
                },
                required: [
                  'title',
                  'tagline',
                  'symbolMetaphor',
                  'recommendedStyle',
                  'colorTheme',
                  'promptAddition',
                  'animationIdea',
                ],
              },
            },
          },
          required: ['concepts'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error suggesting concepts:', error);
    res.status(500).json({ error: error?.message || 'Failed to suggest concepts.' });
  }
});

// 3. Veo Video Generation: Step 1 - Start Video Generation
// Model: veo-3.1-fast-generate-preview, aspect ratios: 16:9 or 9:16
app.post('/api/generate-video', async (req, res) => {
  try {
    const { imageBase64, mimeType, prompt, aspectRatio = '16:9' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image is required to animate into video.' });
    }

    const { base64, mimeType: detectedMime } = extractBase64Data(imageBase64);
    const finalMime = mimeType || detectedMime;

    // Validate aspect ratio (must be 16:9 or 9:16 per requirement)
    const validRatio = aspectRatio === '9:16' ? '9:16' : '16:9';

    const defaultPrompt =
      'High-end 3D motion graphics animation of this logo. Cinematic volumetric lighting sweep, glossy reflections traversing the edges, elegant dynamic zoom with subtle particle ambiance, pristine 60fps corporate brand reveal, seamless smooth finish.';

    console.log(
      `Starting Veo video generation (model: veo-3.1-fast-generate-preview, ratio: ${validRatio})...`
    );

    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || defaultPrompt,
      image: {
        imageBytes: base64,
        mimeType: finalMime,
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: validRatio as '16:9' | '9:16',
      },
    });

    console.log(`Video operation started with name: ${operation.name}`);
    res.json({ operationName: operation.name });
  } catch (error: any) {
    console.error('Error starting video generation:', error);
    res.status(500).json({
      error: error?.message || 'Failed to start video animation generation.',
    });
  }
});

// 4. Veo Video Generation: Step 2 - Poll Video Operation Status
app.post('/api/video-status', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });

    res.json({
      done: updated.done,
      error: updated.error || null,
    });
  } catch (error: any) {
    console.error('Error polling video operation:', error);
    res.status(500).json({ error: error?.message || 'Failed to poll video status.' });
  }
});

// 5. Veo Video Generation: Step 3 - Stream / Download Video
app.post('/api/video-download', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });

    if (!updated.done) {
      return res.status(400).json({ error: 'Video is still being rendered.' });
    }

    if (updated.error) {
      return res.status(500).json({ error: updated.error });
    }

    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) {
      return res.status(404).json({ error: 'Video URI not found in operation response.' });
    }

    console.log('Fetching generated video from Veo storage...');
    const videoRes = await fetch(uri, {
      headers: {
        'x-goog-api-key': apiKey,
      },
    });

    if (!videoRes.ok) {
      return res
        .status(videoRes.status)
        .json({ error: `Failed to fetch video stream: ${videoRes.statusText}` });
    }

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'inline; filename="logo-animation.mp4"');

    // Pipe the stream to client
    const body = videoRes.body;
    if (body) {
      // @ts-ignore
      await body.pipeTo(
        new WritableStream({
          write(chunk) {
            res.write(chunk);
          },
          close() {
            res.end();
          },
          abort(err) {
            console.error('Stream aborted:', err);
            res.destroy();
          },
        })
      );
    } else {
      res.status(500).json({ error: 'Empty video stream body' });
    }
  } catch (error: any) {
    console.error('Error downloading video:', error);
    res.status(500).json({ error: error?.message || 'Failed to download video.' });
  }
});

// Frontend Vite Middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`LogoCraft AI server running on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
