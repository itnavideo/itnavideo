import fs from 'node:fs';
const env = fs.readFileSync('.env.local', 'utf-8');
const lines = env.split('\n');
const keyNames = lines.map(l => l.split('=')[0].trim()).filter(Boolean);
console.log('Keys in .env.local:');
console.log(keyNames.filter(k => k.includes('GEMINI') || k.includes('GOOGLE') || k.includes('AI') || k.includes('AWS') || k.includes('CLOUDINARY') || k.includes('OPENAI')));
