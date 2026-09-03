/**
 * Long Video Pro AI Visual Planning Agent
 *
 * Performs holistic script analysis to create a structured Video Blueprint.
 * Decides optimal visual type (from 8 types), groups related sentences,
 * allocates natural content-aware durations, defines 3-tier asset fallbacks,
 * and generates YouTube Chapter Timestamps.
 */

import { GoogleGenAI } from '@google/genai';
import type {
  VideoBlueprint,
  BlueprintScene,
  VisualType,
  VisualPriority,
  TextPriority,
  MotionAnimation,
  TransitionType,
} from './videoBlueprintTypes';

export type PlanningInput = {
  transcript: string;
  words: Array<{ word: string; start: number; end: number }>;
  durationSeconds: number;
  topicTitle?: string;
  pacing?: 'slow' | 'medium' | 'fast';
};

export async function planLongVideoProBlueprint(
  input: PlanningInput
): Promise<{ blueprint: VideoBlueprint; source: 'gemini' | 'fallback' }> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

  if (apiKey && input.words.length >= 4) {
    try {
      const blueprint = await callGeminiPlanningAgent(input, apiKey);
      if (blueprint && blueprint.scenes && blueprint.scenes.length >= 1) {
        return { blueprint, source: 'gemini' };
      }
    } catch (error) {
      console.error('[LONG_VIDEO_PRO_PLANNER] Gemini planning agent error:', error instanceof Error ? error.message : error);
    }
  }

  return { blueprint: buildFallbackBlueprint(input), source: 'fallback' };
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ── Gemini Visual Planning Agent Call ─────────────────────────────────────────

async function callGeminiPlanningAgent(input: PlanningInput, apiKey: string): Promise<VideoBlueprint> {
  const ai = new GoogleGenAI({ apiKey });

  const wordLines = input.words
    .slice(0, 300)
    .map((w, i) => `[${i}] ${w.start.toFixed(2)}s - ${w.end.toFixed(2)}s: "${w.word}"`)
    .join('\n');

  const prompt = `
You are a master AI Video Director and Visual Planning Agent designing a high-production 16:9 explainer video.

TOPIC: "${input.topicTitle || 'Explainer Video'}"
TOTAL DURATION: ${input.durationSeconds.toFixed(1)} seconds

FULL TRANSCRIPT WITH TIMESTAMPS:
${wordLines}

INSTRUCTIONS FOR VISUAL PLANNING:
1. First, analyze the ENTIRE script holistically. Understand the overall story flow, core topic, explanations, statistics, key terminology, and takeaways.
2. Divide the script into logical visual sections (scenes). DO NOT cut every 2-3 seconds arbitrarily.
   - Group consecutive sentences that discuss the same concept together.
   - Important explanations should hold a visual for 6 to 15 seconds.
   - Change visuals ONLY when topic, meaning, or emphasis shifts.
3. Assign a "chapterTitle" when a new major section or topic shift begins (e.g. "CHAPTER 1: THE PROBLEM", "CHAPTER 2: KEY FINDINGS").
4. If a person or speaker name is mentioned, include "speakerInfo": { "name": "Elon Musk", "title": "CEO, Tesla" }.
5. For EACH scene, select the single BEST Visual Type from these 8 options:
   "IMAGE", "VIDEO_CLIP", "FACE_PERSON", "TYPOGRAPHY", "CHART_GRAPH", "DIAGRAM_INFOGRAPHIC", "B_ROLL", "SIMPLE_BACKGROUND".
6. EVERY SCENE MUST INCLUDE A 3-TIER ASSET FALLBACK PLAN:
   - primaryAsset, secondaryAsset, fallbackVisual.

OUTPUT FORMAT: Return ONLY valid JSON matching this exact structure:

{
  "topicTitle": "${input.topicTitle || 'Explainer Video'}",
  "overallMood": "engaging and informative",
  "estimatedDurationSeconds": ${input.durationSeconds.toFixed(1)},
  "totalScenes": 3,
  "scenes": [
    {
      "sceneNumber": 1,
      "startSeconds": 0.0,
      "endSeconds": 7.5,
      "durationSeconds": 7.5,
      "narrationText": "exact narration text for this section",
      "chapterTitle": "INTRODUCTION",
      "visualType": "IMAGE",
      "visualIntent": "Establish the main topic and introduce subject",
      "visualPriority": "HIGH",
      "primaryAsset": {
        "description": "High resolution photograph of main subject",
        "query": "cinematic subject portrait",
        "assetType": "image",
        "requirement": "Clean lighting, central subject"
      },
      "secondaryAsset": {
        "description": "Stock footage related to topic",
        "query": "modern office workplace",
        "assetType": "video",
        "requirement": "4k horizontal footage"
      },
      "fallbackVisual": {
        "type": "typography",
        "headline": "KEY CONCEPT",
        "subtext": "Main takeaway explanation",
        "keywordEmphasis": ["KEY", "CONCEPT"]
      },
      "onScreenText": "KEY CONCEPT INTRO",
      "textPriority": "HIGH",
      "animation": "slow_zoom_in",
      "transition": "soft_fade"
    }
  ]
}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  });

  const text = response.text || '';
  const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const raw = JSON.parse(cleanJson) as VideoBlueprint;

  if (!Array.isArray(raw.scenes) || raw.scenes.length === 0) {
    throw new Error('Gemini returned empty scenes array');
  }

  const validatedScenes: BlueprintScene[] = raw.scenes.map((s, idx) => {
    const startSeconds = Number.isFinite(s.startSeconds) ? Number(s.startSeconds) : idx * 6;
    const endSeconds = Number.isFinite(s.endSeconds) ? Number(s.endSeconds) : (idx + 1) * 6;
    const durationSeconds = Math.max(1, endSeconds - startSeconds);

    return {
      sceneNumber: idx + 1,
      startSeconds,
      endSeconds,
      durationSeconds,
      narrationText: String(s.narrationText || ''),
      chapterTitle: s.chapterTitle ? String(s.chapterTitle) : idx === 0 ? 'INTRODUCTION' : undefined,
      speakerInfo: s.speakerInfo?.name
        ? { name: String(s.speakerInfo.name), title: s.speakerInfo.title ? String(s.speakerInfo.title) : undefined }
        : undefined,
      visualType: validateVisualType(s.visualType),
      visualIntent: String(s.visualIntent || 'Support narration'),
      visualPriority: (s.visualPriority as VisualPriority) || 'MEDIUM',
      primaryAsset: {
        description: String(s.primaryAsset?.description || 'Main visual'),
        query: String(s.primaryAsset?.query || input.topicTitle || 'explainer visual'),
        assetType: s.primaryAsset?.assetType || 'image',
        requirement: String(s.primaryAsset?.requirement || 'Relevant to script'),
      },
      secondaryAsset: {
        description: String(s.secondaryAsset?.description || 'Alternative visual'),
        query: String(s.secondaryAsset?.query || 'abstract background'),
        assetType: s.secondaryAsset?.assetType || 'image',
        requirement: String(s.secondaryAsset?.requirement || 'Supporting visual'),
      },
      fallbackVisual: {
        type: s.fallbackVisual?.type || 'typography',
        headline: String(s.fallbackVisual?.headline || input.topicTitle || 'Key Point'),
        subtext: String(s.fallbackVisual?.subtext || s.narrationText?.slice(0, 60) || ''),
        statisticNumber: s.fallbackVisual?.statisticNumber,
        statisticLabel: s.fallbackVisual?.statisticLabel,
        keywordEmphasis: Array.isArray(s.fallbackVisual?.keywordEmphasis) ? s.fallbackVisual.keywordEmphasis.map(String) : [],
      },
      onScreenText: s.onScreenText ? String(s.onScreenText) : undefined,
      textPriority: (s.textPriority as TextPriority) || 'MEDIUM',
      animation: (s.animation as MotionAnimation) || 'slow_zoom_in',
      transition: (s.transition as TransitionType) || 'soft_fade',
    };
  });

  // Generate YouTube Timestamps string
  const youtubeTimestamps = validatedScenes
    .map((s) => `${formatTimestamp(s.startSeconds)} ${s.chapterTitle || s.onScreenText || s.fallbackVisual.headline || `Part ${s.sceneNumber}`}`)
    .join('\n');

  return {
    topicTitle: raw.topicTitle || input.topicTitle || 'Explainer Video',
    overallMood: raw.overallMood || 'informative',
    estimatedDurationSeconds: input.durationSeconds,
    totalScenes: validatedScenes.length,
    scenes: validatedScenes,
    youtubeTimestamps,
  };
}

function validateVisualType(type: unknown): VisualType {
  const valid: VisualType[] = [
    'IMAGE',
    'VIDEO_CLIP',
    'FACE_PERSON',
    'TYPOGRAPHY',
    'CHART_GRAPH',
    'DIAGRAM_INFOGRAPHIC',
    'B_ROLL',
    'SIMPLE_BACKGROUND',
  ];
  const str = String(type || '').toUpperCase() as VisualType;
  return valid.includes(str) ? str : 'IMAGE';
}

// ── Deterministic Fallback Blueprint Planner ───────────────────────────────

function buildFallbackBlueprint(input: PlanningInput): VideoBlueprint {
  const words = input.words;
  const duration = input.durationSeconds;
  const title = input.topicTitle || 'Long Video Pro';

  if (words.length === 0) {
    const timestampStr = `00:00 ${title}`;
    return {
      topicTitle: title,
      overallMood: 'informative',
      estimatedDurationSeconds: duration,
      totalScenes: 1,
      youtubeTimestamps: timestampStr,
      scenes: [
        {
          sceneNumber: 1,
          startSeconds: 0,
          endSeconds: duration,
          durationSeconds: duration,
          narrationText: input.transcript,
          chapterTitle: 'INTRODUCTION',
          visualType: 'TYPOGRAPHY',
          visualIntent: 'Display main title and key concepts',
          visualPriority: 'HIGH',
          primaryAsset: { description: 'Topic visual', query: title, assetType: 'image', requirement: 'High clarity' },
          secondaryAsset: { description: 'Abstract backdrop', query: 'modern gradient', assetType: 'image', requirement: 'Clean' },
          fallbackVisual: { type: 'typography', headline: title, subtext: input.transcript.slice(0, 80) },
          textPriority: 'HIGH',
          animation: 'slow_zoom_in',
          transition: 'soft_fade',
        },
      ],
    };
  }

  const targetSceneDuration = 8;
  const numScenes = Math.max(1, Math.ceil(duration / targetSceneDuration));
  const wordsPerScene = Math.max(1, Math.floor(words.length / numScenes));

  const scenes: BlueprintScene[] = [];

  for (let i = 0; i < numScenes; i++) {
    const startWordIdx = i * wordsPerScene;
    const endWordIdx = i === numScenes - 1 ? words.length - 1 : (i + 1) * wordsPerScene - 1;

    const startSec = words[startWordIdx]?.start ?? (i * duration) / numScenes;
    const endSec = words[endWordIdx]?.end ?? ((i + 1) * duration) / numScenes;
    const sceneText = words
      .slice(startWordIdx, endWordIdx + 1)
      .map((w) => w.word)
      .join(' ');

    const hasNumbers = /\b\d+(%|\$|k|M|B)?\b/.test(sceneText);
    const personMatch = sceneText.match(/\b(Elon Musk|Steve Jobs|Satya Nadella|Sundar Pichai|Bill Gates|Jeff Bezos|Mark Zuckerberg)\b/i);

    let visualType: VisualType = 'IMAGE';
    if (hasNumbers) visualType = 'CHART_GRAPH';
    else if (personMatch) visualType = 'FACE_PERSON';
    else if (i % 3 === 2) visualType = 'TYPOGRAPHY';

    const topKeywords = sceneText
      .split(/\s+/)
      .map((w) => w.replace(/[^a-zA-Z]/g, ''))
      .filter((w) => w.length > 4)
      .slice(0, 3);

    const mainKeyword = topKeywords[0] || title;
    const chapterTitle = i === 0 ? 'INTRODUCTION' : i === Math.floor(numScenes / 2) ? 'KEY INSIGHTS' : undefined;

    scenes.push({
      sceneNumber: i + 1,
      startSeconds: startSec,
      endSeconds: endSec,
      durationSeconds: Math.max(1, endSec - startSec),
      narrationText: sceneText,
      chapterTitle,
      speakerInfo: personMatch ? { name: personMatch[0], title: 'Key Figure' } : undefined,
      visualType,
      visualIntent: `Represent concept: ${mainKeyword}`,
      visualPriority: i === 0 ? 'HIGH' : 'MEDIUM',
      primaryAsset: {
        description: `Visual of ${mainKeyword}`,
        query: `${title} ${mainKeyword}`,
        assetType: 'image',
        requirement: 'High quality 16:9 visual',
      },
      secondaryAsset: {
        description: `B-roll footage of ${mainKeyword}`,
        query: `${mainKeyword} motion video`,
        assetType: 'video',
        requirement: 'HD background clip',
      },
      fallbackVisual: {
        type: visualType === 'CHART_GRAPH' ? 'chart' : 'typography',
        headline: mainKeyword.toUpperCase(),
        subtext: sceneText.slice(0, 70),
        statisticNumber: hasNumbers ? (sceneText.match(/\b\d+(%|\$|k|M|B)?\b/)?.[0] || '80%') : undefined,
        keywordEmphasis: topKeywords,
      },
      onScreenText: mainKeyword.toUpperCase(),
      textPriority: 'MEDIUM',
      animation: i % 2 === 0 ? 'slow_zoom_in' : 'pan_right',
      transition: 'soft_fade',
    });
  }

  const youtubeTimestamps = scenes
    .map((s) => `${formatTimestamp(s.startSeconds)} ${s.chapterTitle || s.onScreenText || s.fallbackVisual.headline || `Section ${s.sceneNumber}`}`)
    .join('\n');

  return {
    topicTitle: title,
    overallMood: 'informative',
    estimatedDurationSeconds: duration,
    totalScenes: scenes.length,
    youtubeTimestamps,
    scenes,
  };
}
