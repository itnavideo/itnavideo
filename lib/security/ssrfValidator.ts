/**
 * SSRF (Server-Side Request Forgery) Validator for external URLs.
 * Rejects localhost, internal private IP ranges, AWS metadata endpoints, and non-HTTP protocols.
 */

const BLOCKED_HOSTNAMES = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '169.254.169.254', // AWS EC2 / ECS metadata IP
  'metadata.google.internal',
  'kubernetes.default.svc',
];

const PRIVATE_IP_REGEXES = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^::1$/,
  /^fc00:/,
  /^fe80:/,
];

export function validateSafePublicUrl(inputUrl: string): { isValid: boolean; error?: string } {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return { isValid: false, error: 'URL is required' };
  }

  const trimmed = inputUrl.trim();

  // Allow internal relative paths (e.g. /preview/...)
  if (trimmed.startsWith('/')) {
    return { isValid: true };
  }

  try {
    const parsed = new URL(trimmed);

    // Require HTTP or HTTPS
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, error: 'Only HTTP and HTTPS URLs are allowed.' };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Check blocked hostnames
    if (BLOCKED_HOSTNAMES.includes(hostname)) {
      return { isValid: false, error: 'Access to internal hostnames is prohibited.' };
    }

    // Check private IP ranges
    for (const regex of PRIVATE_IP_REGEXES) {
      if (regex.test(hostname)) {
        return { isValid: false, error: 'Access to private IP ranges is prohibited.' };
      }
    }

    return { isValid: true };
  } catch (err) {
    return { isValid: false, error: 'Invalid URL format.' };
  }
}

