"use client";

import UploadBox from "@/components/dashboard/UploadBox";
import { motion } from "framer-motion";
import { AudioLines, Camera, Download, Gauge } from "lucide-react";

export default function UploadPage() {
  return (
    <main className="brand-surface min-h-screen px-6 py-24 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-3xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-brand-mint">Upload source</p>
          <h1 className="text-5xl font-black leading-tight md:text-6xl">Upload audio for faceless videos or camera footage for edits.</h1>
          <p className="mt-5 text-lg leading-8 text-zinc-300">
            Faceless mode starts with required audio and optional visuals. Face camera mode starts with one uploaded video, then Groq, AI planning, and FFmpeg add cuts, zooms, captions, icons, and polish.
          </p>
        </div>
        <UploadBox />
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            { title: "Faceless audio", icon: AudioLines },
            { title: "Face camera video", icon: Camera },
            { title: "Groq + FFmpeg edit", icon: Gauge },
            { title: "Download MP4", icon: Download },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                key={item.title}
                className="rounded-lg border border-white/10 bg-black/25 p-5 transition-colors hover:border-brand-mint/50"
              >
                <Icon className="mb-4 text-brand-mint" size={22} />
                <p className="text-sm font-bold tracking-normal text-white">{item.title}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
