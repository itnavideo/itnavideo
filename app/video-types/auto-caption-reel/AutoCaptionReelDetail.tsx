'use client';

import React from 'react';
import RichTemplateDetail from "@/components/templates/RichTemplateDetail";

export default function AutoCaptionReelDetail() {
  return (
    <RichTemplateDetail
      id="auto-caption-generator"
      title="Auto Caption Generator"
      subtitle="AI auto caption generator for Instagram Reels and videos. Generate accurate word-synced animated captions with custom positions, sizes, and colors."
      badge="Free AI Video Generator • 9:16 & 16:9"
      accentColor="#3B82F6"
      aspectRatio="9:16"
      previewImage="https://res.cloudinary.com/dhouh9idx/image/upload/v1788190064/file_000000005540821181b6095da390b68b_qumuqg.png"
      dashHref="/dashboard?videoType=auto-caption-generator"
      features={[
        { title: "AI Speech Sync", desc: "Sub-second precision timestamping for perfect word highlight alignment." },
        { title: "30+ Caption Style Presets", desc: "Select bounce, wave, neon glow, bold impact, and karaoke highlight caption styles." },
        { title: "Custom Position & Size", desc: "Touch-friendly segmented controls for Top, Center, and Bottom positions plus S, M, L, XL sizes." },
        { title: "Full Resolution Export", desc: "Preserves pristine 1080p MP4 visual quality without compression blur." },
        { title: "Text & Highlight Colors", desc: "Customizable active word colors and backing box shapes for maximum readability." },
        { title: "Reels (9:16) & Landscape (16:9)", desc: "Optimized for Instagram Reels, YouTube Shorts, TikTok, and long horizontal videos." },
      ]}
      howItWorks={[
        { step: "01", title: "Upload Video or Audio", desc: "Select any talking head recording, reel, or long-form video." },
        { step: "02", title: "AI Auto Transcription", desc: "Whisper speech engine transcribes words and computes precise timing." },
        { step: "03", title: "Customize & Export", desc: "Pick your style, position, and colors, then download crisp 1080p MP4." },
      ]}
      whoIsItFor={[
        { role: "Instagram & TikTok Creators", desc: "Add engaging captions for instagram to capture viewers scrolling without sound." },
        { role: "Podcasters & Educators", desc: "Publish clear video captions with high-contrast text overlays and karaoke tracking." },
        { role: "Brands & Marketers", desc: "Drive 3x higher retention on promotional product reels and testimonial ads." },
      ]}
      techSpecs={[
        { label: "Supported Inputs", value: "MP4, MOV, WEBM, MP3, M4A" },
        { label: "Export Format", value: "1080p MP4 (9:16 Vertical & 16:9 Landscape)" },
        { label: "Transcription Model", value: "Groq Whisper Large v3" },
        { label: "Render Time", value: "~20 Seconds" },
        { label: "Language Support", value: "English & Hinglish (Roman)" },
        { label: "Cost Per Render", value: "1 Credit (1 Free Trial)" },
      ]}
      faqs={[
        { q: "How fast is the caption generation?", a: "Most 60-second reels finish rendering in under 25–30 seconds." },
        { q: "Can I customize the caption colors and fonts?", a: "Yes! Choose from 15+ subtitle presets and custom highlight colors." },
        { q: "Does this work on mobile phones?", a: "Absolutely. The Itnavideo dashboard is optimized for mobile browser creation." },
      ]}
    />
  );
}

