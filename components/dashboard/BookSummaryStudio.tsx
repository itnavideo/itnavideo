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
  ListOrdered,
  Download,
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

export const BookSummaryStudio: React.FC<BookSummaryStudioProps> = ({
  onStartRender,
  renderStatus,
  onResetRender,
  onRetryRender,
  onCancelRender,
}) => {
  // Step 1: Upload & Info State
  const [audioUrl, setAudioUrl] = useState<string>('');          // signed read URL (for plan API transcription)
  const [audioS3Key, setAudioS3Key] = useState<string>('');      // S3 object key (for render job mediaKey)
  const [audioFileName, setAudioFileName] = useState<string>('');
  const [bookTitle, setBookTitle] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('');
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [plan, setPlan] = useState<BookSummaryPlan | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  // M3: store words + timestampSegments from plan API response
  const [planWords, setPlanWords] = useState<unknown[]>([]);
  const [planTimestampSegments, setPlanTimestampSegments] = useState<unknown[]>([]);
  const [durationSeconds, setDurationSeconds] = useState<number>(60);
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);

  // Metadata copy states
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedChapters, setCopiedChapters] = useState(false);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const authorInputRef = useRef<HTMLInputElement>(null);
  const refImagesInputRef = useRef<HTMLInputElement>(null);

  // ─── M1: Upload audio via /api/media/presign → direct S3 PUT ──────────────
  // Returns the S3 key (used as mediaKey for the render job).
  // Also returns the signed read URL for the plan-book-summary transcription call.
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

    // presign.key is the S3 object key; presign.uploadUrl is the signed PUT URL
    // We need a signed read URL for the plan API to fetch the audio
    return { key: presign.key, readUrl: presign.uploadUrl.split('?')[0] };
  };

  // ─── M2: Upload images via /api/media/cloudinary-upload ─────────────────────
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

  const handleAudioSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInputError(null);
    setIsUploadingAudio(true);
    try {
      const { key, readUrl } = await uploadAudioToS3(file);
      // Store the S3 key for the render job (mediaKey) and a usable URL for the plan API
      setAudioUrl(readUrl);      // used by plan-book-summary to transcribe
      setAudioS3Key(key);        // used by render job as mediaKey
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

  // 2. Step 1 -> Step 2: Run Storyboard Analysis API
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
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to generate storyboard plan.');
      }

      const data = await res.json();
      setPlan(data.plan);
      setTranscript(data.transcript);
      // M3: store words + timestampSegments so they can be sent with the render job
      setPlanWords(Array.isArray(data.words) ? data.words : []);
      setPlanTimestampSegments(Array.isArray(data.timestampSegments) ? data.timestampSegments : []);
      setDurationSeconds(data.durationSeconds);
      setStudioStep('storyboard');
    } catch (err: any) {
      setInputError(err?.message || 'Error creating AI Storyboard plan. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Storyboard editing functions
  const handleUpdateSceneText = (sceneId: string, newText: string) => {
    if (!plan) return;
    setPlan({
      ...plan,
      scenes: plan.scenes.map(s => s.id === sceneId ? { ...s, text: newText } : s),
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
    const lastScene = plan.scenes[plan.scenes.length - 1];
    const start = lastScene ? Math.min(durationSeconds - 3, lastScene.endSeconds + 2) : 10;
    const newScene: BookSummaryScene = {
      id: `scene-custom-${Date.now()}`,
      type: 'KEY_IDEA',
      startSeconds: Math.max(0, start),
      endSeconds: Math.min(durationSeconds, start + 3.5),
      text: 'New Key Takeaway Idea',
      subtitle: 'Key Insight',
    };
    setPlan({
      ...plan,
      scenes: [...plan.scenes, newScene].sort((a, b) => a.startSeconds - b.startSeconds),
    });
  };

  // 3. Step 2 -> Step 3: Trigger Final Video Render Job
  const handleStartFinalRender = () => {
    if (!plan || !onStartRender) return;

    setStudioStep('rendering');
    onStartRender({
      mode: 'bookSummary',
      template: 'BOOK_SUMMARY',
      // M4: send S3 key as mediaKey (render job resolves it via createReadUrl)
      // audioUrl is used as fallback mediaUrl for the plan API only
      audioUrl,
      audioS3Key,
      durationSeconds,
      bookTitle,
      authorName,
      bookCoverUrl,
      authorPortraitUrl,
      referenceImages,
      scenes: plan.scenes.filter(s => !s.disabled),
      metadata: plan.metadata,
      captionsTheme: 'glow-viral',
      // M3+M4: include words + segments so render job can build word-level captions
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

  // Render active status view if rendering
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

        {/* Ready State: Metadata & Chapter Exposures (Correction 15 & 16) */}
        {renderStatus.state === 'ready' && plan?.metadata && (
          <div className="rounded-[28px] border border-white/10 bg-[#0E1526]/90 p-8 space-y-6 shadow-2xl shadow-[#FF6D00]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#FF6D00]/10 border border-[#FF6D00]/30 p-2 text-[#FF9100]">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">YouTube & Social Publishing Metadata</h3>
                  <p className="text-xs text-slate-400">Auto-generated metadata, chapters, and takeaways</p>
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
                <div className="space-y-2">
                  {plan.metadata.chapters.map((chap, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-slate-200">
                      <span className="font-mono text-xs font-bold text-[#FFA726] bg-[#FF6D00]/10 px-2 py-1 rounded-md border border-[#FF6D00]/20">
                        {chap.timestamp}
                      </span>
                      <span className="font-medium">{chap.title}</span>
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
    <div className="relative rounded-[28px] border border-white/10 bg-[#111218] p-5 sm:p-7 shadow-2xl min-w-0 max-w-full overflow-x-hidden space-y-7 text-white">
      {/* Magic UI BorderBeam Glowing Effect */}
      <BorderBeam size={280} duration={14} colorFrom="#FF6D00" colorTo="#FFA726" />
      {/* Studio Stage Stepper Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0E1526]/80 p-4 sm:p-5 backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] p-2.5 text-black shadow-lg shadow-[#FF6D00]/20">
            <BookOpen size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-black text-white truncate">Book Summary Video Studio</h2>
            <p className="text-[11px] sm:text-xs text-slate-400 leading-tight">1080p Widescreen • Structured AI Storyboard • 20 Credits</p>
          </div>
        </div>

        {/* Step Indicator Pills */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setStudioStep('inputs')}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              studioStep === 'inputs'
                ? 'bg-[#FF6D00] text-black font-black shadow-md shadow-[#FF6D00]/20'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            1. Media &amp; Info
          </button>
          <span className="text-slate-600">/</span>
          <button
            type="button"
            disabled={!plan}
            onClick={() => plan && setStudioStep('storyboard')}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              studioStep === 'storyboard'
                ? 'bg-[#FF6D00] text-black font-black shadow-md shadow-[#FF6D00]/20'
                : 'bg-white/5 text-slate-400 disabled:opacity-40'
            }`}
          >
            2. Storyboard Review
          </button>
        </div>
      </div>

      {/* Process Workflow Roadmap (Full Width Standalone Block) */}
      <StudioWorkflowRoadmap mode="bookSummary" />

      {/* Input Error Callout */}
      {inputError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 flex items-center gap-3 text-red-400 text-sm font-bold">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{inputError}</span>
        </div>
      )}

      {/* STAGE 1: MEDIA & BOOK INFO INPUTS */}
      {studioStep === 'inputs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Media Uploads */}
          <div className="space-y-6">
            {/* 1. Required Spoken Audio Narration */}
            <div className="rounded-[28px] border border-white/10 bg-[#0E1526]/90 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic size={18} className="text-[#FF9100]" />
                  <span className="text-sm font-black uppercase tracking-wider text-white">Audio Narration</span>
                </div>
                <span className="text-[11px] font-extrabold uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full">
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
                  className="w-full h-36 border-2 border-dashed border-white/15 hover:border-[#FF6D00]/50 rounded-2xl bg-[#151E30]/50 hover:bg-[#151E30] transition flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-white"
                >
                  <UploadCloud size={32} className="text-[#FF9100]" />
                  <div className="text-center">
                    <p className="text-sm font-bold">Click to upload narration audio</p>
                    <p className="text-xs text-slate-500 mt-1">MP3, WAV, M4A, or MP4 audio</p>
                  </div>
                </button>
              ) : (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-emerald-400" />
                    <div>
                      <p className="text-sm font-bold text-white truncate max-w-xs">{audioFileName || 'Audio uploaded'}</p>
                      <p className="text-xs text-emerald-400">Ready for Groq Whisper transcription</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setAudioUrl(''); setAudioS3Key(''); setAudioFileName(''); }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* 2. Media Assets (Book Cover, Author Portrait, Reference Images - At least 1 image required) */}
            <div className="rounded-[28px] border border-white/10 bg-[#0E1526]/90 p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImagePlus size={18} className="text-[#FF9100]" />
                  <span className="text-sm font-black uppercase tracking-wider text-white">Visual Assets</span>
                </div>
                <span className="text-[11px] font-extrabold uppercase bg-[#FF6D00]/15 border border-[#FF6D00]/30 text-[#FF9100] px-2.5 py-1 rounded-full">
                  At Least 1 Image Required
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Book Cover */}
                <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverSelect} className="hidden" />
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Book Cover (Optional)</label>
                  {!bookCoverUrl ? (
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      disabled={isUploadingCover}
                      className="w-full h-24 border border-white/10 hover:border-[#FF6D00]/40 rounded-xl bg-[#151E30] flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-white text-xs font-bold transition"
                    >
                      <ImagePlus size={18} className="text-[#FF9100]" />
                      <span>Upload Cover</span>
                    </button>
                  ) : (
                    <div className="relative h-24 rounded-xl overflow-hidden border border-white/15 group">
                      <img src={bookCoverUrl} alt="Cover" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setBookCoverUrl('')}
                        className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/80 text-white opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Author Portrait */}
                <input ref={authorInputRef} type="file" accept="image/*" onChange={handleAuthorSelect} className="hidden" />
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Author Portrait (Optional)</label>
                  {!authorPortraitUrl ? (
                    <button
                      type="button"
                      onClick={() => authorInputRef.current?.click()}
                      disabled={isUploadingAuthor}
                      className="w-full h-24 border border-white/10 hover:border-[#FF6D00]/40 rounded-xl bg-[#151E30] flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-white text-xs font-bold transition"
                    >
                      <User size={18} className="text-[#FF9100]" />
                      <span>Upload Portrait</span>
                    </button>
                  ) : (
                    <div className="relative h-24 rounded-xl overflow-hidden border border-white/15 group">
                      <img src={authorPortraitUrl} alt="Author" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setAuthorPortraitUrl('')}
                        className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/80 text-white opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Reference Images (Up to 20 images) */}
              <input ref={refImagesInputRef} type="file" accept="image/*" multiple onChange={handleRefImagesSelect} className="hidden" />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">Reference Images ({referenceImages.length}/20)</label>
                  <button
                    type="button"
                    disabled={referenceImages.length >= 20}
                    onClick={() => refImagesInputRef.current?.click()}
                    className="text-xs font-bold text-[#FF9100] hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer"
                  >
                    + Add Images (Up to 20)
                  </button>
                </div>
                {referenceImages.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {referenceImages.map((url, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 group">
                        <img src={url} alt={`Ref ${idx}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => setReferenceImages(referenceImages.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 p-0.5 rounded bg-black/80 text-white opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Book Details */}
          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-[#0E1526]/90 p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-[#FF9100]" />
                  <span className="text-sm font-black uppercase tracking-wider text-white">Book & Author Details</span>
                </div>
                <span className="text-[11px] font-extrabold uppercase bg-white/5 border border-white/10 text-slate-400 px-2.5 py-1 rounded-full">
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
                    placeholder="e.g. Atomic Habits"
                    className="w-full mt-1.5 rounded-xl border border-white/10 bg-[#151E30] px-4 py-3 text-sm text-white focus:border-[#FF6D00] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Author Name</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={e => setAuthorName(e.target.value)}
                    placeholder="e.g. James Clear"
                    className="w-full mt-1.5 rounded-xl border border-white/10 bg-[#151E30] px-4 py-3 text-sm text-white focus:border-[#FF6D00] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Stage 1 CTA Button */}
            <button
              onClick={handleAnalyzeAndBuildStoryboard}
              disabled={isAnalyzing || !audioUrl}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-6 py-4 text-base font-black text-black shadow-lg shadow-[#FF6D00]/25 transition hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles size={18} className="animate-spin" />
                  <span>Analyzing Narration & Building Storyboard...</span>
                </>
              ) : (
                <>
                  <span>Build AI Storyboard</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: STORYBOARD REVIEW & EDITING (Correction 11) */}
      {studioStep === 'storyboard' && plan && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-white">AI Storyboard Review</h3>
              <p className="text-xs text-slate-400">Review, edit key ideas, or remove scenes before rendering</p>
            </div>
            <button
              onClick={handleAddKeyIdeaScene}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#151E30] px-4 py-2 text-xs font-bold text-[#FF9100] hover:bg-[#1C2840] transition"
            >
              <Plus size={14} />
              <span>Add Key Idea Scene</span>
            </button>
          </div>

          {/* Storyboard List */}
          <div className="space-y-4">
            {plan.scenes.map((scene, idx) => (
              <div
                key={scene.id || idx}
                className={`rounded-2xl border p-5 transition ${
                  scene.disabled
                    ? 'border-white/5 bg-[#070B14]/60 opacity-50'
                    : 'border-white/10 bg-[#0E1526] hover:border-[#FF6D00]/40'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Scene Time & Type Badge */}
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#FFA726] bg-[#FF6D00]/10 px-2.5 py-1 rounded-md border border-[#FF6D00]/20">
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

                    {scene.assetType && (
                      <span className="text-[10px] text-slate-400 font-bold bg-white/5 px-2 py-0.5 rounded">
                        Asset: {scene.assetType}
                      </span>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleDisableScene(scene.id)}
                      title={scene.disabled ? 'Enable Scene' : 'Disable Scene'}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                    >
                      {scene.disabled ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      onClick={() => handleDeleteScene(scene.id)}
                      title="Delete Scene"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Editable Text Area */}
                {scene.type !== 'CAPTIONS' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={scene.text || ''}
                      onChange={e => handleUpdateSceneText(scene.id, e.target.value)}
                      placeholder="Scene Text..."
                      className="w-full rounded-xl border border-white/10 bg-[#151E30] px-4 py-2.5 text-sm font-bold text-white focus:border-[#FF6D00] focus:outline-none"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={() => setStudioStep('inputs')}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-300 hover:bg-white/10 transition"
            >
              Back to Inputs
            </button>

            <button
              onClick={handleStartFinalRender}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-8 py-4 text-base font-black text-black shadow-lg shadow-[#FF6D00]/25 transition hover:brightness-110 active:scale-95"
            >
              <Film size={18} />
              <span>Generate Video (20 Credits)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
