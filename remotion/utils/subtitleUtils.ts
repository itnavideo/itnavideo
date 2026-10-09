import { CaptionSegment, WordTiming } from '../types/subtitles';

export function getActiveCaption(
  captions: CaptionSegment[] = [],
  timeInSeconds: number
): CaptionSegment | null {
  if (!Array.isArray(captions) || captions.length === 0) return null;
  return (
    captions.find(
      (c) => timeInSeconds >= c.start && timeInSeconds <= c.end
    ) || null
  );
}

export function getActiveWord(
  words: WordTiming[] = [],
  timeInSeconds: number
): WordTiming | null {
  if (!Array.isArray(words) || words.length === 0) return null;
  return (
    words.find(
      (w) => timeInSeconds >= w.start && timeInSeconds <= w.end
    ) || null
  );
}

export function distributeWordTimings(
  text: string,
  start: number,
  end: number
): WordTiming[] {
  if (!text) return [];
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const totalDuration = Math.max(0.1, end - start);
  const durationPerWord = totalDuration / words.length;

  return words.map((word, index) => {
    const wordStart = start + index * durationPerWord;
    const wordEnd =
      index === words.length - 1 ? end : wordStart + durationPerWord;
    return {
      word,
      start: Number(wordStart.toFixed(3)),
      end: Number(wordEnd.toFixed(3)),
    };
  });
}

export function cleanWord(word?: string | null): string {
  if (!word) return '';
  return word.toLowerCase().replace(/[^\w\s\u0900-\u097F]/gi, '').trim();
}

export function isWordActive(wordA?: string | null, wordB?: string | null): boolean {
  if (!wordA || !wordB) return false;
  return cleanWord(wordA) === cleanWord(wordB);
}

export function getFontSize(size?: 'small' | 'medium' | 'large' | 'xlarge'): number {
  switch (size) {
    case 'small':
      return 36;
    case 'medium':
      return 48;
    case 'large':
      return 64;
    case 'xlarge':
      return 80;
    default:
      return 48;
  }
}

