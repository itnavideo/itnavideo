# AI Presentation Pipeline — Design

## Architecture Overview

```
User Upload → Groq Transcription → AI Presentation Pipeline → Template Adapter → Remotion Render
                                          │
                                    ┌─────┴─────┐
                                    │ ScenePlan[] │
                                    └─────┬─────┘
                                          │
                              ┌────────────┼────────────┐
                              ▼            ▼            ▼
                        Template A    Template B    Template C
                        (adapter)     (adapter)     (adapter)
                              │            │            │
                              ▼            ▼            ▼
                        inputProps    inputProps    inputProps
                              │            │            │
                              └────────────┼────────────┘
                                           ▼
                                    Remotion Lambda
```

---

## File Structure

```
services/
  ai/
    presentationPipeline/
      index.ts                    — Main entry: planPresentation(input, templateCapabilities)
      types.ts                    — ScenePlan, TemplateCapabilities, PipelineInput types
      scriptAnalyzer.ts           — Stage 2: content analysis
      sceneSegmenter.ts           — Stage 3: group into scenes
      visualAssigner.ts           — Stage 4: assign visual types
      assetResolver.ts            — Stage 5: match assets to scenes
      planValidator.ts            — Stage 6: validate timing/gaps
      geminiPlanner.ts            — AI call to Gemini for intelligent planning
      fallbackPlanner.ts          — Deterministic fallback when AI unavailable
      templateRegistry.ts         — Registry of template capabilities

remotion/
  templates/
    {TEMPLATE_NAME}/
      template.tsx                — Remotion component (renderer)
      adapter.ts                  — NEW: converts ScenePlan[] → template inputProps
      capabilities.ts             — NEW: declares what this template can render
```

---

## Core Types

```typescript
// services/ai/presentationPipeline/types.ts

export type SceneIntent =
  | 'hook'          // Opening attention grab
  | 'introduce'     // Introduce the topic
  | 'explain'       // Core explanation
  | 'compare'       // Side-by-side comparison
  | 'prove'         // Evidence, stat, example
  | 'list'          // Enumeration of items
  | 'question'      // Pose a question
  | 'answer'        // Answer the question
  | 'transition'    // Bridge between topics
  | 'warning'       // Caution or risk
  | 'conclude'      // Summary
  | 'cta';          // Call to action

export type VisualType =
  | 'typography'        // Big text, headlines, quotes
  | 'image'            // Full or partial image
  | 'video_clip'       // Embedded video segment
  | 'icon'             // Simple icon/illustration
  | 'screenshot'       // App/website screenshot
  | 'animation'        // Motion graphic
  | 'b_roll'           // Background footage
  | 'split_screen'     // Two panels side by side
  | 'sticker'          // Character/presenter
  | 'chart'            // Data visualization
  | 'step_indicator'   // Progress/step counter
  | 'before_after'     // Comparison slider
  | 'code_block'       // Code/terminal display
  | 'none';            // Just audio, no visual change

export type SceneMood =
  | 'neutral'
  | 'urgent'
  | 'inspiring'
  | 'warning'
  | 'celebratory'
  | 'questioning'
  | 'educational'
  | 'dramatic';

export type ScenePacing = 'quick_flash' | 'normal' | 'slow_emphasis';

export type ScenePlan = {
  id: string;
  start: number;
  end: number;
  intent: SceneIntent;
  text: string;
  emphasis: string;
  visualType: VisualType;
  visualDirection: string;
  mood: SceneMood;
  pacing: ScenePacing;
  assets: SceneAsset[];
  metadata?: Record<string, unknown>;
};

export type SceneAsset = {
  type: 'uploaded_image' | 'uploaded_video' | 'stock' | 'icon' | 'generated';
  src?: string;
  label?: string;
  role: 'primary' | 'secondary' | 'background';
};

export type TemplateCapabilities = {
  id: string;
  visualTypes: VisualType[];
  maxScenesPerMinute: number;
  supportsTransitions: boolean;
  supportsSplitScreen: boolean;
  supportsCharacter: boolean;
  supportsTypography: boolean;
  supportsCodeBlocks: boolean;
  aspectRatio: '9:16' | '16:9' | '1:1';
  minSceneDuration: number;  // seconds
  maxSceneDuration: number;  // seconds
};

export type PipelineInput = {
  transcript: string;
  words: Array<{ word: string; start: number; end: number }>;
  segments: Array<{ start: number; end: number; text: string }>;
  durationSeconds: number;
  templateCapabilities: TemplateCapabilities;
  userAssets?: SceneAsset[];       // uploaded images, clips
  topicTitle?: string;
  languageHint?: 'english' | 'hinglish';
};

export type PipelineOutput = {
  scenes: ScenePlan[];
  source: 'gemini' | 'fallback';
  analysisMetadata: {
    topicCount: number;
    questionCount: number;
    comparisonDetected: boolean;
    listDetected: boolean;
    averageSceneDuration: number;
  };
};
```

---

## Pipeline Flow

### Stage 1: Transcript Ingestion
- Already done by Groq (existing code)
- Input: `{ transcript, words[], segments[], durationSeconds }`

### Stage 2: Script Analysis (`scriptAnalyzer.ts`)
Local (no AI call). Fast text analysis:
- Detect topic shifts (new subject introduction)
- Detect questions (? or question phrases)
- Detect comparisons (vs, difference, dono)
- Detect lists (firstly, secondly, points)
- Detect facts/stats (numbers, percentages)
- Detect warnings (avoid, risk, galti)
- Detect conclusions (so basically, yaad rakho)

Output: annotated segments with detected intents.

### Stage 3: Scene Segmentation (`sceneSegmenter.ts`)
Local. Groups transcript segments into scenes:
- Minimum scene: `templateCapabilities.minSceneDuration` (default 3s)
- Maximum scene: `templateCapabilities.maxSceneDuration` (default 8s)
- Scene breaks at: topic shifts, sentence boundaries, intent changes
- Maximum scenes per minute: `templateCapabilities.maxScenesPerMinute`

### Stage 4: Visual Assignment (`visualAssigner.ts`)
**This is where Gemini comes in** (single AI call).

Gemini receives:
- The analyzed scenes (with intents, not raw text)
- Template capabilities (what visuals it can render)
- Available user assets

Gemini returns:
- For each scene: `visualType` + `visualDirection` + `mood`

Fallback (no AI): rule-based assignment:
- `hook` → typography
- `explain` → image or typography
- `compare` → split_screen
- `prove` → image or chart
- `question` → typography
- `cta` → typography

### Stage 5: Asset Resolution (`assetResolver.ts`)
Local. Matches available assets to scenes:
- User-uploaded images → matched to scenes needing images
- User-uploaded clips → matched to scenes needing video_clip
- Remaining needs → flagged as "stock" or "icon"

### Stage 6: Plan Validation (`planValidator.ts`)
Local. Ensures:
- No timing gaps (every second is covered)
- No overlaps
- No scene exceeds template max duration
- Visual types are all within template capabilities
- Replaces unsupported visual types with fallback

---

## Template Adapter Pattern

```typescript
// remotion/templates/{NAME}/adapter.ts

import type { ScenePlan, TemplateCapabilities } from '@/services/ai/presentationPipeline/types';

export const capabilities: TemplateCapabilities = {
  id: 'TEMPLATE_NAME',
  visualTypes: ['typography', 'image', 'icon', 'sticker'],
  maxScenesPerMinute: 10,
  supportsTransitions: true,
  supportsSplitScreen: false,
  supportsCharacter: true,
  supportsTypography: true,
  supportsCodeBlocks: false,
  aspectRatio: '9:16',
  minSceneDuration: 3,
  maxSceneDuration: 8,
};

export function adaptScenePlan(scenes: ScenePlan[]): Record<string, unknown> {
  // Convert universal scenes to this template's specific inputProps
  return {
    overlayTimeline: scenes.map(scene => ({
      id: scene.id,
      start: scene.start,
      end: scene.end,
      text: scene.text,
      type: mapIntentToOverlayType(scene.intent),
      layout: mapVisualToLayout(scene.visualType),
      // ... template-specific fields
    })),
    // ... other template-specific props
  };
}
```

---

## Integration with Existing Code

### What changes in `app/api/reels/jobs/route.ts`:

```typescript
// For new explanation video types:
if (templateUsesSharedPipeline(mode)) {
  const pipelineOutput = await planPresentation({
    transcript: renderWindow.transcript,
    words: renderWindow.words,
    segments: renderWindow.segments,
    durationSeconds: renderWindow.durationSeconds,
    templateCapabilities: getTemplateCapabilities(templateName),
    userAssets: resolveUserAssets(body),
    topicTitle,
    languageHint,
  });

  const inputProps = adaptScenePlan(templateName, pipelineOutput.scenes);
  // ... proceed to render with inputProps
}

// Existing types remain unchanged:
// Auto Caption → direct caption render (no pipeline)
// Long Video Promo → direct layout (no pipeline)
// Compare → existing flow + compareStickerPlanner
```

---

## Key Design Decisions

1. **One Gemini call** — only in Stage 4 (visual assignment). All other stages are local/deterministic.
2. **Template registers itself** — no hardcoded list. New template = new adapter file.
3. **Pipeline is optional** — simple types skip it entirely.
4. **Capabilities constrain output** — pipeline never assigns a visual type the template can't render.
5. **Fallback is always available** — deterministic planner produces basic but renderable output.
6. **Stateless** — no database, no cache. Same input → same output.

---

## Migration Path

1. Build pipeline core (`types.ts`, `index.ts`, basic stages)
2. Build Gemini visual assigner + fallback
3. Create first new template with adapter (proof of concept)
4. Gradually move Compare's sticker planning into the shared pipeline
5. Each new video type only needs: template.tsx + adapter.ts + capabilities.ts
