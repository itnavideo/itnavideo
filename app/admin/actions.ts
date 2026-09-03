'use server';

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  signupDate: string;
  lastLogin: string;
  plan: string;
  creditsRemaining: number;
  creditsUsed: number;
  videosGenerated: number;
  videosDownloaded: number;
  status: "active" | "suspended";
};

export type AdminVideo = {
  renderId: string;
  bucketName: string;
  mode: string;
  design: string;
  title: string;
  outputFile: string;
  createdAt: string;
  userId: string;
  userEmail: string;
  durationSeconds: number;
  resolution: string;
  renderTimeMs: number;
  downloadCount: number;
  creditsUsed: number;
  status: "done" | "failed" | "rendering";
};

// 1. Overview Stats Server Action
export async function getAdminOverviewStats() {
  const supabase = createSupabaseServerClient();

  // Load auth users
  const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) throw new Error(`Auth read error: ${authError.message}`);

  // Load renders
  const { data: renders } = await supabase
    .from("render_history")
    .select("*")
    .order("created_at", { ascending: false });

  // Load app settings (billing and user ledger)
  const { data: settings } = await supabase
    .from("app_settings")
    .select("*");

  const usersCount = authUsers?.length || 0;
  const activeUsers = authUsers?.filter(u => u.last_sign_in_at).length || 0;

  // Filter entitlements & manual signup credits
  const entitlements = settings?.filter(s => s.key.startsWith("billing_entitlement:")) || [];
  const creditGrants = settings?.filter(s => s.key.startsWith("free_signup_credit:")) || [];

  const EXCLUDED_TEST_EMAILS = [
    'itnavideo@gmail.com',
    'rohi@itnavideo.com',
    'founder@itnavideo.com',
    'test@itnavideo.com',
    'akram.editor.studio@gmail.com',
  ];

  // Calculate MRR & total revenue
  let mrr = 0;
  let totalRevenue = 0;
  const recentPayments: any[] = [];
  let realPaidUsersCount = 0;

  entitlements.forEach(item => {
    const value = item.value as any;
    if (value && value.status === "active") {
      const email = String(value.email || "").toLowerCase().trim();

      // Exclude founder test transactions & test emails
      const isTestUser = EXCLUDED_TEST_EMAILS.includes(email) || email.includes('test') || email.includes('trial') || Boolean(value.isTest);
      if (isTestUser) return;

      const rawAmount = Number(value.amount) || 0;
      // Convert Razorpay paise (e.g. 79900 paise -> ₹799) to Rupees
      const currency = value.currency || "INR";
      const amountInRupees = currency === "INR" && rawAmount >= 100 ? Math.round(rawAmount / 100) : rawAmount;

      totalRevenue += amountInRupees;
      mrr += amountInRupees;
      realPaidUsersCount++;

      recentPayments.push({
        id: value.paymentId || value.orderId || item.key,
        userId: value.userId,
        email: email || "customer@itnavideo.com",
        planName: value.planName || "Pro Plan",
        amount: amountInRupees,
        currency,
        timestamp: value.activatedAt || item.updated_at,
      });
    }
  });

  const paidUsersCount = realPaidUsersCount;
  const freeUsersCount = Math.max(0, usersCount - paidUsersCount);

  // Video calculations
  const totalRendersCount = renders?.length || 0;
  const successRenders = renders?.filter(r => r.output_file).length || 0;
  const failedRenders = totalRendersCount - successRenders;
  const successRate = totalRendersCount > 0 ? (successRenders / totalRendersCount) * 100 : 100;

  // Aggregate stats today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const rendersToday = renders?.filter(r => new Date(r.created_at) >= todayStart).length || 0;

  // Aggregate downloads: we can estimate via render logs or mock metadata properties
  const downloadsToday = renders?.filter(r => new Date(r.created_at) >= todayStart && r.output_file).length || 0;

  // Credit consumption stats
  let totalCreditsRemaining = 0;
  let totalCreditsUsed = 0;

  creditGrants.forEach(item => {
    const value = item.value as any;
    if (value) {
      totalCreditsRemaining += Number(value.amount) || 0;
    }
  });

  renders?.forEach(item => {
    const costs = item.costs as any;
    if (costs && costs.credits) {
      totalCreditsUsed += Number(costs.credits);
    } else {
      totalCreditsUsed += 1.0; // fallback default
    }
  });

  // Trend series (Revenue trend, User growth, Video outputs) - Last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    return d;
  }).reverse();

  const revenueTrend = last7Days.map(date => {
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const matchEnts = entitlements.filter(item => {
      const activeAt = new Date((item.value as any)?.activatedAt || item.updated_at);
      activeAt.setHours(0,0,0,0);
      return activeAt.getTime() === date.getTime();
    });
    const dayRev = matchEnts.reduce((sum, item) => sum + (Number((item.value as any)?.amount) || 0), 0);
    return { name: dateStr, value: dayRev };
  });

  const userGrowth = last7Days.map((date, index) => {
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const countBeforeOrOn = authUsers?.filter(u => new Date(u.created_at) <= new Date(date.getTime() + 24 * 60 * 60 * 1000)).length || 0;
    return { name: dateStr, value: countBeforeOrOn };
  });

  const videoTrend = last7Days.map(date => {
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dayRenders = renders?.filter(r => {
      const rDate = new Date(r.created_at);
      rDate.setHours(0,0,0,0);
      return rDate.getTime() === date.getTime();
    }).length || 0;
    return { name: dateStr, value: dayRenders };
  });

  const creditsConsumption = last7Days.map(date => {
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dayCredits = renders?.filter(r => {
      const rDate = new Date(r.created_at);
      rDate.setHours(0,0,0,0);
      return rDate.getTime() === date.getTime();
    }).reduce((sum, item) => {
      const costs = item.costs as any;
      return sum + (costs?.credits ? Number(costs.credits) : 1.0);
    }, 0) || 0;
    return { name: dateStr, value: dayCredits };
  });

  // Insights
  const templateUsage: Record<string, number> = {};
  renders?.forEach(r => {
    if (r.mode) {
      templateUsage[r.mode] = (templateUsage[r.mode] || 0) + 1;
    }
  });

  const mostPopularTemplate = Object.entries(templateUsage).sort((a, b) => b[1] - a[1])[0]?.[0] || "videoCaption";

  return {
    kpis: {
      mrr,
      totalRevenue,
      usersCount,
      activeUsers,
      paidUsersCount,
      freeUsersCount,
      rendersToday,
      totalRendersCount,
      downloadsToday,
      totalCreditsRemaining,
      totalCreditsUsed,
      successRate,
      failedRenders,
      pendingQueue: 0,
    },
    trends: {
      revenueTrend,
      userGrowth,
      videoTrend,
      creditsConsumption,
    },
    recentPayments: recentPayments.slice(0, 10),
    insights: {
      mostPopularTemplate,
      highestRevenuePlan: "Pro Monthly",
      avgRenderTimeSeconds: 45,
      avgCreditsPerVideo: 1.5,
      mostActiveCountry: "India",
    }
  };
}

// 2. Fetch Users Server Action
export async function getAdminUsers(search = "", filterPlan = "All") {
  const supabase = createSupabaseServerClient();
  const { data: { users: authUsers }, error } = await supabase.auth.admin.listUsers();
  if (error) throw new Error(error.message);

  const { data: renders } = await supabase.from("render_history").select("*");
  const { data: settings } = await supabase.from("app_settings").select("*");

  const result: AdminUser[] = (authUsers || []).map(user => {
    const userId = user.id;
    const email = user.email || "";
    const metadata = user.user_metadata || {};
    const name = metadata.name || metadata.full_name || email.split("@")[0] || "Unknown";

    const userRenders = renders?.filter(r => r.user_id === userId) || [];
    const videosGenerated = userRenders.length;
    const videosDownloaded = userRenders.filter(r => r.output_file).length;

    // Find subscription plan
    const entitlementSetting = settings?.find(s => s.key === `billing_entitlement:${userId}`);
    const plan = entitlementSetting ? (entitlementSetting.value as any).planName : "Free Trial";

    // Find credits remaining
    const creditSetting = settings?.find(s => s.key === `free_signup_credit:${userId}`);
    const creditsRemaining = creditSetting ? Number((creditSetting.value as any).amount) || 0 : 0;

    // Estimate credits used
    const creditsUsed = userRenders.reduce((sum, item) => {
      const costs = item.costs as any;
      return sum + (costs?.credits ? Number(costs.credits) : 1.0);
    }, 0);

    const isSuspended = user.banned_until && new Date(user.banned_until).getTime() > Date.now();

    return {
      id: userId,
      email,
      name,
      signupDate: user.created_at,
      lastLogin: user.last_sign_in_at || user.created_at,
      plan,
      creditsRemaining,
      creditsUsed,
      videosGenerated,
      videosDownloaded,
      status: isSuspended ? "suspended" : "active",
    };
  });

  // Filter
  const filtered = result.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesPlan = filterPlan === "All" || u.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  return filtered;
}

// 3. Adjust User Credits Server Action
export async function adjustUserCredits(userId: string, amount: number, reason: string) {
  const supabase = createSupabaseServerClient();
  const key = `free_signup_credit:${userId}`;

  const { data: existing } = await supabase
    .from("app_settings")
    .select("*")
    .eq("key", key)
    .maybeSingle();

  const now = new Date().toISOString();
  let nextAmount = amount;

  if (existing) {
    const currentVal = existing.value as any;
    nextAmount = Math.max(0, (Number(currentVal?.amount) || 0) + amount);
  }

  const payload = {
    userId,
    email: existing ? (existing.value as any).email : "user@itnavideo.com",
    freeTrialGranted: true,
    amount: nextAmount,
    reason: reason,
    grantedAt: existing ? (existing.value as any).grantedAt : now,
    expiresAt: "2099-12-31T23:59:59.000Z",
    transaction: {
      type: "manual_adjustment",
      amount: amount,
      reason: reason,
      createdAt: now,
    }
  };

  const { error } = await supabase
    .from("app_settings")
    .upsert({
      key,
      value: payload,
      updated_by: "admin",
      updated_at: now,
    }, { onConflict: "key" });

  if (error) throw new Error(`Credits update failed: ${error.message}`);

  revalidatePath("/admin/users");
  revalidatePath("/admin/dashboard");
  return { success: true, nextAmount };
}

// 4. Update User Plan Server Action
export async function updateUserPlan(userId: string, planId: string, planName: string) {
  const supabase = createSupabaseServerClient();
  const key = `billing_entitlement:${userId}`;

  const now = new Date();
  const payload = {
    userId,
    email: "user@itnavideo.com",
    planId,
    planName,
    monthlyVideoLimit: 30,
    amount: planId === "business" ? 1999 : planId === "pro" ? 999 : 0,
    currency: "INR",
    paymentId: `admin_adjust_${Date.now()}`,
    orderId: `admin_adjust_order_${Date.now()}`,
    status: "active",
    activatedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 31 * 24 * 60 * 60 * 1000).toISOString(),
  };

  const { error } = await supabase
    .from("app_settings")
    .upsert({
      key,
      value: payload,
      updated_by: "admin",
      updated_at: now.toISOString(),
    }, { onConflict: "key" });

  if (error) throw new Error(`Plan update failed: ${error.message}`);

  revalidatePath("/admin/users");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

// 5. Toggle User Suspension Server Action
export async function toggleUserSuspension(userId: string, currentStatus: "active" | "suspended") {
  const supabase = createSupabaseServerClient();

  if (currentStatus === "active") {
    // Suspend user by setting banned_until to 100 years from now
    const farFuture = new Date();
    farFuture.setFullYear(farFuture.getFullYear() + 100);

    const { error } = await supabase.auth.admin.updateUserById(userId, {
      ban_duration: "876000h" // 100 years
    });
    if (error) throw new Error(`Suspension failed: ${error.message}`);
  } else {
    // Lift suspension
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      ban_duration: "none"
    });
    if (error) throw new Error(`Reactivation failed: ${error.message}`);
  }

  revalidatePath("/admin/users");
  return { success: true };
}

// 6. Delete Account Server Action
export async function deleteUserAccount(userId: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) throw new Error(`Deletion failed: ${error.message}`);

  revalidatePath("/admin/users");
  return { success: true };
}

// 7. Get Renders / Videos Server Action
export async function getAdminVideos(search = "", template = "All") {
  const supabase = createSupabaseServerClient();

  const { data: renders, error } = await supabase
    .from("render_history")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const { data: { users } } = await supabase.auth.admin.listUsers();

  const results: AdminVideo[] = (renders || []).map(r => {
    const userMatch = users?.find(u => u.id === r.user_id);
    const email = userMatch?.email || "anonymous@itnavideo.com";

    const costs = r.costs as any;
    const creditsUsed = costs?.credits ? Number(costs.credits) : 1.0;

    return {
      renderId: r.render_id,
      bucketName: r.bucket_name || "itnavideo-temp",
      mode: r.mode || "videoCaption",
      design: r.design || "clean",
      title: r.title || "Video Clip",
      outputFile: r.output_file,
      createdAt: r.created_at,
      userId: r.user_id,
      userEmail: email,
      durationSeconds: 15, // estimated
      resolution: "1080x1920 (9:16)",
      renderTimeMs: 35000, // estimated
      downloadCount: r.output_file ? 1 : 0,
      creditsUsed,
      status: r.output_file ? "done" : "failed",
    };
  });

  const filtered = results.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(search.toLowerCase()) || v.userEmail.toLowerCase().includes(search.toLowerCase()) || v.renderId.toLowerCase().includes(search.toLowerCase());
    const matchesTemplate = template === "All" || v.mode === template;
    return matchesSearch && matchesTemplate;
  });

  return filtered;
}

// 8. Delete Render History Action
export async function deleteRenderVideo(renderId: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("render_history")
    .delete()
    .eq("render_id", renderId);

  if (error) throw new Error(`Video deletion failed: ${error.message}`);

  revalidatePath("/admin/videos");
  revalidatePath("/admin/dashboard");
  return { success: true };
}
