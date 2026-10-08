import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase credentials missing from env.');
  process.exit(1);
}

const headers = {
  'apikey': supabaseServiceKey,
  'Authorization': `Bearer ${supabaseServiceKey}`,
  'Content-Type': 'application/json'
};

async function removeGmailCredits() {
  const oldEmail = 'itnavideo@gmail.com';
  console.log(`🔍 Removing test credits/entitlements for: ${oldEmail}`);

  try {
    const authRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, { headers });
    if (!authRes.ok) {
      console.error('❌ Auth API error:', authRes.status, await authRes.text());
      return;
    }

    const { users } = await authRes.json();
    const oldUser = users?.find(u => u.email?.toLowerCase().trim() === oldEmail.toLowerCase());

    if (oldUser) {
      console.log(`✅ Found user ID: ${oldUser.id} for ${oldEmail}`);

      // Delete billing_entitlement
      const entitlementKey = `billing_entitlement:${oldUser.id}`;
      const res1 = await fetch(`${supabaseUrl}/rest/v1/app_settings?key=eq.${entitlementKey}`, {
        method: 'DELETE',
        headers
      });
      console.log(`🧹 Billing entitlement deletion response: ${res1.status}`);

      // Delete free_signup_credit
      const creditKey = `free_signup_credit:${oldUser.id}`;
      const res2 = await fetch(`${supabaseUrl}/rest/v1/app_settings?key=eq.${creditKey}`, {
        method: 'DELETE',
        headers
      });
      console.log(`🧹 Free signup credit deletion response: ${res2.status}`);

      // Reset usage ledger
      const usageKey = `render_usage:${oldUser.id}`;
      const res3 = await fetch(`${supabaseUrl}/rest/v1/app_settings?key=eq.${usageKey}`, {
        method: 'DELETE',
        headers
      });
      console.log(`🧹 Usage ledger deletion response: ${res3.status}`);

      console.log(`🎉 Successfully purged all credits and entitlements for ${oldEmail}!`);
    } else {
      console.log(`ℹ️ User ${oldEmail} was not found in Supabase Auth.`);
    }
  } catch (err) {
    console.error('❌ Error executing removal:', err);
  }
}

removeGmailCredits();
