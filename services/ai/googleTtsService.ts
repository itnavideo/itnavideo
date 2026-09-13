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
    const res = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { text: cleanText },
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
      return { success: false, error: `Google TTS returned HTTP ${res.status}` };
    }

    const data = await res.json();
    if (!data.audioContent) {
      return { success: false, error: 'No audio content received from Google TTS' };
    }

    return {
      success: true,
      audioBase64: data.audioContent,
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
