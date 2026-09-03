'use client';

import React from 'react';
import RichTemplateDetail from "@/components/templates/RichTemplateDetail";

export default function CaptionStudioDetail() {
  return (
    <RichTemplateDetail
      id="caption-studio"
      title="Caption Studio AI Video Maker"
      subtitle="Advanced typography & subtitle customization suite with custom font choices, animations, and background boxes for video creators."
      badge="AI Video Creator • Custom Typography"
      accentColor="#6366F1"
      aspectRatio="9:16"
      previewImage="https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_00000000439882098a2ce7f97943dde9_anv3xv.png"
      dashHref="/dashboard?videoType=caption-studio"
      features={[
        { title: "Pro Font Library", desc: "Choose from modern sans-serifs, serif, handwriting, and display fonts." },
        { title: "Custom Background Boxes", desc: "Adjust subtitle background opacity, rounded corners, and padding." },
        { title: "Word-by-Word Highlight Control", desc: "Set primary, secondary, and active word highlight colors." },
        { title: "Vertical Position Drag", desc: "Place captions at top, middle, or bottom of screen." },
        { title: "Instant Live Preview", desc: "Preview caption style changes in real-time before rendering." },
        { title: "Multi-Language Transcription", desc: "Accurate English and Hinglish speech recognition." },
      ]}
      howItWorks={[
        { step: "01", title: "Upload Talking Video", desc: "Provide your MP4 or MOV video recording." },
        { step: "02", title: "Customize Subtitle Styling", desc: "Select font family, colors, box style, and screen position." },
        { step: "03", title: "Export Custom Subtitled Video", desc: "Download high-contrast 1080p video ready to post." },
      ]}
      whoIsItFor={[
        { role: "Professional Video Editors", desc: "Save time on tedious subtitle keyframing with custom preset styles." },
        { role: "Brand & Content Strategists", desc: "Ensure subtitles strictly adhere to brand font and color guidelines." },
        { role: "Social Media Agencies", desc: "Deliver consistent subtitled reels for multiple clients." },
      ]}
      techSpecs={[
        { label: "Supported Video", value: "MP4, MOV (up to 60s)" },
        { label: "Export Format", value: "1080x1920 (9:16 Vertical MP4)" },
        { label: "Styling Options", value: "Fonts, Box Styles, Positions" },
        { label: "Render Time", value: "~25 Seconds" },
        { label: "Cost Per Render", value: "1 Credit" },
      ]}
      faqs={[
        { q: "Can I save my custom subtitle style?", a: "Yes! Your selected styling stays saved across sessions in the dashboard." },
      ]}
    />
  );
}

