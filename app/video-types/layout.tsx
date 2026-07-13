import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Types — AI Video Formats for Creators | Itnavideo",
  description: "Browse Itnavideo's focused video types: Auto Caption, Compare Explainer, Long Video Promo, Whiteboard Video, and Typography Video. Each designed for a specific creator workflow.",
  openGraph: {
    title: "Video Types — AI Video Formats for Creators | Itnavideo",
    description: "Browse Itnavideo's focused video types. Each designed for a specific creator workflow.",
    images: ["/og-image.png"],
  },
};

export default function VideoTypesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
