import type { Metadata } from "next";
import ImageToVideoAiView from "@/components/tools/ImageToVideoAiView";

export const metadata: Metadata = {
  title: "Image to Video AI – Turn Voiceover & Photos into 16:9 Cinematic Videos | Itnavideo",
  description: "Upload your voiceover and any number of images. AI synchronizes scenes per line, applies Ken Burns pan & zoom camera motion, 2.5D parallax subtitles, and cinematic transitions. Up to 15 minutes at 30 FPS.",
  alternates: { canonical: "/tools/image-to-video-ai" },
  openGraph: {
    title: "Image to Video AI – 16:9 Cinematic Video Generator | Itnavideo",
    description: "Transform voiceover narration and photos into 16:9 widescreen videos with Ken Burns motion, 2.5D subtitles, and background music. Up to 15 minutes.",
    images: ["https://storage.googleapis.com/itnavideo-media-assets/ChatGPT_Image_Sep_7_2026_04_53_09_PM_suv9x7.png"],
  },
};

export default function ImageToVideoAiPage() {
  return <ImageToVideoAiView />;
}
