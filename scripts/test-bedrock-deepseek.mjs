/**
 * Test AWS Bedrock DeepSeek R1 connection.
 * Run: node scripts/test-bedrock-deepseek.mjs
 *
 * Uses BEDROCK_API_KEY_ID and BEDROCK_API_KEY_SECRET from .env.local
 * (separate from Itnavideo's main AWS credentials)
 */

import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Load .env.local manually
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(rootDir, '.env.local');
try {
  const envContent = readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
} catch {
  console.error('Could not load .env.local');
}

// Now import and run the test
const {BedrockRuntimeClient, InvokeModelCommand} = await import('@aws-sdk/client-bedrock-runtime');

const REGION = process.env.BEDROCK_AWS_REGION || 'us-east-1';
const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'us.deepseek.r1-v1:0';
const MAX_TOKENS = Number(process.env.BEDROCK_MAX_TOKENS) || 4096;
const API_KEY_ID = process.env.BEDROCK_API_KEY_ID || '';
const API_KEY_SECRET = process.env.BEDROCK_API_KEY_SECRET || '';

console.log('=== AWS Bedrock DeepSeek R1 Test ===\n');
console.log(`Region:       ${REGION}`);
console.log(`Model:        ${MODEL_ID}`);
console.log(`Max Tokens:   ${MAX_TOKENS}`);
console.log(`API Key ID:   ${API_KEY_ID ? API_KEY_ID.slice(0, 25) + '...' : '❌ NOT SET'}`);
console.log(`API Secret:   ${API_KEY_SECRET ? '***' + API_KEY_SECRET.slice(-8) : '❌ NOT SET'}`);
console.log('');

if (!API_KEY_ID || !API_KEY_SECRET) {
  console.error('❌ Missing BEDROCK_API_KEY_ID or BEDROCK_API_KEY_SECRET in .env.local');
  console.error('   Add these from your Bedrock API key download.');
  process.exit(1);
}

const client = new BedrockRuntimeClient({
  region: REGION,
  credentials: {
    accessKeyId: API_KEY_ID,
    secretAccessKey: API_KEY_SECRET,
  },
});

const testPrompt = `You are an AI video editor. Given this transcript, suggest 3 scene ideas for a 15-second reel:

"Credit card kaise kaam karta hai. Bank tumhe paisa deta hai temporarily. 45 days mein wapas karo toh koi interest nahi."

Respond in JSON: {"scenes": [{"text": "...", "visual": "...", "duration": 5}]}`;

console.log('Sending test request to DeepSeek R1...\n');

try {
  const body = JSON.stringify({
    messages: [
      {role: 'user', content: testPrompt},
    ],
    max_tokens: MAX_TOKENS,
    temperature: 0.7,
  });

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: new TextEncoder().encode(body),
  });

  const response = await client.send(command);
  const responseBody = new TextDecoder().decode(response.body);
  const parsed = JSON.parse(responseBody);

  console.log('✅ SUCCESS! DeepSeek R1 responded.\n');
  console.log('Raw response:');
  console.log(JSON.stringify(parsed, null, 2));

  const content = parsed.choices?.[0]?.message?.content || parsed.content || '';
  if (content) {
    console.log('\nExtracted content:');
    console.log(content.slice(0, 500));
  }
} catch (error) {
  console.error('❌ FAILED:', error.message || error);
  console.error('');
  if (error.message?.includes('UnrecognizedClientException') || error.message?.includes('credential')) {
    console.error('→ Your API key may be invalid or expired.');
    console.error('→ Go to AWS Bedrock console → API Keys → check status.');
  } else if (error.message?.includes('AccessDeniedException')) {
    console.error('→ DeepSeek R1 model may not be enabled in your region.');
    console.error('→ Go to AWS Bedrock console → Model access → enable DeepSeek R1.');
  } else if (error.message?.includes('ValidationException')) {
    console.error('→ Model ID may be wrong. Try: us.deepseek.r1-v1:0 or deepseek.r1-v1:0');
  } else if (error.message?.includes('ResourceNotFoundException')) {
    console.error('→ Model not found in this region. Try BEDROCK_AWS_REGION=us-east-1 or us-west-2');
  }
  process.exit(1);
}
