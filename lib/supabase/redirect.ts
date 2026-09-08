const FALLBACK_SITE_URL = 'https://www.itnavideo.com';

export function getAuthRedirectUrl(path: string) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const configuredSiteUrl = cleanSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  const browserOrigin = getBrowserOrigin();
  const origin = shouldUseConfiguredSiteUrl(configuredSiteUrl, browserOrigin)
    ? configuredSiteUrl
    : browserOrigin || FALLBACK_SITE_URL;

  return new URL(cleanPath, origin).toString();
}

function getBrowserOrigin() {
  if (typeof window === 'undefined') return '';

  const { hostname, origin } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return origin;
  }

  return origin || FALLBACK_SITE_URL;
}

function cleanSiteUrl(value?: string) {
  return (value || '')
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/\/$/, '');
}

function shouldUseConfiguredSiteUrl(configuredSiteUrl: string, browserOrigin: string) {
  if (!configuredSiteUrl) return false;

  const configuredHost = safeHostname(configuredSiteUrl);
  const browserHost = safeHostname(browserOrigin);

  if (!configuredHost) return false;
  if (isLocalHost(configuredHost) && browserHost && !isLocalHost(browserHost)) return false;

  return true;
}

function safeHostname(value: string) {
  try {
    return new URL(value).hostname;
  } catch {
    return '';
  }
}

function isLocalHost(hostname: string) {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}
