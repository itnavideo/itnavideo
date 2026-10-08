import path from 'node:path';
import fs from 'node:fs';
import {GoogleGenAI} from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({path: path.resolve(process.cwd(), '.env.local')});

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
const ai = new GoogleGenAI({apiKey});

const testModels = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.1-pro-preview',
];

async function testOne() {
  const testFile = path.resolve(process.cwd(), 'public/assets/reusable/images/realistic/1790599797924.png');
  const fileBuffer = fs.readFileSync(testFile);
  const base64Data = fileBuffer.toString('base64');

  for (const model of testModels) {
    try {
      console.log(`Testing model: ${model}...`);
      const res = await ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [
              {text: 'Describe what is in this image in one sentence.'},
              {
                inlineData: {
                  mimeType: 'image/png',
                  data: base64Data,
                },
              },
            ],
          },
        ],
      });
      console.log(`=> SUCCESS with ${model}:`);
      console.log(res.text);
      return model;
    } catch (e) {
      console.log(`=> Failed with ${model}: ${e.message}`);
    }
  }
}

testOne();
