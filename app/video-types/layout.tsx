import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Types - Seven AI Reel Video Types | Itnavideo",
  description: "Browse Itnavideo's seven production video types: Custom AI Reel, Creator Reel, Auto Caption, Background Replace, Compare Explainer, Auto Draw, and Long Video Promo.",
  openGraph: {
    title: "Video Types - Seven AI Reel Video Types | Itnavideo",
    description: "Browse Itnavideo's seven production video types: Custom AI Reel, Creator Reel, Auto Caption, Background Replace, Compare Explainer, Auto Draw, and Long Video Promo.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Video Types - Seven AI Reel Video Types | Itnavideo",
    description: "Browse seven focused AI reel video types. Upload content, preview the output, and create a polished reel.",
  },
};

export default function VideoTypesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
