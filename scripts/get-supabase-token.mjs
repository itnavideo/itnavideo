const SUPABASE_URL = 'https://veqkjrcewfwtlepnyjfc.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function getToken() {
  // Test password auth against Supabase REST endpoint
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'rohi@itnavideo.com',
      password: 'Itnavideo@2026',
    })
  });
  const data = await res.json();
  console.log('Supabase token response:', data.access_token ? 'SUCCESS' : data);
  if (data.access_token) {
    console.log('User ID:', data.user.id);
  }
}

getToken();
