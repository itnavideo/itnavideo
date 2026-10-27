import { ReelWord, ReelTranscriptSegment } from './reelPlanner';
import { readUnifiedAssets } from './assetPicker';

export type BookSummarySceneType =
  | 'CAPTIONS'
  | 'KEY_IDEA'
  | 'QUOTE'
  | 'LESSON_TITLE'
  | 'BOOK_COVER'
  | 'COMPARISON'
  | 'KEY_STEPS'
  | 'STAT_INSIGHT'
  | 'CONCLUSION';

export interface BookSummaryScene {
  id: string;
  type: BookSummarySceneType;
  startSeconds: number;
  endSeconds: number;
  text?: string;
  subtitle?: string;
  lessonNumber?: number;
  authorName?: string;
  bookTitle?: string;
  assetUrl?: string; // Optional image url (Book cover, author portrait, reference image)
  assetType?: 'cover' | 'author' | 'reference';
  disabled?: boolean;
  // Dynamic scene variety props (learned from Faceless Video)
  comparisonLeft?: string;
  comparisonRight?: string;
  comparisonLeftTitle?: string;
  comparisonRightTitle?: string;
  steps?: string[];
  statValue?: string;
  statLabel?: string;
}

export interface BookSummaryMetadata {
  suggestedTitle: string;
  description: string;
  chapters: Array<{ timestamp: string; seconds: number; title: string }>;
  keyTakeaways: string[];
}

export interface BookSummaryPlan {
  scenes: BookSummaryScene[];
  metadata: BookSummaryMetadata;
}

export interface BookSummaryPlanRequest {
  transcript: string;
  words?: ReelWord[];
  timestampSegments?: ReelTranscriptSegment[];
  durationSeconds: number;
  bookTitle?: string;
  authorName?: string;
  bookCoverUrl?: string;
  authorPortraitUrl?: string;
  referenceImages?: string[];
}

/**
 * Validates whether a quote text exists in the spoken transcript (case-insensitive fuzzy match).
 */
export function validateQuoteInTranscript(quoteText: string, fullTranscript: string): boolean {
  if (!quoteText || !fullTranscript) return false;
  const cleanQuote = quoteText.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const cleanTranscript = fullTranscript.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  if (!cleanQuote) return false;

  // Exact substring match
  if (cleanTranscript.includes(cleanQuote)) return true;
  
  // Break into key words of 4+ chars
  const quoteWords = cleanQuote.split(/\s+/).filter(w => w.length > 3);
  if (quoteWords.length === 0) return true;
  
  let matchCount = 0;
  for (const word of quoteWords) {
    if (cleanTranscript.includes(word)) {
      matchCount++;
    }
  }
  return (matchCount / quoteWords.length) >= 0.7;
}

/**
 * Validates and repairs a Book Summary Plan according to strict business rules:
 * 1. No invalid overlaps or out-of-bound timestamps.
 * 2. Visual scene minimum visual duration is 2.0 seconds.
 * 3. Over-frequency guard (adaptive spacing between card scenes).
 * 4. QUOTE text must exist in the transcript; fallback to CAPTIONS if invalid.
 * 5. Audio duration ceiling check.
 * 6. Empty text cleanup.
 */
export function validateAndRepairBookSummaryPlan(
  plan: BookSummaryPlan,
  fullTranscript: string,
  totalDurationSeconds: number
): BookSummaryPlan {
  const maxDuration = Math.max(1, totalDurationSeconds);
  const validatedScenes: BookSummaryScene[] = [];

  let lastCardEndTime = -999;

  for (let i = 0; i < plan.scenes.length; i++) {
    const scene = { ...plan.scenes[i] };

    // 1. Timestamp safety bounds
    scene.startSeconds = Math.max(0, Math.min(scene.startSeconds, maxDuration - 0.5));
    scene.endSeconds = Math.max(scene.startSeconds + 0.5, Math.min(scene.endSeconds, maxDuration));

    // 2. Validate scene types (includes new diverse scene types)
    const validTypes: BookSummarySceneType[] = [
      'CAPTIONS',
      'KEY_IDEA',
      'QUOTE',
      'LESSON_TITLE',
      'BOOK_COVER',
      'COMPARISON',
      'KEY_STEPS',
      'STAT_INSIGHT',
      'CONCLUSION',
    ];
    if (!validTypes.includes(scene.type)) {
      scene.type = 'CAPTIONS';
    }

    const isVisualCard = scene.type !== 'CAPTIONS';

    // 3. Minimum duration rule (>= 2 seconds for visual cards)
    if (isVisualCard) {
      const duration = scene.endSeconds - scene.startSeconds;
      if (duration < 2.0) {
        const deficit = 2.0 - duration;
        if (scene.endSeconds + deficit <= maxDuration) {
          scene.endSeconds = scene.endSeconds + deficit;
        } else if (scene.startSeconds - deficit >= 0) {
          scene.startSeconds = scene.startSeconds - deficit;
        } else {
          scene.type = 'CAPTIONS';
        }
      }
    }

    // 4. Over-frequency guard (adaptive separation based on video duration)
    const minSeparation = totalDurationSeconds <= 45 ? 4 : (totalDurationSeconds <= 90 ? 7 : 10);
    if (scene.type !== 'CAPTIONS' && scene.type !== 'BOOK_COVER') {
      if (scene.startSeconds - lastCardEndTime < minSeparation) {
        // Too close to previous card -> Fallback to CAPTIONS
        scene.type = 'CAPTIONS';
      } else {
        lastCardEndTime = scene.endSeconds;
      }
    }

    // 5. QUOTE transcript validation
    if (scene.type === 'QUOTE') {
      const isValid = validateQuoteInTranscript(scene.text || '', fullTranscript);
      if (!isValid) {
        // Never invent quotes -> Fallback to CAPTIONS
        scene.type = 'CAPTIONS';
      }
    }

    // 6. Non-empty text check for visual scenes
    if (
      (scene.type === 'KEY_IDEA' ||
        scene.type === 'LESSON_TITLE' ||
        scene.type === 'QUOTE' ||
        scene.type === 'STAT_INSIGHT' ||
        scene.type === 'CONCLUSION') &&
      !scene.text?.trim()
    ) {
      scene.type = 'CAPTIONS';
    }

    validatedScenes.push(scene);
  }

  // Ensure timestamps are sorted
  validatedScenes.sort((a, b) => a.startSeconds - b.startSeconds);

  // Fallback metadata if empty
  const metadata: BookSummaryMetadata = {
    suggestedTitle: plan.metadata?.suggestedTitle || planRequestTitle(fullTranscript),
    description: plan.metadata?.description || `Key takeaways and core lessons from this audio summary.`,
    chapters:
      Array.isArray(plan.metadata?.chapters) && plan.metadata.chapters.length > 0
        ? plan.metadata.chapters
        : generateDefaultChapters(validatedScenes),
    keyTakeaways:
      Array.isArray(plan.metadata?.keyTakeaways) && plan.metadata.keyTakeaways.length > 0
        ? plan.metadata.keyTakeaways
        : extractKeyTakeawaysFromScenes(validatedScenes),
  };

  return {
    scenes: validatedScenes,
    metadata,
  };
}

function planRequestTitle(transcript: string): string {
  const words = transcript.trim().split(/\s+/).slice(0, 6).join(' ');
  return words ? `Book Summary: ${words}...` : 'Book Summary Video';
}

function generateDefaultChapters(scenes: BookSummaryScene[]): Array<{ timestamp: string; seconds: number; title: string }> {
  const chapters: Array<{ timestamp: string; seconds: number; title: string }> = [];
  const lessonScenes = scenes.filter(s => (s.type === 'LESSON_TITLE' || s.type === 'KEY_IDEA') && s.text);
  
  if (lessonScenes.length > 0) {
    lessonScenes.forEach((s, idx) => {
      const mins = Math.floor(s.startSeconds / 60);
      const secs = Math.floor(s.startSeconds % 60);
      const ts = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      chapters.push({
        timestamp: ts,
        seconds: s.startSeconds,
        title: s.text || `Key Insight #${idx + 1}`,
      });
    });
  } else {
    chapters.push({ timestamp: '00:00', seconds: 0, title: 'Introduction & Main Summary' });
  }

  return chapters;
}

function extractKeyTakeawaysFromScenes(scenes: BookSummaryScene[]): string[] {
  const takeaways = scenes
    .filter(s => (s.type === 'KEY_IDEA' || s.type === 'LESSON_TITLE' || s.type === 'KEY_STEPS' || s.type === 'CONCLUSION') && s.text)
    .map(s => s.text!.trim());
  return takeaways.length > 0 ? takeaways.slice(0, 5) : ['Understand core principles of the book', 'Apply practical insights to daily habits'];
}

/**
 * Helper to extract numeric stat values (e.g. "80/20", "1%", "10x", "$100k") from spoken segment
 */
function extractStatInsight(text: string): { statValue: string; statLabel: string } | null {
  const ratioMatch = text.match(/\b(80\/20|90\/10|70\/30|50\/50)\b/i);
  if (ratioMatch) {
    return { statValue: ratioMatch[1], statLabel: 'The Power Law Principle' };
  }
  const pctMatch = text.match(/\b(\d+(?:\.\d+)?%)\b/);
  if (pctMatch) {
    return { statValue: pctMatch[1], statLabel: 'Compounding Impact Metric' };
  }
  const multiMatch = text.match(/\b(\d+x)\b/i);
  if (multiMatch) {
    return { statValue: multiMatch[1].toUpperCase(), statLabel: 'Exponential Growth Multiplier' };
  }
  const currencyMatch = text.match(/\b(\$[\d,]+(?:\s*(?:k|m|b|million|billion))?)\b/i);
  if (currencyMatch) {
    return { statValue: currencyMatch[1].toUpperCase(), statLabel: 'Financial Benchmark Metric' };
  }
  const ruleMatch = text.match(/\b(1% rule|10,\s*000 hours|5 second rule|2 minute rule)\b/i);
  if (ruleMatch) {
    return { statValue: ruleMatch[1].toUpperCase(), statLabel: 'Core Behavioral Law' };
  }
  return null;
}

/**
 * Helper to extract comparison contrast (e.g. Old Habit vs Book Rule) from spoken segment
 */
function extractComparison(text: string): { left: string; right: string; leftTitle: string; rightTitle: string } | null {
  const contrastTriggers = [
    /\binstead of\s+([^,.;]+)[,;]\s*(?:try to|always|focus on|you must|do)?\s*([^,.;]+)/i,
    /\bthe difference between\s+([^,.;]+)\s+and\s+([^,.;]+)/i,
    /\bnot\s+([^,.;]+)[,;]\s*but\s+([^,.;]+)/i,
    /\b(poor|scarcity|reactive)\s+(?:mindset|people|habits?)\s+([^,.;]+)[,;]\s*(?:while|whereas|rich|abundance|proactive)\s+([^,.;]+)/i,
  ];

  for (const regex of contrastTriggers) {
    const match = text.match(regex);
    if (match && match[1] && match[2]) {
      const left = match[1].trim();
      const right = match[2].trim();
      if (left.length >= 6 && right.length >= 6) {
        return {
          leftTitle: 'THE OLD HABIT / MISTAKE',
          left: left.length > 50 ? `${left.slice(0, 48)}...` : left,
          rightTitle: 'THE BOOK PRINCIPLE',
          right: right.length > 50 ? `${right.slice(0, 48)}...` : right,
        };
      }
    }
  }

  // General fallback contrast trigger if " vs " or "versus" is present
  if (/\b(vs\.?|versus)\b/i.test(text)) {
    const parts = text.split(/\b(?:vs\.?|versus)\b/i);
    if (parts.length >= 2 && parts[0].trim().length >= 4 && parts[1].trim().length >= 4) {
      return {
        leftTitle: 'COMMON BELIEF',
        left: parts[0].trim().slice(0, 48),
        rightTitle: 'CORE INSIGHT',
        right: parts[1].trim().slice(0, 48),
      };
    }
  }

  return null;
}

/**
 * Local Deterministic AI Planner (Zero external LLM latency dependency fallback & primary deterministic generator)
 * Parses spoken segments & word timestamps to generate a dynamic, non-repeating Book Summary Plan.
 */
export function buildLocalBookSummaryPlan(request: BookSummaryPlanRequest): BookSummaryPlan {
  const {
    transcript,
    timestampSegments = [],
    durationSeconds,
    bookTitle,
    authorName,
    bookCoverUrl,
    authorPortraitUrl,
    referenceImages = [],
  } = request;

  const scenes: BookSummaryScene[] = [];
  const duration = Math.max(1, durationSeconds);

  // 1. Opening Scene: BOOK_COVER (if available) or LESSON_TITLE intro
  if (bookCoverUrl) {
    scenes.push({
      id: 'scene-intro-cover',
      type: 'BOOK_COVER',
      startSeconds: 0,
      endSeconds: Math.min(4, duration),
      bookTitle: bookTitle || 'Book Summary',
      authorName: authorName || '',
      assetUrl: bookCoverUrl,
      assetType: 'cover',
    });
  } else {
    scenes.push({
      id: 'scene-intro-title',
      type: 'LESSON_TITLE',
      startSeconds: 0,
      endSeconds: Math.min(3.5, duration),
      text: bookTitle || 'Book Summary Overview',
      subtitle: authorName ? `By ${authorName}` : 'Key Takeaways & Core Lessons',
    });
  }

  // 2. Scan segments for natural lesson titles, quotes, comparisons, stats, and key ideas
  const segments = timestampSegments.length > 0 ? timestampSegments : fallBackSegments(transcript, duration);
  
  let currentLessonCount = 1;
  let lastCardEndTime = 0;
  let lastCardType: BookSummarySceneType = bookCoverUrl ? 'BOOK_COVER' : 'LESSON_TITLE';
  let refImageIdx = 0;

  // Scene type rotation list to ensure diverse visual pacing without repeating the same card layout
  const rotationTypes: BookSummarySceneType[] = ['KEY_IDEA', 'COMPARISON', 'KEY_STEPS', 'STAT_INSIGHT'];
  let rotationIndex = 0;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const segText = seg.text.trim();
    const segDuration = seg.end - seg.start;
    const isFirstHalf = seg.start < duration * 0.5;
    const isNearEnd = seg.end > duration * 0.85;

    // A. Detect Lesson Titles
    const isLessonTrigger =
      /^(lesson|chapter|rule|principle|part|step|#?\d+)/i.test(segText) ||
      /\b(firstly|secondly|thirdly|the first key|the main lesson|key takeaway)\b/i.test(segText);

    if (isLessonTrigger && seg.start > 3.5 && segDuration >= 1.5) {
      scenes.push({
        id: `scene-lesson-${i}`,
        type: 'LESSON_TITLE',
        startSeconds: seg.start,
        endSeconds: seg.end,
        lessonNumber: currentLessonCount,
        text: segText.replace(/^(lesson|chapter|rule|principle)\s*\d*:\s*/i, ''),
        subtitle: `Core Insight #${currentLessonCount}`,
      });
      currentLessonCount++;
      lastCardEndTime = seg.end;
      lastCardType = 'LESSON_TITLE';
      continue;
    }

    // B. Detect Quotes
    const isQuoteTrigger = /"([^"]+)"/.test(segText) || /\b(quote|said|wrote|stating|he writes|she writes)\b/i.test(segText);
    if (isQuoteTrigger && segDuration >= 2.0 && seg.start > 5) {
      const match = segText.match(/"([^"]+)"/);
      const quoteContent = match ? match[1] : segText;
      
      if (validateQuoteInTranscript(quoteContent, transcript)) {
        scenes.push({
          id: `scene-quote-${i}`,
          type: 'QUOTE',
          startSeconds: seg.start,
          endSeconds: seg.end,
          text: quoteContent,
          authorName: authorName || 'The Author',
          assetUrl: authorPortraitUrl || undefined,
          assetType: authorPortraitUrl ? 'author' : undefined,
        });
        lastCardEndTime = seg.end;
        lastCardType = 'QUOTE';
        continue;
      }
    }

    // C. Pacing Interval: Check if enough time has passed to show another visual scene
    const cardInterval = duration <= 45 ? 6 : (duration <= 90 ? 12 : 22);
    const minSegLen = duration <= 45 ? 8 : 14;

    if (seg.start - lastCardEndTime >= cardInterval && segDuration >= 1.2 && segText.length >= minSegLen && segText.length <= 160) {
      const sceneEndTime = Math.min(duration, Math.max(seg.start + 2.5, seg.end));

      // 1. Check for Outro / CONCLUSION if in final 15% of video
      if (isNearEnd && lastCardType !== 'CONCLUSION' && scenes.filter(s => s.type === 'CONCLUSION').length === 0) {
        scenes.push({
          id: `scene-conclusion-${i}`,
          type: 'CONCLUSION',
          startSeconds: seg.start,
          endSeconds: sceneEndTime,
          text: segText,
          subtitle: bookTitle ? `Final Takeaway — ${bookTitle}` : 'Ultimate Action Step',
          authorName: authorName || 'Key Takeaway',
        });
        lastCardEndTime = sceneEndTime;
        lastCardType = 'CONCLUSION';
        continue;
      }

      // 2. Check for STAT_INSIGHT
      const stat = extractStatInsight(segText);
      if (stat && lastCardType !== 'STAT_INSIGHT') {
        scenes.push({
          id: `scene-stat-${i}`,
          type: 'STAT_INSIGHT',
          startSeconds: seg.start,
          endSeconds: sceneEndTime,
          text: segText,
          statValue: stat.statValue,
          statLabel: stat.statLabel,
          subtitle: bookTitle ? `${bookTitle} Metric` : 'Key Metric',
        });
        lastCardEndTime = sceneEndTime;
        lastCardType = 'STAT_INSIGHT';
        continue;
      }

      // 3. Check for COMPARISON
      const comp = extractComparison(segText);
      if (comp && lastCardType !== 'COMPARISON') {
        scenes.push({
          id: `scene-comp-${i}`,
          type: 'COMPARISON',
          startSeconds: seg.start,
          endSeconds: sceneEndTime,
          text: segText,
          subtitle: 'Paradigm Shift',
          comparisonLeft: comp.left,
          comparisonRight: comp.right,
          comparisonLeftTitle: comp.leftTitle,
          comparisonRightTitle: comp.rightTitle,
        });
        lastCardEndTime = sceneEndTime;
        lastCardType = 'COMPARISON';
        continue;
      }

      // 4. Non-repeating rotation across KEY_IDEA, KEY_STEPS, and COMPARISON
      let chosenType = rotationTypes[rotationIndex % rotationTypes.length];
      if (chosenType === lastCardType) {
        rotationIndex++;
        chosenType = rotationTypes[rotationIndex % rotationTypes.length];
      }
      rotationIndex++;

      // Pick asset for KEY_IDEA if available
      let assetUrl: string | undefined = undefined;
      let assetType: 'reference' | 'author' | 'cover' | undefined = undefined;
      if (referenceImages.length > 0 && refImageIdx < referenceImages.length) {
        assetUrl = referenceImages[refImageIdx % referenceImages.length];
        assetType = 'reference';
        refImageIdx++;
      } else if (authorPortraitUrl && isFirstHalf) {
        assetUrl = authorPortraitUrl;
        assetType = 'author';
      } else if (chosenType === 'KEY_IDEA') {
        // High-relevance educational diagram or framework match from cloud asset library
        try {
          const unified = readUnifiedAssets();
          const cleanTokens = segText.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3);
          const isDbBook = cleanTokens.some(t => ['database', 'sql', 'oracle', 'tablespace', 'query', 'schema', 'architecture'].includes(t));

          const candidates = unified.filter((a) => {
            if (!a.safeToUse || !a.src) return false;
            if (a.type !== 'image') return false;
            if (a.kind === 'icon' || a.kind === 'whiteboard') return false;
            if (a.category === 'oracle-database') return isDbBook;
            return a.category === 'diagrams' || a.category === 'backgrounds';
          });

          if (candidates.length > 0) {
            let bestAsset: any = null;
            let bestScore = 0;
            for (const cand of candidates) {
              const candTags = (cand.tags || []).map(t => t.toLowerCase());
              const candTitle = (cand.title || '').toLowerCase();
              let score = 0;
              for (const tok of cleanTokens) {
                if (candTags.some(tag => tag.includes(tok) || tok.includes(tag))) score += 3;
                if (candTitle.includes(tok)) score += 2;
              }
              if (score > bestScore) {
                bestScore = score;
                bestAsset = cand;
              }
            }
            if (bestAsset && bestScore >= 4) {
              assetUrl = bestAsset.src;
              assetType = 'reference';
            }
          }
        } catch {
          // Fallback safely to clean text-only card if asset matching is unavailable
        }
      }

      if (chosenType === 'KEY_STEPS') {
        // Build 3 actionable steps from segment or context
        const words = segText.split(' ');
        const step1 = words.slice(0, Math.ceil(words.length / 3)).join(' ') || 'Identify the core leverage point';
        const step2 = words.slice(Math.ceil(words.length / 3), Math.ceil((words.length * 2) / 3)).join(' ') || 'Apply daily systematic execution';
        const step3 = words.slice(Math.ceil((words.length * 2) / 3)).join(' ') || 'Compound results without friction';

        scenes.push({
          id: `scene-keysteps-${i}`,
          type: 'KEY_STEPS',
          startSeconds: seg.start,
          endSeconds: sceneEndTime,
          text: segText,
          subtitle: '3-Step Action Roadmap',
          steps: [step1, step2, step3],
        });
      } else if (chosenType === 'COMPARISON') {
        scenes.push({
          id: `scene-comp-rot-${i}`,
          type: 'COMPARISON',
          startSeconds: seg.start,
          endSeconds: sceneEndTime,
          text: segText,
          subtitle: 'Mindset Shift',
          comparisonLeftTitle: 'TRADITIONAL APPROACH',
          comparisonLeft: 'Reactive habits & short-term gratification',
          comparisonRightTitle: 'THE BOOK PRINCIPLE',
          comparisonRight: segText.length > 60 ? `${segText.slice(0, 58)}...` : segText,
        });
      } else if (chosenType === 'STAT_INSIGHT') {
        scenes.push({
          id: `scene-stat-rot-${i}`,
          type: 'STAT_INSIGHT',
          startSeconds: seg.start,
          endSeconds: sceneEndTime,
          text: segText,
          statValue: '80 / 20',
          statLabel: 'Pareto Law Takeaway',
          subtitle: bookTitle || 'Core Multiplier',
        });
      } else {
        // Fallback to KEY_IDEA
        scenes.push({
          id: `scene-keyidea-${i}`,
          type: 'KEY_IDEA',
          startSeconds: seg.start,
          endSeconds: sceneEndTime,
          text: segText,
          subtitle: bookTitle ? `Key Insight — ${bookTitle}` : 'Core Concept',
          assetUrl,
          assetType,
        });
      }

      lastCardEndTime = sceneEndTime;
      lastCardType = chosenType;
    }
  }

  // Ensure every book summary has at least 3-4 visual scenes with varied layouts for engaging pacing
  if (scenes.length <= 2 && segments.length > 0) {
    const candidateSegs = segments.filter(s => s.start >= 3.0 && s.text.trim().length >= 8);
    const step = Math.max(1, Math.floor(candidateSegs.length / 3));
    const fallbackTypes: BookSummarySceneType[] = ['KEY_IDEA', 'COMPARISON', 'KEY_STEPS'];

    for (let c = 0; c < candidateSegs.length && scenes.length < 4; c += step) {
      const seg = candidateSegs[c];
      const sceneType = fallbackTypes[c % fallbackTypes.length];
      const sceneEndTime = Math.min(duration, Math.max(seg.start + 2.5, seg.end));

      let assetUrl: string | undefined = undefined;
      let assetType: 'reference' | 'author' | 'cover' | undefined = undefined;
      if (referenceImages.length > 0) {
        assetUrl = referenceImages[c % referenceImages.length];
        assetType = 'reference';
      } else if (authorPortraitUrl) {
        assetUrl = authorPortraitUrl;
        assetType = 'author';
      }

      if (sceneType === 'COMPARISON') {
        scenes.push({
          id: `scene-auto-comp-${c}`,
          type: 'COMPARISON',
          startSeconds: seg.start,
          endSeconds: sceneEndTime,
          text: seg.text.trim(),
          subtitle: 'Mindset Shift',
          comparisonLeftTitle: 'OLD WAY',
          comparisonLeft: 'Unconscious repetition of past habits',
          comparisonRightTitle: 'NEW INSIGHT',
          comparisonRight: seg.text.trim(),
        });
      } else if (sceneType === 'KEY_STEPS') {
        scenes.push({
          id: `scene-auto-steps-${c}`,
          type: 'KEY_STEPS',
          startSeconds: seg.start,
          endSeconds: sceneEndTime,
          text: seg.text.trim(),
          subtitle: 'Key Action Steps',
          steps: ['Focus on high-leverage activities', 'Eliminate cognitive distractions', 'Review progress systematically'],
        });
      } else {
        scenes.push({
          id: `scene-auto-takeaway-${c}`,
          type: 'KEY_IDEA',
          startSeconds: seg.start,
          endSeconds: sceneEndTime,
          text: seg.text.trim(),
          subtitle: bookTitle ? `Key Insight — ${bookTitle}` : 'Core Takeaway',
          assetUrl,
          assetType,
        });
      }
    }
  }

  const rawPlan: BookSummaryPlan = {
    scenes,
    metadata: {
      suggestedTitle: bookTitle ? `${bookTitle} — Summary & Key Lessons` : planRequestTitle(transcript),
      description: `Deep dive audio summary of ${bookTitle || 'the book'}${authorName ? ` by ${authorName}` : ''}. Key takeaways and actionable lessons.`,
      chapters: [],
      keyTakeaways: [],
    },
  };

  return validateAndRepairBookSummaryPlan(rawPlan, transcript, duration);
}

function fallBackSegments(transcript: string, duration: number): ReelTranscriptSegment[] {
  const sentences = transcript.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length === 0) return [];
  
  const timePerSentence = duration / sentences.length;
  return sentences.map((sent, idx) => ({
    id: idx,
    start: idx * timePerSentence,
    end: (idx + 1) * timePerSentence,
    text: sent,
  }));
}
