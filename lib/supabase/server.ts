import { createClient } from '@supabase/supabase-js';

// Polyfill WebSocket in Node.js runtime if missing to prevent RealtimeClient constructor errors
if (typeof globalThis.WebSocket === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    (globalThis as any).WebSocket = require('ws');
  } catch {
    // ws package not present, continue
  }
}

function cleanEnv(value?: string | null): string {
  return String(value || '')
    .trim()
    .replace(/^['"]|['"]$/g, '');
}

export function getSupabaseServerConfig() {
  const url = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL);
  const secretKey = cleanEnv(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SECRET_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY
  );
  return { url, secretKey };
}

export function isSupabaseServerConfigured(): boolean {
  const { url, secretKey } = getSupabaseServerConfig();
  return Boolean(url && secretKey);
}

export function createSupabaseServerClient() {
  const { url, secretKey } = getSupabaseServerConfig();

  if (!url || !secretKey) {
    throw new Error('Supabase server environment variables are missing.');
  }

  return createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
