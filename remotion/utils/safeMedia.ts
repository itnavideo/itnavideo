export const S3_REMOTION_BASE_URL = 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com';

/**
 * Validates whether a string is a genuine media URL (http/https/data/blob or valid static asset path)
 * and NOT a prompt / text description from an AI planner.
 */
export function isValidMediaUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed.length < 5) return false;

  // Real HTTP / Cloud URL
  if (/^(https?:\/\/|data:|blob:)/i.test(trimmed)) {
    return !trimmed.includes(' ') || trimmed.includes('%20');
  }

  // S3 / Assets path with valid media extension
  const clean = trimmed.replace(/^\/+/, '');
  if ((clean.startsWith('assets/') || clean.startsWith('public/assets/')) &&
      /\.(jpe?g|png|webp|gif|svg|mp4|webm|mov|m4v|mp3|wav|ogg|aac|m4a)(\?.*)?$/i.test(clean)) {
    return true;
  }

  return false;
}

/**
 * Resolves a media src safely for Remotion.
 * Guaranteed to return an empty string '' if input is invalid or a text prompt,
 * completely preventing Remotion Chromium from crashing on <img src=""> or 404s.
 */
export function safeResolveMediaSrc(src?: string | null): string {
  if (!isValidMediaUrl(src)) return '';
  const trimmed = (src || '').trim();
  if (/^(https?:\/\/|data:|blob:)/i.test(trimmed)) {
    return trimmed;
  }
  let clean = trimmed.replace(/^\/+/, '');

  // Bulletproof fallback normalization for legacy/hallucinated SFX & BGM paths
  if (clean.includes('whoosh-swoosh') || clean.includes('whoosh_swoosh')) {
    clean = 'assets/reusable/sfx/whoosh.wav';
  } else if (clean.includes('pop-clean') || clean.includes('bubble-pop-clean')) {
    clean = 'assets/reusable/sfx/pop.mp3';
  } else if (clean.includes('cash-register-ding') || clean.includes('cash_ding')) {
    clean = 'assets/reusable/sfx/ding.mp3';
  } else if (clean.includes('documentary-ambient') || clean.includes('cinematic-hype') || clean.includes('upbeat-corporate')) {
    clean = 'assets/reusable/music/parasail-silent-partner.mp3';
  } else if (clean.includes('lofi-chill-beat')) {
    clean = 'assets/reusable/music/crimson-fly-huma-huma.mp3';
  }

  if (clean.startsWith('assets/')) {
    const encoded = clean
      .split('/')
      .map((seg) => encodeURIComponent(decodeURIComponent(seg)))
      .join('/');
    return `${S3_REMOTION_BASE_URL}/${encoded}`;
  }
  return '';
}

export function isVideoMedia(src?: string | null): boolean {
  if (!src || !isValidMediaUrl(src)) return false;
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(src) || src.includes('/video/');
}
