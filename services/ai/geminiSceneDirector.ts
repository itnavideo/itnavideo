/**
 * Gemini Scene Director & Character DNA Service
 * Provides multimodal character consistency and storyboard pacing for 50+ scene long videos.
 * Inspired by POV Finance & Another Story documentary storytelling.
 */

export type VisualArtStyle = '2d' | '3d' | 'realistic';
export type ScenePacing = 'dynamic' | 'balanced' | 'relaxed';

export interface StoryboardScene {
  sceneIndex: number;
  startSeconds: number;
  endSeconds: number;
  prompt: string;
  sceneType: 'image' | 'typography';
  typographyPrimary?: string;
  typographySecondary?: string;
  typographyAccent?: string;
  cameraMotion: 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right' | 'pan-up' | 'pan-down';
}

export interface CharacterDnaResult {
  dnaPrompt: string;
  gender?: string;
  age?: string;
  clothing?: string;
  styleSummary: string;
}

export const STYLE_PROMPT_BOOSTERS: Record<VisualArtStyle, string> = {
  '2d': 'modern stylized 2D anime and graphic novel illustration, crisp linework, rich atmospheric lighting, Studio Ghibli and Makoto Shinkai aesthetic, cinematic digital painting, 16:9 widescreen aspect ratio, ultra-detailed',
  '3d': '3D Pixar and Disney cinematic animation style, octane 3D render, expressive stylized character design, Unreal Engine 5 volumetric lighting, soft subsurface scattering, clean aesthetic, 16:9 widescreen aspect ratio',
  'realistic': '8K hyper-realistic cinematic photography, Leica 35mm lens, photorealistic skin pores and natural lighting, shallow depth of field, award-winning documentary movie still, 16:9 widescreen aspect ratio, masterpiece quality',
};

/**
 * Analyze an uploaded owner/protagonist image using Gemini Vision
 * to extract a consistent Character DNA specification.
 */
export async function extractCharacterDna(options: {
  imageUrl: string;
  userHint?: string;
  apiKey?: string;
}): Promise<CharacterDnaResult> {
  const { imageUrl, userHint, apiKey } = options;
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    return {
      dnaPrompt: userHint || 'A confident, ambitious young professional with modern minimalist attire',
      styleSummary: userHint || 'Consistent protagonist character',
    };
  }

  try {
    const prompt = [
      'You are a lead character designer for a cinematic animation studio.',
      'Analyze the person in this image and create a concise Character DNA Prompt (under 60 words).',
      'Describe: exact facial structure, hair color & hairstyle, eye expression, apparent age, skin tone, clothing style & colors.',
      userHint ? 'User guidance: ' + userHint : '',
      'Format output as JSON: { "dnaPrompt": "...", "gender": "...", "age": "...", "clothing": "...", "styleSummary": "..." }',
      'Return ONLY the JSON string without code blocks or markdown.',
    ].filter(Boolean).join(' ');

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: imageUrl.startsWith('data:') ? imageUrl.split(',')[1] : '',
                },
              },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      dnaPrompt: parsed.dnaPrompt || userHint || 'Consistent protagonist character',
      gender: parsed.gender,
      age: parsed.age,
      clothing: parsed.clothing,
      styleSummary: parsed.styleSummary || 'Consistent character identity',
    };
  } catch (err) {
    console.warn('[GEMINI_CHARACTER_DNA] Fallback used:', err instanceof Error ? err.message : String(err));
    return {
      dnaPrompt: userHint || 'A confident, ambitious professional with neat dark hair and minimalist modern clothing',
      styleSummary: userHint || 'Consistent protagonist character',
    };
  }
}

/**
 * Generate 30 to 50+ sequenced scene prompts synchronized to audio duration.
 * Automatically intersperses high-impact Kinetic Typography scenes for key metrics, numbers, and chapter beats.
 */
export function buildFallbackStoryboard(options: {
  transcript: string;
  durationSeconds: number;
  visualStyle: VisualArtStyle;
  characterDna?: string;
  pacing?: ScenePacing;
}): StoryboardScene[] {
  const { durationSeconds, visualStyle, characterDna, pacing = 'balanced' } = options;
  const styleBooster = STYLE_PROMPT_BOOSTERS[visualStyle];

  // Cut frequency: dynamic ~4.0s, balanced ~5.5s, relaxed ~7.5s
  const cutDuration = pacing === 'dynamic' ? 4.0 : pacing === 'relaxed' ? 7.5 : 5.5;
  const targetSceneCount = Math.max(8, Math.min(100, Math.round(durationSeconds / cutDuration)));
  const sceneDur = durationSeconds / targetSceneCount;

  const scenes: StoryboardScene[] = [];
  const motions: StoryboardScene['cameraMotion'][] = ['zoom-in', 'pan-right', 'zoom-out', 'pan-left', 'pan-up', 'zoom-in'];

  for (let i = 0; i < targetSceneCount; i++) {
    const startSeconds = Math.round(i * sceneDur * 10) / 10;
    const endSeconds = Math.round((i + 1) * sceneDur * 10) / 10;
    const motion = motions[i % motions.length];

    // Every 7th-9th scene or intro/milestone scene becomes a high-impact Kinetic Typography beat
    const isTypoBeat = i > 0 && i % 8 === 0;

    if (isTypoBeat) {
      scenes.push({
        sceneIndex: i + 1,
        startSeconds,
        endSeconds,
        prompt: '',
        sceneType: 'typography',
        typographyPrimary: i === 8 ? 'THE 1% RULE' : i === 16 ? '$10,000 / MO' : i === 24 ? 'CRITICAL SHIFT' : 'TURNING POINT',
        typographySecondary: 'Key Insight from the Journey',
        typographyAccent: `POINT 0${Math.floor(i / 8)}`,
        cameraMotion: motion,
      });
    } else {
      const characterClause = characterDna
        ? `Featuring the main protagonist (${characterDna}), shown in scene ${i + 1}. `
        : '';
      const prompt = `${characterClause}Cinematic story scene depicting financial freedom and personal mastery, dramatic atmosphere, ${styleBooster}`;

      scenes.push({
        sceneIndex: i + 1,
        startSeconds,
        endSeconds,
        prompt,
        sceneType: 'image',
        cameraMotion: motion,
      });
    }
  }

  return scenes;
}
