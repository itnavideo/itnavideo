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

export async function POST(request: Request) {
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

  const result = await submitSitemapToGoogleSearchConsole();

  return NextResponse.json(result, {
    status: result.ok ? 200 : 500,
  });
}
