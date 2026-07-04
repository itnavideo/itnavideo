import { NextResponse } from "next/server";
import {
  getSitemapIndexingUrls,
  submitIndexingNotifications,
  type IndexingNotificationType,
} from "@/lib/google/indexing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type IndexingRequestBody = {
  url?: string;
  urls?: string[];
  path?: string;
  paths?: string[];
  mode?: "manual" | "sitemap";
  type?: IndexingNotificationType;
};

function isAuthorized(request: Request) {
  const secret = process.env.SEO_CRON_SECRET || process.env.ADMIN_API_KEY;
  if (!secret) return false;

  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  return token === secret;
}

function asStringArray(value: unknown) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    endpoint: "/api/seo/indexing",
    configured: Boolean(
      process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON ||
        process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON_BASE64 ||
        process.env.GOOGLE_INDEXING_CLIENT_EMAIL ||
        process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL,
    ),
    usage: {
      manual: {
        method: "POST",
        body: {
          urls: ["https://www.itnavideo.com/video-types/example"],
          type: "URL_UPDATED",
        },
      },
      sitemap: {
        method: "POST",
        body: {
          mode: "sitemap",
          type: "URL_UPDATED",
        },
      },
    },
    warning:
      "Google officially supports the Indexing API only for JobPosting pages and livestream BroadcastEvent-in-VideoObject pages.",
  });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: IndexingRequestBody;
  try {
    body = (await request.json()) as IndexingRequestBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Request body must be valid JSON" }, { status: 400 });
  }

  const type = body.type || "URL_UPDATED";
  if (type !== "URL_UPDATED" && type !== "URL_REMOVED") {
    return NextResponse.json({ ok: false, error: "type must be URL_UPDATED or URL_REMOVED" }, { status: 400 });
  }

  try {
    const urls =
      body.mode === "sitemap"
        ? await getSitemapIndexingUrls()
        : [
            ...(body.url ? [body.url] : []),
            ...(body.path ? [body.path] : []),
            ...asStringArray(body.urls),
            ...asStringArray(body.paths),
          ];

    if (!urls.length) {
      return NextResponse.json(
        {
          ok: false,
          error: "Provide url, urls, path, paths, or mode: sitemap",
        },
        { status: 400 },
      );
    }

    const result = await submitIndexingNotifications(urls, type);

    return NextResponse.json(result, {
      status: result.ok ? 200 : 207,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Indexing submission failed",
      },
      { status: 500 },
    );
  }
}
