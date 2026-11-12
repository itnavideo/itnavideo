'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Copy,
  Check,
  Plus,
  ArrowRight,
  AlertCircle,
  Clock,
  FileText,
  Volume2,
  VolumeX,
  Tag,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Lock,
  Play,
  Pause,
  Music,
  Type,
  RotateCcw,
  Sliders,
  Upload,
  Edit3,
  Save,
  CheckCheck,
  Headphones,
  Search,
  X,
  Settings2,
  Download,
} from 'lucide-react';
import { WatermarkRemoverToggle } from "@/components/dashboard/WatermarkRemoverToggle";
import {
  AWS_BGM_TRACKS,
  getBgmTrackAudioUrl,
  THIRTY_TWO_CAPTION_STYLES,
  STYLE_PREVIEW_WORDS,
  renderPreviewCaptionWords,
  type LibraryBgmTrack,
} from "@/components/dashboard/ImageToVideoStudio";
import { BookSummaryPlan, BookSummaryScene } from '@/services/ai/bookSummaryPlanner';
import { MASTER_THEMES, type VideoVisualTheme } from "@/services/design/visualDesignSystem";

interface BookSummaryStudioProps {
  onStartRender?: (payload: any) => void;
  renderStatus?: any;
  onResetRender?: () => void;
  onRetryRender?: () => void;
  onCancelRender?: () => void;
  removeAiWatermark?: boolean;
  onRemoveAiWatermarkChange?: (enabled: boolean) => void;
  visualTheme?: string;
  onVisualThemeChange?: (themeId: string) => void;
}

const TOPIC_PRESETS = [
  { label: '📚 Wealth & Compounding', value: 'wealth' },
  { label: '⚡ Habits & Productivity', value: 'habits' },
  { label: '🧠 Mindset & Psychology', value: 'psychology' },
  { label: '🚀 Business & Leadership', value: 'business' },
  { label: '🎯 Philosophy & Focus', value: 'philosophy' },
];

export const BOOK_SUMMARY_STEPS = [
  { step: 1, title: 'Upload', desc: 'Audio & Book Details' },
  { step: 2, title: 'Music', desc: 'Soundtrack & Volume' },
  { step: 3, title: 'Style', desc: 'Captions & Theme' },
] as const;

// 32 Sound Wave visualizer bars
const WAVE_BARS = [
  25, 45, 65, 30, 85, 95, 40, 70, 55, 80, 100, 60, 45, 90, 75, 35,
  60, 85, 50, 95, 70, 40, 65, 80, 55, 90, 45, 70, 85, 35, 60, 40
];

export const BookSummaryStudio: React.FC<BookSummaryStudioProps> = ({
  onStartRender,
  renderStatus,
  onResetRender,
  onRetryRender,
  onCancelRender,
  removeAiWatermark = true,
  onRemoveAiWatermarkChange,
  visualTheme = 'editorial-minimal',
  onVisualThemeChange,
}) => {
  // ── Flexible Step State (supports any number of steps) ──
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [activeVisualTheme, setActiveVisualTheme] = useState<string>(visualTheme || 'editorial-minimal');
  const [bookNotesText, setBookNotesText] = useState<string>('');

  useEffect(() => {
    if (visualTheme) {
      setActiveVisualTheme(visualTheme);
    }
  }, [visualTheme]);

  // Step 1: Upload & Info State (Strictly 16:9 Cinema Landscape, max 5 min / 300s)
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [audioS3Key, setAudioS3Key] = useState<string>('');
  const [audioFileName, setAudioFileName] = useState<string>('');
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string>('');
  const [bookTitle, setBookTitle] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('wealth');

  // Audio Playback
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Background Music State (Default Volume = 12%)
  const [selectedBgmTrack, setSelectedBgmTrack] = useState<string>(AWS_BGM_TRACKS[0].path);
  const [bgmCategory, setBgmCategory] = useState<string>('All');
  const [bgmVolume, setBgmVolume] = useState<number>(12); // Default 12%
  const [playingBgmId, setPlayingBgmId] = useState<string | null>(null);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);
  const [autoDucking, setAutoDucking] = useState<boolean>(true);

  // Caption Theme State (32 Options)
  const [selectedCaptionTheme, setSelectedCaptionTheme] = useState<string>('pop-word');
  const [captionCategory, setCaptionCategory] = useState<string>('All');
  const [captionSearch, setCaptionSearch] = useState<string>('');
  const [hoveredStyleId, setHoveredStyleId] = useState<string | null>(null);
  const [previewWordStep, setPreviewWordStep] = useState<number>(0);

  // Images & Visuals
  const [bookCoverFile, setBookCoverFile] = useState<File | null>(null);
  const [bookCoverUrl, setBookCoverUrl] = useState<string>('');
  const [authorPortraitUrl, setAuthorPortraitUrl] = useState<string>('');
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [inputError, setInputError] = useState<string | null>(null);

  // Uploading flags
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Step 4: Storyboard & AI Plan State
  const [plan, setPlan] = useState<BookSummaryPlan | null>(null);
  const [copiedTimestamps, setCopiedTimestamps] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [editableTranscript, setEditableTranscript] = useState<string>('');
  const [planWords, setPlanWords] = useState<unknown[]>([]);
  const [planTimestampSegments, setPlanTimestampSegments] = useState<unknown[]>([]);
  const [durationSeconds, setDurationSeconds] = useState<number>(60);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);

  // Refs
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Periodic Word Animation Loop for Caption Cards (Step 3)
  useEffect(() => {
    const timer = setInterval(() => {
      setPreviewWordStep((prev) => (prev + 1) % 3);
    }, 700);
    return () => clearInterval(timer);
  }, []);

  // Rule 4.1 Credit Calculation: 1 Min = 1 Credit (1m=1, 2m=2, 3m=3, 4m=4, 5m=5 Cr)
  const effectiveDuration = audioDuration > 0 ? audioDuration : (durationSeconds || 60);
  const calculatedCredits = Math.max(1, Math.min(5, Math.ceil(effectiveDuration / 60)));

  // Instant Sample Demo Filler
  const handleLoadSampleDemo = () => {
    setBookTitle('Atomic Habits');
    setAuthorName('James Clear');
    setSelectedTopic('habits');
    setAudioUrl('/assets/reusable/testing1.mp3');
    setAudioPreviewUrl('/assets/reusable/testing1.mp3');
    setAudioFileName('atomic-habits-narration-sample.mp3');
    setAudioDuration(45);
    setDurationSeconds(45);
    setBookCoverUrl('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80');
    setInputError(null);
  };

  // Handle Voiceover Audio Selection
  const handleAudioSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|m4a|aac|ogg|mp4)$/i)) {
      setInputError('Please upload a valid voiceover audio file (MP3, WAV, M4A, AAC).');
      return;
    }

    setAudioFile(file);
    setAudioFileName(file.name);
    setInputError(null);
    setIsUploadingAudio(true);

    try {
      const localUrl = URL.createObjectURL(file);
      setAudioPreviewUrl(localUrl);

      // Measure audio duration
      const audioEl = new Audio();
      audioEl.src = localUrl;
      audioEl.onloadedmetadata = () => {
        const d = Math.round(audioEl.duration);
        if (d > 300) {
          setInputError('Audio exceeds maximum limit of 5 minutes (300s). Please upload a shorter clip.');
          setIsUploadingAudio(false);
          return;
        }
        setAudioDuration(d);
        setDurationSeconds(d);
      };

      // Upload to server/S3
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);

      const res = await fetch('/api/reels/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setAudioUrl(data.audioUrl || localUrl);
        setTranscript(data.transcript || '');
        setEditableTranscript(data.transcript || '');
        setPlanWords(Array.isArray(data.words) ? data.words : []);
        setPlanTimestampSegments(Array.isArray(data.segments) ? data.segments : []);
      } else {
        setAudioUrl(localUrl);
      }
    } catch (err: any) {
      console.warn('Audio analysis warning:', err);
      setAudioUrl(URL.createObjectURL(file));
    } finally {
      setIsUploadingAudio(false);
    }
  };

  // Handle Book Cover Selection
  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setInputError('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setBookCoverFile(file);
    const localUrl = URL.createObjectURL(file);
    setBookCoverUrl(localUrl);
    setInputError(null);
  };

  // Handle Toggle Audio Play/Pause
  const togglePlayAudio = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.play().catch(() => { });
      setIsPlayingAudio(true);
    }
  };

  // Handle Toggle BGM Auditioning
  const handleTogglePlayBgm = (track: LibraryBgmTrack) => {
    if (track.id === 'none') {
      if (bgmAudioRef.current) bgmAudioRef.current.pause();
      setPlayingBgmId(null);
      setSelectedBgmTrack('none');
      return;
    }

    if (playingBgmId === track.id) {
      if (bgmAudioRef.current) bgmAudioRef.current.pause();
      setPlayingBgmId(null);
    } else {
      if (bgmAudioRef.current) bgmAudioRef.current.pause();
      const audioUrl = getBgmTrackAudioUrl(track.path);
      const audio = new Audio(audioUrl);
      audio.volume = bgmVolume / 100;
      audio.onended = () => setPlayingBgmId(null);
      audio.play().catch((e) => console.warn('BGM play warning:', e));
      bgmAudioRef.current = audio;
      setPlayingBgmId(track.id);
      setSelectedBgmTrack(track.path);
    }
  };

  // Clean up BGM audio on unmount
  useEffect(() => {
    return () => {
      if (bgmAudioRef.current) bgmAudioRef.current.pause();
    };
  }, []);

  // Filtered BGM tracks
  const filteredBgmTracks = useMemo(() => {
    return AWS_BGM_TRACKS.filter((t) => {
      if (bgmCategory !== 'All' && t.category !== bgmCategory) return false;
      return true;
    });
  }, [bgmCategory]);

  // Filtered Caption Styles
  const filteredCaptionStyles = useMemo(() => {
    return THIRTY_TWO_CAPTION_STYLES.filter((style) => {
      if (captionCategory !== 'All' && style.category !== captionCategory) return false;
      if (captionSearch.trim()) {
        const q = captionSearch.toLowerCase().trim();
        return (
          style.name.toLowerCase().includes(q) ||
          (style.desc && style.desc.toLowerCase().includes(q)) ||
          (style.category && style.category.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [captionCategory, captionSearch]);

  // Generate AI Storyboard Plan if needed
  const handleGeneratePlan = async () => {
    if (!audioUrl) {
      setInputError('Audio narration file is required to create a Book Summary Video.');
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
          bookTitle: bookTitle || 'Keynote Book Summary',
          authorName,
          bookCoverUrl: bookCoverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
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
      if (data.transcript && !editableTranscript) {
        setTranscript(data.transcript);
        setEditableTranscript(data.transcript);
      }
      if (data.words) setPlanWords(data.words);
      if (data.timestampSegments) setPlanTimestampSegments(data.timestampSegments);
      setCurrentStep(4);
    } catch (err: any) {
      // Fallback default chapters if LLM fails
      const fallbackChapters: BookSummaryScene[] = [
        {
          id: 'ch-1',
          sceneType: 'title_hook',
          sceneIndex: 0,
          startTimeSeconds: 0,
          endTimeSeconds: 15,
          durationSeconds: 15,
          chapterNumber: 1,
          chapterTitle: 'The Core Premise',
          text: bookTitle ? `Key ideas and takeaways from ${bookTitle}` : 'Core foundational insights that drive outsized results',
          subtitle: authorName ? `By ${authorName}` : 'Executive Masterclass',
          visualType: 'book_cover_hero',
        },
        {
          id: 'ch-2',
          sceneType: 'core_principle',
          sceneIndex: 1,
          startTimeSeconds: 15,
          endTimeSeconds: 30,
          durationSeconds: 15,
          chapterNumber: 2,
          chapterTitle: 'The Compounding Effect',
          text: 'Small daily adjustments produce massive long-term transformations.',
          subtitle: 'Systemic Advantage',
          visualType: 'bullet_hierarchy',
        },
      ];
      setPlan({
        bookTitle: bookTitle || 'Book Summary',
        authorName: authorName || 'Featured Author',
        topic: selectedTopic,
        scenes: fallbackChapters,
        durationSeconds: audioDuration || 60,
      });
      setCurrentStep(4);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Launch Cloud Render
  const handleSubmitRender = () => {
    if (!onStartRender) return;
    if (!audioUrl) {
      setInputError('Audio narration file is required.');
      return;
    }

    const currentScenes = plan?.scenes && plan.scenes.length > 0 ? plan.scenes : [
      {
        id: 'scene-1',
        sceneType: 'title_hook' as const,
        sceneIndex: 0,
        startTimeSeconds: 0,
        endTimeSeconds: audioDuration || 60,
        durationSeconds: audioDuration || 60,
        chapterNumber: 1,
        chapterTitle: bookTitle || 'Core Summary',
        text: editableTranscript.slice(0, 120) || 'Transformational insights from the book',
        subtitle: authorName || 'Masterclass',
        visualType: 'book_cover_hero' as const,
      }
    ];

    onStartRender({
      mode: 'bookSummary',
      template: 'BOOK_SUMMARY',
      audioUrl,
      audioS3Key,
      durationSeconds: audioDuration || durationSeconds || 60,
      bookTitle: bookTitle || 'Book Summary',
      authorName,
      bookCoverUrl: bookCoverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      authorPortraitUrl,
      referenceImages,
      scenes: currentScenes,
      captionsTheme: selectedCaptionTheme,
      bgmUrl: selectedBgmTrack === 'none' ? 'none' : selectedBgmTrack,
      bgmVolume: selectedBgmTrack === 'none' ? 0 : bgmVolume / 100,
      aspectRatio: '16:9',
      transcript: editableTranscript || transcript,
      words: planWords,
      timestampSegments: planTimestampSegments,
      removeAiWatermark,
      visualTheme: activeVisualTheme,
      bookNotes: bookNotesText,
    });
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentChapters = plan?.scenes || [];
  const activeChapter = currentChapters[activeChapterIndex] || currentChapters[0] || {
    chapterTitle: 'The Big Idea',
    text: 'Key takeaways and transformational quotes from the book',
    subtitle: 'Chapter Overview',
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-white text-slate-900 select-text font-sans">
      {/* Hidden Audio Players */}
      {audioPreviewUrl && (
        <audio
          ref={audioPlayerRef}
          src={audioPreviewUrl}
          onTimeUpdate={() => {
            if (audioPlayerRef.current) {
              setAudioCurrentTime(audioPlayerRef.current.currentTime);
            }
          }}
          onEnded={() => setIsPlayingAudio(false)}
        />
      )}

      {/* Hidden File Inputs */}
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*,video/mp4"
        onChange={handleAudioSelect}
        className="hidden"
      />
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        onChange={handleCoverSelect}
        className="hidden"
      />

      {/* ========================================================================= */}
      {/* ROW 1: 4-STEP GUIDED STEPPER BAR (Unified Studio Stepper)                  */}
      {/* ========================================================================= */}
      <header className="shrink-0 border-b border-slate-200/90 bg-white/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          {/* Desktop Stepper (>=1024px) */}
          <nav aria-label="Studio Steps" className="hidden lg:flex items-center gap-2 lg:gap-3">
            {BOOK_SUMMARY_STEPS.map((s, idx) => {
              const isCompleted = s.step < currentStep;
              const isActive = s.step === currentStep;

              return (
                <React.Fragment key={s.step}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(s.step)}
                    className="group flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer hover:bg-slate-50/80 active:scale-98"
                  >
                    {/* Circle */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black transition-all ${isCompleted
                        ? "bg-emerald-500 text-white shadow-xs shadow-emerald-500/25 ring-2 ring-emerald-500/20"
                        : isActive
                          ? "bg-white border-2 border-orange-500 text-orange-600 shadow-[0_0_0_4px_rgba(249,115,22,0.14)] font-black"
                          : "bg-slate-100 border border-slate-200 text-slate-400 group-hover:border-slate-300"
                        }`}
                    >
                      {isCompleted ? <Check size={14} className="stroke-[3]" /> : s.step}
                    </div>

                    {/* Label */}
                    <div className="text-left hidden xl:block">
                      <p
                        className={`text-xs font-black leading-tight ${isActive
                          ? "text-slate-900"
                          : isCompleted
                            ? "text-emerald-700"
                            : "text-slate-400"
                          }`}
                      >
                        {s.title}
                      </p>
                      <p className="text-[10px] text-slate-400 leading-tight">{s.desc}</p>
                    </div>
                  </button>

                  {/* Connecting Line */}
                  {idx < BOOK_SUMMARY_STEPS.length - 1 && (
                    <div
                      className={`h-0.5 w-6 lg:w-8 rounded-full transition-colors ${s.step < currentStep ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Tablet & Mobile Stepper Bar (<1024px) */}
        <div className="lg:hidden mt-3 pt-2.5 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-black text-slate-900 truncate">
              <span className="text-orange-600 shrink-0">Step {currentStep} of 4:</span>
              <span className="truncate">{BOOK_SUMMARY_STEPS[currentStep - 1].title}</span>
              <span className="text-slate-400 font-normal hidden sm:inline">
                · {BOOK_SUMMARY_STEPS[currentStep - 1].desc}
              </span>
            </div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (Math.max(1, prev - 1)))}
                className="text-[11px] font-bold text-orange-600 hover:text-orange-700 cursor-pointer shrink-0 ml-2"
              >
                ← Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 w-full">
            {BOOK_SUMMARY_STEPS.map((s) => {
              const isDone = s.step < currentStep;
              const isCurrent = s.step === currentStep;
              return (
                <div
                  key={s.step}
                  onClick={() => setCurrentStep(s.step)}
                  className={`h-1.5 flex-1 rounded-full transition-all cursor-pointer hover:opacity-80 ${isDone
                    ? "bg-emerald-500 shadow-xs"
                    : isCurrent
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 shadow-xs"
                      : "bg-slate-200"
                    }`}
                  title={`Step ${s.step}: ${s.title}`}
                />
              );
            })}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* ROW 2: ACTIVE STEP CONTENT REGION (Internal scroll with smooth clearance)  */}
      {/* ========================================================================= */}
      <main className="flex-1 overflow-y-auto overscroll-contain scroll-smooth px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 sm:pb-32 w-full">
        {/* Global Error Banner */}
        {inputError && (
          <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 shadow-xs">
            <div className="flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0 text-red-600" />
              <span>{inputError}</span>
            </div>
            <button
              onClick={() => setInputError(null)}
              className="text-xs text-red-600 hover:text-red-800 underline font-semibold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 1: UPLOAD (Voiceover Audio & Book Details)                          */}
        {/* ======================================================================= */}
        {currentStep === 1 && (
          <div className="max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                1. Upload your book summary audio &amp; details
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Upload your spoken book review voiceover to calculate chapter timings, then specify book title, author, and cover.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Main Media Upload Card (Col 8) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="rounded-[28px] sm:rounded-[32px] border-2 border-orange-500/30 bg-gradient-to-b from-orange-50/20 via-white to-white p-4 sm:p-8 shadow-sm space-y-4 sm:space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-md shadow-orange-500/25 shrink-0">
                        <Mic size={20} className="stroke-[2.5]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                            Spoken Book Narration
                          </h2>
                          <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-wider">
                            Required
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Your spoken voiceover explaining the book chapters and key takeaways
                        </p>
                      </div>
                    </div>

                    {audioUrl && (
                      <span className="inline-flex items-center self-start sm:self-auto gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-mono font-bold shadow-xs">
                        <Check size={13} className="stroke-[3]" />
                        <span>{formatTime(audioDuration)} · {calculatedCredits} Cr</span>
                      </span>
                    )}
                  </div>

                  {/* Dropzone */}
                  {!audioUrl ? (
                    <div
                      onClick={() => !isUploadingAudio && audioInputRef.current?.click()}
                      className="group relative flex flex-col items-center justify-center rounded-[24px] sm:rounded-[28px] border-2 border-dashed border-orange-300 hover:border-orange-500 bg-white hover:bg-orange-50/40 min-h-[200px] sm:min-h-[240px] p-5 sm:p-10 text-center transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-orange-100 group-hover:bg-orange-500 text-orange-600 group-hover:text-white transition-all duration-200 shadow-sm mb-3 sm:mb-4">
                        <UploadCloud size={28} className="stroke-[2.5]" />
                      </div>

                      <p className="text-sm sm:text-lg font-black text-slate-900 mb-1">
                        Drop your book narration audio here, or{" "}
                        <span className="text-orange-600 underline underline-offset-4">Browse File</span>
                      </p>

                      <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm leading-relaxed mb-3 sm:mb-4">
                        Supports MP3, WAV, M4A, AAC · Maximum 5 Minutes (300s) · Millisecond Speech Sync
                      </p>

                      <div className="flex flex-wrap items-center justify-center gap-2.5">
                        <div className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-black text-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold transition shadow-sm">
                          <Upload size={14} />
                          <span>Select Narration Audio</span>
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoadSampleDemo();
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-xs font-bold text-orange-600 px-3.5 py-2 sm:py-2.5 transition shadow-2xs"
                        >
                          <Sparkles size={13} />
                          <span>Try Sample Demo (Atomic Habits)</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl sm:rounded-3xl border-2 border-orange-300/80 bg-gradient-to-b from-orange-50/40 via-white to-white p-4 sm:p-6 shadow-xs space-y-4">
                      {/* Audio Info Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/25">
                            <Headphones size={22} className="stroke-[2.5]" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-black text-slate-900 truncate max-w-[200px] sm:max-w-xs">
                                {audioFileName || 'Book Narration'}
                              </p>
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider shrink-0">
                                Verified
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Duration: <strong className="text-slate-900 font-bold">{formatTime(audioDuration)}</strong> · 16:9 Landscape Widescreen
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => audioInputRef.current?.click()}
                            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition cursor-pointer shadow-xs"
                          >
                            Replace Audio
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAudioUrl('');
                              setAudioFile(null);
                            }}
                            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer shadow-xs"
                            title="Remove audio"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Waveform Visualizer & Audio Controls */}
                      <div className="space-y-2 pt-2">
                        <div className="relative flex items-center justify-between gap-0.5 sm:gap-1 h-14 sm:h-16 w-full px-2.5 sm:px-3 py-2 rounded-2xl bg-slate-50/80 border border-slate-200/80 select-none shadow-inner">
                          {WAVE_BARS.map((barHeight, idx) => {
                            const totalBars = WAVE_BARS.length;
                            const barPct = (idx / (totalBars - 1)) * 100;
                            const currentPct = audioDuration > 0 ? (audioCurrentTime / audioDuration) * 100 : 0;
                            const isPlayed = barPct <= currentPct;
                            return (
                              <div key={idx} className="flex-1 flex items-center justify-center h-full">
                                <div
                                  style={{ height: `${barHeight}%` }}
                                  className={`w-full max-w-[4px] sm:max-w-[6px] rounded-full transition-all duration-150 ${isPlayed
                                    ? "bg-gradient-to-t from-orange-600 to-amber-500 shadow-2xs"
                                    : "bg-slate-200"
                                    }`}
                                />
                              </div>
                            );
                          })}
                        </div>

                        {/* Scrubber Bar */}
                        <div className="flex items-center justify-between gap-3 px-1 pt-1">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={togglePlayAudio}
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-md shadow-orange-500/25 active:scale-95 transition cursor-pointer"
                            >
                              {isPlayingAudio ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                            </button>

                            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-700">
                              <span>{formatTime(audioCurrentTime)}</span>
                              <span className="text-slate-400">/</span>
                              <span>{formatTime(audioDuration)}</span>
                            </div>
                          </div>

                          <div className="flex-1 max-w-xs hidden sm:block">
                            <input
                              type="range"
                              min="0"
                              max={audioDuration || 60}
                              step="0.1"
                              value={audioCurrentTime}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setAudioCurrentTime(val);
                                if (audioPlayerRef.current) audioPlayerRef.current.currentTime = val;
                              }}
                              className="w-full accent-orange-500 cursor-pointer"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (audioPlayerRef.current) {
                                audioPlayerRef.current.muted = !isAudioMuted;
                                setIsAudioMuted(!isAudioMuted);
                              }
                            }}
                            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                          >
                            {isAudioMuted ? <VolumeX size={16} className="text-red-500" /> : <Volume2 size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* AI Speech Transcription Status Banner */}
                      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 text-emerald-900 font-bold min-w-0">
                          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                          <span className="truncate">
                            Speech Transcribed &amp; Chapter Detection Ready (Groq Whisper Cloud AI)
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-md shrink-0">
                          1080p Cinema Widescreen
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Editable Transcript Review Box */}
                  {audioUrl && (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-orange-600" />
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                            Book Transcript &amp; Dialogue Review
                          </h3>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500 font-bold">
                          {editableTranscript.trim().split(/\s+/).filter(Boolean).length} Words
                        </span>
                      </div>

                      <textarea
                        rows={4}
                        value={editableTranscript}
                        onChange={(e) => setEditableTranscript(e.target.value)}
                        placeholder="Spoken transcript from your audio appears here. You can edit any sentence to correct book quotes and author insights..."
                        className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 leading-relaxed font-sans resize-none shadow-2xs"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Book Info & Cover Upload (Col 4) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-[28px] border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <BookOpen size={16} className="text-orange-600" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Book &amp; Author Details
                    </h3>
                  </div>

                  {/* Book Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Book Title</label>
                    <input
                      type="text"
                      value={bookTitle}
                      onChange={(e) => setBookTitle(e.target.value)}
                      placeholder="e.g. Atomic Habits"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-orange-500 focus:outline-none transition shadow-2xs"
                    />
                  </div>

                  {/* Author Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Author Name</label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g. James Clear"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-orange-500 focus:outline-none transition shadow-2xs"
                    />
                  </div>

                  {/* Topic Presets */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Topic / Category</label>
                    <div className="flex flex-wrap gap-1.5">
                      {TOPIC_PRESETS.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setSelectedTopic(t.value)}
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${selectedTopic === t.value
                            ? 'bg-orange-500 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional Book Notes & Outline (Ground Truth for AI Planner) */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <FileText size={13} className="text-orange-500" />
                        Book Notes &amp; Key Takeaways (Optional)
                      </label>
                      <span className="text-[10px] text-slate-400 font-medium">Ground Truth for AI Planner</span>
                    </div>
                    <textarea
                      value={bookNotesText}
                      onChange={(e) => setBookNotesText(e.target.value)}
                      placeholder="Paste chapter notes, quotes, or outline to guide factual accuracy..."
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 p-3 text-xs text-slate-900 focus:border-orange-500 focus:outline-none transition shadow-2xs resize-none font-medium"
                    />
                  </div>

                  {/* Book Cover Image Upload */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>Book Cover Image (Optional)</span>
                      {bookCoverUrl && (
                        <span className="text-[10px] text-emerald-600 font-bold">Loaded</span>
                      )}
                    </label>

                    {bookCoverUrl ? (
                      <div className="relative aspect-[3/4] max-w-[140px] mx-auto rounded-xl overflow-hidden border-2 border-orange-200 shadow-md group">
                        <img src={bookCoverUrl} alt="Cover" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setBookCoverUrl('')}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => coverInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-200 hover:border-orange-400 rounded-xl p-4 text-center cursor-pointer bg-slate-50 hover:bg-orange-50/30 transition flex flex-col items-center justify-center gap-1.5"
                      >
                        <ImagePlus size={22} className="text-orange-500" />
                        <span className="text-xs font-bold text-slate-700">Add Book Cover</span>
                        <span className="text-[10px] text-slate-400">PNG, JPG up to 10MB</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1 Continue Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 font-medium">
                Step 1 of 4 completed · Next: Select background music and audio volume.
              </p>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs px-7 py-3.5 shadow-md shadow-orange-500/20 transition cursor-pointer"
              >
                <span>Continue to Step 2: Music &amp; Audio</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 2: MUSIC & AUDIO (SOUNDTRACK & VOLUME)                             */}
        {/* ======================================================================= */}
        {currentStep === 2 && (
          <div className="max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                2. Background Soundtrack &amp; Audio Mix
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Select an ambient royalty-free soundtrack calibrated for deep reading, and fine-tune speech auto-ducking.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {['All', 'Lo-Fi', 'Piano', 'Upbeat', 'Cinematic', 'Narrative', 'Chill', 'Beats', 'Lounge', 'Acoustic', 'Zen', 'Mute'].map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setBgmCategory(cat)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${bgmCategory === cat
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            {/* BGM Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {filteredBgmTracks.map((track) => {
                const isSelected = selectedBgmTrack === track.path;
                const isAuditioning = playingBgmId === track.id;

                return (
                  <div
                    key={track.id}
                    onClick={() => setSelectedBgmTrack(track.path)}
                    className={`rounded-2xl border p-4 transition-all cursor-pointer flex flex-col justify-between gap-3 ${isSelected
                      ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Play/Pause Audition Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePlayBgm(track);
                          }}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-xs cursor-pointer ${isAuditioning
                            ? 'bg-orange-500 text-white animate-pulse'
                            : isSelected
                              ? 'bg-orange-500 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          title={isAuditioning ? 'Pause preview' : 'Play preview'}
                        >
                          {track.id === 'none' ? (
                            <VolumeX size={16} />
                          ) : isAuditioning ? (
                            <Pause size={16} />
                          ) : (
                            <Play size={16} className="ml-0.5" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 truncate">{track.label}</p>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {track.category}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="h-5 w-5 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
                          <Check size={12} className="stroke-[3]" />
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      {track.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Volume Slider & Controls */}
            {selectedBgmTrack !== 'none' && (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 size={16} className="text-orange-500" />
                    <span className="text-xs font-black text-slate-800">
                      Background Music Volume: {bgmVolume}%
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Recommended: 12% - 16%
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={bgmVolume}
                  onChange={(e) => setBgmVolume(parseInt(e.target.value, 10))}
                  className="w-full accent-orange-500 cursor-pointer"
                />

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoducking"
                      checked={autoDucking}
                      onChange={(e) => setAutoDucking(e.target.checked)}
                      className="rounded accent-orange-500 cursor-pointer"
                    />
                    <label htmlFor="autoducking" className="font-bold text-slate-700 cursor-pointer">
                      Speech Auto-Ducking (Lowers music volume automatically when narrator speaks)
                    </label>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                    Enabled
                  </span>
                </div>
              </div>
            )}

            {/* Navigation Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 px-5 py-3 transition cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back to Step 1</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs px-7 py-3.5 shadow-md shadow-orange-500/20 transition cursor-pointer"
              >
                <span>Continue to Step 3: Caption Style</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 3: STYLE (32 MASTER ANIMATED CAPTION THEMES)                       */}
        {/* ======================================================================= */}
        {currentStep === 3 && (
          <div className="max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                  3. Select 16:9 Visual Theme &amp; Caption Style
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Choose a unified visual theme and animated typography preset for your 16:9 chapter cards.
                </p>
              </div>

              {/* Quick Filter Search */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-orange-500 transition w-full sm:w-64">
                <Search size={14} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search 32 styles..."
                  value={captionSearch}
                  onChange={(e) => setCaptionSearch(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-full font-medium"
                />
              </div>
            </div>

            {/* SECTION 0: UNIFIED VISUAL DESIGN THEME (6 MASTER THEMES) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-orange-500" />
                    Unified Visual Design Themes
                  </label>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Harmonizes canvas tones, card borders, accents, and typography hierarchy.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                  6 Master Themes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.values(MASTER_THEMES).map((theme) => {
                  const isSelected = activeVisualTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => {
                        setActiveVisualTheme(theme.id);
                        onVisualThemeChange?.(theme.id);
                      }}
                      className={`group relative flex flex-col p-4 rounded-xl border text-left transition cursor-pointer ${isSelected
                          ? "border-orange-500 bg-orange-50/40 shadow-xs ring-2 ring-orange-400/40"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                        }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2.5">
                        <span className="text-xs font-black text-slate-900 tracking-tight">
                          {theme.name}
                        </span>
                        {isSelected ? (
                          <div className="h-5 w-5 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
                            <Check size={11} strokeWidth={3} />
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                            {theme.colors.mode}
                          </span>
                        )}
                      </div>

                      {/* Color Palette Swatches */}
                      <div className="flex items-center gap-1.5 mb-2.5">
                        {[
                          theme.colors.primary,
                          theme.colors.secondary,
                          theme.colors.accent,
                          theme.colors.background,
                          theme.colors.text,
                        ].map((hex, i) => (
                          <span
                            key={i}
                            className="h-3.5 w-6 rounded-md border border-slate-300/60 shadow-2xs"
                            style={{ backgroundColor: hex }}
                            title={hex}
                          />
                        ))}
                      </div>

                      {/* Typography & Background details */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium border-t border-slate-100 pt-2 w-full mt-auto">
                        <span className="truncate">{theme.typography.headingFont}</span>
                        <span className="capitalize font-semibold text-slate-700">{theme.background.type}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {['All', 'Kinetic', 'Viral', 'Modern', 'Karaoke', 'Editorial', 'Cinema', 'Podcast', 'Creative', 'Clean'].map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCaptionCategory(cat)}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer ${captionCategory === cat
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            {/* 32 Master Caption Styles Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {filteredCaptionStyles.map((style) => {
                const isSelected = selectedCaptionTheme === style.id;
                const isHovered = hoveredStyleId === style.id;
                const previewWords = STYLE_PREVIEW_WORDS[style.id] || ['ATOMIC', 'HABITS', 'SUMMARY'];

                return (
                  <div
                    key={style.id}
                    onClick={() => setSelectedCaptionTheme(style.id)}
                    onMouseEnter={() => setHoveredStyleId(style.id)}
                    onMouseLeave={() => setHoveredStyleId(null)}
                    className="group cursor-pointer select-none text-left"
                  >
                    {/* Live Preview Card */}
                    <div
                      style={{
                        background: 'radial-gradient(circle at 50% 50%, #172033 0%, #070B14 85%)',
                        borderColor: isSelected ? '#EA580C' : undefined,
                        borderWidth: isSelected ? 2 : 1,
                      }}
                      className={`aspect-video rounded-2xl overflow-hidden relative border transition-all duration-200 flex items-center justify-center p-3 ${isSelected
                        ? 'shadow-md ring-2 ring-orange-500/25 scale-[1.02]'
                        : 'border-slate-200 hover:border-slate-400 hover:shadow-2xs'
                        }`}
                    >
                      {/* Active Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-2 left-2 bg-orange-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-xs z-20 pointer-events-none">
                          ✓ Selected
                        </div>
                      )}

                      {/* Top Category Badge */}
                      <div className="absolute top-2 right-2 bg-white/10 backdrop-blur-xs text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full pointer-events-none uppercase tracking-wider">
                        {style.category}
                      </div>

                      {/* Live Animated Word Simulation */}
                      <div className="relative z-10 w-full text-center pointer-events-none">
                        {renderPreviewCaptionWords(
                          style.id,
                          style.color,
                          style.fontFamily,
                          previewWords,
                          previewWordStep
                        )}
                      </div>
                    </div>

                    {/* Card Title & Description */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-black text-slate-900 truncate">{style.name}</p>
                        {style.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                            {style.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                        {style.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Watermark Remover Toggle */}
            {onRemoveAiWatermarkChange && (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <WatermarkRemoverToggle
                  enabled={removeAiWatermark}
                  onChange={onRemoveAiWatermarkChange}
                />
              </div>
            )}

            {/* Navigation Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 px-5 py-3 transition cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back to Step 2</span>
              </button>

              <button
                type="button"
                onClick={handleGeneratePlan}
                disabled={isAnalyzing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs px-7 py-3.5 shadow-md shadow-orange-500/20 transition cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw size={14} className="animate-spin text-white" />
                    <span>Analyzing Chapters with AI...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Step 4: Live 16:9 Cinema Monitor</span>
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* STEP 4 (final): PREVIEW (16:9 CINEMA MONITOR & CHAPTER STORYBOARD)       */}
        {/* ======================================================================= */}
        {currentStep === BOOK_SUMMARY_STEPS.length && (
          <div className="max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                  4. 16:9 Cinema Monitor &amp; Chapter Storyboard
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Inspect simulated 16:9 widescreen chapters, fine-tune takeaways and quotes, and launch 1080p render.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-mono font-bold text-slate-600 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200">
                  1920×1080 · 30 FPS
                </span>
                <span className="text-xs font-black text-orange-600 px-3 py-1 rounded-xl bg-orange-50 border border-orange-200">
                  {calculatedCredits} Credit{calculatedCredits > 1 ? 's' : ''} (1 Min = 1 Cr)
                </span>
              </div>
            </div>

            {/* 2-Column Stage */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: 16:9 Cinema Widescreen Monitor (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs space-y-4">
                <div className="w-full flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="font-black text-slate-900 uppercase tracking-wider text-[11px]">
                      16:9 Cinema Widescreen Stage
                    </span>
                  </div>
                  <span className="font-mono text-slate-500 text-xs font-bold">
                    Chapter {activeChapterIndex + 1} of {Math.max(1, currentChapters.length)}
                  </span>
                </div>

                {/* 16:9 Cinema Screen */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-[4px] border-slate-800 shadow-2xl flex flex-col justify-between p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 text-white">
                  {/* Top Bar: Book Title & Chapter Tag */}
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-orange-400" />
                      <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                        {bookTitle || 'Book Summary'}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-orange-300 border border-white/10">
                      Chapter {activeChapterIndex + 1}
                    </span>
                  </div>

                  {/* Main Center Content: 3D Cover + Kinetic Quote */}
                  <div className="flex items-center gap-6 my-auto z-10">
                    {/* Book Cover Thumbnail */}
                    {bookCoverUrl ? (
                      <div className="w-24 sm:w-28 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-white/20 shrink-0">
                        <img src={bookCoverUrl} alt="Cover" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-24 sm:w-28 aspect-[3/4] rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 p-3 flex flex-col justify-between shadow-2xl border border-white/20 shrink-0">
                        <BookOpen size={20} className="text-white" />
                        <span className="text-[10px] font-black leading-tight text-white line-clamp-3">
                          {bookTitle || 'Atomic Habits'}
                        </span>
                      </div>
                    )}

                    {/* Headline & Takeaway */}
                    <div className="space-y-2 min-w-0">
                      <h3 className="text-base sm:text-xl font-black text-white leading-tight font-sans">
                        {activeChapter.chapterTitle || activeChapter.text}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 font-serif">
                        &ldquo;{activeChapter.text}&rdquo;
                      </p>
                      {authorName && (
                        <p className="text-[11px] font-bold text-orange-400">— {authorName}</p>
                      )}
                    </div>
                  </div>

                  {/* Bottom Progress Bar */}
                  <div className="w-full space-y-1 z-10">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>{activeChapter.subtitle || 'Chapter Takeaway'}</span>
                      <span>{formatTime(audioDuration)}</span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-white/20 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
                        style={{
                          width: `${((activeChapterIndex + 1) / Math.max(1, currentChapters.length)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Chapter Stepper Navigation */}
                <div className="w-full flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveChapterIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeChapterIndex === 0}
                    className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-700">
                    <span>Chapter {activeChapterIndex + 1}</span>
                    <span className="text-slate-400">/</span>
                    <span>{Math.max(1, currentChapters.length)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveChapterIndex((prev) => Math.min(currentChapters.length - 1, prev + 1))
                    }
                    disabled={activeChapterIndex >= currentChapters.length - 1}
                    className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Right Column: Chapter Storyboard & Transcript Review (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Film size={16} className="text-orange-500" />
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                        Chapter Storyboard
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {currentChapters.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const lines = currentChapters.map((ch, idx) => {
                              const s = ch.startTimeSeconds || idx * 25;
                              const m = Math.floor(s / 60);
                              const sec = Math.floor(s % 60);
                              const stamp = `${m < 10 ? '0' : ''}${m}:${sec < 10 ? '0' : ''}${sec}`;
                              return `${stamp} ${ch.chapterTitle || ch.text || `Chapter ${idx + 1}`}`;
                            });
                            navigator.clipboard.writeText(lines.join('\n'));
                            setCopiedTimestamps(true);
                            setTimeout(() => setCopiedTimestamps(false), 2000);
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                          title="Copy timestamps for YouTube video description"
                        >
                          {copiedTimestamps ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                          <span>{copiedTimestamps ? 'Copied!' : 'YouTube Timestamps'}</span>
                        </button>
                      )}
                      <span className="text-xs font-bold text-slate-500 font-mono">
                        {currentChapters.length} Chapters
                      </span>
                    </div>
                  </div>

                  {/* Chapter List */}
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {currentChapters.map((ch, idx) => {
                      const isActive = activeChapterIndex === idx;

                      return (
                        <div
                          key={ch.id || idx}
                          onClick={() => setActiveChapterIndex(idx)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${isActive
                            ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                            }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                              {idx + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {ch.chapterTitle || ch.text}
                              </p>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Chapter {idx + 1} · {ch.durationSeconds || 15}s
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cloud Render Ready Banner */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-emerald-900">1080p Cinema Widescreen Ready</p>
                    <p className="text-emerald-700 font-medium">
                      1920×1080 Full HD • {calculatedCredits} Credit{calculatedCredits > 1 ? 's' : ''} per Rule 4.1
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Bottom Action Bar */}
            <div className="sticky bottom-4 z-30 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Download size={18} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 font-jakarta truncate max-w-xs">
                    {bookTitle || audioFileName || 'Book Summary Video'}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <span className="text-orange-600 font-bold">{calculatedCredits} Credits</span>
                    <span>•</span>
                    <span>1920×1080 Full HD</span>
                    <span>•</span>
                    <span className="text-slate-700 font-bold">16:9 Widescreen</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 transition cursor-pointer"
                >
                  Change Style
                </button>

                <button
                  type="button"
                  onClick={handleSubmitRender}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-3.5 text-xs font-black bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 hover:brightness-110 text-white shadow-lg shadow-orange-500/25 transition cursor-pointer"
                >
                  <Sparkles size={15} className="fill-white text-white" />
                  <span>Create Book Summary Video ({calculatedCredits} Cr)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BookSummaryStudio;
