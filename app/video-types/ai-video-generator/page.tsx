import type { Metadata } from "next";
import AiVideoGeneratorDetail from "./AiVideoGeneratorDetail";

export const metadata: Metadata = {
  title: "AI Video Generator (Long YT Videos) — Voice, Video & Script to Video | Itnavideo",
  description: "Create complete 16:9 YouTube & 9:16 videos from voiceovers, facecam clips, or scripts with automated B-Roll, stock scenes, and animated captions.",
  alternates: { canonical: "/video-types/ai-video-generator" },
};

export default function AiVideoGeneratorPage() {
  return <AiVideoGeneratorDetail />;
}
