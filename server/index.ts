import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI, Modality } from '@google/genai';

// USE API_KEY as per guidelines
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const app: express.Application = express();
app.use(cors());
// Increased payload limit for base64 image data
// FIX: To resolve a TypeScript 'No overload matches this call' error, the middleware is now used without an explicit path.
app.use(express.json({ limit: '10mb' }));

// Simplified dummy endpoint as per user's provided code.
app.post('/api/validate-email', async (req, res) => {
  const { email } = req.body || {};
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, reason: 'Invalid syntax' });
  }
  // This is a simplified check. The original complex validation is removed.
  return res.json({ ok: true });
});

app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, numberOfImages = 1, aspectRatio = '1:1', artStyle = 'None', negativePrompt = '' } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    let finalPrompt = String(prompt);
    if (artStyle && artStyle !== 'None') finalPrompt += `, in the style of ${artStyle}`;
    if (negativePrompt) finalPrompt += `. Avoid the following: ${negativePrompt}.`;

    const r = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: finalPrompt,
      config: { numberOfImages, outputMimeType: 'image/png', aspectRatio }
    });

    const images = (r.generatedImages || [])
      .map(g => g?.image?.imageBytes)
      .filter(Boolean)
      .map(b => `data:image/png;base64,${b as string}`);

    if (!images.length) return res.status(502).json({ error: 'No images generated' });
    res.json({ images });
  } catch (e: any) {
    console.error("Image generation failed:", e);
    res.status(500).json({ error: e?.message || 'Image generation failed' });
  }
});

app.post('/api/edit-image', async (req, res) => {
  try {
    const { prompt, base64ImageData, mimeType = 'image/png', maskBase64 } = req.body || {};
    if (!prompt || !base64ImageData) return res.status(400).json({ error: 'prompt and base64ImageData are required' });

    const parts: any[] = [
      { inlineData: { data: base64ImageData, mimeType } },
      ...(maskBase64 ? [{ inlineData: { data: maskBase64, mimeType: 'image/png' } }] : []),
      { text: prompt }
    ];

    const r = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts },
      config: { responseModalities: [Modality.IMAGE, Modality.TEXT] }
    });

    const media = r?.candidates?.[0]?.content?.parts?.find((p: any) => p?.inlineData?.data && p?.inlineData?.mimeType);
    if (!media) return res.status(502).json({ error: 'No image returned' });
    res.json({ image: `data:${media.inlineData.mimeType};base64,${media.inlineData.data}` });
  } catch (e: any) {
    console.error("Image edit failed:", e);
    res.status(500).json({ error: e?.message || 'Image edit failed' });
  }
});

// This is a long-running endpoint. It will hold the connection open until the video is generated.
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    let op = await ai.models.generateVideos({ model: 'veo-2.0-generate-001', prompt, config: { numberOfVideos: 1 } });
    
    // Poll for the result on the server side.
    let count = 0;
    const maxPolls = 120; // 120 * 10s = 20 minutes timeout
    while (!op.done && count < maxPolls) {
      await new Promise(r => setTimeout(r, 10000));
      op = await ai.operations.getVideosOperation({ operation: op });
      count++;
    }
    
    const link = op.response?.generatedVideos?.[0]?.video?.uri;
    if (!link) {
      const errorMessage = count >= maxPolls ? 'Video generation timed out.' : 'No download link returned from the API.';
      return res.status(502).json({ error: errorMessage });
    }
    
    // SECURITY FIX: Instead of sending the raw GCS link, send a relative URL to a proxy endpoint.
    res.json({ videoUrl: `/api/get-video?gcsUri=${encodeURIComponent(link)}` });
  } catch (e: any) {
    console.error("Video generation failed:", e);
    res.status(500).json({ error: e?.message || 'Video generation failed' });
  }
});

// SECURITY FIX: Add a proxy endpoint to stream the video without exposing the API key to the client.
app.get('/api/get-video', async (req, res) => {
    try {
        const { gcsUri } = req.query as { gcsUri: string };
        if (!gcsUri) {
            return res.status(400).json({ error: 'Video URI is required.' });
        }
        
        const videoApiResponse = await fetch(`${gcsUri}&key=${process.env.API_KEY}`);
        if (!videoApiResponse.ok || !videoApiResponse.body) {
            throw new Error(`Failed to download video file. Status: ${videoApiResponse.status}`);
        }
        
        res.setHeader('Content-Type', 'video/mp4');
        const reader = videoApiResponse.body.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
        }
        res.end();

    } catch(error: any) {
        console.error("Failed to stream video:", error);
        res.status(500).json({ error: error?.message || 'Failed to stream video.' });
    }
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`API server listening on :${port}`));