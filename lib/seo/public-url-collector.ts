import { seoLandingSlugs } from "@/lib/seo-pages";

export type PublicSitemapUrl = {
  path: string;
  lastModified?: Date;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

const normalizePath = (path: string) => {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
};

export async function getPublicSitemapUrls(): Promise<PublicSitemapUrl[]> {
  const now = new Date();

  const staticRoutes: PublicSitemapUrl[] = [
    {
      path: "/",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      path: "/pricing",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      path: "/privacy",
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.35,
    },
    {
      path: "/terms",
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.35,
    },
  ];

  const seoRoutes: PublicSitemapUrl[] = seoLandingSlugs.map((slug) => ({
    path: `/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority:
      slug === "ai-explainer-video-generator"
        ? 0.9
        : slug === "compare-explainer-video-maker"
          ? 0.88
          : 0.82,
  }));

  const templateRoutes: PublicSitemapUrl[] = [
    {
      path: "/ai-explainer-video-generator",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      path: "/compare-explainer-video-maker",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.88,
    },
  ];

  /*
    Future dynamic DB URLs yahan add karna:

    const publicReels = await db.reel.findMany({
      where: { visibility: "public", noindex: false, deletedAt: null },
      select: { slug: true, updatedAt: true },
    });

    const reelRoutes = publicReels.map((reel) => ({
      path: `/r/${reel.slug}`,
      lastModified: reel.updatedAt,
      changeFrequency: "monthly",
      priority: 0.55,
    }));
  */

  const allRoutes = [...staticRoutes, ...seoRoutes, ...templateRoutes];

  const unique = new Map<string, PublicSitemapUrl>();

  for (const item of allRoutes) {
    const path = normalizePath(item.path);
    if (!unique.has(path)) {
      unique.set(path, {
        ...item,
        path,
      });
    }
  }

  return [...unique.values()];
}
