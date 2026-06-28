import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Templates - Six AI Reel Templates | Itnavideo",
  description: "Browse Itnavideo's six production templates: Dynamic Creator, Auto Captions, Creator Background Replace, Compare Explainer, Auto Draw, and Long Video Promo.",
  openGraph: {
    title: "Templates - Six AI Reel Templates | Itnavideo",
    description: "Browse Itnavideo's six production templates: Dynamic Creator, Auto Captions, Creator Background Replace, Compare Explainer, Auto Draw, and Long Video Promo.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Templates - Six AI Reel Templates | Itnavideo",
    description: "Browse six focused AI reel templates. Upload content, preview the output, and create a polished reel.",
  },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
