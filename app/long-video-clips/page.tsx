import type { Metadata } from "next";
import LongVideoClipsDetail from "../video-types/long-video-clips/LongVideoClipsDetail";

export const metadata: Metadata = {
  title: "Long Video Clips AI Video Generator — Podcast & Shorts Repurposer | Itnavideo",
  description: "Identify viral moments from long videos and auto-cut captioned vertical clips with our AI video maker.",
  alternates: { canonical: "/long-video-clips" },
};

export default function LongVideoClipsAliasPage() {
  return <LongVideoClipsDetail />;
}
