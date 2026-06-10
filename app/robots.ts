import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.itnavideo.com";

export default function robots(): MetadataRoute.Robots {
  const baseRobots = {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/api",
        "/api/",
        "/dashboard",
        "/dashboard/",
        "/settings",
        "/settings/",
        "/billing",
        "/billing/",
        "/login",
        "/login/",
        "/local-uploads",
        "/local-uploads/",
        "/videos",
        "/videos/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };

  return baseRobots;
}
