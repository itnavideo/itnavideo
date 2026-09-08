import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Video Generator & Maker Templates — 11 Workflows | Itnavideo",
  description: "Browse 11 specialized AI video generator workflows: Auto Caption Reels, Text to Video, Compare Explainers, Whiteboard Lessons, and Long Form Videos.",
  openGraph: {
    title: "AI Video Generator & Maker Templates — 11 Workflows | Itnavideo",
    description: "11 focused AI video generator workflows for Reels, Shorts, and 16:9 YouTube videos. Powered by cloud AI video generation.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Video Generator & Maker Templates | Itnavideo",
    description: "From free AI video generation to auto captions and text to video. Pick a workflow, upload, and render.",
  },
};

export default function VideoTypesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
