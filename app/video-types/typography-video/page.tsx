import type { Metadata } from "next";
import TypographyVideoDetail from "./TypographyVideoDetail";

export const metadata: Metadata = {
  title: "Kinetic Typography AI Video Maker — Animated Text Videos | Itnavideo",
  description: "Generate bold kinetic typography reels with our free AI video generator. Words animate on screen in sync with speech rhythm.",
  alternates: { canonical: "/typography-video" },
};

export default function TypographyVideoPage() {
  return <TypographyVideoDetail />;
}
