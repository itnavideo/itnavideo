import type { Metadata } from "next";
import WidescreenQualityPreviewClient from "@/components/preview/WidescreenQualityPreviewClient";

export const metadata: Metadata = {
  title: "16:9 Widescreen Quality Preview — Typography, SVG Scale & Timeline | Itnavideo",
  description: "Live 16:9 widescreen video preview inspector demonstrating text sizing, SVG scale, positioning, and motion physics.",
};

export default function WidescreenPreviewPage() {
  return <WidescreenQualityPreviewClient />;
}
