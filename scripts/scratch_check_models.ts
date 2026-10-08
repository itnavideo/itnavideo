import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

async function check() {
  const testModels = [
    'gemini-3.6-flash',
    'gemini-3.5-flash-lite',
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-1.5-flash',
  ];

  for (const m of testModels) {
    try {
      const start = Date.now();
      const res = await ai.models.generateContent({
        model: m,
        contents: 'Respond with OK',
      });
      const elapsed = Date.now() - start;
      console.log(`[SUCCESS] Model '${m}' responded in ${elapsed}ms: "${res.text?.trim()}"`);
    } catch (err: any) {
      console.log(`[FAILED] Model '${m}': status=${err?.status || err?.statusCode || 'N/A'} message=${err?.message || err}`);
    }
  }
}

check().catch(console.error);
