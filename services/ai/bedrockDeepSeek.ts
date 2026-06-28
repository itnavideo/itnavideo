/**
 * AWS Bedrock DeepSeek R1 integration for Itnavideo AI planning.
 *
 * Uses a SEPARATE AWS account (not the Itnavideo S3/Lambda account).
 * Authentication via Bedrock API Key (not IAM credentials).
 *
 * Use for: transcript → scene plan, hooks, captions, b-roll ideas, transitions, reel structure.
 */

import {BedrockRuntimeClient, InvokeModelCommand} from '@aws-sdk/client-bedrock-runtime';

// --- Configuration from environment ---
const BEDROCK_REGION = process.env.BEDROCK_AWS_REGION || 'us-east-1';
const BEDROCK_MODEL_ID = process.env.BEDROCK_MODEL_ID || 'us.deepseek.r1-v1:0';
const BEDROCK_MAX_TOKENS = Number(process.env.BEDROCK_MAX_TOKENS) || 4096;

// Bedrock API Key credentials (separate from Itnavideo AWS)
const BEDROCK_API_KEY_ID = process.env.BEDROCK_API_KEY_ID || '';
const BEDROCK_API_KEY_SECRET = process.env.BEDROCK_API_KEY_SECRET || '';

/**
 * Create a Bedrock client using the separate Bedrock API key credentials.
 * Falls back to default credential chain if no explicit Bedrock keys are set.
 */
function createBedrockClient(): BedrockRuntimeClient {
  if (BEDROCK_API_KEY_ID && BEDROCK_API_KEY_SECRET) {
    // Use Bedrock API Key as static credentials
    return new BedrockRuntimeClient({
      region: BEDROCK_REGION,
      credentials: {
        accessKeyId: BEDROCK_API_KEY_ID,
        secretAccessKey: BEDROCK_API_KEY_SECRET,
      },
    });
  }

  // Fallback: use default credential chain (env vars, instance role, etc.)
  return new BedrockRuntimeClient({region: BEDROCK_REGION});
}

// --- Types ---

export type DeepSeekReelPlan = {
  hook: string;
  scenes: Array<{
    id: string;
    start: number;
    end: number;
    text: string;
    visual: string;
    transition: string;
    bRoll?: string;
  }>;
  captions: Array<{
    start: number;
    end: number;
    text: string;
  }>;
  structure: {
    totalDuration: number;
    sceneCount: number;
    pacing: 'fast' | 'medium' | 'slow';
  };
};

export type DeepSeekPlanRequest = {
  transcript: string;
  topicTitle?: string;
  templateType?: string;
  durationSeconds?: number;
  language?: string;
};

// --- Main planning function ---

/**
 * Call DeepSeek R1 via Bedrock to generate a reel plan from a transcript.
 *
 * Returns: scene plan, hooks, captions, b-roll ideas, transitions, and reel structure.
 */
export async function planReelWithDeepSeek(request: DeepSeekPlanRequest): Promise<DeepSeekReelPlan> {
  const client = createBedrockClient();

  const systemPrompt = `You are an AI video editor for short-form reels (9:16 vertical video, 10-60 seconds).
Given a transcript, create a structured reel plan with:
1. A hook (first 1-3 seconds to grab attention)
2. Scenes with visual descriptions, transitions, and timing
3. B-roll suggestions for each scene
4. Caption/subtitle groupings with timing
5. Overall structure (pacing, scene count, total duration)

Respond in JSON format only. No explanation text outside JSON.`;

  const userPrompt = `Create a reel plan for this content:

Topic: ${request.topicTitle || 'General'}
Template: ${request.templateType || 'dynamic'}
Target duration: ${request.durationSeconds || 30} seconds
Language: ${request.language || 'hinglish'}

Transcript:
${request.transcript}

Respond with this JSON structure:
{
  "hook": "opening hook text/visual idea",
  "scenes": [
    {
      "id": "scene-1",
      "start": 0,
      "end": 5,
      "text": "caption text for this scene",
      "visual": "visual description / what to show",
      "transition": "cut/fade/slide/zoom",
      "bRoll": "optional b-roll suggestion"
    }
  ],
  "captions": [
    {"start": 0, "end": 2, "text": "caption group 1"},
    {"start": 2, "end": 5, "text": "caption group 2"}
  ],
  "structure": {
    "totalDuration": 30,
    "sceneCount": 6,
    "pacing": "medium"
  }
}`;

  const body = JSON.stringify({
    messages: [
      {role: 'system', content: systemPrompt},
      {role: 'user', content: userPrompt},
    ],
    max_tokens: BEDROCK_MAX_TOKENS,
    temperature: 0.7,
    top_p: 0.9,
  });

  const command = new InvokeModelCommand({
    modelId: BEDROCK_MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: new TextEncoder().encode(body),
  });

  const response = await client.send(command);
  const responseBody = new TextDecoder().decode(response.body);
  const parsed = JSON.parse(responseBody);

  // DeepSeek response format: { choices: [{ message: { content: "..." } }] }
  const content = parsed.choices?.[0]?.message?.content || parsed.content || '';

  // Extract JSON from response (may have markdown code blocks)
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('DeepSeek did not return valid JSON plan');
  }

  const plan: DeepSeekReelPlan = JSON.parse(jsonMatch[0]);
  return plan;
}

// --- Test function ---

/**
 * Quick test to verify Bedrock DeepSeek connection works.
 * Run with: node -e "import('./services/ai/bedrockDeepSeek.ts').then(m => m.testBedrockConnection())"
 * Or use the test script: node scripts/test-bedrock-deepseek.mjs
 */
export async function testBedrockConnection(): Promise<void> {
  console.log('Testing AWS Bedrock DeepSeek connection...');
  console.log(`  Region: ${BEDROCK_REGION}`);
  console.log(`  Model: ${BEDROCK_MODEL_ID}`);
  console.log(`  API Key ID: ${BEDROCK_API_KEY_ID ? BEDROCK_API_KEY_ID.slice(0, 20) + '...' : 'NOT SET'}`);

  if (!BEDROCK_API_KEY_ID || !BEDROCK_API_KEY_SECRET) {
    console.error('❌ BEDROCK_API_KEY_ID or BEDROCK_API_KEY_SECRET not set in .env.local');
    return;
  }

  try {
    const result = await planReelWithDeepSeek({
      transcript: 'Aaj hum dekhenge ki credit card kaise kaam karta hai. Pehle samjho ki credit card ek loan hai. Jab tum credit card use karte ho, bank tumhe paisa deta hai temporarily.',
      topicTitle: 'Credit Card Explained',
      templateType: 'auto-caption',
      durationSeconds: 15,
      language: 'hinglish',
    });

    console.log('\n✅ Bedrock DeepSeek connection successful!');
    console.log(`  Hook: ${result.hook}`);
    console.log(`  Scenes: ${result.scenes?.length || 0}`);
    console.log(`  Captions: ${result.captions?.length || 0}`);
    console.log(`  Pacing: ${result.structure?.pacing || 'unknown'}`);
    console.log('\nFull plan:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('\n❌ Bedrock DeepSeek test failed:', error instanceof Error ? error.message : error);
    if (error instanceof Error && error.message.includes('credential')) {
      console.error('  → Check BEDROCK_API_KEY_ID and BEDROCK_API_KEY_SECRET in .env.local');
    }
    if (error instanceof Error && error.message.includes('AccessDeniedException')) {
      console.error('  → DeepSeek model may not be enabled in your Bedrock region. Check AWS console.');
    }
  }
}
