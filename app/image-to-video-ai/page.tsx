import type { Metadata } from "next";
import ImageToVideoAiView from "@/components/tools/ImageToVideoAiView";

export const metadata: Metadata = {
  title: "Image to Video AI – Turn Voiceover & Photos into 16:9 Cinematic Videos | Itnavideo",
  description: "Upload your voiceover and any number of images. AI synchronizes scenes per line, applies Ken Burns pan & zoom camera motion, 2.5D parallax subtitles, and cinematic transitions. Up to 15 minutes at 30 FPS.",
  alternates: { canonical: "/tools/image-to-video-ai" },
};

export default function ImageToVideoAiAliasPage() {
  return <ImageToVideoAiView />;
}
