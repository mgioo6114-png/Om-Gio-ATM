import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// AI Video & Audio Scene Analysis Endpoint
app.post('/api/analyze-video', async (req, res) => {
  try {
    const { videoMetadata, recreationMode, identityLockStrength, characterInfo, dialogueContext } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        success: true,
        source: 'local-engine',
        message: 'Processed via Om Gio Studio Local Engine (Gemini API key not configured)',
      });
    }

    const systemPrompt = `You are the lead AI Video Scene Recreation & Prompt Engineer for "OM GIO AI STUDIO".
Tagline: "Analyze. Recreate. Replace with Om Gio."

PRIMARY OBJECTIVE:
Given video metadata, duration, detected scenes and audio dialogue segments, analyze each scene thoroughly and generate ONE high-quality, copy-paste ready Google Flow / Veo prompt per scene with OM GIO as the primary character.

OM GIO CHARACTER SPECIFICATION:
- Name: Om Gio
- Age: 28 years old
- Gender: Male
- Nationality/Appearance: Indonesian
- Body Type: Slim / fit
- Face Shape: Oval
- Hair: Short black hair, neatly styled
- Eyewear: Rectangular eyeglasses
- Facial Hair: Thin mustache and subtle facial hair
- Skin Tone: Natural Indonesian skin tone
- Style: Photorealistic realistic human

IDENTITY LOCK: ON (${identityLockStrength || '95%'})
Maintain exact identity across all scenes: facial structure, face proportions, eyes, eyebrows, nose, lips, jawline, ears, hairstyle, glasses, mustache, facial hair, skin tone, body proportions, apparent age.

RECREATION MODE: ${recreationMode || 'EXACT RECREATION'}

RULES:
1. NEVER SUMMARIZE DIALOGUE. Spoken dialogue must be exact, complete, and unsummarized.
2. Every scene prompt must follow the exact specified Google Flow format.
3. Every scene prompt must include all 25 mandatory sections:
   CHARACTER REFERENCE, CHARACTER, IDENTITY LOCK, SCENE, ACTION, BODY MOVEMENT, FACIAL EXPRESSION, EYE DIRECTION, CAMERA, CAMERA MOVEMENT, COMPOSITION, ENVIRONMENT, BACKGROUND, LIGHTING, WARDROBE, PROPS, MOTION, DIALOGUE / SPOKEN CONTENT, LANGUAGE, DIALOGUE TIMING, VOICE DELIVERY, LIP SYNC, AUDIO, CONTINUITY, VISUAL STYLE, NEGATIVE INSTRUCTIONS, DURATION, ASPECT RATIO.

Return valid JSON with an array of analyzed scenes and transcripts.`;

    const userPrompt = `Video Metadata:
${JSON.stringify(videoMetadata, null, 2)}

Dialogue / Audio cues:
${JSON.stringify(dialogueContext || [], null, 2)}

Character override:
${JSON.stringify(characterInfo || {}, null, 2)}

Please provide a detailed scene-by-scene analysis with exact timestamps, complete spoken dialogue, visual analysis, and complete Google Flow prompt for each scene.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    let parsedData = null;
    try {
      parsedData = JSON.parse(text || '{}');
    } catch {
      parsedData = { rawResponse: text };
    }

    return res.json({
      success: true,
      source: 'gemini-3.8-flash',
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Gemini analysis error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error executing AI analysis',
    });
  }
});

// Single Scene Prompt Regeneration Endpoint
app.post('/api/regenerate-scene-prompt', async (req, res) => {
  try {
    const { sceneData, recreationMode, characterConfig } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        success: true,
        source: 'local-engine',
        message: 'Regenerated using Om Gio Studio Template Engine',
      });
    }

    const promptText = `Generate a single Google Flow / Veo scene prompt for Scene ${sceneData.sceneNumber || 1} with Om Gio as the character in ${recreationMode || 'EXACT RECREATION'} mode.
Scene details: ${JSON.stringify(sceneData)}
Ensure complete dialogue preservation and exact Google Flow prompt formatting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
    });

    return res.json({
      success: true,
      source: 'gemini-3.8-flash',
      prompt: response.text,
    });
  } catch (error: any) {
    console.error('Prompt regeneration error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error regenerating prompt',
    });
  }
});

// Setup Vite middleware in development or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`OM GIO AI STUDIO server running on http://localhost:${port}`);
  });
}

startServer();
