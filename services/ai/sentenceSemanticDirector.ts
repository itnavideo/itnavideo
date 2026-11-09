/**
 * Sentence-by-Sentence Semantic Visual Alignment Engine
 *
 * Implements Rule 2 (Founder Directive):
 * For every spoken sentence, analyzes keywords, dominant emotion, and scene intent
 * (hook / stat / comparison / list / broll / vector), and precisely binds the
 * most relevant visual asset (from 500+ SVGs or 538 AWS S3 images) with zero random rotation.
 */

import { SceneBlueprintItem, VisualLayoutType } from './sceneBlueprintTypes';
import { resolveSvgFromMasterCatalog } from '@/lib/visuals/svgMasterCatalog';
import { getAllLibraryImages, type AiLibraryImage } from './aiImageLibrary';

export type DetectedEmotion =
  | 'curiosity'     // Opening hooks, surprising facts
  | 'inspiration'   // Mindset, self-improvement, vision
  | 'shock'         // Dramatic statements, unexpected turns
  | 'warning'       // Mistakes, pitfalls, caution
  | 'analytical'    // Numbers, formulas, statistics, charts
  | 'celebration';  // Success, milestones, victory, wealth

export interface SentenceAnalysisResult {
  sentenceIndex: number;
  sentenceText: string;
  coreTopic: string;
  primaryKeywords: string[];
  dominantEmotion: DetectedEmotion;
  sceneType: 'hook' | 'stat' | 'comparison' | 'list' | 'broll' | 'vector';
  layoutType: VisualLayoutType;
  heading: string;
  supportingText: string;
  categoryPill: string;
  statValue?: string;
  statLabel?: string;
  comparisonItems?: { left: string; right: string };
  listItems?: string[];
  matchedSvgId?: string;
  matchedS3ImageUrl?: string;
  sfxCue: 'whoosh' | 'pop' | 'hit' | 'ding' | 'alert' | 'none';
  cameraZoomScale: number;
}

// ── FAST DETERMINISTIC KEYWORD, EMOTION & SCENE-TYPE PARSER ────────────────
export function analyzeSentenceDeterministically(
  text: string,
  index: number,
  usedSvgIds: string[] = [],
  usedS3Urls: Set<string> = new Set()
): SentenceAnalysisResult {
  const clean = text.toLowerCase().trim();

  // 1. Detect Intent & Scene Type with strict priority rules
  const isHook = index === 0;

  // Rule 2.A: StatScene Detection (numbers, %, currency, multipliers, metrics)
  const numberRegex = /(\$|₹|€|£)?\s*(\d+[\d,.]*)\s*(%|x|times|k|m|b|lakh|crore|billion|million|percent)?/i;
  const numMatch = text.match(numberRegex);
  const metricKeywordsRegex = /\b(?:percent|percentage|increased by|dropped by|roi|stat|statistics|metric|ratio|times higher|times more|growth rate|revenue|profit|loss|salary|income|net worth|budget|savings)\b/i;
  const hasValidNumber = Boolean(
    numMatch && numMatch[2] && (numMatch[1] || numMatch[3] || numMatch[2].length > 1 || Number(numMatch[2]) >= 2)
  );
  const hasRealMetric = hasValidNumber || metricKeywordsRegex.test(clean);

  // Rule 2.B: ComparisonScene Detection ("vs", "versus", "better than", "instead of")
  const contrastRegex = /\b(?:instead of|versus|vs\.?|compared to|rather than|better than|worse than|not this|mistake vs|right way|wrong way|difference between|before vs after|old way|new way|muqable|behtar)\b/i;
  const hasContrast = contrastRegex.test(clean);

  // Rule 2.C: MilestoneLadder / Steps Detection ("step 1", "first", "second", "ladder")
  const listRegex = /\b(?:step 1|step 2|step 3|step one|step two|step three|first,|firstly|second,|secondly|third,|finally,|rule 1|rule 2|stage 1|phase 1|level 1|three things|3 tips|3 steps|3 habits|ladder|milestone|progression|roadmap|pehla step|doosra step)\b/i;
  const hasList = listRegex.test(clean);

  // Rule 2.D: B-Roll Keywords (Physical Objects & Real World Environments)
  const brollVisualKeywords = /\b(?:car|house|city|money|gold|gym|hospital|computer|office|beach|nature|mountain|crowd|airport|desk|luxury|cash|crypto|building|traffic)\b/i;
  const hasBrollKeywords = brollVisualKeywords.test(clean);

  let sceneType: SentenceAnalysisResult['sceneType'] = 'vector';
  let layoutType: VisualLayoutType = 'vector_concept';
  let sfxCue: SentenceAnalysisResult['sfxCue'] = 'whoosh';

  // PRIORITY SELECTION HIERARCHY:
  // Priority 1: Hook on Scene 0
  // Priority 2: StatScene on numbers/%/metric
  // Priority 3: ComparisonScene on vs/versus/better than
  // Priority 4: MilestoneLadder on step/sequence
  // Priority 5: B-Roll on tangible physical scenes
  // Priority 6: VectorConcept on abstract/mindset/drawing
  if (isHook) {
    sceneType = 'hook';
    layoutType = 'hook';
    sfxCue = 'whoosh';
  } else if (hasRealMetric) {
    sceneType = 'stat';
    layoutType = 'stat_card';
    sfxCue = 'hit';
  } else if (hasContrast) {
    sceneType = 'comparison';
    layoutType = 'comparison';
    sfxCue = 'hit';
  } else if (hasList) {
    sceneType = 'list';
    layoutType = 'milestone_ladder';
    sfxCue = 'pop';
  } else if (hasBrollKeywords && index % 2 === 1) {
    sceneType = 'broll';
    layoutType = 'full_bleed_visual';
    sfxCue = 'whoosh';
  }

  // 2. Detect Dominant Emotion
  let dominantEmotion: DetectedEmotion = 'curiosity';
  if (isHook) {
    dominantEmotion = 'curiosity';
  } else if (/\b(?:danger|warning|mistake|loss|lost|trap|ruin|fail|problem|risk|scam|never|worst)\b/i.test(clean)) {
    dominantEmotion = 'warning';
  } else if (/\b(?:shock|insane|unbelievable|crazy|never seen|secret|truth|revealed|exposed)\b/i.test(clean)) {
    dominantEmotion = 'shock';
  } else if (/\b(?:success|rich|million|win|winner|celebrate|profit|victory|freedom|scale|champion)\b/i.test(clean)) {
    dominantEmotion = 'celebration';
  } else if (hasRealMetric || /\b(?:calculate|percent|ratio|growth|data|formula|metric|graph|analysis)\b/i.test(clean)) {
    dominantEmotion = 'analytical';
  } else {
    dominantEmotion = 'inspiration';
  }

  // 3. Extract Keywords
  const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'your', 'about', 'what', 'when', 'where', 'which', 'will', 'would', 'could', 'have', 'been', 'there', 'their']);
  const tokens = clean.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3 && !stopWords.has(w));
  const primaryKeywords = tokens.slice(0, 3);

  // 4. Headline & Supporting Text
  const headingWords = tokens.slice(0, 4).map((w) => w.toUpperCase()).join(' ');
  const heading = isHook
    ? 'THE GOLDEN RULE'
    : hasRealMetric
    ? 'THE KEY METRIC'
    : hasContrast
    ? 'THE CRITICAL SHIFT'
    : hasList
    ? 'STEP-BY-STEP BLUEPRINT'
    : headingWords || 'CORE INSIGHT';

  const categoryPill =
    dominantEmotion === 'warning'
      ? 'CRITICAL WARNING'
      : dominantEmotion === 'celebration'
      ? 'PROVEN RESULT'
      : dominantEmotion === 'analytical'
      ? 'THE NUMBERS'
      : dominantEmotion === 'shock'
      ? 'SHOCKING TRUTH'
      : hasList
      ? 'EXECUTION STEP'
      : 'ACTION STEP';

  // 5. Context-Aware Props Extraction for Stat, Comparison & List
  let statValue: string | undefined = undefined;
  let statLabel: string | undefined = undefined;
  if (hasRealMetric) {
    if (numMatch && numMatch[2]) {
      const p = numMatch[1] || '';
      const v = numMatch[2] || '';
      const s = (numMatch[3] || '').toUpperCase();
      statValue = `${p}${v}${s}`.trim();
    } else {
      statValue = '+142%';
    }
    const cleanWithoutNum = clean.replace(numberRegex, '').trim();
    const metricWords = cleanWithoutNum.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3 && !stopWords.has(w));
    statLabel = metricWords.length > 0 ? metricWords.slice(0, 3).join(' ').toUpperCase() : 'PERFORMANCE GROWTH';
  }

  let comparisonItems: { left: string; right: string } | undefined = undefined;
  if (hasContrast) {
    const splitMatch = clean.split(/\b(?:versus|vs\.?|instead of|better than|rather than|compared to)\b/i);
    if (splitMatch.length >= 2 && splitMatch[0].trim() && splitMatch[1].trim()) {
      const leftWords = splitMatch[0].trim().split(/\s+/).slice(-3).join(' ');
      const rightWords = splitMatch[1].trim().split(/\s+/).slice(0, 3).join(' ');
      if (leftWords && rightWords) {
        comparisonItems = {
          left: leftWords.toUpperCase(),
          right: `${rightWords.toUpperCase()} (WINNER)`,
        };
      }
    }
    if (!comparisonItems) {
      comparisonItems = {
        left: 'Traditional Mistake',
        right: 'Pro Method (Winner)',
      };
    }
  }

  let listItems: string[] | undefined = undefined;
  if (hasList) {
    if (/step 1|first|phase 1|rule 1|pehla/i.test(clean)) {
      listItems = [
        'Step 1: Set Core Foundation (Active)',
        'Step 2: Execute Daily System',
        'Step 3: Measure & Automate',
      ];
    } else if (/step 2|second|phase 2|rule 2|doosra/i.test(clean)) {
      listItems = [
        'Step 1: Set Core Foundation',
        'Step 2: Execute Daily System (Active)',
        'Step 3: Measure & Automate',
      ];
    } else if (/step 3|third|finally|phase 3|rule 3/i.test(clean)) {
      listItems = [
        'Step 1: Set Core Foundation',
        'Step 2: Execute Daily System',
        'Step 3: Scale & Automate (Active)',
      ];
    } else {
      listItems = [
        '1. Clear High-Leverage Goal',
        '2. Consistent Daily Execution',
        '3. Long-Term Compounding',
      ];
    }
  }

  // 5. Visual Asset Matching: S3 Image vs 500+ SVG
  let matchedS3ImageUrl: string | undefined = undefined;
  let matchedSvgId: string | undefined = undefined;

  if (sceneType === 'broll') {
    try {
      const s3Catalog = getAllLibraryImages();
      const matched = s3Catalog.find((img) => {
        if (usedS3Urls.has(img.url)) return false;
        return img.tags.some((t) => tokens.includes(t.toLowerCase()));
      });
      if (matched && matched.url) {
        matchedS3ImageUrl = matched.url;
        usedS3Urls.add(matched.url);
      }
    } catch {}
  }

  // Always resolve semantic SVG concept from the 500+ catalog
  const svgMatch = resolveSvgFromMasterCatalog(text, usedSvgIds);
  matchedSvgId = svgMatch.id;

  // 6. Camera Punch-In Scaling
  const cameraZoomScale = dominantEmotion === 'shock' || dominantEmotion === 'warning'
    ? 1.18
    : index % 2 === 1
    ? 1.12
    : 1.0;

  return {
    sentenceIndex: index,
    sentenceText: text,
    coreTopic: tokens[0] || 'Insight',
    primaryKeywords,
    dominantEmotion,
    sceneType,
    layoutType,
    heading,
    supportingText: text,
    categoryPill,
    statValue: numMatch ? numMatch[1].toUpperCase() : undefined,
    statLabel: hasRealMetric ? (tokens[1] || 'Growth Metric').toUpperCase() : undefined,
    comparisonItems: hasContrast ? { left: 'Old Mistake', right: 'Pro Winner' } : undefined,
    listItems: hasList ? ['Point 1: Focus', 'Point 2: Execute', 'Point 3: Measure'] : undefined,
    matchedSvgId,
    matchedS3ImageUrl,
    sfxCue,
    cameraZoomScale,
  };
}

// ── LLM + DETERMINISTIC HYBRID SENTENCE DIRECTOR ───────────────────────────
/**
 * Executes semantic visual-to-speech alignment for every spoken sentence.
 * If Gemini API is available, enriches with deep contextual understanding.
 * Always guarantees 100% fast, robust fallback.
 */
export async function directSentenceVisuals(
  sentenceChunks: Array<{ id: number; text: string; start: number; end: number }>,
  topicTitle: string = 'Faceless Short'
): Promise<SentenceAnalysisResult[]> {
  const geminiApiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || '').trim();
  const results: SentenceAnalysisResult[] = [];
  const usedSvgIds: string[] = [];
  const usedS3Urls = new Set<string>();

  // ── LAYER 1: Primary Gemini 2.0 Flash Structured JSON Pass (Sub-second Context Awareness) ──
  if (geminiApiKey) {
    const startTime = Date.now();
    try {
      const prompt = `You are an elite short-form video director (CapCut & Vox style).
For each spoken sentence below, analyze its TRUE contextual meaning and return a high-precision structured scene blueprint.

CRITICAL SCENE CLASSIFICATION RULES (ZERO FALSE POSITIVES):
1. 'stat' (StatScene): ONLY choose 'stat' if the sentence discusses an ACTUAL quantitative metric, percentage, multiplier, revenue, profit, ROI, or compound statistic (e.g., "3X", "+47%", "$10,000", "1M views", "99% success").
   - NEVER choose 'stat' for casual numbers, calendar years ("in 2024"), clock times ("at 7 AM"), or mundane counts ("met 2 friends"). Those are 'vector' or 'broll'.
   - Extract 'statValue' (e.g., "3X", "47%", "$10K") and 'statLabel' (e.g., "REVENUE GROWTH", "RETENTION RATE").
2. 'comparison' (ComparisonScene): ONLY choose 'comparison' if there is an explicit contrast between two methods, mentalities, or choices (e.g. "manual work vs automation", "saving vs investing", "old way vs pro way").
   - Extract 'comparisonLeft' (e.g. "Manual Labor") and 'comparisonRight' (e.g. "AI Systems").
3. 'list' (MilestoneLadderScene): Choose if speaking about sequential steps or numbered rules ("step 1", "first step", "rule 2", "3 key habits").
4. 'broll' (FullBleedVisualScene): Choose if discussing physical objects or environments (luxury, cars, modern office, city skyline, laptop, cash, gym).
5. 'vector' (SVG Concept Scene): Choose for abstract psychology, mindset, strategy, vision, and storytelling.
6. 'hook' (HookScene): First sentence (id: 1) is always the retention hook.

For Hinglish or Hindi narration, translate the display 'heading', 'statLabel', and 'comparisonLeft/Right' into clean, punchy English uppercase words.

Sentences:
${JSON.stringify(sentenceChunks.map((s) => ({ id: s.id, text: s.text })), null, 2)}

Return strictly JSON with this schema:
{
  "analyses": [
    {
      "id": 1,
      "coreTopic": "2-3 word topic",
      "keywords": ["keyword1", "keyword2"],
      "emotion": "curiosity" | "inspiration" | "shock" | "warning" | "analytical" | "celebration",
      "sceneType": "hook" | "stat" | "comparison" | "list" | "broll" | "vector",
      "heading": "PUNCHY 2-4 WORD HEADING",
      "supportingText": "short punchy takeaway",
      "categoryPill": "BADGE NAME",
      "statValue": "e.g. 3X (only if true metric)",
      "statLabel": "e.g. GROWTH RATE",
      "comparisonLeft": "e.g. Old Way",
      "comparisonRight": "e.g. AI Way"
    }
  ]
}`;

      const modelName = (process.env.GEMINI_MODEL || 'gemini-2.0-flash').trim();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s hard timeout guard

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.15 },
          }),
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const payload = await res.json();
        const rawJson = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          if (Array.isArray(parsed?.analyses) && parsed.analyses.length > 0) {
            const analysisMap = new Map<number, any>();
            parsed.analyses.forEach((a: any) => analysisMap.set(Number(a.id), a));

            sentenceChunks.forEach((chunk, idx) => {
              const aiDecision = analysisMap.get(chunk.id);
              const base = analyzeSentenceDeterministically(chunk.text, idx, usedSvgIds, usedS3Urls);

              if (aiDecision) {
                const aiScene = String(aiDecision.sceneType || '').toLowerCase();
                let resolvedSceneType = base.sceneType;
                let resolvedLayoutType = base.layoutType;

                if (idx === 0) {
                  resolvedSceneType = 'hook';
                  resolvedLayoutType = 'hook_bold';
                } else if (aiScene === 'stat' && (aiDecision.statValue || base.statValue)) {
                  resolvedSceneType = 'stat';
                  resolvedLayoutType = 'stat_card';
                } else if (aiScene === 'comparison' && aiDecision.comparisonLeft && aiDecision.comparisonRight) {
                  resolvedSceneType = 'comparison';
                  resolvedLayoutType = 'comparison';
                } else if (aiScene === 'list') {
                  resolvedSceneType = 'list';
                  resolvedLayoutType = 'milestone_ladder';
                } else if (aiScene === 'broll') {
                  resolvedSceneType = 'broll';
                  resolvedLayoutType = 'full_bleed_visual';
                } else {
                  resolvedSceneType = 'vector';
                  resolvedLayoutType = 'vector_concept';
                }

                const enriched: SentenceAnalysisResult = {
                  ...base,
                  sceneType: resolvedSceneType,
                  layoutType: resolvedLayoutType,
                  coreTopic: aiDecision.coreTopic || base.coreTopic,
                  primaryKeywords: Array.isArray(aiDecision.keywords) && aiDecision.keywords.length > 0 ? aiDecision.keywords : base.primaryKeywords,
                  dominantEmotion: (aiDecision.emotion as DetectedEmotion) || base.dominantEmotion,
                  heading: aiDecision.heading ? String(aiDecision.heading).toUpperCase() : base.heading,
                  supportingText: aiDecision.supportingText || base.supportingText,
                  categoryPill: aiDecision.categoryPill ? String(aiDecision.categoryPill).toUpperCase() : base.categoryPill,
                  statValue: aiDecision.statValue || base.statValue,
                  statLabel: aiDecision.statLabel ? String(aiDecision.statLabel).toUpperCase() : base.statLabel,
                  comparisonItems: aiDecision.comparisonLeft && aiDecision.comparisonRight
                    ? { left: aiDecision.comparisonLeft, right: aiDecision.comparisonRight }
                    : base.comparisonItems,
                };

                usedSvgIds.push(enriched.matchedSvgId || '');
                results.push(enriched);
              } else {
                usedSvgIds.push(base.matchedSvgId || '');
                results.push(base);
              }
            });

            console.log(`[SemanticDirector] Gemini 2.0 Flash structured pass completed in ${Date.now() - startTime}ms (${results.length} scenes)`);
            return results;
          }
        }
      }
    } catch (err: any) {
      console.warn('[SemanticDirector] Gemini 2.0 Flash structured pass timed out or failed. Engaging zero-lag deterministic fallback:', err?.message || err);
    }
  }

  // ── LAYER 2: Deterministic Heuristic Fallback (Zero Downtime Guarantee) ──
  sentenceChunks.forEach((chunk, idx) => {
    const analysis = analyzeSentenceDeterministically(chunk.text, idx, usedSvgIds, usedS3Urls);
    usedSvgIds.push(analysis.matchedSvgId || '');
    results.push(analysis);
  });

  return results;
}
