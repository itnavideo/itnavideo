import { readFileSync } from 'fs';

async function listGeminiModels() {
  let apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    for (const file of ['.env.local', '.env.production', '.env']) {
      try {
        const envText = readFileSync(file, 'utf8');
        const match = envText.match(/(?:GEMINI_API_KEY|GOOGLE_AI_STUDIO_API_KEY|GOOGLE_API_KEY)=([^\r\n]+)/);
        if (match) {
          apiKey = match[1].trim().replace(/^["']|["']$/g, '');
          break;
        }
      } catch {}
    }
  }

  console.log('Listing available models for API key starting:', apiKey.slice(0, 8));

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();

  console.log('HTTP Status:', res.status);
  if (data.models) {
    const imagenModels = data.models.filter(m => m.name.includes('imagen') || m.name.includes('image'));
    console.log('Image-capable models found:');
    console.log(imagenModels);
  } else {
    console.log('Error/Response:', data);
  }
}

listGeminiModels();
