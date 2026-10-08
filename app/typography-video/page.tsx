import type { Metadata } from "next";
import TypographyVideoDetail from "../video-types/typography-video/TypographyVideoDetail";

export const metadata: Metadata = {
  title: "Kinetic Typography AI Video Maker — 3D Text & Real Estate Reels | Itnavideo",
  description: "Create bold kinetic typography reels with 3D text behind subject, architectural listing stats, and 8 luxury fonts. Synced to speech rhythm up to 15 minutes.",
  alternates: { canonical: "/typography-video" },
  openGraph: {
    title: "Kinetic Typography AI Video Maker — 3D Text & Real Estate Reels | Itnavideo",
    description: "Create bold kinetic typography reels with 3D text behind subject, architectural listing stats, and 8 luxury fonts. Synced to speech rhythm up to 15 minutes.",
    images: ["https://storage.googleapis.com/itnavideo-media-assets/Typography_Video_sitlxz.png"],
  },
};

export default function TypographyVideoAliasPage() {
  return <TypographyVideoDetail />;
}
