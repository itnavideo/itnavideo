import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoContentPageView from "@/components/ui/SeoContentPageView";
import { getSeoContentPage, getSeoPagesByKind } from "@/lib/seoContent";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.itnavideo.com").replace(/\/$/, "");

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getSeoPagesByKind("useCase").map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoContentPage("useCase", slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    keywords: [page.primaryKeyword, ...page.relatedKeywords],
    alternates: { canonical: page.path },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `${siteUrl}${page.path}`,
      siteName: "Itnavideo",
      type: "website",
      images: [{ url: `${siteUrl}${page.previewImage}`, width: 1080, height: 1920, alt: page.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [`${siteUrl}${page.previewImage}`],
    },
  };
}

export default async function UseCaseSeoPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getSeoContentPage("useCase", slug);
  if (!page) notFound();

  return <SeoContentPageView page={page} />;
}
