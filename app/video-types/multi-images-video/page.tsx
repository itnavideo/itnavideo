import type { Metadata } from "next";
import MultiImagesVideoDetail from "./MultiImagesVideoDetail";

export const metadata: Metadata = {
  title: "Multi Images AI Video Maker — Photo Slideshow & News Reels | Itnavideo",
  description: "Combine voiceovers, headline badges, and photo galleries with our AI video generator for news, travel, and storytelling reels.",
  alternates: { canonical: "/multi-images-video" },
};

export default function MultiImagesVideoPage() {
  return <MultiImagesVideoDetail />;
}
