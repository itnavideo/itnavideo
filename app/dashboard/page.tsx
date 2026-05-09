'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthContext';
import { 
  Plus, 
  Coins, 
  Video, 
  History, 
  Zap, 
  ArrowUpRight,
  LayoutDashboard,
  BarChart3,
  Upload,
  FolderOpen,
  Clock3,
  Sparkles,
  X,
  Music,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="h-screen bg-black text-white flex overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex w-72 border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl p-6 flex-col flex-shrink-0">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight">
            Itna<span className="text-purple-500">video</span>
          </h1>
          <p className="text-zinc-500 mt-1 text-xs uppercase tracking-widest font-medium">
            AI Video Operating System
          </p>
        </div>

        <nav className="space-y-3">
          <SidebarItem icon={<BarChart3 size={20} />} label="Dashboard" active />
          <SidebarItem icon={<Upload size={20} />} label="Upload" />
          <SidebarItem icon={<Video size={20} />} label="My Videos" />
          <SidebarItem icon={<FolderOpen size={20} />} label="Projects" />
          <SidebarItem icon={<Clock3 size={20} />} label="History" />
          <SidebarItem icon={<Sparkles size={20} />} label="AI Tools" />
        </nav>

        <div className="mt-auto">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-5">
            <h3 className="font-semibold mb-2">Upgrade To Pro 🚀</h3>
            <p className="text-sm text-white/80 mb-4">
              Unlock 4K exports and premium AI features.
            </p>
            <button className="bg-white text-black px-4 py-2 rounded-xl font-semibold w-full hover:bg-zinc-200 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-6 md:p-10 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-4xl font-black tracking-tight">
              Welcome Back, {user.email?.split('@')[0]} 👋
            </h2>
            <p className="text-zinc-500 mt-2 text-lg font-medium">
              Ready to turn your voice into <span className="text-zinc-200">cinematic magic?</span>
            </p>
          </motion.div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-500 px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20"
          >
            <Plus size={22} /> Create Video
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<Coins size={24} className="text-purple-400" />} title="Remaining Credits" value="12" delay={0.1} />
          <StatCard icon={<Video size={24} className="text-blue-400" />} title="Total Videos" value="48" delay={0.2} />
          <StatCard icon={<Zap size={24} className="text-yellow-400" />} title="Processing Speed" value="Ultra" delay={0.3} />
          <StatCard icon={<Sparkles size={24} className="text-pink-400" />} title="Plan" value="Pro" delay={0.4} />
        </div>

        {/* Recent Activity Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[32px] p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <History size={24} className="text-zinc-500" />
              Recent Projects
            </h2>
            <button className="text-sm text-zinc-400 hover:text-white flex items-center gap-1 transition-colors group">
              View All <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4">
              <Video size={28} className="text-zinc-600" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No videos yet</h3>
            <p className="text-zinc-500 text-sm max-w-[200px] mb-6">
              Upload a voice recording to get started.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-purple-400 border border-purple-500/30 px-5 py-2.5 rounded-xl hover:bg-purple-500/10 transition-all font-medium text-sm"
            >
              Start Creating
            </button>
          </div>
        </div>
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
            <RenderProgressItem name="Instagram Reel #42" status="Syncing B-Roll Assets" progress={82} isProcessing />
            <RenderProgressItem name="Tech Review Short" status="Generating AI Captions" progress={45} isProcessing />
          </div>

          <div className="space-y-4 pt-6 border-t border-white/5">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Recently Finished</p>
            <RenderProgressItem name="Podcast Highlights" status="Ready to download" progress={100} />
          </div>
        </div>
      </aside>

      <AnimatePresence>
        {isModalOpen && <CreateVideoModal onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </main>
  );
}

/* Helper Components */

function SidebarItem({ icon, label, active = false }: { icon: ReactNode, label: string, active?: boolean }) {
  return (
    <button
      className={`flex items-center gap-4 w-full px-4 py-3 rounded-2xl transition ${
        active
          ? "bg-purple-600 text-white"
          : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  delay: number;
}

function StatCard({ icon, title, value, delay }: StatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors backdrop-blur-sm"
    >
      <div className="p-2 bg-zinc-800/50 rounded-xl w-fit mb-4">{icon}</div>
      <p className="text-zinc-500 text-sm mb-1 font-medium">{title}</p>
      <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
    </motion.div>
  );
}

function RenderProgressItem({ name, status, progress, isProcessing }: { name: string, status: string, progress: number, isProcessing?: boolean }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-zinc-200 truncate">{name}</h4>
        {isProcessing ? <Loader2 size={12} className="text-purple-500 animate-spin" /> : <CheckCircle2 size={12} className="text-green-500" />}
      </div>
      <div className="flex justify-between text-[10px] text-zinc-500">
        <span>{status}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className={`h-full ${progress === 100 ? 'bg-green-500' : 'bg-purple-500'}`}
        />
      </div>
    </div>
  );
}

function CreateVideoModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [voiceover, setVoiceover] = useState<{ file: File | null, preview: string | null }>({ file: null, preview: null });
  const [visual, setVisual] = useState<{ file: File | null, preview: string | null }>({ file: null, preview: null });
  const [isGenerating, setIsGenerating] = useState(false);
  const [config, setConfig] = useState({
    aspectRatio: 'Portrait (9:16) - Reels/TikTok',
    mood: 'Cinematic & Epic',
    captionStyle: 'Modern'
  });

  // Memory cleanup for object URLs
  useEffect(() => {
    return () => {
      if (voiceover.preview) URL.revokeObjectURL(voiceover.preview);
      if (visual.preview) URL.revokeObjectURL(visual.preview);
    };
  }, [voiceover.preview, visual.preview]);

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (voiceover.preview) URL.revokeObjectURL(voiceover.preview);
    if (file) {
      setVoiceover({ file, preview: URL.createObjectURL(file) });
    }
  };

  const handleVisualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (visual.preview) URL.revokeObjectURL(visual.preview);
    if (file) {
      setVisual({ file, preview: URL.createObjectURL(file) });
    }
  };

  const handleGenerateVideo = async () => {
    if (!voiceover.file) return;
    setIsGenerating(true);
    try {
      const voiceRef = ref(storage, `uploads/${Date.now()}_${voiceover.file.name}`);
      await uploadBytes(voiceRef, voiceover.file);
      const voiceUrl = await getDownloadURL(voiceRef);
      
      // API call to backend would go here
      console.log("Generating with:", { voiceUrl, config });
      
      setTimeout(() => {
        setIsGenerating(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error(error);
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95 }} animate={{ scale: 1 }}
        className="bg-zinc-950 border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/30">
          <div>
            <h3 className="text-xl font-bold">Create New Video</h3>
            <p className="text-xs text-zinc-500">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 min-h-[350px]">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 flex justify-between">
                  Upload Voiceover
                  {voiceover.file && <span className="text-purple-400 text-xs">Selected</span>}
                </label>
                <label className="block border-2 border-dashed border-zinc-800 rounded-2xl p-6 text-center hover:border-purple-500/50 transition-colors cursor-pointer group relative">
                  {voiceover.file ? (
                    <div className="flex flex-col items-center gap-3">
                      <Music className="text-purple-500" size={24} />
                      <p className="text-sm font-medium truncate max-w-xs">{voiceover.file.name}</p>
                      <button onClick={(e) => { e.preventDefault(); setVoiceover({ file: null, preview: null }); }} className="text-red-400 text-xs flex items-center gap-1">
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={24} className="mx-auto text-zinc-500 group-hover:text-purple-400 mb-2 transition-colors" />
                      <p className="text-sm text-zinc-400">Click to select MP3 or WAV</p>
                      <input type="file" accept="audio/*" className="hidden" onChange={handleAudioChange} />
                    </>
                  )}
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Visual Assets (Optional)</label>
                <label className="block">
                  <div className="bg-zinc-900/50 p-6 rounded-2xl text-center border border-white/5 hover:bg-zinc-800 transition-all cursor-pointer relative min-h-[100px] flex flex-col items-center justify-center overflow-hidden">
                    {visual.preview ? (
                      <>
                        {visual.file?.type.startsWith('image/') ? (
                          <img src={visual.preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                        ) : (
                          <Video size={24} className="absolute inset-0 m-auto text-white/20" />
                        )}
                        <div className="relative z-10 flex flex-col items-center">
                          <p className="text-xs font-bold bg-black/60 px-3 py-1 rounded-full">{visual.file?.name}</p>
                          <button onClick={(e) => { e.preventDefault(); setVisual({ file: null, preview: null }); }} className="mt-2 p-1.5 bg-zinc-900/80 rounded-lg hover:text-red-400">
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
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Aspect Ratio</label>
                  <select 
                    value={config.aspectRatio}
                    onChange={(e) => setConfig({...config, aspectRatio: e.target.value})}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm"
                  >
                    <option>Portrait (9:16)</option>
                    <option>Landscape (16:9)</option>
                    <option>Square (1:1)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">AI Mood</label>
                  <select 
                    value={config.mood}
                    onChange={(e) => setConfig({...config, mood: e.target.value})}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm"
                  >
                    <option>Cinematic & Epic</option>
                    <option>High Energy</option>
                    <option>Minimalist</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-300">Caption Style</label>
                <div className="flex gap-3">
                  {['Modern', 'Minimal', 'Hormozi'].map((style) => (
                    <button 
                      key={style}
                      onClick={() => setConfig({...config, captionStyle: style})}
                      className={`flex-1 py-3 rounded-xl text-xs font-medium border ${config.captionStyle === style ? 'bg-purple-600 border-purple-500' : 'bg-zinc-900 border-white/5 text-zinc-400'}`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto border border-purple-500/30">
                <Sparkles className="text-purple-400" size={32} />
              </div>
              <h4 className="text-2xl font-bold">Ready for the magic?</h4>
              <p className="text-zinc-400 max-w-sm mx-auto">
                Our AI will analyze your audio and generate scenes, captions, and transitions in 4K.
              </p>
            </div>
          )}
        </div>

        <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between bg-zinc-900/10">
          <button 
            onClick={step === 1 ? onClose : () => setStep(step - 1)}
            className="text-sm font-semibold text-zinc-400 hover:text-white"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          
          <button 
            disabled={isGenerating || (step === 1 && !voiceover.file)}
            onClick={step === 3 ? handleGenerateVideo : () => setStep(step + 1)}
            className="bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-500 px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2"
          >
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : step === 3 ? 'Generate' : 'Next'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}