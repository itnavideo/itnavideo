import { ReelWord, ReelTranscriptSegment } from './reelPlanner';

export type BookSummarySceneType = 'CAPTIONS' | 'KEY_IDEA' | 'QUOTE' | 'LESSON_TITLE' | 'BOOK_COVER';

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
 * 2. KEY_IDEA minimum visual duration is 2.0 seconds.
 * 3. KEY_IDEA over-frequency guard (at least 12 seconds spacing between KEY_IDEA scenes).
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

  let lastKeyIdeaEndTime = -999;

  for (let i = 0; i < plan.scenes.length; i++) {
    const scene = { ...plan.scenes[i] };

    // 1. Timestamp safety bounds
    scene.startSeconds = Math.max(0, Math.min(scene.startSeconds, maxDuration - 0.5));
    scene.endSeconds = Math.max(scene.startSeconds + 0.5, Math.min(scene.endSeconds, maxDuration));

    // 2. Validate scene types
    const validTypes: BookSummarySceneType[] = ['CAPTIONS', 'KEY_IDEA', 'QUOTE', 'LESSON_TITLE', 'BOOK_COVER'];
    if (!validTypes.includes(scene.type)) {
      scene.type = 'CAPTIONS';
    }

    // 3. KEY_IDEA minimum duration rule (>= 2 seconds)
    if (scene.type === 'KEY_IDEA') {
      const duration = scene.endSeconds - scene.startSeconds;
      if (duration < 2.0) {
        // Attempt timing repair
        const deficit = 2.0 - duration;
        if (scene.endSeconds + deficit <= maxDuration) {
          scene.endSeconds = scene.endSeconds + deficit;
        } else if (scene.startSeconds - deficit >= 0) {
          scene.startSeconds = scene.startSeconds - deficit;
        } else {
          // Unrepairable -> Fallback to CAPTIONS
          scene.type = 'CAPTIONS';
        }
      }
    }

    // 4. KEY_IDEA over-frequency guard (minimum 12s separation)
    if (scene.type === 'KEY_IDEA') {
      if (scene.startSeconds - lastKeyIdeaEndTime < 12) {
        // Too frequent -> Fallback to CAPTIONS
        scene.type = 'CAPTIONS';
      } else {
        lastKeyIdeaEndTime = scene.endSeconds;
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
    if ((scene.type === 'KEY_IDEA' || scene.type === 'LESSON_TITLE' || scene.type === 'QUOTE') && !scene.text?.trim()) {
      scene.type = 'CAPTIONS';
    }

    validatedScenes.push(scene);
  }

  // Ensure timestamps are sorted
  validatedScenes.sort((a, b) => a.startSeconds - b.startSeconds);

  // Fallback metadata if empty
  const metadata: BookSummaryMetadata = {
    suggestedTitle: plan.metadata?.suggestedTitle || (planRequestTitle(fullTranscript)),
    description: plan.metadata?.description || `Key takeaways and core lessons from this audio summary.`,
    chapters: Array.isArray(plan.metadata?.chapters) && plan.metadata.chapters.length > 0 ? plan.metadata.chapters : generateDefaultChapters(validatedScenes),
    keyTakeaways: Array.isArray(plan.metadata?.keyTakeaways) && plan.metadata.keyTakeaways.length > 0
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
  const lessonScenes = scenes.filter(s => s.type === 'LESSON_TITLE' && s.text);
  
  if (lessonScenes.length > 0) {
    lessonScenes.forEach((s, idx) => {
      const mins = Math.floor(s.startSeconds / 60);
      const secs = Math.floor(s.startSeconds % 60);
      const ts = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      chapters.push({
        timestamp: ts,
        seconds: s.startSeconds,
        title: s.text || `Lesson ${idx + 1}`,
      });
    });
  } else {
    chapters.push({ timestamp: '00:00', seconds: 0, title: 'Introduction & Main Summary' });
  }

  return chapters;
}

function extractKeyTakeawaysFromScenes(scenes: BookSummaryScene[]): string[] {
  const keyIdeas = scenes
    .filter(s => (s.type === 'KEY_IDEA' || s.type === 'LESSON_TITLE') && s.text)
    .map(s => s.text!.trim());
  return keyIdeas.length > 0 ? keyIdeas.slice(0, 5) : ['Understand core principles of the book', 'Apply practical insights to daily habits'];
}

/**
 * Local Deterministic AI Planner (Zero external LLM latency dependency fallback & primary deterministic generator)
 * Parses spoken segments & word timestamps to generate a balanced Book Summary Plan.
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

  // 2. Scan segments for natural lesson titles, quotes, and key ideas (approx 1 Key Idea every 25s)
  const segments = timestampSegments.length > 0 ? timestampSegments : fallBackSegments(transcript, duration);
  
  let currentLessonCount = 1;
  let lastKeyIdeaTime = 0;
  let refImageIdx = 0;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const segText = seg.text.trim();
    const segDuration = seg.end - seg.start;
    const isFirstHalf = seg.start < duration * 0.5;

    // Detect Lesson Titles
    const isLessonTrigger = /^(lesson|chapter|rule|principle|part|step|#?\d+)/i.test(segText) ||
      /\b(firstly|secondly|thirdly|the first key|the main lesson|key takeaway)\b/i.test(segText);

    if (isLessonTrigger && seg.start > 3.5 && (seg.end - seg.start) >= 1.5) {
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
      continue;
    }

    // Detect Quotes
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
        continue;
      }
    }

    // Key Idea spacing: approx 1 Key Idea every 25 seconds
    if (seg.start - lastKeyIdeaTime >= 24 && segDuration >= 2.0 && segText.length >= 15 && segText.length <= 120) {
      const isShortHeading = segText.split(' ').length <= 10;
      if (isShortHeading) {
        let assetUrl: string | undefined = undefined;
        let assetType: 'reference' | 'author' | 'cover' | undefined = undefined;

        if (referenceImages.length > 0 && refImageIdx < referenceImages.length) {
          assetUrl = referenceImages[refImageIdx % referenceImages.length];
          assetType = 'reference';
          refImageIdx++;
        } else if (authorPortraitUrl && isFirstHalf) {
          assetUrl = authorPortraitUrl;
          assetType = 'author';
        }

        scenes.push({
          id: `scene-keyidea-${i}`,
          type: 'KEY_IDEA',
          startSeconds: seg.start,
          endSeconds: Math.max(seg.start + 2.5, seg.end),
          text: segText,
          subtitle: bookTitle ? `Key Insight — ${bookTitle}` : 'Core Concept',
          assetUrl,
          assetType,
        });
        lastKeyIdeaTime = seg.end;
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
