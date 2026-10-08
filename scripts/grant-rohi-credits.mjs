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
  'Content-Type': 'application/json',
  'Prefer': 'resolution=merge-duplicates'
};

async function grantCredits() {
  const targetEmail = 'rohi@itnavideo.com';
  console.log(`🔍 Searching for user with email: ${targetEmail}`);

  try {
    const authRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, { headers });
    if (!authRes.ok) {
      console.error('❌ Auth API error:', authRes.status, await authRes.text());
      return;
    }

    const { users } = await authRes.json();
    const targetUser = users?.find(u => u.email?.toLowerCase().trim() === targetEmail.toLowerCase());

    if (targetUser) {
      console.log(`✅ Found user ID: ${targetUser.id} for ${targetEmail}`);

      const now = new Date();
      const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();

      // 1. Upsert billing_entitlement
      const entitlementKey = `billing_entitlement:${targetUser.id}`;
      const entitlementValue = {
        userId: targetUser.id,
        email: targetEmail,
        planId: 'founder-testing',
        planName: 'Founder Testing Pass (500 Credits)',
        monthlyVideoLimit: 500,
        amount: 0,
        currency: 'INR',
        paymentId: 'founder_grant_500',
        orderId: 'founder_grant_order',
        status: 'active',
        activatedAt: now.toISOString(),
        expiresAt: expiresAt
      };

      const res1 = await fetch(`${supabaseUrl}/rest/v1/app_settings`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          key: entitlementKey,
          value: entitlementValue,
          updated_by: 'admin-grant',
          updated_at: now.toISOString()
        })
      });

      if (res1.ok) {
        console.log(`🎉 Granted 500 credits billing_entitlement to ${targetEmail}!`);
      } else {
        console.error('❌ Entitlement write failed:', await res1.text());
      }

      // 2. Upsert free_signup_credit
      const creditKey = `free_signup_credit:${targetUser.id}`;
      const creditValue = {
        userId: targetUser.id,
        email: targetEmail,
        freeTrialGranted: true,
        amount: 500,
        reason: 'Founder Testing Grant',
        grantedAt: now.toISOString(),
        expiresAt: expiresAt,
        transaction: {
          type: 'founder_grant',
          amount: 500,
          reason: 'Founder 500 credits grant for testing',
          createdAt: now.toISOString()
        }
      };

      const res2 = await fetch(`${supabaseUrl}/rest/v1/app_settings`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          key: creditKey,
          value: creditValue,
          updated_by: 'admin-grant',
          updated_at: now.toISOString()
        })
      });

      if (res2.ok) {
        console.log(`🎉 Set free_signup_credit amount to 500 for ${targetEmail}!`);
      } else {
        console.error('❌ Credit grant write failed:', await res2.text());
      }

    } else {
      console.log(`ℹ️ User ${targetEmail} does not exist in Supabase Auth yet.`);
      console.log(`  (Note: In renderAccess.ts, rohi@itnavideo.com has also been added to Founder Test emails, so as soon as you sign in with rohi@itnavideo.com, you will automatically get Founder Access with 999 credits!)`);
    }
  } catch (err) {
    console.error('❌ Error executing grant:', err);
  }
}

grantCredits();
