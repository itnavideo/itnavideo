'use client';

import React from 'react';
import RichTemplateDetail from "@/components/templates/RichTemplateDetail";

export default function FacelessLongVideoDetail() {
  return (
    <RichTemplateDetail
      id="faceless-long-video"
      title="Faceless Text to Video Generator"
      subtitle="Turn voiceover audio or text scripts into complete faceless videos with auto B-Roll, stock scenes, and kinetic subtitles using our free AI video generator."
      badge="Free AI Video Generator • Text to Video"
      accentColor="#38BDF8"
      aspectRatio="16:9"
      previewImage="https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_0000000089c48211b67c16fe3c2636a2_prirg0.png"
      dashHref="/dashboard?videoType=faceless-long-video"
      features={[
        { title: "Voiceover to Scene Generator", desc: "Automatically splits voiceover audio into visual scenes based on pauses and topic shifts." },
        { title: "Automatic B-Roll & Visual Matching", desc: "Matches relevant background visuals, graphics, and stock media per scene." },
        { title: "Viral Kinetic Captions", desc: "Applies high-impact animated captions with active word highlighting." },
        { title: "Audio Clean & Noise Removal", desc: "Cleans background noise, hiss, and hums from voiceover recordings automatically." },
        { title: "Custom Title & Chapter Cards", desc: "Includes lower-third title cards, chapter markers, and top badges." },
        { title: "1080p Full HD Export", desc: "Generates high-resolution horizontal (16:9) or vertical (9:16) MP4 exports." },
      ]}
      howItWorks={[
        { step: "01", title: "Upload Voiceover or Script", desc: "Upload your voice recording (MP3/WAV) or type a text script." },
        { step: "02", title: "AI Scene & B-Roll Match", desc: "Engine creates visual scene blueprints and syncs captions to speech." },
        { step: "03", title: "Export Faceless Video", desc: "Download ready-to-publish video for YouTube, Shorts, or Instagram." },
      ]}
      whoIsItFor={[
        { role: "Faceless YouTube Channels", desc: "Publish daily documentary, story, finance, or horror videos without showing your face." },
        { role: "Course Creators & Educators", desc: "Create engaging lesson visual explainers from spoken lectures." },
        { role: "Marketers & Podcasters", desc: "Convert audio episodes into engaging video content for social media." },
      ]}
      techSpecs={[
        { label: "Supported Input", value: "Voiceover Audio (MP3/WAV) or Video" },
        { label: "Export Resolutions", value: "1920x1080 (16:9) or 1080x1920 (9:16)" },
        { label: "AI Engines", value: "Whisper Transcription + Scene Director" },
        { label: "Render Time", value: "~45 Seconds" },
        { label: "Cost Per Render", value: "3 Credits" },
      ]}
      faqs={[
        { q: "Do I need to record my face?", a: "No! This template is specifically built for faceless channels where you only provide audio or a script." },
        { q: "Can I use Hindi or Hinglish voiceovers?", a: "Yes! Roman Hinglish and English voiceovers are fully supported with clean synchronized captions." },
      ]}
    />
  );
}

