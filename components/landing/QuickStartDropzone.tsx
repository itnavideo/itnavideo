import React from 'react';
import Link from 'next/link';
import { UploadCloud, Video, Mic, FileText } from 'lucide-react';

export default function QuickStartDropzone() {
  return (
    <section className="relative px-4 py-12 sm:px-6 bg-[#070B14] border-b border-white/10 flex justify-center text-white">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-sans">
            Start Creating <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">Now</span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1 font-medium">
            Jump right into the studio to make your next 1080p video.
          </p>
        </div>
        
        <Link href="/dashboard" className="block group">
          <div className="relative rounded-3xl border-2 border-dashed border-white/15 bg-[#0E1526] p-6 sm:p-14 text-center transition-all duration-300 group-hover:border-purple-500/60 group-hover:bg-[#121B32] group-hover:shadow-2xl group-hover:shadow-purple-500/15 cursor-pointer">
            
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-500/10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-purple-500/20 shadow-sm border border-purple-500/30">
              <UploadCloud className="h-9 w-9 text-purple-400" />
            </div>
            
            <h3 className="text-xl sm:text-2xl font-extrabold text-white font-sans tracking-tight">
              Drag &amp; drop your files here
            </h3>
            <p className="mt-3 text-sm text-zinc-400 font-medium max-w-sm mx-auto">
              Upload video, audio, images, or even a text script to begin the AI generation process.
            </p>
            
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-300 bg-[#151E30] border border-white/10 px-3 py-1.5 rounded-lg group-hover:border-purple-500/40 transition-colors">
                <Video size={14} className="text-purple-400" /> MP4, MOV
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-300 bg-[#151E30] border border-white/10 px-3 py-1.5 rounded-lg group-hover:border-purple-500/40 transition-colors">
                <Mic size={14} className="text-fuchsia-400" /> MP3, WAV
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-300 bg-[#151E30] border border-white/10 px-3 py-1.5 rounded-lg group-hover:border-purple-500/40 transition-colors">
                <FileText size={14} className="text-pink-400" /> Text Scripts
              </span>
            </div>

            <div className="mt-8">
              <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition-all group-hover:brightness-110 group-active:scale-95">
                Browse Files
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
