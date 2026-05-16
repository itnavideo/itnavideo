"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  AudioLines,
  BadgeCheck,
  Captions,
  CheckCircle2,
  ChevronRight,
  Clapperboard,
  Coffee,
  Download,
  Film,
  Gauge,
  LayoutDashboard,
  Loader2,
  LogOut,
  Music,
  Plus,
  Scissors,
  Sparkles,
  Trash2,
  Upload,
  Wand2,
  Waves,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthContext';
import BrandLogo from '@/components/brand/BrandLogo';
import VideoUploadStatus from '@/components/dashboard/VideoUploadStatus';
import { getMaxUploadBytes, getPipelineQualityLabel, videoPipelineConfig } from '@/lib/videoPipelineConfig';

type Job = {
  id: string;
  ownerId?: string;
  title: string;
  status: string;
  progress: number;
  style?: string;
  timelineScenes?: number;
  captions?: number;
  quality?: string;
  voiceUrl?: string;
  visualUrl?: string;
  durationSeconds?: number;
  renderUrl?: string;
  videoUrl?: string;
  renderProvider?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  keepLocal?: boolean;
};

type GenerationEta = {
  uploadSeconds: number;
  planningSeconds: number;
  renderSeconds: number;
  totalSeconds: number;
};

type GenerationStatus = 'idle' | 'reading' | 'uploading' | 'planning' | 'rendering' | 'ready' | 'error';

type PreviewOption = {
  value: string;
  title: string;
  hint: string;
  description: string;
  preview: 'reels' | 'fast' | 'cinematic' | 'luxury' | 'meme' | 'documentary' | 'caption-reels' | 'caption-hormozi' | 'caption-iman' | 'caption-cinematic';
};

const PIPELINE_QUALITY = getPipelineQualityLabel();
const FREE_MAX_UPLOAD_BYTES = getMaxUploadBytes();
const FREE_MAX_DURATION_SECONDS = videoPipelineConfig.maxDurationSec;
const DEFAULT_TARGET_DURATION_SECONDS = FREE_MAX_DURATION_SECONDS;

const pipelineCards = [
  { title: 'Upload audio', desc: 'Add one clear voiceover file.', icon: AudioLines, tone: 'text-emerald-200' },
  { title: 'AI timeline', desc: 'Scenes, captions, and pacing are planned automatically.', icon: Clapperboard, tone: 'text-cyan-200' },
  { title: `${PIPELINE_QUALITY} render`, desc: 'FFmpeg exports a stable portrait MP4 for Reels and Shorts.', icon: Film, tone: 'text-violet-200' },
  { title: 'Video ready', desc: 'Open or download the finished video from your library.', icon: Download, tone: 'text-amber-200' },
];

const editingStyleOptions: PreviewOption[] = [
  { value: 'reels_pacing', title: 'Reels pacing', hint: 'Fast social video', description: 'Bright cuts, kinetic movement, strong hook energy.', preview: 'reels' },
  { value: 'fast_cuts', title: 'Fast cuts', hint: 'Quick jumps + zooms', description: 'More speed, punchy transitions, high retention feel.', preview: 'fast' },
  { value: 'slow_cinematic', title: 'Slow cinematic', hint: 'Calm movie look', description: 'Moody colors, slower camera motion, emotional pacing.', preview: 'cinematic' },
  { value: 'luxury_edit', title: 'Luxury edit', hint: 'Premium dark/gold', description: 'Minimal movement, premium tones, clean visual rhythm.', preview: 'luxury' },
  { value: 'meme_style', title: 'Meme style', hint: 'Bold reaction edit', description: 'Louder framing, reaction energy, punchline timing.', preview: 'meme' },
  { value: 'youtube_documentary', title: 'Documentary', hint: 'Story + b-roll', description: 'Narrative pacing, b-roll moments, calmer transitions.', preview: 'documentary' },
];

const captionStyleOptions: PreviewOption[] = [
  { value: 'Reels', title: 'Reels', hint: 'Big karaoke words', description: 'Large mobile-first captions with energetic emphasis.', preview: 'caption-reels' },
  { value: 'Alex Hormozi', title: 'Alex Hormozi', hint: 'Bold boxed captions', description: 'High contrast blocks for punchy talking-head shorts.', preview: 'caption-hormozi' },
  { value: 'Iman Gadzhi', title: 'Iman Gadzhi', hint: 'Clean keyword pop', description: 'Clean subtitles with selective highlighted words.', preview: 'caption-iman' },
  { value: 'Cinematic', title: 'Cinematic', hint: 'Subtle center text', description: 'Soft subtitle treatment for slower emotional videos.', preview: 'caption-cinematic' },
];

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialCreationMode, setInitialCreationMode] = useState<'voice' | 'face'>('voice');
  const [deleteCandidate, setDeleteCandidate] = useState<Job | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const videoListRef = useRef<HTMLDivElement | null>(null);
  const previousJobStatusesRef = useRef<Record<string, string>>({});
  const jobsRef = useRef<Job[]>([]);

  useEffect(() => {
    setMounted(true);
    if (!loading && !user) router.push('/login');
  }, [loading, router, user]);

  useEffect(() => {
    jobsRef.current = jobs;
  }, [jobs]);

  useEffect(() => {
    if (!user) {
      setJobs([]);
      setProjectsLoading(false);
      return;
    }

    const localJobs = loadLocalJobs(user.uid);
    setJobs(localJobs);
    setProjectsLoading(true);

    let cancelled = false;
    const syncProjects = async () => {
      try {
        const savedJobs = await fetchUserProjects(user.uid);
        if (cancelled) return;
        const mergedJobs = filterDeletedJobs(user.uid, mergeJobs(savedJobs, loadLocalJobs(user.uid), jobsRef.current));
        setJobs(mergedJobs);
        saveLocalJobs(user.uid, mergedJobs);
        setProjectsLoading(false);
      } catch (error) {
        if (cancelled) return;
        console.error('Project sync failed:', error);
        setJobs((items) => saveAndReturnJobs(user.uid, filterDeletedJobs(user.uid, mergeJobs(items, loadLocalJobs(user.uid), jobsRef.current))));
        setProjectsLoading(false);
      }
    };

    void syncProjects();
    const interval = window.setInterval(syncProjects, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [user]);

  useEffect(() => {
    let completedNow = false;
    const nextStatuses: Record<string, string> = {};

    jobs.forEach((job) => {
      const currentStatus = String(job.status || '');
      const previousStatus = previousJobStatusesRef.current[job.id];
      nextStatuses[job.id] = currentStatus;

      if (previousStatus && !isCompletedStatus(previousStatus) && isCompletedStatus(currentStatus)) {
        completedNow = true;
      }
    });

    previousJobStatusesRef.current = nextStatuses;

    if (completedNow) {
      window.setTimeout(() => {
        videoListRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 250);
    }
  }, [jobs]);

  const displayName = useMemo(() => user?.displayName || user?.email?.split('@')[0] || 'Creator', [user]);

  const openCreateModal = (mode: 'voice' | 'face' = 'voice') => {
    setInitialCreationMode(mode);
    setIsModalOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleProjectCreate = (job: Job) => {
    if (!user) return;
    rememberActiveJob(user.uid, job.id);
    setJobs((items) => saveAndReturnJobs(user.uid, upsertJobAtTop(items, markStickyJob(job))));
    persistProject(user.uid, job).catch((error) => console.error('Project create sync failed:', error));
  };

  const handleProjectUpdate = (jobId: string, patch: Partial<Job>) => {
    if (!user) return;
    const updatedAt = new Date().toISOString();
    rememberActiveJob(user.uid, jobId);
    setJobs((items) => saveAndReturnJobs(user.uid, updateJobById(items, jobId, { ...patch, updatedAt, keepLocal: true })));
    persistProjectPatch(user.uid, jobId, { ...patch, updatedAt }).catch((error) => console.error('Project update sync failed:', error));
  };

  const requestProjectDelete = (job: Job) => {
    if (!job?.id) return;
    setDeleteCandidate(job);
  };

  const confirmProjectDelete = async () => {
    if (!user || !deleteCandidate?.id) return;
    const job = deleteCandidate;
    setDeleteBusy(true);
    try {
      await deleteProject(user.uid, job.id);
      rememberDeletedJob(user.uid, job.id);
      setJobs((items) => saveAndReturnJobs(user.uid, items.filter((item) => item.id !== job.id)));
      forgetActiveJob(user.uid, job.id);
      removeLocalJob(user.uid, job.id);
      setDeleteCandidate(null);
      toast.success('Video removed from your library.');
    } catch (error) {
      console.error('Project delete failed:', error);
      toast.error('Could not delete this video. Please retry.');
    } finally {
      setDeleteBusy(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 animate-spin text-emerald-300" size={34} />
          <p className="text-sm font-semibold text-zinc-500">Loading your studio...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#050506] text-white">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.18),transparent_32%)]" />
      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-black/35 p-6 backdrop-blur-xl lg:flex lg:flex-col">
          <div className="mb-10">
            <BrandLogo size="md" showTagline />
          </div>

          <nav className="space-y-2">
            <SidebarItem active icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <SidebarItem icon={<Upload size={18} />} label="Create" onClick={() => openCreateModal('voice')} />
            <SidebarItem icon={<Film size={18} />} label="Projects" />
          </nav>

          <div className="mt-auto rounded-lg border border-emerald-300/15 bg-emerald-300/8 p-5">
            <BadgeCheck className="mb-4 text-emerald-200" size={24} />
            <h3 className="font-bold">MVP Pipeline Active</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">One focused workflow: audio to stable {PIPELINE_QUALITY} video.</p>
          </div>

          <button onClick={handleLogout} className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm font-bold text-zinc-400 transition hover:bg-white/5 hover:text-white">
            <LogOut size={16} />
            Logout
          </button>
        </aside>

        <section className="flex-1 overflow-hidden">
          <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 lg:px-10">
            <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-emerald-300">Dashboard</p>
                <h1 className="text-4xl font-black leading-tight tracking-normal md:text-5xl">Welcome back, {displayName}</h1>
                <p className="mt-3 max-w-2xl text-zinc-400">Choose faceless voiceover videos or upload face camera footage for automatic Shorts editing.</p>
              </div>
              <button onClick={() => openCreateModal('voice')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-4 font-black text-black transition hover:bg-zinc-200">
                <Plus size={19} />
                Create video
              </button>
            </header>

            <div className="grid gap-4 md:grid-cols-4">
              <Metric title="Credits" value="12" icon={<Gauge size={19} />} />
              <Metric title="Saved videos" value={projectsLoading ? '...' : String(jobs.length)} icon={<Film size={19} />} />
              <Metric title="Exports" value={`${PIPELINE_QUALITY} Shorts`} icon={<Download size={19} />} />
              <Metric title="Pipeline" value="Ready" icon={<CheckCircle2 size={19} />} />
            </div>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
              <div ref={videoListRef} className="rounded-lg border border-white/10 bg-zinc-950/80 p-6 scroll-mt-8">
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-black">Create with Itnavideo</h2>
                    <p className="mt-1 text-sm text-zinc-500">Two production flows: faceless videos or face camera edits.</p>
                  </div>
                  <button onClick={() => openCreateModal('voice')} className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-bold text-emerald-100 transition hover:bg-emerald-300/15">
                    Start creating
                  </button>
                </div>

                <div className="mb-5 grid gap-4 md:grid-cols-2">
                  <DashboardModeCard
                    imageSrc="/visuals/faceless-mode-guide.png"
                    icon={<AudioLines size={22} />}
                    title="Faceless video"
                    body="Audio is required. Screenshots, images, or clips are optional."
                    tone="emerald"
                    onClick={() => openCreateModal('voice')}
                  />
                  <DashboardModeCard
                    imageSrc="/visuals/face-camera-mode-guide.png"
                    icon={<Film size={22} />}
                    title="Face camera video"
                    body="Upload one camera video. We crop, polish audio, add effects, and export."
                    tone="cyan"
                    onClick={() => openCreateModal('face')}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {pipelineCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                      <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="rounded-lg border border-white/10 bg-white/[0.035] p-5"
                      >
                        <Icon className={card.tone} size={24} />
                        <h3 className="mt-5 font-bold">{card.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-zinc-500">{card.desc}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-zinc-950/80 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-black">Your videos</h2>
                  <Activity className="text-zinc-600" size={20} />
                </div>

                {jobs.length ? (
                  <div className="space-y-3">
                    {jobs.map((job) => {
                      const videoUrl = getJobVideoUrl(job);
                      return (
                      <div key={job.id} className="rounded-lg border border-white/10 bg-black/35 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold">{job.title}</p>
                            <p className="mt-1 text-xs text-zinc-500">{job.style || 'AI directed'} • {job.quality}</p>
                          </div>
                          <span className="rounded-md bg-emerald-300/10 px-2 py-1 text-xs font-bold text-emerald-200">{job.status}</span>
                        </div>
                        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/8">
                          <div className="h-full rounded-full bg-emerald-300" style={{ width: `${job.progress}%` }} />
                        </div>
                        <p className="mt-3 text-xs text-zinc-500">{job.timelineScenes || 0} scenes • {job.captions || 0} captions • {job.durationSeconds ? formatDuration(job.durationSeconds) : 'reels timeline'}</p>
                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            onClick={() => openJobVideo(job)}
                            disabled={!videoUrl}
                            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-black transition ${
                              videoUrl
                                ? 'bg-white text-black hover:bg-zinc-200'
                                : 'cursor-not-allowed bg-white/10 text-zinc-500'
                            }`}
                          >
                            <Download size={15} />
                            {videoUrl ? 'Play video' : 'Waiting'}
                          </button>
                          <button
                            type="button"
                            onClick={() => downloadJobVideo(job)}
                            disabled={!videoUrl}
                            className={`inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white transition hover:bg-white/10 ${
                              videoUrl ? '' : 'cursor-not-allowed opacity-45'
                            }`}
                            title="Save or download video"
                          >
                            <Download size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => requestProjectDelete(job)}
                            className="inline-flex items-center justify-center gap-2 rounded-md border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-200 transition hover:bg-red-500/20"
                            title="Delete video"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                    })}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-white/10 bg-black/25 p-5 text-center">
                    <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950">
                      <div className="relative aspect-[4/3] w-full">
                        <img
                          src="/visuals/dashboard-empty-state.png"
                          alt="Empty Itnavideo dashboard ready for a new video"
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                      </div>
                    </div>
                    <Wand2 className="mx-auto mt-6 text-emerald-200" size={34} />
                    <h3 className="mt-4 font-bold">No videos yet</h3>
                    <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-zinc-500">Start with a voiceover or face camera video. The dashboard will show render status here.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <CreateVideoModal
            user={user}
            onClose={() => setIsModalOpen(false)}
            onCreated={handleProjectCreate}
            onJobUpdate={handleProjectUpdate}
            initialMode={initialCreationMode}
          />
        )}
        {deleteCandidate && (
          <DeleteProjectModal
            job={deleteCandidate}
            busy={deleteBusy}
            onCancel={() => {
              if (!deleteBusy) setDeleteCandidate(null);
            }}
            onConfirm={confirmProjectDelete}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition ${active ? 'bg-white text-black' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}>
      {icon}
      {label}
    </button>
  );
}

function Metric({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-950/70 p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-white/8 text-emerald-200">{icon}</div>
      <p className="text-sm font-semibold text-zinc-500">{title}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}

function DashboardModeCard({
  imageSrc,
  icon,
  title,
  body,
  tone,
  onClick,
}: {
  imageSrc: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  tone: 'emerald' | 'cyan';
  onClick: () => void;
}) {
  const toneClasses = tone === 'emerald'
    ? 'border-emerald-300/20 bg-emerald-300/8 hover:bg-emerald-300/12 text-emerald-200'
    : 'border-cyan-300/20 bg-cyan-300/8 hover:bg-cyan-300/12 text-cyan-200';

  return (
    <button onClick={onClick} className={`overflow-hidden rounded-lg border text-left transition ${toneClasses}`}>
      <img src={imageSrc} alt="" className="aspect-[5/3] w-full bg-black/30 object-cover" />
      <div className="p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-black/30">{icon}</div>
        <h3 className="mt-4 font-black text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-500">{body}</p>
      </div>
    </button>
  );
}

function DeleteProjectModal({
  job,
  busy,
  onCancel,
  onConfirm,
}: {
  job: Job;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[240] flex items-center justify-center bg-black/80 p-4 backdrop-blur"
    >
      <motion.div
        initial={{ y: 16, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 16, scale: 0.98 }}
        className="w-full max-w-md overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-2xl"
      >
        <div className="border-b border-white/10 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-red-400/20 bg-red-500/10 text-red-200">
              <Trash2 size={20} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-red-200">Remove video</p>
              <h3 className="mt-2 text-2xl font-black tracking-normal text-white">Delete this video?</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                <span className="font-semibold text-zinc-200">{job.title || 'Untitled Project'}</span> will be removed from your Itnavideo library.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-zinc-400">
            This only cleans up the video from your dashboard. Any file already saved on your device will stay there.
          </div>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="rounded-lg border border-white/10 px-5 py-3 text-sm font-black text-zinc-300 transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Keep video
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-5 py-3 text-sm font-black text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
              Delete video
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CreateVideoModal({
  onClose,
  onCreated,
  onJobUpdate,
  user,
  initialMode,
}: {
  onClose: () => void;
  onCreated: (job: Job) => void;
  onJobUpdate: (jobId: string, patch: Partial<Job>) => void;
  user: any;
  initialMode: 'voice' | 'face';
}) {
  const [step, setStep] = useState(1);
  const [creationMode, setCreationMode] = useState<'voice' | 'face'>(initialMode);
  const [voiceover, setVoiceover] = useState<File | null>(null);
  const [visual, setVisual] = useState<File | null>(null);
  const [faceVideo, setFaceVideo] = useState<File | null>(null);
  const [faceStyle, setFaceStyle] = useState<'classic' | 'cinematic' | 'clean'>('classic');
  const [renderJobId, setRenderJobId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>('idle');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [estimatedSeconds, setEstimatedSeconds] = useState(30);
  const [remainingSeconds, setRemainingSeconds] = useState(30);
  const [targetDurationSeconds, setTargetDurationSeconds] = useState(DEFAULT_TARGET_DURATION_SECONDS);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [etaBreakdown, setEtaBreakdown] = useState<GenerationEta | null>(null);
  const [config, setConfig] = useState({
    aspectRatio: 'Portrait (9:16)',
    editingStyle: 'reels_pacing',
    captionStyle: 'Reels',
    quality: PIPELINE_QUALITY,
  });

  useEffect(() => {
    if (!isGenerating || generationStatus === 'ready' || generationStatus === 'error') return;

    const timer = window.setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [generationStatus, isGenerating]);

  const handleGenerateVideo = async () => {
    if (!voiceover || !user) return;
    setIsGenerating(true);
    setGenerationStatus('reading');
    setGenerationProgress(8);
    const jobId = Math.random().toString(36).substring(2, 9);
    setRenderJobId(jobId);
    const audioDurationSeconds = await getAudioDuration(voiceover).catch(() => undefined);
    const preflightError = getUploadPreflightError(voiceover, audioDurationSeconds);
    if (preflightError) {
      setGenerationStatus('error');
      setGenerationProgress(0);
      setIsGenerating(false);
      toast.error(preflightError);
      return;
    }
    const videoDurationSeconds = getTargetVideoDuration(audioDurationSeconds, config);
    const eta = getGenerationEta({ fileSizeBytes: voiceover.size, targetDurationSeconds: videoDurationSeconds });
    const title = voiceover.name.replace(/\.[^.]+$/, '') || `Project ${jobId.toUpperCase()}`;

    setTargetDurationSeconds(videoDurationSeconds);
    setEstimatedSeconds(eta.totalSeconds);
    setRemainingSeconds(eta.totalSeconds);
    setEtaBreakdown(eta);
    setUploadPercent(0);
    setGenerationStatus('uploading');
    setGenerationProgress(18);

    onCreated({
      id: jobId,
      title,
      status: 'Uploading',
      progress: 10,
      style: config.editingStyle,
      timelineScenes: 0,
      captions: 0,
      quality: config.quality,
      durationSeconds: videoDurationSeconds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    toast.success('Video process started. Keep this window open.');

    try {
      const voicePath = `uploads/${user.uid}/${Date.now()}_${sanitizeFileName(voiceover.name)}`;
      const voiceUrl = await uploadMediaFile(voicePath, voiceover, (percent) => {
        setUploadPercent(percent);
        setGenerationProgress(Math.min(46, 18 + Math.round(percent * 0.28)));
      });
      const userAssets = [];

      if (visual) {
        onJobUpdate(jobId, { status: 'Uploading visual', progress: 46, voiceUrl });
        const visualPath = `uploads/${user.uid}/visuals/${Date.now()}_${sanitizeFileName(visual.name)}`;
        const visualUrl = await uploadMediaFile(visualPath, visual, (percent) => {
          setUploadPercent(percent);
          setGenerationProgress(Math.min(54, 46 + Math.round(percent * 0.08)));
        });
        userAssets.push({
          url: visualUrl,
          type: visual.type.startsWith('video/') ? 'video' as const : 'image' as const,
          filename: visual.name,
        });
        onJobUpdate(jobId, { status: 'Uploaded', progress: 54, voiceUrl, visualUrl });
      } else {
        onJobUpdate(jobId, { status: 'Uploaded', progress: 48, voiceUrl });
      }
      setGenerationProgress(userAssets.length ? 54 : 48);

      setGenerationStatus('planning');
      setGenerationProgress(62);
      onJobUpdate(jobId, { status: 'Queued for AI planning', progress: 62 });

      await startBackendVideoJob({
        jobId,
        userId: user.uid,
        voiceoverUrl: voiceUrl,
        title,
        config: { ...config, creationMode: 'faceless' },
        userAssets,
        runPipeline: true,
        targetDurationSeconds: videoDurationSeconds,
      });

      onJobUpdate(jobId, { status: 'Worker is preparing video', progress: 64, voiceUrl, visualUrl: userAssets[0]?.url });
      toast.success('Video queued on the render worker. Check Your videos for progress.');
      onClose();
    } catch (error: any) {
      const rawMessage = error.message || 'Generation failed.';
      const message = getCreatorFacingGenerationError(error);
      const normalizedError = `${error?.code || ''} ${rawMessage}`.toLowerCase();
      const timedOut = rawMessage.toLowerCase().includes('timed out') || error.name === 'AbortError';
      const finalSaveFailed = normalizedError.includes('storage/retry-limit-exceeded') || normalizedError.includes('final save') || normalizedError.includes('render upload');
      onJobUpdate(jobId, {
        status: timedOut || finalSaveFailed ? 'Final save needs retry' : 'Needs retry',
        progress: timedOut || finalSaveFailed ? 76 : 18,
      });
      setGenerationStatus('error');
      setGenerationProgress(timedOut || finalSaveFailed ? 76 : 18);
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateFaceVideo = async () => {
    if (!faceVideo || !user) return;

    const jobId = `face_${Date.now()}`;
    setRenderJobId(jobId);
    setIsGenerating(true);
    setGenerationStatus('rendering');
    setGenerationProgress(12);
    setEstimatedSeconds(90);
    setRemainingSeconds(90);
    setTargetDurationSeconds(DEFAULT_TARGET_DURATION_SECONDS);
    setEtaBreakdown(null);

    onCreated({
      id: jobId,
      title: faceVideo.name.replace(/\.[^.]+$/, ''),
      status: 'Processing face video',
      progress: 12,
      style: `face_${faceStyle}`,
      timelineScenes: 1,
      captions: 0,
      quality: PIPELINE_QUALITY,
      durationSeconds: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    toast.success('Face video processing started. Keep this window open.');

    try {
      const preflightError = getUploadPreflightError(faceVideo);
      if (preflightError) throw new Error(preflightError);

      // 1. Secure Upload to Cloudinary (Handles large files better)
      setGenerationStatus('uploading');
      const videoPath = `uploads/${user.uid}/face/${Date.now()}_${sanitizeFileName(faceVideo.name)}`;
      const faceVideoUrl = await uploadMediaFile(videoPath, faceVideo, (percent) => {
        setUploadPercent(percent);
        setGenerationProgress(Math.min(50, 12 + Math.round(percent * 0.38)));
      });

      onJobUpdate(jobId, { 
        status: 'Uploaded', 
        progress: 50, 
        visualUrl: faceVideoUrl 
      });

      // 2. Trigger Background Job (Returns immediately, preventing timeout)
      setGenerationStatus('rendering');
      await startBackendVideoJob({
        jobId,
        userId: user.uid,
        voiceoverUrl: faceVideoUrl, // Face video acts as its own voiceover source
        title: faceVideo.name.replace(/\.[^.]+$/, ''),
        config: { 
          ...config, 
          creationMode: 'face', 
          faceStyle,
          aspectRatio: config.aspectRatio // Ensure selected aspect ratio is passed
        },
        runPipeline: true,
        targetDurationSeconds: DEFAULT_TARGET_DURATION_SECONDS,
      });

      onJobUpdate(jobId, {
        status: 'Worker is processing face video',
        progress: 60,
        visualUrl: faceVideoUrl,
        renderProvider: 'local-ffmpeg',
      });

      toast.success('Video queued. You can track progress in "Your videos".');
      onClose();
    } catch (error: any) {
      const message = getCreatorFacingGenerationError(error, 'Face video processing failed.');
      onJobUpdate(jobId, {
        status: 'Needs retry',
        progress: 12,
      });
      setGenerationStatus('error');
      setGenerationProgress(12);
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur">
      <motion.div initial={{ y: 18, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 18, scale: 0.98 }} className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-lg border border-white/10 bg-zinc-950 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-zinc-950/95 px-6 py-5 backdrop-blur">
          <div>
            <h3 className="text-xl font-black">Create video</h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-zinc-600">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="rounded-md p-2 text-zinc-500 transition hover:bg-white/8 hover:text-white"><X size={20} /></button>
        </div>

        <div className="p-6">
          {renderJobId && (generationStatus === 'rendering' || generationStatus === 'ready' || generationStatus === 'error') && (
            <div className="rounded-lg border border-white/10 bg-white/[0.025] p-5">
              <div className="mb-4">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-200">Please wait</p>
                <h4 className="mt-2 text-2xl font-black tracking-normal text-white">Your video is being prepared</h4>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  We are adding captions, graphics, and exporting your MP4. You can keep this open or check Your videos in a moment.
                </p>
              </div>
              <VideoUploadStatus
                userId={user.uid}
                jobId={renderJobId}
                onReady={(videoUrl) => {
                  const finalUrl = normalizeRenderUrl(videoUrl);
                  onJobUpdate(renderJobId, { status: 'Video ready', progress: 100, videoUrl: finalUrl, renderUrl: videoUrl });
                  setGenerationStatus('ready');
                  setGenerationProgress(100);
                  setRemainingSeconds(0);
                  setIsGenerating(false);
                  toast.success('Video ready. Watch Video is available now.');
                }}
                onError={(message) => {
                  setGenerationStatus('error');
                  setGenerationProgress(12);
                  setIsGenerating(false);
                  toast.error(message);
                }}
              />
            </div>
          )}

          {creationMode === 'voice' && (generationStatus === 'reading' || generationStatus === 'uploading' || generationStatus === 'planning') && (
            <ProcessingPanel
              status={generationStatus}
              progress={generationProgress}
              remainingSeconds={remainingSeconds}
              estimatedSeconds={estimatedSeconds}
              targetDurationSeconds={targetDurationSeconds}
              uploadPercent={uploadPercent}
              etaBreakdown={etaBreakdown}
              voiceName={voiceover?.name || 'Voiceover'}
            />
          )}

          {generationStatus === 'idle' && step === 1 && (
            <div className="space-y-5">
              <div className="grid gap-3 md:grid-cols-2">
                <ModeCard
                  selected={creationMode === 'voice'}
                  imageSrc="/visuals/faceless-mode-guide.png"
                  icon={<AudioLines size={24} />}
                  title="Faceless video"
                  body="Audio is mandatory. Add screenshots, images, or video clips if you have them."
                  tone="emerald"
                  onClick={() => setCreationMode('voice')}
                />
                <ModeCard
                  selected={creationMode === 'face'}
                  imageSrc="/visuals/face-camera-mode-guide.png"
                  icon={<Film size={24} />}
                  title="Face camera video"
                  body="Upload one talking-head or camera video. Itnavideo edits it into a short."
                  tone="cyan"
                  onClick={() => setCreationMode('face')}
                />
              </div>

              {creationMode === 'voice' ? (
                <>
                  <FileDrop title="Voiceover" emptyCta="Select voiceover audio" desc="Required MP3, WAV, M4A" file={voiceover} accept="audio/*" required onChange={setVoiceover} icon={<AudioLines size={26} />} />
                  <FileDrop title="Visual asset" emptyCta="Select optional visual" desc="Optional MP4, MOV, JPG, PNG" file={visual} accept="video/*,image/*" onChange={setVisual} icon={<Film size={26} />} />
                </>
              ) : (
                <FileDrop title="Face camera video" emptyCta="Select camera video" desc="Required MP4, MOV, or WebM" file={faceVideo} accept="video/*" required onChange={setFaceVideo} icon={<Film size={26} />} />
              )}
            </div>
          )}

          {generationStatus === 'idle' && step === 2 && (
            creationMode === 'voice' ? (
              <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
              <div className="space-y-6">
                <PreviewChoiceGrid
                  label="Editing style"
                  value={config.editingStyle}
                  onChange={(editingStyle) => setConfig({ ...config, editingStyle })}
                  options={editingStyleOptions}
                />
                <PreviewChoiceGrid
                  label="Caption style"
                  value={config.captionStyle}
                  onChange={(captionStyle) => setConfig({ ...config, captionStyle })}
                  options={captionStyleOptions}
                />
                <div className="grid gap-5 md:grid-cols-2">
                  <Select label="Aspect ratio" value={config.aspectRatio} onChange={(aspectRatio) => setConfig({ ...config, aspectRatio })} options={[
                    ['Portrait (9:16)', 'Portrait (9:16)'],
                  ]} />
                  <Select label="Export quality" value={config.quality} onChange={(quality) => setConfig({ ...config, quality })} options={[
                    [PIPELINE_QUALITY, PIPELINE_QUALITY],
                  ]} />
                </div>
              </div>

              <div className="lg:sticky lg:top-24">
                <LiveVideoPreview
                  editingStyle={getPreviewOption(editingStyleOptions, config.editingStyle)}
                  captionStyle={getPreviewOption(captionStyleOptions, config.captionStyle)}
                  quality={config.quality}
                />
              </div>
            </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ['classic', 'Classic', 'Blurred fill, centered subject, clean Shorts polish.'],
                  ['cinematic', 'Cinematic', 'Higher contrast, subtle film tone, premium feel.'],
                  ['clean', 'Clean', 'Black canvas, sharp subject, minimal distractions.'],
                ].map(([value, title, desc]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFaceStyle(value as 'classic' | 'cinematic' | 'clean')}
                    className={`rounded-lg border p-5 text-left transition ${faceStyle === value ? 'border-cyan-300 bg-cyan-300/10' : 'border-white/10 bg-white/[0.035] hover:border-white/25'}`}
                  >
                    <Film className="text-cyan-200" size={23} />
                    <p className="mt-4 font-black">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">{desc}</p>
                  </button>
                ))}
              </div>
            )
          )}

          {generationStatus === 'idle' && step === 3 && (
            <div className={`rounded-lg border p-6 ${creationMode === 'voice' ? 'border-emerald-300/15 bg-emerald-300/8' : 'border-cyan-300/15 bg-cyan-300/8'}`}>
              <Sparkles className={creationMode === 'voice' ? 'text-emerald-200' : 'text-cyan-200'} size={30} />
              <h4 className="mt-5 text-2xl font-black">Ready to create your {creationMode === 'voice' ? 'faceless video' : 'face camera edit'}</h4>
              <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
                {creationMode === 'voice'
                  ? `We will analyze the voiceover, create the timeline, generate captions, and export a stable ${PIPELINE_QUALITY} short-form MP4.`
                  : `We will crop the camera video for Shorts, polish audio, add motion/effects, and export a stable ${PIPELINE_QUALITY} MP4.`}
              </p>
              <div className="mt-5 grid gap-3 text-sm text-zinc-300 md:grid-cols-2">
                  {creationMode === 'voice' ? (
                    <>
                    <Summary label="Voice" value={voiceover?.name || 'Required'} />
                    <Summary label="Style" value={getPreviewOption(editingStyleOptions, config.editingStyle).title} />
                    <Summary label="Captions" value={getPreviewOption(captionStyleOptions, config.captionStyle).title} />
                    <Summary label="Export" value={`${PIPELINE_QUALITY} portrait MP4`} />
                    </>
                  ) : (
                    <>
                      <Summary label="Camera video" value={faceVideo?.name || 'Required'} />
                      <Summary label="Edit style" value={faceStyle} />
                      <Summary label="Effects" value="Crop, motion, audio polish" />
                      <Summary label="Export" value={`${PIPELINE_QUALITY} portrait MP4`} />
                    </>
                  )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 px-6 py-5">
          <button disabled={isGenerating} onClick={step === 1 || generationStatus !== 'idle' ? onClose : () => setStep(step - 1)} className="font-bold text-zinc-500 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40">
            {generationStatus !== 'idle' ? 'Close' : step === 1 ? 'Cancel' : 'Back'}
          </button>
          <button
            disabled={isGenerating || generationStatus !== 'idle' || (step === 1 && ((creationMode === 'voice' && !voiceover) || (creationMode === 'face' && !faceVideo)))}
            onClick={step === 3 ? (creationMode === 'voice' ? handleGenerateVideo : handleGenerateFaceVideo) : () => setStep(step + 1)}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-black text-black transition hover:bg-zinc-200 disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={18} /> : step === 3 ? <Scissors size={18} /> : <ChevronRight size={18} />}
            {generationStatus === 'ready' ? 'Ready' : step === 3 ? (creationMode === 'voice' ? 'Generate faceless video' : 'Edit face camera video') : 'Next'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProcessingPanel({
  status,
  progress,
  remainingSeconds,
  estimatedSeconds,
  targetDurationSeconds,
  uploadPercent,
  etaBreakdown,
  voiceName,
}: {
  status: GenerationStatus;
  progress: number;
  remainingSeconds: number;
  estimatedSeconds: number;
  targetDurationSeconds: number;
  uploadPercent: number;
  etaBreakdown: GenerationEta | null;
  voiceName: string;
}) {
  const statusCopy = {
    idle: 'Preparing',
    reading: 'Reading voiceover duration',
    uploading: 'Uploading voiceover securely',
    planning: 'AI director is building your timeline',
    rendering: 'FFmpeg is rendering your MP4',
    ready: 'Video ready',
    error: 'Needs retry',
  }[status];

  return (
    <div className="overflow-hidden rounded-lg border border-emerald-300/15 bg-emerald-300/8 p-4 sm:p-6">
      <div className="flex min-w-0 flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">Generating video</p>
          <h4 className="mt-3 break-words text-2xl font-black sm:text-3xl">{statusCopy}</h4>
          <p className="mt-3 max-w-xl break-words text-sm leading-6 text-zinc-400">
            Estimated complete MP4 time: {formatDuration(estimatedSeconds)}. Reels output is capped at {formatDuration(targetDurationSeconds)}.
          </p>
        </div>
        <div className="w-full rounded-lg border border-white/10 bg-black/30 p-4 text-center md:w-auto md:min-w-44">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">ETA left</p>
          <p className="mt-2 text-5xl font-black text-white">{remainingSeconds}s</p>
          <p className="mt-1 text-xs text-zinc-500">total about {formatDuration(estimatedSeconds)}</p>
        </div>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-black/40">
        <div className="h-full rounded-full bg-emerald-300 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <ProcessStep active={status === 'reading' || status === 'uploading' || status === 'planning' || status === 'rendering' || status === 'ready'} done={status === 'uploading' || status === 'planning' || status === 'rendering' || status === 'ready'} label="Voice scan" />
        <ProcessStep active={status === 'uploading' || status === 'planning' || status === 'rendering' || status === 'ready'} done={status === 'planning' || status === 'rendering' || status === 'ready'} label={status === 'uploading' ? `Upload ${uploadPercent}%` : 'Secure upload'} />
        <ProcessStep active={status === 'planning' || status === 'rendering' || status === 'ready'} done={status === 'rendering' || status === 'ready'} label={status === 'rendering' ? 'Rendering MP4' : 'Timeline + render'} />
      </div>

      {etaBreakdown && (
        <div className="mt-5 grid gap-2 text-xs text-zinc-400 sm:grid-cols-3">
          <div className="rounded-md border border-white/10 bg-black/20 p-3">Upload: {formatDuration(etaBreakdown.uploadSeconds)}</div>
          <div className="rounded-md border border-white/10 bg-black/20 p-3">AI plan: {formatDuration(etaBreakdown.planningSeconds)}</div>
          <div className="rounded-md border border-white/10 bg-black/20 p-3">FFmpeg render: {formatDuration(etaBreakdown.renderSeconds)}</div>
        </div>
      )}

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="min-w-0 rounded-md border border-white/10 bg-black/25 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-600">Voiceover</p>
          <p className="mt-1 max-w-full break-all text-sm font-semibold text-zinc-200">{voiceName}</p>
        </div>
        <div className="min-w-0 rounded-md border border-white/10 bg-black/25 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-600">Healthy pause</p>
          <p className="mt-1 flex min-w-0 items-start gap-2 break-words text-sm font-semibold leading-6 text-zinc-200">
            {remainingSeconds > 20 ? <Waves size={16} className="mt-1 shrink-0 text-cyan-200" /> : <Coffee size={16} className="mt-1 shrink-0 text-amber-200" />}
            <span className="min-w-0">{remainingSeconds > 20 ? 'Tab tak thoda paani peelo. Health ke liye acha hai.' : 'Chai ka sip lo. Timeline bas ready hone wali hai.'}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function ProcessStep({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <div className={`rounded-md border p-3 text-sm font-bold ${active ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100' : 'border-white/10 bg-black/20 text-zinc-600'}`}>
      <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/35 align-middle">
        {done ? <CheckCircle2 size={14} /> : active ? <Loader2 className="animate-spin" size={14} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      </span>
      {label}
    </div>
  );
}

function ModeCard({
  selected,
  imageSrc,
  icon,
  title,
  body,
  tone,
  onClick,
}: {
  selected: boolean;
  imageSrc: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  tone: 'emerald' | 'cyan';
  onClick: () => void;
}) {
  const selectedClass = tone === 'emerald'
    ? 'border-emerald-300 bg-emerald-300/10 text-emerald-100'
    : 'border-cyan-300 bg-cyan-300/10 text-cyan-100';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-lg border p-5 text-left transition ${selected ? selectedClass : 'border-white/10 bg-white/[0.035] text-zinc-200 hover:border-white/25'}`}
    >
      <img src={imageSrc} alt="" className="mb-4 aspect-[5/3] w-full rounded-md border border-white/10 bg-black/30 object-cover" />
      <div className={tone === 'emerald' ? 'text-emerald-200' : 'text-cyan-200'}>{icon}</div>
      <p className="mt-4 font-black">{title}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-500">{body}</p>
    </button>
  );
}

function FileDrop({ title, emptyCta, desc, file, accept, required, onChange, icon }: { title: string; emptyCta?: string; desc: string; file: File | null; accept: string; required?: boolean; onChange: (file: File | null) => void; icon: React.ReactNode }) {
  const isMissingRequired = required && !file;

  return (
    <label
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onChange(event.dataTransfer.files?.[0] || null);
      }}
      className={`block cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition ${
        file
          ? 'border-emerald-300/45 bg-emerald-300/8'
          : isMissingRequired
            ? 'animate-pulse border-emerald-300/50 bg-emerald-300/10 shadow-[0_0_28px_rgba(110,231,183,0.16)] hover:border-emerald-200'
            : 'border-white/15 bg-white/[0.03] hover:border-emerald-300/40'
      }`}
    >
      <input type="file" accept={accept} className="hidden" required={required} onChange={(event) => onChange(event.target.files?.[0] || null)} />
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-white/8 text-emerald-200">{icon}</div>
      <p className="font-bold">{file ? title : `Drag ${title.toLowerCase()} here or click to browse`}</p>
      <p className="mt-1 text-sm text-zinc-500">{file ? file.name : desc}</p>
      {!file && (
        <span className="mx-auto mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-emerald-300 px-5 py-3 text-sm font-black text-black">
          {icon}
          {emptyCta || `Select ${title.toLowerCase()}`}
        </span>
      )}
      {file && <p className="mt-2 text-xs font-bold text-emerald-200">{formatFileSize(file.size)} selected</p>}
      {file && <button type="button" onClick={(event) => { event.preventDefault(); onChange(null); }} className="mt-4 text-sm font-bold text-red-300">Remove</button>}
    </label>
  );
}

function PreviewChoiceGrid({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: PreviewOption[];
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-bold text-zinc-300">{label}</legend>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              className={`overflow-hidden rounded-lg border text-left transition ${
                selected ? 'border-emerald-300 bg-emerald-300/10 shadow-[0_0_0_1px_rgba(110,231,183,0.4)]' : 'border-white/10 bg-white/[0.035] hover:border-white/25'
              }`}
            >
              <StylePreview kind={option.preview} selected={selected} />
              <div className="flex min-h-20 items-start justify-between gap-3 p-3">
                <div className="min-w-0">
                  <p className="truncate font-bold text-white">{option.title}</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">{option.hint}</p>
                </div>
                <span className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-emerald-200 bg-emerald-200 text-black' : 'border-white/20 text-transparent'}`}>
                  <CheckCircle2 size={14} />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function StylePreview({ kind, selected }: { kind: PreviewOption['preview']; selected: boolean }) {
  const isCaption = kind.startsWith('caption');
  const sceneClass = {
    reels: 'bg-[linear-gradient(135deg,#08140f_0%,#146b4d_48%,#e5f7c8_100%)]',
    fast: 'bg-[linear-gradient(135deg,#0c0c10_0%,#e11d48_48%,#f8fafc_100%)]',
    cinematic: 'bg-[linear-gradient(135deg,#050607_0%,#2f3b38_56%,#b6c6c0_100%)]',
    luxury: 'bg-[linear-gradient(135deg,#050505_0%,#3a2d11_52%,#e2c36b_100%)]',
    meme: 'bg-[linear-gradient(135deg,#15110b_0%,#f59e0b_48%,#38bdf8_100%)]',
    documentary: 'bg-[linear-gradient(135deg,#071018_0%,#31556a_50%,#d8dee0_100%)]',
    'caption-reels': 'bg-[linear-gradient(135deg,#06120f_0%,#0f766e_55%,#f8fafc_100%)]',
    'caption-hormozi': 'bg-[linear-gradient(135deg,#12080a_0%,#b91c1c_50%,#facc15_100%)]',
    'caption-iman': 'bg-[linear-gradient(135deg,#060914_0%,#1d4ed8_55%,#e0f2fe_100%)]',
    'caption-cinematic': 'bg-[linear-gradient(135deg,#060606_0%,#374151_56%,#e5e7eb_100%)]',
  }[kind];

  return (
    <div className={`relative h-36 overflow-hidden border-b border-white/10 ${sceneClass}`}>
      <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(255,255,255,0.14),transparent_34%),linear-gradient(180deg,transparent,rgba(0,0,0,0.5))]" />
      <div className="absolute left-4 top-4 h-16 w-10 rounded-md bg-white/20 ring-1 ring-white/25" />
      <div className="absolute right-4 top-5 h-20 w-14 rounded-md bg-black/35 ring-1 ring-white/15" />
      <div className="absolute bottom-4 left-4 right-4">
        {isCaption ? <CaptionPreview kind={kind} /> : <EditPreview kind={kind} />}
      </div>
      {selected && <div className="absolute inset-0 ring-2 ring-inset ring-emerald-300" />}
    </div>
  );
}

function LiveVideoPreview({
  editingStyle,
  captionStyle,
  quality,
}: {
  editingStyle: PreviewOption;
  captionStyle: PreviewOption;
  quality: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/35 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-white">Live preview</p>
          <p className="mt-1 text-xs text-zinc-500">Style + captions together</p>
        </div>
        <span className="rounded-md bg-white/8 px-2 py-1 text-xs font-bold text-zinc-300">{quality}</span>
      </div>

      <div className="mx-auto w-full max-w-56 rounded-[28px] border border-white/15 bg-zinc-950 p-2 shadow-2xl shadow-black/60">
        <div className="relative aspect-[9/16] overflow-hidden rounded-[22px] bg-black">
          <StylePreview kind={editingStyle.preview} selected={false} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.18),transparent_22%),linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.78)_100%)]" />
          <div className="absolute left-4 right-4 top-5 flex items-center justify-between">
            <span className="rounded bg-black/55 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white">Preview</span>
            <span className="h-7 w-7 rounded-full bg-white/90" />
          </div>
          <div className="absolute inset-x-5 top-28 space-y-3">
            <div className="h-16 rounded-lg border border-white/10 bg-white/10" />
            <div className="ml-8 h-20 rounded-lg border border-white/10 bg-white/15" />
            <div className="mr-6 h-12 rounded-lg border border-white/10 bg-white/10" />
          </div>
          <div className="absolute bottom-20 left-4 right-4">
            <CaptionPreview kind={captionStyle.preview} />
          </div>
          <div className="absolute bottom-5 left-5 right-5 flex gap-1">
            <span className="h-1 flex-1 rounded bg-emerald-300" />
            <span className="h-1 flex-1 rounded bg-white/30" />
            <span className="h-1 flex-1 rounded bg-white/30" />
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <PreviewSummary title={editingStyle.title} body={editingStyle.description} />
        <PreviewSummary title={captionStyle.title} body={captionStyle.description} />
      </div>
    </div>
  );
}

function PreviewSummary({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
      <p className="text-sm font-bold text-white">{title}</p>
      <p className="mt-1 text-xs leading-5 text-zinc-500">{body}</p>
    </div>
  );
}

function EditPreview({ kind }: { kind: PreviewOption['preview'] }) {
  if (kind === 'fast' || kind === 'reels') {
    return (
      <div className="space-y-2">
        <div className="h-2 w-20 rounded-full bg-white" />
        <div className="grid grid-cols-4 gap-1">
          {[0, 1, 2, 3].map((item) => <span key={item} className="h-6 rounded bg-white/45" />)}
        </div>
      </div>
    );
  }

  if (kind === 'meme') {
    return <div className="rounded bg-white px-2 py-1 text-center text-xs font-black text-black">WAIT FOR IT</div>;
  }

  if (kind === 'documentary') {
    return (
      <div className="space-y-1">
        <div className="h-2 w-24 rounded-full bg-white/85" />
        <div className="h-1.5 w-16 rounded-full bg-white/55" />
        <div className="mt-2 h-5 w-28 rounded border border-white/30 bg-black/35" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="h-1.5 w-24 rounded-full bg-white/80" />
      <div className="h-8 rounded border border-white/20 bg-black/30" />
    </div>
  );
}

function CaptionPreview({ kind }: { kind: PreviewOption['preview'] }) {
  if (kind === 'caption-hormozi') {
    return <div className="rounded bg-black/75 px-2 py-2 text-center text-sm font-black text-yellow-300">BIG IDEA</div>;
  }

  if (kind === 'caption-iman') {
    return <div className="text-center text-sm font-black text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]">clean <span className="text-sky-300">keyword</span> pop</div>;
  }

  if (kind === 'caption-cinematic') {
    return <div className="text-center text-xs font-semibold text-white/90">A calm cinematic line</div>;
  }

  return <div className="rounded bg-black/65 px-2 py-2 text-center text-sm font-black text-white">KARAOKE WORDS</div>;
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-zinc-300">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-white/10 bg-black px-4 py-4 font-semibold text-white outline-none transition focus:border-emerald-300/60">
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/25 p-3">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-600">{label}</p>
      <p className="mt-1 truncate font-semibold">{value}</p>
    </div>
  );
}

function loadLocalJobs(userId: string): Job[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(getProjectStorageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Local project load failed:', error);
    return [];
  }
}

function saveLocalJobs(userId: string, jobs: Job[]) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(getProjectStorageKey(userId), JSON.stringify(jobs.slice(0, 50)));
  } catch (error) {
    console.error('Local project save failed:', error);
  }
}

function removeLocalJob(userId: string, jobId: string) {
  saveLocalJobs(userId, loadLocalJobs(userId).filter((job) => job.id !== jobId));
}

function saveAndReturnJobs(userId: string, jobs: Job[]) {
  saveLocalJobs(userId, jobs);
  return jobs;
}

function upsertJobAtTop(jobs: Job[], nextJob: Job) {
  const existing = jobs.find((job) => job.id === nextJob.id);
  const merged = existing ? { ...existing, ...nextJob } : nextJob;
  return [merged, ...jobs.filter((job) => job.id !== nextJob.id)];
}

function updateJobById(jobs: Job[], jobId: string, patch: Partial<Job>) {
  const existing = jobs.find((job) => job.id === jobId);
  if (!existing) {
    return [{ id: jobId, title: 'Untitled Project', status: 'Processing', progress: 0, ...patch } as Job, ...jobs];
  }

  return jobs.map((job) => (job.id === jobId ? { ...job, ...patch } : job));
}

function mergeJobs(...groups: Job[][]) {
  const byId = new Map<string, Job>();
  groups.flat().forEach((job) => {
    if (!job?.id) return;
    const previous = byId.get(job.id);
    byId.set(job.id, mergeJobData(previous, job));
  });

  return Array.from(byId.values())
    .map(markStaleRenderJob)
    .sort((a, b) => getJobTimestamp(b) - getJobTimestamp(a));
}

function mergeJobData(previous: Job | undefined, next: Job): Job {
  if (!previous) return next;

  return {
    ...previous,
    ...next,
    title: next.title || previous.title,
    status: next.status || previous.status,
    progress: Math.max(Number(previous.progress || 0), Number(next.progress || 0)),
    createdAt: next.createdAt || previous.createdAt,
    keepLocal: Boolean(previous.keepLocal || next.keepLocal),
  };
}

function getJobTimestamp(job: Job) {
  const value = job.createdAt;
  if (typeof value === 'string') return new Date(value).getTime() || 0;
  if (value && typeof (value as any).toDate === 'function') return (value as any).toDate().getTime();
  return 0;
}

function isCompletedStatus(status: string) {
  const normalized = status.toLowerCase();
  return normalized.includes('ready') || normalized.includes('completed');
}

function markStaleRenderJob(job: Job) {
  if (!isStaleInProgressJob(job)) return job;

  return {
    ...job,
    status: 'Render worker needs retry',
    progress: Math.min(Number(job.progress || 0), 76),
  };
}

function isStaleInProgressJob(job: Job) {
  if (getJobVideoUrl(job)) return false;
  const normalized = String(job.status || '').toLowerCase();
  if (!normalized || normalized.includes('retry') || normalized.includes('error') || normalized.includes('ready') || normalized.includes('completed')) {
    return false;
  }

  const isActiveRenderStatus = ['queued', 'upload', 'planning', 'preparing', 'processing', 'rendering', 'worker', 'export'].some((token) => normalized.includes(token));
  if (!isActiveRenderStatus) return false;

  const updatedAtMs = getJobUpdatedAt(job);
  if (!updatedAtMs) return false;

  return Date.now() - updatedAtMs > getRenderStaleTimeoutMs();
}

function getJobUpdatedAt(job: Job) {
  const value = job.updatedAt || job.createdAt;
  if (typeof value === 'string') return new Date(value).getTime() || 0;
  if (value && typeof (value as any).toDate === 'function') return (value as any).toDate().getTime();
  return 0;
}

async function persistProject(userId: string, job: Job) {
  await upsertProject(userId, job.id, {
    ...cleanProjectData(job),
    ownerId: userId,
    createdAt: job.createdAt || new Date().toISOString(),
    updatedAt: job.updatedAt || new Date().toISOString(),
  });
}

async function persistProjectPatch(userId: string, jobId: string, patch: Partial<Job>) {
  await upsertProject(userId, jobId, {
    ...cleanProjectData(patch),
    ownerId: userId,
    updatedAt: patch.updatedAt || new Date().toISOString(),
  });
}

async function fetchUserProjects(userId: string): Promise<Job[]> {
  const response = await fetch(`/api/projects/list?userId=${encodeURIComponent(userId)}`, { cache: 'no-store' });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.details || data.error || 'Project list failed.');
  }

  return Array.isArray(data.projects) ? data.projects : [];
}

async function upsertProject(userId: string, projectId: string, project: Partial<Job>) {
  const response = await fetch('/api/projects/upsert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, projectId, project }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(data.details || data.error || 'Project sync failed.');
  }
}

async function deleteProject(userId: string, projectId: string) {
  const response = await fetch('/api/projects/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, projectId }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(data.details || data.error || 'Delete failed.');
  }
}

function cleanProjectData(project: Partial<Job>) {
  return Object.fromEntries(Object.entries(project).filter(([key, value]) => key !== 'keepLocal' && value !== undefined));
}

function getProjectStorageKey(userId: string) {
  return `itnavideo.projects.${userId}`;
}

function getActiveProjectStorageKey(userId: string) {
  return `itnavideo.active-projects.${userId}`;
}

function getDeletedProjectStorageKey(userId: string) {
  return `itnavideo.deleted-projects.${userId}`;
}

function filterDeletedJobs(userId: string, jobs: Job[]) {
  const deletedIds = loadDeletedJobIds(userId);
  if (!deletedIds.size) return jobs;
  return jobs.filter((job) => !deletedIds.has(job.id));
}

function loadDeletedJobIds(userId: string) {
  if (typeof window === 'undefined') return new Set<string>();

  try {
    const raw = window.localStorage.getItem(getDeletedProjectStorageKey(userId));
    const parsed = JSON.parse(raw || '[]');
    return new Set<string>(Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []);
  } catch {
    return new Set<string>();
  }
}

function markStickyJob(job: Job): Job {
  return { ...job, keepLocal: true };
}

function rememberActiveJob(userId: string, jobId: string) {
  if (typeof window === 'undefined' || !jobId) return;

  try {
    const key = getActiveProjectStorageKey(userId);
    const existing = JSON.parse(window.localStorage.getItem(key) || '[]');
    const ids = Array.isArray(existing) ? existing.filter((id) => typeof id === 'string') : [];
    window.localStorage.setItem(key, JSON.stringify([jobId, ...ids.filter((id) => id !== jobId)].slice(0, 25)));
  } catch (error) {
    console.error('Active project cache failed:', error);
  }
}

function rememberDeletedJob(userId: string, jobId: string) {
  if (typeof window === 'undefined' || !jobId) return;

  try {
    const key = getDeletedProjectStorageKey(userId);
    const existing = JSON.parse(window.localStorage.getItem(key) || '[]');
    const ids = Array.isArray(existing) ? existing.filter((id) => typeof id === 'string') : [];
    window.localStorage.setItem(key, JSON.stringify([jobId, ...ids.filter((id) => id !== jobId)].slice(0, 50)));
  } catch (error) {
    console.error('Deleted project cache failed:', error);
  }
}

function forgetActiveJob(userId: string, jobId: string) {
  if (typeof window === 'undefined' || !jobId) return;

  try {
    const key = getActiveProjectStorageKey(userId);
    const existing = JSON.parse(window.localStorage.getItem(key) || '[]');
    const ids = Array.isArray(existing) ? existing.filter((id) => typeof id === 'string' && id !== jobId) : [];
    window.localStorage.setItem(key, JSON.stringify(ids));
  } catch (error) {
    console.error('Active project delete failed:', error);
  }
}

function getPreviewOption(options: PreviewOption[], value: string) {
  return options.find((option) => option.value === value) || options[0];
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getUploadPreflightError(file: File, durationSeconds?: number) {
  if (file.size > FREE_MAX_UPLOAD_BYTES) {
    return `Free plan supports files up to ${formatFileSize(FREE_MAX_UPLOAD_BYTES)} for fast ${PIPELINE_QUALITY} exports. Use a shorter file now, and Premium can unlock larger uploads later.`;
  }

  if (Number.isFinite(durationSeconds) && Number(durationSeconds) > FREE_MAX_DURATION_SECONDS) {
    return `Free plan supports up to ${formatDuration(FREE_MAX_DURATION_SECONDS)} of audio or video. Trim this ${formatDuration(Number(durationSeconds))} file, or use Premium later for longer videos.`;
  }

  return '';
}

function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = document.createElement('audio');
    const objectUrl = URL.createObjectURL(file);

    audio.preload = 'metadata';
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(Number.isFinite(audio.duration) ? audio.duration : 30);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Unable to read audio duration'));
    };
    audio.src = objectUrl;
  });
}

async function uploadMediaFile(path: string, file: File, onProgress?: (percent: number) => void) {
  const folder = path.split('/').slice(0, -1).join('/') || 'itnavideo/uploads';
  onProgress?.(1);
  const signature = await withClientTimeout(
    getCloudinaryUploadSignature(folder),
    getUploadSignatureTimeoutMs(),
    'Upload could not get a secure Cloudinary signature. Please retry.',
  );
  onProgress?.(3);

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    let settled = false;
    let progressStarted = false;
    let lastProgressAt = Date.now();

    formData.append('file', file);
    formData.append('api_key', signature.apiKey);
    formData.append('timestamp', String(signature.timestamp));
    formData.append('folder', signature.folder);
    formData.append('signature', signature.signature);

    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      window.clearInterval(stallWatcher);
      callback();
    };

    const timeout = window.setTimeout(() => {
      finish(() => reject(new Error(progressStarted ? 'Upload timed out. Please try again.' : 'Upload could not start. Check your connection and try again.')));
      xhr.abort();
    }, getUploadTimeoutMs());

    const stallWatcher = window.setInterval(() => {
      if (settled) return;
      const idleMs = Date.now() - lastProgressAt;
      if (idleMs < getUploadStallTimeoutMs()) return;
      finish(() => reject(new Error('Upload is stuck at the server. Please retry in a moment.')));
      xhr.abort();
    }, 5000);

    xhr.upload.onprogress = (event) => {
      lastProgressAt = Date.now();
      if (!event.lengthComputable) return;
      progressStarted = true;
      const percent = Math.max(1, Math.min(95, Math.round((event.loaded / Math.max(event.total, 1)) * 95)));
      onProgress?.(percent);
    };

    xhr.onload = () => {
      finish(() => {
        try {
        const data = JSON.parse(xhr.responseText || '{}');
        const uploadedUrl = data.secure_url || data.url;
        if (xhr.status < 200 || xhr.status >= 300 || !uploadedUrl) {
          reject(new Error(data.details || data.error?.message || data.error || 'Upload failed.'));
          return;
        }
        onProgress?.(100);
        resolve(uploadedUrl);
        } catch {
          reject(new Error('Upload response was invalid.'));
        }
      });
    };

    xhr.onerror = () => {
      finish(() => reject(new Error('Upload failed. Please check your connection and try again.')));
    };

    xhr.onabort = () => {
      finish(() => reject(new Error('Upload was cancelled.')));
    };

    xhr.ontimeout = () => {
      finish(() => reject(new Error('Upload timed out. Please try again.')));
    };

    xhr.timeout = getUploadTimeoutMs();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`);
    xhr.send(formData);
  });
}

function getCreatorFacingGenerationError(error: any, fallback = 'Generation failed.') {
  const code = String(error?.code || '');
  const rawMessage = String(error?.message || fallback);
  const normalized = `${code} ${rawMessage}`.toLowerCase();

  if (normalized.includes('storage/retry-limit-exceeded')) {
    return 'Upload or final save took too long. Please retry on a stable connection; the render may have completed but the file could not be saved.';
  }

  if (normalized.includes('cloudinary') && normalized.includes('timed out')) {
    return 'Final video save took too long. Please retry in a moment.';
  }

  if (error?.name === 'AbortError' || normalized.includes('timed out')) {
    return 'This step took too long. Please retry; shorter uploads are more reliable on mobile networks.';
  }

  return rawMessage;
}

async function getCloudinaryUploadSignature(folder: string) {
  const data = await postJsonWithTimeout('/api/upload/signature', { folder }, getUploadSignatureTimeoutMs());

  if (!data.cloudName || !data.apiKey || !data.timestamp || !data.signature) {
    throw new Error('Upload signature response was invalid.');
  }

  return data as {
    cloudName: string;
    apiKey: string;
    timestamp: number;
    folder: string;
    signature: string;
  };
}

function withClientTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error(message)), timeoutMs);
    promise
      .then(resolve)
      .catch(reject)
      .finally(() => window.clearTimeout(timeout));
  });
}

function sanitizeFileName(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'upload';
}

function getJobVideoUrl(job: Job) {
  return normalizeRenderUrl(job.videoUrl || job.renderUrl || '');
}

function openJobVideo(job: Job) {
  const videoUrl = getJobVideoUrl(job);
  if (!videoUrl) {
    toast.info('Your video is still being prepared.');
    return;
  }

  window.open(videoUrl, '_blank', 'noopener,noreferrer');
}

async function downloadJobVideo(job: Job) {
  const videoUrl = getJobVideoUrl(job);
  if (!videoUrl) {
    toast.info('Your video is still being prepared.');
    return;
  }

  const filename = `${sanitizeFileName(job.title || job.id || 'itnavideo')}.mp4`;

  try {
    const response = await fetch(videoUrl, { mode: 'cors' });
    if (!response.ok) throw new Error(`Download failed with ${response.status}`);

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    triggerDownload(blobUrl, filename);
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    toast.success('Download started.');
  } catch (error) {
    console.warn('Direct video download failed, falling back to browser open:', error);
    triggerDownload(videoUrl, filename);
    toast.info('Opening video. If it does not download automatically, use the browser save option.');
  }
}

function triggerDownload(href: string, filename: string) {
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = filename;
  anchor.target = '_blank';
  anchor.rel = 'noreferrer';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

async function startBackendVideoJob({
  jobId,
  userId,
  voiceoverUrl,
  title,
  config,
  userAssets,
  runPipeline,
  targetDurationSeconds,
}: {
  jobId: string;
  userId: string;
  voiceoverUrl: string;
  title: string;
  config: Record<string, string>;
  userAssets?: Array<{ url: string; type: 'image' | 'video'; filename: string }>;
  runPipeline?: boolean;
  targetDurationSeconds?: number;
}) {
  await postJsonWithTimeout('/api/jobs/start', {
    jobId,
    userId,
    voiceoverUrl,
    title,
    config,
    userAssets: userAssets || [],
    runPipeline,
    targetDurationSeconds,
  }, getPlanningTimeoutMs());
}

async function startBackgroundVideoPipeline({
  jobId,
  userId,
  voiceUrl,
  config,
  userAssets,
  visualUrl,
  videoDurationSeconds,
  onJobUpdate,
}: {
  jobId: string;
  userId: string;
  voiceUrl: string;
  config: Record<string, string>;
  userAssets: Array<{ url: string; type: 'image' | 'video'; filename: string }>;
  visualUrl?: string;
  videoDurationSeconds: number;
  onJobUpdate: (jobId: string, patch: Partial<Job>) => void;
}) {
  try {
    onJobUpdate(jobId, { status: 'AI Director starting...', progress: 64 });
    
    // Call the trigger API (Vercel) which forwards to Render
    const response = await postJsonWithTimeout('/api/timeline', {
      voiceoverUrl: voiceUrl,
      jobId,
      userId,
      config,
      userAssets,
    }, getPlanningTimeoutMs());

    // Since it's decoupled, we don't call /api/render here.
    // The worker will do AI -> Render -> Update DB.
    // Dashboard sync interval will pick up status: 'Video ready' automatically.
    onJobUpdate(jobId, { 
      status: 'AI Planning + Rendering', 
      progress: 68,
      renderProvider: getRenderBackendLabel() 
    });
    
    toast.success('Your video is being crafted in the background.');
  } catch (error: any) {
    console.error('Background Pipeline Failure:', error);
    const message = String(error?.message || 'Video generation needs retry.');
    onJobUpdate(jobId, {
      status: message.toLowerCase().includes('timeline') ? 'Timeline needs retry' : 'Render needs retry',
      progress: 62,
    });
    toast.error(message);
  }
}

async function postJsonWithTimeout(url: string, payload: Record<string, unknown>, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.details || data.error || 'Video generation failed.');
    }

    return data;
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      throw new Error(`Request timed out after ${Math.round(timeoutMs / 1000)} seconds.`);
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

function getRenderBackendUrl() {
  const backendUrl = process.env.NEXT_PUBLIC_RENDER_BACKEND_URL || '';
  return backendUrl.replace(/\/$/, '');
}

function getRenderBackendLabel() {
  return getRenderBackendUrl() ? 'render' : 'local';
}

function getRenderTimeoutMs() {
  return Number(process.env.NEXT_PUBLIC_RENDER_TIMEOUT_MS || 10 * 60 * 1000); // Increased to 10 mins
}

function getRenderStaleTimeoutMs() {
  return Number(process.env.NEXT_PUBLIC_RENDER_STALE_TIMEOUT_MS || 12 * 60 * 1000);
}

function getPlanningTimeoutMs() {
  return Number(process.env.NEXT_PUBLIC_GENERATION_PLAN_TIMEOUT_MS || 180_000);
}

function getUploadTimeoutMs() {
  return Number(process.env.NEXT_PUBLIC_UPLOAD_TIMEOUT_MS || 300_000); // Increased to 5 mins
}

function getUploadStallTimeoutMs() {
  return Number(process.env.NEXT_PUBLIC_UPLOAD_STALL_TIMEOUT_MS || 60_000); // Increased to 60s
}

function getUploadSignatureTimeoutMs() {
  return Number(process.env.NEXT_PUBLIC_UPLOAD_SIGNATURE_TIMEOUT_MS || 10_000);
}

function normalizeRenderUrl(renderUrl: string) {
  if (!renderUrl) return '';
  if (/^https?:\/\//i.test(renderUrl)) return renderUrl;
  if (renderUrl.startsWith('/')) return `${window.location.origin}${renderUrl}`;
  const baseUrl = getRenderBackendUrl() || window.location.origin;
  return `${baseUrl}/${renderUrl}`;
}

function getTargetVideoDuration(audioDurationSeconds: number | undefined, _config: { aspectRatio: string; editingStyle: string }) {
  const sourceDuration = Number.isFinite(audioDurationSeconds) ? Number(audioDurationSeconds) : 60;
  const maxAllowed = FREE_MAX_DURATION_SECONDS;
  return Math.max(8, Math.min(maxAllowed, sourceDuration));
}

function getGenerationEta({
  fileSizeBytes,
  targetDurationSeconds,
}: {
  fileSizeBytes: number;
  targetDurationSeconds: number;
}): GenerationEta {
  const fileSizeMb = fileSizeBytes / (1024 * 1024);
  const uploadSeconds = Math.ceil(Math.max(6, fileSizeMb / 0.75));
  const planningSeconds = Math.ceil(Math.max(8, Math.min(22, targetDurationSeconds * 0.22)));
  const renderMultiplier = 1.35;
  const renderSeconds = Math.ceil(Math.max(18, targetDurationSeconds * renderMultiplier));

  return {
    uploadSeconds,
    planningSeconds,
    renderSeconds,
    totalSeconds: uploadSeconds + planningSeconds + renderSeconds,
  };
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  return rest ? `${minutes}m ${rest}s` : `${minutes}m`;
}
