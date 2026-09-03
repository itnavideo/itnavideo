'use client';

import React from 'react';
import RichTemplateDetail from "@/components/templates/RichTemplateDetail";

export default function MultiImagesVideoDetail() {
  return (
    <RichTemplateDetail
      id="multi-images-video"
      title="Multi Images AI Video Maker"
      subtitle="Combine photos, voiceover, headlines, and animated slideshows for storytelling and news reels with our AI video generator."
      badge="Storyteller • AI Video Maker"
      accentColor="#06B6D4"
      aspectRatio="9:16"
      previewImage="https://res.cloudinary.com/dhouh9idx/image/upload/v1788202087/file_00000000ce648211b220fc406885b264_k6snxz.png"
      dashHref="/dashboard?videoType=multi-images-video"
      features={[
        { title: "Dynamic Slide Switching", desc: "Smooth transitions between 2 to 5 uploaded photo slides." },
        { title: "Headline Banner Overlays", desc: "Top breaking news or chapter title badges." },
        { title: "Narration Captions", desc: "Bottom word-by-word subtitles synced to speech." },
        { title: "Magazine & Documentary Style", desc: "Polished visual aesthetic for news summaries." },
        { title: "Custom Photo Duration", desc: "Pacing automatically adjusts to voiceover length." },
        { title: "High-Resolution Image Support", desc: "Preserves sharp photo details on mobile retina displays." },
      ]}
      howItWorks={[
        { step: "01", title: "Upload Audio & Photos", desc: "Provide your voiceover narration and 2–5 supporting images." },
        { step: "02", title: "AI Slide Sync", desc: "System distributes photo timing across your speech duration." },
        { step: "03", title: "Export News Reel", desc: "Download high-impact magazine-style 1080p story reel." },
      ]}
      whoIsItFor={[
        { role: "News & Media Publishers", desc: "Cover breaking stories, historical recaps, and current events." },
        { role: "Case Study & Agency Creators", desc: "Present client case studies with before/after photos and narration." },
        { role: "Travel & Lifestyle Creators", desc: "Share photo trip recaps with voiceover storytelling." },
      ]}
      techSpecs={[
        { label: "Supported Audio", value: "MP3, WAV, M4A" },
        { label: "Image Slots", value: "2 to 5 Images (JPG/PNG)" },
        { label: "Export Format", value: "1080x1920 (9:16 Vertical MP4)" },
        { label: "Render Time", value: "~35 Seconds" },
        { label: "Cost Per Render", value: "1 Credit" },
      ]}
      faqs={[
        { q: "How many images can I upload?", a: "You can upload between 2 and 5 images per reel." },
      ]}
    />
  );
}

