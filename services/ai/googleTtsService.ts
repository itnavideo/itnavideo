import { getGcpAccessToken } from './googleCloudService';
import { GOOGLE_AI_VOICES, GoogleAiVoice } from '@/constants/googleAiVoices';

export { GOOGLE_AI_VOICES };
export type { GoogleAiVoice };


export interface SynthesizeSpeechParams {
  text: string;
  voiceId?: string;
  speakingRate?: number;
  pitch?: number;
}

export interface SynthesizeSpeechResult {
  success: boolean;
  audioBase64?: string;
  mimeType?: string;
  voiceId?: string;
  voiceName?: string;
  characterCount?: number;
  error?: string;
}

// Google Cloud TTS accepts up to 5,000 bytes per request. We keep a safe margin
// and chunk on sentence boundaries. Image to Video AI is capped at ~5 minutes
// (~4,500 chars), so most scripts fit in a single chunk; chunking only kicks in
// for edge cases just over the limit.
const TTS_CHUNK_CHAR_LIMIT = 4500;

/**
 * Split text into chunks no larger than the TTS limit, preferring sentence
 * boundaries, then word boundaries, then a hard cut as a last resort.
 */
export function chunkTextForTts(text: string, limit = TTS_CHUNK_CHAR_LIMIT): string[] {
  const clean = text.trim();
  if (clean.length <= limit) return [clean];

  const chunks: string[] = [];
  // Split into sentences while keeping the terminating punctuation.
  const sentences = clean.match(/[^.!?\n]+[.!?\n]*/g) || [clean];

  let current = '';
  const pushCurrent = () => {
    if (current.trim()) chunks.push(current.trim());
    current = '';
  };

  for (const sentence of sentences) {
    if (sentence.length > limit) {
      // A single sentence is too long — break it on word boundaries.
      pushCurrent();
      const words = sentence.split(/\s+/);
      let line = '';
      for (const word of words) {
        if ((line + ' ' + word).trim().length > limit) {
          if (line.trim()) chunks.push(line.trim());
          // If a single word somehow exceeds the limit, hard-cut it.
          if (word.length > limit) {
            for (let i = 0; i < word.length; i += limit) {
              chunks.push(word.slice(i, i + limit));
            }
            line = '';
          } else {
            line = word;
          }
        } else {
          line = (line ? line + ' ' : '') + word;
        }
      }
      if (line.trim()) chunks.push(line.trim());
      continue;
    }

    if ((current + sentence).length > limit) {
      pushCurrent();
      current = sentence;
    } else {
      current += sentence;
    }
  }
  pushCurrent();

  return chunks.filter(Boolean);
}

async function synthesizeChunk(
  chunkText: string,
  voice: GoogleAiVoice,
  speakingRate: number,
  pitch: number,
  token: string,
): Promise<{ base64: string } | { error: string }> {
  const res = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: { text: chunkText },
      voice: {
        languageCode: voice.languageCode,
        name: voice.id,
        ssmlGender: voice.gender,
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: Math.max(0.25, Math.min(speakingRate, 2.0)),
        pitch: Math.max(-10.0, Math.min(pitch, 10.0)),
        sampleRateHertz: 24000,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('[GOOGLE_TTS] API error:', res.status, errText);
    return { error: `Google TTS returned HTTP ${res.status}` };
  }

  const data = await res.json();
  if (!data.audioContent) {
    return { error: 'No audio content received from Google TTS' };
  }
  return { base64: data.audioContent };
}

export async function synthesizeSpeechWithGoogleTts({
  text,
  voiceId = 'hi-IN-Neural2-B',
  speakingRate = 1.0,
  pitch = 0.0,
}: SynthesizeSpeechParams): Promise<SynthesizeSpeechResult> {
  const cleanText = text?.trim();
  if (!cleanText) {
    return { success: false, error: 'Text prompt or script cannot be empty' };
  }

  const voice = GOOGLE_AI_VOICES.find((v) => v.id === voiceId) || GOOGLE_AI_VOICES[0];

  const token = await getGcpAccessToken();
  if (!token) {
    return { success: false, error: 'Unable to authenticate with Google Cloud services' };
  }

  try {
    const chunks = chunkTextForTts(cleanText);

    const audioBuffers: Buffer[] = [];
    for (const chunk of chunks) {
      const result = await synthesizeChunk(chunk, voice, speakingRate, pitch, token);
      if ('error' in result) {
        return { success: false, error: result.error };
      }
      audioBuffers.push(Buffer.from(result.base64, 'base64'));
    }

    // Concatenate MP3 segments. MP3 is frame-based, so byte concatenation of
    // segments from the same encoder settings plays back correctly and is
    // handled cleanly by the ffmpeg-based render pipeline.
    const combined = Buffer.concat(audioBuffers);

    return {
      success: true,
      audioBase64: combined.toString('base64'),
      mimeType: 'audio/mp3',
      voiceId: voice.id,
      voiceName: voice.name,
      characterCount: cleanText.length,
    };
  } catch (err: any) {
    console.error('[GOOGLE_TTS] Network or execution error:', err);
    return { success: false, error: err?.message || 'Speech synthesis failed' };
  }
}
