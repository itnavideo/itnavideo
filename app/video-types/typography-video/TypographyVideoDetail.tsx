'use client';

import React from 'react';
import RichTemplateDetail from "@/components/templates/RichTemplateDetail";

export default function TypographyVideoDetail() {
  return (
    <RichTemplateDetail
      id="typography-video"
      title="Kinetic Typography AI Video Maker"
      subtitle="Big, bold, high-energy kinetic text overlays popping on screen to the exact millisecond you speak."
      badge="Kinetic Text • AI Video Generator"
      accentColor="#8B5CF6"
      aspectRatio="9:16"
      previewImage="https://res.cloudinary.com/dhouh9idx/image/upload/v1788094218/Typography_Video_sitlxz.png"
      dashHref="/dashboard?videoType=typography-video"
      features={[
        { title: "Kinetic Word Slam", desc: "Huge typography popping on screen synced to audio volume spikes." },
        { title: "Emphasis Keyword Detection", desc: "Highlights critical power words in vibrant contrasting colors." },
        { title: "Smooth Spring Motion", desc: "60fps animated text transitions that keep viewers hooked." },
        { title: "High-Contrast Overlay", desc: "Ensures text remains 100% legible over any background video." },
        { title: "Pro Font Selection", desc: "Built using bold sans-serif fonts optimized for mobile feeds." },
        { title: "Fast Cloud Render", desc: "Renders in seconds without stutter or dropped frames." },
      ]}
      howItWorks={[
        { step: "01", title: "Upload Video with Speech", desc: "Upload your talking head clip or voiceover track." },
        { step: "02", title: "Beat & Word Sync", desc: "Groq Whisper maps speech cadence to kinetic text timing." },
        { step: "03", title: "Export High-Energy Reel", desc: "Download high-impact 1080p kinetic typography video." },
      ]}
      whoIsItFor={[
        { role: "Motivational Speakers", desc: "Turn powerful quotes and speeches into viral short clips." },
        { role: "Fitness & Lifestyle Coaches", desc: "Create high-energy workout and routine reels." },
        { role: "Content Marketers", desc: "Capture 5x higher attention on social media feeds." },
      ]}
      techSpecs={[
        { label: "Supported Video", value: "MP4, MOV (up to 60s)" },
        { label: "Export Format", value: "1080x1920 (9:16 Vertical MP4)" },
        { label: "Motion Engine", value: "Remotion Spring Kinetic" },
        { label: "Render Time", value: "~20 Seconds" },
        { label: "Cost Per Render", value: "1 Credit" },
      ]}
      faqs={[
        { q: "What makes typography videos so viral?", a: "Huge, fast-moving text taps into short attention spans and keeps viewers watching longer." },
      ]}
    />
  );
}

