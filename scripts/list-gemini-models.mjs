import path from 'node:path';
import {GoogleGenAI} from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({path: path.resolve(process.cwd(), '.env.local')});

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
const ai = new GoogleGenAI({apiKey});

async function listModels() {
  try {
    const list = await ai.models.list();
    console.log('Available models:');
    for await (const m of list) {
      if (m.name.includes('gemini')) {
        console.log(m.name, m.supportedActions || m.capabilities);
      }
    }
  } catch (err) {
    console.error('List models failed:', err);
  }
}

listModels();
