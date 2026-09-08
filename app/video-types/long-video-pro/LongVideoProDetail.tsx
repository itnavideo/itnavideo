'use client';

import React from 'react';
import RichTemplateDetail from "@/components/templates/RichTemplateDetail";

export default function LongVideoProDetail() {
  return (
    <RichTemplateDetail
      id="long-video-pro"
      title="Long Video Pro AI Video Maker"
      subtitle="Professional 16:9 explainer creation tool with automatic visual scene switching and background audio polish with our AI video generator."
      badge="16:9 Explainer • AI Video Creator"
      accentColor="#F43F5E"
      aspectRatio="16:9"
      previewImage="/visuals/previews/long-form-captioned-video.png"
      dashHref="/dashboard?videoType=long-video-pro"
      features={[
        { title: "AI Scene Director", desc: "Automatically plans visual scene changes based on script narration." },
        { title: "Multi-Asset Layering", desc: "Blends voiceover, visual media, text graphics, and background music." },
        { title: "Pristine 1080p Export", desc: "Broadcast-ready horizontal video for courses and YouTube." },
        { title: "Audio Noise Suppression", desc: "Removes hiss and cleans voiceover tracks automatically." },
        { title: "Timed Scene Transitions", desc: "Smooth cuts and zoom effects between lesson sections." },
        { title: "Saves Days of Production", desc: "Replaces Adobe Premiere/After Effects with automated AI orchestration." },
      ]}
      howItWorks={[
        { step: "01", title: "Upload Script or Voiceover", desc: "Provide your lesson voice recording or course script." },
        { step: "02", title: "AI Blueprint Scene Planning", desc: "Director engine plans visual scenes, captions, and graphics." },
        { step: "03", title: "Export 16:9 Explainer", desc: "Download complete horizontal explainer video in 1080p." },
      ]}
      whoIsItFor={[
        { role: "Online Course Creators", desc: "Build polished 16:9 course modules without hiring editors." },
        { role: "Corporate Trainers", desc: "Produce professional product walkthroughs and onboarding videos." },
        { role: "YouTube Explainer Channels", desc: "Publish high-quality educational videos on tight schedules." },
      ]}
      techSpecs={[
        { label: "Supported Input", value: "Audio, Video, or Script Text" },
        { label: "Export Format", value: "1920x1080 (16:9 Horizontal MP4)" },
        { label: "Director Engine", value: "Blueprint Scene Planner" },
        { label: "Render Time", value: "~60 Seconds" },
        { label: "Cost Per Render", value: "3 Credits" },
      ]}
      faqs={[
        { q: "Can I use my own images or media?", a: "Yes! You can upload your own visuals or let the AI select matching graphics." },
      ]}
    />
  );
}

