import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blogPosts";
import { seoLandingPages } from "@/lib/seoLandingPages";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.itnavideo.com";

const staticRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/create", priority: 0.92, changeFrequency: "weekly" as const },
  { path: "/features", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/pricing", priority: 0.86, changeFrequency: "weekly" as const },
  { path: "/blog", priority: 0.82, changeFrequency: "weekly" as const },
  { path: "/docs", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/ai-platform-facts", priority: 0.68, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.68, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.58, changeFrequency: "monthly" as const },
  { path: "/careers", priority: 0.48, changeFrequency: "monthly" as const },
  { path: "/privacy", priority: 0.32, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.32, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.72,
    })),
    ...seoLandingPages.map((page) => ({
      url: `${siteUrl}/${page.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.88,
    })),
  ];
}
