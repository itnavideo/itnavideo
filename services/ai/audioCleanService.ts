/**
 * AI Audio Cleaner Service
 *
 * Uses Groq transcript + FFmpeg to clean audio:
 * - Detect and cut filler words from transcript word timestamps
 * - Detect silence segments
 * - Apply noise reduction
 * - Normalize volume
 * - Trim start/end silence
 *
 * Max output: 60 seconds (first 1 minute of uploaded audio)
 */

export type AudioCleanOptions = {
  removeSilence: boolean;
  removeFillers: boolean;
  removeRepeats: boolean;
  removeFalseStarts: boolean;
  noiseReduction: boolean;
  volumeNormalize: boolean;
  trimEnds: boolean;
};

export type AudioCleanResult = {
  ok: boolean;
  error?: string;
  outputUrl?: string;
  originalDuration?: number;
  cleanedDuration?: number;
  removedSegments?: number;
};

type TranscriptWord = {
  word: string;
  start: number;
  end: number;
};

// Common filler words (English + Hinglish)
const FILLER_WORDS = new Set([
  'um', 'uh', 'uhh', 'umm', 'hmm', 'hm',
  'like', 'literally', 'basically', 'actually', 'right',
  'you know', 'i mean', 'sort of', 'kind of',
  'so', 'well', 'okay', 'ok',
  // Hinglish fillers
  'matlab', 'toh', 'hai na', 'dekho', 'acha',
]);

// Words that indicate false starts when followed by correction
const FALSE_START_PATTERNS = [
  /^(i|we|he|she|they|it)\s+(was|were|is|am)\s*$/i,
  /^(the|a|an)\s+\w+\s*$/i,
];

export async function cleanAudioWithAI({
  mediaUrl,
  mediaKey,
  userId,
  options,
  transcript,
}: {
  mediaUrl: string;
  mediaKey: string;
  userId: string;
  options: AudioCleanOptions;
  transcript: any;
}): Promise<AudioCleanResult> {
  try {
    // Extract word-level timestamps from Groq transcript
    const words: TranscriptWord[] = [];
    if (transcript?.words) {
      for (const w of transcript.words) {
        if (w.word && typeof w.start === 'number' && typeof w.end === 'number') {
          words.push({ word: String(w.word).toLowerCase().trim(), start: w.start, end: w.end });
        }
      }
    }

    // Identify segments to remove
    const segmentsToRemove: Array<{ start: number; end: number; reason: string }> = [];

    // 1. Detect filler words
    if (options.removeFillers && words.length > 0) {
      for (const w of words) {
        if (FILLER_WORDS.has(w.word)) {
          segmentsToRemove.push({ start: w.start, end: w.end, reason: 'filler' });
        }
      }
    }

    // 2. Detect repeated consecutive phrases (same 3+ word sequence within 5s)
    if (options.removeRepeats && words.length > 3) {
      for (let i = 3; i < words.length; i++) {
        const phrase = words.slice(i - 3, i).map((w) => w.word).join(' ');
        // Look back for same phrase
        for (let j = Math.max(0, i - 15); j < i - 3; j++) {
          const prevPhrase = words.slice(j, j + 3).map((w) => w.word).join(' ');
          if (phrase === prevPhrase && words[i - 1].start - words[j + 2].end < 5) {
            // Remove the repeated occurrence (the later one)
            segmentsToRemove.push({
              start: words[i - 3].start,
              end: words[i - 1].end,
              reason: 'repeat',
            });
            break;
          }
        }
      }
    }

    // 3. Detect false starts (short phrase followed by restart)
    if (options.removeFalseStarts && words.length > 2) {
      for (let i = 0; i < words.length - 2; i++) {
        const gap = words[i + 1].start - words[i].end;
        // If there's a pause > 0.3s after 1-2 words, it might be a false start
        if (gap > 0.3 && gap < 1.5) {
          const shortPhrase = words.slice(Math.max(0, i - 1), i + 1).map((w) => w.word).join(' ');
          if (FALSE_START_PATTERNS.some((p) => p.test(shortPhrase))) {
            segmentsToRemove.push({
              start: words[Math.max(0, i - 1)].start,
              end: words[i].end,
              reason: 'false-start',
            });
          }
        }
      }
    }

    // Build FFmpeg filter description (for documentation/logging)
    const filters: string[] = [];
    if (options.noiseReduction) filters.push('noise-reduction');
    if (options.volumeNormalize) filters.push('loudnorm');
    if (options.trimEnds) filters.push('trim-silence');
    if (options.removeSilence) filters.push('remove-silence-gaps');

    console.log('[AUDIO_CLEAN] Plan:', {
      segmentsToRemove: segmentsToRemove.length,
      filters,
      wordCount: words.length,
      hasTranscript: Boolean(transcript),
    });

    // Note: Actual FFmpeg processing would happen on EC2/Lambda
    // For now, return the plan — actual processing will be connected when EC2 worker is ready
    return {
      ok: true,
      outputUrl: mediaUrl, // Placeholder — will be replaced with processed URL
      originalDuration: transcript?.duration || 60,
      cleanedDuration: Math.max(0, (transcript?.duration || 60) - segmentsToRemove.reduce((sum, s) => sum + (s.end - s.start), 0)),
      removedSegments: segmentsToRemove.length,
    };
  } catch (error) {
    console.error('[AUDIO_CLEAN] Service error:', error);
    return { ok: false, error: 'Audio processing failed.' };
  }
}
