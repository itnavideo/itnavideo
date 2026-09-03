'use client';

import React from 'react';
import RichTemplateDetail from "@/components/templates/RichTemplateDetail";

export default function LongVideoPromoDetail() {
  return (
    <RichTemplateDetail
      id="long-video-promo"
      title="Long Video Promo AI Video Maker"
      subtitle="Convert long YouTube videos and podcasts into high-converting vertical trailer teasers with our AI video generator."
      badge="YouTube Promo • AI Video Creator"
      accentColor="#EC4899"
      aspectRatio="9:16"
      previewImage="https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_000000002d508209b398a35503a053e1_uiytox.png"
      dashHref="/dashboard?videoType=long-video-promo"
      features={[
        { title: "Top Poster/Thumbnail Frame", desc: "Places your YouTube thumbnail or custom poster at the top for instant recognition." },
        { title: "Explainer Presenter Panel", desc: "Lower panel features your video clip or presenter explaining the highlight." },
        { title: "Watch Full Video CTA", desc: "Animated call-to-action buttons directing viewers to your main channel." },
        { title: "Word-Synced Subtitles", desc: "Includes styled captions on the presenter section." },
        { title: "Designed for Traffic Growth", desc: "Proven layout used by top YouTubers to drive 10x link clicks." },
        { title: "Full HD Render Quality", desc: "Crisp 1080p output for Instagram Reels and YouTube Shorts." },
      ]}
      howItWorks={[
        { step: "01", title: "Upload Video + Thumbnail", desc: "Provide a 30-60s video clip and your YouTube poster image." },
        { step: "02", title: "Configure Promo Layout", desc: "Set thumbnail placement and call-to-action button text." },
        { step: "03", title: "Export Vertical Teaser", desc: "Download high-converting promo reel ready to drive traffic." },
      ]}
      whoIsItFor={[
        { role: "YouTubers & Podcasters", desc: "Promote new channel uploads and drive shorts viewers to full videos." },
        { role: "Course Creators", desc: "Share lesson teasers and direct students to buy full courses." },
        { role: "Filmmakers & Directors", desc: "Create vertical trailer teasers for upcoming movie or interview releases." },
      ]}
      techSpecs={[
        { label: "Supported Video", value: "MP4, MOV (30s–90s)" },
        { label: "Thumbnail Input", value: "JPG, PNG Poster Image" },
        { label: "Export Format", value: "1080x1920 (9:16 Vertical MP4)" },
        { label: "Render Time", value: "~30 Seconds" },
        { label: "Cost Per Render", value: "1 Credit" },
      ]}
      faqs={[
        { q: "Where does the thumbnail appear?", a: "The thumbnail image is pinned at the top frame of the vertical reel." },
      ]}
    />
  );
}

