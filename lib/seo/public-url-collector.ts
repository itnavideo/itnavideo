import { getAllPublishedBlogPostsAsync } from "@/lib/blogPosts";
import { createClient } from "@supabase/supabase-js";

async function getPublishedCmsPageRoutes(): Promise<PublicSitemapUrl[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  const supabase = createClient(url, key);
  const { data } = await supabase
    .from("pages")
    .select("slug, updated_at, published_at")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString());

  if (!data) return [];
  return data.map((pg) => ({
    path: `/p/${pg.slug}`,
    lastModified: new Date(pg.published_at || pg.updated_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
}

import { seoLandingSlugs } from "@/lib/seo-pages";
import { seoContentPages } from "@/lib/seoContent";

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
      path: "/video-types",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      path: "/auto-caption-reel",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      path: "/compare-explainer",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      path: "/long-video-promo",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      path: "/auto-captions",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      path: "/whiteboard-video",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      path: "/typography-video",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      path: "/long-video-clips",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      path: "/long-caption-pro",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.92,
    },
    {
      path: "/create",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      path: "/pricing",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      path: "/features",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      path: "/blog",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      path: "/tools",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      path: "/use-cases",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      path: "/compare",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.78,
    },
    {
      path: "/about",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      path: "/careers",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      path: "/contact",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      path: "/promote-and-earn",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      path: "/docs",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      path: "/ai-platform-facts",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.55,
    },
    {
      path: "/wav-to-mp3",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      path: "/waitlist",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.45,
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

  const publishedPosts = await getAllPublishedBlogPostsAsync();
  const blogRoutes: PublicSitemapUrl[] = publishedPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.72,
  }));

  const cmsPageRoutes = await getPublishedCmsPageRoutes();


  const seoRoutes: PublicSitemapUrl[] = seoLandingSlugs.map((slug) => ({
    path: `/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority:
      slug === "ai-reel-generator" || slug === "youtube-shorts-generator" || slug === "instagram-reels-maker"
        ? 0.95
        : slug === "ai-explainer-video-generator" || slug === "ai-subtitle-generator" || slug === "add-subtitles-to-video"
          ? 0.9
          : slug === "compare-explainer-video-maker" || slug === "auto-caption-video-generator" || slug === "ai-shorts-generator"
            ? 0.88
            : 0.82,
  }));

  const structuredSeoRoutes: PublicSitemapUrl[] = seoContentPages.map((page) => ({
    path: page.path,
    lastModified: now,
    changeFrequency: "weekly",
    priority: page.kind === "tool" ? 0.93 : page.kind === "useCase" ? 0.86 : 0.84,
  }));

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

  const allRoutes = [...staticRoutes, ...blogRoutes, ...cmsPageRoutes, ...seoRoutes, ...structuredSeoRoutes];


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
