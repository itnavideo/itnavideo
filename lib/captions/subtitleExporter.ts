// lib/captions/subtitleExporter.ts
// Standardized SRT & VTT Subtitle Export Engine for YouTube Subtitle Generator

export interface CaptionChunkForExport {
  start: number;
  end: number;
  text: string;
  words?: Array<{ word: string; start: number; end: number }>;
}

function formatTimeSrt(seconds: number): string {
  const s = Math.max(0, seconds);
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = Math.floor(s % 60);
  const ms = Math.floor((s % 1) * 1000);

  const pad2 = (n: number) => String(n).padStart(2, '0');
  const pad3 = (n: number) => String(n).padStart(3, '0');

  return `${pad2(hrs)}:${pad2(mins)}:${pad2(secs)},${pad3(ms)}`;
}

function formatTimeVtt(seconds: number): string {
  const s = Math.max(0, seconds);
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = Math.floor(s % 60);
  const ms = Math.floor((s % 1) * 1000);

  const pad2 = (n: number) => String(n).padStart(2, '0');
  const pad3 = (n: number) => String(n).padStart(3, '0');

  return `${pad2(hrs)}:${pad2(mins)}:${pad2(secs)}.${pad3(ms)}`;
}

/**
 * Generate standard SubRip Subtitle (.srt) file content
 */
export function generateSrtContent(captions: CaptionChunkForExport[], casing: 'natural' | 'uppercase' = 'natural'): string {
  if (!captions || captions.length === 0) return '';

  return captions
    .map((chunk, index) => {
      const idx = index + 1;
      const startTime = formatTimeSrt(chunk.start);
      const endTime = formatTimeSrt(chunk.end);
      const rawText = String(chunk.text || '').trim();
      const text = casing === 'uppercase' ? rawText.toUpperCase() : rawText;

      return `${idx}\n${startTime} --> ${endTime}\n${text}\n`;
    })
    .join('\n');
}

/**
 * Generate standard WebVTT (.vtt) file content
 */
export function generateVttContent(captions: CaptionChunkForExport[], casing: 'natural' | 'uppercase' = 'natural'): string {
  if (!captions || captions.length === 0) return 'WEBVTT\n\n';

  const body = captions
    .map((chunk, index) => {
      const idx = index + 1;
      const startTime = formatTimeVtt(chunk.start);
      const endTime = formatTimeVtt(chunk.end);
      const rawText = String(chunk.text || '').trim();
      const text = casing === 'uppercase' ? rawText.toUpperCase() : rawText;

      return `${idx}\n${startTime} --> ${endTime}\n${text}\n`;
    })
    .join('\n');

  return `WEBVTT\n\n${body}`;
}
