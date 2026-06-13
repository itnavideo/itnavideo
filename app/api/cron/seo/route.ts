import { NextResponse } from "next/server";
import { submitSitemapToGoogleSearchConsole } from "@/lib/google/search-console";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const secret = process.env.SEO_CRON_SECRET;
  if (!secret) return false;

  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  return token === secret;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const sitemapSubmit = await submitSitemapToGoogleSearchConsole();

  return NextResponse.json({
    ok: sitemapSubmit.ok,
    job: "seo-cron",
    ranAt: new Date().toISOString(),
    sitemapSubmit,
  });
}
