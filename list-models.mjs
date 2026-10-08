import { config } from 'dotenv';
config({ path: '.env.local' });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_STUDIO_KEY;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await res.json();
  console.log('Available Models on Google AI Studio Key:');
  const imageModels = (data.models || []).filter(m => m.name.includes('imagen') || m.name.includes('image'));
  console.log(imageModels);
}

listModels();
