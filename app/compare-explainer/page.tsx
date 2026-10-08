import type { Metadata } from "next";
import CompareExplainerDetail from "../video-types/compare-explainer/CompareExplainerDetail";

export const metadata: Metadata = {
  title: "Compare Explainer AI Video Generator — Side-by-Side Reels | Itnavideo",
  description: "Create comparison videos with AI: side-by-side product comparisons, voiceover captions, and animated stickman presenters.",
  alternates: { canonical: "/compare-explainer" },
};

export default function CompareExplainerAliasPage() {
  return <CompareExplainerDetail />;
}
