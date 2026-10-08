const FALLBACK_SITE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.itnavideo.com';

/**
 * Dynamically resolves the base URL and redirect path for authentication callbacks.
 * Supports localhost:3000, local network IP addresses (e.g. 192.168.x.x:3000 for mobile testing),
 * and production domains.
 */
export function getAuthRedirectUrl(path: string) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const origin = getDynamicOrigin();
  return new URL(cleanPath, origin).toString();
}

export function getDynamicOrigin(): string {
  // 1. Browser runtime: ALWAYS use the active window.location.origin
  // This guarantees local testing on localhost:3000 or http://192.168.x.x:3000 NEVER redirects to live site
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  // 2. Server-side environment resolution
  const configuredSiteUrl = cleanSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || process.env.APP_URL
  );

  if (configuredSiteUrl) {
    // In dev mode, don't force production domain if configuredSiteUrl was set to live domain
    if (process.env.NODE_ENV === 'development' && configuredSiteUrl.includes('itnavideo.com')) {
      return 'http://localhost:3000';
    }
    return configuredSiteUrl;
  }

  return FALLBACK_SITE_URL;
}

function cleanSiteUrl(value?: string) {
  return (value || '')
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/\/$/, '');
}
