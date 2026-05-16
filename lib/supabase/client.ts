import { createClient } from '@supabase/supabase-js';

const supabaseUrl = cleanPublicEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabasePublishableKey = cleanPublicEnv(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

export const supabase = supabaseUrl && supabasePublishableKey
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createMissingSupabaseClient();

function cleanPublicEnv(value?: string) {
  return (value || '')
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(/[^\x20-\x7E]/g, '');
}

function createMissingSupabaseClient() {
  const error = new Error('Supabase public environment variables are missing.');

  return new Proxy(
    {},
    {
      get() {
        throw error;
      },
    },
  ) as unknown as ReturnType<typeof createClient>;
}
