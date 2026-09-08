import type { MetadataRoute } from "next";
import { getPublicSitemapUrls } from "@/lib/seo/public-url-collector";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.itnavideo.com").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls = await getPublicSitemapUrls();

  return urls.map((item) => ({
    url: `${siteUrl}${item.path === "/" ? "" : item.path}`,
    lastModified: item.lastModified || new Date(),
    changeFrequency: item.changeFrequency || "weekly",
    priority: item.priority || 0.7,
  }));
}
