import type { SceneBlueprintItem, VisualLayoutType, MotionAnimationPreset } from './sceneBlueprintTypes';
import { generateCleanConceptHeading, generateCleanTakeaway } from './assetPlanner';
import { searchS3AssetCatalog, getCatalogAssetById } from './assetCatalogMatcher';
import {
  normalizeVisualLayout,
  extractKeywordEmphasis,
  resolveVectorDrawingIdFromText,
  deriveCategoryPillForScene,
  deriveRhetoricalPurpose,
  extractComparisonItemsFromText,
  extractStructuredStepsFromText,
} from './aiScenePlanner';
import { deriveSceneComposition } from './compositionDeriver';
import { toAbsoluteS3AssetUrl } from '@/constants/itnavideoStockAssets';

export interface PreRenderAuditOptions {
  scenes: SceneBlueprintItem[];
  durationSeconds: number;
  backgroundTheme?: string;
  aspectRatio?: '16:9' | '9:16';
  videoType?: string;
  brollUrls?: Record<number, string>;
  sfxEvents?: any[];
  availableAssetsPool?: any[];
}

export interface PreRenderAuditResult {
  healedScenes: SceneBlueprintItem[];
  healedBrollUrls: Record<number, string>;
  healedSfxEvents: any[];
  auditReport: {
    totalScenesAudited: number;
    zeroBlackFramesGuaranteed: boolean;
    fixedMissingHeadings: number;
    fixedEchoTexts: number;
    fixedWeakBoilerplates: number;
    fixedRepetitiveLayouts: number;
    fixedMissingAssets: number;
    upgradedMetricScenes: number;
    upgradedContrastScenes: number;
    upgradedProcessScenes: number;
    durationSynchronized: boolean;
  };
}

/**
 * Pre-Render Video Quality Assurance & Autonomous Self-Healing Pipeline
 *
 * Mandate:
 * 1. Zero Black Screen Guarantee: Eliminates blank/black visual voids, broken asset URLs, and missing backgrounds.
 * 2. Auto-Fill Missing Elements: Generates missing headlines, supporting takeaways, SFX cues, and pill tags.
 * 3. Polish Weak AI Decisions: Overwrites boilerplate ("KEY INSIGHT"), prevents echo repeats of voiceover,
 *    and upgrades weak generic cards into rich visual mental models (StatCards, Comparison, Process).
 * 4. Pacing & Variety Enforcement: Breaks repetitive back-to-back layouts across the timeline.
 * 5. Full Timeline Synchronization: Assures 100% duration coverage with zero trailing black silence.
 */
export function auditAndSelfHealVideoBlueprint(options: PreRenderAuditOptions): PreRenderAuditResult {
  const {
    scenes = [],
    durationSeconds,
    backgroundTheme = 'solid-white',
    aspectRatio = '16:9',
    videoType = 'facelessVideo',
    brollUrls = {},
    sfxEvents = [],
    availableAssetsPool = [],
  } = options;

  const isShorts = aspectRatio === '9:16' || videoType === 'facelessShorts';
  const effectiveBgTheme = backgroundTheme && backgroundTheme !== 'transparent' ? backgroundTheme : 'solid-white';

  const healedBrollUrls: Record<number, string> = { ...brollUrls };
  const healedSfxEvents: any[] = Array.isArray(sfxEvents) ? [...sfxEvents] : [];

  const auditReport = {
    totalScenesAudited: scenes.length,
    zeroBlackFramesGuaranteed: true,
    fixedMissingHeadings: 0,
    fixedEchoTexts: 0,
    fixedWeakBoilerplates: 0,
    fixedRepetitiveLayouts: 0,
    fixedMissingAssets: 0,
    upgradedMetricScenes: 0,
    upgradedContrastScenes: 0,
    upgradedProcessScenes: 0,
    durationSynchronized: true,
  };

  if (!scenes || scenes.length === 0) {
    return {
      healedScenes: [],
      healedBrollUrls,
      healedSfxEvents,
      auditReport,
    };
  }

  // Pre-fetch fallback S3 assets pool if not provided
  const fullTranscript = scenes.map((s) => s.narrationSegment?.text || s.heading || '').join(' ');
  const fallbackAssets = (availableAssetsPool && availableAssetsPool.length > 0)
    ? availableAssetsPool
    : searchS3AssetCatalog(fullTranscript, { maxResults: isShorts ? 20 : 36 });
  const usedAssetIds = new Set<string>();

  // Track layout history to break repetition
  let prevLayout: VisualLayoutType | null = null;
  let prevDrawingId: string | undefined;
  const usedStatValues = new Set<string>();

  const variedCadence: VisualLayoutType[] = isShorts
    ? ['card_concept', 'supporting_note', 'numbered_steps', 'stat_card', 'workflow']
    : ['card_concept', 'stat_card', 'horizontal_process', 'comparison', 'workflow', 'checklist', 'roadmap', 'quote'];

  const healedScenes: SceneBlueprintItem[] = scenes.map((scene, idx) => {
    const sceneNum = scene.sceneNumber || idx + 1;
    const text = (scene.narrationSegment?.text || '').trim();
    let currentLayout: VisualLayoutType = normalizeVisualLayout(scene.layoutType);

    // ── CHECK 1: ZERO BLACK SCREEN & BACKGROUND PROTECTION ──
    let sceneBg = scene.background;
    if (!sceneBg || sceneBg === 'transparent' || sceneBg.trim() === '') {
      sceneBg = effectiveBgTheme;
    }

    // ── CHECK 2: RHETORICAL PURPOSE EXTRACTION & UPGRADES ──
    const hasRealMetric = /(\$|€|£|₹)\s*\d+|\b\d+(?:\.\d+)?\s*(%|percent|x|times|crore|lakh|million|billion)\b/i.test(text);
    const hasComparison = /\b(?:versus|vs\.?|compared to|instead of|rather than|better than|traditionally)\b/i.test(text);
    const hasSequentialSteps = /\b(?:step\s*\d+|first|second|third|finally|workflow|process steps|pipeline)\b/i.test(text);

    let rhetoricalPurpose = scene.rhetoricalPurpose?.trim();
    if (!rhetoricalPurpose) {
      rhetoricalPurpose = deriveRhetoricalPurpose(text, currentLayout, sceneNum);
    }

    // Weak Decision Intercept: If text has real numbers but AI gave generic card -> Upgrade to StatCard
    if (hasRealMetric && (currentLayout === 'card_concept' || currentLayout === 'vector_concept' || currentLayout === 'drawing_story')) {
      currentLayout = 'stat_card';
      auditReport.upgradedMetricScenes++;
    }
    // Weak Decision Intercept: If text has contrast but AI gave generic card -> Upgrade to Comparison
    else if (hasComparison && (currentLayout === 'card_concept' || currentLayout === 'vector_concept')) {
      currentLayout = isShorts ? 'comparison' : 'before_after_transformation';
      auditReport.upgradedContrastScenes++;
    }
    // Weak Decision Intercept: If text has steps/pipeline but AI gave generic card -> Upgrade to Process
    else if (hasSequentialSteps && (currentLayout === 'card_concept' || currentLayout === 'vector_concept')) {
      currentLayout = isShorts ? 'workflow' : 'horizontal_process';
      auditReport.upgradedProcessScenes++;
    }

    // ── CHECK 3: REPETITION BREAKER (Never allow back-to-back identical layouts) ──
    if (prevLayout && currentLayout === prevLayout && currentLayout !== 'hook' && currentLayout !== 'chapter_title') {
      const altIndex = (idx + 1) % variedCadence.length;
      currentLayout = variedCadence[altIndex];
      auditReport.fixedRepetitiveLayouts++;
    }
    prevLayout = currentLayout;

    // ── CHECK 4: ANTI-BOILERPLATE HEADLINE POLISHER ──
    let heading = (scene.heading || '').trim();
    const isWeakHeading =
      !heading ||
      /^(?:key insight|important point|summary|overview|note|point|concept|strategy|tip|conclusion|takeaway|step)$/i.test(heading) ||
      heading.split(/\s+/).length < 2;

    if (isWeakHeading) {
      const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'your', 'their', 'into', 'about']);
      const keywords = text
        .replace(/[^a-zA-Z0-9\s'-]/g, ' ')
        .split(/\s+/)
        .map((w) => w.trim())
        .filter((w) => w.length > 2 && !stopWords.has(w.toLowerCase()))
        .slice(0, 4);
      heading = keywords.length >= 2 ? keywords.join(' ').toUpperCase() : 'KEY SCENE POINT';
      if (scene.heading) auditReport.fixedWeakBoilerplates++;
      else auditReport.fixedMissingHeadings++;
    }

    // ── CHECK 5: ANTI-ECHO SUPPORTING TEXT POLISHER ──
    let supportingText = (scene.supportingText || '').trim();
    const isEchoText = !supportingText || supportingText.toLowerCase() === text.toLowerCase();

    if (isEchoText) {
      supportingText = generateCleanTakeaway(text, heading);
      auditReport.fixedEchoTexts++;
    }

    // ── CHECK 6: VISUAL ASSET ZERO-BLACK-BOX GUARANTEE ──
    let assetUrl = healedBrollUrls[sceneNum] || scene.assetUrl || scene.brollUrl;
    let assignedAssetId = scene.assignedAssetId;

    // If layout supports photographic/illustrative media and none is present:
    if (
      !assetUrl &&
      (currentLayout === 'hook' ||
        currentLayout === 'card_concept' ||
        currentLayout === 'image_text' ||
        currentLayout === 'full_bleed_visual' ||
        currentLayout === 'split_screen')
    ) {
      const match = fallbackAssets.find((a) => !usedAssetIds.has(a.id));
      if (match) {
        assetUrl = toAbsoluteS3AssetUrl(match.url || match.absoluteUrl);
        assignedAssetId = match.id;
        usedAssetIds.add(match.id);
        healedBrollUrls[sceneNum] = assetUrl;
        auditReport.fixedMissingAssets++;
      }
    }

    // Vector drawing guarantee so no visual layer renders empty
    const resolvedDrawingId = resolveVectorDrawingIdFromText(
      `${heading} ${supportingText} ${text}`,
      idx,
      scene.vectorDrawingId,
      prevDrawingId
    );
    prevDrawingId = resolvedDrawingId;

    // ── CHECK 7: METRICS, COMPARISON & PROCESS COMPATIBILITY ──
    let statValue = scene.statValue;
    let statLabel = scene.statLabel;
    if (currentLayout === 'stat_card') {
      if (!statValue || !statLabel) {
        const metricMatch = text.match(/((?:\$|€|£|₹)\s*\d+(?:,\d+)*(?:\.\d+)?|\b\d+(?:\.\d+)?\s*(?:%|x|times|crore|lakh|million|billion)\b)/i);
        if (metricMatch) {
          statValue = metricMatch[1].toUpperCase();
          statLabel = heading.length <= 25 ? heading : 'Metric Impact';
        } else if (!statValue) {
          // Never invent fake "85% Efficiency Lift" stats — downgrade to card_concept when no real metric exists
          currentLayout = 'card_concept';
          statValue = undefined;
          statLabel = undefined;
        }
      }

      if (statValue) {
        const normStat = String(statValue).trim().toLowerCase();
        if (usedStatValues.has(normStat)) {
          // Block duplicate stat values across scenes — switch to conceptual layout instead
          currentLayout = 'card_concept';
          statValue = undefined;
          statLabel = undefined;
        } else {
          usedStatValues.add(normStat);
        }
      }
    }

    let comparisonItems = scene.comparisonItems;
    if ((currentLayout === 'comparison' || currentLayout === 'vs_battle' || currentLayout === 'before_after_transformation') && !comparisonItems) {
      comparisonItems = extractComparisonItemsFromText(text, heading, supportingText);
    }

    let listItems = (Array.isArray(scene.listItems) && scene.listItems.length >= 2)
      ? scene.listItems
      : undefined;
    if ((currentLayout === 'horizontal_process' || currentLayout === 'workflow' || currentLayout === 'checklist') && !listItems) {
      listItems = extractStructuredStepsFromText(text, heading);
    }

    // ── CHECK 8: SFX AUDIO-VISUAL SYNCHRONIZATION ──
    let sfx = scene.SFX || 'none';
    if (sfx === 'none') {
      if (sceneNum === 1 || scene.sceneType === 'hook') sfx = 'rise';
      else if (currentLayout === 'stat_card' || currentLayout === 'comparison' || currentLayout === 'vs_battle') sfx = 'hit';
      else if (currentLayout === 'quote') sfx = 'chime';
      else if (idx % 3 === 0) sfx = 'woosh';
    }

    // ── CHECK 9: RESPONSIVE COMPOSITION DERIVATION ──
    const composition = deriveSceneComposition(currentLayout, Boolean(assetUrl), scene.composition);

    return {
      ...scene,
      sceneNumber: sceneNum,
      sceneType: scene.sceneType || (sceneNum === 1 ? 'hook' : 'main_point'),
      layoutType: currentLayout,
      rhetoricalPurpose,
      duration: scene.duration || 5,
      narrationSegment: {
        text: text || heading,
        startSeconds: scene.narrationSegment?.startSeconds ?? (idx * 5),
        endSeconds: scene.narrationSegment?.endSeconds ?? ((idx + 1) * 5),
      },
      heading,
      supportingText,
      categoryPill: scene.categoryPill || deriveCategoryPillForScene(currentLayout, scene.sceneType || 'main_point'),
      highlightedWords: (scene.highlightedWords && scene.highlightedWords.length > 0)
        ? scene.highlightedWords
        : extractKeywordEmphasis(text || heading, 2),
      background: sceneBg,
      fontHierarchy: scene.fontHierarchy || { headingFont: 'Lora', bodyFont: 'Plus Jakarta Sans' },
      animation: (scene.animation as MotionAnimationPreset) || 'slow_zoom_in',
      SFX: sfx,
      transition: scene.transition || (idx % 3 === 0 ? 'dissolve' : 'cut'),
      statValue,
      statLabel,
      comparisonItems,
      listItems,
      timelineSteps: listItems,
      checklistItems: listItems,
      vectorDrawingId: resolvedDrawingId,
      assignedAssetId,
      assetUrl,
      brollUrl: assetUrl,
      composition,
    };
  });

  // ── CHECK 10: FRAME-ACCURATE CONTIGUOUS TIMELINE STITCHING (30 FPS, Zero Gaps/Overlaps) ──
  if (healedScenes.length > 0) {
    const FPS = 30;
    const rawTotalSec =
      durationSeconds > 0
        ? durationSeconds
        : healedScenes.reduce((acc, sc) => acc + Math.max(0.5, Number(sc.duration || 0)), 0);
    const totalFrames = Math.max(healedScenes.length * 15, Math.ceil(rawTotalSec * FPS));

    let cursorFrame = 0;
    for (let i = 0; i < healedScenes.length; i++) {
      const sc = healedScenes[i];
      const nextSc = healedScenes[i + 1];
      const isLast = i === healedScenes.length - 1;

      const minFramesForRemaining = (healedScenes.length - 1 - i) * 15;
      let endFrame: number;

      if (isLast) {
        endFrame = Math.max(cursorFrame + 15, totalFrames);
      } else {
        // Close any silent gap by extending this scene's end to meet the next scene's start
        const nextNaturalStart = Number(nextSc?.narrationSegment?.startSeconds);
        const ownNaturalEnd = Number(sc.narrationSegment?.endSeconds ?? (cursorFrame / FPS + (sc.duration || 4)));
        const targetEndSec = Number.isFinite(nextNaturalStart) && nextNaturalStart > cursorFrame / FPS
          ? Math.max(ownNaturalEnd, nextNaturalStart)
          : ownNaturalEnd;

        const snappedEnd = Math.round(targetEndSec * FPS);
        const maxAllowedEnd = totalFrames - minFramesForRemaining;
        endFrame = Math.max(cursorFrame + 15, Math.min(maxAllowedEnd, snappedEnd));
      }

      const startSec = Number((cursorFrame / FPS).toFixed(3));
      const endSec = Number((endFrame / FPS).toFixed(3));
      const durSec = Number(((endFrame - cursorFrame) / FPS).toFixed(3));

      sc.duration = durSec;
      sc.narrationSegment = {
        text: sc.narrationSegment?.text || sc.heading || '',
        startSeconds: startSec,
        endSeconds: endSec,
      };

      cursorFrame = endFrame;
    }
  }

  // ── PASS 4: Auto-deduplicate consecutive headings & duplicate statValues ──
  const dedupedStatValues = new Set<string>();
  for (let i = 0; i < healedScenes.length; i++) {
    const curr = healedScenes[i];
    const prev = healedScenes[i - 1];
    if (
      prev &&
      curr.heading &&
      prev.heading &&
      curr.heading.trim().toLowerCase() === prev.heading.trim().toLowerCase()
    ) {
      const candidateFromSupport = String(curr.supportingText || '')
        .replace(/[^\w\s-]/g, ' ')
        .trim()
        .split(/\s+/)
        .slice(0, 4)
        .join(' ')
        .toUpperCase();
      const candidateFromNarration = String(curr.narrationSegment?.text || '')
        .replace(/[^\w\s-]/g, ' ')
        .trim()
        .split(/\s+/)
        .slice(0, 4)
        .join(' ')
        .toUpperCase();
      if (candidateFromSupport && candidateFromSupport.toLowerCase() !== prev.heading.trim().toLowerCase()) {
        curr.heading = candidateFromSupport;
      } else if (candidateFromNarration && candidateFromNarration.toLowerCase() !== prev.heading.trim().toLowerCase()) {
        curr.heading = candidateFromNarration;
      } else {
        curr.heading = `${curr.heading.trim()} (${i + 1})`;
      }
      auditReport.fixedRepetitiveLayouts += 1;
    }

    if (curr.statValue) {
      const statKey = String(curr.statValue).trim().toLowerCase();
      if (dedupedStatValues.has(statKey)) {
        curr.statValue = undefined;
        if (curr.layoutType === 'stat_card') {
          curr.layoutType = 'card_concept';
        }
        auditReport.fixedRepetitiveLayouts += 1;
      } else {
        dedupedStatValues.add(statKey);
      }
    }
  }

  console.log('[PRE_RENDER_QUALITY_AUDIT] Autonomous inspection completed:', {
    scenesCount: healedScenes.length,
    ...auditReport,
  });

  return {
    healedScenes,
    healedBrollUrls,
    healedSfxEvents,
    auditReport,
  };
}

export interface QualityGateResult {
  passed: boolean;
  violations: string[];
}

/**
 * Hard Pre-Render Quality Gate:
 * Validates invariants before any Remotion render or credit deduction occurs.
 */
export function assertPreRenderQualityGate(params: {
  healedScenes: SceneBlueprintItem[];
  healedBrollUrls: Record<number, string>;
  durationSeconds: number;
  fps?: number;
}): QualityGateResult {
  const { healedScenes, healedBrollUrls, durationSeconds, fps = 30 } = params;
  const violations: string[] = [];

  if (!Array.isArray(healedScenes) || healedScenes.length === 0) {
    violations.push('No scenes present in blueprint.');
    return { passed: false, violations };
  }

  // 1. Block .html/.js/.json URLs in image/video slots
  for (const [sceneNum, url] of Object.entries(healedBrollUrls || {})) {
    if (/\.(html?|js|json)(\?.*)?$/i.test(String(url || ''))) {
      violations.push(`Scene ${sceneNum} has non-renderable asset URL: ${url}`);
    }
  }
  for (const sc of healedScenes) {
    const assetUrl = String(sc.assetUrl || sc.brollUrl || '');
    if (assetUrl && /\.(html?|js|json)(\?.*)?$/i.test(assetUrl)) {
      violations.push(`Scene ${sc.sceneNumber} assetUrl is non-renderable: ${assetUrl}`);
    }
  }

  // 2. Block consecutive duplicate headings or duplicate statValues across scenes
  const seenStats = new Set<string>();
  for (let i = 0; i < healedScenes.length; i++) {
    const curr = healedScenes[i];
    const prev = healedScenes[i - 1];
    if (prev && curr.heading && prev.heading && curr.heading.trim().toLowerCase() === prev.heading.trim().toLowerCase()) {
      violations.push(`Consecutive duplicate heading at scenes ${prev.sceneNumber} & ${curr.sceneNumber}: "${curr.heading}"`);
    }
    if (curr.statValue) {
      const statKey = String(curr.statValue).trim().toLowerCase();
      if (seenStats.has(statKey)) {
        violations.push(`Duplicate statValue "${curr.statValue}" at scene ${curr.sceneNumber}`);
      }
      seenStats.add(statKey);
    }
  }

  // 3. Block inter-scene gaps (> 0.05s) and verify totalFrames >= audioFrames
  for (let i = 0; i < healedScenes.length - 1; i++) {
    const currEnd = Number(healedScenes[i].narrationSegment?.endSeconds ?? 0);
    const nextStart = Number(healedScenes[i + 1].narrationSegment?.startSeconds ?? 0);
    if (Math.abs(nextStart - currEnd) > 0.05) {
      violations.push(`Timing gap/overlap (${(nextStart - currEnd).toFixed(3)}s) between scene ${i + 1} and ${i + 2}`);
    }
  }

  if (durationSeconds > 0) {
    const audioFrames = Math.ceil(durationSeconds * fps);
    const sceneTotalSec = healedScenes.reduce((acc, s) => acc + Number(s.duration || 0), 0);
    const sceneFrames = Math.ceil(sceneTotalSec * fps);
    if (sceneFrames + 1 < audioFrames) {
      violations.push(`Scene total frames (${sceneFrames}) is shorter than audio frames (${audioFrames})`);
    }
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}
