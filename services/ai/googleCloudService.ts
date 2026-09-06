import { readFileSync, existsSync } from 'fs';
import * as crypto from 'crypto';

interface ServiceAccountKey {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  token_uri: string;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Returns a valid GCP OAuth2 access token using Service Account JWT authentication.
 * Automatically caches token and refreshes 5 minutes before expiry.
 */
export async function getGcpAccessToken(): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt > now + 300) {
    return cachedToken.token;
  }

  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credPath || !existsSync(credPath)) {
    console.warn('[GCP_AUTH] GOOGLE_APPLICATION_CREDENTIALS path not found or missing:', credPath);
    return null;
  }

  try {
    const key: ServiceAccountKey = JSON.parse(readFileSync(credPath, 'utf8'));

    const header = { alg: 'RS256', typ: 'JWT' };
    const payload = {
      iss: key.client_email,
      sub: key.client_email,
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
    };

    const toBase64Url = (obj: any) => Buffer.from(JSON.stringify(obj)).toString('base64url');
    const unsignedToken = `${toBase64Url(header)}.${toBase64Url(payload)}`;

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(unsignedToken);
    const signature = sign.sign(key.private_key, 'base64url');
    const jwt = `${unsignedToken}.${signature}`;

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    const tokenData = await res.json();
    if (!tokenData.access_token) {
      console.error('[GCP_AUTH] Failed to exchange JWT for token:', tokenData);
      return null;
    }

    cachedToken = {
      token: tokenData.access_token,
      expiresAt: now + (tokenData.expires_in || 3600),
    };

    return cachedToken.token;
  } catch (err) {
    console.error('[GCP_AUTH] Error generating GCP token:', err);
    return null;
  }
}

/**
 * Call Vertex AI Gemini models (Enterprise Paid Tier — zero rate limits).
 * Consumes Google Cloud credits first (₹28k expiring Oct 2026).
 */
export async function callVertexGemini({
  prompt,
  systemPrompt,
  model = 'gemini-2.5-flash',
  temperature = 0.2,
  responseSchema,
}: {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  responseSchema?: any;
}): Promise<string | null> {
  const token = await getGcpAccessToken();
  if (!token) return null;

  const projectId = process.env.GCP_PROJECT_ID || 'geometric-hull-501707-m2';
  const location = process.env.GCP_LOCATION || 'us-central1';
  const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent`;

  const bodyPayload: any = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature,
    },
  };

  if (systemPrompt) {
    bodyPayload.systemInstruction = {
      parts: [{ text: systemPrompt }],
    };
  }

  if (responseSchema) {
    bodyPayload.generationConfig.responseMimeType = 'application/json';
    bodyPayload.generationConfig.responseSchema = responseSchema;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyPayload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[VERTEX_AI] ${model} returned HTTP ${res.status}:`, errText);
      return null;
    }

    const data = await res.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidateText || null;
  } catch (err) {
    console.error('[VERTEX_AI] Call failed:', err);
    return null;
  }
}

/**
 * Transcribe audio using Google Cloud Speech-to-Text API v1.
 * Returns transcript with word-level accurate timestamps.
 */
export async function transcribeWithGoogleCloudSpeech({
  audioBase64,
  sampleRateHertz = 16000,
  languageCode = 'en-IN',
  alternativeLanguageCodes = ['hi-IN', 'en-US'],
}: {
  audioBase64: string;
  sampleRateHertz?: number;
  languageCode?: string;
  alternativeLanguageCodes?: string[];
}): Promise<{
  transcript: string;
  words: Array<{ word: string; start: number; end: number }>;
} | null> {
  const token = await getGcpAccessToken();
  if (!token) return null;

  const projectId = process.env.GCP_PROJECT_ID || 'geometric-hull-501707-m2';

  try {
    const res = await fetch('https://speech.googleapis.com/v1/speech:recognize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-goog-user-project': projectId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: {
          enableWordTimeOffsets: true,
          languageCode,
          alternativeLanguageCodes,
          model: 'latest_long',
          enableAutomaticPunctuation: true,
        },
        audio: {
          content: audioBase64,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[GCP_SPEECH] Speech API HTTP error:', res.status, err);
      return null;
    }

    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      return null;
    }

    const words: Array<{ word: string; start: number; end: number }> = [];
    const transcriptParts: string[] = [];

    for (const result of data.results) {
      const alt = result.alternatives?.[0];
      if (!alt) continue;
      if (alt.transcript) transcriptParts.push(alt.transcript.trim());

      if (alt.words) {
        for (const w of alt.words) {
          const startTimeStr = w.startTime ? w.startTime.replace('s', '') : '0';
          const endTimeStr = w.endTime ? w.endTime.replace('s', '') : '0';
          words.push({
            word: w.word,
            start: parseFloat(startTimeStr),
            end: parseFloat(endTimeStr),
          });
        }
      }
    }

    return {
      transcript: transcriptParts.join(' '),
      words,
    };
  } catch (err) {
    console.error('[GCP_SPEECH] Failed to transcribe:', err);
    return null;
  }
}
