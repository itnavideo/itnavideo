import { google } from "googleapis";
import { getPublicSitemapUrls } from "@/lib/seo/public-url-collector";

export type IndexingNotificationType = "URL_UPDATED" | "URL_REMOVED";

type GoogleServiceAccount = {
  client_email?: string;
  private_key?: string;
};

type IndexingResult = {
  url: string;
  ok: boolean;
  status?: number;
  message: string;
};

export type SubmitIndexingNotificationsResult = {
  ok: boolean;
  submittedAt: string;
  type: IndexingNotificationType;
  requestedCount: number;
  submittedCount: number;
  warning: string;
  results: IndexingResult[];
};

const INDEXING_SCOPE = "https://www.googleapis.com/auth/indexing";
const DEFAULT_SITE_URL = "https://www.itnavideo.com";

const normalizePrivateKey = (value: string) =>
  value.replace(/\\n/g, "\n").replace(/^"|"$/g, "");

const getSiteUrl = () =>
  (process.env.GOOGLE_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");

function parseInlineJson(value: string): GoogleServiceAccount | null {
  try {
    return JSON.parse(value) as GoogleServiceAccount;
  } catch {
    return null;
  }
}

function parseBase64Json(value: string): GoogleServiceAccount | null {
  try {
    return JSON.parse(Buffer.from(value, "base64").toString("utf8")) as GoogleServiceAccount;
  } catch {
    return null;
  }
}

function getIndexingServiceAccount() {
  const json =
    process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON ||
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    "";
  const base64Json = process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON_BASE64 || "";

  const credentials =
    (json.trim() ? parseInlineJson(json.trim()) : null) ||
    (base64Json.trim() ? parseBase64Json(base64Json.trim()) : null) ||
    null;

  const clientEmail =
    credentials?.client_email ||
    process.env.GOOGLE_INDEXING_CLIENT_EMAIL ||
    process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL;
  const privateKey =
    credentials?.private_key ||
    process.env.GOOGLE_INDEXING_PRIVATE_KEY ||
    process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error(
      "Missing Google Indexing API credentials. Set GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON or GOOGLE_INDEXING_CLIENT_EMAIL + GOOGLE_INDEXING_PRIVATE_KEY.",
    );
  }

  return {
    clientEmail,
    privateKey: normalizePrivateKey(privateKey),
  };
}

function createIndexingClient() {
  const credentials = getIndexingServiceAccount();
  const auth = new google.auth.JWT({
    email: credentials.clientEmail,
    key: credentials.privateKey,
    scopes: [INDEXING_SCOPE],
  });

  return google.indexing({
    version: "v3",
    auth,
  });
}

export function normalizeOwnedUrl(value: string) {
  const siteUrl = getSiteUrl();
  const siteOrigin = new URL(siteUrl).origin;
  const url = new URL(value.startsWith("/") ? `${siteUrl}${value}` : value);

  if (url.origin !== siteOrigin) {
    throw new Error(`URL must belong to ${siteOrigin}`);
  }

  url.hash = "";
  return url.toString();
}

export async function getSitemapIndexingUrls() {
  const siteUrl = getSiteUrl();
  const urls = await getPublicSitemapUrls();

  return urls.map((item) => normalizeOwnedUrl(`${siteUrl}${item.path === "/" ? "" : item.path}`));
}

export async function submitIndexingNotifications(
  rawUrls: string[],
  type: IndexingNotificationType = "URL_UPDATED",
): Promise<SubmitIndexingNotificationsResult> {
  const maxUrls = Number(process.env.GOOGLE_INDEXING_MAX_URLS_PER_REQUEST || 100);
  const requestedUrls = [...new Set(rawUrls.map((url) => normalizeOwnedUrl(url)))];
  const urls = requestedUrls.slice(0, Math.max(1, maxUrls));
  const indexing = createIndexingClient();
  const results: IndexingResult[] = [];

  for (const url of urls) {
    try {
      const response = await indexing.urlNotifications.publish({
        requestBody: {
          url,
          type,
        },
      });

      results.push({
        url,
        ok: true,
        status: response.status,
        message: "Notification accepted by Google Indexing API",
      });
    } catch (error) {
      const err = error as { code?: number; response?: { status?: number; data?: { error?: { message?: string } } }; message?: string };
      results.push({
        url,
        ok: false,
        status: err.response?.status || err.code,
        message: err.response?.data?.error?.message || err.message || "Indexing API request failed",
      });
    }
  }

  const submittedCount = results.filter((result) => result.ok).length;

  return {
    ok: submittedCount === results.length,
    submittedAt: new Date().toISOString(),
    type,
    requestedCount: requestedUrls.length,
    submittedCount,
    warning:
      "Google officially supports the Indexing API only for JobPosting pages and livestream BroadcastEvent-in-VideoObject pages. For normal video-type pages, keep sitemap/internal links/Search Console as the primary indexing path.",
    results,
  };
}
