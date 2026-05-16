const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

type GeminiPart =
  | { text: string }
  | {
      inlineData: {
        mimeType: string;
        data: string;
      };
    };

type GeminiOptions = {
  temperature?: number;
  responseMimeType?: 'application/json' | 'text/plain';
};

export function hasGeminiApiKey() {
  return Boolean(getGeminiApiKey());
}

export async function generateGeminiJson(
  prompt: string,
  payload: unknown,
  options: GeminiOptions = {},
): Promise<Record<string, unknown> | null> {
  const text = await generateGeminiText(
    [
      {
        text: `${prompt}\n\nReturn only valid JSON. Do not wrap it in markdown.\n\nInput:\n${JSON.stringify(payload)}`,
      },
    ],
    { temperature: options.temperature ?? 0.25, responseMimeType: 'application/json' },
  );

  return safeJsonParse(text);
}

export async function generateGeminiAudioJson(
  audioUrl: string,
  prompt: string,
  options: GeminiOptions = {},
): Promise<Record<string, unknown> | null> {
  const audioResponse = await fetchWithTimeout(audioUrl, {}, getGeminiAudioFetchTimeoutMs());

  if (!audioResponse.ok) {
    throw new Error(`Unable to download voiceover audio: ${audioResponse.status}`);
  }

  const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
  const mimeType = normalizeAudioMimeType(audioResponse.headers.get('content-type'), audioUrl);
  const text = await generateGeminiText(
    [
      {
        inlineData: {
          mimeType,
          data: audioBuffer.toString('base64'),
        },
      },
      {
        text: `${prompt}\n\nReturn only valid JSON. Do not wrap it in markdown.`,
      },
    ],
    { temperature: options.temperature ?? 0.1, responseMimeType: 'application/json' },
  );

  return safeJsonParse(text);
}

async function generateGeminiText(parts: GeminiPart[], options: GeminiOptions) {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const models = getGeminiModelCandidates();
  let lastError = '';

  for (const model of models) {
    const response = await fetchWithTimeout(
      `${GEMINI_BASE_URL}/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts,
            },
          ],
          generationConfig: {
            temperature: options.temperature ?? 0.25,
            responseMimeType: options.responseMimeType || 'application/json',
          },
        }),
      },
      getGeminiTimeoutMs(),
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message = data?.error?.message || response.statusText || 'Unknown Gemini error';
      lastError = `Gemini generation failed on ${model}: ${response.status} ${message}`;
      if ([429, 500, 502, 503, 504].includes(response.status)) continue;
      throw new Error(lastError);
    }

    const text = data?.candidates?.[0]?.content?.parts
      ?.map((part: Record<string, unknown>) => (typeof part.text === 'string' ? part.text : ''))
      .join('')
      .trim();

    if (text) return text;

    lastError = `Gemini returned an empty response from ${model}`;
  }

  throw new Error(lastError || 'Gemini generation failed');
}

function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      throw new Error(`Gemini request timed out after ${Math.round(timeoutMs / 1000)} seconds`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function getGeminiTimeoutMs() {
  return Number(process.env.GEMINI_TIMEOUT_MS || 25_000);
}

function getGeminiAudioFetchTimeoutMs() {
  return Number(process.env.GEMINI_AUDIO_FETCH_TIMEOUT_MS || 20_000);
}

function getGeminiModelCandidates() {
  return Array.from(new Set([
    process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
  ].filter(Boolean)));
}

function normalizeAudioMimeType(contentType: string | null, audioUrl: string) {
  const cleanType = contentType?.split(';')[0]?.trim();
  if (cleanType?.startsWith('audio/')) return cleanType;

  const pathname = safeUrl(audioUrl)?.pathname.toLowerCase() || audioUrl.toLowerCase();
  if (pathname.endsWith('.wav')) return 'audio/wav';
  if (pathname.endsWith('.m4a')) return 'audio/mp4';
  if (pathname.endsWith('.ogg')) return 'audio/ogg';
  if (pathname.endsWith('.webm')) return 'audio/webm';
  return 'audio/mpeg';
}

function safeJsonParse(value: string): Record<string, unknown> | null {
  const cleaned = value
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}

function safeUrl(url: string) {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}
