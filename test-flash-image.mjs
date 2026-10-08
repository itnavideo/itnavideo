import { config } from 'dotenv';
config({ path: '.env.local' });

async function testGeminiFlashImage() {
  const apiKey = process.env.GEMINI_API_KEY;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: 'Generate an image of a cinematic high quality photo of a modern studio with glowing orange lights' }] }],
    }),
  });

  console.log(`HTTP Status Code: ${res.status}`);
  const text = await res.text();
  console.log('Response body:', text.slice(0, 1000));
}

testGeminiFlashImage();
