'use client';

import React from 'react';
import RichTemplateDetail from "@/components/templates/RichTemplateDetail";

export default function CompareExplainerDetail() {
  return (
    <RichTemplateDetail
      id="compare-explainer"
      title="Compare Explainer AI Video Generator"
      theme="light"
      subtitle="Side-by-side comparison video generator featuring animated stickman presenter, dual images, and synced audio captions."
      badge="High-Retention AI Video Maker • 9:16 Reel"
      accentColor="#F59E0B"
      aspectRatio="9:16"
      previewImage="https://res.cloudinary.com/dhouh9idx/image/upload/v1788093814/teacher-welcome_ouesss.png"
      dashHref="/dashboard?videoType=compare-explainer"
      features={[
        { title: "Dual Subject Split View", desc: "Left vs Right panel layout designed for product vs product or concept vs concept." },
        { title: "Animated Sticker Presenter", desc: "Choose from stickman avatar styles to present your side-by-side comparison live." },
        { title: "Voiceover Timestamp Sync", desc: "Captions automatically sync with your audio narration track." },
        { title: "Custom Topic Headers", desc: "Set custom left and right titles, prices, or feature tags." },
        { title: "High-Contrast Cards", desc: "Designed for maximum visual clarity on small mobile screens." },
        { title: "Fast S3 Image Processing", desc: "Upload high-res JPG or PNG images with instant layout previews." },
      ]}
      howItWorks={[
        { step: "01", title: "Upload Audio Narration", desc: "Provide your MP3 or WAV audio track explaining the two subjects." },
        { step: "02", title: "Add Subject Images", desc: "Upload Image A (Left) and Image B (Right) to compare." },
        { step: "03", title: "Render Comparison Reel", desc: "Get a 1080p vertical comparison video with animated presenter and subtitles." },
      ]}
      whoIsItFor={[
        { role: "Product Reviewers", desc: "Compare Tech A vs Tech B or iPhone vs Android side-by-side." },
        { role: "Financial & Career Advisors", desc: "Explain Job A vs Job B or Mutual Funds vs Stocks visually." },
        { role: "E-commerce Brands", desc: "Showcase Before vs After product results to boost sales conversions." },
      ]}
      techSpecs={[
        { label: "Supported Audio", value: "MP3, WAV, M4A (up to 90 sec)" },
        { label: "Image Inputs", value: "2 High-Res Images (JPG/PNG)" },
        { label: "Export Format", value: "1080x1920 (9:16 Vertical MP4)" },
        { label: "Presenter Styles", value: "Multiple Stickman Avatars" },
        { label: "Render Time", value: "~30 Seconds" },
        { label: "Cost Per Render", value: "2 Credits" },
      ]}
      faqs={[
        { q: "Can I customize the presenter sticker character?", a: "Yes! Select from a collection of sticker avatar styles in the dashboard." },
        { q: "What images work best?", a: "High-resolution square or vertical images of the two items you are comparing." },
      ]}
    />
  );
}

