import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Video Generator & Maker Templates — 10 Workflows | Itnavideo",
  description: "Browse 10 specialized AI video and audio workflows for captions, Reels, YouTube videos, explainers, clips, image stories, and audio cleanup.",
  openGraph: {
    title: "AI Video Generator & Maker Templates — 10 Workflows | Itnavideo",
    description: "10 focused AI video and audio workflows for Reels, Shorts, 16:9 YouTube videos, subtitles, and clean audio.",
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
