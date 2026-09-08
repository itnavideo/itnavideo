'use client';

import React from 'react';
import RichTemplateDetail from "@/components/templates/RichTemplateDetail";

export default function WhiteboardVideoDetail() {
  return (
    <RichTemplateDetail
      id="whiteboard-video"
      title="Whiteboard AI Video Generator"
      subtitle="Extract key insights from speech and write them live onto a sleek digital whiteboard with our AI video maker."
      badge="Educational AI Video Creator • 9:16 Reel"
      accentColor="#10B981"
      aspectRatio="9:16"
      previewImage="https://res.cloudinary.com/dhouh9idx/image/upload/v1788190745/file_000000003c2882118520991dc7d2d827_alfyoc.png"
      dashHref="/dashboard?videoType=whiteboard-video"
      features={[
        { title: "Speech Keypoint Extraction", desc: "Identifies core educational takeaways and formats them as clean bullet points." },
        { title: "Hand-Drawn Writing Effect", desc: "Text appears dynamically in sync with narration timing." },
        { title: "Clean Corporate Board", desc: "Modern dark/light digital whiteboard theme with high readability." },
        { title: "Full Caption Integration", desc: "Combines whiteboard notes with word-level bottom subtitles." },
        { title: "Ideal for Lessons & Summaries", desc: "Transforms complex lectures into easy-to-digest short reels." },
        { title: "Zero Manual Design", desc: "No need to draw or keyframe graphics manually." },
      ]}
      howItWorks={[
        { step: "01", title: "Upload Audio or Video", desc: "Provide any educational voiceover, lecture, or podcast track." },
        { step: "02", title: "AI Note Extraction", desc: "System structures main points into timed whiteboard cards." },
        { step: "03", title: "Export Whiteboard Reel", desc: "Download crisp 1080p vertical video ready for publishing." },
      ]}
      whoIsItFor={[
        { role: "Teachers & Professors", desc: "Convert long lectures into engaging 60-second summary reels for students." },
        { role: "Business Coaches", desc: "Share structured frameworks, checklists, and strategy steps." },
        { role: "Book Summarizers", desc: "Publish visual book breakdowns and top takeaways." },
      ]}
      techSpecs={[
        { label: "Supported Audio/Video", value: "MP3, WAV, MP4, MOV" },
        { label: "Export Format", value: "1080x1920 (9:16 Vertical MP4)" },
        { label: "Layout Engine", value: "Auto Whiteboard Planner" },
        { label: "Render Time", value: "~35 Seconds" },
        { label: "Cost Per Render", value: "1 Credit" },
      ]}
      faqs={[
        { q: "Does the AI automatically pick the bullet points?", a: "Yes! The system analyzes your transcript and extracts key lesson points." },
        { q: "Can I use long recordings?", a: "Whiteboard reels support voiceovers up to 90 seconds per reel." },
      ]}
    />
  );
}

