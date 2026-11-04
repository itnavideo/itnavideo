import { WatermarkRemoverToggle } from "@/components/dashboard/WatermarkRemoverToggle";
'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Mic,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Play,
  Pause,
  Upload,
  X,
  Music,
  ChevronRight,
  ChevronLeft,
  Plus,
  ArrowRight,
  Film,
  Layers,
  Zap,
  Eye,
  Trash2,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  FileText,
  Lock,
  Edit3,
  Sliders,
  Check,
  CheckCheck,
  RotateCcw,
  Clock,
  Tag,
} from 'lucide-react';
import { BorderBeam } from "@/components/magicui/BorderBeam";

export type ImageToVideoAssetMode = "default_stock" | "custom_upload" | "library" | "upload" | "mix" | "ai-generate";

export interface LibraryBgmTrack {
  id: string;
  label: string;
  category: string;
  path: string;
  desc: string;
}

// Master AWS S3 Media Library Background Music Tracks
export const AWS_BGM_TRACKS: LibraryBgmTrack[] = [
  { id: 'parasail', label: 'Calm Lofi (Recommended)', category: 'Lo-Fi', path: 'assets/reusable/music/parasail-silent-partner.mp3', desc: 'Warm acoustic lofi guitar' },
  { id: '19th-floor', label: 'Deep Focus & Ambient', category: 'Piano', path: 'assets/reusable/music/19th-floor-bobby-richards.mp3', desc: 'Inspiring subtle piano tone' },
  { id: 'dutty-vibe', label: 'Optimistic Beat', category: 'Upbeat', path: 'assets/reusable/music/dutty-vibe-tracks.mp3', desc: 'Gentle positive acoustic rhythm' },
  { id: 'book-rental', label: 'Energetic Storyteller', category: 'Narrative', path: 'assets/reusable/music/book-the-rental-wit-it-rage.mp3', desc: 'Dynamic narrative flow' },
  { id: 'crimson-fly', label: 'Cinematic Drama', category: 'Cinematic', path: 'assets/reusable/music/crimson-fly-huma-huma.mp3', desc: 'Emotional documentary drive' },
  { id: 'crock-pot', label: 'Funky Chill Groove', category: 'Chill', path: 'assets/reusable/music/crock-pot-diamond-ortiz.mp3', desc: 'Playful lofi pulse' },
  { id: 'illusions', label: 'Modern Swagger Beat', category: 'Beats', path: 'assets/reusable/music/illusions-anno-domini-beats.mp3', desc: 'Modern high-production beat' },
  { id: 'not-for-nothing', label: 'Lounge Instrumental', category: 'Lounge', path: 'assets/reusable/music/not-for-nothing-otis-mcdonald.mp3', desc: 'Smooth brass & relaxed tempo' },
  { id: 'something-going', label: 'Philosophical Mystery', category: 'Deep', path: 'assets/reusable/music/something-is-going-on-godmode.mp3', desc: 'Pensive intrigue & discovery' },
  { id: 'bar-scene', label: 'Acoustic Folk', category: 'Acoustic', path: 'assets/reusable/music/that-one-bar-scene-rkvc.mp3', desc: 'Warm acoustic guitar storytelling' },
  { id: 'true-messiah', label: 'Victorious Inspiration', category: 'Epic', path: 'assets/reusable/music/true-messiah-dj-freedem.mp3', desc: 'Triumphant motivational melody' },
  { id: 'vishnu', label: 'Zen Reflection', category: 'Zen', path: 'assets/reusable/music/vishnu-patrick-patrikios.mp3', desc: 'Serene ambient meditation' },
  { id: 'what-it-is', label: 'Smooth Motown', category: 'Motown', path: 'assets/reusable/music/what-it-is-silent-partner.mp3', desc: 'Catchy positive baseline' },
  { id: 'none', label: 'No Background Music', category: 'Mute', path: 'none', desc: 'Pure spoken narration voiceover only' },
];

export const ITNAVIDEO_LIBRARY_BGM = AWS_BGM_TRACKS;

// 20 Master YouTube 16:9 Caption Styles
export const TWENTY_CAPTION_STYLES = [
  { id: 'glow-viral', name: 'Flame Glow Yellow', category: 'Viral', color: '#FFD700', badge: 'Popular', desc: 'High-energy glowing yellow active word highlight' },
  { id: 'mrbeast', name: 'MrBeast Yellow Box', category: 'Viral', color: '#FFEB3B', badge: 'Creator', desc: 'Punchy yellow bounding box with bold pop' },
  { id: 'netflix-yellow', name: 'Cinema Gold Subtitle', category: 'Cinema', color: '#FACC15', badge: 'Clean', desc: 'Classic yellow bold font with black outline' },
  { id: 'hormozi-bold', name: 'Hormozi Lime Punch', category: 'Viral', color: '#22C55E', badge: 'Retention', desc: 'High-contrast punchy green & yellow caps' },
  { id: 'neon-city', name: 'Cyberpunk Electric Cyan', category: 'Modern', color: '#00F0FF', badge: 'Glow', desc: 'Cyan and magenta neon electric pulse' },
  { id: 'daily-look', name: 'Sunny Vlog Rounded', category: 'Friendly', color: '#FDE047', badge: 'Vlog', desc: 'Friendly rounded stroke with sunny glow' },
  { id: 'blockbuster', name: 'Blockbuster Flame', category: 'News', color: '#FF5722', badge: 'Bold', desc: 'Heavyweight slab headlines with Flame Orange' },
  { id: 'handwriting-pop', name: 'Organic Script Pop', category: 'Creative', color: '#FB7185', badge: 'Script', desc: 'Authentic cursive handwriting with dynamic line' },
  { id: 'vox-docu', name: 'Vox Documentary Serif', category: 'Editorial', color: '#FFFFFF', badge: 'Docu', desc: 'Editorial serif with dark glass backdrop' },
  { id: 'minimal-clean', name: 'Minimal Ice Blue', category: 'Modern', color: '#38BDF8', badge: 'Minimal', desc: 'Ultra-crisp modern sans-serif with slate pill' },
  { id: 'cyber-ops', name: 'Radar Military Green', category: 'Tech', color: '#4ADE80', badge: 'Tech', desc: 'High-tech stencil with radar green glow' },
  { id: 'premium-gold', name: 'Wealth Metallic Gold', category: 'Finance', color: '#FBBF24', badge: 'Wealth', desc: 'Rich warm metallic gold for business & finance' },
  { id: 'word-highlight', name: 'Flame Word Pop', category: 'Kinetic', color: '#FF5722', badge: 'Dynamic', desc: 'Active word pops with vibrant flame orange' },
  { id: 'classic-clean', name: 'Timeless White Cinema', category: 'Cinema', color: '#FFFFFF', badge: 'Classic', desc: 'Crisp white typography with deep drop shadow' },
  { id: 'documentary-serif', name: 'Classical Book Serif', category: 'Book', color: '#E2E8F0', badge: 'Book', desc: 'Elegant serif captions for non-fiction literature' },
  { id: 'karaoke-glow', name: 'Karaoke Amber Pulse', category: 'Karaoke', color: '#FFA000', badge: 'Karaoke', desc: 'Golden amber electric glow following speech' },
  { id: 'box-pill', name: 'Dark Slate Pill Box', category: 'Modern', color: '#00FFCC', badge: 'Pill', desc: 'Solid dark badge background behind spoken words' },
  { id: 'neon-cyber', name: 'Magenta Cyber Pulse', category: 'Modern', color: '#FF007F', badge: 'Neon', desc: 'High-contrast cyan & magenta glowing text' },
  { id: 'minimal-lower-third', name: 'Scrubber Lower Third', category: 'Subtle', color: '#CBD5E1', badge: 'Clean', desc: 'Clean studio strip at the bottom of the frame' },
  { id: 'editorial-book', name: 'Author Emerald Accent', category: 'Book', color: '#10B981', badge: 'Editorial', desc: 'Distinguished emerald highlight on solid white' },
];

export const DEFAULT_AI_SAMPLE_ASSETS = [
  { id: "1", title: "Cinematic Landscape", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80" },
  { id: "2", title: "Modern Architecture", url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" },
  { id: "3", title: "Cyberpunk Alley", url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80" },
  { id: "4", title: "Cosmic Nebula", url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&q=80" },
  { id: "5", title: "Snowy Mountain Peak", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" },
  { id: "6", title: "Tropical Coastline", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80" },
];

export interface ImageToVideoStudioProps {
  selectedAudio: File | null;
  onSelectAudio: (file: File | null) => void;
  imageFiles: File[];
  onAddImages: (files: FileList | File[] | null) => void;
  onRemoveImage: (index: number) => void;
  onReorderImages?: (fromIndex: number, toIndex: number) => void;
  imagePhrases?: string[];
  onChangeImagePhrase?: (index: number, val: string) => void;
  onClearAllImages?: () => void;
  maxImages?: number;
  assetSourceMode?: ImageToVideoAssetMode;
  onChangeAssetSourceMode?: (mode: ImageToVideoAssetMode) => void;
  selectedStockAssetUrls?: string[];
  onChangeSelectedStockAssetUrls?: (urls: string[]) => void;
  aiGeneratedImageUrls?: string[];
  onChangeAiGeneratedImageUrls?: (urls: string[]) => void;
  visualStyle?: string;
  onChangeVisualStyle?: (style: any) => void;
  customAiPrompt?: string;
  onChangeCustomAiPrompt?: (prompt: string) => void;
  characterImageFile?: File | null;
  onSelectCharacterImage?: (file: File | null) => void;
  characterDnaHint?: string;
  onChangeCharacterDnaHint?: (hint: string) => void;
  bgmEnabled?: boolean;
  onChangeBgmEnabled?: (enabled: boolean) => void;
  enableSubtitles?: boolean;
  onToggleSubtitles?: (enabled: boolean) => void;
  subtitleStyle?: string;
  onChangeSubtitleStyle?: (style: string) => void;
  selectedBgmTrack?: any;
  onSelectBgmTrack?: (track: any) => void;
  selectedLibraryBgmUrl?: string;
  onChangeSelectedLibraryBgmUrl?: (url: string) => void;
  bgmFile?: File | null;
  onSelectBgmFile?: (file: File | null) => void;
  onSelectBgm?: (file: File | null) => void;
  topicTitle?: string;
  onChangeTopicTitle?: (title: string) => void;
  bgmVolume?: number;
  onChangeBgmVolume?: (volume: number) => void;
  cameraMotionPreset?: string;
  onChangeCameraMotionPreset?: (preset: string) => void;
  fitMode?: "cover" | "contain" | "blur-fill" | string;
  removeAiWatermark?: boolean;
  onRemoveAiWatermarkChange?: (enabled: boolean) => void;
  onChangeFitMode?: (mode: any) => void;
  enableSoundEffects?: boolean;
  onToggleSoundEffects?: (enabled: boolean) => void;
  estimatedDurationSeconds?: number;
  onStartRender?: (scenesInput?: any) => void;
  isRendering?: boolean;
  userCredits?: number;
  [key: string]: any;
}

export function ImageToVideoStudio({
  selectedAudio,
  onSelectAudio,
  imageFiles,
  onAddImages,
  onRemoveImage,
  onReorderImages,
  imagePhrases = [],
  onChangeImagePhrase,
  onClearAllImages,
  maxImages = 100,
  assetSourceMode = "upload",
  onChangeAssetSourceMode,
  selectedStockAssetUrls = [],
  onChangeSelectedStockAssetUrls,
  visualStyle = "cinematic-film",
  onChangeVisualStyle,
  customAiPrompt = "",
  onChangeCustomAiPrompt,
  bgmEnabled = true,
  onChangeBgmEnabled,
  enableSubtitles = true,
  onToggleSubtitles,
  subtitleStyle = "glow-viral",
  onChangeSubtitleStyle,
  selectedLibraryBgmUrl = "assets/reusable/music/parasail-silent-partner.mp3",
  onChangeSelectedLibraryBgmUrl,
  bgmFile = null,
  onSelectBgm,
  topicTitle = "",
  onChangeTopicTitle,
  bgmVolume = 0.12,
  onChangeBgmVolume,
  cameraMotionPreset = "ken-burns",
  onChangeCameraMotionPreset,
  fitMode = "cover",
  onChangeFitMode,
  onStartRender,
  isRendering = false,
  userCredits,
  estimatedDurationSeconds = 60,
}: ImageToVideoStudioProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'media' | 'captions' | 'audio' | 'preview'>('media');

  // Preview & Audition States
  const [playingBgmId, setPlayingBgmId] = useState<string | null>(null);
  const [previewConfirmed, setPreviewConfirmed] = useState<boolean>(false);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);
  const [isPreviewAudioPlaying, setIsPreviewAudioPlaying] = useState<boolean>(false);
  const [captionCategory, setCaptionCategory] = useState<string>('All');
  const [inputError, setInputError] = useState<string | null>(null);

  // Editorial Transcript Editor
  const [showTranscriptEditor, setShowTranscriptEditor] = useState<boolean>(false);
  const [editableTranscript, setEditableTranscript] = useState<string>(
    "Welcome to this cinematic 16:9 story. Every visual is smoothly animated with Ken Burns camera movement, synchronized to your spoken voice."
  );
  const [transcriptSavedFeedback, setTranscriptSavedFeedback] = useState<boolean>(false);

  // Local object URLs for previewing uploaded images
  const [imageObjectUrls, setImageObjectUrls] = useState<string[]>([]);

  // Refs for audio playback
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioFileInputRef = useRef<HTMLInputElement | null>(null);
  const imageFileInputRef = useRef<HTMLInputElement | null>(null);
  const bgmFileInputRef = useRef<HTMLInputElement | null>(null);

  // Synchronize image object URLs
  useEffect(() => {
    const urls = imageFiles.map((file) => URL.createObjectURL(file));
    setImageObjectUrls(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageFiles]);

  // Audio Duration Detection
  const [detectedAudioDuration, setDetectedAudioDuration] = useState<number>(estimatedDurationSeconds);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (!selectedAudio) {
      setAudioPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(selectedAudio);
    setAudioPreviewUrl(url);

    const audioEl = new Audio(url);
    audioEl.onloadedmetadata = () => {
      if (audioEl.duration && Number.isFinite(audioEl.duration)) {
        const detected = Math.round(audioEl.duration);
        if (detected > 300) {
          setInputError('Narration audio exceeds the 5-minute (300s) maximum limit for 16:9 widescreen videos.');
        } else {
          setInputError(null);
        }
        setDetectedAudioDuration(detected);
      }
    };

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedAudio]);

  // Credit calculation strictly per Rule 4.1: 1 Min = 1 Credit (1m=1, 2m=2, 3m=3, 4m=4, 5m=5 max)
  const effectiveDuration = detectedAudioDuration > 0 ? detectedAudioDuration : (estimatedDurationSeconds || 60);
  const calculatedCredits = Math.max(1, Math.min(5, Math.ceil(effectiveDuration / 60)));

  // Filter caption styles by category
  const filteredCaptionStyles = useMemo(() => {
    if (captionCategory === 'All') return TWENTY_CAPTION_STYLES;
    return TWENTY_CAPTION_STYLES.filter((c) => c.category === captionCategory);
  }, [captionCategory]);

  const captionCategories = ['All', 'Viral', 'Cinema', 'Modern', 'Tech', 'Book', 'Editorial', 'Creative'];

  // Handle BGM Audition Play/Pause
  const handleTogglePlayBgm = (track: LibraryBgmTrack) => {
    if (track.path === 'none') {
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
      }
      setPlayingBgmId(null);
      if (onChangeSelectedLibraryBgmUrl) onChangeSelectedLibraryBgmUrl('none');
      return;
    }

    if (playingBgmId === track.id) {
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
      }
      setPlayingBgmId(null);
    } else {
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
      }
      const audio = new Audio(track.path.startsWith('http') ? track.path : `/${track.path.replace(/^\/+/, '')}`);
      audio.volume = Math.max(0, Math.min(1, bgmVolume || 0.12));
      audio.loop = true;
      audio.play().catch(() => {});
      bgmAudioRef.current = audio;
      setPlayingBgmId(track.id);
      if (onChangeSelectedLibraryBgmUrl) onChangeSelectedLibraryBgmUrl(track.path);
    }
  };

  // Handle Audio File Selection
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|m4a|aac|ogg)$/i)) {
        setInputError('Please upload a valid audio file (MP3, WAV, M4A, AAC).');
        return;
      }
      setInputError(null);
      onSelectAudio(file);
      setPreviewConfirmed(false); // Reset preview confirmation on new audio
    }
  };

  // Handle Multi-Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddImages(e.target.files);
      setPreviewConfirmed(false); // Require preview review when images change
    }
  };

  // Handle Custom BGM Selection
  const handleBgmFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (onSelectBgm) onSelectBgm(file);
      if (onChangeBgmEnabled) onChangeBgmEnabled(true);
      setPreviewConfirmed(false);
    }
  };

  // Quick Load Sample Assets for fast user testing
  const handleLoadSampleDemo = () => {
    if (onChangeTopicTitle) onChangeTopicTitle("The Psychology of Success");
    setEditableTranscript(
      "True growth happens when consistency meets clear focus. Every milestone begins with a single bold decision, compounding day by day into extraordinary results."
    );
    setPreviewConfirmed(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Studio Header Card (Clean White Surface) */}
      <div className="relative rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xs overflow-hidden">
        <BorderBeam size={220} duration={14} delay={0} colorFrom="#FF5722" colorTo="#FFA000" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-black text-[#FF5722]">
              <Sparkles size={13} />
              <span>16:9 Cinema Widescreen · Clean White Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Image to Video AI Studio
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Transform your spoken narration and scene photos into a broadcast-ready 16:9 widescreen video with Ken Burns motion, 20 animated subtitle styles, and ducked background audio.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleLoadSampleDemo}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer shadow-xs"
            >
              <RotateCcw size={13} />
              <span>Load Sample Demo</span>
            </button>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-center shadow-xs">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Render Rate</span>
              <span className="text-sm font-black text-[#FF5722]">
                {calculatedCredits} Cr ({Math.ceil(effectiveDuration / 60)} min)
              </span>
            </div>
          </div>
        </div>

        {/* Error Notification Banner */}
        {inputError && (
          <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{inputError}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'media'
                ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <ImageIcon size={14} />
            <span>1. Voiceover &amp; Images ({imageFiles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('captions')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'captions'
                ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Layers size={14} />
            <span>2. Caption Styles (20)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audio')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'audio'
                ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Music size={14} />
            <span>3. Background Music &amp; SFX ({Math.round((bgmVolume || 0.12) * 100)}%)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Eye size={14} />
            <span>4. Compulsory Live Preview</span>
            {previewConfirmed && <Check size={12} className="text-emerald-300 stroke-[3]" />}
          </button>
        </div>
      </div>

      {/* TAB 1: VOICEOVER & MULTI-IMAGE ASSETS */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          {/* Audio Upload Card */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-orange-50 text-[#FF5722] border border-orange-200">
                  <Mic size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">1. Spoken Narration Audio</h2>
                  <p className="text-xs text-slate-500">Upload your voiceover track (MP3, WAV, M4A, up to 5 min / 300s)</p>
                </div>
              </div>

              {selectedAudio && (
                <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 size={13} />
                  <span>{detectedAudioDuration}s detected</span>
                </span>
              )}
            </div>

            <input
              type="file"
              ref={audioFileInputRef}
              onChange={handleAudioChange}
              accept="audio/*,.mp3,.wav,.m4a,.aac"
              className="hidden"
            />

            {!selectedAudio ? (
              <div
                onClick={() => audioFileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-[#FF5722] bg-slate-50 hover:bg-orange-50/30 rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 group"
              >
                <div className="p-3.5 rounded-2xl bg-white text-slate-400 group-hover:text-[#FF5722] shadow-xs border border-slate-200 transition">
                  <UploadCloud size={28} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800">Click or drag &amp; drop your voiceover audio here</p>
                  <p className="text-xs text-slate-500 mt-1">Supports MP3, WAV, M4A, AAC · Maximum 5 Minutes</p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 w-full sm:w-auto">
                  <div className="p-3 rounded-xl bg-white text-[#FF5722] border border-slate-200 shadow-xs">
                    <Volume2 size={20} />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-black text-slate-900 truncate max-w-sm">{selectedAudio.name}</p>
                    <p className="text-xs text-slate-500">
                      {(selectedAudio.size / (1024 * 1024)).toFixed(2)} MB · {detectedAudioDuration} seconds duration
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {audioPreviewUrl && (
                    <audio controls src={audioPreviewUrl} className="h-9 max-w-[220px]" />
                  )}
                  <button
                    type="button"
                    onClick={() => audioFileInputRef.current?.click()}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectAudio(null);
                      setAudioPreviewUrl('');
                    }}
                    className="p-2 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-red-500 hover:border-red-200 transition cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Multi-Image Upload Card */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-orange-50 text-[#FF5722] border border-orange-200">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">2. Scene Images ({imageFiles.length}/{maxImages})</h2>
                  <p className="text-xs text-slate-500">Upload multiple photos to generate the widescreen visual montage</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={imageFileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => imageFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF5722] hover:bg-[#FF7043] text-white px-4 py-2 text-xs font-black shadow-md shadow-[#FF5722]/20 transition cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Upload Images</span>
                </button>

                {imageFiles.length > 0 && onClearAllImages && (
                  <button
                    type="button"
                    onClick={onClearAllImages}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 hover:text-red-500 transition cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            </div>

            {/* Drag & Drop Zone */}
            {imageFiles.length === 0 ? (
              <div
                onClick={() => imageFileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-[#FF5722] bg-slate-50 hover:bg-orange-50/30 rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 group"
              >
                <div className="p-3.5 rounded-2xl bg-white text-slate-400 group-hover:text-[#FF5722] shadow-xs border border-slate-200 transition">
                  <ImageIcon size={28} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800">Select or drop multiple images here</p>
                  <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG, WEBP · Upload up to 100 images</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {imageFiles.map((file, idx) => (
                  <div
                    key={`img-${idx}`}
                    className="relative group rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-xs flex flex-col"
                  >
                    <div className="relative aspect-video w-full bg-slate-200 overflow-hidden">
                      {imageObjectUrls[idx] && (
                        <img
                          src={imageObjectUrls[idx]}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-black text-white">
                        Scene #{idx + 1}
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveImage(idx)}
                        className="absolute top-2 right-2 p-1 rounded-md bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm hover:bg-red-700"
                        title="Delete image"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div className="p-2 space-y-1">
                      <p className="text-[11px] font-bold text-slate-800 truncate">{file.name}</p>
                      {onChangeImagePhrase && (
                        <input
                          type="text"
                          value={imagePhrases[idx] || ''}
                          onChange={(e) => onChangeImagePhrase(idx, e.target.value)}
                          placeholder="Optional anchor phrase..."
                          className="w-full text-[10px] rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-700 focus:outline-none focus:border-[#FF5722]"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* General Project Settings Card */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-lg font-black text-slate-900">3. Widescreen Visual Framing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Project Title</label>
                <input
                  type="text"
                  value={topicTitle}
                  onChange={(e) => onChangeTopicTitle && onChangeTopicTitle(e.target.value)}
                  placeholder="e.g. Journey to the Stars..."
                  className="w-full mt-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF5722] shadow-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Image Fit Mode</label>
                <select
                  value={fitMode}
                  onChange={(e) => onChangeFitMode && onChangeFitMode(e.target.value)}
                  className="w-full mt-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF5722] shadow-xs cursor-pointer"
                >
                  <option value="cover">16:9 Cover (Cinematic Fill)</option>
                  <option value="blur-fill">Soft Blur Ambient Fill (Portrait Friendly)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Camera Motion</label>
                <select
                  value={cameraMotionPreset}
                  onChange={(e) => onChangeCameraMotionPreset && onChangeCameraMotionPreset(e.target.value)}
                  className="w-full mt-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF5722] shadow-xs cursor-pointer"
                >
                  <option value="ken-burns">Ken Burns Smooth Zoom &amp; Pan</option>
                  <option value="gentle-push">Gentle Cinema Push-In</option>
                  <option value="parallax-drift">Parallax Horizontal Drift</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 20 MASTER CAPTION STYLES */}
      {activeTab === 'captions' && (
        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Choose from 20 Master YouTube Caption Styles</h2>
                <p className="text-xs text-slate-500">Synchronized word-by-word with clean high-contrast presentation on white background</p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {captionCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCaptionCategory(cat)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                      captionCategory === cat
                        ? 'bg-[#FF5722] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 20 Caption Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {filteredCaptionStyles.map((style) => {
                const isSelected = subtitleStyle === style.id;
                return (
                  <div
                    key={style.id}
                    onClick={() => onChangeSubtitleStyle && onChangeSubtitleStyle(style.id)}
                    className={`rounded-2xl border-2 p-4 cursor-pointer transition flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'border-[#FF5722] bg-orange-50/50 shadow-md ring-2 ring-[#FF5722]/20'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                        {style.category}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#FF5722] text-white flex items-center justify-center">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    {/* Preview Badge Visual */}
                    <div className="h-16 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center p-3 text-center">
                      <span
                        className="text-xs font-black uppercase tracking-wide"
                        style={{ color: style.color }}
                      >
                        {style.name}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-xs font-black text-slate-900">{style.name}</p>
                      <p className="text-[11px] text-slate-500 leading-tight">{style.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BACKGROUND MUSIC & SFX */}
      {activeTab === 'audio' && (
        <div className="space-y-6">
          {/* AWS S3 BGM Tracks Card */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Master AWS S3 Background Music Catalog</h2>
                <p className="text-xs text-slate-500">Audition royalty-free atmospheric soundtracks automatically ducked under your speech</p>
              </div>

              {/* Volume Slider Card */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl">
                <Volume2 size={16} className="text-[#FF5722]" />
                <span className="text-xs font-bold text-slate-700">BGM Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={bgmVolume}
                  onChange={(e) => onChangeBgmVolume && onChangeBgmVolume(parseFloat(e.target.value))}
                  className="w-24 accent-[#FF5722] cursor-pointer"
                />
                <span className="text-xs font-black text-slate-900 min-w-[36px]">
                  {Math.round((bgmVolume || 0.12) * 100)}%
                </span>
              </div>
            </div>

            {/* Quick Volume Preset Pills */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500">Volume Presets:</span>
              {[
                { label: 'Mute (0%)', val: 0 },
                { label: 'Subtle (5%)', val: 0.05 },
                { label: 'Studio (12% Default)', val: 0.12 },
                { label: 'Rich (20%)', val: 0.20 },
                { label: 'Full (35%)', val: 0.35 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onChangeBgmVolume && onChangeBgmVolume(preset.val)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                    Math.abs((bgmVolume || 0.12) - preset.val) < 0.02
                      ? 'bg-[#FF5722] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* BGM Track List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {AWS_BGM_TRACKS.map((track) => {
                const isSelected = selectedLibraryBgmUrl === track.path;
                const isPlaying = playingBgmId === track.id;

                return (
                  <div
                    key={track.id}
                    className={`rounded-2xl border p-4 flex items-center justify-between gap-3 transition cursor-pointer ${
                      isSelected
                        ? 'border-[#FF5722] bg-orange-50/40 shadow-xs'
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                    onClick={() => onChangeSelectedLibraryBgmUrl && onChangeSelectedLibraryBgmUrl(track.path)}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePlayBgm(track);
                        }}
                        className={`p-2.5 rounded-xl transition cursor-pointer shadow-xs ${
                          isPlaying
                            ? 'bg-[#FF5722] text-white'
                            : 'bg-white text-slate-700 hover:text-[#FF5722] border border-slate-200'
                        }`}
                      >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                      </button>

                      <div className="truncate">
                        <p className="text-xs font-black text-slate-900 truncate">{track.label}</p>
                        <p className="text-[10px] text-slate-500 truncate">{track.desc}</p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-[#FF5722] text-white flex items-center justify-center">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{track.category}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom BGM Upload Option */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black text-slate-800">Have your own custom background track?</p>
                <p className="text-[11px] text-slate-500">Upload your own MP3/WAV audio track instead of library music</p>
              </div>

              <input
                type="file"
                ref={bgmFileInputRef}
                onChange={handleBgmFileChange}
                accept="audio/*"
                className="hidden"
              />

              <div className="flex items-center gap-2">
                {bgmFile ? (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    {bgmFile.name}
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => bgmFileInputRef.current?.click()}
                  className="rounded-xl border border-slate-200 bg-white hover:bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition cursor-pointer shadow-xs"
                >
                  {bgmFile ? 'Replace BGM' : 'Upload Custom BGM'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMPULSORY LIVE PREVIEW & EDITORIAL TRANSCRIPT */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          {/* Spoken Narration Editorial Markdown Editor */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-50 text-[#FF5722] border border-orange-200">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Spoken Transcript Editorial Editor</h3>
                  <p className="text-xs text-slate-500">Fix any spelling mistakes, names, or typos before final rendering</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowTranscriptEditor(!showTranscriptEditor)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                  showTranscriptEditor
                    ? 'border-orange-500 bg-orange-50 text-[#FF5722]'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Edit3 size={13} />
                <span>{showTranscriptEditor ? 'Collapse Editor' : 'Edit Spoken Transcript'}</span>
              </button>
            </div>

            {showTranscriptEditor && (
              <div className="space-y-3 pt-2">
                <textarea
                  value={editableTranscript}
                  onChange={(e) => setEditableTranscript(e.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-800 leading-relaxed focus:outline-none focus:border-[#FF5722] shadow-xs"
                  placeholder="Review or edit your spoken transcription words here..."
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {editableTranscript.length} characters · {editableTranscript.split(/\s+/).filter(Boolean).length} words
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setTranscriptSavedFeedback(true);
                      setTimeout(() => setTranscriptSavedFeedback(false), 2000);
                    }}
                    className="inline-flex items-center gap-1 rounded-xl bg-slate-900 hover:bg-black text-white px-3.5 py-1.5 text-xs font-bold transition cursor-pointer"
                  >
                    {transcriptSavedFeedback ? <CheckCheck size={13} className="text-emerald-400" /> : <Check size={13} />}
                    <span>{transcriptSavedFeedback ? 'Saved!' : 'Save Corrections'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Interactive 16:9 Widescreen Live Canvas Preview */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Interactive 16:9 Cinema Widescreen Preview</h2>
                <p className="text-xs text-slate-500">Verify your visual framing, subtitles, and pacing before rendering</p>
              </div>

              {/* Compulsory Review State Banner */}
              <div
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-black border transition ${
                  previewConfirmed
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {previewConfirmed ? (
                  <>
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    <span>Preview Verified · Ready to Render</span>
                  </>
                ) : (
                  <>
                    <Lock size={15} className="text-amber-600" />
                    <span>Compulsory Review: Confirm Preview below to unlock render</span>
                  </>
                )}
              </div>
            </div>

            {/* 16:9 Simulated Canvas */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-slate-300 shadow-xl bg-[#FAFAFA] flex items-center justify-center">
              {/* Clean White Ambient Grid Texture */}
              <div
                className="absolute inset-0 pointer-events-none opacity-60"
                style={{
                  backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.06) 1.5px, transparent 1.5px)',
                  backgroundSize: '36px 36px',
                }}
              />

              {/* Active Image Visual */}
              {imageObjectUrls.length > 0 && imageObjectUrls[activePreviewIndex] ? (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  <img
                    src={imageObjectUrls[activePreviewIndex]}
                    alt={`Scene ${activePreviewIndex + 1}`}
                    className={`w-full h-full ${
                      fitMode === 'blur-fill' ? 'object-contain scale-95 drop-shadow-2xl' : 'object-cover'
                    }`}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                  <ImageIcon size={48} className="opacity-40" />
                  <p className="text-xs font-bold">No images uploaded yet. Please add images in Tab 1.</p>
                </div>
              )}

              {/* Active Word Caption Overlay */}
              <div className="absolute bottom-8 left-8 right-8 flex justify-center pointer-events-none">
                <div className="max-w-xl text-center bg-white/95 backdrop-blur-md rounded-2xl px-6 py-2.5 border border-slate-200 shadow-xl">
                  <p className="text-sm font-black text-slate-900 tracking-wide">
                    {editableTranscript.slice(0, 80)}...
                  </p>
                </div>
              </div>

              {/* Scene Indicator Badge */}
              {imageFiles.length > 0 && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-black/75 backdrop-blur-md text-xs font-black text-white shadow-md">
                  Scene {activePreviewIndex + 1} of {imageFiles.length}
                </div>
              )}
            </div>

            {/* Timeline Scrubber & Scene Navigation */}
            {imageFiles.length > 1 && (
              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setActivePreviewIndex((prev) => Math.max(0, prev - 1))}
                  disabled={activePreviewIndex === 0}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {imageFiles.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePreviewIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activePreviewIndex === idx ? 'w-8 bg-[#FF5722]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setActivePreviewIndex((prev) => Math.min(imageFiles.length - 1, prev + 1))}
                  disabled={activePreviewIndex === imageFiles.length - 1}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Compulsory Review Confirmation Checkbox */}
            <div className="rounded-2xl border-2 border-orange-200 bg-orange-50/50 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="confirm-preview-checkbox"
                  checked={previewConfirmed}
                  onChange={(e) => setPreviewConfirmed(e.target.checked)}
                  className="w-5 h-5 accent-[#FF5722] cursor-pointer rounded"
                />
                <label htmlFor="confirm-preview-checkbox" className="text-xs font-bold text-slate-800 cursor-pointer">
                  I have reviewed the 16:9 scene framing, subtitles, and narration pacing. Unlock final render.
                </label>
              </div>

              <button
                type="button"
                onClick={() => setPreviewConfirmed(true)}
                className={`rounded-xl px-4 py-2 text-xs font-black transition cursor-pointer ${
                  previewConfirmed
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-[#FF5722] hover:bg-[#FF7043] text-white shadow-md shadow-[#FF5722]/20'
                }`}
              >
                {previewConfirmed ? 'Verified ✓' : 'Confirm Preview Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FINAL RENDER ACTION BAR (Guarded by Compulsory Preview) */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-500">Total Duration:</span>
          <span className="ml-1 text-sm font-black text-slate-900">{detectedAudioDuration}s</span>
          <span className="mx-2 text-slate-300">·</span>
          <span className="text-xs font-bold text-slate-500">Credits Required:</span>
          <span className="ml-1 text-sm font-black text-[#FF5722]">{calculatedCredits} Cr</span>
        </div>

        <button
          type="button"
          onClick={() => onStartRender && onStartRender()}
          disabled={isRendering || !previewConfirmed || !selectedAudio || imageFiles.length === 0}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl px-8 py-4 text-sm font-black transition-all duration-200 ${
            !previewConfirmed || !selectedAudio || imageFiles.length === 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              : isRendering
              ? 'bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white opacity-80 cursor-wait animate-pulse shadow-xl'
              : 'bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] text-white shadow-xl shadow-[#FF5722]/30 hover:brightness-110 active:scale-95 cursor-pointer'
          }`}
        >
          {!previewConfirmed ? (
            <>
              <Lock size={16} className="text-slate-400" />
              <span>Preview Required to Unlock Render</span>
            </>
          ) : (
            <>
              <Film size={16} className="stroke-[2.5]" />
              <span>
                {isRendering
                  ? 'Submitting Cloud Render...'
                  : `Render 1080p Widescreen Video (${calculatedCredits} Credit${calculatedCredits > 1 ? 's' : ''})`}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
