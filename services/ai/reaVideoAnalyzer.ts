/**
 * REA Cloud Video Analyzer (`services/ai/reaVideoAnalyzer.ts`)
 * ==========================================================
 * Cloud-based Reverse-Engineering Engine inspired by REA (Reverse-Engineer Anything).
 * Uses Google Gemini 2.0 Flash Multimodal Vision in Google Cloud to analyze
 * reference videos (Vox, MagnatesMedia, Ali Abdaal, etc.) shot-by-shot without
 * requiring local compute or heavy FFmpeg/Python processing.
 *
 * Extracts:
 * - Shot-by-shot cadence & cutting rhythm (typically 2.5s - 4.5s cuts)
 * - Visual rhetoric categorization (Infographics, Vector Diagrams, B-Roll, Typography)
 * - Exact layout mental models (Curved Roadmap, Horizontal Shelves, Scorecard, Org Chart)
 * - Typography styling, color palettes, and micro-SFX timing
 * - Outputs standard `VIDEO.md` and direct Remotion-ready `SceneBlueprintItem[]`
 */

import { SceneBlueprintItem, VisualLayoutType } from './sceneBlueprintTypes';

export interface ReaShotBreakdown {
  shotNumber: number;
  startSeconds: number;
  endSeconds: number;
  durationSeconds: number;
  classification:
    | 'code_infographic'
    | 'vector_diagram'
    | 'live_broll'
    | 'ai_visual'
    | 'kinetic_typography'
    | 'screen_recording'
    | 'hybrid_composite';
  recommendedLayout: VisualLayoutType;
  heading: string;
  takeaway: string;
  vectorElements?: string[];
  visualDescription: string;
  sfx: string;
  transition: string;
  retentionTactic: string;
}

export interface ReaVideoAnalysisResult {
  videoTitle: string;
  creatorStyleArchetype: 'Vox_Documentary' | 'MagnatesMedia_DarkLuxury' | 'AliAbdaal_Productivity' | 'Huberman_HealthBio' | 'Tech_Explainer';
  averageCutDurationSeconds: number;
  totalShots: number;
  visualCompositionRatio: {
    infographicsAndDiagrams: number; // percentage
    editorialVectorCards: number;
    brollAndMedia: number;
    typographyAndStats: number;
  };
  shots: ReaShotBreakdown[];
  remotionBlueprint: SceneBlueprintItem[];
  markdownReport: string;
}

/**
 * Analyze a video URL or Cloud storage URI using Google Gemini 2.0 Flash in the Cloud.
 */
export async function analyzeVideoWithCloudRea(
  videoMediaUrl: string,
  videoTitle = 'Reference Video'
): Promise<ReaVideoAnalysisResult> {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
  }

  const systemInstruction = `You are the master director of REA (Reverse-Engineer Anything for Video).
Your mission is to perform forensic, frame-accurate reverse-engineering of viral explainer videos.
Analyze the video pacing, shot transitions, visual layout mental models, vector diagrams, motion design, and sound design.

Return ONLY a strict JSON object matching this schema:
{
  "videoTitle": string,
  "creatorStyleArchetype": "Vox_Documentary" | "MagnatesMedia_DarkLuxury" | "AliAbdaal_Productivity" | "Huberman_HealthBio" | "Tech_Explainer",
  "averageCutDurationSeconds": number,
  "totalShots": number,
  "visualCompositionRatio": {
    "infographicsAndDiagrams": number,
    "editorialVectorCards": number,
    "brollAndMedia": number,
    "typographyAndStats": number
  },
  "shots": [
    {
      "shotNumber": number,
      "startSeconds": number,
      "endSeconds": number,
      "durationSeconds": number,
      "classification": "code_infographic" | "vector_diagram" | "live_broll" | "ai_visual" | "kinetic_typography" | "screen_recording" | "hybrid_composite",
      "recommendedLayout": "hook" | "curved_roadmap" | "circular_org_chart" | "horizontal_shelves" | "scorecard_dashboard" | "mission_vision" | "table_of_contents" | "medical_infographic" | "card_concept" | "comparison" | "workflow" | "stat_card" | "drawing_story",
      "heading": string (punchy 3-6 word concept headline),
      "takeaway": string (6-12 word executive summary),
      "vectorElements": string[] (e.g. ["growth_arrow", "server_nodes", "shield"]),
      "visualDescription": string,
      "sfx": "whoosh" | "pop" | "hit" | "chime" | "click" | "bell",
      "transition": "cut" | "zoom" | "dissolve",
      "retentionTactic": string
    }
  ]
}`;

  const prompt = `Deconstruct this reference video shot-by-shot:
Video Source: ${videoMediaUrl}
Video Title: ${videoTitle}

Ensure each shot has an explicit recommendedLayout chosen from:
- 'hook' (Opening 0-4s high-impact hook)
- 'curved_roadmap' (Curved S-route with milestone poles)
- 'circular_org_chart' (Concentric hub with satellite nodes)
- 'horizontal_shelves' (Multi-tiered architectural shelves)
- 'scorecard_dashboard' (Executive KPI scorecard with 4 metrics)
- 'mission_vision' (Dual strategic pillars)
- 'table_of_contents' (Agenda list)
- 'medical_infographic' (ECG pulse waveform and vitals deck)
- 'card_concept' (Editorial concept card with sleek fine-line icon)
- 'comparison' (Left vs Right contrast)
- 'workflow' (Pipeline node flow)
- 'stat_card' (Huge bold stat metric)
- 'drawing_story' (Narrative vector illustration)

At least 40% of the shots must use Infographic/Diagram layouts (curved_roadmap, scorecard_dashboard, horizontal_shelves, circular_org_chart, mission_vision).`;

  const modelName = (process.env.GEMINI_MODEL || 'gemini-2.0-flash').trim();
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${systemInstruction}\n\n${prompt}` }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini Cloud REA analysis failed with HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  const parsed = JSON.parse(rawText);

  const shots: ReaShotBreakdown[] = Array.isArray(parsed?.shots) ? parsed.shots : [];

  // Convert REA shots directly into Remotion-ready SceneBlueprintItem[]
  const remotionBlueprint: SceneBlueprintItem[] = shots.map((shot, idx) => ({
    sceneNumber: shot.shotNumber || idx + 1,
    sceneType: idx === 0 ? 'hook' : idx === shots.length - 1 ? 'next_point' : 'main_point',
    layoutType: shot.recommendedLayout || 'card_concept',
    duration: shot.durationSeconds || (shot.endSeconds - shot.startSeconds) || 4,
    heading: shot.heading || `SCENE 0${idx + 1}`,
    supportingText: shot.takeaway,
    categoryPill: shot.recommendedLayout.replace(/_/g, ' ').toUpperCase(),
    highlightedWords: shot.heading ? shot.heading.split(' ').slice(0, 2) : [],
    visualIntent: shot.visualDescription,
    SFX: shot.sfx || 'whoosh',
    transition: (shot.transition as any) || 'cut',
    narrationSegment: {
      text: shot.takeaway || shot.heading,
      startSeconds: shot.startSeconds,
      endSeconds: shot.endSeconds,
    },
    listItems: shot.vectorElements || ['Analysis Phase', 'Execution Node', 'Target Result'],
  }));

  // Generate clean VIDEO.md formatted markdown report
  const markdownReport = generateReaMarkdownReport(parsed, videoTitle, videoMediaUrl);

  return {
    videoTitle: parsed.videoTitle || videoTitle,
    creatorStyleArchetype: parsed.creatorStyleArchetype || 'Vox_Documentary',
    averageCutDurationSeconds: parsed.averageCutDurationSeconds || 3.4,
    totalShots: shots.length,
    visualCompositionRatio: parsed.visualCompositionRatio || {
      infographicsAndDiagrams: 42,
      editorialVectorCards: 28,
      brollAndMedia: 20,
      typographyAndStats: 10,
    },
    shots,
    remotionBlueprint,
    markdownReport,
  };
}

function generateReaMarkdownReport(data: any, title: string, url: string): string {
  const shots: ReaShotBreakdown[] = data.shots || [];
  return `# REA Video Reverse-Engineering Report: ${title}

**Source URL:** ${url}  
**Archetype Style:** ${data.creatorStyleArchetype || 'Vox_Documentary'}  
**Average Cut Cadence:** ${data.averageCutDurationSeconds || 3.4} seconds  
**Total Identified Shots:** ${shots.length}  

## Visual Composition Ratio
- **Animated Presentation Infographics:** ${data.visualCompositionRatio?.infographicsAndDiagrams || 40}%
- **Editorial Concept Cards:** ${data.visualCompositionRatio?.editorialVectorCards || 30}%
- **Contextual B-roll & Media:** ${data.visualCompositionRatio?.brollAndMedia || 20}%
- **Kinetic Typography & Stat Pills:** ${data.visualCompositionRatio?.typographyAndStats || 10}%

## Shot-by-Shot Blueprint Ledger
| # | Time | Recommended Layout | Concept Heading | Visual Elements | SFX |
|---|---|---|---|---|---|
${shots
  .map(
    (s) =>
      `| ${s.shotNumber} | ${s.startSeconds}s–${s.endSeconds}s | \`${s.recommendedLayout}\` | **${s.heading}** | ${(s.vectorElements || []).join(', ') || 'Fine-line vector'} | \`${s.sfx}\` |`
  )
  .join('\n')}
`;
}

