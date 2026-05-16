import { createClient } from '@supabase/supabase-js';

const supabaseUrl = cleanPublicEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabasePublishableKey = cleanPublicEnv(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('Supabase public environment variables are missing.');
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

function cleanPublicEnv(value?: string) {
  return (value || '')
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(/[^\x20-\x7E]/g, '');
}
