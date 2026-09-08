'use client';

import React from 'react';
import RichTemplateDetail from "@/components/templates/RichTemplateDetail";

export default function AiVideoGeneratorDetail() {
  return (
    <RichTemplateDetail
      id="ai-video-generator"
      title="Faceless Video AI Maker"
      subtitle="Turn voiceovers, videos, or scripts into complete 16:9 widescreen YouTube & 9:16 vertical videos with automated B-Roll, motion graphics, ducked music, and animated subtitles."
      badge="Free AI Video Generator • Voice & Video to Video"
      accentColor="#38BDF8"
      aspectRatio="16:9"
      previewImage="https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_0000000089c48211b67c16fe3c2636a2_prirg0.png"
      dashHref="/dashboard?videoType=faceless-video"
      features={[
        { title: "Voiceover & Video to Scene Generator", desc: "Supports raw audio voiceovers (faceless) and recorded videos (facecam) with smart scene cuts." },
        { title: "Automatic B-Roll & Visual Assets", desc: "Matches relevant background visuals, kinetic motion graphics, stock footage, and stickers per scene." },
        { title: "Interactive Script Review", desc: "Instant word-by-word transcription preview with spelling verification before rendering." },
        { title: "Smart Background Music & SFX", desc: "Auto-ducks background music during speech and inserts punchy sound effects at key hook points." },
        { title: "Viral Word-Highlight Captions", desc: "Applies high-impact animated captions with active word highlighting and custom fonts." },
        { title: "1080p Full HD Widescreen & Vertical", desc: "Generates high-resolution horizontal (16:9) YouTube or vertical (9:16) Reels/Shorts exports." },
      ]}
      howItWorks={[
        { step: "01", title: "Upload Voiceover or Video", desc: "Drop your audio voiceover (MP3/WAV) or video recording (MP4/MOV)." },
        { step: "02", title: "Review Script & AI Scene Plan", desc: "AI automatically extracts the script, matches B-Roll, and plans scene switches." },
        { step: "03", title: "Export 1080p Video", desc: "Download ready-to-publish long-form video for YouTube, courses, or social channels." },
      ]}
      whoIsItFor={[
        { role: "YouTube Creators & Channels", desc: "Publish daily documentary, explainer, story, or educational videos with minimal editing time." },
        { role: "Course Creators & Educators", desc: "Convert lectures and voice recordings into engaging visual presentations with B-Roll." },
        { role: "Businesses & Marketers", desc: "Create high-converting product explainers and promo videos at fraction of traditional agency costs." },
      ]}
      techSpecs={[
        { label: "Supported Input", value: "Voiceover Audio (MP3/WAV) or Video (MP4/MOV)" },
        { label: "Export Resolutions", value: "1920x1080 (16:9) or 1080x1920 (9:16)" },
        { label: "AI Engines", value: "Groq Whisper Transcription + AI Scene Director" },
        { label: "Render Time", value: "~45-60 Seconds" },
        { label: "Cost Per Render", value: "3 Credits" },
      ]}
      faqs={[
        { q: "Can I use this for both Faceless and Facecam videos?", a: "Yes! If you upload audio, AI generates a full-screen B-roll visual presentation. If you upload a video, your video remains the base track while AI adds B-roll popups, zoom punch-ins, sound effects, and subtitles." },
        { q: "Can I review and edit the script before rendering?", a: "Yes! As soon as you upload, AI generates an interactive word-level script preview so you can check and correct spellings or names." },
        { q: "Does it support English and Hinglish audio?", a: "Yes! Clean Roman Hinglish and English audio are fully supported with word-synced subtitles." },
      ]}
    />
  );
}
