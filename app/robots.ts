import type { MetadataRoute } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.itnavideo.com").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/dashboard",
          "/dashboard/",
          "/api/",
          "/login",
          "/signup",
          "/settings",
          "/settings/",
          "/local-uploads",
          "/local-uploads/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
