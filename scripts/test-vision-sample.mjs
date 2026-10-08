import path from 'node:path';
import fs from 'node:fs';
import {GoogleGenAI} from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({path: path.resolve(process.cwd(), '.env.local')});

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

if (!apiKey) {
  console.error('No Gemini API key found in .env.local');
  process.exit(1);
}

const ai = new GoogleGenAI({apiKey});

const MODELS = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.5-pro'];

async function testVision() {
  const testFile = path.resolve(process.cwd(), 'public/assets/reusable/images/realistic/1790599797924.png');
  if (!fs.existsSync(testFile)) {
    console.error('Test file not found:', testFile);
    return;
  }

  const fileBuffer = fs.readFileSync(testFile);
  const base64Data = fileBuffer.toString('base64');

  const prompt = `You are an expert AI computer vision analyst for professional video editing and semantic script matching.
Analyze the ACTUAL VISUAL CONTENT visible in this image in thorough detail.

STRICT INSTRUCTIONS:
1. Base your analysis 100% on what is actually visible.
2. Generate a descriptive, specific snake_case filename (e.g. "software_engineer_debugging_code_monitors.png", "modern_skyscrapers_foggy_sunset_skyline.png"). NEVER use generic words or numbers.
3. Write a detailed 2-3 sentence description of everything in the image: subjects, actions, foreground/background setting, lighting, mood, color palette, and visual context.
4. Extract 15 to 25 highly specific keywords and tags.
5. Identify visual category, detected objects, and mood.

Return ONLY a strict JSON object with this format:
{
  "descriptiveFilename": "meaningful_snake_case_name.png",
  "title": "Title Case Clean Name",
  "detailedDescription": "A comprehensive description of what is actually visible in the scene...",
  "keywords": ["tag1", "tag2", "tag3"],
  "visualCategory": "finance_business | tech_ai | workspace_office | nature_travel | lifestyle_people | charts_data | architecture_urban | education_science | abstract_3d",
  "detectedObjects": ["object1", "object2"],
  "mood": "cinematic | dramatic | analytical | corporate | calm | inspiring | energetic"
}`;

  for (const model of MODELS) {
    try {
      console.log(`Trying model: ${model}...`);
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [
              {text: prompt},
              {
                inlineData: {
                  mimeType: 'image/png',
                  data: base64Data,
                },
              },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      console.log(`\nSUCCESS with model: ${model}`);
      console.log('Gemini Vision Test Response:');
      console.log(response.text);
      return;
    } catch (err) {
      console.warn(`Model ${model} failed:`, err.message || err);
    }
  }
}

testVision().catch((err) => console.error('Error:', err));
