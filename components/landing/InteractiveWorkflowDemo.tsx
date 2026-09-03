'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Play, 
  Pause, 
  Upload, 
  ArrowRight, 
  Captions, 
  Layers3, 
  PenTool, 
  FileText, 
  Film, 
  Download 
} from 'lucide-react';
import Link from 'next/link';

type WorkflowMode = {
  id: string;
  name: string;
  badge: string;
  icon: any;
  inputs: string[];
  videoSrc: string;
  aiTasks: string[];
  summary: string;
};

const WORKFLOW_MODES: WorkflowMode[] = [
  {
    id: 'auto-caption-reel',
    name: 'Auto Caption Reel',
    badge: 'Short Video (9:16)',
    icon: Captions,
    inputs: ['Talking Video (.mp4 / .mov)'],
    videoSrc: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942630/Are_you_in_the_right_rooms_fppoam.mp4',
    aiTasks: [
      'Groq Whisper speech-to-text transcription',
      'Word-level timing synchronization',
      'Active word highlight & preset styling',
      'Audio leveling & speech preservation',
    ],
    summary: 'Turns raw talking video into viral reels with word-synced animated captions.',
  },
  {
    id: 'compare-explainer',
    name: 'Compare Explainer',
    badge: 'Visual Comparison (9:16)',
    icon: Layers3,
    inputs: ['Voice Narration', 'Left Image', 'Right Image'],
    videoSrc: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942288/What_s_the_difference._IIT_vs_ITI_JEE_vs_NEET__Kya_aapko_bhi_in_terms_ke_beech_ka_asli_farq_pa_bflieg.mp4',
    aiTasks: [
      'Speech intent & scene analysis',
      'Sticker presenter pose selection',
      'Dynamic left vs right split layout',
      'Smooth camera pan & transitions',
    ],
    summary: 'Compares two options side-by-side with an animated presenter character.',
  },
  {
    id: 'whiteboard-video',
    name: 'Whiteboard Video',
    badge: 'Educational (9:16)',
    icon: PenTool,
    inputs: ['Voiceover / Audio', 'Topic Title'],
    videoSrc: '/videos/demo-captions/demo-2.mp4',
    aiTasks: [
      'Automatic key phrase extraction',
      'Corporate whiteboard canvas layout',
      'Handwritten stroke animations',
      'Background music & sound effects',
    ],
    summary: 'Draws key educational points on a clean whiteboard canvas synced to speech.',
  },
  {
    id: 'typography-video',
    name: 'Typography Video',
    badge: 'Kinetic Motion (9:16)',
    icon: FileText,
    inputs: ['Raw Video or Voiceover'],
    videoSrc: 'https://res.cloudinary.com/dhouh9idx/video/upload/q_auto,f_auto/v1783942704/Walking_into_new_territory_is_all_about_asking_the_right_questions_And_of_course_collaborating_dxwggb.mp4',
    aiTasks: [
      'Keyword detection & emphasis mapping',
      'Kinetic typography layout & motion',
      'Impact sound effect alignment',
      'Aspect ratio auto-framing',
    ],
    summary: 'Pops high-impact text keywords on screen the exact second they are spoken.',
  },
  {
    id: 'long-caption-pro',
    name: 'Long Caption Pro',
    badge: 'Long Form (16:9)',
    icon: Film,
    inputs: ['Landscape Video up to 10 min'],
    videoSrc: '/videos/demo-captions/demo-6.mp4',
    aiTasks: [
      'Full 10-minute Groq transcription',
      '16:9 widescreen layout preservation',
      'Multi-line timed caption rendering',
      'Studio audio clarity enhancement',
    ],
    summary: 'Preserves 16:9 YouTube videos while adding timed captions and studio audio.',
  },
];

export default function InteractiveWorkflowDemo() {
  const [selectedMode, setSelectedMode] = useState<WorkflowMode>(WORKFLOW_MODES[0]);
  const [activeTab, setActiveStepTab] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  return (
    <section id="workflow-demo" className="relative px-4 py-20 sm:px-6 sm:py-28 bg-slate-50 border-b border-slate-200">
      <div className="relative z-10 mx-auto max-w-7xl">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 flex items-center justify-center gap-1.5">
            <Sparkles size={14} />
            <span>Interactive Creation Workflow</span>
          </p>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-5xl font-sans tracking-tight">
            See How It Works in 4 Steps
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600">
            Itnavideo automates the entire video editing process. Experience what happens inside the dashboard before creating your account.
          </p>
        </div>

        {/* Workflow Steps Progress Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 max-w-4xl mx-auto">
          {[
            { step: 1, title: 'STEP 1', desc: 'Choose Video Type' },
            { step: 2, title: 'STEP 2', desc: 'Upload Content' },
            { step: 3, title: 'STEP 3', desc: 'AI Automation' },
            { step: 4, title: 'STEP 4', desc: 'Instant Preview' },
          ].map((s) => {
            const isActive = activeTab === s.step;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStepTab(s.step)}
                className={`flex flex-col items-start p-3.5 rounded-xl border transition text-left ${
                  isActive
                    ? 'border-blue-600 bg-white text-slate-900 shadow-md ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <span className={`text-[10px] font-extrabold tracking-wider ${isActive ? 'text-blue-600' : 'text-muted-foreground'}`}>
                  {s.title}
                </span>
                <span className="text-xs font-bold font-sans mt-0.5">{s.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Studio Window Browser Frame */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-2 sm:p-4 shadow-2xl ring-1 ring-slate-900/5 overflow-hidden">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-200 bg-slate-50/80 rounded-t-xl mb-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <span className="ml-2 text-xs font-mono font-bold text-slate-700 tracking-wide">
                itnavideo-studio.app/demo-workflow
              </span>
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              ⚡ Studio Interactive Preview
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start p-2 sm:p-4">
          
          {/* Left Panel: Step Controls */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* STEP 1: Choose Video Type */}
            <div className={`space-y-3 p-4 rounded-xl border transition ${activeTab === 1 ? 'border-blue-500/50 bg-blue-50/50' : 'border-slate-200 bg-slate-50/50'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">Step 1: Choose Video Type</span>
                {activeTab === 1 && <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">Active</span>}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {WORKFLOW_MODES.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = selectedMode.id === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => {
                        setSelectedMode(mode);
                        setActiveStepTab(1);
                      }}
                      className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon size={16} className="mb-1.5" />
                      <span className="text-xs font-bold font-sans leading-tight">{mode.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Required Content Upload */}
            <div className={`space-y-3 p-4 rounded-xl border transition ${activeTab === 2 ? 'border-blue-500/50 bg-blue-50/50' : 'border-slate-200 bg-slate-50/50'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">Step 2: Upload Content</span>
                <span className="text-[10px] font-bold text-slate-500">{selectedMode.name} Inputs</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {selectedMode.inputs.map((inp) => (
                  <div key={inp} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-2xs">
                    <Upload size={14} className="text-blue-600" />
                    <span>{inp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 3: Automated AI Pipeline Checklist */}
            <div className={`space-y-3 p-4 rounded-xl border transition ${activeTab === 3 ? 'border-blue-500/50 bg-blue-50/50' : 'border-slate-200 bg-slate-50/50'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">Step 3: AI Handles Everything</span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">100% Automated</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {selectedMode.aiTasks.map((task) => (
                  <div key={task} className="flex items-center gap-2 text-xs text-slate-700 bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                    <span className="leading-snug">{task}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href={`/dashboard?videoType=${selectedMode.id}`}
                className="inline-flex items-center justify-center gap-2.5 w-full rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition"
              >
                <span>Create Video with {selectedMode.name}</span>
                <ArrowRight size={16} />
              </Link>
            </div>

          </div>

          {/* Right Panel: Step 4 Interactive Result Video Player */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[320px] rounded-2xl border border-slate-200 bg-black overflow-hidden shadow-xl aspect-[9/16]">
              
              {/* Top Header Overlay */}
              <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between">
                <span className="rounded-full bg-muted/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white border border-border">
                  {selectedMode.badge}
                </span>
                <span className="rounded-full bg-emerald-600 text-white font-bold px-2.5 py-0.5 text-[9px]">
                  Rendered
                </span>
              </div>

              {/* Sample Output Video */}
              <video
                key={selectedMode.videoSrc}
                src={selectedMode.videoSrc}
                autoPlay={isPlaying}
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />

              {/* Bottom Overlay Controls */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-4 flex flex-col gap-2 z-10">
                <p className="text-xs font-bold text-white leading-tight font-sans">
                  {selectedMode.summary}
                </p>
                
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow hover:bg-blue-700 transition"
                  >
                    {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                  </button>

                  <Link
                    href={`/dashboard?videoType=${selectedMode.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white transition"
                  >
                    <Download size={13} />
                    <span>Try in Dashboard</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  </section>
);
}

