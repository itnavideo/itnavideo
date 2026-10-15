import { Metadata } from "next";
import { AutoCaptionTemplateGallery } from "@/components/dashboard/AutoCaptionTemplateGallery";

export const metadata: Metadata = {
  title: "100+ Auto Caption Video Templates & Styles Gallery | Itnavideo",
  description:
    "Explore 100+ word-synchronized kinetic subtitle styles, including Hormozi Viral Pop, MrBeast Impact, Submagic Glow, and Minimalist podcast templates. Click to apply directly in Itnavideo Studio.",
  openGraph: {
    title: "100+ Auto Caption Video Templates & Styles | Itnavideo",
    description: "Browse live video demos for viral Shorts & Reels kinetic subtitles.",
  },
};

export default function AutoCaptionTemplatesPage() {
  return <AutoCaptionTemplateGallery />;
}
