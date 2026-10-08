const SUPABASE_URL = 'https://veqkjrcewfwtlepnyjfc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlcWtqcmNld2Z3dGxlcG55amZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODA4MDMsImV4cCI6MjA5NDM1NjgwM30.6vPjV-m8a2Ag9DCNv8b95dxeIG2GkKGrRj6PI7fWt4Y';

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
