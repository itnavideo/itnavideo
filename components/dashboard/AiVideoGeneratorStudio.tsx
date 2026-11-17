'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  UploadCloud,
  FileText,
  Music,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Trash2,
  Film,
  Scissors,
  SkipBack,
  SkipForward,
  ZoomIn,
  ZoomOut,
  Undo2,
  Redo2,
  Volume2,
  VolumeX,
  Search,
  Lock,
  Unlock,
  ChevronRight,
  ArrowRight,
  Layers,
  Check,
  Eye,
  Sliders,
  Plus,
  X,
  Clock,
  Send,
  Wand2,
  Tv,
  Zap,
} from 'lucide-react';
import { BorderBeam } from '@/components/magicui/BorderBeam';
import { WatermarkRemoverToggle } from '@/components/dashboard/WatermarkRemoverToggle';
import {
  AiVideoGeneratorPlan,
  AiVideoGeneratorScene,
  AI_VIDEO_STUDIO_LIBRARY_VISUALS,
} from '@/services/ai/aiVideoGeneratorPlanner';
import {
  AWS_BGM_TRACKS,
  THIRTY_TWO_CAPTION_STYLES,
  renderPreviewCaptionWords,
  getBgmTrackAudioUrl,
  LibraryBgmTrack,
  CaptionStyleItem,
} from '@/components/dashboard/ImageToVideoStudio';

export const AI_VIDEO_STEPS = [
  { step: 1, id: 'concept', title: 'Concept', desc: 'Prompt & Media' },
  { step: 2, id: 'music', title: 'Music', desc: 'Soundtrack & Volume' },
  { step: 3, id: 'style', title: 'Style', desc: 'Captions & Theme' },
] as const;

interface AiVideoGeneratorStudioProps {
  onStartRender?: (payload: any) => void;
  isRendering?: boolean;
}

const STARTER_PROMPTS = [
  {
    title: 'The Psychology of High Achievers',
    prompt: 'A cinematic documentary on how top 1% thinkers structure their mornings, manage cognitive energy, and avoid burnout.',
    style: 'Documentary',
    duration: 45,
  },
  {
    title: 'The Future of AI Automation in 2026',
    prompt: 'A punchy, modern explainer showing how autonomous agent workflows and serverless cloud systems replace repetitive manual tasks.',
    style: 'Modern Tech',
    duration: 60,
  },
  {
    title: 'Why Most Startups Fail at Scaling',
    prompt: 'An analytical deep dive into unit economics, customer acquisition bottlenecks, and why premature scaling destroys promising tech companies.',
    style: 'Case Study',
    duration: 45,
  },
  {
    title: 'Building Unshakable Mental Focus',
    prompt: 'A calm, inspiring guide on eliminating digital distractions, entering deep work flow states, and mastering attention.',
    style: 'Minimalist',
    duration: 30,
  },
];

export default function AiVideoGeneratorStudio({
  onStartRender,
  isRendering = false,
}: AiVideoGeneratorStudioProps) {
  // ── 4-Step Stepper State
  const [currentStep, setCurrentStep] = useState<number>(1);

  // ── Launchpad Form State
  const [prompt, setPrompt] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number>(45);
  const [selectedStyle, setSelectedStyle] = useState<string>('Cinematic Modern');
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState<string>('pop-word');
  const [selectedBgmId, setSelectedBgmId] = useState<string>('parasail');
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; type: string; url: string }>>([]);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState<boolean>(false);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState<boolean>(false);
  const [launchpadError, setLaunchpadError] = useState<string | null>(null);

  // ── Timeline Studio State (Active Plan)
  const [plan, setPlan] = useState<AiVideoGeneratorPlan | null>(null);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [timelineZoom, setTimelineZoom] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'visuals' | 'script' | 'audio'>('visuals');
  const [isRegeneratingScene, setIsRegeneratingScene] = useState<boolean>(false);
  const [removeAiWatermark, setRemoveAiWatermark] = useState<boolean>(true);

  // ── Caption Styles Filter
  const [captionCategoryTab, setCaptionCategoryTab] = useState<string>('All');
  const [captionSearch, setCaptionSearch] = useState<string>('');

  const filteredCaptionStyles = useMemo(() => {
    return THIRTY_TWO_CAPTION_STYLES.filter((style) => {
      const matchesCategory = captionCategoryTab === 'All' || style.category === captionCategoryTab;
      const matchesSearch =
        style.name.toLowerCase().includes(captionSearch.toLowerCase()) ||
        style.description.toLowerCase().includes(captionSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [captionCategoryTab, captionSearch]);

  // ── Audio References & In-Card Auditioning
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [auditioningTrack, setAuditioningTrack] = useState<string | null>(null);
  const auditionAudioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudition = (track: LibraryBgmTrack) => {
    if (track.path === 'none') return;
    if (auditioningTrack === track.id) {
      if (auditionAudioRef.current) {
        auditionAudioRef.current.pause();
        auditionAudioRef.current = null;
      }
      setAuditioningTrack(null);
    } else {
      if (auditionAudioRef.current) {
        auditionAudioRef.current.pause();
      }
      const audioUrl = getBgmTrackAudioUrl(track.path);
      const audio = new window.Audio(audioUrl);
      audio.volume = 0.25;
      audio.play().catch(() => { });
      audio.onended = () => setAuditioningTrack(null);
      auditionAudioRef.current = audio;
      setAuditioningTrack(track.id);
    }
  };

  useEffect(() => {
    return () => {
      if (auditionAudioRef.current) {
        auditionAudioRef.current.pause();
        auditionAudioRef.current = null;
      }
    };
  }, []);

  // ── Current Active Scene & Caption
  const activeScene = useMemo(() => {
    if (!plan || plan.scenes.length === 0) return null;
    return plan.scenes[activeSceneIndex] || plan.scenes[0];
  }, [plan, activeSceneIndex]);

  const activeCaption = useMemo(() => {
    if (!plan) return '';
    const cap = plan.captions.find((c) => currentTime >= c.startTime && currentTime <= c.endTime);
    return cap ? cap.text : activeScene?.narration || '';
  }, [plan, currentTime, activeScene]);

  const currentCaptionStyleObj = useMemo<CaptionStyleItem>(() => {
    return (
      THIRTY_TWO_CAPTION_STYLES.find((c) => c.id === selectedCaptionStyle) ||
      THIRTY_TWO_CAPTION_STYLES[0]
    );
  }, [selectedCaptionStyle]);

  const currentBgmObj = useMemo<LibraryBgmTrack>(() => {
    return AWS_BGM_TRACKS.find((b) => b.id === selectedBgmId) || AWS_BGM_TRACKS[0];
  }, [selectedBgmId]);

  // ── Sync Active Scene Index with Current Timecode
  useEffect(() => {
    if (!plan || plan.scenes.length === 0) return;
    const foundIndex = plan.scenes.findIndex(
      (s) => currentTime >= s.startSeconds && currentTime < s.endSeconds
    );
    if (foundIndex !== -1 && foundIndex !== activeSceneIndex) {
      setActiveSceneIndex(foundIndex);
    }
  }, [currentTime, plan, activeSceneIndex]);

  // ── Playhead Timer
  useEffect(() => {
    if (isPlaying) {
      const totalDur = plan?.durationSeconds || 60;
      if (bgmAudioRef.current && !isMuted) {
        bgmAudioRef.current.play().catch(() => { });
      }
      playbackTimerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDur) {
            setIsPlaying(false);
            if (bgmAudioRef.current) bgmAudioRef.current.pause();
            return 0;
          }
          return +(prev + 0.1).toFixed(1);
        });
      }, 100);
    } else {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
      if (bgmAudioRef.current) bgmAudioRef.current.pause();
    }
    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, [isPlaying, plan?.durationSeconds, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (newTime: number) => {
    const totalDur = plan?.durationSeconds || 60;
    const clamped = Math.max(0, Math.min(newTime, totalDur));
    setCurrentTime(clamped);
    if (bgmAudioRef.current) {
      bgmAudioRef.current.currentTime = clamped % (bgmAudioRef.current.duration || totalDur);
    }
  };

  // ── 1. Action: Enhance Prompt with Gemini
  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancingPrompt) return;
    setIsEnhancingPrompt(true);
    setLaunchpadError(null);
    try {
      const res = await fetch('/api/reels/plan-ai-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enhance-prompt',
          prompt,
          style: selectedStyle,
          targetDurationSeconds: selectedDuration,
        }),
      });
      const data = await res.json();
      if (data.ok && data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      } else {
        setLaunchpadError(data.error || 'Could not enhance prompt');
      }
    } catch (err: any) {
      setLaunchpadError(err.message || 'Network error while enhancing prompt');
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  // ── 2. Action: Generate Video Draft
  const handleGenerateDraft = async () => {
    if (!prompt.trim()) {
      setLaunchpadError('Please enter a prompt describing your video.');
      return;
    }
    setIsGeneratingDraft(true);
    setLaunchpadError(null);
    try {
      const res = await fetch('/api/reels/plan-ai-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-plan',
          prompt,
          targetDurationSeconds: selectedDuration,
          style: selectedStyle,
          captionThemeId: selectedCaptionStyle,
          bgmTrackId: selectedBgmId,
          uploadedMedia: attachedFiles.map((f) => ({ url: f.url, type: 'image' })),
        }),
      });
      const data = await res.json();
      if (data.ok && data.plan) {
        setPlan(data.plan);
        setActiveSceneIndex(0);
        setCurrentTime(0);
        setCurrentStep(4); // Automatically move to Step 4 Studio!
      } else {
        setLaunchpadError(data.error || 'Failed to generate video draft.');
      }
    } catch (err: any) {
      setLaunchpadError(err.message || 'Network error while generating draft.');
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  // ── 3. Action: Independent Scene Regeneration
  const handleRegenerateScene = async (index: number) => {
    if (!plan || isRegeneratingScene) return;
    setIsRegeneratingScene(true);
    try {
      const res = await fetch('/api/reels/plan-ai-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'regenerate-scene',
          sceneIndex: index,
          currentPlan: plan,
        }),
      });
      const data = await res.json();
      if (data.ok && data.scene) {
        const nextScenes = [...plan.scenes];
        nextScenes[index] = data.scene;
        setPlan({ ...plan, scenes: nextScenes });
      }
    } catch (err) {
      console.warn('Failed to regenerate scene:', err);
    } finally {
      setIsRegeneratingScene(false);
    }
  };

  // ── 4. Action: Duplicate Scene
  const handleDuplicateScene = (index: number) => {
    if (!plan) return;
    const target = plan.scenes[index];
    if (!target) return;
    const duplicated: AiVideoGeneratorScene = {
      ...target,
      id: `scene-dup-${Date.now().toString(36)}`,
      title: `${target.title} (Copy)`,
    };
    const nextScenes = [...plan.scenes];
    nextScenes.splice(index + 1, 0, duplicated);

    let time = 0;
    const updatedScenes = nextScenes.map((s, idx) => {
      const start = +time.toFixed(1);
      const end = +(time + s.duration).toFixed(1);
      time = end;
      return { ...s, sceneIndex: idx, startSeconds: start, endSeconds: end };
    });

    setPlan({
      ...plan,
      durationSeconds: time,
      scenes: updatedScenes,
    });
    setActiveSceneIndex(index + 1);
  };

  // ── 5. Action: Delete Scene
  const handleDeleteScene = (index: number) => {
    if (!plan || plan.scenes.length <= 1) return;
    const nextScenes = plan.scenes.filter((_, i) => i !== index);

    let time = 0;
    const updatedScenes = nextScenes.map((s, idx) => {
      const start = +time.toFixed(1);
      const end = +(time + s.duration).toFixed(1);
      time = end;
      return { ...s, sceneIndex: idx, startSeconds: start, endSeconds: end };
    });

    setPlan({
      ...plan,
      durationSeconds: time,
      scenes: updatedScenes,
    });
    setActiveSceneIndex(Math.max(0, index - 1));
  };

  // ── 6. Action: Split Scene at Playhead
  const handleSplitSceneAtPlayhead = () => {
    if (!plan || !activeScene) return;
    const sceneStart = activeScene.startSeconds;
    const sceneEnd = activeScene.endSeconds;
    if (currentTime <= sceneStart + 1 || currentTime >= sceneEnd - 1) return;

    const firstDuration = +(currentTime - sceneStart).toFixed(1);
    const secondDuration = +(sceneEnd - currentTime).toFixed(1);

    const firstScene: AiVideoGeneratorScene = {
      ...activeScene,
      duration: firstDuration,
      endSeconds: currentTime,
    };

    const secondScene: AiVideoGeneratorScene = {
      ...activeScene,
      id: `scene-split-${Date.now().toString(36)}`,
      title: `${activeScene.title} (Part 2)`,
      duration: secondDuration,
      startSeconds: currentTime,
      endSeconds: sceneEnd,
    };

    const nextScenes = [...plan.scenes];
    nextScenes.splice(activeSceneIndex, 1, firstScene, secondScene);

    let time = 0;
    const updatedScenes = nextScenes.map((s, idx) => {
      const start = +time.toFixed(1);
      const end = +(time + s.duration).toFixed(1);
      time = end;
      return { ...s, sceneIndex: idx, startSeconds: start, endSeconds: end };
    });

    setPlan({
      ...plan,
      durationSeconds: time,
      scenes: updatedScenes,
    });
    setActiveSceneIndex(activeSceneIndex + 1);
  };

  // ── 7. Action: Update Scene Narration Script
  const handleUpdateNarration = (index: number, newText: string) => {
    if (!plan) return;
    const nextScenes = [...plan.scenes];
    nextScenes[index] = { ...nextScenes[index], narration: newText };

    const targetScene = nextScenes[index];
    const nextCaptions = plan.captions.map((cap) => {
      if (cap.sceneIndex === index) {
        return { ...cap, text: newText };
      }
      return cap;
    });

    setPlan({
      ...plan,
      scenes: nextScenes,
      captions: nextCaptions,
    });
  };

  // ── 8. Action: Replace Scene Photo
  const handleReplaceScenePhoto = (index: number) => {
    if (!plan) return;
    const current = plan.scenes[index]?.mediaUrl;
    const pool = AI_VIDEO_STUDIO_LIBRARY_VISUALS.filter((v) => v !== current);
    const nextUrl = pool[Math.floor(Math.random() * pool.length)] || AI_VIDEO_STUDIO_LIBRARY_VISUALS[0];

    const nextScenes = [...plan.scenes];
    nextScenes[index] = { ...nextScenes[index], mediaUrl: nextUrl };
    setPlan({ ...plan, scenes: nextScenes });
  };

  // ── 9. Action: Cloud Render Trigger
  const handleTriggerCloudRender = () => {
    if (!plan) return;
    const payload = {
      mode: 'aiVideoGenerator',
      templateName: 'AI_VIDEO_GENERATOR',
      prompt: plan.prompt,
      topicTitle: plan.title,
      scenes: plan.scenes,
      captions: plan.captions,
      durationSeconds: plan.durationSeconds,
      captionThemeId: selectedCaptionStyle,
      bgmUrl: getBgmTrackAudioUrl(currentBgmObj.path),
      bgmVolume: plan.bgmVolume || 0.35,
      removeAiWatermark,
      aspectRatio: '16:9',
    };

    if (onStartRender) {
      onStartRender(payload);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-slate-800">
      {/* ── ROW 1: 4-STEP GUIDED STEPPER BAR (Unified Studio Stepper) ── */}
      <div className="border-b border-slate-200/90 bg-white px-4 sm:px-8 py-3 shrink-0 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          {/* Stepper Navigation Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 bg-slate-50 border border-slate-200/90 rounded-2xl p-1.5 shadow-2xs">
            {AI_VIDEO_STEPS.map((step) => {
              const isActive = currentStep === step.step;
              const isDone =
                (step.step === 1 && Boolean(prompt.trim())) ||
                (step.step === 2 && Boolean(selectedBgmId)) ||
                (step.step === 3 && Boolean(selectedCaptionStyle)) ||
                (step.step === 4 && Boolean(plan)) ||
                currentStep > step.step;

              return (
                <button
                  key={step.step}
                  type="button"
                  onClick={() => setCurrentStep(step.step)}
                  className={`inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-orange-600 shadow-xs border border-orange-200/60 ring-1 ring-orange-500/20"
                      : isDone
                        ? "text-slate-800 hover:text-slate-900 hover:bg-white/60"
                        : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${
                      isActive
                        ? "bg-orange-600 text-white"
                        : isDone
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isDone && !isActive ? <Check size={11} strokeWidth={3} /> : step.step}
                  </span>
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── ROW 2: STEP CONTENT (SCROLLABLE WORKSPACE) ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* ──────────────── STEP 1: CONCEPT & PROMPT LAUNCHPAD ──────────────── */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Creative Command Card */}
              <div className="relative rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-5">
                <BorderBeam size={320} duration={12} delay={3} colorFrom="#EA580C" colorTo="#F59E0B" />

                {/* Prompt Box */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      Describe your video concept or prompt
                    </label>
                    <button
                      type="button"
                      onClick={handleEnhancePrompt}
                      disabled={isEnhancingPrompt || !prompt.trim()}
                      className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shadow-2xs"
                    >
                      {isEnhancingPrompt ? (
                        <>
                          <RefreshCw size={12} className="animate-spin" />
                          <span>Enhancing Brief...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 size={13} />
                          <span>✨ Enhance Idea</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="E.g., A cinematic mini-documentary exploring how artificial intelligence is transforming urban architecture and green smart cities in 2026..."
                      rows={4}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-orange-500 transition resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Optional Media Attachments */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,audio/*,video/*"
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (!files) return;
                      const newAtt = Array.from(files).map((f) => ({
                        name: f.name,
                        type: f.type,
                        url: URL.createObjectURL(f),
                      }));
                      setAttachedFiles((prev) => [...prev, ...newAtt]);
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 transition flex items-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <Plus size={14} className="text-orange-600" />
                    <span>Attach Media (Optional)</span>
                  </button>

                  {attachedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700 shadow-2xs"
                    >
                      <Film size={12} />
                      <span className="max-w-[140px] truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setAttachedFiles((prev) => prev.filter((_, i) => i !== idx))}
                        className="hover:text-orange-950 cursor-pointer ml-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Target Duration Selector */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200/90 p-4 space-y-2">
                  <span className="block text-xs font-bold text-slate-800">
                    Target Video Duration (16:9 Widescreen)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { sec: 30, label: "30 Seconds", desc: "Short Explainer" },
                      { sec: 45, label: "45 Seconds", desc: "Standard Story" },
                      { sec: 60, label: "60 Seconds", desc: "1 Min = 1 Credit" },
                      { sec: 90, label: "90 Seconds", desc: "Deep Dive" },
                    ].map((d) => (
                      <button
                        key={d.sec}
                        type="button"
                        onClick={() => setSelectedDuration(d.sec)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${selectedDuration === d.sec
                            ? "border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                          }`}
                      >
                        <p className="text-xs font-bold text-slate-900">{d.label}</p>
                        <p className="text-[10px] text-slate-500">{d.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {launchpadError && (
                  <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                    <AlertCircle size={15} className="shrink-0 text-red-600" />
                    <span>{launchpadError}</span>
                  </div>
                )}

                {/* Action Bar */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                  >
                    Configure Music &amp; Style First →
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateDraft}
                    disabled={isGeneratingDraft || !prompt.trim()}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs tracking-wide shadow-md shadow-orange-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                  >
                    {isGeneratingDraft ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Planning Scenes with AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={15} />
                        <span>Generate Video Draft</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Starter Creator Prompts */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Or start from a proven creator prompt
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {STARTER_PROMPTS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPrompt(item.prompt);
                        setSelectedStyle(item.style);
                        setSelectedDuration(item.duration);
                      }}
                      className="text-left p-4 rounded-2xl border border-slate-200 bg-white hover:bg-orange-50/40 hover:border-orange-300 transition group cursor-pointer shadow-2xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-700">
                          {item.duration}s
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 2: MUSIC & SOUNDTRACK ──────────────── */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Background Soundtrack &amp; Ducking</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select a background soundtrack from the curated cloud library or audition tracks.
                  </p>
                </div>

                {/* AWS S3 Track Selector Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {AWS_BGM_TRACKS.map((track) => {
                    const isSelected = (selectedBgmId || 'parasail') === track.id;
                    const isAuditioning = auditioningTrack === track.id;

                    return (
                      <div
                        key={track.id}
                        className={`rounded-xl border p-3.5 transition-all flex flex-col justify-between ${isSelected
                            ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                          }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded-full">
                              {track.category}
                            </span>
                            {isSelected && (
                              <span className="flex items-center gap-1 text-[10px] font-black text-orange-600">
                                <Check size={12} strokeWidth={3} /> Selected
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 mt-1">{track.label}</h4>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{track.desc}</p>
                        </div>

                        <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-200/60">
                          {track.path !== 'none' ? (
                            <button
                              type="button"
                              onClick={() => toggleAudition(track)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${isAuditioning
                                  ? 'bg-orange-600 text-white'
                                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                              {isAuditioning ? <Pause size={12} /> : <Play size={12} />}
                              <span>{isAuditioning ? 'Stop' : 'Preview'}</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400">Pure Speech</span>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedBgmId(track.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${isSelected
                                ? 'bg-orange-600 text-white'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                          >
                            {isSelected ? 'Active' : 'Select'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Step 2 Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                  >
                    ← Back to Concept
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-orange-700 transition cursor-pointer"
                  >
                    <span>Next: Style &amp; Captions</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────── STEP 3: STYLE & CAPTIONS ──────────────── */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Select Kinetic Caption Typography</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    32 studio-grade kinetic subtitle animations synced to spoken audio.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
                  {THIRTY_TWO_CAPTION_STYLES.map((style) => {
                    const isSelected = selectedCaptionStyleId === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setSelectedCaptionStyleId(style.id)}
                        className={`flex flex-col p-2.5 rounded-xl border text-left transition-all h-24 justify-between cursor-pointer ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20 shadow-xs'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[10px] font-bold text-slate-500 truncate max-w-[85%]">
                            {style.name}
                          </span>
                          {isSelected && <Check size={12} className="text-orange-600 shrink-0" strokeWidth={3} />}
                        </div>

                        {/* Animated Sample Word Preview */}
                        <div className="my-auto py-1 flex items-center justify-center">
                          {renderPreviewCaptionWords(style.id)}
                        </div>

                        <span className="text-[9px] text-slate-400 truncate">{style.category}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cloud Render Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                >
                  ← Back to Music
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <WatermarkRemoverToggle
                    enabled={removeAiWatermark}
                    onChange={setRemoveAiWatermark}
                  />

                  <button
                    type="button"
                    onClick={handleTriggerCloudRender}
                    disabled={isRendering}
                    className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isRendering ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Rendering 1080p...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        <span>Render 1080p Video ({Math.ceil((plan?.durationSeconds || 60) / 60)} Credit)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
