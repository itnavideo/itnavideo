import { google } from "googleapis";

type SubmitSitemapResult = {
  ok: boolean;
  siteUrl: string;
  sitemapUrl: string;
  submittedAt: string;
  message: string;
};

const normalizeSiteUrl = (value: string) => {
  const url = (value || "https://www.itnavideo.com").trim();
  return url.endsWith("/") ? url : `${url}/`;
};

const normalizePrivateKey = (value: string) =>
  value.replace(/\\n/g, "\n").replace(/^"|"$/g, "");

export async function submitSitemapToGoogleSearchConsole(): Promise<SubmitSitemapResult> {
  const clientEmail = process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY;
  const siteUrl = normalizeSiteUrl(process.env.GOOGLE_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://www.itnavideo.com");
  const sitemapUrl = process.env.GOOGLE_SITEMAP_URL || `${siteUrl.replace(/\/$/, "")}/sitemap.xml`;

  if (!clientEmail || !privateKey) {
    return {
      ok: false,
      siteUrl,
      sitemapUrl,
      submittedAt: new Date().toISOString(),
      message: "Missing GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL or GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY",
    };
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: normalizePrivateKey(privateKey),
    scopes: ["https://www.googleapis.com/auth/webmasters"],
  });

  const searchconsole = google.searchconsole({
    version: "v1",
    auth,
  });

  await searchconsole.sitemaps.submit({
    siteUrl,
    feedpath: sitemapUrl,
  });

  return {
    ok: true,
    siteUrl,
    sitemapUrl,
    submittedAt: new Date().toISOString(),
    message: "Sitemap submitted to Google Search Console",
  };
}
