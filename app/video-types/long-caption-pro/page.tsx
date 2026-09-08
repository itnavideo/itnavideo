import type { Metadata } from "next";
import { redirect } from "next/navigation";
import RichTemplateDetail from "@/components/templates/RichTemplateDetail";

export const metadata: Metadata = {
  title: "Long Caption Pro AI Video Maker — 16:9 Landscape Subtitles | Itnavideo",
  description: "Precision 16:9 landscape video captions for YouTube tutorials, podcasts, and webinars with our AI video generator.",
  alternates: { canonical: "/long-caption-pro" },
};

export default function LongCaptionProPage() {
  redirect("/video-types/auto-caption-generator");
  return (
    <RichTemplateDetail
      id="long-caption-pro"
      title="Long Caption Pro AI Video Maker"
      subtitle="Precision 16:9 landscape format subtitles for horizontal podcasts, webinars, and YouTube tutorials with our AI video creator."
      badge="16:9 Widescreen • AI Video Generator"
      accentColor="#22D3EE"
      aspectRatio="16:9"
      previewImage="/visuals/previews/long-caption-pro.png"
      dashHref="/dashboard?videoType=long-caption-pro"
      features={[
        { title: "Full 16:9 Landscape Layout", desc: "Maintains native 1920x1080 horizontal aspect ratio without cropping." },
        { title: "Up to 10-Minute Videos", desc: "Built to handle long lectures, webinars, and podcast episodes." },
        { title: "Sub-Second Word Sync", desc: "Groq Whisper Large v3 guarantees precise subtitle placement." },
        { title: "Broadcast Title Styling", desc: "Clean lower-third captions designed for YouTube and TV screens." },
        { title: "Audio Quality Preserved", desc: "Pristine audio passthrough without re-compression degradation." },
        { title: "Fast Lambda Render Engine", desc: "Processes 10-minute longform videos in under 45 seconds." },
      ]}
      howItWorks={[
        { step: "01", title: "Upload 16:9 Landscape Video", desc: "Select any horizontal video file up to 10 minutes in length." },
        { step: "02", title: "Longform Groq Transcription", desc: "Whisper processes full speech timeline and aligns captions." },
        { step: "03", title: "Export 1080p Subtitled Video", desc: "Download ready-to-publish 16:9 video file." },
      ]}
      whoIsItFor={[
        { role: "YouTube Creators & Podcasters", desc: "Add professional subtitles to long-form video podcasts and interviews." },
        { role: "Webinar & Course Instructors", desc: "Enhance accessibility and student comprehension for online courses." },
        { role: "Corporate Trainers", desc: "Publish internal training videos with clear, high-contrast captions." },
      ]}
      techSpecs={[
        { label: "Supported Video", value: "16:9 MP4, MOV (up to 10 minutes)" },
        { label: "Export Format", value: "1920x1080 (16:9 Horizontal MP4)" },
        { label: "Transcription Engine", value: "Groq Whisper Large v3" },
        { label: "Render Time", value: "~45 Seconds" },
        { label: "Cost Per Render", value: "3 Credits" },
      ]}
      faqs={[
        { q: "What is the maximum video length supported?", a: "Long Caption Pro supports horizontal videos up to 10 minutes." },
      ]}
    />
  );
}
