'use client';

import React from 'react';
import RichTemplateDetail from "@/components/templates/RichTemplateDetail";

export default function FacelessVideoDetail() {
  return (
    <RichTemplateDetail
      id="faceless-video"
      title="Faceless Video (16:9 YouTube)"
      subtitle="Turn voiceover audio up to 20 minutes into complete 16:9 widescreen YouTube videos with curated AI visuals, Canva studio backgrounds, SFX, and word-synced captions."
      badge="16:9 Widescreen • Voiceover to Video"
      accentColor="#F59E0B"
      aspectRatio="16:9"
      previewImage="https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_0000000089c48211b67c16fe3c2636a2_prirg0.png"
      dashHref="/dashboard?videoType=faceless-video"
      features={[
        { title: "Voiceover to 16:9 Video", desc: "Upload audio up to 20 minutes. AI arranges full 16:9 widescreen scenes with curated visual assets." },
        { title: "Curated AI Visual Library", desc: "Matched against high-definition visuals with dynamic zoom and pan motions." },
        { title: "Canva Studio Backgrounds", desc: "Solid and vignette studio backgrounds in clean white, dark, and brand palettes." },
        { title: "Smart SFX Transitions", desc: "Cloudinary sound effects (whooshes, pops, chimes) timed to scene cuts with auto cooldown." },
        { title: "Dynamic Word-Highlight Captions", desc: "Karaoke-style synchronized subtitle strip rendered at the lower-third." },
        { title: "Zero Distortion & Glare", desc: "3-font typography hierarchy optimized for high legibility on widescreen displays." },
      ]}
      howItWorks={[
        { step: "01", title: "Upload Voiceover Audio", desc: "Drop your MP3, WAV, or M4A file up to 20 minutes." },
        { step: "02", title: "AI Detects Pacing & Scenes", desc: "Scenes, visuals, backgrounds, and SFX are automatically choreographed." },
        { step: "03", title: "Render & Download 1080p", desc: "Export high-resolution 1920x1080 YouTube video ready to publish." },
      ]}
      whoIsItFor={[
        { role: "Faceless YouTube Channels", desc: "Documentary, finance, history, and storytelling creators." },
        { role: "Podcasters & Narrators", desc: "Turn voice recordings into captivating full-length video essays." },
        { role: "Educators & Marketers", desc: "Deliver deep-dive lessons and tutorials without showing your face." },
      ]}
      techSpecs={[
        { label: "Supported Input", value: "Voiceover Audio (MP3, WAV, M4A, AAC) up to 20 min" },
        { label: "Export Resolution", value: "1920x1080 (16:9 Full HD Widescreen)" },
        { label: "AI Engines", value: "Groq Whisper + Smart Asset Matcher + SFX Engine" },
        { label: "Render Time", value: "~60 Seconds" },
        { label: "Cost Per Render", value: "3 Credits" },
      ]}
      faqs={[
        { q: "Is this strictly 16:9 widescreen?", a: "Yes, Faceless Video is purpose-built for YouTube long-form at 1920x1080 widescreen." },
        { q: "How long can my voiceover be?", a: "You can upload up to 20 minutes of continuous voiceover audio." },
        { q: "Can I customize fonts and background themes?", a: "Yes, you can select custom heading, subheading, and body fonts, and choose between various studio background themes." },
      ]}
    />
  );
}
