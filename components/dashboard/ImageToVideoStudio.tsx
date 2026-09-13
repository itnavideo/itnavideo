"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  Mic,
  ImagePlus,
  Music2,
  Sparkles,
  Sliders,
  Trash2,
  UploadCloud,
  CheckCircle2,
  Film,
  Camera,
  Layers,
  Volume2,
  Info,
  Clock,
  Zap,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Maximize2,
  Play,
  Pause,
  VolumeX,
  Radio,
  Loader2,
  Check,
  RefreshCw,
  FileText,
} from "lucide-react";
import { GOOGLE_AI_VOICES, GoogleAiVoice } from "@/constants/googleAiVoices";
import {
  ITNAVIDEO_STOCK_ASSETS,
  ITNAVIDEO_STOCK_CATEGORIES,
  ItnaVideoStockAsset,
} from "@/constants/itnavideoStockAssets";

export interface LibraryBgmTrack {
  id: string;
  name: string;
  mood: string;
  url: string;
}

export const ITNAVIDEO_LIBRARY_BGM: LibraryBgmTrack[] = [
  {
    id: "wealth-building",
    name: "Wealth & Ambition",
    mood: "Business / Success",
    url: "https://res.cloudinary.com/dhouh9idx/video/upload/v1788093179/wealth-building_kyg9kb.mp3",
  },
  {
    id: "inspiring-story",
    name: "Inspiring Story",
    mood: "Emotional / Uplifting",
    url: "https://res.cloudinary.com/dhouh9idx/video/upload/v1788093168/inspiring-story_qdgjzl.mp3",
  },
  {
    id: "tech-innovation",
    name: "Tech Innovation",
    mood: "Tech / Modern",
    url: "https://res.cloudinary.com/dhouh9idx/video/upload/v1788093176/tech-innovation_mabllf.mp3",
  },
  {
    id: "documentary-light",
    name: "Documentary Light",
    mood: "Cinematic / Neutral",
    url: "https://res.cloudinary.com/dhouh9idx/video/upload/v1788093135/documentary-light_ftawjp.mp3",
  },
  {
    id: "viral-momentum",
    name: "Viral Momentum",
    mood: "Fast / High Energy",
    url: "https://res.cloudinary.com/dhouh9idx/video/upload/v1788093178/viral-momentum_c8rnoy.mp3",
  },
  {
    id: "deep-reflection",
    name: "Deep Reflection",
    mood: "Calm / Storytelling",
    url: "https://res.cloudinary.com/dhouh9idx/video/upload/v1788093134/deep-reflection_yp0own.mp3",
  },
  {
    id: "startup-growth",
    name: "Startup Growth",
    mood: "Entrepreneur / Drive",
    url: "https://res.cloudinary.com/dhouh9idx/video/upload/v1788093174/startup-growth_vrdjyz.mp3",
  },
  {
    id: "market-insights",
    name: "Market Insights",
    mood: "Finance / Analysis",
    url: "https://res.cloudinary.com/dhouh9idx/video/upload/v1788093170/market-insights_l7qifd.mp3",
  },
  {
    id: "study-motivation",
    name: "Study Motivation",
    mood: "Focus / Deep Work",
    url: "https://res.cloudinary.com/dhouh9idx/video/upload/v1788093175/study-motivation_qgmvnb.mp3",
  },
  {
    id: "corporate-inspire",
    name: "Corporate Inspire",
    mood: "Professional / Clean",
    url: "https://res.cloudinary.com/dhouh9idx/video/upload/v1788093132/corporate-inspire_gl9pn1.mp3",
  },
  {
    id: "breaking-update",
    name: "Breaking Update",
    mood: "News / Urgent",
    url: "https://res.cloudinary.com/dhouh9idx/video/upload/v1788093131/breaking-update_o0csbl.mp3",
  },
  {
    id: "real-life-journey",
    name: "Real Life Journey",
    mood: "Human Story / Drama",
    url: "https://res.cloudinary.com/dhouh9idx/video/upload/v1788093172/real-life-journey_gndlfs.mp3",
  },
];

export interface ImageToVideoStudioProps {
  selectedAudio: File | null;
  onSelectAudio: (file: File | null) => void;
  imageFiles: File[];
  onAddImages: (files: FileList | null) => void;
  onRemoveImage: (index: number) => void;
  assetSourceMode?: 'upload' | 'library' | 'ai-generate';
  onChangeAssetSourceMode?: (mode: 'upload' | 'library' | 'ai-generate') => void;
  selectedStockAssetUrls?: string[];
  onChangeSelectedStockAssetUrls?: (urls: string[]) => void;
  bgmEnabled?: boolean;
  onChangeBgmEnabled?: (enabled: boolean) => void;
  selectedLibraryBgmUrl?: string;
  onChangeSelectedLibraryBgmUrl?: (url: string) => void;
  bgmFile: File | null;
  onSelectBgm: (file: File | null) => void;
  bgmVolume: number;
  onChangeBgmVolume: (vol: number) => void;
  topicTitle: string;
  onChangeTopicTitle: (title: string) => void;
  subtitleStyle: string;
  onChangeSubtitleStyle: (style: string) => void;
  cameraMotionPreset: string;
  onChangeCameraMotionPreset: (preset: string) => void;
  fitMode?: 'blur-fill' | 'cover';
  onChangeFitMode?: (mode: 'blur-fill' | 'cover') => void;
  isRendering: boolean;
  onStartRender: () => void;
  userCredits?: number;
  estimatedDurationSeconds?: number;
  audioCleanOptions?: any;
  setAudioCleanOptions?: React.Dispatch<React.SetStateAction<any>>;
  userId?: string;
}

export interface ImageToVideoSubtitleStylePreset {
  id: string;
  title: string;
  desc: string;
  badge?: string;
  previewSample: string;
  previewBg: string;
  containerClass: string;
  textClass: string;
}

export const IMAGE_TO_VIDEO_SUBTITLE_STYLES: ImageToVideoSubtitleStylePreset[] = [
  {
    id: "parallax-modern",
    title: "2.5D Glass Pill",
    desc: "Frosted glass capsule with subtle purple glow & spring bounce",
    badge: "Recommended",
    previewSample: "DISCOVER THE FUTURE",
    previewBg: "from-purple-950/50 via-zinc-950 to-black",
    containerClass: "border border-purple-400/40 bg-zinc-900/85 backdrop-blur-md shadow-[0_4px_20px_rgba(168,85,247,0.25)] rounded-full px-3.5 py-1.5",
    textClass: "text-white font-extrabold tracking-tight",
  },
  {
    id: "bold-kinetic",
    title: "Bold Kinetic Yellow",
    desc: "High-contrast obsidian box with luminous yellow retention hook",
    badge: "High Retention",
    previewSample: "MAKE IT HAPPEN",
    previewBg: "from-amber-950/40 via-zinc-950 to-black",
    containerClass: "border border-yellow-400/50 bg-black/95 backdrop-blur-md shadow-[0_4px_20px_rgba(250,204,21,0.25)] rounded-2xl px-3.5 py-1.5",
    textClass: "text-yellow-400 font-black uppercase tracking-tight",
  },
  {
    id: "minimal-lower",
    title: "Minimal Broadcast",
    desc: "Clean lower-third typography with deep cinematic drop shadow",
    badge: "Cinema",
    previewSample: "CLEAR & TIMELESS",
    previewBg: "from-zinc-900/50 via-zinc-950 to-black",
    containerClass: "bg-transparent border-none px-2 py-1",
    textClass: "text-white font-extrabold tracking-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.98)]",
  },
  {
    id: "neon-cyan",
    title: "Cyber Neon Cyan",
    desc: "Electric cyan neon border with futuristic tech glow",
    badge: "Tech & AI",
    previewSample: "NEXT GENERATION",
    previewBg: "from-cyan-950/50 via-zinc-950 to-black",
    containerClass: "border border-cyan-400/50 bg-[#061826]/90 backdrop-blur-md shadow-[0_4px_20px_rgba(34,211,238,0.3)] rounded-full px-3.5 py-1.5",
    textClass: "text-cyan-300 font-extrabold tracking-tight",
  },
  {
    id: "impact-red",
    title: "Impact Red Block",
    desc: "Bold crimson block with uppercase urgent typography",
    badge: "News / Viral",
    previewSample: "BREAKING STORY",
    previewBg: "from-red-950/50 via-zinc-950 to-black",
    containerClass: "border border-red-400/40 bg-red-700/95 backdrop-blur-md shadow-[0_4px_20px_rgba(239,68,68,0.3)] rounded-xl px-3.5 py-1.5",
    textClass: "text-white font-black uppercase tracking-wider",
  },
];

export function ImageToVideoStudio({
  selectedAudio,
  onSelectAudio,
  imageFiles = [],
  onAddImages,
  onRemoveImage,
  bgmEnabled = true,
  onChangeBgmEnabled,
  selectedLibraryBgmUrl = ITNAVIDEO_LIBRARY_BGM[0].url,
  onChangeSelectedLibraryBgmUrl,
  bgmFile,
  onSelectBgm,
  bgmVolume = 0.15,
  onChangeBgmVolume,
  topicTitle = '',
  onChangeTopicTitle,
  subtitleStyle = 'parallax-modern',
  onChangeSubtitleStyle,
  cameraMotionPreset = 'ken-burns',
  onChangeCameraMotionPreset,
  fitMode = 'blur-fill',
  onChangeFitMode,
  isRendering = false,
  onStartRender,
  userCredits,
  estimatedDurationSeconds = 60,
  audioCleanOptions,
  setAudioCleanOptions,
  userId,
  assetSourceMode,
  onChangeAssetSourceMode,
  selectedStockAssetUrls,
  onChangeSelectedStockAssetUrls,
}: ImageToVideoStudioProps) {
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const bgmInputRef = useRef<HTMLInputElement>(null);

  const [audioDragOver, setAudioDragOver] = useState(false);
  const [imageDragOver, setImageDragOver] = useState(false);
  // ── 3 Visual Asset Source Options: 'upload' | 'library' | 'ai-generate' ──
  const [internalAssetSourceMode, setInternalAssetSourceMode] = useState<'upload' | 'library' | 'ai-generate'>('library');
  const activeAssetMode = assetSourceMode || internalAssetSourceMode;
  const setAssetMode = (mode: 'upload' | 'library' | 'ai-generate') => {
    setInternalAssetSourceMode(mode);
    onChangeAssetSourceMode?.(mode);
  };

  const [internalStockUrls, setInternalStockUrls] = useState<string[]>([]);
  const currentStockUrls = selectedStockAssetUrls ?? internalStockUrls;
  const setStockUrls = (urls: string[]) => {
    setInternalStockUrls(urls);
    onChangeSelectedStockAssetUrls?.(urls);
  };

  const [activeStockCategory, setActiveStockCategory] = useState<string>('all');
  const [aiImagePrompt, setAiImagePrompt] = useState('');
  const [aiImageStyle, setAiImageStyle] = useState('Photorealistic 8K');

  const filteredStockAssets = useMemo(() => {
    if (activeStockCategory === 'all') return ITNAVIDEO_STOCK_ASSETS;
    return ITNAVIDEO_STOCK_ASSETS.filter((a) => a.category === activeStockCategory);
  }, [activeStockCategory]);

  const handleToggleStockAsset = (url: string) => {
    if (currentStockUrls.includes(url)) {
      setStockUrls(currentStockUrls.filter((u) => u !== url));
    } else {
      setStockUrls([...currentStockUrls, url]);
    }
  };

  const [bgmSourceTab, setBgmSourceTab] = useState<'library' | 'custom'>(bgmFile ? 'custom' : 'library');
  const [previewingTrackUrl, setPreviewingTrackUrl] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Dual Audio Mode & Google Cloud AI Voices State
  const [audioSourceMode, setAudioSourceMode] = useState<'upload' | 'ai-voice'>('upload');
  const [aiScriptText, setAiScriptText] = useState('');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('hi-IN-Neural2-B');
  const [activeVoiceCategory, setActiveVoiceCategory] = useState<'All' | 'Hindi' | 'Indian English' | 'Global English'>('All');
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);
  const [isGeneratingTts, setIsGeneratingTts] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [generatedVoiceMeta, setGeneratedVoiceMeta] = useState<{ voiceName: string; text: string; audioUrl: string } | null>(null);
  const voicePreviewAudioRef = useRef<HTMLAudioElement | null>(null);
  const generatedVoiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingGeneratedVoice, setIsPlayingGeneratedVoice] = useState(false);

  // Speed Selector: Strictly 1.0x Normal, 1.25x Crisp, 1.5x Fast
  const [aiVoiceSpeed, setAiVoiceSpeed] = useState<1.0 | 1.25 | 1.5>(1.25);
  const [isAdjustingSpeed, setIsAdjustingSpeed] = useState(false);

  // Audio Cleaner State & Filters (Copied from Audio Cleaner)
  const [localCleanOptions, setLocalCleanOptions] = useState({
    removeSilence: true,
    removeFillers: true,
    removeRepeats: true,
    removeFalseStarts: true,
    noiseReduction: true,
    volumeNormalize: true,
    trimEnds: true,
    playbackSpeed: 1.25,
  });
  const currentCleanOptions = audioCleanOptions || localCleanOptions;

  const [isCleaningAudio, setIsCleaningAudio] = useState(false);
  const [audioCleanError, setAudioCleanError] = useState<string | null>(null);
  const [audioCleanSuccess, setAudioCleanSuccess] = useState<{
    secondsSaved: number;
    silencesCut: number;
    cleanedDuration: number;
  } | null>(null);

  // Uploaded audio playback
  const uploadedAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingUploadedAudio, setIsPlayingUploadedAudio] = useState(false);
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedAudio && !generatedVoiceMeta && typeof window !== 'undefined' && selectedAudio instanceof Blob) {
      const url = URL.createObjectURL(selectedAudio);
      setUploadedAudioUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setUploadedAudioUrl(null);
    }
  }, [selectedAudio, generatedVoiceMeta]);

  const handleTogglePlayUploadedAudio = () => {
    if (!uploadedAudioUrl) return;
    if (!uploadedAudioRef.current) {
      uploadedAudioRef.current = new Audio(uploadedAudioUrl);
      uploadedAudioRef.current.playbackRate = aiVoiceSpeed;
      uploadedAudioRef.current.onended = () => setIsPlayingUploadedAudio(false);
    }
    if (isPlayingUploadedAudio) {
      uploadedAudioRef.current.pause();
      setIsPlayingUploadedAudio(false);
    } else {
      uploadedAudioRef.current.playbackRate = aiVoiceSpeed;
      uploadedAudioRef.current.play().catch(console.error);
      setIsPlayingUploadedAudio(true);
    }
  };

  const handleToggleCleanOption = (key: string) => {
    if (setAudioCleanOptions) {
      setAudioCleanOptions((prev: any) => ({
        ...prev,
        [key]: !prev[key],
      }));
    } else {
      setLocalCleanOptions((prev: any) => ({
        ...prev,
        [key]: !prev[key],
      }));
    }
  };

  const handleChangeVoiceSpeed = async (newSpeed: 1.0 | 1.25 | 1.5) => {
    setAiVoiceSpeed(newSpeed);
    if (generatedVoiceAudioRef.current) {
      generatedVoiceAudioRef.current.playbackRate = newSpeed;
    }
    if (uploadedAudioRef.current) {
      uploadedAudioRef.current.playbackRate = newSpeed;
    }
    if (setAudioCleanOptions) {
      setAudioCleanOptions((prev: any) => ({ ...prev, playbackSpeed: newSpeed }));
    } else {
      setLocalCleanOptions((prev: any) => ({ ...prev, playbackSpeed: newSpeed }));
    }

    // If AI voice is active, re-synthesize natively via Google Cloud TTS so output file has native prosody at that speed
    if (generatedVoiceMeta && (generatedVoiceMeta.text || aiScriptText.trim())) {
      setIsAdjustingSpeed(true);
      try {
        const res = await fetch('/api/ai/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: generatedVoiceMeta.text || aiScriptText.trim(),
            voiceId: selectedVoiceId,
            speakingRate: newSpeed,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success && data.audioBase64) {
          const byteCharacters = atob(data.audioBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'audio/mp3' });
          const chosenVoice = GOOGLE_AI_VOICES.find((v) => v.id === selectedVoiceId);
          const fileName = `${(chosenVoice?.name || 'AI_Voice').replace(/[^a-zA-Z0-9]/g, '_')}_${newSpeed}x_Voiceover.mp3`;
          const audioFile = new File([blob], fileName, { type: 'audio/mp3' });

          if (generatedVoiceAudioRef.current) {
            generatedVoiceAudioRef.current.pause();
            generatedVoiceAudioRef.current = null;
            setIsPlayingGeneratedVoice(false);
          }
          const audioUrl = URL.createObjectURL(blob);
          setGeneratedVoiceMeta({
            ...generatedVoiceMeta,
            audioUrl,
          });
          onSelectAudio(audioFile);
        }
      } catch (err) {
        console.warn('Could not re-synthesize speech at new speed:', err);
      } finally {
        setIsAdjustingSpeed(false);
      }
    }
  };

  const handleCleanAudioNow = async () => {
    if (!selectedAudio) return;
    setIsCleaningAudio(true);
    setAudioCleanError(null);
    setAudioCleanSuccess(null);

    try {
      const uploadContentType = selectedAudio.type || 'audio/mp3';
      const presignResponse = await fetch('/api/media/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: selectedAudio.name,
          contentType: uploadContentType,
          fileSize: selectedAudio.size,
          mode: 'audioClean',
          userId: userId || 'anonymous',
        }),
      });
      const presign = await presignResponse.json();
      if (!presignResponse.ok || !presign.ok) {
        throw new Error(presign.error || 'Could not prepare audio upload for cleaning.');
      }

      const uploadResponse = await fetch(presign.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': uploadContentType },
        body: selectedAudio,
      });
      if (!uploadResponse.ok) {
        throw new Error('Audio upload failed.');
      }

      const cleanResponse = await fetch('/api/audio-clean', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaKey: presign.key,
          userId: userId || 'anonymous',
          audioCleanOptions: currentCleanOptions,
        }),
      });
      const cleanData = await cleanResponse.json();
      if (!cleanResponse.ok || !cleanData.ok) {
        throw new Error(cleanData.error || 'Audio cleaning failed.');
      }

      const cleanedAudioFetch = await fetch(cleanData.outputUrl);
      const cleanedBlob = await cleanedAudioFetch.blob();
      const cleanedFileName = `Cleaned_${selectedAudio.name.replace(/^Cleaned_/, '')}`;
      const cleanedFile = new File([cleanedBlob], cleanedFileName, {
        type: 'audio/mp3',
      });

      const newUrl = URL.createObjectURL(cleanedBlob);
      if (generatedVoiceMeta) {
        if (generatedVoiceAudioRef.current) {
          generatedVoiceAudioRef.current.pause();
          generatedVoiceAudioRef.current = null;
          setIsPlayingGeneratedVoice(false);
        }
        setGeneratedVoiceMeta({
          ...generatedVoiceMeta,
          audioUrl: newUrl,
        });
      }

      onSelectAudio(cleanedFile);
      const durationSaved = cleanData.stats?.durationSavedSeconds ||
        Math.max(0, Number(((cleanData.originalDuration || 0) - (cleanData.cleanedDuration || 0)).toFixed(1)));

      setAudioCleanSuccess({
        secondsSaved: durationSaved,
        silencesCut: cleanData.stats?.silencesCut || 0,
        cleanedDuration: cleanData.cleanedDuration || 0,
      });
    } catch (err: any) {
      console.error('Audio clean error:', err);
      setAudioCleanError(err.message || 'Failed to clean audio. Please try again.');
    } finally {
      setIsCleaningAudio(false);
    }
  };

  const SAMPLE_SCRIPTS = [
    { label: '🇮🇳 Hindi Story', text: 'सफलता की राह में सबसे बड़ा कदम वही होता है, जो आप खुद पर विश्वास करके उठाते हैं।' },
    { label: '🚀 Tech & AI', text: 'Artificial intelligence is changing the way human beings create, learn, and communicate with the world.' },
    { label: '💡 Motivation', text: 'Discipline is the bridge between your goals and your greatest accomplishments. Never stop moving forward.' },
    { label: '📜 History & Facts', text: 'Centuries ago, ancient travelers mapped the stars across the oceans to uncover uncharted lands.' },
  ];

  const filteredVoices = useMemo(() => {
    if (activeVoiceCategory === 'All') return GOOGLE_AI_VOICES;
    return GOOGLE_AI_VOICES.filter((v) => v.category === activeVoiceCategory);
  }, [activeVoiceCategory]);

  const handleToggleVoicePreview = (voice: GoogleAiVoice, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!voice.previewUrl) return;

    if (previewingVoiceId === voice.id) {
      if (voicePreviewAudioRef.current) {
        voicePreviewAudioRef.current.pause();
      }
      setPreviewingVoiceId(null);
    } else {
      if (!voicePreviewAudioRef.current) {
        voicePreviewAudioRef.current = new Audio();
      }
      voicePreviewAudioRef.current.pause();
      voicePreviewAudioRef.current.src = voice.previewUrl;
      voicePreviewAudioRef.current.play().catch((err) => {
        console.warn('Voice preview playback error:', err);
      });
      voicePreviewAudioRef.current.onended = () => {
        setPreviewingVoiceId(null);
      };
      setPreviewingVoiceId(voice.id);
    }
  };

  const handleGenerateAiVoice = async () => {
    if (!aiScriptText.trim()) {
      setTtsError('Please enter a script or narration text.');
      return;
    }
    setTtsError(null);
    setIsGeneratingTts(true);

    try {
      const res = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: aiScriptText.trim(),
          voiceId: selectedVoiceId,
          speakingRate: aiVoiceSpeed,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to synthesize speech');
      }

      // Convert Base64 to Blob & File
      const byteCharacters = atob(data.audioBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/mp3' });
      const chosenVoice = GOOGLE_AI_VOICES.find((v) => v.id === selectedVoiceId);
      const fileName = `${(chosenVoice?.name || 'AI_Voice').replace(/[^a-zA-Z0-9]/g, '_')}_${aiVoiceSpeed}x_Voiceover.mp3`;
      const audioFile = new File([blob], fileName, { type: 'audio/mp3' });

      // Create object URL for local playback
      const audioUrl = URL.createObjectURL(blob);
      setGeneratedVoiceMeta({
        voiceName: chosenVoice?.name || 'Google AI Voice',
        text: aiScriptText.trim(),
        audioUrl,
      });

      // Pass directly to studio audio handler
      onSelectAudio(audioFile);
    } catch (err: any) {
      console.error('Error generating AI voice:', err);
      setTtsError(err.message || 'Error communicating with Google Cloud TTS');
    } finally {
      setIsGeneratingTts(false);
    }
  };

  const handleTogglePlayGeneratedVoice = () => {
    if (!generatedVoiceMeta?.audioUrl) return;
    if (!generatedVoiceAudioRef.current) {
      generatedVoiceAudioRef.current = new Audio(generatedVoiceMeta.audioUrl);
      generatedVoiceAudioRef.current.playbackRate = aiVoiceSpeed;
      generatedVoiceAudioRef.current.onended = () => setIsPlayingGeneratedVoice(false);
    }

    if (isPlayingGeneratedVoice) {
      generatedVoiceAudioRef.current.pause();
      setIsPlayingGeneratedVoice(false);
    } else {
      generatedVoiceAudioRef.current.playbackRate = aiVoiceSpeed;
      generatedVoiceAudioRef.current.play().catch(console.error);
      setIsPlayingGeneratedVoice(true);
    }
  };

  useEffect(() => {
    return () => {
      if (voicePreviewAudioRef.current) {
        voicePreviewAudioRef.current.pause();
        voicePreviewAudioRef.current = null;
      }
      if (generatedVoiceAudioRef.current) {
        generatedVoiceAudioRef.current.pause();
        generatedVoiceAudioRef.current = null;
      }
    };
  }, []);

  // Credit pricing calculation: 1 minute = 2 credits
  const durationMinutes = Math.max(1, Math.ceil(estimatedDurationSeconds / 60));
  const creditCost = durationMinutes * 2;

  // Object URLs for image previews
  const imagePreviews = useMemo(() => {
    if (!Array.isArray(imageFiles)) return [];
    return imageFiles.filter(Boolean).map((file) => ({
      file,
      url: typeof window !== 'undefined' && file instanceof Blob ? URL.createObjectURL(file) : '',
      name: file.name || 'image',
    }));
  }, [imageFiles]);

  const customBgmUrl = useMemo(() => {
    return bgmFile && typeof window !== 'undefined' && bgmFile instanceof Blob ? URL.createObjectURL(bgmFile) : null;
  }, [bgmFile]);

  useEffect(() => {
    return () => {
      if (customBgmUrl) {
        URL.revokeObjectURL(customBgmUrl);
      }
    };
  }, [customBgmUrl]);

  const handleTogglePlay = (url: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!url) return;

    if (previewingTrackUrl === url) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setPreviewingTrackUrl(null);
    } else {
      if (!audioPlayerRef.current) {
        audioPlayerRef.current = new Audio();
      }
      audioPlayerRef.current.pause();
      audioPlayerRef.current.src = url;
      audioPlayerRef.current.volume = Math.min(1, Math.max(0.2, bgmVolume * 2.5));
      audioPlayerRef.current.play().catch((err) => {
        console.warn("Audio preview autoplay error:", err);
      });
      audioPlayerRef.current.onended = () => {
        setPreviewingTrackUrl(null);
      };
      setPreviewingTrackUrl(url);
    }
  };

  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!bgmEnabled && previewingTrackUrl) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setPreviewingTrackUrl(null);
    }
  }, [bgmEnabled, previewingTrackUrl]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── M3 Studio Header ── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1C1B1F] via-[#141218] to-[#0F0D13] p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-purple-300 backdrop-blur-md">
              <Sparkles size={13} className="text-purple-400" />
              <span>Material 3 AI Studio • 16:9 30 FPS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Image to Video AI
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Transform voiceover audio and images into a broadcast-ready 16:9 cinematic video.
              Every sentence of your script transitions seamlessly with Ken Burns pan/zoom, 2.5D parallax subtitles, and automated sound design.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md min-w-[200px]">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-400" /> Max Duration
                </span>
                <span className="text-white font-extrabold">30 Minutes</span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Zap size={13} className="text-purple-400" /> Credit Rate
                </span>
                <span className="text-purple-300 font-extrabold">1 Min = 2 Credits</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Topic / Video Title Input ── */}
      <div className="rounded-3xl border border-white/10 bg-[#141218] p-5 sm:p-6 shadow-md">
        <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">
          Project / Video Title (Optional)
        </label>
        <input
          type="text"
          value={topicTitle}
          onChange={(e) => onChangeTopicTitle(e.target.value)}
          placeholder="e.g. 5 Lessons From Steve Jobs, The Future of Artificial Intelligence..."
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
        />
      </div>

      {/* ── STEP 1: AUDIO READY (USER UPLOAD OR AI GENERATE) ── */}
      <div className="rounded-3xl border border-white/10 bg-[#141218] p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-xs font-black text-white">
              1
            </span>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Mic size={18} className="text-orange-400" />
                <span>Step 1: Audio Ready</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Upload your audio or generate studio speech using Google Cloud AI Voices
              </p>
            </div>
          </div>
          {selectedAudio ? (
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
              <CheckCircle2 size={14} />
              <span>Audio Ready</span>
            </span>
          ) : (
            <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-orange-300">
              Required
            </span>
          )}
        </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/5 p-1 mb-4">
              <button
                type="button"
                onClick={() => setAudioSourceMode('upload')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  audioSourceMode === 'upload'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <UploadCloud size={14} />
                <span>Upload Audio</span>
              </button>
              <button
                type="button"
                onClick={() => setAudioSourceMode('ai-voice')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  audioSourceMode === 'ai-voice'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles size={14} className={audioSourceMode === 'ai-voice' ? 'text-amber-200' : 'text-orange-400'} />
                <span>AI Voices (Google)</span>
              </button>
            </div>

            {/* TAB 1: UPLOAD AUDIO */}
            {audioSourceMode === 'upload' && (
              <div>
                <p className="text-xs text-zinc-400 mb-3">
                  Upload your pre-recorded spoken voiceover or podcast clip (MP3, WAV, M4A).
                </p>

                <input
                  type="file"
                  ref={audioInputRef}
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    onSelectAudio(file);
                    setGeneratedVoiceMeta(null);
                  }}
                />

                {!selectedAudio || generatedVoiceMeta ? (
                  <div
                    onClick={() => audioInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setAudioDragOver(true); }}
                    onDragLeave={() => setAudioDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setAudioDragOver(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file && file.type.startsWith('audio/')) {
                        onSelectAudio(file);
                        setGeneratedVoiceMeta(null);
                      }
                    }}
                    className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-7 text-center cursor-pointer transition-all duration-200 ${
                      audioDragOver ? 'border-orange-500 bg-orange-500/10' : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400 mb-2.5">
                      <UploadCloud size={22} />
                    </div>
                    <p className="text-sm font-bold text-white mb-1">
                      Click or drag audio file here
                    </p>
                    <p className="text-xs text-zinc-400">
                      MP3, WAV, M4A, AAC • Up to 30 minutes
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between rounded-2xl border border-orange-500/30 bg-orange-500/10 p-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
                          <Mic size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{selectedAudio.name}</p>
                          <p className="text-xs text-orange-300/90 font-semibold">
                            {(selectedAudio.size / (1024 * 1024)).toFixed(2)} MB • Audio Loaded
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleTogglePlayUploadedAudio}
                          className={`flex h-9 w-9 items-center justify-center rounded-xl transition cursor-pointer ${
                            isPlayingUploadedAudio
                              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                              : 'bg-orange-500 text-white hover:bg-orange-400 shadow-md shadow-orange-500/20'
                          }`}
                          title={isPlayingUploadedAudio ? "Pause" : "Play uploaded audio"}
                        >
                          {isPlayingUploadedAudio ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectAudio(null);
                            if (uploadedAudioRef.current) {
                              uploadedAudioRef.current.pause();
                              setIsPlayingUploadedAudio(false);
                            }
                          }}
                          className="p-2 text-zinc-400 hover:text-rose-400 transition cursor-pointer"
                          title="Remove audio"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: AI VOICES (GOOGLE CLOUD) */}
            {audioSourceMode === 'ai-voice' && (
              <div className="space-y-4">
                {/* If AI Audio already generated & active */}
                {generatedVoiceMeta && selectedAudio ? (
                  <div>
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                            <Check size={14} />
                          </span>
                          <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                            AI Voiceover Generated
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectAudio(null);
                            setGeneratedVoiceMeta(null);
                          }}
                          className="p-1.5 text-zinc-400 hover:text-rose-400 transition cursor-pointer"
                          title="Remove voiceover"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between rounded-xl bg-black/40 border border-white/10 p-3 mb-2">
                        <div className="min-w-0 pr-3">
                          <p className="text-sm font-bold text-white truncate">
                            {generatedVoiceMeta.voiceName}
                          </p>
                          <p className="text-xs text-zinc-400 line-clamp-1 italic">
                            &quot;{generatedVoiceMeta.text}&quot;
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleTogglePlayGeneratedVoice}
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition cursor-pointer ${
                            isPlayingGeneratedVoice
                              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                              : 'bg-orange-500 text-white hover:bg-orange-400 shadow-md shadow-orange-500/20'
                          }`}
                          title={isPlayingGeneratedVoice ? "Pause" : "Play generated audio"}
                        >
                          {isPlayingGeneratedVoice ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setGeneratedVoiceMeta(null)}
                        className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <RefreshCw size={12} /> Regenerate with different script or voice
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Script Input Area */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                          <FileText size={13} className="text-orange-400" />
                          <span>Video Script / Narration</span>
                        </label>
                        <span className={`text-[11px] font-medium ${aiScriptText.length > 4500 ? 'text-amber-400' : 'text-zinc-500'}`}>
                          {aiScriptText.length} / 5,000 chars
                        </span>
                      </div>

                      <textarea
                        rows={4}
                        maxLength={5000}
                        value={aiScriptText}
                        onChange={(e) => setAiScriptText(e.target.value)}
                        placeholder="Enter the voiceover script for your video... AI will speak this text with studio human emotion."
                        className="w-full rounded-2xl border border-white/10 bg-black/40 p-3.5 text-xs text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition resize-none leading-relaxed"
                      />

                      {/* Sample Script Quick Fillers */}
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-zinc-500">Quick Try:</span>
                        {SAMPLE_SCRIPTS.map((s, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAiScriptText(s.text)}
                            className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-zinc-300 hover:border-white/20 hover:text-white transition cursor-pointer"
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Voice Selection Section */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                          <Radio size={13} className="text-orange-400" />
                          <span>Select Google AI Voice</span>
                        </label>

                        {/* Category Filter Pills */}
                        <div className="flex items-center gap-1">
                          {(['All', 'Hindi', 'Indian English', 'Global English'] as const).map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setActiveVoiceCategory(cat)}
                              className={`rounded-lg px-2 py-0.5 text-[10px] font-bold transition cursor-pointer ${
                                activeVoiceCategory === cat
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-white/5 text-zinc-400 hover:text-white'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Voices Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 select-none">
                        {filteredVoices.map((voice) => {
                          const isSelected = selectedVoiceId === voice.id;
                          const isPlayingThis = previewingVoiceId === voice.id;

                          return (
                            <div
                              key={voice.id}
                              onClick={() => setSelectedVoiceId(voice.id)}
                              className={`group relative flex items-center justify-between rounded-xl border p-2.5 cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-orange-500 bg-orange-500/15 shadow-sm shadow-orange-500/10'
                                  : 'border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.08]'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 pr-2">
                                <span className="text-base select-none shrink-0">{voice.avatarFlag}</span>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <p className="text-xs font-bold text-white truncate">{voice.name}</p>
                                    <span className="text-[9px] font-semibold text-zinc-400 uppercase">
                                      {voice.gender === 'MALE' ? 'M' : 'F'}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-zinc-400 truncate">{voice.tag}</p>
                                </div>
                              </div>

                              {/* Play / Listen Preview Button */}
                              <button
                                type="button"
                                onClick={(e) => handleToggleVoicePreview(voice, e)}
                                title={isPlayingThis ? 'Pause sample' : 'Listen to voice sample'}
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition cursor-pointer ${
                                  isPlayingThis
                                    ? 'bg-rose-500 text-white shadow-sm animate-pulse'
                                    : isSelected
                                    ? 'bg-orange-500 text-white hover:bg-orange-400'
                                    : 'bg-white/10 text-zinc-300 hover:bg-white/20 hover:text-white'
                                }`}
                              >
                                {isPlayingThis ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pre-generation Speed Choice */}
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#1c1a24] p-2.5">
                      <div className="flex items-center gap-2">
                        <Zap size={14} className="text-orange-400" />
                        <span className="text-xs font-bold text-white">Voice Speed</span>
                      </div>
                      <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10">
                        {[
                          { val: 1.0 as const, label: "1.0x Normal" },
                          { val: 1.25 as const, label: "1.25x Crisp" },
                          { val: 1.5 as const, label: "1.5x Fast" },
                        ].map((sp) => (
                          <button
                            key={sp.val}
                            type="button"
                            onClick={() => setAiVoiceSpeed(sp.val)}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer ${
                              aiVoiceSpeed === sp.val
                                ? "bg-orange-500 text-white shadow-sm"
                                : "text-zinc-400 hover:text-white"
                            }`}
                          >
                            {sp.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Generate Button & Error */}
                    {ttsError && (
                      <p className="text-xs text-rose-400 font-medium">{ttsError}</p>
                    )}

                    <button
                      type="button"
                      disabled={isGeneratingTts || !aiScriptText.trim()}
                      onClick={handleGenerateAiVoice}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 px-4 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-orange-500/25 hover:from-orange-400 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                      {isGeneratingTts ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Generating Voiceover via Google Cloud...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          <span>Generate AI Voiceover</span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-500 font-medium">
              <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
              <span>Studio Neural2 audio powered by Google Cloud Text-to-Speech</span>
            </div>
      </div>

      {/* ── STEP 2: AUDIO OPTIMIZE (AUDIO CLEANER & SPACE-CUT) ── */}
      <div className="rounded-3xl border border-white/10 bg-[#141218] p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black text-white ${
              selectedAudio ? 'bg-amber-500' : 'bg-zinc-700'
            }`}>
              2
            </span>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Sliders size={18} className="text-amber-400" />
                <span>Step 2: Audio Optimize (Audio Cleaner)</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Auto-cuts awkward dead air &amp; silences, removes fan/room noise, and normalizes voice volume
              </p>
            </div>
          </div>
          <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
            Studio AI Cleaner
          </span>
        </div>

        {!selectedAudio ? (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center text-zinc-500 text-xs">
            <Sliders size={24} className="mx-auto mb-2 opacity-40 text-zinc-400" />
            <p className="font-semibold text-zinc-400">Audio Not Ready Yet</p>
            <p className="text-[11px] text-zinc-500 mt-1">Please complete Step 1 (Upload or Generate Audio) first to optimize and clean audio.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 6 Toggles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {/* 1. Silence Trimming */}
              <div
                onClick={() => handleToggleCleanOption("removeSilence")}
                className="flex cursor-pointer items-start justify-between rounded-xl border border-white/10 bg-[#22202c] p-2.5 transition hover:border-white/20 select-none"
              >
                <div className="space-y-0.5 pr-2">
                  <p className="text-xs font-bold text-white">Smart Silence Trimming</p>
                  <p className="text-[10px] text-zinc-400">Cuts dead air &gt; 1.0s (Space Cut)</p>
                </div>
                <div className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${currentCleanOptions.removeSilence ? "bg-orange-500" : "bg-zinc-700"}`}>
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${currentCleanOptions.removeSilence ? "left-4" : "left-0.5"}`} />
                </div>
              </div>

              {/* 2. Noise Removal */}
              <div
                onClick={() => handleToggleCleanOption("noiseReduction")}
                className="flex cursor-pointer items-start justify-between rounded-xl border border-white/10 bg-[#22202c] p-2.5 transition hover:border-white/20 select-none"
              >
                <div className="space-y-0.5 pr-2">
                  <p className="text-xs font-bold text-white">Background Noise Removal</p>
                  <p className="text-[10px] text-zinc-400">Spectral de-noise fan, hiss &amp; hum</p>
                </div>
                <div className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${currentCleanOptions.noiseReduction ? "bg-orange-500" : "bg-zinc-700"}`}>
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${currentCleanOptions.noiseReduction ? "left-4" : "left-0.5"}`} />
                </div>
              </div>

              {/* 3. Studio Loudness */}
              <div
                onClick={() => handleToggleCleanOption("volumeNormalize")}
                className="flex cursor-pointer items-start justify-between rounded-xl border border-white/10 bg-[#22202c] p-2.5 transition hover:border-white/20 select-none"
              >
                <div className="space-y-0.5 pr-2">
                  <p className="text-xs font-bold text-white">Studio Loudness &amp; EQ</p>
                  <p className="text-[10px] text-zinc-400">-16 LUFS broadcast curve</p>
                </div>
                <div className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${currentCleanOptions.volumeNormalize ? "bg-orange-500" : "bg-zinc-700"}`}>
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${currentCleanOptions.volumeNormalize ? "left-4" : "left-0.5"}`} />
                </div>
              </div>

              {/* 4. Remove Fillers */}
              <div
                onClick={() => handleToggleCleanOption("removeFillers")}
                className="flex cursor-pointer items-start justify-between rounded-xl border border-white/10 bg-[#22202c] p-2.5 transition hover:border-white/20 select-none"
              >
                <div className="space-y-0.5 pr-2">
                  <p className="text-xs font-bold text-white">Remove Vocal Fillers</p>
                  <p className="text-[10px] text-zinc-400">Cuts &quot;um&quot;, &quot;uh&quot;, &quot;matlab&quot;</p>
                </div>
                <div className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${currentCleanOptions.removeFillers ? "bg-orange-500" : "bg-zinc-700"}`}>
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${currentCleanOptions.removeFillers ? "left-4" : "left-0.5"}`} />
                </div>
              </div>

              {/* 5. Remove Repeats */}
              <div
                onClick={() => handleToggleCleanOption("removeRepeats")}
                className="flex cursor-pointer items-start justify-between rounded-xl border border-white/10 bg-[#22202c] p-2.5 transition hover:border-white/20 select-none"
              >
                <div className="space-y-0.5 pr-2">
                  <p className="text-xs font-bold text-white">Remove Retakes &amp; Stutters</p>
                  <p className="text-[10px] text-zinc-400">Auto-cuts repeated mistakes</p>
                </div>
                <div className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${currentCleanOptions.removeRepeats ? "bg-orange-500" : "bg-zinc-700"}`}>
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${currentCleanOptions.removeRepeats ? "left-4" : "left-0.5"}`} />
                </div>
              </div>

              {/* 6. Trim Ends */}
              <div
                onClick={() => handleToggleCleanOption("trimEnds")}
                className="flex cursor-pointer items-start justify-between rounded-xl border border-white/10 bg-[#22202c] p-2.5 transition hover:border-white/20 select-none"
              >
                <div className="space-y-0.5 pr-2">
                  <p className="text-xs font-bold text-white">Trim Start &amp; End Air</p>
                  <p className="text-[10px] text-zinc-400">Cuts mic warm-up and trailing silence</p>
                </div>
                <div className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${currentCleanOptions.trimEnds ? "bg-orange-500" : "bg-zinc-700"}`}>
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${currentCleanOptions.trimEnds ? "left-4" : "left-0.5"}`} />
                </div>
              </div>
            </div>

            {/* Clean Success Badge */}
            {audioCleanSuccess && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-300">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>
                  Audio Cleaned! Cut {audioCleanSuccess.silencesCut} awkward pauses • Saved {audioCleanSuccess.secondsSaved}s dead air.
                </span>
              </div>
            )}

            {/* Clean Error Message */}
            {audioCleanError && (
              <p className="text-xs text-rose-400 font-medium">{audioCleanError}</p>
            )}

            {/* Clean Action Button */}
            <button
              type="button"
              disabled={isCleaningAudio}
              onClick={handleCleanAudioNow}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-amber-500/40 bg-amber-500/15 py-3 px-4 text-xs font-bold text-amber-300 hover:bg-amber-500/25 disabled:opacity-50 transition cursor-pointer"
            >
              {isCleaningAudio ? (
                <>
                  <Loader2 size={16} className="animate-spin text-amber-400" />
                  <span>Auto-Cleaning Audio (Trimming Silences &amp; Denoising)...</span>
                </>
              ) : (
                <>
                  <Zap size={16} className="text-amber-400" />
                  <span>⚡ Auto Clean Audio (Apply Space-Cut &amp; Denoise)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ── STEP 3: AUDIO SPEED (1.0x, 1.25x, 1.5x) ── */}
      <div className="rounded-3xl border border-white/10 bg-[#141218] p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black text-white ${
              selectedAudio ? 'bg-orange-500' : 'bg-zinc-700'
            }`}>
              3
            </span>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Zap size={18} className="text-orange-400" />
                <span>Step 3: Audio Speed</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Speed up voiceover for energetic pacing with natural human pitch preserved
              </p>
            </div>
          </div>
          <span className="rounded-full bg-orange-500/10 border border-orange-500/30 px-2.5 py-0.5 text-[10px] font-bold text-orange-300">
            3 Speeds Only
          </span>
        </div>

        {!selectedAudio ? (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center text-zinc-500 text-xs">
            <Zap size={24} className="mx-auto mb-2 opacity-40 text-zinc-400" />
            <p className="font-semibold text-zinc-400">Audio Not Ready Yet</p>
            <p className="text-[11px] text-zinc-500 mt-1">Please complete Step 1 to choose playback &amp; export speed.</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#1c1a24] p-4">
            <div>
              <p className="text-xs font-bold text-white">Voice Playback &amp; Export Speed</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {aiVoiceSpeed === 1.25 ? "⚡ 1.25x Crisp active (keeps audience attentive & engaged)" : `Speed set to ${aiVoiceSpeed}x`}
              </p>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 p-1.5 shrink-0">
              {[
                { val: 1.0 as const, label: "1.0x Normal" },
                { val: 1.25 as const, label: "1.25x Crisp (Recommended)" },
                { val: 1.5 as const, label: "1.5x Fast" },
              ].map((sp) => (
                <button
                  key={sp.val}
                  type="button"
                  disabled={isAdjustingSpeed || isGeneratingTts}
                  onClick={() => handleChangeVoiceSpeed(sp.val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    aiVoiceSpeed === sp.val
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {isAdjustingSpeed && (
          <div className="flex items-center gap-2 text-xs text-orange-300 font-medium">
            <Loader2 size={14} className="animate-spin text-orange-400" />
            <span>Regenerating speech at {aiVoiceSpeed}x via Google Cloud TTS...</span>
          </div>
        )}
      </div>

      {/* ── STEP 4: VIDEO BANANA (VISUALS, FRAMING, MUSIC & RENDER) ── */}
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 px-1">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-500 text-xs font-black text-white">
            4
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Film size={20} className="text-purple-400" />
              <span>Step 4: Video Banana (Visuals, Music &amp; Render)</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Customize scene images, 16:9 framing, background music, animated subtitles and generate video
            </p>
          </div>
        </div>

        {/* 4.1 Visual Scene Images - 3 Clean Options */}
        <div className="rounded-3xl border border-white/10 bg-[#141218] p-5 sm:p-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                <ImagePlus size={18} className="text-orange-400" /> Visual Scene Assets
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Choose how scenes for your 16:9 widescreen video are sourced
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-orange-400">
                {activeAssetMode === 'ai-generate' ? '+3 Credits (AI)' : 'Included Free'}
              </span>
            </div>
          </div>

          {/* 3 Segmented Tabs */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5">
            <button
              type="button"
              onClick={() => setAssetMode('upload')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 rounded-xl py-2.5 px-2 text-xs font-bold transition-all cursor-pointer ${
                activeAssetMode === 'upload'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <UploadCloud size={15} />
              <span className="truncate">Upload Photos</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeAssetMode === 'upload' ? 'bg-black/20 text-white' : 'bg-emerald-500/10 text-emerald-400'
              }`}>
                Free
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAssetMode('library')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 rounded-xl py-2.5 px-2 text-xs font-bold transition-all cursor-pointer ${
                activeAssetMode === 'library'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers size={15} />
              <span className="truncate">ItnaVideo Assets</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeAssetMode === 'library' ? 'bg-black/20 text-white' : 'bg-amber-500/10 text-amber-400'
              }`}>
                Curated
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAssetMode('ai-generate')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 rounded-xl py-2.5 px-2 text-xs font-bold transition-all cursor-pointer ${
                activeAssetMode === 'ai-generate'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles size={15} />
              <span className="truncate">AI Generate</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeAssetMode === 'ai-generate' ? 'bg-black/20 text-white' : 'bg-orange-500/10 text-orange-400'
              }`}>
                +3 Cr
              </span>
            </button>
          </div>

          {/* TAB 1: UPLOAD PHOTOS */}
          {activeAssetMode === 'upload' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <input
                type="file"
                ref={imageInputRef}
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onAddImages(e.target.files)}
              />

              <div
                onClick={() => imageInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setImageDragOver(true); }}
                onDragLeave={() => setImageDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setImageDragOver(false);
                  onAddImages(e.dataTransfer.files);
                }}
                className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 ${
                  imageDragOver
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-white/15 bg-white/5 hover:border-orange-500/40 hover:bg-white/[0.08]'
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400 mb-2">
                  <UploadCloud size={20} />
                </div>
                <p className="text-xs font-bold text-white mb-0.5">
                  Click or drag your photos/screenshots here
                </p>
                <p className="text-[11px] text-zinc-400">
                  Upload any number of images (JPG, PNG, WEBP) • Auto-scaled to 16:9
                </p>
              </div>

              {imagePreviews.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-bold">
                    <span>{imagePreviews.length} custom photo{imagePreviews.length === 1 ? '' : 's'} added</span>
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="text-orange-400 hover:text-orange-300 font-bold transition cursor-pointer"
                    >
                      + Add More
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-40 overflow-y-auto p-1">
                    {imagePreviews.map((img, idx) => (
                      <div key={idx} className="group relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40">
                        <Image
                          src={img.url}
                          alt={img.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveImage(idx);
                          }}
                          className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-rose-600 cursor-pointer"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-zinc-400">
                  <Info size={14} className="text-orange-400 shrink-0" />
                  <span>No photos uploaded yet. If you keep this empty, video will automatically use ItnaVideo stock assets.</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ITNAVIDEO STOCK ASSETS */}
          {activeAssetMode === 'library' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {ITNAVIDEO_STOCK_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveStockCategory(cat.id)}
                    className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      activeStockCategory === cat.id
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-xs'
                        : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Selection Status Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-orange-500/20 bg-orange-500/5 p-3 text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Sparkles size={15} className="text-orange-400 shrink-0" />
                  {currentStockUrls.length > 0 ? (
                    <span>
                      <strong className="text-white font-black">{currentStockUrls.length} image{currentStockUrls.length === 1 ? '' : 's'} selected</strong> for video scenes
                    </span>
                  ) : (
                    <span>
                      <strong className="text-orange-300 font-bold">AI Auto-Match Active:</strong> AI will automatically select the best matching 16:9 scenes for your script.
                    </span>
                  )}
                </div>
                {currentStockUrls.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setStockUrls([])}
                    className="text-xs text-orange-400 hover:text-orange-300 font-bold underline cursor-pointer"
                  >
                    Reset to Auto-Match
                  </button>
                )}
              </div>

              {/* Curated Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto p-1 pr-1.5">
                {filteredStockAssets.map((asset) => {
                  const isSelected = currentStockUrls.includes(asset.url);
                  return (
                    <div
                      key={asset.id}
                      onClick={() => handleToggleStockAsset(asset.url)}
                      className={`group relative aspect-video rounded-xl overflow-hidden border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-orange-500 ring-2 ring-orange-500/50 shadow-md shadow-orange-950/40'
                          : 'border-white/10 hover:border-white/30 hover:scale-[1.02]'
                      }`}
                    >
                      <Image
                        src={asset.url}
                        alt={asset.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition" />
                      
                      {/* Selection Checkmark */}
                      {isSelected ? (
                        <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full border border-white/40 bg-black/40 opacity-0 group-hover:opacity-100 transition" />
                      )}

                      <span className="absolute bottom-1.5 left-2 right-2 truncate text-[10px] font-bold text-white drop-shadow">
                        {asset.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: AI GENERATE IMAGES */}
          {activeAssetMode === 'ai-generate' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-3.5 space-y-1">
                <div className="flex items-center gap-2 text-xs font-black text-orange-300">
                  <Sparkles size={14} className="text-orange-400" />
                  <span>AI Image Diffusion Engine (+3 Credits)</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Generates 5 unique photorealistic 16:9 widescreen scenes tailored to your exact script and topic.
                </p>
              </div>

              {/* Prompt Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                  <label htmlFor="ai-img-prompt">Scene Visual Description / Prompt</label>
                  {(topicTitle || aiScriptText) && (
                    <button
                      type="button"
                      onClick={() => setAiImagePrompt(topicTitle || aiScriptText.slice(0, 100))}
                      className="text-orange-400 hover:text-orange-300 text-[11px] underline cursor-pointer"
                    >
                      Use Script / Topic
                    </button>
                  )}
                </div>
                <textarea
                  id="ai-img-prompt"
                  value={aiImagePrompt}
                  onChange={(e) => setAiImagePrompt(e.target.value)}
                  placeholder="e.g. Cinematic futuristic trading desk with glowing stock charts, cinematic lighting, 8K ultra-detailed photorealistic..."
                  rows={2}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition resize-none"
                />
              </div>

              {/* Style Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Art Style Preset</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Photorealistic 8K',
                    'Cinematic 3D',
                    'Documentary Realism',
                    'Cyberpunk Neon',
                    'Minimal Studio',
                  ].map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setAiImageStyle(style)}
                      className={`rounded-xl px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                        aiImageStyle === style
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-zinc-400">
                <CheckCircle2 size={14} className="text-orange-400 shrink-0" />
                <span>
                  Pricing: <strong>2 base credits</strong> (video render) + <strong>3 credits</strong> (5 AI images) = <strong>5 credits total</strong>.
                </span>
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center gap-2 text-[11px] text-zinc-500 font-medium border-t border-white/5">
            <CheckCircle2 size={13} className="text-orange-400 shrink-0" />
            <span>All scenes automatically apply smooth Ken Burns pan & zoom with 16:9 widescreen composition</span>
          </div>
        </div>

        {/* 4.2 Framing & Camera Motion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 16:9 FRAMING & 9:16 FIT */}
        <div className="rounded-3xl border border-white/10 bg-[#141218] p-5 shadow-md space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Maximize2 size={16} className="text-cyan-400" />
            <span>16:9 Framing & 9:16 Fit</span>
          </div>
          <div className="space-y-2">
            {[
              {
                id: 'blur-fill',
                title: 'Smart Blur Fit (9:16 Safe)',
                desc: 'Full 16:9 ambient backdrop. The entire vertical image fits without cropping.',
                badge: 'Recommended',
              },
              {
                id: 'cover',
                title: 'Cinema Full Cover',
                desc: 'Edge-to-edge 16:9 widescreen crop with smooth Ken Burns motion.',
              },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onChangeFitMode?.(option.id as 'blur-fill' | 'cover')}
                className={`w-full text-left rounded-2xl p-3 border transition-all duration-150 cursor-pointer ${
                  fitMode === option.id
                    ? 'border-cyan-400 bg-cyan-400/10 text-white'
                    : 'border-white/5 bg-white/[0.03] text-zinc-400 hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white">{option.title}</p>
                  {option.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {option.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* CAMERA MOTION */}
        <div className="rounded-3xl border border-white/10 bg-[#141218] p-5 shadow-md space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Camera size={16} className="text-amber-400" />
            <span>Camera Motion & Pan</span>
          </div>
          <div className="space-y-2">
            {[
              { id: 'ken-burns', title: 'Ken Burns Cinematic', desc: 'Slow zoom (1.0x to 1.2x) & horizontal drift' },
              { id: 'dynamic-flow', title: 'Dynamic Rush', desc: 'Alternating zooms, fast pans & slide cuts' },
              { id: 'subtle-drift', title: 'Subtle Float', desc: 'Ultra-gentle zoom for professional focus' },
            ].map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onChangeCameraMotionPreset(preset.id)}
                className={`w-full text-left rounded-2xl p-3 border transition-all duration-150 cursor-pointer ${
                  cameraMotionPreset === preset.id
                    ? 'border-amber-400 bg-amber-400/10 text-white'
                    : 'border-white/5 bg-white/[0.03] text-zinc-400 hover:border-white/15'
                }`}
              >
                <p className="text-xs font-bold text-white">{preset.title}</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">{preset.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Background Music Studio (Library Tracks with Live Player, Custom Upload & Toggle) ── */}
      <div className="rounded-3xl border border-white/10 bg-[#141218] p-5 sm:p-6 shadow-md space-y-5">
        {/* Header & Master Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
              <Music2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white">Background Music (BGM)</h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Royalty-Free &amp; Ducking
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Listen and select from curated tracks, upload your own music, or turn BGM off if you only want voiceover.
              </p>
            </div>
          </div>

          {/* Master BGM Toggle Button */}
          <button
            type="button"
            onClick={() => {
              const nextState = !bgmEnabled;
              onChangeBgmEnabled?.(nextState);
              if (!nextState && previewingTrackUrl) {
                audioPlayerRef.current?.pause();
                setPreviewingTrackUrl(null);
              }
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-black transition-all cursor-pointer shrink-0 ${
              bgmEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(52,211,153,0.15)]'
                : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10'
            }`}
          >
            {bgmEnabled ? (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                <span>BGM: ON</span>
              </>
            ) : (
              <>
                <VolumeX size={14} className="text-zinc-400" />
                <span>BGM: OFF (Muted)</span>
              </>
            )}
          </button>
        </div>

        {/* Disabled State Banner */}
        {!bgmEnabled ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-zinc-400 mx-auto">
              <VolumeX size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Background Music is Turned OFF</p>
              <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                No music track will be added. Your video will render with 100% clean speech voiceover and sound effects.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onChangeBgmEnabled?.(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:bg-emerald-500/25 transition cursor-pointer"
            >
              Turn Background Music ON
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Tab Switcher: Library vs Custom Upload */}
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/[0.03] border border-white/5 w-fit">
              <button
                type="button"
                onClick={() => setBgmSourceTab('library')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  bgmSourceTab === 'library'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                🎵 Itnavideo Music Library ({ITNAVIDEO_LIBRARY_BGM.length} Tracks)
              </button>
              <button
                type="button"
                onClick={() => setBgmSourceTab('custom')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  bgmSourceTab === 'custom'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                📤 Upload Your Own Music {bgmFile ? '✓' : ''}
              </button>
            </div>

            {/* TAB 1: Library Tracks Grid with Live Audio Preview Player */}
            {bgmSourceTab === 'library' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Click ▶ to preview track audio. Click a card to select it for your video:</span>
                  <span className="text-[11px] font-bold text-emerald-400">
                    Selected: {ITNAVIDEO_LIBRARY_BGM.find((t) => t.url === selectedLibraryBgmUrl)?.name || 'Default'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  {ITNAVIDEO_LIBRARY_BGM.map((track) => {
                    const isSelected = selectedLibraryBgmUrl === track.url && !bgmFile;
                    const isPlaying = previewingTrackUrl === track.url;

                    return (
                      <div
                        key={track.id}
                        onClick={() => {
                          onChangeSelectedLibraryBgmUrl?.(track.url);
                          // Clear custom file when user picks library track
                          if (bgmFile) onSelectBgm(null);
                        }}
                        className={`group relative flex flex-col justify-between p-3 rounded-2xl border transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(52,211,153,0.15)] ring-1 ring-emerald-400/40'
                            : 'border-white/5 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          {/* Play / Pause Preview Button */}
                          <button
                            type="button"
                            title={isPlaying ? 'Pause preview' : 'Play preview'}
                            onClick={(e) => handleTogglePlay(track.url, e)}
                            className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 transition-transform active:scale-95 cursor-pointer ${
                              isPlaying
                                ? 'bg-emerald-400 text-black shadow-[0_0_12px_rgba(52,211,153,0.6)] animate-pulse'
                                : 'bg-white/10 text-white hover:bg-emerald-400 hover:text-black'
                            }`}
                          >
                            {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                          </button>

                          {/* Selected Check Indicator */}
                          <div className="shrink-0">
                            {isSelected ? (
                              <CheckCircle2 size={16} className="text-emerald-400" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border border-white/20 group-hover:border-white/40" />
                            )}
                          </div>
                        </div>

                        {/* Track Info */}
                        <div className="mt-2.5">
                          <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                            {track.name}
                          </p>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="text-[10px] text-zinc-400">{track.mood}</span>
                            {isPlaying && (
                              <span className="text-[10px] text-emerald-400 font-extrabold animate-pulse">
                                Playing...
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: Custom BGM Upload */}
            {bgmSourceTab === 'custom' && (
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 space-y-3">
                <input
                  type="file"
                  ref={bgmInputRef}
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    onSelectBgm(file);
                    if (previewingTrackUrl) {
                      audioPlayerRef.current?.pause();
                      setPreviewingTrackUrl(null);
                    }
                  }}
                />

                {!bgmFile ? (
                  <div className="text-center py-4 space-y-2">
                    <button
                      type="button"
                      onClick={() => bgmInputRef.current?.click()}
                      className="mx-auto flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-xs font-bold text-zinc-200 hover:bg-white/10 hover:border-emerald-400/40 transition cursor-pointer"
                    >
                      <UploadCloud size={16} className="text-emerald-400" />
                      <span>Choose Audio File from Computer (MP3, WAV, AAC)</span>
                    </button>
                    <p className="text-[11px] text-zinc-500">
                      Your audio track will loop seamlessly under your video.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                    <div className="flex items-center gap-3">
                      {customBgmUrl && (
                        <button
                          type="button"
                          onClick={(e) => handleTogglePlay(customBgmUrl, e)}
                          className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 transition-transform active:scale-95 cursor-pointer ${
                            previewingTrackUrl === customBgmUrl
                              ? 'bg-emerald-400 text-black shadow-[0_0_12px_rgba(52,211,153,0.6)] animate-pulse'
                              : 'bg-white/10 text-white hover:bg-emerald-400 hover:text-black'
                          }`}
                        >
                          {previewingTrackUrl === customBgmUrl ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                        </button>
                      )}
                      <div>
                        <p className="text-xs font-bold text-white truncate max-w-[240px] sm:max-w-md">{bgmFile.name}</p>
                        <p className="text-[10px] text-emerald-400 font-semibold">Custom Track Uploaded &amp; Active</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectBgm(null);
                        if (previewingTrackUrl === customBgmUrl) {
                          audioPlayerRef.current?.pause();
                          setPreviewingTrackUrl(null);
                        }
                      }}
                      className="text-zinc-400 hover:text-rose-400 text-xs font-bold cursor-pointer px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Row: Volume Slider & Auto-Ducking Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-zinc-300 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Volume2 size={14} className="text-emerald-400" /> BGM Mix Volume
                  </span>
                  <span className="text-emerald-300 font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                    {Math.round(bgmVolume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.05"
                  value={bgmVolume}
                  onChange={(e) => onChangeBgmVolume(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2.5 rounded-2xl border border-white/5 bg-white/[0.02] p-3 text-[11px] text-zinc-400">
                <Sparkles size={16} className="text-emerald-400 shrink-0" />
                <span>
                  <strong className="text-zinc-200">AI Auto-Ducking:</strong> Music volume dips 70% automatically whenever speech voiceover is detected so narration is always loud and clear.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 2.5D Kinetic & Parallax Caption Styles with Live Visual Previews ── */}
      <div className="rounded-3xl border border-white/10 bg-[#141218] p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 shrink-0">
              <Layers size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white">Caption &amp; Subtitle Styles</h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Live Visual Preview
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Choose how spoken words appear on your 16:9 video. Click any card to preview and apply to your render.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-zinc-400 hidden sm:block">
            Selected: <span className="text-purple-300 font-extrabold">{IMAGE_TO_VIDEO_SUBTITLE_STYLES.find(s => s.id === subtitleStyle)?.title || subtitleStyle}</span>
          </span>
        </div>

        {/* 5-Column Grid of 16:9 Live Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 pt-1">
          {IMAGE_TO_VIDEO_SUBTITLE_STYLES.map((style) => {
            const isSelected = subtitleStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onChangeSubtitleStyle(style.id)}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border text-left transition-all duration-200 cursor-pointer p-3 select-none ${
                  isSelected
                    ? "border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/40 shadow-lg shadow-purple-950/40"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                {/* 16:9 Simulated Video Screen Preview */}
                <div className={`relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br ${style.previewBg} border border-white/10 flex flex-col justify-between p-2.5 transition-transform duration-200 group-hover:scale-[1.02]`}>
                  {/* Aspect tag & Selected Check */}
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/60 text-zinc-400 border border-white/5">
                      16:9 Subtitles
                    </span>
                    {isSelected ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-white shadow-md">
                        <CheckCircle2 size={13} strokeWidth={3} />
                      </span>
                    ) : null}
                  </div>

                  {/* Subtitle Representation positioned at bottom third */}
                  <div className="flex justify-center pb-1">
                    <div className={`${style.containerClass} transition-transform duration-200 group-hover:scale-105`}>
                      <span className={`${style.textClass} text-[11px] leading-tight block text-center truncate max-w-[130px]`}>
                        {style.previewSample}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Title & Description */}
                <div className="mt-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-bold transition-colors ${isSelected ? "text-white" : "text-zinc-200 group-hover:text-white"}`}>
                      {style.title}
                    </p>
                    {style.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10">
                        {style.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {style.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── M3 Tonal Action Card with Credit Cost & Render Trigger ── */}
      <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-r from-orange-950/40 via-amber-950/20 to-black p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-orange-400 animate-pulse" />
            <h4 className="text-lg font-black text-white">Ready to Render Image to Video AI</h4>
          </div>
          <p className="text-xs text-zinc-400">
            16:9 Widescreen • 30 FPS • Auto-scene cuts synced to script • Ken Burns Camera Motion
          </p>
          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-bold">
            <span className="text-orange-400">⚡ Total Cost: {creditCost} credits</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400">
              ({baseCreditCost} render {isAiImages ? '+ 3 AI generated scenes' : '+ free assets'})
            </span>
            {userCredits !== undefined && (
              <>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400">Your balance: {userCredits} credits</span>
                <span className="text-zinc-500">•</span>
                <span className={userCredits >= creditCost ? 'text-emerald-400' : 'text-rose-400'}>
                  {userCredits >= creditCost ? `${userCredits - creditCost} remaining` : 'Insufficient credits'}
                </span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onStartRender}
          disabled={!selectedAudio || isRendering || (userCredits !== undefined && userCredits < creditCost)}
          className={`inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-4 text-sm font-black shadow-lg transition-all duration-200 cursor-pointer ${
            !selectedAudio || isRendering || (userCredits !== undefined && userCredits < creditCost)
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5'
              : 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-95'
          }`}
        >
          {isRendering ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Rendering Image to Video AI...</span>
            </>
          ) : (
            <>
              <span>Generate Image to Video AI (16:9)</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  </div>
);
}

export default ImageToVideoStudio;
