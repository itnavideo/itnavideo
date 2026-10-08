import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const SUPABASE_URL = 'https://veqkjrcewfwtlepnyjfc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlcWtqcmNld2Z3dGxlcG55amZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODA4MDMsImV4cCI6MjA5NDM1NjgwM30.6vPjV-m8a2Ag9DCNv8b95dxeIG2GkKGrRj6PI7fWt4Y';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
  realtime: { transport: ws },
});

async function testLogin() {
  console.log('Testing Supabase login for test user...');
  const email = 'itnavideo@gmail.com';
  const password = 'Itnavideo@2026';

  let res = await supabase.auth.signInWithPassword({ email, password });
  if (res.error) {
    console.log('SignIn Error:', res.error.message);
    console.log('Attempting signup for test user...');
    res = await supabase.auth.signUp({ email, password });
    console.log('SignUp Result:', res.error ? res.error.message : 'User created!');
  } else {
    console.log('SignIn Success! User ID:', res.data.user.id);
    console.log('Session access_token:', res.data.session.access_token);
  }
}

testLogin();
