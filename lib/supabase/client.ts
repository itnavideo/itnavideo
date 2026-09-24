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
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
  } as unknown as ReturnType<typeof createClient>;
}
