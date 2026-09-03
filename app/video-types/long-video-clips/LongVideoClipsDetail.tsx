'use client';

import React from 'react';
import RichTemplateDetail from "@/components/templates/RichTemplateDetail";

export default function LongVideoClipsDetail() {
  return (
    <RichTemplateDetail
      id="long-video-clips"
      title="Long Video Clips AI Video Generator"
      subtitle="AI identifies high-energy viral moments from long videos and automatically cuts captioned vertical shorts with our AI video maker."
      badge="AI Video Maker • Shorts Repurposer"
      accentColor="#10B981"
      aspectRatio="9:16"
      previewImage="https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_000000002af082088dc89d221c90dc80_tmf4h8.png"
      dashHref="/dashboard?videoType=long-video-clips"
      features={[
        { title: "AI Highlight Hook Detection", desc: "Analyzes audio energy and key sentences to pick viral moments." },
        { title: "Multi-Clip Extraction", desc: "Harvests 3 to 5 standalone short clips from one upload." },
        { title: "Auto Vertical Center Re-frame", desc: "Centers speaker face in 9:16 frame automatically." },
        { title: "Word-Level Subtitles", desc: "Adds animated captions to every harvested clip." },
        { title: "Individual Clip Downloads", desc: "Download clips individually or all at once." },
        { title: "Saves Hours of Editing", desc: "Replaces manual video cutting tools with 1-click AI harvesting." },
      ]}
      howItWorks={[
        { step: "01", title: "Upload Long Video Source", desc: "Provide your podcast or webinar recording file." },
        { step: "02", title: "AI Clip Harvesting", desc: "System scans speech patterns and isolates top hooks." },
        { step: "03", title: "Export Captioned Shorts", desc: "Download ready-to-post short clips for Reels & Shorts." },
      ]}
      whoIsItFor={[
        { role: "Podcast Hosts", desc: "Turn 1-hour episodes into 5 viral short clips every week." },
        { role: "Event Organizers", desc: "Harvest key speaker highlights from conference streams." },
        { role: "Content Repurposing Agencies", desc: "Multiply client output by 10x with automated clip generation." },
      ]}
      techSpecs={[
        { label: "Supported Input", value: "Long MP4, MOV Video" },
        { label: "Export Format", value: "Multiple 9:16 Vertical MP4s" },
        { label: "Harvesting Engine", value: "AI Energy Hook Detector" },
        { label: "Render Time", value: "~40 Seconds" },
        { label: "Cost Per Render", value: "1 Credit" },
      ]}
      faqs={[
        { q: "How many clips does it generate?", a: "Depending on video length, it extracts 3 to 5 highlight clips." },
      ]}
    />
  );
}

