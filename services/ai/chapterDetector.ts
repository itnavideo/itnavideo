export interface ChapterCardEvent {
  id: string;
  title: string;
  subtitle?: string;
  startFrame: number;
  endFrame: number;
}

export interface ChapterSegment {
  chapterIndex: number;
  title: string;
  startSeconds: number;
  endSeconds: number;
}

import { DEFAULT_FPS } from '../../remotion/constants';

/**
 * Automatically segments transcript chunks into key chapters and generates
 * animated lower-third chapter events for Remotion.
 */
export function detectChaptersFromTranscript(
  transcript: { text: string; start: number; end: number }[],
  fps: number = DEFAULT_FPS
): ChapterCardEvent[] {
  if (!transcript || transcript.length === 0) return [];

  const chapters: ChapterCardEvent[] = [];
  const totalChunks = transcript.length;

  // Segment transcript into 3-4 key chapters based on total length
  const chapterCount = totalChunks > 10 ? 3 : totalChunks > 5 ? 2 : 1;
  const chunksPerChapter = Math.ceil(totalChunks / chapterCount);

  for (let i = 0; i < chapterCount; i++) {
    const startIdx = i * chunksPerChapter;
    if (startIdx >= totalChunks) break;

    const chunk = transcript[startIdx];
    const text = chunk.text.trim();
    const words = text.split(/\s+/).map((w) => w.replace(/[^\w]/g, ''));
    const topic = words.slice(0, 4).join(' ').toUpperCase() || `TOPIC 0${i + 1}`;

    const startFrame = Math.floor(chunk.start * fps);
    const durationSeconds = 5;
    const endFrame = startFrame + Math.floor(durationSeconds * fps);

    chapters.push({
      id: `chapter-${i + 1}`,
      title: `CHAPTER 0${i + 1}`,
      subtitle: topic,
      startFrame,
      endFrame,
    });
  }

  return chapters;
}

