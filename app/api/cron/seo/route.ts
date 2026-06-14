import { NextResponse } from 'next/server';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.itnavideo.com').replace(/\/$/, '');
const SITEMAP_URL = process.env.GOOGLE_SITEMAP_URL || `${SITE_URL}/sitemap.xml`;
const CRON_SECRET = process.env.SEO_CRON_SECRET || '';

export async function GET(request: Request) {
  // Verify cron secret (Vercel cron or manual trigger)
  const authHeader = request.headers.get('authorization');
  const url = new URL(request.url);
  const secretParam = url.searchParams.get('secret');

  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}` && secretParam !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: { service: string; status: string; detail?: string }[] = [];

  // 1. Ping Google with sitemap
  try {
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    const googleResponse = await fetch(googlePingUrl, { method: 'GET' });
    results.push({
      service: 'Google Ping',
      status: googleResponse.ok ? 'success' : 'failed',
      detail: `HTTP ${googleResponse.status}`,
    });
  } catch (error) {
    results.push({
      service: 'Google Ping',
      status: 'error',
      detail: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // 2. Ping Bing with sitemap
  try {
    const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    const bingResponse = await fetch(bingPingUrl, { method: 'GET' });
    results.push({
      service: 'Bing Ping',
      status: bingResponse.ok ? 'success' : 'failed',
      detail: `HTTP ${bingResponse.status}`,
    });
  } catch (error) {
    results.push({
      service: 'Bing Ping',
      status: 'error',
      detail: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // 3. Ping IndexNow (Bing, Yandex, Naver)
  try {
    const indexNowUrl = `https://api.indexnow.org/indexnow?url=${encodeURIComponent(SITE_URL)}&key=itnavideo`;
    const indexNowResponse = await fetch(indexNowUrl, { method: 'GET' });
    results.push({
      service: 'IndexNow',
      status: indexNowResponse.ok || indexNowResponse.status === 202 ? 'success' : 'failed',
      detail: `HTTP ${indexNowResponse.status}`,
    });
  } catch (error) {
    results.push({
      service: 'IndexNow',
      status: 'error',
      detail: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    siteUrl: SITE_URL,
    sitemapUrl: SITEMAP_URL,
    results,
  });
}
