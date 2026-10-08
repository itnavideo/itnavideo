import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const SUPABASE_URL = 'https://veqkjrcewfwtlepnyjfc.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: ws },
});

async function setupConfirmedUser() {
  console.log('Fetching users page 1...');
  let { data: usersData, error: listErr } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listErr) {
    console.error('List error:', listErr);
    return;
  }
  console.log(`Found ${usersData.users.length} total users in Supabase.`);
  const target = usersData.users.find(u => u.email === 'itnavideo@gmail.com');
  if (target) {
    console.log(`Updating user ${target.id} (${target.email})...`);
    const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(target.id, {
      password: 'ItnavideoTest2026!',
      email_confirm: true,
    });
    if (updateErr) console.error('Update error:', updateErr);
    else console.log('✓ SUCCESS: Updated & confirmed user password!');
  } else {
    console.log('User not found in list, creating e2e-tester@itnavideo.com...');
    const { data: createData, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: 'e2e-tester@itnavideo.com',
      password: 'ItnavideoTest2026!',
      email_confirm: true,
    });
    if (createErr) console.error('Create error:', createErr);
    else console.log('✓ SUCCESS: Created e2e-tester@itnavideo.com!');
  }
}

setupConfirmedUser();
