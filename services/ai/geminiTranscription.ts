import { normalizeTranscriptForPlanner } from './hinglishTranscript';
import type { ReelTranscriptSegment, ReelWord } from './reelPlanner';
import { prepareTranscriptionMedia } from './groqTranscription';

export type GeminiTranscriptionResult = {
  transcript: string;
  words?: ReelWord[];
  segments?: ReelTranscriptSegment[];
  durationSeconds?: number;
  languageHint?: 'english' | 'hinglish';
  model: string;
  warning?: string;
  rawTranscript?: string;
  source: 'gemini';
};

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-1.5-flash'];

export async function transcribeMediaWithGeminiFallback({
  mediaUrl,
  fileName,
  contentType,
  maxSeconds,
}: {
  mediaUrl: string;
  fileName: string;
  contentType?: string;
  maxSeconds?: number;
}): Promise<GeminiTranscriptionResult | null> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    console.warn('[GEMINI_TRANSCRIPTION] No GEMINI_API_KEY available for transcription fallback.');
    return null;
  }

  try {
    const prepStart = Date.now();
    const media = await prepareTranscriptionMedia({
      mediaUrl,
      fileName,
      contentType,
      maxSeconds,
    });
    console.log(`[GEMINI_TRANSCRIPTION] Audio prepared in ${Date.now() - prepStart}ms (${media.blob.size} bytes, ${media.contentType})`);

    const arrayBuffer = await media.blob.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = media.contentType.startsWith('audio/') ? media.contentType : 'audio/mpeg';

    const systemPrompt = `You are a high-precision audio transcription engine.
Transcribe the speech in this audio file with sub-second timestamps.
Language Rules:
- Transcribe in clean English or Roman Hinglish (Latin phonetic script).
- NEVER use Devanagari (हिन्दी), Urdu, or Arabic script.
- Preserve numbers and official terms.

Output STRICT JSON only matching this schema:
{
  "transcript": "full spoken transcript text...",
  "durationSeconds": 45.2,
  "language": "english" | "hinglish",
  "segments": [
    { "id": 0, "start": 0.0, "end": 3.8, "text": "Segment one text" }
  ],
  "words": [
    { "word": "Segment", "start": 0.0, "end": 0.5 },
    { "word": "one", "start": 0.6, "end": 1.1 }
  ]
}`;

    for (const model of GEMINI_MODELS) {
      try {
        console.log(`[GEMINI_TRANSCRIPTION] Attempting audio transcription with model: ${model}`);
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { inlineData: { mimeType, data: base64Audio } },
                    { text: systemPrompt },
                  ],
                },
              ],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.1,
              },
            }),
          }
        );

        if (!response.ok) {
          const errText = await response.text();
          console.warn(`[GEMINI_TRANSCRIPTION] Model ${model} returned error status ${response.status}: ${errText.slice(0, 200)}`);
          continue;
        }

        const data = await response.json();
        const rawJsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawJsonText) {
          console.warn(`[GEMINI_TRANSCRIPTION] Empty content parts returned from ${model}`);
          continue;
        }

        const parsed = JSON.parse(rawJsonText);
        const rawTranscript = String(parsed.transcript || '').trim();
        if (!rawTranscript) {
          console.warn(`[GEMINI_TRANSCRIPTION] Parsed JSON has empty transcript`);
          continue;
        }

        const segments: ReelTranscriptSegment[] = Array.isArray(parsed.segments)
          ? parsed.segments.map((seg: any, idx: number) => ({
              id: seg.id ?? idx,
              start: Math.max(0, Number(seg.start) || 0),
              end: Math.max(0, Number(seg.end) || 0),
              text: String(seg.text || '').trim(),
            })).filter((s: ReelTranscriptSegment) => s.text && s.end > s.start)
          : [];

        let words: ReelWord[] = Array.isArray(parsed.words)
          ? parsed.words.map((w: any) => ({
              word: String(w.word || '').trim(),
              start: Math.max(0, Number(w.start) || 0),
              end: Math.max(0, Number(w.end) || 0),
            })).filter((w: ReelWord) => w.word && w.end > w.start)
          : [];

        // Synthesize word timestamps if model omitted individual words
        if (words.length === 0 && segments.length > 0) {
          words = synthesizeWordsFromSegments(segments);
        }

        const cleaned = normalizeTranscriptForPlanner({
          transcript: rawTranscript,
          words: words.length ? words : undefined,
          segments: segments.length ? segments : undefined,
        });

        const durationSeconds = Number(parsed.durationSeconds) > 0
          ? Number(parsed.durationSeconds)
          : (segments.length ? Math.max(...segments.map((s) => s.end)) : 60);

        return {
          transcript: cleaned.transcript || rawTranscript,
          rawTranscript,
          words: cleaned.words?.length ? cleaned.words : (words.length ? words : undefined),
          segments: cleaned.segments?.length ? cleaned.segments : (segments.length ? segments : undefined),
          durationSeconds: Math.round(durationSeconds * 1000) / 1000,
          languageHint: cleaned.languageHint || (parsed.language === 'hinglish' ? 'hinglish' : 'english'),
          model,
          source: 'gemini',
        };
      } catch (modelErr) {
        console.warn(`[GEMINI_TRANSCRIPTION] Error during inference with ${model}:`, modelErr);
      }
    }
  } catch (outerErr) {
    console.error('[GEMINI_TRANSCRIPTION] Fallback transcription pipeline failed:', outerErr);
  }

  return null;
}

function synthesizeWordsFromSegments(segments: ReelTranscriptSegment[]): ReelWord[] {
  const words: ReelWord[] = [];
  for (const seg of segments) {
    const rawTokens = seg.text.split(/\s+/).filter(Boolean);
    if (!rawTokens.length) continue;
    const segDuration = Math.max(0.1, seg.end - seg.start);
    const tokenDuration = segDuration / rawTokens.length;

    rawTokens.forEach((token, index) => {
      const start = Math.round((seg.start + index * tokenDuration) * 1000) / 1000;
      const end = Math.round((seg.start + (index + 1) * tokenDuration) * 1000) / 1000;
      words.push({ word: token, start, end });
    });
  }
  return words;
}
