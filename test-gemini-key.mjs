import { config } from 'dotenv';

config({ path: '.env.local' });

async function testImagenGenerateImages() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_STUDIO_KEY;
  console.log('Testing generateImages with GEMINI_API_KEY:', apiKey ? apiKey.slice(0, 10) + '...' : 'NOT FOUND');

  const models = [
    'imagen-3.0-generate-002',
    'imagen-3.0-generate-001',
    'imagen-3.0-fast-generate-001',
  ];

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateImages?key=${apiKey}`;
    console.log(`\nTesting ${model} with :generateImages...`);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Cinematic photo of a modern high tech audio studio, 8k resolution',
        config: {
          numberOfImages: 1,
          aspectRatio: '16:9',
          outputMimeType: 'image/jpeg',
        },
      }),
    });

    console.log(`HTTP Status Code: ${res.status} ${res.statusText}`);
    const text = await res.text();
    if (res.ok) {
      const data = JSON.parse(text);
      const b64 = data?.generatedImages?.[0]?.image?.imageBytes;
      console.log(`🎉 SUCCESS via Google AI Studio API! Image Base64 length: ${b64 ? b64.length : 0}`);
    } else {
      console.log(`❌ ERROR Body from Google AI Studio API:`);
      console.log(text);
    }
  }
}

testImagenGenerateImages();
