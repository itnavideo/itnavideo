import { NextRequest, NextResponse } from 'next/server';
import { insertJobApplicationFromServer } from '@/services/supabase/siteStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_ROLES = new Map([
  ['video-product-engineer', 'Video Product Engineer'],
  ['backend-developer-video-systems', 'Backend Developer, Video Systems'],
  ['full-stack-product-developer', 'Full-Stack Product Developer'],
  ['graphic-designer-video-templates', 'Graphic Designer, Video Templates'],
  ['marketing-manager-ai-saas', 'Marketing Manager, AI/SaaS'],
  ['finance-operations-manager', 'Finance & Operations Manager'],
]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const roleSlug = sanitizeString(body.roleSlug);
    const roleTitle = ALLOWED_ROLES.get(roleSlug) || sanitizeString(body.roleTitle);
    const name = sanitizeString(body.name);
    const email = sanitizeEmail(body.email);
    const linkedinUrl = sanitizeUrl(body.linkedinUrl);
    const resumeUrl = sanitizeUrl(body.resumeUrl);
    const portfolioUrl = sanitizeUrl(body.portfolioUrl);
    const note = sanitizeString(body.note).slice(0, 1200);

    if (!name) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }

    if (!ALLOWED_ROLES.has(roleSlug)) {
      return NextResponse.json({ error: 'Please choose a valid role.' }, { status: 400 });
    }

    if (!linkedinUrl && !resumeUrl && !portfolioUrl) {
      return NextResponse.json(
        { error: 'Add a LinkedIn, resume, or portfolio link so we can review your profile.' },
        { status: 400 },
      );
    }

    const application = await insertJobApplicationFromServer({
      name,
      email,
      roleSlug,
      roleTitle,
      linkedinUrl,
      resumeUrl,
      portfolioUrl,
      note,
      source: 'careers_page',
    });

    await notifyCareersAutomation({
      name,
      email,
      roleSlug,
      roleTitle,
      linkedinUrl,
      resumeUrl,
      portfolioUrl,
      note,
    }).catch((error) => {
      console.warn('Careers automation webhook failed:', error?.message || error);
    });

    return NextResponse.json({
      success: true,
      applicationId: getApplicationId(application),
      message: 'Application received. Our team will review profiles for upcoming roles and reply if there is a match.',
    });
  } catch (error) {
    console.error('Job application insert failed:', error);
    return NextResponse.json(
      { error: 'Application could not be submitted.', details: getErrorMessage(error) },
      { status: 500 },
    );
  }
}

async function notifyCareersAutomation(payload: Record<string, unknown>) {
  const webhookUrl = sanitizeUrl(process.env.CAREERS_AUTORESPONDER_WEBHOOK_URL);
  if (!webhookUrl) return;

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      subject: 'Itnavideo application received',
      autoResponse: 'Thank you for applying to Itnavideo. We review talent profiles for upcoming product, engineering, design, and growth work. If your profile matches an active need, we will get back to you within 2-3 weeks.',
    }),
  });

  if (!response.ok) {
    throw new Error(`Careers automation webhook returned ${response.status}`);
  }
}

function getApplicationId(value: unknown) {
  if (!value || typeof value !== 'object') return undefined;
  const row = value as Record<string, unknown>;
  return row.id;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

function sanitizeEmail(value: unknown) {
  const email = sanitizeString(value).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
}

function sanitizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function sanitizeUrl(value: unknown) {
  const input = sanitizeString(value);
  if (!input) return '';
  try {
    const url = new URL(input);
    if (!['http:', 'https:'].includes(url.protocol)) return '';
    return url.toString();
  } catch {
    return '';
  }
}
