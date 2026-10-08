import { getGcpAccessToken } from './googleCloudService';

/**
 * AI Image Generation via Google Vertex AI Imagen.
 *
 * Supports "consistent" multi-scene generation: the caller provides a single
 * reference image (uploaded by the user) plus a text prompt describing the
 * story. We derive a shared visual "DNA" (subject + style descriptors) so that
 * every generated scene keeps the same character/look, then generate one image
 * per scene prompt.
 *
 * Auth reuses the existing service-account JWT flow (getGcpAccessToken), so this
 * runs on the same Google Cloud project as TTS / Vertex Gemini.
 */

// Candidate text-to-image models, tried in order. Different projects/regions
// have different Imagen models enabled, so we fall through until one works.
const IMAGEN_MODEL_CANDIDATES = (
  process.env.VERTEX_IMAGEN_MODEL
    ? [process.env.VERTEX_IMAGEN_MODEL]
    : [
        'imagen-3.0-generate-002',
        'imagen-3.0-generate-001',
        'imagen-3.0-fast-generate-001',
        'imagegeneration@006',
      ]
);
const IMAGEN_CAPABILITY_MODEL =
  process.env.VERTEX_IMAGEN_CAPABILITY_MODEL || 'imagen-3.0-capability-001';

// Captures the last real error text from Imagen so the API layer can surface it
// instead of a generic "no images" message.
let lastImagenError = '';
export function getLastImagenError(): string {
  return lastImagenError;
}

export interface GeneratedImage {
  /** data URL (base64) of the generated PNG, ready to upload or render. */
  base64: string;
  mimeType: string;
}

export interface CharacterReferenceInput {
  role: 'main' | 'char2' | 'char3';
  name?: string;
  base64: string;
  mimeType?: string;
}

export interface ScriptSceneBeat {
  sceneId: string;
  start: number;
  duration: number;
  scriptText: string;
  visualPrompt: string;
  sceneType?: 'character' | 'b-roll' | 'environment';
  charactersInScene?: string[];
}

export interface GenerateConsistentImagesParams {
  /** Overall story / topic / transcript. */
  prompt: string;
  /** Optional script transcript text for intelligent scene timing */
  transcript?: string;
  /** Total audio duration in seconds */
  audioDurationSeconds?: number;
  /** Number of scene images to generate. */
  count?: number;
  /** Visual art style preset: 'realistic' | '3d' | '2d' | free text. */
  style?: string;
  /** Up to 3 character reference images (Main, Char 2, Char 3) */
  characterReferences?: CharacterReferenceInput[];
  /** Legacy single reference image support */
  referenceImageBase64?: string;
  referenceMimeType?: string;
  /** 16:9 by default for cinematic Image-to-Video. */
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:3' | '3:4';
}

export interface GenerateConsistentImagesResult {
  success: boolean;
  images: GeneratedImage[];
  scenePrompts: string[];
  scenes?: ScriptSceneBeat[];
  error?: string;
}

const STYLE_DESCRIPTORS: Record<string, string> = {
  realistic:
    'photorealistic, cinematic 8K documentary photography, natural lighting, shallow depth of field, film grain, realistic human features',
  '3d':
    'polished 3D studio CGI animation, vibrant modern character render, soft global illumination, 3D Blender depth, Pixar aesthetic',
  '2d':
    'hand-drawn 2D digital illustration, artistic storybook anime style, clean crisp linework, painterly shading, flat graphic art',
};

function resolveStyleDescriptor(style?: string): string {
  if (!style) return STYLE_DESCRIPTORS.realistic;
  const lower = style.toLowerCase();
  if (lower === '2d' || lower.includes('2d')) return STYLE_DESCRIPTORS['2d'];
  if (lower === '3d' || lower.includes('3d')) return STYLE_DESCRIPTORS['3d'];
  if (lower === 'realistic' || lower.includes('realistic')) return STYLE_DESCRIPTORS.realistic;
  return STYLE_DESCRIPTORS[lower] || style;
}

const DEFAULT_GCP_PROJECT = 'geometric-hull-501707-m2';
const IMAGEN_REGIONS = ['us-east4', 'us-central1', 'europe-west4'];

function projectConfig(locationOverride?: string) {
  const projectId = process.env.GCP_PROJECT_ID || DEFAULT_GCP_PROJECT;
  const location = locationOverride || process.env.VERTEX_IMAGEN_LOCATION || process.env.GCP_LOCATION || 'us-east4';
  return { projectId, location };
}

function predictUrl(model: string, locationOverride?: string): string {
  const { projectId, location } = projectConfig(locationOverride);
  return `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:predict`;
}

/**
 * Intelligent Script Scene Planner: Uses Gemini to break narration transcript into
 * 5-6s (dynamic action) or 9-10s (explanatory) scene beats with specific visual prompts.
 */
export async function planScriptSceneBeats(
  transcript: string,
  audioDurationSeconds: number,
  styleDescriptor: string,
  hasMainCharacter: boolean,
  hasChar2: boolean,
  hasChar3: boolean,
): Promise<ScriptSceneBeat[]> {
  const totalSec = Math.max(10, audioDurationSeconds || 60);
  const { callVertexGemini } = await import('./googleCloudService');

  const charGuidance = [
    hasMainCharacter ? '- Main Character is the primary recurring visual figure.' : '',
    hasChar2 ? '- Character 2 is an optional supporting figure.' : '',
    hasChar3 ? '- Character 3 is an optional supporting figure.' : '',
  ].filter(Boolean).join('\n');

  const systemPrompt = `You are an expert AI video director and storyboard planner.
Analyze the voiceover narration script and break it into sequential visual scene beats.

Pacing & Timing Rules:
- STRICT: Every visual scene duration MUST be between 3.5 and 5.5 seconds (maximum 6.0 seconds).
- NEVER allow any single visual scene to exceed 6.0 seconds. If a narration segment is 10-12s long, split it into 2 visual cuts (e.g., Cut 1 at 5s, Cut 2 at 10s).
- Align scene transitions to natural thought, period, or comma boundaries in the transcript.
- Sum of all scene durations MUST equal approximately ${totalSec.toFixed(1)} seconds.
- Every visual prompt MUST strictly enforce this visual style: "${styleDescriptor}".
${charGuidance}
- Do NOT generate text, captions, logos, or watermarks in the images.

Classify each scene as:
- "character": if the scene should clearly show the main character or a person.
- "b-roll": if the scene focuses on an object, prop, closeup action, or specific metaphor without the main character.
- "environment": if the scene is a wide establishing shot, landscape, or abstract concept.

Return STRICT JSON object:
{
  "scenes": [
    {
      "sceneId": "scene-1",
      "start": 0,
      "duration": 5,
      "sceneType": "character",
      "scriptText": "Exact narration segment text...",
      "visualPrompt": "Detailed image generation prompt ending with style: ${styleDescriptor}"
    }
  ]
}`;

  const raw = await callVertexGemini({
    prompt: `Narration Script (${totalSec.toFixed(1)}s total):\n"${transcript}"`,
    systemPrompt,
    temperature: 0.5,
    responseSchema: {
      type: 'object',
      properties: {
        scenes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              sceneId: { type: 'string' },
              start: { type: 'number' },
              duration: { type: 'number' },
              sceneType: { type: 'string', enum: ['character', 'b-roll', 'environment'] },
              scriptText: { type: 'string' },
              visualPrompt: { type: 'string' },
            },
            required: ['sceneId', 'start', 'duration', 'sceneType', 'scriptText', 'visualPrompt'],
          },
        },
      },
      required: ['scenes'],
    },
  });

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.scenes) && parsed.scenes.length > 0) {
        return parsed.scenes.map((s: any, idx: number) => ({
          sceneId: String(s.sceneId || `scene-${idx + 1}`),
          start: Number(s.start) || 0,
          duration: Math.min(6, Math.max(3, Number(s.duration) || 5)),
          sceneType: (s.sceneType as 'character' | 'b-roll' | 'environment') || 'character',
          scriptText: String(s.scriptText || ''),
          visualPrompt: `${String(s.visualPrompt || transcript)}, ${styleDescriptor}`,
        }));
      }
    } catch {
      // Fall through to fallback planner
    }
  }

  // Fallback Scene Beats Generation
  const targetDuration = 4.5;
  const numScenes = Math.max(2, Math.ceil(totalSec / targetDuration));
  const sceneLen = totalSec / numScenes;
  const words = transcript.split(/\s+/);
  const wordsPerScene = Math.max(1, Math.floor(words.length / numScenes));

  return Array.from({ length: numScenes }, (_, i) => {
    const segWords = words.slice(i * wordsPerScene, (i + 1) * wordsPerScene).join(' ');
    return {
      sceneId: `scene-${i + 1}`,
      start: Number((i * sceneLen).toFixed(1)),
      duration: Number(sceneLen.toFixed(1)),
      sceneType: 'character',
      scriptText: segWords || transcript.slice(0, 100),
      visualPrompt: `Scene depicting ${segWords || transcript}, ${styleDescriptor}`,
    };
  });
}

/**
 * Ask Vertex Gemini to expand a single story prompt into N distinct but
 * coherent scene descriptions that share the same subject and setting.
 */
async function planScenePrompts(
  storyPrompt: string,
  count: number,
  styleDescriptor: string,
): Promise<string[]> {
  const { callVertexGemini } = await import('./googleCloudService');
  const systemPrompt = `You are a cinematic storyboard director. Given a story or topic, produce exactly ${count} vivid image-generation prompts that depict a single, CONSISTENT story.
Rules:
- Keep the SAME main subject/character across every scene (same appearance, clothing, age, setting palette).
- Each prompt describes one distinct moment/scene, in chronological order.
- Every prompt must end with this exact visual style: "${styleDescriptor}".
- No text, captions, watermarks, or logos in the images.
- Return STRICT JSON: {"scenes": ["prompt 1", "prompt 2", ...]} with exactly ${count} items.`;

  const raw = await callVertexGemini({
    prompt: `Story/topic: ${storyPrompt}`,
    systemPrompt,
    temperature: 0.6,
    responseSchema: {
      type: 'object',
      properties: {
        scenes: { type: 'array', items: { type: 'string' } },
      },
      required: ['scenes'],
    },
  });

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      const scenes = Array.isArray(parsed.scenes)
        ? parsed.scenes.map((s: unknown) => String(s || '').trim()).filter(Boolean)
        : [];
      if (scenes.length > 0) {
        const out = scenes.slice(0, count);
        while (out.length < count) {
          out.push(`${storyPrompt}, ${styleDescriptor}`);
        }
        return out;
      }
    } catch {
      // fall through to deterministic fallback
    }
  }

  const beats = [
    'establishing wide shot',
    'close-up on the main subject',
    'a moment of action',
    'an emotional turning point',
    'the resolution',
  ];
  return Array.from({ length: count }, (_, i) => {
    const beat = beats[i % beats.length];
    return `${storyPrompt}, ${beat}, ${styleDescriptor}`;
  });
}

// Track working model and region pair so subsequent calls execute instantly without re-testing
let workingImagenModel: string | null = null;
let workingImagenRegion: string | null = null;

async function callImagenModel(
  model: string,
  scenePrompt: string,
  aspectRatio: string,
  token: string,
  region: string = 'us-east4',
): Promise<{ image?: GeneratedImage; status: number; error?: string }> {
  const url = predictUrl(model, region);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    signal: AbortSignal.timeout(45000),
    body: JSON.stringify({
      instances: [{ prompt: scenePrompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio,
        safetySetting: 'block_only_high',
        personGeneration: 'allow_adult',
        addWatermark: false,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`[IMAGEN] ${model} (${region}) HTTP ${res.status}: ${errText.slice(0, 400)}`);
    return { status: res.status, error: `${model} (${region}) → HTTP ${res.status}: ${errText.slice(0, 300)}` };
  }

  const data = await res.json();
  const prediction = data?.predictions?.[0];

  // Log safetyAttributes if Vertex AI safety filter triggered
  if (prediction?.safetyAttributes) {
    console.warn(`[IMAGEN_SAFETY_FILTER] ${model} (${region}) safetyAttributes:`, JSON.stringify(prediction.safetyAttributes, null, 2));
  }

  const b64 = prediction?.bytesBase64Encoded;
  if (!b64) {
    console.warn(`[IMAGEN_RESPONSE_INSPECTION] ${model} (${region}) returned response without predictions[0].bytesBase64Encoded:`, JSON.stringify(data, null, 2));
    return { status: res.status, error: `${model} (${region}) → bytesBase64Encoded missing in response` };
  }
  return { image: { base64: b64, mimeType: prediction?.mimeType || 'image/png' }, status: res.status };
}

async function callGoogleAiStudioImagen(
  prompt: string,
  aspectRatio: string,
  apiKey: string,
): Promise<GeneratedImage | null> {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio,
          personGeneration: 'ALLOW_ADULT',
          safetySetting: 'BLOCK_ONLY_HIGH',
        },
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const prediction = data?.predictions?.[0];
      if (prediction?.safetyAttributes) {
        console.warn('[AI_STUDIO_IMAGEN_SAFETY_FILTER]', JSON.stringify(prediction.safetyAttributes, null, 2));
      }
      const b64 = prediction?.bytesBase64Encoded;
      if (b64) return { base64: b64, mimeType: prediction?.mimeType || 'image/png' };
    } else {
      const err = await res.text();
      console.warn('[AI_STUDIO_IMAGEN] HTTP', res.status, err.slice(0, 200));
    }
  } catch (e) {
    console.warn('[AI_STUDIO_IMAGEN] Call error:', e);
  }
  return null;
}

async function callImagenGenerate(
  scenePrompt: string,
  aspectRatio: string,
  token: string,
): Promise<GeneratedImage | null> {
  if (workingImagenModel && workingImagenRegion) {
    const result = await callImagenModel(workingImagenModel, scenePrompt, aspectRatio, token, workingImagenRegion);
    if (result.image) return result.image;
    // Clear cached pair if endpoint degraded
    workingImagenModel = null;
    workingImagenRegion = null;
  }

  const models = IMAGEN_MODEL_CANDIDATES;
  const regions = IMAGEN_REGIONS;

  for (const model of models) {
    for (const region of regions) {
      const result = await callImagenModel(model, scenePrompt, aspectRatio, token, region);
      if (result.image) {
        workingImagenModel = model;
        workingImagenRegion = region;
        console.log(`[IMAGEN_SUCCESS] Found active working endpoint: ${model} @ ${region}`);
        return result.image;
      }
      if (result.error) lastImagenError = result.error;
    }
  }

  // Try Google AI Studio direct endpoint if GEMINI_API_KEY is available
  if (process.env.GEMINI_API_KEY) {
    const aiStudioImg = await callGoogleAiStudioImagen(scenePrompt, aspectRatio, process.env.GEMINI_API_KEY);
    if (aiStudioImg) return aiStudioImg;
  }

  return null;
}

/**
 * Use Imagen "capability" model with up to 3 reference images (Main, Char 2, Char 3)
 */
async function callImagenWithMultipleReferences(
  scenePrompt: string,
  aspectRatio: string,
  characterReferences: CharacterReferenceInput[],
  token: string,
): Promise<GeneratedImage | null> {
  if (!characterReferences || characterReferences.length === 0) {
    return callImagenGenerate(scenePrompt, aspectRatio, token);
  }

  try {
    const referenceImagesPayload = characterReferences.map((char, index) => {
      const cleanBase64 = char.base64.includes(',') ? char.base64.split(',')[1] : char.base64;
      const refId = index + 1;
      const desc = char.role === 'main' ? 'main character' : char.role === 'char2' ? 'supporting character 2' : 'supporting character 3';
      return {
        referenceType: 'REFERENCE_TYPE_SUBJECT',
        referenceId: refId,
        referenceImage: { bytesBase64Encoded: cleanBase64 },
        subjectImageConfig: {
          subjectDescription: desc,
          subjectType: 'SUBJECT_TYPE_DEFAULT',
        },
      };
    });

    const res = await fetch(predictUrl(IMAGEN_CAPABILITY_MODEL), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [
          {
            prompt: `Keep the character appearance consistent with reference images. ${scenePrompt}`,
            referenceImages: referenceImagesPayload,
          },
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio,
          addWatermark: false,
          personGeneration: 'allow_adult',
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn('[IMAGEN] Capability model HTTP', res.status, errText.slice(0, 200), '— falling back to standard generation');
      lastImagenError = `capability(${IMAGEN_CAPABILITY_MODEL}) → HTTP ${res.status}: ${errText.slice(0, 200)}`;
      return callImagenGenerate(scenePrompt, aspectRatio, token);
    }

    const data = await res.json();
    const prediction = data?.predictions?.[0];
    const b64 = prediction?.bytesBase64Encoded;
    if (!b64) return callImagenGenerate(scenePrompt, aspectRatio, token);
    return { base64: b64, mimeType: prediction?.mimeType || 'image/png' };
  } catch (err) {
    console.warn('[IMAGEN] Multi-reference capability model error, falling back:', err);
    return callImagenGenerate(scenePrompt, aspectRatio, token);
  }
}

async function callPollinationsFluxImage(
  prompt: string,
  aspectRatio: string,
): Promise<GeneratedImage | null> {
  // POLLINATIONS KILL SWITCH: Permanently disabled to surface raw Google Vertex / AI Studio API errors
  console.warn('[POLLINATIONS_KILL_SWITCH] Pollinations fallback is permanently disabled to surface exact Google API errors.');
  return null;
}

/**
 * Single Scene Image Generation (for per-scene regeneration)
 */
export async function generateSingleSceneImage({
  scenePrompt,
  style,
  characterReferences = [],
  aspectRatio = '16:9',
}: {
  scenePrompt: string;
  style?: string;
  characterReferences?: CharacterReferenceInput[];
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:3' | '3:4';
}): Promise<GeneratedImage | null> {
  const token = await getGcpAccessToken();
  const styleDescriptor = resolveStyleDescriptor(style);
  const fullPrompt = `${scenePrompt}, ${styleDescriptor}`;

  if (token) {
    let img = characterReferences.length > 0
      ? await callImagenWithMultipleReferences(fullPrompt, aspectRatio, characterReferences, token)
      : await callImagenGenerate(fullPrompt, aspectRatio, token);
    if (img) return img;
  }

  const errDetail = getLastImagenError() || 'Google Vertex AI / AI Studio Imagen endpoint returned null/404';
  throw new Error(`[GOOGLE_IMAGEN_FAILED] ${errDetail}`);
}

async function extractCharacterDnaFromReference(base64Image: string): Promise<string> {
  try {
    const { callVertexGemini } = await import('./googleCloudService');
    const cleanB64 = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
    if (!cleanB64 || cleanB64.length < 100) return '';

    const systemPrompt = `You are an expert character designer and vision AI. Analyze this character photo and describe the key visual features in 1-2 concise sentences for text-to-image AI prompt consistency.
Include ONLY: gender, approximate age, hairstyle & hair color, ethnicity, facial hair, distinct outfit/clothing items, and structural facial features.
CRITICAL: Do NOT mention skin texture, photographic realism, lighting, camera angles, shadows, or photo quality. Keep the description completely style-agnostic so it works seamlessly across 2D illustration, 3D animation, and realistic render styles.
Return ONLY the concise visual description string without any introductory or concluding text.`;

    const description = await callVertexGemini({
      prompt: "Describe this main character's exact visual appearance for consistent AI image generation.",
      systemPrompt,
      inlineData: {
        mimeType: 'image/png',
        data: cleanB64,
      },
      temperature: 0.2,
    });

    return String(description || '').trim().replace(/^['"]|['"]$/g, '');
  } catch (err) {
    console.warn('[CHARACTER_DNA] Failed to analyze character reference image:', err);
    return '';
  }
}

export async function generateConsistentImages({
  prompt,
  transcript,
  audioDurationSeconds = 60,
  count,
  style,
  characterReferences = [],
  referenceImageBase64,
  aspectRatio = '16:9',
}: GenerateConsistentImagesParams): Promise<GenerateConsistentImagesResult> {
  const cleanPrompt = String(prompt || transcript || '').trim();

  if (!cleanPrompt) {
    return { success: false, images: [], scenePrompts: [], error: 'An image prompt or transcript text is required.' };
  }

  const token = await getGcpAccessToken();
  const styleDescriptor = resolveStyleDescriptor(style);

  // Parse legacy single reference if present
  let activeCharRefs = [...characterReferences];
  if (activeCharRefs.length === 0 && referenceImageBase64) {
    activeCharRefs.push({
      role: 'main',
      base64: referenceImageBase64,
    });
  }

  // Extract character visual DNA for Main and Supporting characters
  let mainDna = '';
  let char2Dna = '';

  const mainRef = activeCharRefs.find((c) => c.role === 'main') || activeCharRefs[0];
  const char2Ref = activeCharRefs.find((c) => c.role === 'char2');

  if (mainRef && mainRef.base64) {
    mainDna = await extractCharacterDnaFromReference(mainRef.base64);
    if (mainDna) console.log('[CHARACTER_DNA] Extracted Main Character DNA:', mainDna);
  }

  if (char2Ref && char2Ref.base64) {
    char2Dna = await extractCharacterDnaFromReference(char2Ref.base64);
    if (char2Dna) console.log('[CHARACTER_DNA] Extracted Character 2 DNA:', char2Dna);
  }

  let sceneBeats: ScriptSceneBeat[] = [];
  let scenePrompts: string[] = [];

  if (transcript && audioDurationSeconds) {
    sceneBeats = await planScriptSceneBeats(
      transcript,
      audioDurationSeconds,
      styleDescriptor,
      activeCharRefs.some((c) => c.role === 'main'),
      activeCharRefs.some((c) => c.role === 'char2'),
      activeCharRefs.some((c) => c.role === 'char3'),
    );
    scenePrompts = sceneBeats.map((b) => b.visualPrompt);
  } else {
    const safeCount = Math.max(1, Math.min(12, Math.floor(count || 6)));
    scenePrompts = await planScenePrompts(cleanPrompt, safeCount, styleDescriptor);
    sceneBeats = scenePrompts.map((p, i) => ({
      sceneId: `scene-${i + 1}`,
      start: i * 6,
      duration: 6,
      scriptText: `Scene ${i + 1}`,
      visualPrompt: p,
    }));
  }

  // Inject character DNA with spatial anchoring for multi-character support
  if (mainDna || char2Dna) {
    sceneBeats = sceneBeats.map((beat) => {
      if (beat.sceneType === 'character' || !beat.sceneType) {
        let prefix = '';
        if (mainDna && char2Dna) {
          prefix = `Two distinct people in split composition. [Left side of frame]: Main character (${mainDna}). [Right side of frame]: Supporting character (${char2Dna}). `;
        } else if (mainDna) {
          prefix = `Main character: ${mainDna}. `;
        } else if (char2Dna) {
          prefix = `Supporting character: ${char2Dna}. `;
        }
        return {
          ...beat,
          visualPrompt: `${prefix}${beat.visualPrompt}`,
        };
      }
      return beat;
    });
    scenePrompts = sceneBeats.map((b) => b.visualPrompt);
  }

  // Parallel Batch Concurrency (3 concurrent requests) to avoid API gateway timeouts
  const concurrencyLimit = 3;
  const images: GeneratedImage[] = [];

  for (let i = 0; i < sceneBeats.length; i += concurrencyLimit) {
    const batch = sceneBeats.slice(i, i + concurrencyLimit);
    const batchResults = await Promise.all(
      batch.map(async (beat) => {
        let image: GeneratedImage | null = null;
        if (token) {
          image = activeCharRefs.length > 0
            ? await callImagenWithMultipleReferences(beat.visualPrompt, aspectRatio, activeCharRefs, token)
            : await callImagenGenerate(beat.visualPrompt, aspectRatio, token);
        }

        if (!image) {
          const errDetail = getLastImagenError() || 'Vertex AI / AI Studio returned null/404 response';
          console.error(`[AI_IMAGE_GEN_FAILED] Google Imagen 3 API Call Failed: ${errDetail}`);
        }

        return image;
      })
    );

    for (const img of batchResults) {
      if (img) images.push(img);
    }
  }

  if (images.length === 0) {
    return {
      success: false,
      images: [],
      scenePrompts,
      scenes: sceneBeats,
      error: 'Image generation did not return any images. Please try a different prompt.',
    };
  }

  return { success: true, images, scenePrompts, scenes: sceneBeats };
}

