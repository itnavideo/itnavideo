import path from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { extractKeyframes, cleanupFrames } from '../services/vision/frameExtractor';

const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testGeminiFaceTracking() {
  console.log('=== Gemini Vision Face Detection Test ===');
  const videoPath = path.resolve(process.cwd(), 'docs/references/long-form/videoplayback (1).mp4');
  
  // Extract 5 frames at 2s intervals
  const extraction = await extractKeyframes(videoPath, 2.0, 5);
  console.log('Extracted frames count:', extraction.frames.length);

  const inlineParts: any[] = [];
  for (const frame of extraction.frames) {
    const buffer = await fs.promises.readFile(frame.imagePath);
    inlineParts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: buffer.toString('base64'),
      },
    });
  }

  const prompt = `Analyze these ${extraction.frames.length} sequential video keyframes taken at timestamps: ${extraction.frames.map((f) => f.timestampSeconds + 's').join(', ')}.
For each frame image in order, detect the primary talking-head speaker's face position.
Return normalized coordinates between 0.00 and 1.00:
- xCenter: horizontal center of speaker's face (0.00 = left edge, 0.50 = center, 1.00 = right edge)
- yCenter: vertical center of speaker's face (0.00 = top edge, 0.38 = standard eye line, 1.00 = bottom edge)
- confidence: confidence score 0.00 to 1.00

Return a JSON array where each object has: { timeSeconds: number, xCenter: number, yCenter: number, confidence: number }.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [...inlineParts, prompt],
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            timeSeconds: { type: Type.NUMBER },
            xCenter: { type: Type.NUMBER },
            yCenter: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER },
          },
          required: ['timeSeconds', 'xCenter', 'yCenter', 'confidence'],
        },
      },
    },
  });

  console.log('Gemini Vision Response:', response.text);
  await cleanupFrames(extraction.tempDir);
}

testGeminiFaceTracking().catch(console.error);
