/**
 * services/ai/aiVideoGeneratorPlanner.ts
 * Flagship AI Video Generator Creative Director & Multitrack Scene Planner.
 *
 * Grounded in:
 * - 16:9 Widescreen Cinema (1920×1080 Full HD, up to 5 min, 1 Min = 1 Credit).
 * - Gemini 2.0 Flash AI Director for prompt expansion, narrative pacing & visual direction.
 * - Scene-level independent regeneration and locking ($🔒$).
 * - Word-level kinetic caption synchronization with 32 master styles.
 * - Robust deterministic fallbacks when offline or rate-limited.
 */

export interface AiVideoGeneratorScene {
  id: string;
  sceneIndex: number;
  startSeconds: number;
  endSeconds: number;
  duration: number;
  title: string;
  narration: string;
  visualDescription: string;
  cameraMotion: 'ken-burns-in' | 'ken-burns-out' | 'pan-left' | 'pan-right' | 'static';
  transition: 'cut' | 'dissolve' | 'wipe-left';
  mediaUrl: string;
  mediaType: 'image' | 'video';
  isLocked?: boolean;
  anchorKeywords?: string[];
}

export interface AiVideoGeneratorPlan {
  id: string;
  title: string;
  prompt: string;
  enhancedPrompt?: string;
  aspectRatio: '16:9';
  durationSeconds: number;
  style: string;
  captionThemeId: string;
  bgmTrackId: string;
  bgmVolume: number;
  scenes: AiVideoGeneratorScene[];
  captions: Array<{
    id: string;
    index: number;
    startTime: number;
    endTime: number;
    text: string;
  }>;
}

// Master Cloudinary production visual B-roll assets (16:9 Cinema)
export const AI_VIDEO_STUDIO_LIBRARY_VISUALS = [
  "https://res.cloudinary.com/dhouh9idx/image/upload/c_crop,g_north_west,w_0.96,h_0.94/f_auto,q_auto,w_1200/v1793807678/itnavideo12345/blog_podcaster_new_york.png",
  "https://res.cloudinary.com/dhouh9idx/image/upload/c_crop,g_north_west,w_0.96,h_0.94/f_auto,q_auto,w_1200/v1793807713/itnavideo12345/blog_video_producer_studio.png",
  "https://res.cloudinary.com/dhouh9idx/image/upload/c_crop,g_north_west,w_0.96,h_0.94/f_auto,q_auto,w_1200/v1793807603/itnavideo12345/blog_youtube_creator_usa.png",
  "https://res.cloudinary.com/dhouh9idx/image/upload/c_crop,g_north_west,w_0.96,h_0.94/f_auto,q_auto,w_1200/v1793807944/itnavideo12345/blog_captions_creator_usa.png",
  "https://res.cloudinary.com/dhouh9idx/image/upload/c_crop,g_north_west,w_0.96,h_0.94/f_auto,q_auto,w_1200/v1793807751/itnavideo12345/blog_batch_video_creator.png",
  "https://res.cloudinary.com/dhouh9idx/image/upload/c_crop,g_north_west,w_0.96,h_0.94/f_auto,q_auto,w_1200/v1793807974/itnavideo12345/blog_youtube_shorts_creator.png",
  "https://res.cloudinary.com/dhouh9idx/image/upload/c_crop,g_north_west,w_0.96,h_0.94/f_auto,q_auto,w_1200/v1793808113/itnavideo12345/blog_finance_creator.png",
  "https://res.cloudinary.com/dhouh9idx/image/upload/c_crop,g_north_west,w_0.96,h_0.94/f_auto,q_auto,w_1200/v1793808080/itnavideo12345/blog_ai_tools_upgrade.png",
];

/**
 * 1. Prompt Enhancer via Gemini 2.0 Flash
 * Expands a 1-line concept into a cinematic production brief.
 */
export async function enhanceUserPrompt(
  prompt: string,
  options?: { style?: string; targetDuration?: number }
): Promise<string> {
  const cleanPrompt = (prompt || '').trim();
  if (!cleanPrompt) return '';

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are an executive video director. A creator gave this short prompt for a 16:9 widescreen video:
"${cleanPrompt}"
Style preference: ${options?.style || 'Cinematic Modern'}
Target duration: ${options?.targetDuration || 45} seconds.

Expand this into an enriched, high-retention video production brief in 2-3 concise sentences. Mention the visual hook, lighting/camera aesthetic, narrative arc, and audience takeaway. Do not use markdown headers or bullet points; return pure narrative prose.`,
              },
            ],
          },
        ],
      });

      const resultText = response?.text?.trim();
      if (resultText && resultText.length > 20) {
        return resultText;
      }
    } catch (err) {
      console.warn('[enhanceUserPrompt] Gemini API call skipped or failed, using deterministic enhancer:', err);
    }
  }

  // Deterministic Fallback Prompt Enhancer
  return `A visually stunning 16:9 ${options?.style || 'cinematic'} documentary-style explainer exploring "${cleanPrompt}". Starts with a high-contrast opening hook shot, transitioning smoothly across dynamic macro visuals with subtle Ken Burns camera motion, an authoritative voiceover cadence, and clean kinetic typography highlights for maximum viewer retention.`;
}

/**
 * 2. Generate Complete AI Video Plan
 */
export async function generateAiVideoPlan(params: {
  prompt: string;
  targetDurationSeconds?: number;
  style?: string;
  uploadedMedia?: Array<{ url: string; type: 'image' | 'video' }>;
  captionThemeId?: string;
  bgmTrackId?: string;
}): Promise<AiVideoGeneratorPlan> {
  const prompt = (params.prompt || 'Modern Innovation & Future Technology').trim();
  const targetDuration = Math.min(Math.max(params.targetDurationSeconds || 40, 15), 300);
  const style = params.style || 'Cinematic Modern';
  const captionThemeId = params.captionThemeId || 'pop-word';
  const bgmTrackId = params.bgmTrackId || 'parasail';

  // Average scene duration ~5 seconds (6 to 12 scenes depending on length)
  const sceneDuration = 5;
  const numScenes = Math.max(3, Math.min(Math.round(targetDuration / sceneDuration), 20));
  const exactSceneDuration = +(targetDuration / numScenes).toFixed(1);

  // Available user media or fallback library visuals
  const availableMedia = (params.uploadedMedia && params.uploadedMedia.length > 0)
    ? params.uploadedMedia
    : AI_VIDEO_STUDIO_LIBRARY_VISUALS.map((url) => ({ url, type: 'image' as const }));

  // Narrative generation: Try Gemini, else high-quality deterministic narrative generator
  let sceneNarratives: Array<{ title: string; narration: string; visualDescription: string }> = [];

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Create a structured ${numScenes}-scene script for a 16:9 widescreen video about:
"${prompt}"
Total duration: ${targetDuration} seconds.
Style: ${style}.

Return strictly a JSON array with exactly ${numScenes} objects. Each object must have:
- "title": Short 2-4 word scene title.
- "narration": 1 punchy spoken sentence for this scene (around 10-15 words).
- "visualDescription": 1 sentence describing the visual shot and camera motion.`,
              },
            ],
          },
        ],
      });

      const raw = response?.text?.trim() || '';
      const cleanJson = raw.replace(/^```json/i, '').replace(/```$/i, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length >= 3) {
        sceneNarratives = parsed.map((item: any, i: number) => ({
          title: item.title || `Scene ${i + 1}`,
          narration: item.narration || `Exploring the core concepts of ${prompt}.`,
          visualDescription: item.visualDescription || `Cinematic visual representation of scene ${i + 1}.`,
        }));
      }
    } catch (e) {
      console.warn('[generateAiVideoPlan] Gemini AI call skipped, using procedural scene builder:', e);
    }
  }

  // Fallback procedural script if AI is offline
  if (sceneNarratives.length === 0) {
    const topicWords = prompt.split(/\s+/).slice(0, 4).join(' ');
    const proceduralTemplates = [
      {
        title: 'The Hook',
        narration: `What if the way we think about ${topicWords} is completely changing today?`,
        visualDescription: 'Dramatic wide-angle establishing shot with gentle push-in motion.',
      },
      {
        title: 'The Core Insight',
        narration: `Behind every major breakthrough is a simple principle that most people overlook.`,
        visualDescription: 'Clean high-contrast graphic with dynamic framing and subtle zoom.',
      },
      {
        title: 'The Transformation',
        narration: `When you apply this approach, efficiency and results multiply in record time.`,
        visualDescription: 'Vibrant modern visuals showing momentum, speed, and real progress.',
      },
      {
        title: 'The Action Step',
        narration: `Start with one focused action today to see immediate compounding growth.`,
        visualDescription: 'Inspiring finish frame with bold cinematic lighting and steady focus.',
      },
    ];

    sceneNarratives = Array.from({ length: numScenes }, (_, i) => {
      const template = proceduralTemplates[i % proceduralTemplates.length];
      return {
        title: `${template.title} #${i + 1}`,
        narration: template.narration,
        visualDescription: template.visualDescription,
      };
    });
  }

  // Camera motions rotation for dynamic cinematography
  const cameraMotions: AiVideoGeneratorScene['cameraMotion'][] = [
    'ken-burns-in',
    'pan-right',
    'ken-burns-out',
    'pan-left',
    'static',
  ];

  // Build structured scenes with exact timestamps
  const scenes: AiVideoGeneratorScene[] = [];
  const captions: AiVideoGeneratorPlan['captions'] = [];
  let currentTime = 0;

  for (let i = 0; i < numScenes; i++) {
    const isLast = i === numScenes - 1;
    const dur = isLast ? +(targetDuration - currentTime).toFixed(1) : exactSceneDuration;
    const startTime = +currentTime.toFixed(1);
    const endTime = +(currentTime + dur).toFixed(1);
    currentTime = endTime;

    const narrative = sceneNarratives[i] || {
      title: `Beat ${i + 1}`,
      narration: `Key perspective on ${prompt}.`,
      visualDescription: 'Cinematic visual frame.',
    };

    const mediaObj = availableMedia[i % availableMedia.length];

    scenes.push({
      id: `scene-${i + 1}-${Date.now().toString(36)}`,
      sceneIndex: i,
      startSeconds: startTime,
      endSeconds: endTime,
      duration: dur,
      title: narrative.title,
      narration: narrative.narration,
      visualDescription: narrative.visualDescription,
      cameraMotion: cameraMotions[i % cameraMotions.length],
      transition: i === 0 ? 'cut' : 'dissolve',
      mediaUrl: mediaObj.url,
      mediaType: mediaObj.type,
      isLocked: false,
      anchorKeywords: narrative.narration.split(/\s+/).slice(0, 3),
    });

    // Subtitle chunk for each scene
    captions.push({
      id: `cap-${i + 1}`,
      index: i,
      startTime,
      endTime,
      text: narrative.narration,
    });
  }

  return {
    id: `aivideo-${Date.now().toString(36)}`,
    title: prompt.length > 40 ? `${prompt.slice(0, 37)}...` : prompt,
    prompt,
    enhancedPrompt: await enhanceUserPrompt(prompt, { style, targetDuration }),
    aspectRatio: '16:9',
    durationSeconds: targetDuration,
    style,
    captionThemeId,
    bgmTrackId,
    bgmVolume: 0.35,
    scenes,
    captions,
  };
}

/**
 * 3. Independent Scene Regeneration
 * Swaps visual media and motion without resetting or touching any other scene.
 */
export async function regenerateSingleScene(
  sceneIndex: number,
  currentPlan: AiVideoGeneratorPlan,
  promptContext?: string
): Promise<AiVideoGeneratorScene> {
  const currentScene = currentPlan.scenes[sceneIndex];
  if (!currentScene) {
    throw new Error(`Scene at index ${sceneIndex} does not exist`);
  }

  // Pick a new visual asset different from the current one
  const otherVisuals = AI_VIDEO_STUDIO_LIBRARY_VISUALS.filter((v) => v !== currentScene.mediaUrl);
  const nextMediaUrl = otherVisuals[Math.floor(Math.random() * otherVisuals.length)] || currentScene.mediaUrl;

  // Toggle camera motion
  const motions: AiVideoGeneratorScene['cameraMotion'][] = [
    'ken-burns-in',
    'ken-burns-out',
    'pan-right',
    'pan-left',
    'static',
  ];
  const nextMotion = motions.filter((m) => m !== currentScene.cameraMotion)[
    Math.floor(Math.random() * (motions.length - 1))
  ] || 'ken-burns-in';

  return {
    ...currentScene,
    mediaUrl: nextMediaUrl,
    cameraMotion: nextMotion,
    visualDescription: promptContext
      ? `Regenerated visual shot: ${promptContext}`
      : currentScene.visualDescription,
  };
}

