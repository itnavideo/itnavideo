import type { Metadata } from "next";
import RichTemplateDetail from "@/components/templates/RichTemplateDetail";

export const metadata: Metadata = {
  title: "YouTube Subtitle Generator — 16:9 Landscape Video Subtitles | Itnavideo",
  description:
    "Add clean, professional creator-grade subtitles to your 16:9 YouTube videos and podcasts up to 15 minutes with our AI video generator.",
  alternates: { canonical: "/video-types/youtube-subtitle-generator" },
};

export default function YouTubeSubtitleGeneratorTemplatePage() {
  return (
    <RichTemplateDetail
      id="youtube-subtitle-generator"
      title="YouTube Subtitle Generator"
      subtitle="Clean, professional 16:9 landscape format subtitles used by top Western creators including Ali Abdaal, Vox Documentary, Diary of a CEO, and Huberman Lab."
      badge="16:9 YouTube • 9 Tier-1 Western Styles • Safe Zones"
      accentColor="#2563EB"
      aspectRatio="16:9"
      previewImage="/visuals/heroimages/youtubesubtitlesgenerator.hero.png"
      dashHref="/dashboard?videoType=youtube-subtitle-generator"
      features={[
        {
          title: "Full 16:9 Landscape Layout",
          desc: "Maintains native 1920x1080 horizontal aspect ratio without cropping, zooming, or awkward black bars.",
        },
        {
          title: "9 Authentic Western Creator Presets",
          desc: "Curated typography treatments: Ali Abdaal Clean Pill, Vox Documentary, Diary of a CEO, Huberman Lab, MrBeast Punch, MKBHD Studio, BBC/Netflix CC, Kurzgesagt, and Lex Fridman.",
        },
        {
          title: "YouTube UI Safe Zone Margins",
          desc: "Choose from 48px Default, 84px Scrubber Safe, or 120px High TV placement to guarantee captions never collide with player controls.",
        },
        {
          title: "Letter Casing & Typography Control",
          desc: "Toggle between Natural Sentence Case for sophisticated documentary feel or punchy UPPERCASE for high-retention energy.",
        },
        {
          title: "30+ Languages Transcription & Translation",
          desc: "Precision Speech AI auto-detects language and transcribes with sub-second word-level timestamp accuracy.",
        },
        {
          title: "100% Original Audio & Video Fidelity",
          desc: "Pristine passthrough without re-compression degradation, unwanted AI artifacts, or volume attenuation.",
        },
      ]}
      howItWorks={[
        {
          step: "01",
          title: "Upload 16:9 Landscape Video",
          desc: "Select any horizontal video file (MP4, MOV, WEBM) up to 15 minutes in length.",
        },
        {
          step: "02",
          title: "Pick Western Style & Safe Margin",
          desc: "Choose Ali Abdaal, Vox, or CEO preset, and select your bottom player UI safe zone buffer.",
        },
        {
          step: "03",
          title: "Export 1080p Subtitled Video",
          desc: "Download a ready-to-upload 16:9 MP4 video file with subtitles permanently burned in.",
        },
      ]}
      whoIsItFor={[
        {
          role: "YouTube Creators & Podcasters",
          desc: "Add readable, stylish subtitles to long-form video podcasts, interviews, and vlogs.",
        },
        {
          role: "Educators & Course Instructors",
          desc: "Enhance accessibility and student comprehension for technical lectures and webinars.",
        },
        {
          role: "Video Essayists & Documentarians",
          desc: "Apply cinematic typography with yellow keyphrase emphasis for storytelling depth.",
        },
      ]}
      techSpecs={[
        { label: "Supported Video", value: "16:9 MP4, MOV, WEBM (up to 15 minutes)" },
        { label: "Export Resolution", value: "1920×1080 (16:9 Landscape MP4)" },
        { label: "Presets Available", value: "9 Western Creator Styles (Ali Abdaal, Vox, CEO, Huberman, etc.)" },
        { label: "Safe Zone Margins", value: "48px Default, 84px Scrubber Safe, 120px High TV" },
        { label: "Transcription AI", value: "Precision Speech AI Engine" },
        { label: "Billing", value: "1 Credit per 2 Minutes (Refunded if error)" },
      ]}
      faqs={[
        {
          q: "What is the maximum video duration supported?",
          a: "YouTube Subtitle Generator supports videos up to 15 minutes (900 seconds) in length.",
        },
        {
          q: "What creator styles are available?",
          a: "9 authentic Tier-1 Western presets: Ali Abdaal Clean Pill, Vox Documentary, Diary of a CEO, Huberman Lab, MrBeast Punch, MKBHD Studio, BBC/Netflix Classic, Kurzgesagt, and Lex Fridman.",
        },
        {
          q: "How does YouTube safe zone margin work?",
          a: "It lets you position subtitles safely above the YouTube progress scrubber bar (84px) or TV interface (120px) so the viewer's controls never block readability.",
        },
        {
          q: "Can I use vertical 9:16 videos?",
          a: "For vertical 9:16 reels and shorts, use the Auto Caption Generator. YouTube Subtitle Generator is optimized specifically for widescreen 16:9 videos.",
        },
      ]}
    />
  );
}
