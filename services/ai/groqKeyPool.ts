/**
 * Shared Groq API Key Pool (Strict Key #1 -> Key #2 Failover + 429 Cooldown)
 * Supports GROQ_API_KEY + GROQ_API_KEY_2 (or GROQ_API_KEY_FALLBACK).
 */

function cleanKey(val: string | undefined): string {
  return String(val || '').replace(/^['"]|['"]$/g, '').trim();
}

const KEY_COOLDOWN_MS = 15_000;
const keyCooldownUntil = new Map<string, number>();

/**
 * Returns all configured, non-empty, deduplicated Groq API keys in priority order:
 * Key #1 -> Key #2 -> Fallback.
 */
export function getGroqApiKeys(): string[] {
  const candidates = [
    cleanKey(process.env.GROQ_API_KEY),
    cleanKey(process.env.GROQ_API_KEY_2),
    cleanKey(process.env.GROQ_API_KEY_FALLBACK),
  ].filter(Boolean);

  return Array.from(new Set(candidates));
}

/**
 * Returns configured Groq keys ordered with active (non-rate-limited) keys first,
 * preserving strict Key #1 -> Key #2 priority while skipping cooled-down keys.
 */
export function getGroqApiKeysRotated(): string[] {
  const keys = getGroqApiKeys();
  if (keys.length <= 1) return keys;

  const now = Date.now();
  const ready = keys.filter((k) => (keyCooldownUntil.get(k) || 0) <= now);
  const cooling = keys.filter((k) => (keyCooldownUntil.get(k) || 0) > now);
  return [...ready, ...cooling];
}

/**
 * Executes a Groq fetch call using strict ordered failover:
 * Groq Key #1 -> (on 429 / 5xx / 401 / 403 / network error) -> Groq Key #2.
 * Rate-limited keys are placed on a short cooldown so parallel/batch calls go straight to the healthy key.
 */
export async function fetchGroqWithFailover(
  url: string,
  buildRequestInit: (apiKey: string) => RequestInit,
  logTag = '[GroqKeyPool]'
): Promise<Response> {
  const keys = getGroqApiKeysRotated();
  if (keys.length === 0) {
    throw new Error('Missing GROQ_API_KEY (and GROQ_API_KEY_2).');
  }

  let lastResponse: Response | null = null;
  let lastError: unknown = null;

  for (let i = 0; i < keys.length; i++) {
    const apiKey = keys[i];
    try {
      const res = await fetch(url, buildRequestInit(apiKey));
      if (res.ok) {
        keyCooldownUntil.delete(apiKey);
        return res;
      }

      lastResponse = res;
      if (res.status === 429) {
        keyCooldownUntil.set(apiKey, Date.now() + KEY_COOLDOWN_MS);
      }

      const shouldFailover =
        res.status === 429 || res.status === 401 || res.status === 403 || res.status >= 500;

      if (shouldFailover && i < keys.length - 1) {
        console.warn(`${logTag} Groq key #${i + 1} returned ${res.status}; failing over to next Groq key...`);
        continue;
      }

      return res;
    } catch (err) {
      lastError = err;
      if (i < keys.length - 1) {
        console.warn(`${logTag} Groq key #${i + 1} request failed; failing over to next Groq key...`);
        continue;
      }
    }
  }

  if (lastResponse) return lastResponse;
  throw lastError instanceof Error ? lastError : new Error('All Groq API keys failed.');
}
