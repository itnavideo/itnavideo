// app/dashboard/page.js

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthContext';
import {
  Upload,
  Video,
  Clock3,
  Sparkles,
  FolderOpen,
  BarChart3,
  Zap,
  CheckCircle2,
  Loader2,
  X,
  ChevronRight,
  ChevronLeft,
  Music,
  Trash2,
  FileAudio,
  Save,
  Rocket,
} from "lucide-react";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase'; // Ensure db and storage are exported from firebase.js
import { doc, updateDoc } from 'firebase/firestore'; // For updating video progress

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="h-screen bg-black text-white flex overflow-hidden">
      
      {/* Sidebar with Glassmorphism effect */}
      <aside className="hidden md:flex w-72 border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl p-6 flex-col flex-shrink-0">
        
        <div className="mb-12 group cursor-pointer">
          <h1 className="text-3xl font-bold tracking-tight">
            Itna<span className="text-purple-500">video</span>
          </h1>
          <p className="text-zinc-500 mt-1 text-xs uppercase tracking-widest font-medium">
            AI Video Operating System
          </p>
        </div>

        <nav className="space-y-3">
          {[
            { icon: <BarChart3 size={20} />, label: "Dashboard", active: true },
            { icon: <Upload size={20} />, label: "Upload" },
            { icon: <Video size={20} />, label: "My Videos" },
            { icon: <FolderOpen size={20} />, label: "Projects" },
            { icon: <Clock3 size={20} />, label: "History" },
            { icon: <Sparkles size={20} />, label: "AI Tools" },
          ].map((item, i) => (
            <SidebarItem key={i} {...item} />
          ))}
        </nav>

        <div className="mt-auto">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-5">
            <h3 className="font-semibold mb-2">
              Upgrade To Pro 🚀
            </h3>

            <p className="text-sm text-white/80 mb-4">
              Unlock 4K exports, unlimited renders, and premium AI features.
            </p>

            <button className="bg-white text-black px-4 py-2 rounded-xl font-semibold w-full hover:bg-zinc-200 transition-colors shadow-lg shadow-purple-500/20">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-6 md:p-10 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black border-r border-white/5">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-12"
        >
          <div>
            <h2 className="text-4xl font-black tracking-tightest">
              Welcome Back, {user.email?.split('@')[0]} 👋
            </h2>
            <p className="text-zinc-500 mt-2 text-lg font-medium tracking-tight">
              Ready to turn your voice into <span className="text-zinc-200">cinematic magic?</span>
            </p>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-5 md:mt-0 bg-purple-600 hover:bg-purple-500 hover:scale-105 transition-all shadow-xl shadow-purple-500/20 px-8 py-4 rounded-2xl font-bold">
            + Create New Video
          </button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <StatCard title="Videos" value="24" delay={0.1} />
          <StatCard title="Hours Saved" value="96h" delay={0.2} />
          <StatCard title="Storage" value="12GB" delay={0.3} />
          <StatCard title="Current Plan" value="Pro" delay={0.4} />
        </div>

        {/* Upload Section */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 mb-12"
        >
          
          <div className="border-2 border-dashed border-zinc-800 rounded-[1.5rem] p-16 text-center hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer group">
            
            <div className="bg-zinc-800 group-hover:bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
              <Upload size={32} className="text-zinc-400 group-hover:text-purple-400 transition-colors" />
            </div>

            <h4 className="text-2xl font-semibold mb-3">
              Drag & Drop Files
            </h4>

            <p className="text-zinc-400 mb-6">
              Upload voiceovers, screenshots, clips, or images
            </p>

            <button className="bg-purple-600 hover:bg-purple-500 transition px-6 py-3 rounded-xl font-semibold">
              Choose Files
            </button>
          </div>
        </motion.section>

        {/* Recent Projects */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold tracking-tight">
              Recent Projects
            </h3>

            <button className="text-purple-400 hover:text-purple-300">
              View All
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            <ProjectCard
              title="Instagram Reel"
              status="Completed"
              duration="00:45"
            />

            <ProjectCard
              title="YouTube Short"
              status="Rendering"
              duration="01:12"
            />

            <ProjectCard
              title="Podcast Clip"
              status="Completed"
              duration="00:58"
            />
          </div>
        </motion.section>
      </section>

      {/* Right AI Status Sidebar */}
      <aside className="hidden xl:flex w-80 bg-zinc-950/30 backdrop-blur-xl p-6 flex-col overflow-y-auto flex-shrink-0">
        <div className="flex items-center gap-2 mb-8">
          <Zap className="text-purple-500" size={20} fill="currentColor" />
          <h3 className="text-lg font-bold tracking-tight">AI Pipeline</h3>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Live Rendering</p>
            
            <RenderProgressItem 
              name="Instagram Reel #42" 
              status="Syncing B-Roll Assets" 
              progress={82} 
              isProcessing 
            />
            
            <RenderProgressItem 
              name="Tech Review Short" 
              status="Generating AI Captions" 
              progress={45} 
              isProcessing 
            />
          </div>

          <div className="space-y-4 pt-6 border-t border-white/5">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Recently Finished</p>
            
            <RenderProgressItem 
              name="Podcast Highlights" 
              status="Ready to download" 
              progress={100} 
            />
          </div>
        </div>

        {/* Bottom System Stats */}
        <div className="mt-auto pt-6">
          <div className="bg-zinc-900/40 rounded-2xl p-4 border border-white/5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-zinc-500 font-medium">Neural Engine Load</p>
              <p className="text-[10px] font-mono text-purple-400">Peak Performance</p>
            </div>
            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '68%' }}
                className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Multi-step Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <CreateVideoModal onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </main>
  );
}

/* Sidebar Item */
function SidebarItem({ icon, label, active }) {
  return (
    <button
      className={`flex items-center gap-4 w-full px-4 py-3 rounded-2xl transition ${
        active
          ? "bg-purple-600 text-white"
          : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/* Stat Card */
function StatCard({ title, value, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors"
    >
      <p className="text-zinc-500 text-sm mb-2 font-medium">{title}</p>

      <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
    </motion.div>
  );
}

/* Project Card */
function ProjectCard({ title, status, duration }) {
  return ( // Added hover effects for a premium feel
    <div className="bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm hover:scale-[1.02] hover:border-purple-500/50 transition-all duration-300 group">
      
      <div className="h-44 bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center group-hover:from-purple-600/40 group-hover:to-pink-600/40 transition-all duration-300">
        <Video size={52} className="text-white/80" />
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-semibold">{title}</h4>

          <span
            className={`text-sm px-3 py-1 rounded-full ${
              status === "Completed"
                ? "bg-green-500/20 text-green-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {status}
          </span>
        </div>

        <p className="text-zinc-400">
          Duration: {duration}
        </p>

        <button className="mt-5 w-full bg-zinc-800/70 hover:bg-purple-700/50 border border-white/5 py-3 rounded-xl font-medium transition-all duration-300">
          Open Project
        </button>
      </div>
    </div>
  );
}

/* Create Video Multi-step Modal */
function CreateVideoModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [voiceover, setVoiceover] = useState({ file: null, preview: null });
  const [visual, setVisual] = useState({ file: null, preview: null });
  const [config, setConfig] = useState({
    aspectRatio: 'Portrait (9:16) - Reels/TikTok',
    mood: 'Cinematic & Epic',
    captionStyle: 'Modern'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const totalSteps = 3;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Purana preview cleanup karein
      if (voiceover.preview) URL.revokeObjectURL(voiceover.preview);
      
      setVoiceover({
        file: file,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const handleVisualChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Purana preview cleanup karein
      if (visual.preview) URL.revokeObjectURL(visual.preview);

      setVisual({
        file: file,
        preview: URL.createObjectURL(file)
      });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (voiceover.preview) URL.revokeObjectURL(voiceover.preview);
      if (visual.preview) URL.revokeObjectURL(visual.preview);
    };
  }, [voiceover.preview, visual.preview]);

  const handleGenerateVideo = async () => {
    if (!voiceover.file) return alert("Please upload a voiceover or video file first.");
    
    setIsGenerating(true);
    try {
      // 1. Upload assets to Firebase Storage
      const voiceRef = ref(storage, `uploads/${Date.now()}_${voiceover.file.name}`);
      await uploadBytes(voiceRef, voiceover.file);
      const voiceUrl = await getDownloadURL(voiceRef);

      let visualUrl = null;
      if (visual.file) {
        const visualRef = ref(storage, `uploads/${Date.now()}_${visual.file.name}`);
        await uploadBytes(visualRef, visual.file);
        visualUrl = await getDownloadURL(visualRef);
      }

      // 2. Call the AI Generation API
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voiceoverUrl: voiceUrl,
          visualsUrl: visualUrl,
          aspectRatio: config.aspectRatio,
          mood: config.mood,
          captionStyle: config.captionStyle,
          userId: "current-user-id", // Replace with real user ID from context
          inputMediaType: voiceover.file.type.startsWith('video/') ? 'facecam' : 'voiceover'
        })
      });

      if (response.ok) {
        onClose();
        // You could trigger a toast notification here
      }
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Something went wrong during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-zinc-950 border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/30">
          <div>
            <h3 className="text-xl font-bold">Create New Video</h3>
            <p className="text-xs text-zinc-500 mt-1">Step {step} of {totalSteps}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-8 min-h-[350px]">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 flex justify-between">
                  Upload Voiceover
                  {voiceover.file && <span className="text-purple-400 text-xs">Selected</span>}
                </label>
                <label className="block">
                  <div className="border-2 border-dashed border-zinc-800 rounded-2xl p-6 text-center hover:border-purple-500/50 transition-colors cursor-pointer group relative overflow-hidden">
                    {voiceover.preview ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-purple-500/10 p-3 rounded-full">
                          <Music className="text-purple-500" size={24} />
                        </div>
                        <p className="text-sm font-medium truncate max-w-xs">{voiceover.file.name}</p>
                        <audio controls className="h-8 w-full max-w-xs invert opacity-70">
                          <source src={voiceover.preview} type={voiceover.file.type} />
                        </audio>
                        <button 
                          onClick={(e) => { e.preventDefault(); setVoiceover({ file: null, preview: null }); }}
                          className="absolute top-2 right-2 p-1.5 bg-zinc-900 rounded-lg hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload size={24} className="mx-auto text-zinc-500 group-hover:text-purple-400 mb-2" />
                        <p className="text-sm text-zinc-400">Click to select MP3 or WAV file</p>
                        <input type="file" accept="audio/*" className="hidden" onChange={handleAudioChange} />
                      </>
                    )}
                  </div>
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Visual Assets (Optional)</label>
                <div className="grid grid-cols-1 gap-4">
                  <label className="block">
                    <div className="bg-zinc-900/50 p-6 rounded-2xl text-center border border-white/5 hover:bg-zinc-800 transition-all cursor-pointer relative min-h-[120px] flex flex-col items-center justify-center overflow-hidden">
                      {visual.preview ? (
                        <>
                          <img src={visual.preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                          <div className="relative z-10 flex flex-col items-center">
                            <p className="text-xs font-bold bg-black/60 px-3 py-1 rounded-full">{visual.file.name}</p>
                            <button 
                              onClick={(e) => { e.preventDefault(); setVisual({ file: null, preview: null }); }}
                              className="mt-2 p-1.5 bg-zinc-900/80 rounded-lg hover:text-red-400"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-zinc-800 p-2 rounded-lg mb-2"><Sparkles size={16} className="text-purple-400" /></div>
                          <p className="text-xs text-zinc-400">Upload Image / Reference Clip</p>
                          <input type="file" accept="image/*,video/*" className="hidden" onChange={handleVisualChange} />
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-zinc-300">Video Aspect Ratio</label>
                  <select 
                    value={config.aspectRatio}
                    onChange={(e) => setConfig({...config, aspectRatio: e.target.value})}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option>Portrait (9:16) - Reels/TikTok</option>
                    <option>Landscape (16:9) - YouTube</option>
                    <option>Square (1:1) - Instagram</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-zinc-300">AI Mood Detection</label>
                  <select 
                    value={config.mood}
                    onChange={(e) => setConfig({...config, mood: e.target.value})}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option>Cinematic & Epic</option>
                    <option>Minimalist & Clean</option>
                    <option>High Energy / Fast Paced</option>
                    <option>Calm & Educational</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-300">Caption Style</label>
                <div className="flex gap-3">
                  {['Hormozi', 'Modern', 'Minimal', 'None'].map((style) => (
                    <button 
                      key={style} 
                      onClick={() => setConfig({...config, captionStyle: style})}
                      className={`flex-1 py-3 rounded-xl text-xs font-medium transition-all border ${config.captionStyle === style ? 'bg-purple-600 border-purple-500 text-white' : 'bg-zinc-900 border-white/5 text-zinc-400 hover:border-purple-500/50'}`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-center space-y-6 py-4">
              <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                <Sparkles className="text-purple-400" size={32} />
              </div>
              <h4 className="text-2xl font-bold">Ready for the magic?</h4>
              <p className="text-zinc-400 max-w-sm mx-auto">
                Our AI engine will now analyze your audio, generate a script, sync visuals, and render your video in 4K.
              </p>
              <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5 text-left text-xs space-y-2">
                <div className="flex justify-between"><span className="text-zinc-500">Estimated Duration:</span> <span className="text-zinc-200">~2 Minutes</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Quality:</span> <span className="text-zinc-200">4K Ultra HD</span></div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between bg-zinc-900/10">
          <button 
            onClick={step === 1 ? onClose : prevStep}
            disabled={isGenerating}
            className="flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            {step === 1 ? 'Cancel' : <><ChevronLeft size={16} /> Back</>}
          </button>
          
          <button 
            onClick={step === totalSteps ? handleGenerateVideo : nextStep}
            disabled={isGenerating || (step === 1 && !voiceover.file)}
            className="bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-500 px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all active:scale-95"
          >
            {isGenerating ? (
              <><Loader2 size={16} className="animate-spin" /> Starting AI...</>
            ) : (
              step === totalSteps ? (
                'Generate Video'
              ) : (
                <>Next <ChevronRight size={16} /></>
              )
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* AI Progress Item */
function RenderProgressItem({ name, status, progress, isProcessing }) {
  return (
    <div className="group relative">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-zinc-200 truncate pr-4">{name}</h4>
        {isProcessing ? (
          <Loader2 size={12} className="text-purple-500 animate-spin" />
        ) : (
          <CheckCircle2 size={12} className="text-green-500" />
        )}
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] text-zinc-500 truncate leading-none">{status}</p>
        <p className="text-[10px] font-mono text-zinc-400 leading-none">{progress}%</p>
      </div>

      <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className={`h-full ${progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-purple-600 to-pink-500'}`}
        />
      </div>
    </div>
  );
}