'use client';

import React, { useState, useRef } from 'react';
import {
  Mic,
  BookOpen,
  User,
  Eye,
  EyeOff,
  ImagePlus,
  Sparkles,
  Trash2,
  UploadCloud,
  CheckCircle2,
  Film,
  Play,
  Pause,
  Copy,
  Check,
  Plus,
  ArrowRight,
  AlertCircle,
  Clock,
  Layers,
  FileText,
  Volume2,
  Tag,
  RefreshCw,
} from 'lucide-react';
import { BorderBeam } from "@/components/magicui/BorderBeam";
import { StudioWorkflowRoadmap } from "@/components/dashboard/StudioWorkflowRoadmap";
import { BookSummaryPlan, BookSummaryScene, BookSummarySceneType } from '@/services/ai/bookSummaryPlanner';
import InteractiveRenderEngine, { JobStatus } from '@/components/render/InteractiveRenderEngine';

interface BookSummaryStudioProps {
  onStartRender?: (payload: any) => void;
  renderStatus?: JobStatus;
  onResetRender?: () => void;
  onRetryRender?: () => void;
  onCancelRender?: () => void;
}

const TOPIC_PRESETS = [
  { label: '💰 Wealth & Compounding', value: 'wealth' },
  { label: '⚡ Habits & Productivity', value: 'habits' },
  { label: '🧠 Mindset & Psychology', value: 'psychology' },
  { label: '🚀 Business & Leadership', value: 'business' },
  { label: '🧘 Philosophy & Focus', value: 'philosophy' },
];

export const BookSummaryStudio: React.FC<BookSummaryStudioProps> = ({
  onStartRender,
  renderStatus,
  onResetRender,
  onRetryRender,
  onCancelRender,
}) => {
  // Step 1: Upload & Info State (Strictly 16:9 Cinema Landscape, max 10 min)
  const [audioUrl, setAudioUrl] = useState<string>('');          // signed read URL (for plan API transcription)
  const [audioS3Key, setAudioS3Key] = useState<string>('');      // S3 object key (for render job mediaKey)
  const [audioFileName, setAudioFileName] = useState<string>('');
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string>('');
  const [bookTitle, setBookTitle] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('wealth');
  const [bookCoverUrl, setBookCoverUrl] = useState<string>('');
  const [authorPortraitUrl, setAuthorPortraitUrl] = useState<string>('');
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [inputError, setInputError] = useState<string | null>(null);

  // Uploading flags
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingAuthor, setIsUploadingAuthor] = useState(false);
  const [isUploadingRef, setIsUploadingRef] = useState(false);

  // Step 2: Storyboard & AI Plan State
  const [studioStep, setStudioStep] = useState<'inputs' | 'storyboard' | 'rendering'>('inputs');
  const [isSubmittingRender, setIsSubmittingRender] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [plan, setPlan] = useState<BookSummaryPlan | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [planWords, setPlanWords] = useState<unknown[]>([]);
  const [planTimestampSegments, setPlanTimestampSegments] = useState<unknown[]>([]);
  const [durationSeconds, setDurationSeconds] = useState<number>(60);

  // Metadata copy states
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedChapters, setCopiedChapters] = useState(false);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const authorInputRef = useRef<HTMLInputElement>(null);
  const refImagesInputRef = useRef<HTMLInputElement>(null);

  // Rule 4.1 Credit Calculation: 1 Min = 1 Credit (1m=1, 5m=5, 10m=10 Cr)
  const effectiveDuration = audioDuration > 0 ? audioDuration : (durationSeconds || 60);
  const calculatedCredits = Math.max(1, Math.min(10, Math.ceil(effectiveDuration / 60)));

  // ─── S3 & Cloudinary Upload Helpers ───────────────────────────────────────
  const uploadAudioToS3 = async (file: File): Promise<{ key: string; readUrl: string }> => {
    const contentType = file.type || 'audio/mpeg';

    const presignRes = await fetch('/api/media/presign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        contentType,
        fileSize: file.size,
        mode: 'bookSummary',
        userId: '',
      }),
    });
    const presign = await presignRes.json().catch(() => ({}));
    if (!presignRes.ok || !presign.ok) {
      throw new Error(presign.error || 'Could not prepare audio upload. Please try again.');
    }

    const putRes = await fetch(presign.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: file,
    });
    if (!putRes.ok) {
      throw new Error('Audio upload failed. Please check your connection and try again.');
    }

    return { key: presign.key, readUrl: presign.uploadUrl.split('?')[0] };
  };

  const uploadImageToCloudinary = async (file: File, folder: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res = await fetch('/api/media/cloudinary-upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok || !data.url) {
      throw new Error(data.error || 'Image upload failed. Please try again.');
    }
    return data.url;
  };

  // ─── Handle Audio Selection & Instant Duration Detection ──────────────────
  const handleAudioSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInputError(null);
    setIsUploadingAudio(true);

    try {
      // Instant duration detection via HTML5 Audio
      const blobUrl = URL.createObjectURL(file);
      setAudioPreviewUrl(blobUrl);

      const probeAudio = new Audio();
      probeAudio.src = blobUrl;
      probeAudio.onloadedmetadata = () => {
        if (Number.isFinite(probeAudio.duration) && probeAudio.duration > 0) {
          const dur = Math.round(probeAudio.duration);
          if (dur > 600) {
            setInputError('Audio duration exceeds the 10-minute maximum limit for YouTube Book Summary. Please trim and re-upload.');
          }
          setAudioDuration(dur);
          setDurationSeconds(dur);
        }
      };

      const { key, readUrl } = await uploadAudioToS3(file);
      setAudioUrl(readUrl);
      setAudioS3Key(key);
      setAudioFileName(file.name);
    } catch (err: any) {
      setInputError(err?.message || 'Failed to upload audio file.');
    } finally {
      setIsUploadingAudio(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleCoverSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCover(true);
    try {
      const url = await uploadImageToCloudinary(file, 'itnavideo/book-covers');
      setBookCoverUrl(url);
    } catch (err: any) {
      setInputError(err?.message || 'Failed to upload book cover.');
    } finally {
      setIsUploadingCover(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleAuthorSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAuthor(true);
    try {
      const url = await uploadImageToCloudinary(file, 'itnavideo/author-portraits');
      setAuthorPortraitUrl(url);
    } catch (err: any) {
      setInputError(err?.message || 'Failed to upload author portrait.');
    } finally {
      setIsUploadingAuthor(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleRefImagesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (referenceImages.length >= 20) {
      setInputError('Maximum limit of 20 reference images reached.');
      if (e.target) e.target.value = '';
      return;
    }

    const availableSlots = 20 - referenceImages.length;
    const filesToUpload = files.slice(0, availableSlots);

    setIsUploadingRef(true);
    try {
      const urls: string[] = [];
      for (const f of filesToUpload) {
        const u = await uploadImageToCloudinary(f, 'itnavideo/reference-images');
        urls.push(u);
      }
      setReferenceImages(prev => [...prev, ...urls]);
    } catch (err: any) {
      setInputError(err?.message || 'Failed to upload reference images.');
    } finally {
      setIsUploadingRef(false);
      if (e.target) e.target.value = '';
    }
  };

  // ─── Step 1 -> Step 2: Run Storyboard Analysis API ────────────────────────
  const handleAnalyzeAndBuildStoryboard = async () => {
    if (!audioUrl) {
      setInputError('Audio narration file is required to create a Book Summary Video.');
      return;
    }

    const hasAnyImage = Boolean(bookCoverUrl || authorPortraitUrl || (referenceImages && referenceImages.length > 0));
    if (!hasAnyImage) {
      setInputError('Please upload at least 1 image (Book Cover, Author Portrait, or Reference Image).');
      return;
    }

    setInputError(null);
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/reels/plan-book-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioUrl,
          bookTitle,
          authorName,
          bookCoverUrl,
          authorPortraitUrl,
          referenceImages,
          topic: selectedTopic,
          durationSeconds: audioDuration || durationSeconds || 60,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to generate storyboard plan.');
      }

      const data = await res.json();
      setPlan(data.plan);
      setTranscript(data.transcript);
      setPlanWords(Array.isArray(data.words) ? data.words : []);
      setPlanTimestampSegments(Array.isArray(data.timestampSegments) ? data.timestampSegments : []);
      if (data.durationSeconds) {
        setDurationSeconds(data.durationSeconds);
        if (!audioDuration) setAudioDuration(Math.round(data.durationSeconds));
      }
      setStudioStep('storyboard');
    } catch (err: any) {
      setInputError(err?.message || 'Error creating AI Storyboard plan. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ─── Storyboard editing helpers ───────────────────────────────────────────
  const handleUpdateSceneText = (sceneId: string, newText: string) => {
    if (!plan) return;
    setPlan({
      ...plan,
      scenes: plan.scenes.map(s => s.id === sceneId ? { ...s, text: newText } : s),
    });
  };

  const handleUpdateSceneSubtitle = (sceneId: string, newSubtitle: string) => {
    if (!plan) return;
    setPlan({
      ...plan,
      scenes: plan.scenes.map(s => s.id === sceneId ? { ...s, subtitle: newSubtitle } : s),
    });
  };

  const handleToggleDisableScene = (sceneId: string) => {
    if (!plan) return;
    setPlan({
      ...plan,
      scenes: plan.scenes.map(s => s.id === sceneId ? { ...s, disabled: !s.disabled } : s),
    });
  };

  const handleDeleteScene = (sceneId: string) => {
    if (!plan) return;
    setPlan({
      ...plan,
      scenes: plan.scenes.filter(s => s.id !== sceneId),
    });
  };

  const handleAddKeyIdeaScene = () => {
    if (!plan) return;
    const maxDur = audioDuration || durationSeconds || 60;
    const lastScene = plan.scenes[plan.scenes.length - 1];
    const start = lastScene ? Math.min(maxDur - 3.5, lastScene.endSeconds + 1) : 5;
    const newScene: BookSummaryScene = {
      id: `scene-custom-${Date.now()}`,
      type: 'KEY_IDEA',
      startSeconds: Math.max(0, start),
      endSeconds: Math.min(maxDur, start + 3.5),
      text: 'Key Principle or Takeaway',
      subtitle: bookTitle ? `Key Insight — ${bookTitle}` : 'Core Concept',
    };
    setPlan({
      ...plan,
      scenes: [...plan.scenes, newScene].sort((a, b) => a.startSeconds - b.startSeconds),
    });
  };

  // ─── Step 2 -> Step 3: Trigger Final Video Render Job ────────────────────
  const handleStartFinalRender = () => {
    if (!plan || !onStartRender || isSubmittingRender) return;

    setIsSubmittingRender(true);
    setStudioStep('rendering');
    onStartRender({
      mode: 'bookSummary',
      template: 'BOOK_SUMMARY',
      audioUrl,
      audioS3Key,
      durationSeconds: audioDuration || durationSeconds || 60,
      bookTitle,
      authorName,
      bookCoverUrl,
      authorPortraitUrl,
      referenceImages,
      scenes: plan.scenes.filter(s => !s.disabled),
      metadata: plan.metadata,
      captionsTheme: 'glow-viral',
      aspectRatio: '16:9',
      transcript,
      words: planWords,
      timestampSegments: planTimestampSegments,
    });
  };

  // Copy helper
  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  // Format timestamp helper (seconds -> mm:ss)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ─── Render Active Cloud Render View ──────────────────────────────────────
  if (studioStep === 'rendering' && renderStatus && renderStatus.state !== 'idle') {
    return (
      <div className="w-full space-y-8">
        <InteractiveRenderEngine
          mode="bookSummary"
          status={renderStatus}
          title={bookTitle || 'Book Summary Video'}
          fileName={audioFileName}
          onRetry={onRetryRender || (() => {})}
          onReset={() => {
            setStudioStep('inputs');
            if (onResetRender) onResetRender();
          }}
          onCancel={onCancelRender}
        />

        {/* Ready State: Metadata & Chapter Exposures */}
        {renderStatus.state === 'ready' && plan?.metadata && (
          <div className="rounded-[28px] border border-white/10 bg-[#0E1526]/90 p-6 sm:p-8 space-y-6 shadow-2xl shadow-[#FF5722]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#FF5722]/10 border border-[#FF5722]/30 p-2.5 text-[#FF9100]">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">YouTube & Social Publishing Metadata</h3>
                  <p className="text-xs text-slate-400">Auto-generated metadata, chapters, and key takeaways for 16:9 upload</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Suggested YouTube Title */}
              <div className="rounded-2xl border border-white/10 bg-[#151E30] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF9100]">Suggested Title</span>
                  <button
                    onClick={() => copyToClipboard(plan.metadata.suggestedTitle, setCopiedTitle)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition"
                  >
                    {copiedTitle ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copiedTitle ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-base font-bold text-white">{plan.metadata.suggestedTitle}</p>
              </div>

              {/* 2. YouTube Description */}
              <div className="rounded-2xl border border-white/10 bg-[#151E30] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF9100]">Description</span>
                  <button
                    onClick={() => copyToClipboard(plan.metadata.description, setCopiedDesc)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition"
                  >
                    {copiedDesc ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copiedDesc ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{plan.metadata.description}</p>
              </div>

              {/* 3. Chapter Timestamps */}
              <div className="rounded-2xl border border-white/10 bg-[#151E30] p-5 space-y-3 md:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF9100]">Chapter Timestamps</span>
                  <button
                    onClick={() => {
                      const text = plan.metadata.chapters.map(c => `${c.timestamp} - ${c.title}`).join('\n');
                      copyToClipboard(text, setCopiedChapters);
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition"
                  >
                    {copiedChapters ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copiedChapters ? 'Copied All' : 'Copy Chapters'}</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {plan.metadata.chapters.map((chap, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-slate-200 bg-white/5 p-2 rounded-xl border border-white/5">
                      <span className="font-mono text-xs font-bold text-[#FFA000] bg-[#FF5722]/10 px-2 py-1 rounded-md border border-[#FF5722]/20">
                        {chap.timestamp}
                      </span>
                      <span className="font-medium truncate">{chap.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative rounded-[28px] border border-white/10 bg-[#0B0F19] p-5 sm:p-8 shadow-2xl min-w-0 max-w-full overflow-x-hidden space-y-8 text-white">
      {/* Magic UI BorderBeam Glowing Effect */}
      <BorderBeam size={320} duration={14} colorFrom="#FF5722" colorTo="#FFA000" />

      {/* Studio Stage Stepper Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#111827]/90 p-4 sm:p-5 backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] p-2.5 text-black shadow-lg shadow-[#FF5722]/20">
            <BookOpen size={22} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white truncate">Book Summary Studio</h2>
              <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-orange-400">
                16:9 Widescreen
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 leading-tight mt-0.5">
              1080p Landscape • Structured AI Chapters • {calculatedCredits} Credit{calculatedCredits > 1 ? 's' : ''} (1 Min = 1 Cr)
            </p>
          </div>
        </div>

        {/* Step Indicator Navigation Pills */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setStudioStep('inputs')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
              studioStep === 'inputs'
                ? 'bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-black font-black shadow-md shadow-[#FF5722]/20'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            1. Media &amp; Setup
          </button>
          <span className="text-slate-600">/</span>
          <button
            type="button"
            disabled={!plan}
            onClick={() => plan && setStudioStep('storyboard')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
              studioStep === 'storyboard'
                ? 'bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-black font-black shadow-md shadow-[#FF5722]/20'
                : 'bg-white/5 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            2. Storyboard &amp; Chapters
          </button>
        </div>
      </div>

      {/* Process Workflow Roadmap (Full Width Standalone Block) */}
      <StudioWorkflowRoadmap mode="bookSummary" />

      {/* Input Error Callout */}
      {inputError && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 flex items-center justify-between gap-3 text-red-300 text-sm font-bold">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="flex-shrink-0 text-red-400" />
            <span>{inputError}</span>
          </div>
          <button
            onClick={() => setInputError(null)}
            className="text-xs text-red-400 hover:text-red-200 underline font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* STAGE 1: MEDIA & BOOK INFO INPUTS */}
      {studioStep === 'inputs' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 Columns: Media Uploads (Audio + Book Cover + Author/Visuals) */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Required Spoken Audio Narration */}
              <div className="rounded-[28px] border border-white/10 bg-[#111827]/80 p-6 sm:p-7 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-xl bg-orange-500/10 p-2 text-[#FF9100] border border-orange-500/20">
                      <Mic size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-black uppercase tracking-wider text-white">Audio Narration</span>
                      <p className="text-[11px] text-slate-400">Spoken book summary or chapter overview (Up to 10 min)</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full">
                    Required
                  </span>
                </div>

                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*,video/mp4"
                  onChange={handleAudioSelect}
                  className="hidden"
                />

                {!audioUrl ? (
                  <button
                    type="button"
                    onClick={() => audioInputRef.current?.click()}
                    disabled={isUploadingAudio}
                    className="w-full h-44 border-2 border-dashed border-white/15 hover:border-[#FF5722]/60 rounded-2xl bg-[#151E30]/40 hover:bg-[#151E30]/80 transition-all flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-white cursor-pointer group"
                  >
                    <div className="rounded-full bg-white/5 p-3 group-hover:scale-110 group-hover:bg-orange-500/10 transition-transform">
                      <UploadCloud size={32} className="text-[#FF9100]" />
                    </div>
                    <div className="text-center px-4">
                      <p className="text-sm font-bold text-white">
                        {isUploadingAudio ? 'Uploading Narration Audio...' : 'Click to Upload Narration Audio'}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">MP3, WAV, M4A, or MP4 audio • Max 10 Minutes (600s)</p>
                      <span className="inline-block mt-2 font-mono text-[11px] text-orange-400/90 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                        1 Min = 1 Credit
                      </span>
                    </div>
                  </button>
                ) : (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="rounded-xl bg-emerald-500/20 p-2 text-emerald-400 shrink-0">
                          <CheckCircle2 size={22} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-white truncate">{audioFileName || 'Narration Audio'}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-xs font-bold text-emerald-400">
                              {formatTime(audioDuration || durationSeconds)} / 10:00 Max
                            </span>
                            <span className="text-slate-500">•</span>
                            <span className="text-xs font-bold text-amber-300">
                              {calculatedCredits} Credit{calculatedCredits > 1 ? 's' : ''} Cost
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => audioInputRef.current?.click()}
                          title="Replace Audio"
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw size={13} />
                          <span>Replace</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAudioUrl('');
                            setAudioS3Key('');
                            setAudioFileName('');
                            setAudioDuration(0);
                            setAudioPreviewUrl('');
                          }}
                          title="Remove Audio"
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Integrated Playable Audio Waveform Preview */}
                    {audioPreviewUrl && (
                      <div className="pt-2 border-t border-emerald-500/20 flex items-center gap-3">
                        <Volume2 size={16} className="text-emerald-400 shrink-0" />
                        <audio
                          controls
                          src={audioPreviewUrl}
                          className="w-full h-8 accent-[#FF5722] opacity-90"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Visual Assets (Book Cover 3D Mockup + Author Portrait + Reference B-Roll) */}
              <div className="rounded-[28px] border border-white/10 bg-[#111827]/80 p-6 sm:p-7 space-y-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-xl bg-orange-500/10 p-2 text-[#FF9100] border border-orange-500/20">
                      <ImagePlus size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-black uppercase tracking-wider text-white">Visual Assets</span>
                      <p className="text-[11px] text-slate-400">Book cover art, author portrait, and thematic visuals</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold uppercase bg-orange-500/15 border border-orange-500/30 text-orange-400 px-3 py-1 rounded-full">
                    At Least 1 Image Required
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Book Cover with 3D Preview */}
                  <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverSelect} className="hidden" />
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300">Book Cover (Front Art)</label>
                      <span className="text-[10px] text-orange-400 font-semibold">Recommended</span>
                    </div>

                    {!bookCoverUrl ? (
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        disabled={isUploadingCover}
                        className="w-full h-36 border border-white/10 hover:border-[#FF5722]/50 rounded-2xl bg-[#151E30]/50 hover:bg-[#151E30] flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-white transition cursor-pointer group"
                      >
                        <div className="rounded-xl bg-white/5 p-2.5 group-hover:scale-105 transition-transform">
                          <BookOpen size={22} className="text-[#FF9100]" />
                        </div>
                        <span className="text-xs font-bold text-white">
                          {isUploadingCover ? 'Uploading Cover...' : 'Upload Book Cover'}
                        </span>
                        <span className="text-[10px] text-slate-500">Creates 3D book intro card</span>
                      </button>
                    ) : (
                      <div className="relative rounded-2xl border border-white/15 bg-[#151E30] p-3 flex items-center gap-4 group">
                        {/* 3D Book Cover Mockup Miniature */}
                        <div
                          className="relative w-16 h-22 rounded-r-md shadow-xl overflow-hidden shrink-0 border border-white/20"
                          style={{
                            boxShadow: '4px 4px 12px rgba(0,0,0,0.6), -1px 0 5px rgba(255,87,34,0.3)',
                          }}
                        >
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-r from-black/80 to-transparent z-10" />
                          <img src={bookCoverUrl} alt="Cover" className="w-full h-full object-cover" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate">Book Cover Uploaded</p>
                          <p className="text-[10px] text-emerald-400">3D Intro &amp; Outro Ready</p>
                          <button
                            type="button"
                            onClick={() => coverInputRef.current?.click()}
                            className="mt-1 text-[11px] text-[#FF9100] hover:underline font-bold cursor-pointer"
                          >
                            Change Cover
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setBookCoverUrl('')}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Author Portrait (Optional) */}
                  <input ref={authorInputRef} type="file" accept="image/*" onChange={handleAuthorSelect} className="hidden" />
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300">Author Portrait (Optional)</label>
                      <span className="text-[10px] text-slate-400 font-semibold">Optional</span>
                    </div>

                    {!authorPortraitUrl ? (
                      <button
                        type="button"
                        onClick={() => authorInputRef.current?.click()}
                        disabled={isUploadingAuthor}
                        className="w-full h-36 border border-white/10 hover:border-[#FF5722]/50 rounded-2xl bg-[#151E30]/50 hover:bg-[#151E30] flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-white transition cursor-pointer group"
                      >
                        <div className="rounded-full bg-white/5 p-2.5 group-hover:scale-105 transition-transform">
                          <User size={22} className="text-[#FF9100]" />
                        </div>
                        <span className="text-xs font-bold text-white">
                          {isUploadingAuthor ? 'Uploading Portrait...' : 'Upload Author Photo'}
                        </span>
                        <span className="text-[10px] text-slate-500">Shows on quote cards</span>
                      </button>
                    ) : (
                      <div className="relative rounded-2xl border border-white/15 bg-[#151E30] p-3 flex items-center gap-4 group">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#FF5722]/40 shrink-0 shadow-lg">
                          <img src={authorPortraitUrl} alt="Author" className="w-full h-full object-cover" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate">Author Portrait Uploaded</p>
                          <p className="text-[10px] text-emerald-400">Quote Cards Styled</p>
                          <button
                            type="button"
                            onClick={() => authorInputRef.current?.click()}
                            className="mt-1 text-[11px] text-[#FF9100] hover:underline font-bold cursor-pointer"
                          >
                            Change Photo
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setAuthorPortraitUrl('')}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reference Images / B-Roll Imagery (Up to 20 images) */}
                <input ref={refImagesInputRef} type="file" accept="image/*" multiple onChange={handleRefImagesSelect} className="hidden" />
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-slate-200">Thematic Reference Images ({referenceImages.length}/20)</label>
                      <p className="text-[11px] text-slate-400">Diagrams, charts, or custom chapter visuals</p>
                    </div>
                    <button
                      type="button"
                      disabled={referenceImages.length >= 20 || isUploadingRef}
                      onClick={() => refImagesInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 text-xs font-bold text-orange-400 hover:bg-orange-500/20 disabled:opacity-40 transition cursor-pointer"
                    >
                      <Plus size={13} />
                      <span>{isUploadingRef ? 'Uploading...' : 'Add Images'}</span>
                    </button>
                  </div>

                  {referenceImages.length > 0 && (
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                      {referenceImages.map((url, idx) => (
                        <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/15 flex-shrink-0 group">
                          <img src={url} alt={`Ref ${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setReferenceImages(referenceImages.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 p-1 rounded-md bg-black/80 text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Book Details, Topic Category & Generate CTA */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-[28px] border border-white/10 bg-[#111827]/80 p-6 sm:p-7 space-y-5 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-xl bg-orange-500/10 p-2 text-[#FF9100] border border-orange-500/20">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-black uppercase tracking-wider text-white">Book Information</span>
                      <p className="text-[11px] text-slate-400">Powers title cards &amp; YouTube metadata</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold uppercase bg-white/5 border border-white/10 text-slate-400 px-3 py-1 rounded-full">
                    Optional
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300">Book Title</label>
                    <input
                      type="text"
                      value={bookTitle}
                      onChange={e => setBookTitle(e.target.value)}
                      placeholder="e.g. Atomic Habits, Psychology of Money"
                      className="w-full mt-1.5 rounded-xl border border-white/10 bg-[#151E30] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300">Author Name</label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={e => setAuthorName(e.target.value)}
                      placeholder="e.g. James Clear, Morgan Housel"
                      className="w-full mt-1.5 rounded-xl border border-white/10 bg-[#151E30] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Tag size={13} className="text-[#FF9100]" />
                      <span>Book Genre / Topic Category</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {TOPIC_PRESETS.map((top) => (
                        <button
                          key={top.value}
                          type="button"
                          onClick={() => setSelectedTopic(top.value)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition cursor-pointer border ${
                            selectedTopic === top.value
                              ? 'border-orange-500/50 bg-orange-500/15 text-orange-300 shadow-sm'
                              : 'border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {top.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Format Summary Card */}
              <div className="rounded-2xl border border-white/10 bg-[#151E30]/70 p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Output Aspect Ratio:</span>
                  <span className="font-black text-white flex items-center gap-1">
                    <Sparkles size={12} className="text-[#FF9100]" />
                    16:9 Landscape Widescreen
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Target Destination:</span>
                  <span className="text-slate-200">YouTube Full-Length Video</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Estimated Credit Cost:</span>
                  <span className="font-mono text-sm font-black text-[#FFA000]">
                    {calculatedCredits} Credit{calculatedCredits > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Main Call to Action: Build AI Storyboard */}
              <button
                type="button"
                onClick={handleAnalyzeAndBuildStoryboard}
                disabled={isAnalyzing || !audioUrl}
                className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-6 py-4 text-base font-black text-black shadow-xl shadow-[#FF5722]/30 transition hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles size={20} className="animate-spin text-black" />
                    <span>Analyzing Narration &amp; Building Chapters...</span>
                  </>
                ) : (
                  <>
                    <span>Generate AI Storyboard &amp; Chapters</span>
                    <ArrowRight size={20} className="stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: STORYBOARD REVIEW & EDITING */}
      {studioStep === 'storyboard' && plan && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#111827]/80 p-5">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <span>AI Storyboard &amp; Scene Timeline</span>
                <span className="text-xs font-extrabold bg-orange-500/15 border border-orange-500/30 text-orange-400 px-2.5 py-0.5 rounded-full">
                  {plan.scenes.filter(s => !s.disabled).length} Active Scenes
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review, tweak takeaway texts, or add custom key idea cards before rendering
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddKeyIdeaScene}
              className="inline-flex items-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold text-orange-400 hover:bg-orange-500/20 transition cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Key Takeaway Card</span>
            </button>
          </div>

          {/* Storyboard List */}
          <div className="space-y-3.5">
            {plan.scenes.map((scene, idx) => (
              <div
                key={scene.id || idx}
                className={`rounded-2xl border p-5 transition-all ${
                  scene.disabled
                    ? 'border-white/5 bg-[#070B14]/60 opacity-50'
                    : 'border-white/10 bg-[#111827]/90 hover:border-[#FF5722]/40'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Scene Time & Type Badge */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-black text-[#FFA000] bg-[#FF5722]/10 px-2.5 py-1 rounded-lg border border-[#FF5722]/20">
                      {formatTime(scene.startSeconds)} - {formatTime(scene.endSeconds)}
                    </span>

                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                        scene.type === 'KEY_IDEA'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : scene.type === 'LESSON_TITLE'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : scene.type === 'QUOTE'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : scene.type === 'BOOK_COVER'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-white/5 text-slate-400 border border-white/10'
                      }`}
                    >
                      {scene.type}
                    </span>

                    {scene.subtitle && (
                      <span className="text-xs text-slate-400 font-medium truncate max-w-xs">
                        {scene.subtitle}
                      </span>
                    )}
                  </div>

                  {/* Scene Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleDisableScene(scene.id)}
                      title={scene.disabled ? 'Enable Scene' : 'Disable Scene'}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      {scene.disabled ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteScene(scene.id)}
                      title="Delete Scene"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Editable Text Area */}
                {scene.type !== 'CAPTIONS' && (
                  <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Primary Headline
                      </label>
                      <input
                        type="text"
                        value={scene.text || ''}
                        onChange={e => handleUpdateSceneText(scene.id, e.target.value)}
                        placeholder="Scene Headline..."
                        className="w-full mt-1 rounded-xl border border-white/10 bg-[#151E30] px-3.5 py-2 text-sm font-bold text-white focus:border-[#FF5722] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Subtitle / Chapter Label
                      </label>
                      <input
                        type="text"
                        value={scene.subtitle || ''}
                        onChange={e => handleUpdateSceneSubtitle(scene.id, e.target.value)}
                        placeholder="e.g. Core Principle #1..."
                        className="w-full mt-1 rounded-xl border border-white/10 bg-[#151E30] px-3.5 py-2 text-sm text-slate-300 focus:border-[#FF5722] focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => setStudioStep('inputs')}
              className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold text-slate-300 hover:bg-white/10 transition cursor-pointer"
            >
              ← Back to Media Setup
            </button>

            <button
              type="button"
              onClick={handleStartFinalRender}
              disabled={isSubmittingRender}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl px-8 py-4 text-base font-black text-black shadow-xl transition-all duration-200 ${
                isSubmittingRender
                  ? "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] opacity-80 cursor-wait animate-pulse"
                  : "bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] shadow-[#FF5722]/30 hover:brightness-110 active:scale-95 cursor-pointer"
              }`}
            >
              <Film size={18} className="stroke-[2.5]" />
              <span>
                {isSubmittingRender
                  ? "Submitting Cloud Render..."
                  : `Render 1080p Widescreen Video (${calculatedCredits} Credit${calculatedCredits > 1 ? 's' : ''})`}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
