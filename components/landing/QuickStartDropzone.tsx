import React from 'react';
import Link from 'next/link';
import { UploadCloud, Video, Mic, FileText } from 'lucide-react';

export default function QuickStartDropzone() {
  return (
    <section className="relative px-4 py-12 sm:px-6 bg-slate-50 border-b border-slate-200 flex justify-center">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
            Start Creating <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">Now</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Jump right into the studio to make your next video.
          </p>
        </div>
        
        <Link href="/dashboard" className="block group">
          <div className="relative rounded-3xl border-2 border-dashed border-slate-300 bg-white p-6 sm:p-14 text-center transition-all duration-300 group-hover:border-amber-400 group-hover:bg-amber-50/40 group-hover:shadow-lg cursor-pointer">
            
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 transition-transform duration-300 group-hover:scale-110 group-hover:bg-amber-100 shadow-sm border border-amber-100">
              <UploadCloud className="h-9 w-9 text-amber-500" />
            </div>
            
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
              Drag &amp; drop your files here
            </h3>
            <p className="mt-3 text-sm text-slate-500 font-medium max-w-sm mx-auto">
              Upload video, audio, images, or even a text script to begin the AI generation process.
            </p>
            
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg group-hover:bg-white transition-colors">
                <Video size={14} className="text-amber-500" /> MP4, MOV
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg group-hover:bg-white transition-colors">
                <Mic size={14} className="text-orange-500" /> MP3, WAV
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg group-hover:bg-white transition-colors">
                <FileText size={14} className="text-emerald-500" /> Text Scripts
              </span>
            </div>

            <div className="mt-8">
              <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-8 py-3 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition-all group-hover:from-amber-600 group-hover:to-orange-700 group-hover:shadow-lg group-active:scale-95">
                Browse Files
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
