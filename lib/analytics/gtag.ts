// lib/analytics/gtag.ts
// Production-grade Google Analytics 4 (GA4) Instrumentation for Itnavideo
// Standardized according to Google Analytics 4 Recommended SaaS & E-commerce Events

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-8NSFBYS9EF';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Safe wrapper for gtag calls
export function gtag(...args: any[]) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
}

// 1. Pageview tracking
export function trackPageView(url: string, title?: string) {
  gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title || (typeof document !== 'undefined' ? document.title : undefined),
  });
}

// 2. User Identity & Properties
export function setAnalyticsUser(userId: string | null, properties?: Record<string, any>) {
  if (userId) {
    gtag('set', 'user_properties', {
      user_id: userId,
      ...properties,
    });
  }
}

// 3. SaaS Core Conversion Events

/**
 * Triggered when a new user creates an account (Key Conversion)
 */
export function trackSignUp(method: string = 'email', plan: string = 'free_trial') {
  gtag('event', 'sign_up', {
    method,
    plan_tier: plan,
  });
}

/**
 * Triggered when an existing user logs in
 */
export function trackLogin(method: string = 'email') {
  gtag('event', 'login', {
    method,
  });
}

/**
 * Triggered when a user selects a video template / workflow
 */
export function trackVideoTypeSelect(videoType: string, category?: string) {
  gtag('event', 'video_type_select', {
    video_type: videoType,
    category: category || 'general',
  });
}

/**
 * Triggered when media is successfully uploaded & verified
 */
export function trackFileUpload(params: {
  fileType: string;
  durationSeconds?: number;
  fileSizeMb?: number;
  mode: string;
}) {
  gtag('event', 'file_upload_success', {
    file_type: params.fileType,
    duration_seconds: params.durationSeconds ? Math.round(params.durationSeconds) : undefined,
    file_size_mb: params.fileSizeMb ? Number(params.fileSizeMb.toFixed(1)) : undefined,
    mode: params.mode,
  });
}

/**
 * Triggered when a render is initiated (High Intent)
 */
export function trackRenderInitiate(params: {
  mode: string;
  durationSeconds?: number;
  creditCost: number;
  videoLayout?: string;
}) {
  gtag('event', 'render_initiate', {
    mode: params.mode,
    duration_seconds: params.durationSeconds ? Math.round(params.durationSeconds) : undefined,
    credit_cost: params.creditCost,
    video_layout: params.videoLayout || 'auto',
  });
}

/**
 * Triggered when a video render completes successfully (Primary Product Activation Conversion)
 */
export function trackRenderSuccess(params: {
  renderId: string;
  mode: string;
  durationSeconds?: number;
  creditCost: number;
}) {
  gtag('event', 'render_success', {
    render_id: params.renderId,
    mode: params.mode,
    duration_seconds: params.durationSeconds ? Math.round(params.durationSeconds) : undefined,
    credit_cost: params.creditCost,
    value: params.creditCost,
  });
}

/**
 * Triggered when a render fails
 */
export function trackRenderFailed(params: {
  mode: string;
  errorReason: string;
}) {
  gtag('event', 'render_failed', {
    mode: params.mode,
    error_reason: params.errorReason,
  });
}

/**
 * Triggered when a user downloads their rendered video
 */
export function trackVideoDownload(params: {
  renderId: string;
  mode: string;
}) {
  gtag('event', 'download_video', {
    render_id: params.renderId,
    mode: params.mode,
  });
}

// 4. GA4 Standard E-Commerce Funnel (Monetization & Conversion)

/**
 * Triggered when a user views pricing plans
 */
export function trackViewPricing(source: string = 'dashboard') {
  gtag('event', 'view_item_list', {
    item_list_id: 'pricing_packs',
    item_list_name: 'Credit Packs',
    source,
  });
}

/**
 * Triggered when user clicks to buy credits / checkout (Key Funnel Step)
 */
export function trackBeginCheckout(params: {
  packId: string;
  packName: string;
  price: number;
  currency?: string;
  credits: number;
}) {
  gtag('event', 'begin_checkout', {
    currency: params.currency || 'USD',
    value: params.price,
    items: [
      {
        item_id: params.packId,
        item_name: params.packName,
        price: params.price,
        quantity: 1,
        item_category: 'credit_pack',
        credits: params.credits,
      },
    ],
  });
}

/**
 * Triggered on successful payment (Primary Revenue Conversion)
 */
export function trackPurchase(params: {
  transactionId: string;
  packId: string;
  packName: string;
  price: number;
  currency?: string;
  credits: number;
}) {
  gtag('event', 'purchase', {
    transaction_id: params.transactionId,
    value: params.price,
    currency: params.currency || 'USD',
    items: [
      {
        item_id: params.packId,
        item_name: params.packName,
        price: params.price,
        quantity: 1,
        item_category: 'credit_pack',
        credits: params.credits,
      },
    ],
  });
}

// 5. Social Proof, Reviews & VC Engagement Metrics

/**
 * Triggered when social proof, testimonials or reviews are viewed by a user
 */
export function trackReviewView(params?: { source?: string; totalReviews?: number; averageRating?: number }) {
  gtag('event', 'view_reviews', {
    source: params?.source || 'landing_hero',
    total_reviews: params?.totalReviews || 5240,
    average_rating: params?.averageRating || 4.9,
  });
}

/**
 * Triggered when a creator submits a review or testimonial
 */
export function trackReviewSubmitted(params: {
  rating: number;
  reviewText?: string;
  creatorType?: string;
}) {
  gtag('event', 'review_submitted', {
    rating: params.rating,
    review_snippet: params.reviewText ? params.reviewText.slice(0, 100) : undefined,
    creator_type: params.creatorType || 'creator',
    value: params.rating,
  });
}

/**
 * Triggered when a video showcase or demo player is viewed / played
 */
export function trackVideoPlayerView(params: {
  videoType: string;
  aspectRatio: string;
  source: string;
}) {
  gtag('event', 'video_view', {
    video_type: params.videoType,
    aspect_ratio: params.aspectRatio,
    source: params.source,
  });
}

/**
 * Real-time Active User Heartbeat (Ensures active users appear in GA4 Realtime)
 */
export function trackActiveUserPulse(page: string) {
  gtag('event', 'active_pulse', {
    active_page: page,
    timestamp: Date.now(),
  });
}

