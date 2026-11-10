'use client';

import { WatermarkRemoverToggle } from "@/components/dashboard/WatermarkRemoverToggle";
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
  ChevronDown,
  ChevronUp,
  Search,
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
  Undo2,
  Redo2,
  Copy,
  Clock,
  Tag,
  Headphones,
  RefreshCw,
  Download,
  Ban,
  Scissors,
  Maximize2,
  Minimize2,
  SkipBack,
  SkipForward,
  ZoomIn,
  ZoomOut,
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

export interface CaptionTrackItem {
  id: string;
  index: number;
  startTime: number;
  endTime: number;
  text: string;
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

// Cloud AWS S3 Media Library Resolver for BGM audio playback
export const getBgmTrackAudioUrl = (path: string): string => {
  if (!path || path === 'none') return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.replace(/^\/+/, '');
  return `https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/${cleanPath}`;
};

// 32 Master 16:9 & Shorts Kinetic Caption Styles (Faithfully matching Studio Subtitle Engine)
export interface CaptionStyleItem {
  id: string;
  name: string;
  color: string;
  fontFamily: string;
  category?: string;
  badge?: string;
  desc?: string;
}

export const DEFAULT_STUDIO_SCENE_URLS = [
  "https://res.cloudinary.com/dhouh9idx/image/upload/c_crop,g_north_west,w_0.96,h_0.94/f_auto,q_auto,w_900/v1793807678/itnavideo12345/blog_podcaster_new_york.png",
  "https://res.cloudinary.com/dhouh9idx/image/upload/c_crop,g_north_west,w_0.96,h_0.94/f_auto,q_auto,w_900/v1793807713/itnavideo12345/blog_video_producer_studio.png",
  "https://res.cloudinary.com/dhouh9idx/image/upload/c_crop,g_north_west,w_0.96,h_0.94/f_auto,q_auto,w_900/v1793807603/itnavideo12345/blog_youtube_creator_usa.png",
  "https://res.cloudinary.com/dhouh9idx/image/upload/c_crop,g_north_west,w_0.96,h_0.94/f_auto,q_auto,w_900/v1793807944/itnavideo12345/blog_captions_creator_usa.png",
  "https://res.cloudinary.com/dhouh9idx/image/upload/c_crop,g_north_west,w_0.96,h_0.94/f_auto,q_auto,w_900/v1793807751/itnavideo12345/blog_batch_video_creator.png",
  "https://res.cloudinary.com/dhouh9idx/image/upload/c_crop,g_north_west,w_0.96,h_0.94/f_auto,q_auto,w_900/v1793807974/itnavideo12345/blog_youtube_shorts_creator.png",
  "https://res.cloudinary.com/dhouh9idx/image/upload/c_crop,g_north_west,w_0.96,h_0.94/f_auto,q_auto,w_900/v1793808113/itnavideo12345/blog_finance_creator.png",
  "https://res.cloudinary.com/dhouh9idx/image/upload/c_crop,g_north_west,w_0.96,h_0.94/f_auto,q_auto,w_900/v1793808080/itnavideo12345/blog_ai_tools_upgrade.png",
];

export const CAPTION_PREVIEW_CREATOR_IMAGE = "https://res.cloudinary.com/dhouh9idx/image/upload/c_crop,g_north_west,w_0.96,h_0.94/f_auto,q_auto,w_600/v1793807678/itnavideo12345/blog_podcaster_new_york.png";

export const THIRTY_TWO_CAPTION_STYLES: CaptionStyleItem[] = [
  // Row 1
  { id: 'pop-word', name: 'Pop Word', color: '#EA580C', fontFamily: 'Inter, system-ui, sans-serif', category: 'Kinetic', badge: 'Popular', desc: 'Punchy active word pops in flame orange' },
  { id: 'karaoke-line', name: 'Karaoke Line', color: '#D97706', fontFamily: 'Inter, system-ui, sans-serif', category: 'Karaoke', badge: 'Karaoke', desc: 'Smooth flowing golden line highlighter' },
  { id: 'box-highlight', name: 'Box Highlight', color: '#0284C7', fontFamily: 'Inter, system-ui, sans-serif', category: 'Modern', badge: 'Box', desc: 'Solid bounding box behind active words' },
  { id: 'neon-glow', name: 'Neon Glow', color: '#06B6D4', fontFamily: 'Montserrat, system-ui, sans-serif', category: 'Modern', badge: 'Glow', desc: 'Electric cyan and neon aura glow' },

  // Row 2
  { id: 'typewriter', name: 'Typewriter', color: '#FACC15', fontFamily: 'Courier New, monospace', category: 'Creative', badge: 'Type', desc: 'Classic mechanical typewriter reveal' },
  { id: 'slam-headline', name: 'Slam Headline', color: '#EF4444', fontFamily: 'Impact, sans-serif', category: 'Viral', badge: 'Impact', desc: 'Heavyweight slam headline with punch' },
  { id: 'word-stack', name: 'Word Stack', color: '#8B5CF6', fontFamily: 'Montserrat, sans-serif', category: 'Viral', badge: 'Stack', desc: 'Stacked vertical words with vibrant purple' },
  { id: 'editorial-mix', name: 'Editorial Mix', color: '#0F172A', fontFamily: 'Playfair Display, Georgia, serif', category: 'Editorial', badge: 'Docu', desc: 'Refined editorial serif captioning' },

  // Row 3
  { id: 'pill-highlight', name: 'Pill Highlight', color: '#0D9488', fontFamily: 'Inter, system-ui, sans-serif', category: 'Modern', badge: 'Pill', desc: 'Rounded teal pill badge behind text' },
  { id: 'subtitle-classic', name: 'Subtitle Classic', color: '#FFFFFF', fontFamily: 'Inter, system-ui, sans-serif', category: 'Cinema', badge: 'Classic', desc: 'Timeless crisp white broadcast subtitles' },
  { id: 'highlighter', name: 'Highlighter', color: '#FACC15', fontFamily: 'Inter, system-ui, sans-serif', category: 'Viral', badge: 'Marker', desc: 'Bright yellow marker highlighter line' },
  { id: 'underline-track', name: 'Underline Track', color: '#3B82F6', fontFamily: 'Inter, system-ui, sans-serif', category: 'Modern', badge: 'Track', desc: 'Electric blue underline tracking speech' },

  // Row 4
  { id: 'color-fill', name: 'Color Fill', color: '#10B981', fontFamily: 'Montserrat, sans-serif', category: 'Viral', badge: 'Fill', desc: 'Dynamic word color fill on spoken beats' },
  { id: 'bold-impact', name: 'Bold Impact', color: '#22C55E', fontFamily: 'Impact, sans-serif', category: 'Viral', badge: 'Retention', desc: 'Ultra-bold lime green high-retention text' },
  { id: 'headline-slam', name: 'Headline Slam', color: '#FFE500', fontFamily: 'Impact, Montserrat, sans-serif', category: 'Viral', badge: 'Creator', desc: 'Punchy yellow bounding box with bold pop' },
  { id: 'solo-word-pop', name: 'Solo Word Pop', color: '#EA580C', fontFamily: 'Montserrat, sans-serif', category: 'Kinetic', badge: 'Solo', desc: 'One high-impact word at a time in center' },

  // Row 5
  { id: 'crazy-kinetic', name: 'Crazy Kinetic', color: '#EC4899', fontFamily: 'Impact, sans-serif', category: 'Kinetic', badge: 'Crazy', desc: 'High-speed bouncing kinetic typography' },
  { id: 'neon-aura-glow', name: 'Neon Aura Glow', color: '#A855F7', fontFamily: 'Montserrat, sans-serif', category: 'Viral', badge: 'Glow', desc: 'Vibrant purple magical outer aura glow' },
  { id: 'simple-clean', name: 'Simple Clean', color: '#F8FAFC', fontFamily: 'Inter, system-ui, sans-serif', category: 'Clean', badge: 'Minimal', desc: 'Distraction-free minimal clean font' },
  { id: 'clean-minimal-pill', name: 'Clean Minimal Pill', color: '#38BDF8', fontFamily: 'Inter, system-ui, sans-serif', category: 'Modern', badge: 'Pill', desc: 'Subtle slate pill with sky blue active word' },

  // Row 6
  { id: 'doctor-pill', name: 'Doctor Pill', color: '#14B8A6', fontFamily: 'Inter, system-ui, sans-serif', category: 'Modern', badge: 'Medical', desc: 'Clean medical teal pill container' },
  { id: 'devane-luxury-serif', name: 'Devane Luxury Serif', color: '#D4AF37', fontFamily: 'Playfair Display, serif', category: 'Editorial', badge: 'Luxury', desc: 'Rich gold serif for high-end cinematic docs' },
  { id: 'cinema-classic', name: 'Cinema Classic', color: '#EAB308', fontFamily: 'Georgia, serif', category: 'Cinema', badge: 'Cinema', desc: 'Golden warm serif with dark cinematic backdrop' },
  { id: 'podcast-studio-master', name: 'Podcast Studio Master', color: '#F59E0B', fontFamily: 'Inter, system-ui, sans-serif', category: 'Podcast', badge: 'Studio', desc: 'Warm amber highlight for deep studio conversations' },

  // Row 7
  { id: 'deep-discussion', name: 'Deep Discussion', color: '#38BDF8', fontFamily: 'Inter, system-ui, sans-serif', category: 'Podcast', badge: 'Deep', desc: 'Muted slate backdrop with vibrant cyan accents' },
  { id: 'discipline-bold', name: 'Discipline Bold', color: '#DC2626', fontFamily: 'Impact, sans-serif', category: 'Viral', badge: 'Bold', desc: 'High-contrast discipline red and white' },
  { id: 'red-wipe-highlight', name: 'Red Wipe Highlight', color: '#EF4444', fontFamily: 'Montserrat, sans-serif', category: 'Kinetic', badge: 'Wipe', desc: 'Smooth horizontal red wipe tracking audio' },
  { id: 'spark-yellow', name: 'Spark Yellow', color: '#EAB308', fontFamily: 'Impact, sans-serif', category: 'Viral', badge: 'Spark', desc: 'Bright electric spark yellow pop' },

  // Row 8
  { id: 'scribble-handwritten', name: 'Scribble Handwritten', color: '#F43F5E', fontFamily: 'Caveat, cursive, sans-serif', category: 'Creative', badge: 'Script', desc: 'Authentic organic handwritten script' },
  { id: 'editorial-dark-gold', name: 'Editorial Dark Gold', color: '#CA8A04', fontFamily: 'Playfair Display, serif', category: 'Editorial', badge: 'Gold', desc: 'Deep dark gold metallic editorial serif' },
  { id: 'gradient-word', name: 'Gradient Word', color: '#8B5CF6', fontFamily: 'Montserrat, sans-serif', category: 'Kinetic', badge: 'Gradient', desc: 'Smooth violet to orange gradient word shift' },
  { id: 'zoom-punch', name: 'Zoom Punch', color: '#F97316', fontFamily: 'Impact, sans-serif', category: 'Viral', badge: 'Zoom', desc: 'Snappy zoom scale punch on speech beats' },
];

export const TWENTY_CAPTION_STYLES = THIRTY_TWO_CAPTION_STYLES;

export const STUDIO_STEPS = [
  { step: 1, title: 'Upload', desc: 'Audio & Photos' },
  { step: 2, title: 'Music', desc: 'Soundtrack & Volume' },
  { step: 3, title: 'Style', desc: 'Captions & Motion' },
  { step: 4, title: 'Preview', desc: 'Live Review & Render' },
] as const;

export interface ImageToVideoStudioProps {
  selectedAudio: File | null;
  onSelectAudio: (file: File | null) => void;
  imageFiles: File[];
  onSetImageFiles?: (files: File[]) => void;
  onAddImages: (files: FileList | File[] | null) => void;
  onRemoveImage: (index: number) => void;
  onReplaceImage?: (index: number, file: File) => void;
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

// Unique, creative preview phrases for each of the 32 caption styles (no boring repeated text)
export const STYLE_PREVIEW_WORDS: Record<string, [string, string, string]> = {
  // Row 1
  'pop-word': ['GROW', 'YOUR', 'REACH'],
  'karaoke-line': ['Sing', 'Along', 'Smooth'],
  'box-highlight': ['STOP', 'SCROLLING', 'NOW'],
  'neon-glow': ['FUTURE', 'OF', 'AI'],

  // Row 2
  'typewriter': ['Story', 'Begins', 'Here'],
  'slam-headline': ['10X', 'YOUR', 'GROWTH'],
  'word-stack': ['THINK', 'BIGGER', 'ALWAYS'],
  'editorial-mix': ['Refined', 'Cinema', 'Vision'],

  // Row 3
  'pill-highlight': ['Tested', '&', 'Proven'],
  'subtitle-classic': ['Timeless', 'True', 'Cinema'],
  'highlighter': ['Secret', 'Formula', 'Unlocked'],
  'underline-track': ['Keep', 'Moving', 'Forward'],

  // Row 4
  'color-fill': ['Master', 'Your', 'Craft'],
  'hormozi-viral-pop': ['$100M', 'SECRETS', 'REVEALED'],
  'mrbeast-shorts-impact': ['DO', 'NOT', 'BLINK!'],
  'solo-word-pop': ['UNSTOPPABLE', 'FOCUS', 'NOW'],

  // Row 5
  'crazy-kinetic': ['HYPER', 'SPEED', 'ENERGY'],
  'submagic-glow': ['Magic', 'Visual', 'Aura'],
  'simple-clean': ['Clarity', 'In', 'Design'],
  'ali-abdaal-modern': ['Deep', 'Work', 'Flow'],

  // Row 6
  'doctor-pill': ['Proven', 'Health', 'Science'],
  'devane-luxury-serif': ['The', 'Gold', 'Standard'],
  'cinema-classic': ['Golden', 'Age', 'Stories'],
  'podcast-studio-master': ['Deep', 'Studio', 'Talks'],

  // Row 7
  'deep-discussion': ['Ponder', 'Big', 'Questions'],
  'discipline-bold': ['STAY', 'HARD', 'DISCIPLINE'],
  'red-wipe-highlight': ['Swipe', 'Past', 'Limits'],
  'spark-yellow': ['IGNITE', 'THE', 'SPARK'],

  // Row 8
  'scribble-handwritten': ['Doodle', 'Your', 'Dreams'],
  'editorial-dark-gold': ['Royal', 'Dark', 'Gold'],
  'gradient-word': ['Sunset', 'Sky', 'Vibes'],
  'zoom-punch': ['SNAP', 'INTO', 'FOCUS'],
};

// Helper to render authentic animated caption word previews across all 32 styles
export function renderPreviewCaptionWords(
  styleId: string,
  styleColor: string,
  styleFont: string,
  activeWordIdx: number
) {
  const words = STYLE_PREVIEW_WORDS[styleId] || ['CINEMA', 'MOTION', 'CAPTIONS'];

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-1.5 flex-wrap px-2 text-center select-none w-full">
      {words.map((word, idx) => {
        const isActive = idx === activeWordIdx;

        switch (styleId) {
          case 'pop-word':
            return (
              <span
                key={word}
                className={`transition-all duration-200 text-xs sm:text-sm font-black tracking-wide ${
                  isActive
                    ? 'text-orange-500 scale-125 drop-shadow-[0_2px_10px_rgba(234,88,12,0.9)]'
                    : 'text-white/80 scale-100 drop-shadow-xs'
                }`}
                style={{ fontFamily: styleFont }}
              >
                {word}
              </span>
            );

          case 'karaoke-line':
            return (
              <span
                key={word}
                className={`transition-all duration-200 text-xs sm:text-sm font-bold tracking-wide ${
                  isActive
                    ? 'text-amber-400 scale-110 underline decoration-amber-400 decoration-2 underline-offset-4 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                    : 'text-white/60 scale-100'
                }`}
                style={{ fontFamily: styleFont }}
              >
                {word}
              </span>
            );

          case 'box-highlight':
            return (
              <span
                key={word}
                className={`transition-all duration-200 text-xs sm:text-sm font-black tracking-wide px-1.5 py-0.5 rounded ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-md scale-110 drop-shadow-xs'
                    : 'text-white/80 scale-100'
                }`}
                style={{ fontFamily: styleFont }}
              >
                {word}
              </span>
            );

          case 'neon-glow':
            return (
              <span
                key={word}
                className={`transition-all duration-200 text-xs sm:text-sm font-black tracking-wide ${
                  isActive
                    ? 'text-cyan-300 scale-115 drop-shadow-[0_0_12px_#06B6D4]'
                    : 'text-white/70 scale-100 drop-shadow-xs'
                }`}
                style={{ fontFamily: styleFont }}
              >
                {word}
              </span>
            );

          case 'typewriter':
            return (
              <span
                key={word}
                className={`transition-all duration-200 text-xs sm:text-sm font-mono tracking-widest ${
                  isActive
                    ? 'text-yellow-400 font-bold scale-110 bg-black/60 px-1 rounded border-r-2 border-yellow-400'
                    : 'text-yellow-100/70 font-medium'
                }`}
                style={{ fontFamily: styleFont }}
              >
                {word}
              </span>
            );

          case 'slam-headline':
            return (
              <span
                key={word}
                className={`transition-all duration-150 text-xs sm:text-sm uppercase tracking-tighter ${
                  isActive
                    ? 'text-red-500 scale-125 font-black drop-shadow-[0_4px_8px_rgba(0,0,0,1)]'
                    : 'text-white/80 font-bold'
                }`}
                style={{ fontFamily: 'Impact, sans-serif' }}
              >
                {word}
              </span>
            );

          case 'word-stack':
            return (
              <span
                key={word}
                className={`transition-all duration-200 text-xs sm:text-sm uppercase font-black ${
                  isActive
                    ? 'text-purple-400 scale-115 drop-shadow-[0_2px_10px_rgba(139,92,246,0.8)]'
                    : 'text-white/80'
                }`}
                style={{ fontFamily: styleFont }}
              >
                {word}
              </span>
            );

          case 'editorial-mix':
            return (
              <span
                key={word}
                className={`transition-all duration-200 text-xs sm:text-sm font-serif italic ${
                  isActive
                    ? 'text-amber-200 font-bold scale-110 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]'
                    : 'text-amber-100/70'
                }`}
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {word}
              </span>
            );

          case 'pill-highlight':
          case 'doctor-pill':
            return (
              <span
                key={word}
                className={`transition-all duration-200 text-xs sm:text-sm font-bold tracking-tight px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-teal-400 text-slate-950 font-black shadow-md scale-110'
                    : 'text-white/80'
                }`}
                style={{ fontFamily: styleFont }}
              >
                {word}
              </span>
            );

          case 'subtitle-classic':
          case 'cinema-classic':
            return (
              <span
                key={word}
                className={`transition-all duration-200 text-xs sm:text-sm font-medium ${
                  isActive ? 'text-yellow-300 font-bold scale-105' : 'text-white/90'
                }`}
                style={{ fontFamily: styleFont }}
              >
                {word}
              </span>
            );

          case 'highlighter':
            return (
              <span
                key={word}
                className={`transition-all duration-200 text-xs sm:text-sm font-black tracking-wide ${
                  isActive
                    ? 'bg-lime-400 text-slate-950 px-1.5 py-0.5 rounded font-black scale-110 shadow-xs'
                    : 'text-white/80'
                }`}
                style={{ fontFamily: styleFont }}
              >
                {word}
              </span>
            );

          case 'underline-track':
            return (
              <span
                key={word}
                className={`transition-all duration-200 text-xs sm:text-sm font-black ${
                  isActive
                    ? 'text-white border-b-2 border-orange-500 pb-0.5 scale-105'
                    : 'text-white/70'
                }`}
                style={{ fontFamily: styleFont }}
              >
                {word}
              </span>
            );

          case 'color-fill':
            return (
              <span
                key={word}
                className={`transition-all duration-200 text-xs sm:text-sm font-black ${
                  isActive
                    ? 'text-emerald-400 scale-115 drop-shadow-[0_2px_8px_rgba(52,211,153,0.8)]'
                    : 'text-slate-400'
                }`}
                style={{ fontFamily: styleFont }}
              >
                {word}
              </span>
            );

          case 'hormozi-viral-pop':
            return (
              <span
                key={word}
                className={`transition-all duration-150 text-xs sm:text-sm uppercase font-black tracking-wider ${
                  isActive
                    ? 'text-lime-400 scale-125 -rotate-2 inline-block drop-shadow-[0_3px_10px_rgba(0,0,0,1)] border-b-2 border-lime-400'
                    : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)]'
                }`}
                style={{ fontFamily: styleFont }}
              >
                {word}
              </span>
            );

          case 'mrbeast-shorts-impact':
            return (
              <span
                key={word}
                className={`transition-all duration-150 text-xs sm:text-sm uppercase font-black tracking-tight ${
                  isActive
                    ? 'bg-yellow-400 text-black px-2 py-0.5 rounded-md scale-115 shadow-xl'
                    : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)]'
                }`}
                style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
              >
                {word}
              </span>
            );

          case 'solo-word-pop':
            if (!isActive) return null;
            return (
              <span
                key={word}
                className="text-base sm:text-lg font-black text-amber-400 uppercase tracking-widest scale-120 drop-shadow-[0_4px_12px_rgba(0,0,0,1)] animate-in zoom-in-75 duration-150"
                style={{ fontFamily: styleFont }}
              >
                {word}
              </span>
            );

          case 'crazy-kinetic':
            return (
              <span
                key={word}
                className={`transition-all duration-200 text-xs sm:text-sm font-black ${
                  isActive
                    ? 'text-pink-400 scale-125 rotate-3 inline-block drop-shadow-[0_2px_10px_rgba(244,114,182,0.9)]'
                    : 'text-white/80'
                }`}
                style={{ fontFamily: styleFont }}
              >
                {word}
              </span>
            );

          case 'submagic-glow':
            return (
              <span
                key={word}
                className={`transition-all duration-200 text-xs sm:text-sm font-black ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent scale-115 drop-shadow-[0_0_12px_rgba(192,132,252,0.8)]'
                    : 'text-white/70'
                }`}
                style={{ fontFamily: styleFont }}
              >
                {word}
              </span>
            );

          case 'simple-clean':
          case 'ali-abdaal-modern':
            return (
              <span
                key={word}
                className={`transition-all duration-200 text-xs sm:text-sm font-semibold tracking-normal ${
                  isActive
                    ? 'text-white font-bold scale-105 border-b border-white/60'
                    : 'text-white/80'
                }`}
                style={{ fontFamily: styleFont }}
              >
                {word}
              </span>
            );

          case 'devane-luxury-serif':
          case 'editorial-dark-gold':
            return (
              <span
                key={word}
                className={`transition-all duration-200 text-xs sm:text-sm font-serif italic ${
                  isActive
                    ? 'text-amber-300 font-bold scale-110 drop-shadow-[0_2px_8px_rgba(217,119,6,0.6)]'
                    : 'text-stone-300 font-medium'
                }`}
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {word}
              </span>
            );

          case 'podcast-studio-master':
          case 'deep-discussion':
            return (
              <span
                key={word}
                className={`transition-all duration-200 text-xs sm:text-sm font-bold ${
                  isActive
                    ? 'text-amber-400 scale-110 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]'
                    : 'text-slate-200'
                }`}
                style={{ fontFamily: styleFont }}
              >
                {word}
              </span>
            );

          case 'discipline-bold':
            return (
              <span
                key={word}
                className={`transition-all duration-150 text-xs sm:text-sm uppercase font-black ${
                  isActive
                    ? 'text-white bg-black px-1.5 py-0.5 border border-white/40 scale-110 shadow-md'
                    : 'text-white/80'
                }`}
                style={{ fontFamily: 'sans-serif' }}
              >
                {word}
              </span>
            );

          case 'red-wipe-highlight':
            return (
              <span
                key={word}
                className={`transition-all duration-200 text-xs sm:text-sm font-black ${
                  isActive
                    ? 'text-white bg-red-600 px-1.5 py-0.5 rounded scale-110 shadow-md'
                    : 'text-white/80'
                }`}
                style={{ fontFamily: styleFont }}
              >
                {word}
              </span>
            );

          case 'spark-yellow':
            return (
              <span
                key={word}
                className={`transition-all duration-200 text-xs sm:text-sm font-black ${
                  isActive
                    ? 'text-yellow-400 scale-120 drop-shadow-[0_0_10px_rgba(250,204,21,0.9)]'
                    : 'text-white/80'
                }`}
                style={{ fontFamily: styleFont }}
              >
                {isActive ? `✦ ${word}` : word}
              </span>
            );

          case 'scribble-handwritten':
            return (
              <span
                key={word}
                className={`transition-all duration-200 text-xs sm:text-sm font-mono italic ${
                  isActive
                    ? 'text-orange-300 font-bold scale-115 underline decoration-wavy decoration-orange-400'
                    : 'text-white/80'
                }`}
                style={{ fontFamily: 'cursive, sans-serif' }}
              >
                {word}
              </span>
            );

          case 'gradient-word':
            return (
              <span
                key={word}
                className={`transition-all duration-200 text-xs sm:text-sm font-black ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-400 via-rose-500 to-purple-500 bg-clip-text text-transparent scale-120 drop-shadow-md'
                    : 'text-white/70'
                }`}
                style={{ fontFamily: styleFont }}
              >
                {word}
              </span>
            );

          case 'zoom-punch':
            return (
              <span
                key={word}
                className={`transition-all duration-150 text-xs sm:text-sm font-black ${
                  isActive
                    ? 'text-rose-400 scale-130 drop-shadow-[0_3px_10px_rgba(244,63,94,0.9)]'
                    : 'text-white/80'
                }`}
                style={{ fontFamily: styleFont }}
              >
                {word}
              </span>
            );

          default:
            return (
              <span
                key={word}
                className={`transition-all duration-200 text-xs sm:text-sm font-bold ${
                  isActive ? 'scale-115 drop-shadow-md' : 'text-white/80'
                }`}
                style={{
                  color: isActive ? styleColor : undefined,
                  fontFamily: styleFont,
                }}
              >
                {word}
              </span>
            );
        }
      })}
    </div>
  );
}

/**
 * Splits speech segments into punchy, single-line phrases of max 5–7 words.
 * Guarantees that subtitles stay strictly on one line on the video screen.
 */
function splitSegmentIntoSingleLineCaptions(
  text: string,
  start: number,
  end: number,
  baseIdx: number
): CaptionTrackItem[] {
  const clean = text.trim();
  if (!clean) return [];

  const sentences = clean.split(/(?<=[.?!])\s+/).filter(Boolean);
  const rawChunks: string[] = [];

  for (const s of sentences) {
    const words = s.split(/\s+/).filter(Boolean);
    if (words.length <= 7) {
      rawChunks.push(s);
    } else {
      // Chunk words in groups of 4 to 6 words
      for (let i = 0; i < words.length; i += 5) {
        rawChunks.push(words.slice(i, i + 5).join(' '));
      }
    }
  }

  if (rawChunks.length === 0) return [];

  const totalDuration = Math.max(0.8, end - start);
  const totalWords = clean.split(/\s+/).filter(Boolean).length || 1;
  let currentStart = start;
  const items: CaptionTrackItem[] = [];

  rawChunks.forEach((chunk, cIdx) => {
    const chunkWords = chunk.split(/\s+/).filter(Boolean).length || 1;
    const chunkDur = Math.max(0.6, (chunkWords / totalWords) * totalDuration);
    const chunkEnd = Number(Math.min(end, currentStart + chunkDur).toFixed(2));

    items.push({
      id: `cap-${baseIdx}-${cIdx}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      index: baseIdx + cIdx,
      startTime: Number(currentStart.toFixed(2)),
      endTime: chunkEnd,
      text: chunk,
    });

    currentStart = chunkEnd;
  });

  return items;
}

export function ImageToVideoStudio({
  selectedAudio,
  onSelectAudio,
  imageFiles,
  onSetImageFiles,
  onAddImages,
  onRemoveImage,
  onReplaceImage,
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
  subtitleStyle = "pop-word",
  onChangeSubtitleStyle,
  selectedLibraryBgmUrl = "assets/reusable/music/parasail-silent-partner.mp3",
  onChangeSelectedLibraryBgmUrl,
  bgmFile = null,
  onSelectBgm,
  topicTitle = "",
  onChangeTopicTitle,
  bgmVolume = 0.50,
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
  // Audition & Preview States
  // 4-Step Guided Flow Stepper State (Responsive 3-Row Shell)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  const [playingBgmId, setPlayingBgmId] = useState<string | null>(null);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);
  const [captionCategory, setCaptionCategory] = useState<string>('All');
  const [auditioningStyleId, setAuditioningStyleId] = useState<string | null>(null);
  const [previewWordStep, setPreviewWordStep] = useState<number>(0);
  const [hoveredStyleId, setHoveredStyleId] = useState<string | null>(null);
  const [isAutoplayPreviewActive, setIsAutoplayPreviewActive] = useState<boolean>(true);
  const [inputError, setInputError] = useState<string | null>(null);

  // Expandable Picker States (Accordion on demand per founder request)
  const [isCaptionsExpanded, setIsCaptionsExpanded] = useState<boolean>(false);
  const [captionSearchQuery, setCaptionSearchQuery] = useState<string>('');

  const [isBgmExpanded, setIsBgmExpanded] = useState<boolean>(false);
  const [bgmSearchQuery, setBgmSearchQuery] = useState<string>('');
  const [bgmCategory, setBgmCategory] = useState<string>('All');

  // Custom Voiceover Player & Waveform Visualizer States
  const narrationAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingNarration, setIsPlayingNarration] = useState<boolean>(false);
  const [narrationCurrentTime, setNarrationCurrentTime] = useState<number>(0);
  const [narrationDuration, setNarrationDuration] = useState<number>(estimatedDurationSeconds || 0);
  const [isNarrationMuted, setIsNarrationMuted] = useState<boolean>(false);
  const [detectedAudioDuration, setDetectedAudioDuration] = useState<number>(estimatedDurationSeconds);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string>('');

  // Cloud Speech Transcription State (Groq Whisper Cloud API)
  const [transcribeState, setTranscribeState] = useState<'idle' | 'transcribing' | 'ready' | 'error'>('idle');
  const [transcribeError, setTranscribeError] = useState<string | null>(null);

  // Inspector & Interactive In-Player Preview Controls
  const [previewPosition, setPreviewPosition] = useState<'right' | 'left'>('right');
  const [isEditingOnScreenText, setIsEditingOnScreenText] = useState<boolean>(false);
  const [inPlayerActivePopover, setInPlayerActivePopover] = useState<'style' | 'audio' | 'motion' | null>(null);
  const [previewTab, setPreviewTab] = useState<'text' | 'music' | 'style' | 'motion'>('text');
  const [replacingSceneIndex, setReplacingSceneIndex] = useState<number | null>(null);
  const [sceneTextSavedFeedback, setSceneTextSavedFeedback] = useState<boolean>(false);

  // Editorial Transcript Editor (Clean Empty Default, No Fake Subtitles)
  const [editableTranscript, setEditableTranscript] = useState<string>('');
  const [transcriptSavedFeedback, setTranscriptSavedFeedback] = useState<boolean>(false);

  // Studio Subtitle Engine: Sentence-by-Sentence Timestamped Tracks & Timeline Sync
  const [captionTracks, setCaptionTracks] = useState<CaptionTrackItem[]>([]);
  const [subtitlesSearchQuery, setSubtitlesSearchQuery] = useState<string>('');
  const [editingCaptionId, setEditingCaptionId] = useState<string | null>(null);
  const [captionEditForm, setCaptionEditForm] = useState<{ text: string; startTime: number; endTime: number }>({
    text: '',
    startTime: 0,
    endTime: 0,
  });
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState<boolean>(true);
  const [isCaptionsListExpanded, setIsCaptionsListExpanded] = useState<boolean>(true);

  const captionsListContainerRef = useRef<HTMLDivElement | null>(null);
  const activeCaptionCardRef = useRef<HTMLDivElement | null>(null);

  // Local object URLs for previewing uploaded images
  const [imageObjectUrls, setImageObjectUrls] = useState<string[]>([]);

  // =========================================================================
  // STEP 4 SMART SCENE & SUBTITLE EDITOR ("Edit & Render") STATE & HANDLERS
  // =========================================================================
  const [step4ActiveTab, setStep4ActiveTab] = useState<'scene' | 'captions' | 'summary'>('scene');
  const [timelineZoom, setTimelineZoom] = useState<number>(1);
  const [selectedTrackType, setSelectedTrackType] = useState<'video' | 'caption' | 'audio' | 'music'>('video');
  const [subtitleSearchQuery, setSubtitleSearchQuery] = useState<string>('');

  const formatTime = (secs: number) => {
    const safe = Math.max(0, isNaN(secs) ? 0 : secs);
    const m = Math.floor(safe / 60);
    const s = Math.floor(safe % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };
  const [customSceneDurations, setCustomSceneDurations] = useState<number[]>([]);
  const [standaloneSceneUrls, setStandaloneSceneUrls] = useState<string[]>([]);
  const [perSceneMotion, setPerSceneMotion] = useState<Record<number, 'ken-burns' | 'static'>>({});
  const [historyStack, setHistoryStack] = useState<Array<{
    imageFiles: File[];
    imagePhrases: string[];
    customSceneDurations: number[];
    captionTracks: CaptionTrackItem[];
  }>>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Push state snapshot to history for Undo / Redo
  const pushToHistory = (
    newFiles?: File[],
    newPhrases?: string[],
    newDurations?: number[],
    newTracks?: CaptionTrackItem[]
  ) => {
    const snapshot = {
      imageFiles: newFiles ? [...newFiles] : [...imageFiles],
      imagePhrases: newPhrases ? [...newPhrases] : (imagePhrases ? [...imagePhrases] : []),
      customSceneDurations: newDurations ? [...newDurations] : [...customSceneDurations],
      captionTracks: newTracks ? [...newTracks] : [...captionTracks],
    };
    const nextHistory = historyStack.slice(0, historyIndex + 1);
    nextHistory.push(snapshot);
    if (nextHistory.length > 25) nextHistory.shift();
    setHistoryStack(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyStack.length - 1;

  const handleUndo = () => {
    if (!canUndo) return;
    const prevIndex = historyIndex - 1;
    const target = historyStack[prevIndex];
    if (!target) return;
    setCustomSceneDurations(target.customSceneDurations);
    setCaptionTracks(target.captionTracks);
    setHistoryIndex(prevIndex);
  };

  const handleRedo = () => {
    if (!canRedo) return;
    const nextIndex = historyIndex + 1;
    const target = historyStack[nextIndex];
    if (!target) return;
    setCustomSceneDurations(target.customSceneDurations);
    setCaptionTracks(target.captionTracks);
    setHistoryIndex(nextIndex);
  };

  // Compute effective scene durations (totalDuration divided evenly or custom overridden)
  const totalAudioTime = detectedAudioDuration || estimatedDurationSeconds || (selectedAudio ? 60 : 0);
  // Auto B-Roll scenes only if user uploaded audio without photos
  const isUsingAutoBroll = Boolean(selectedAudio && imageFiles.length === 0);
  const activeDisplaySceneUrls = useMemo(() => {
    if (imageObjectUrls.length > 0) return imageObjectUrls;
    if (standaloneSceneUrls.length > 0) return standaloneSceneUrls;
    if (!selectedAudio && imageFiles.length === 0) return [];
    const count = Math.max(3, Math.min(8, Math.round((totalAudioTime || 30) / 5)));
    return Array.from({ length: count }).map((_, i) => DEFAULT_STUDIO_SCENE_URLS[i % DEFAULT_STUDIO_SCENE_URLS.length]);
  }, [imageObjectUrls, standaloneSceneUrls, totalAudioTime, selectedAudio, imageFiles.length]);

  const effectiveSceneDurations = useMemo(() => {
    const count = activeDisplaySceneUrls.length;
    if (customSceneDurations.length === count && count > 0) {
      return customSceneDurations;
    }
    const def = Number((totalAudioTime / Math.max(1, count)).toFixed(1));
    return Array.from({ length: count }).map(() => def);
  }, [customSceneDurations, activeDisplaySceneUrls.length, totalAudioTime]);

  // Compute start and end timestamps for each scene
  const sceneTimeRanges = useMemo(() => {
    let accumulated = 0;
    return effectiveSceneDurations.map((duration) => {
      const start = accumulated;
      const end = accumulated + duration;
      accumulated = end;
      return { start, end, duration };
    });
  }, [effectiveSceneDurations]);

  // Sync active preview scene with audio playback automatically in real time
  useEffect(() => {
    if (!isPlayingNarration || sceneTimeRanges.length === 0) return;
    const currentSceneIdx = sceneTimeRanges.findIndex(
      (r) => narrationCurrentTime >= r.start && narrationCurrentTime < r.end
    );
    if (currentSceneIdx !== -1 && currentSceneIdx !== activePreviewIndex) {
      setActivePreviewIndex(currentSceneIdx);
    }
  }, [isPlayingNarration, narrationCurrentTime, sceneTimeRanges, activePreviewIndex]);

  // Adjust duration stepper for selected scene (-0.5s / +0.5s)
  const handleAdjustSceneDuration = (index: number, delta: number) => {
    const nextDurations = [...effectiveSceneDurations];
    const current = nextDurations[index] || 3;
    const updated = Math.max(0.8, Math.min(60, Number((current + delta).toFixed(1))));
    nextDurations[index] = updated;
    setCustomSceneDurations(nextDurations);
    pushToHistory(undefined, undefined, nextDurations);
  };

  // Split clip at current playhead timestamp (CapCut Split action)
  const handleSplitClipAtPlayhead = () => {
    const currentIdx = activePreviewIndex;
    const currentDur = effectiveSceneDurations[currentIdx] || 4;
    const range = sceneTimeRanges[currentIdx] || { start: 0, end: currentDur };
    const splitPoint = narrationCurrentTime - range.start;

    // Minimum split chunk is 0.8s
    if (splitPoint < 0.8 || (range.duration - splitPoint) < 0.8) {
      alert("Split point must be at least 0.8s from the start and end of the scene.");
      return;
    }

    const leftDur = Number(splitPoint.toFixed(1));
    const rightDur = Number((range.duration - splitPoint).toFixed(1));

    const nextDurations = [...effectiveSceneDurations];
    nextDurations.splice(currentIdx, 1, leftDur, rightDur);
    setCustomSceneDurations(nextDurations);

    let nextFiles = imageFiles.length > 0 ? [...imageFiles] : [];
    if (nextFiles.length > 0 && nextFiles[currentIdx]) {
      nextFiles.splice(currentIdx + 1, 0, nextFiles[currentIdx]);
      if (onSetImageFiles) {
        onSetImageFiles(nextFiles);
      } else if (onAddImages) {
        onAddImages([nextFiles[currentIdx]]);
      }
    } else {
      const currentUrls = [...activeDisplaySceneUrls];
      currentUrls.splice(currentIdx + 1, 0, currentUrls[currentIdx] || DEFAULT_STUDIO_SCENE_URLS[0]);
      setStandaloneSceneUrls(currentUrls);
    }
    pushToHistory(nextFiles.length > 0 ? nextFiles : undefined, undefined, nextDurations);
  };
  
  const handleDuplicateScene = (index: number) => {
    const currentDur = effectiveSceneDurations[index] || 4;
    const nextDurations = [...effectiveSceneDurations];
    nextDurations.splice(index + 1, 0, currentDur);
    setCustomSceneDurations(nextDurations);

    let nextFiles = imageFiles.length > 0 ? [...imageFiles] : [];
    if (nextFiles.length > 0 && nextFiles[index]) {
      nextFiles.splice(index + 1, 0, nextFiles[index]);
      if (onSetImageFiles) {
        onSetImageFiles(nextFiles);
      } else if (onAddImages) {
        onAddImages([nextFiles[index]]);
      }
    } else {
      const currentUrls = [...activeDisplaySceneUrls];
      currentUrls.splice(index + 1, 0, currentUrls[index] || DEFAULT_STUDIO_SCENE_URLS[0]);
      setStandaloneSceneUrls(currentUrls);
    }

    setActivePreviewIndex(index + 1);
    pushToHistory(nextFiles.length > 0 ? nextFiles : undefined, undefined, nextDurations);
  };

  // Delete selected scene with safe bounds check
  const handleDeleteScene = (index: number) => {
    const totalScenes = activeDisplaySceneUrls.length;
    if (totalScenes <= 1) {
      alert("At least 1 scene is required for your video.");
      return;
    }

    const nextDurations = effectiveSceneDurations.filter((_, idx) => idx !== index);
    setCustomSceneDurations(nextDurations);

    if (imageFiles.length > 0) {
      if (onSetImageFiles) {
        const nextFiles = imageFiles.filter((_, idx) => idx !== index);
        onSetImageFiles(nextFiles);
      } else {
        onRemoveImage(index);
      }
    } else {
      const nextUrls = activeDisplaySceneUrls.filter((_, idx) => idx !== index);
      setStandaloneSceneUrls(nextUrls);
    }

    if (activePreviewIndex >= totalScenes - 1) {
      setActivePreviewIndex(Math.max(0, totalScenes - 2));
    }
    pushToHistory(undefined, undefined, nextDurations);
  };

  // Move scene left or right in sequence
  const handleMoveScene = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= imageFiles.length || !onReorderImages) return;
    onReorderImages(index, targetIndex);
    setActivePreviewIndex(targetIndex);
  };

  // Toggle Ken Burns motion override for this specific scene
  const handleToggleSceneMotion = (index: number, motion: 'ken-burns' | 'static') => {
    setPerSceneMotion(prev => ({ ...prev, [index]: motion }));
  };

  // Update subtitle text on screen
  const handleUpdateSubtitleText = (val: string) => {
    if (activeCaption) {
      setCaptionTracks(prev => prev.map(c => c.id === activeCaption.id ? { ...c, text: val } : c));
    }
    handleSceneTextChange(val);
  };

  // Refs for audio playback & file inputs
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioFileInputRef = useRef<HTMLInputElement | null>(null);
  const imageFileInputRef = useRef<HTMLInputElement | null>(null);
  const singleImageReplaceInputRef = useRef<HTMLInputElement | null>(null);

  // Handle single scene image replacement
  const handleTriggerReplaceScene = (index: number) => {
    setReplacingSceneIndex(index);
    singleImageReplaceInputRef.current?.click();
  };

  const handleSingleImageFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onReplaceImage && replacingSceneIndex !== null) {
      onReplaceImage(replacingSceneIndex, file);
    }
    setReplacingSceneIndex(null);
    if (singleImageReplaceInputRef.current) {
      singleImageReplaceInputRef.current.value = '';
    }
  };

  // Safe remove image preserving preview bounds
  const handleSafeRemoveImage = (indexToRemove: number) => {
    handleDeleteScene(indexToRemove);
  };

  // Active scene subtitle text
  const activeSceneText = (imagePhrases && imagePhrases[activePreviewIndex] !== undefined)
    ? imagePhrases[activePreviewIndex]
    : '';

  // Active Caption Segment based on live audio playback time (Sentence-by-Sentence sync)
  const activeCaption = useMemo(() => {
    if (captionTracks.length === 0) return null;
    return (
      captionTracks.find(
        (c) => narrationCurrentTime >= c.startTime && narrationCurrentTime <= c.endTime
      ) || null
    );
  }, [captionTracks, narrationCurrentTime]);

  // Guaranteed strictly ONE SINGLE LINE of kinetic subtitle text (max 5–7 words)
  const displaySubtitle = useMemo(() => {
    const raw = activeCaption?.text || (activeSceneText.trim().length > 0 ? activeSceneText : '');
    const clean = raw.trim();
    if (!clean) return '';

    const words = clean.split(/\s+/).filter(Boolean);
    // If 6 words or less, show all on one clean line
    if (words.length <= 6) {
      return clean;
    }

    // If longer than 6 words, dynamically slide a 5-word window based on audio playback time
    if (activeCaption && activeCaption.endTime > activeCaption.startTime) {
      const segDuration = Math.max(0.4, activeCaption.endTime - activeCaption.startTime);
      const progress = Math.max(0, Math.min(0.999, (narrationCurrentTime - activeCaption.startTime) / segDuration));
      const chunkSize = 5;
      const totalChunks = Math.ceil(words.length / chunkSize);
      const activeChunkIdx = Math.floor(progress * totalChunks);
      const startWord = activeChunkIdx * chunkSize;
      return words.slice(startWord, startWord + chunkSize).join(' ');
    }

    // Fallback: take first 6 words
    return words.slice(0, 6).join(' ');
  }, [activeCaption, activeSceneText, narrationCurrentTime]);

  // Edit caption segment text directly in-place
  const handleEditCaptionSegment = (id: string, newText: string) => {
    setCaptionTracks((prev) =>
      prev.map((c) => (c.id === id ? { ...c, text: newText } : c))
    );
  };

  // Delete a caption segment
  const handleDeleteCaptionSegment = (id: string) => {
    setCaptionTracks((prev) => prev.filter((c) => c.id !== id));
  };

  // Add a new caption segment
  const handleAddCaptionSegment = () => {
    const lastCap = captionTracks[captionTracks.length - 1];
    const newStart = lastCap ? lastCap.endTime : 0;
    const newEnd = Number((newStart + 3).toFixed(2));
    const newCap: CaptionTrackItem = {
      id: `cap-new-${Date.now()}`,
      index: captionTracks.length + 1,
      startTime: newStart,
      endTime: newEnd,
      text: 'New subtitle phrase',
    };
    setCaptionTracks((prev) => [...prev, newCap]);
  };

  // Format all captions into punchy 1-line clips (max 5 words)
  const handleFormatAllCaptionsToSingleLine = () => {
    if (captionTracks.length === 0) return;
    const formatted: CaptionTrackItem[] = [];
    captionTracks.forEach((c) => {
      const items = splitSegmentIntoSingleLineCaptions(c.text, c.startTime, c.endTime, formatted.length + 1);
      if (items.length > 0) {
        formatted.push(...items);
      } else {
        formatted.push(c);
      }
    });
    setCaptionTracks(formatted);
    pushToHistory(undefined, undefined, undefined, formatted);
  };

  const handleSceneTextChange = (val: string) => {
    if (onChangeImagePhrase) {
      onChangeImagePhrase(activePreviewIndex, val);
    }
  };

  // Synchronize image object URLs
  useEffect(() => {
    const urls = imageFiles.map((file) => URL.createObjectURL(file));
    setImageObjectUrls(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageFiles]);


  // 36 Aesthetic Waveform Bar Heights (%) for voiceover visualizer
  const WAVE_BARS = useMemo(() => [
    25, 40, 70, 50, 85, 100, 65, 45, 90, 80, 
    35, 20, 60, 75, 95, 100, 70, 45, 30, 55, 
    75, 90, 60, 40, 85, 95, 65, 50, 30, 60, 
    80, 100, 70, 45, 30, 20
  ], []);

  const formatAudioTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Trigger speech transcription via /api/reels/transcribe
  const triggerDirectTranscription = async (file: File) => {
    setTranscribeState('transcribing');
    setTranscribeError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);

      const res = await fetch('/api/reels/transcribe', {
        method: 'POST',
        body: formData,
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok || !payload.ok) {
        throw new Error(payload.error || 'Speech transcription could not be completed.');
      }

      const rawTranscript = String(payload.transcript || '').trim();
      setEditableTranscript(rawTranscript);
      setTranscribeState('ready');

      // Populate punchy, single-line caption tracks from Groq Whisper segments
      if (Array.isArray(payload.segments) && payload.segments.length > 0) {
        const tracks: CaptionTrackItem[] = [];
        payload.segments.forEach((seg: any) => {
          const segStart = Number((seg.start || 0).toFixed(2));
          const segEnd = Number((seg.end || segStart + 3).toFixed(2));
          const segText = String(seg.text || '').trim();
          if (segText) {
            const splitItems = splitSegmentIntoSingleLineCaptions(segText, segStart, segEnd, tracks.length + 1);
            tracks.push(...splitItems);
          }
        });
        setCaptionTracks(tracks.length > 0 ? tracks : []);
      } else if (rawTranscript) {
        const duration = detectedAudioDuration > 0 ? detectedAudioDuration : (estimatedDurationSeconds || 60);
        const splitItems = splitSegmentIntoSingleLineCaptions(rawTranscript, 0, duration, 1);
        setCaptionTracks(splitItems);
      }

      // If user has uploaded images, intelligently align sentences into imagePhrases
      if (rawTranscript && onChangeImagePhrase) {
        const sentences = rawTranscript
          .split(/(?<=[.?!])\s+/)
          .map((s: string) => s.trim())
          .filter(Boolean);

        if (sentences.length > 0) {
          sentences.forEach((sentence: string, idx: number) => {
            onChangeImagePhrase(idx, sentence);
          });
        }
      }
    } catch (err: any) {
      console.warn('Transcription error:', err);
      setTranscribeError(err.message || 'Could not transcribe speech.');
      setTranscribeState('error');
    }
  };

  // Auto-scroll captions list to active speech segment
  useEffect(() => {
    if (isAutoScrollEnabled && activeCaptionCardRef.current && captionsListContainerRef.current) {
      activeCaptionCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeCaption?.id, isAutoScrollEnabled]);

  // Seek video and audio to caption timestamp
  const handleSeekCaption = (time: number) => {
    setNarrationCurrentTime(time);
    if (narrationAudioRef.current) {
      narrationAudioRef.current.currentTime = time;
    }
    // Also sync scene image based on timeline fraction
    if (imageFiles.length > 0 && narrationDuration > 0) {
      const sceneIdx = Math.min(
        imageFiles.length - 1,
        Math.floor((time / narrationDuration) * imageFiles.length)
      );
      setActivePreviewIndex(sceneIdx);
    }
  };

  const handleStartEditCaption = (cap: CaptionTrackItem) => {
    setEditingCaptionId(cap.id);
    setCaptionEditForm({
      text: cap.text,
      startTime: cap.startTime,
      endTime: cap.endTime,
    });
  };

  const handleSaveEditCaption = (id: string) => {
    setCaptionTracks((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              text: captionEditForm.text.trim(),
              startTime: Number(captionEditForm.startTime),
              endTime: Number(captionEditForm.endTime),
            }
          : c
      )
    );
    setEditingCaptionId(null);
  };

  const handleDeleteCaption = (id: string) => {
    setCaptionTracks((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      return updated.map((c, i) => ({ ...c, index: i + 1 }));
    });
  };

  const handleAddCaptionTrack = () => {
    const newStart = Number(narrationCurrentTime.toFixed(2));
    const newEnd = Number((newStart + 3.0).toFixed(2));
    const newTrack: CaptionTrackItem = {
      id: `track-${Date.now()}`,
      index: captionTracks.length + 1,
      startTime: newStart,
      endTime: newEnd,
      text: "New custom subtitle entry...",
    };
    const updated = [...captionTracks, newTrack].sort((a, b) => a.startTime - b.startTime);
    const reindexed = updated.map((item, idx) => ({ ...item, index: idx + 1 }));
    setCaptionTracks(reindexed);
    handleStartEditCaption(newTrack);
  };

  // Export SRT Subtitle File
  const handleExportSRT = () => {
    if (captionTracks.length === 0) return;
    const formatSRTTime = (sec: number) => {
      const hrs = Math.floor(sec / 3600).toString().padStart(2, '0');
      const mins = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
      const secs = Math.floor(sec % 60).toString().padStart(2, '0');
      const ms = Math.floor((sec % 1) * 1000).toString().padStart(3, '0');
      return `${hrs}:${mins}:${secs},${ms}`;
    };

    let srtContent = "";
    captionTracks.forEach((cap, idx) => {
      srtContent += `${idx + 1}\n`;
      srtContent += `${formatSRTTime(cap.startTime)} --> ${formatSRTTime(cap.endTime)}\n`;
      srtContent += `${cap.text}\n\n`;
    });

    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeName = (topicTitle || 'video').toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.download = `${safeName}_subtitles.srt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatTimestamp = (sec: number, showMs = false) => {
    if (!Number.isFinite(sec) || sec < 0) return "00:00";
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 100);
    const pad = (n: number) => n.toString().padStart(2, '0');
    if (showMs) {
      return `${pad(mins)}:${pad(secs)}.${pad(ms)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  const filteredCaptionTracks = useMemo(() => {
    if (!subtitlesSearchQuery.trim()) return captionTracks;
    const q = subtitlesSearchQuery.toLowerCase();
    return captionTracks.filter((c) =>
      c.text.toLowerCase().includes(q) ||
      c.index.toString() === q ||
      formatTimestamp(c.startTime).includes(q)
    );
  }, [captionTracks, subtitlesSearchQuery]);

  // Play/pause narration audio toggle
  const handleTogglePlayNarration = () => {
    if (!narrationAudioRef.current) return;
    if (isPlayingNarration) {
      narrationAudioRef.current.pause();
      setIsPlayingNarration(false);
    } else {
      narrationAudioRef.current.play().then(() => {
        setIsPlayingNarration(true);
      }).catch((err) => {
        console.warn('Narration play error:', err);
        setIsPlayingNarration(false);
      });
    }
  };

  // Waveform click to scrub
  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!narrationAudioRef.current || narrationDuration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = pct * narrationDuration;
    narrationAudioRef.current.currentTime = newTime;
    setNarrationCurrentTime(newTime);
  };

  const handleScrubberChange = (newTime: number) => {
    if (!narrationAudioRef.current) return;
    narrationAudioRef.current.currentTime = newTime;
    setNarrationCurrentTime(newTime);
  };

  const handleToggleMuteNarration = () => {
    if (!narrationAudioRef.current) return;
    const newMuted = !isNarrationMuted;
    narrationAudioRef.current.muted = newMuted;
    setIsNarrationMuted(newMuted);
  };

  useEffect(() => {
    if (!selectedAudio) {
      setAudioPreviewUrl('');
      setIsPlayingNarration(false);
      setNarrationCurrentTime(0);
      setTranscribeState('idle');
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
        setNarrationDuration(detected);
      }
    };

    // Auto trigger direct cloud transcription
    triggerDirectTranscription(selectedAudio);

    return () => {
      URL.revokeObjectURL(url);
      if (narrationAudioRef.current) {
        narrationAudioRef.current.pause();
      }
      setIsPlayingNarration(false);
    };
  }, [selectedAudio]);

  // Credit calculation strictly per Rule 4.1: 1 Min = 1 Credit (1m=1, 2m=2, 3m=3, 4m=4, 5m=5 max)
  const effectiveDuration = detectedAudioDuration > 0 ? detectedAudioDuration : (estimatedDurationSeconds || 60);
  const calculatedCredits = Math.max(1, Math.min(5, Math.ceil(effectiveDuration / 60)));

  // Filter 32 caption styles by search query and category (instant responsive filtering)
  const filteredCaptionStyles = useMemo(() => {
    return THIRTY_TWO_CAPTION_STYLES.filter((c) => {
      const q = captionSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.desc && c.desc.toLowerCase().includes(q)) ||
        (c.badge && c.badge.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q));
      const matchesCategory =
        captionCategory === 'All' ||
        (c.category && c.category.toLowerCase() === captionCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    });
  }, [captionSearchQuery, captionCategory]);

  const captionCategories = ['All', 'Kinetic', 'Viral', 'Modern', 'Cinema', 'Editorial', 'Creative', 'Podcast'];

  // BGM Categories and search filtering
  const bgmCategories = ['All', 'Lo-Fi', 'Piano', 'Upbeat', 'Narrative', 'Cinematic', 'Chill', 'Beats', 'Acoustic', 'Zen', 'Epic'];

  const filteredBgmTracks = useMemo(() => {
    return AWS_BGM_TRACKS.filter((t) => {
      const matchesCategory =
        bgmCategory === 'All' ||
        t.category.toLowerCase().includes(bgmCategory.toLowerCase()) ||
        (bgmCategory === 'Lo-Fi' && t.category === 'Lo-Fi');
      const matchesSearch =
        bgmSearchQuery.trim() === '' ||
        t.label.toLowerCase().includes(bgmSearchQuery.toLowerCase()) ||
        t.desc.toLowerCase().includes(bgmSearchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(bgmSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [bgmCategory, bgmSearchQuery]);

  const currentBgmObj = useMemo(() => {
    return AWS_BGM_TRACKS.find((t) => t.path === selectedLibraryBgmUrl) || AWS_BGM_TRACKS[0];
  }, [selectedLibraryBgmUrl]);

  // Handle BGM Audition Play/Pause
  const handleTogglePlayBgm = (track: LibraryBgmTrack) => {
    if (track.path === 'none') {
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
        bgmAudioRef.current = null;
      }
      setPlayingBgmId(null);
      if (onChangeSelectedLibraryBgmUrl) onChangeSelectedLibraryBgmUrl('none');
      return;
    }

    if (playingBgmId === track.id) {
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
        bgmAudioRef.current = null;
      }
      setPlayingBgmId(null);
    } else {
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
        bgmAudioRef.current = null;
      }
      const audioUrl = getBgmTrackAudioUrl(track.path);
      const audio = new Audio(audioUrl);
      audio.volume = Math.max(0, Math.min(1, bgmVolume ?? 0.5));
      audio.loop = true;
      audio.onended = () => setPlayingBgmId(null);
      audio.onerror = (e) => {
        console.warn('Audio playback error:', audioUrl, e);
        setPlayingBgmId(null);
      };
      audio.play().catch((err) => {
        console.warn('Audio play failed:', err);
        setPlayingBgmId(null);
      });
      bgmAudioRef.current = audio;
      setPlayingBgmId(track.id);
      if (onChangeSelectedLibraryBgmUrl) onChangeSelectedLibraryBgmUrl(track.path);
    }
  };

  // Real-time volume synchronization with currently playing audio
  useEffect(() => {
    if (bgmAudioRef.current) {
      bgmAudioRef.current.volume = Math.max(0, Math.min(1, bgmVolume ?? 0.5));
    }
  }, [bgmVolume]);

  const handleVolumeChange = (newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    if (bgmAudioRef.current) {
      bgmAudioRef.current.volume = clamped;
    }
    if (onChangeBgmVolume) {
      onChangeBgmVolume(clamped);
    }
  };

  // Stop audio on component unmount
  useEffect(() => {
    return () => {
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
        bgmAudioRef.current = null;
      }
    };
  }, []);

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
    }
  };

  // Handle Multi-Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddImages(e.target.files);
    }
  };

  // Selected Caption Style Object (Matching 32 styles seamlessly)
  // Live playback word loop for auditioning caption styles in Step 3
  useEffect(() => {
    if (currentStep !== 3 || !isAutoplayPreviewActive) return;
    const interval = setInterval(() => {
      setPreviewWordStep((prev) => (prev + 1) % 3);
    }, 700);
    return () => clearInterval(interval);
  }, [currentStep, isAutoplayPreviewActive]);

  const currentCaptionObj = useMemo(() => {
    return (
      THIRTY_TWO_CAPTION_STYLES.find(
        (c) => c.id === subtitleStyle || c.name.toLowerCase() === (subtitleStyle || '').toLowerCase()
      ) || THIRTY_TWO_CAPTION_STYLES[0]
    );
  }, [subtitleStyle]);

  const canRender = Boolean(selectedAudio && imageFiles.length > 0 && !inputError);

  const canProceedToStep2 = Boolean(selectedAudio && imageFiles.length > 0);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-white text-slate-900 select-text">
      {/* ========================================================================= */}
      {/* ROW 1: HEADER & STEPPER NAVIGATION BAR (Fixed height, no page scroll)     */}
      {/* ========================================================================= */}
      <header className="shrink-0 border-b border-slate-200/90 bg-white/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Studio Branding & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/20">
              <Film size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-sans">
                  Image to Video <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">AI Studio</span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-bold uppercase tracking-wider">
                  16:9 Cinema
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                4-Step Guided Video Studio · Spoken narration, photos, music &amp; kinetic subtitles
              </p>
            </div>
          </div>

          {/* Center: Desktop Stepper (>=1024px) */}
          <nav aria-label="Studio Steps" className="hidden lg:flex items-center gap-2 lg:gap-3">
            {STUDIO_STEPS.map((s, idx) => {
              const isCompleted = s.step < currentStep;
              const isActive = s.step === currentStep;
              const isUpcoming = s.step > currentStep;
              const isClickable = true;

              return (
                <React.Fragment key={s.step}>
                  <button
                    type="button"
                    onClick={() => {
                      if (isClickable) setCurrentStep(s.step);
                    }}
                    className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer hover:bg-slate-50/80 active:scale-98`}
                  >
                    {/* Circle - Green for completed, Orange for active, Slate for upcoming */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 text-white shadow-xs shadow-emerald-500/25 ring-2 ring-emerald-500/20'
                          : isActive
                          ? 'bg-white border-2 border-orange-500 text-orange-600 shadow-[0_0_0_4px_rgba(249,115,22,0.14)] font-black'
                          : 'bg-slate-100 border border-slate-200 text-slate-400 group-hover:border-slate-300'
                      }`}
                    >
                      {isCompleted ? <Check size={14} className="stroke-[3]" /> : s.step}
                    </div>

                    {/* Label */}
                    <div className="text-left hidden xl:block">
                      <p
                        className={`text-xs font-black leading-tight ${
                          isActive
                            ? 'text-slate-900'
                            : isCompleted
                            ? 'text-emerald-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {s.title}
                      </p>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        {s.desc}
                      </p>
                    </div>
                  </button>

                  {/* Connecting Line between steps - Green for completed steps */}
                  {idx < STUDIO_STEPS.length - 1 && (
                    <div
                      className={`h-0.5 w-6 lg:w-8 rounded-full transition-colors ${
                        s.step < currentStep ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          {/* Right: Render Rate & Credits */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="rounded-xl border border-orange-500/30 bg-orange-50/70 px-3 py-1.5 text-right shadow-2xs">
              <span className="block text-[9px] font-bold uppercase tracking-wider text-orange-600">
                1 Min = 1 Cr
              </span>
              <span className="text-xs sm:text-sm font-black text-orange-600">
                {calculatedCredits} Credit{calculatedCredits > 1 ? 's' : ''}
              </span>
            </div>
          </div>

        </div>

        {/* Tablet & Mobile Stepper Bar (<1024px): Compact Segmented Progress Bar */}
        <div className="lg:hidden mt-3 pt-2.5 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-black text-slate-900 truncate">
              <span className="text-orange-600 shrink-0">Step {currentStep} of 4:</span>
              <span className="truncate">{STUDIO_STEPS[currentStep - 1].title}</span>
              <span className="text-slate-400 font-normal hidden sm:inline">· {STUDIO_STEPS[currentStep - 1].desc}</span>
            </div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (Math.max(1, prev - 1) as 1 | 2 | 3 | 4))}
                className="text-[11px] font-bold text-orange-600 hover:text-orange-700 cursor-pointer shrink-0 ml-2"
              >
                ← Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 w-full">
            {STUDIO_STEPS.map((s) => {
              const isDone = s.step < currentStep;
              const isCurrent = s.step === currentStep;
              const isBackClickable = true;
              return (
                <div
                  key={s.step}
                  onClick={() => {
                    if (isBackClickable) setCurrentStep(s.step);
                  }}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    isBackClickable ? 'cursor-pointer hover:opacity-80' : ''
                  } ${
                    isDone
                      ? 'bg-emerald-500 shadow-xs'
                      : isCurrent
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                      : 'bg-slate-200'
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
        
        {/* Global Input Error Banner */}
        {inputError && (
          <div className="max-w-7xl mx-auto mb-6 flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 shadow-xs">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{inputError}</span>
          </div>
        )}
        {/* ======================================================================= */}
        {/* STEP 1: UPLOAD (Voiceover Audio First, then Scene Photos)                */}
        {/* ======================================================================= */}
        {currentStep === 1 && (
          <div className="max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                1. Upload your story assets
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Upload your spoken narration audio first to calculate pacing and subtitle sync, then add your scene photos.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Spoken Narration Audio (45%) */}
              <div className="lg:col-span-5 space-y-4">
          {/* CARD 1: SPOKEN NARRATION AUDIO (BIG SIZE MAIN INPUT) */}
          <div className="rounded-[28px] sm:rounded-[32px] border-2 border-orange-500/30 bg-gradient-to-b from-orange-50/20 via-white to-white p-4 sm:p-8 shadow-sm space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-md shadow-orange-500/25 shrink-0">
                  <Mic size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                      1. Spoken Narration Audio
                    </h2>
                    <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-wider">
                      Required
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your primary voiceover that drives scene cuts and subtitle pacing
                  </p>
                </div>
              </div>

              {selectedAudio && (
                <span className="inline-flex items-center self-start sm:self-auto gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-mono font-bold shadow-xs">
                  <Check size={13} className="stroke-[3]" />
                  <span>{detectedAudioDuration}s · {calculatedCredits} Cr</span>
                </span>
              )}
            </div>

            {/* Hidden Input */}
            <input
              ref={audioFileInputRef}
              type="file"
              accept="audio/*,.mp3,.wav,.m4a,.aac"
              onChange={handleAudioChange}
              className="hidden"
            />

            {/* BIG PROMINENT AUDIO DROPZONE */}
            {!selectedAudio ? (
              <div
                onClick={() => audioFileInputRef.current?.click()}
                className="group relative flex flex-col items-center justify-center rounded-[24px] sm:rounded-[28px] border-2 border-dashed border-orange-300 hover:border-orange-500 bg-white hover:bg-orange-50/40 min-h-[190px] sm:min-h-[220px] p-5 sm:p-10 text-center transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-orange-100 group-hover:bg-orange-500 text-orange-600 group-hover:text-white transition-all duration-200 shadow-sm mb-3 sm:mb-4">
                  <UploadCloud size={28} className="stroke-[2.5]" />
                </div>
                
                <p className="text-sm sm:text-lg font-black text-slate-900 mb-1">
                  Drop your narration audio here, or <span className="text-orange-600 underline underline-offset-4">Browse File</span>
                </p>
                
                <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm leading-relaxed mb-3 sm:mb-4">
                  Supports MP3, WAV, M4A, AAC · Maximum 5 Minutes (300s) · Millisecond Speech Sync
                </p>

                <div className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-black text-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold transition shadow-sm">
                  <Upload size={14} />
                  <span>Select Voiceover Audio</span>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl sm:rounded-3xl border-2 border-orange-300/80 bg-gradient-to-b from-orange-50/40 via-white to-white p-4 sm:p-6 shadow-xs space-y-4">
                {/* Hidden Audio Element with Event Handlers */}
                {audioPreviewUrl && (
                  <audio
                    ref={narrationAudioRef}
                    src={audioPreviewUrl}
                    onTimeUpdate={(e) => setNarrationCurrentTime(e.currentTarget.currentTime)}
                    onLoadedMetadata={(e) => {
                      if (e.currentTarget.duration && Number.isFinite(e.currentTarget.duration)) {
                        setNarrationDuration(Math.round(e.currentTarget.duration));
                      }
                    }}
                    onEnded={() => {
                      setIsPlayingNarration(false);
                      setNarrationCurrentTime(0);
                    }}
                    className="hidden"
                  />
                )}

                {/* Top Row: File Info & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/25">
                      <Headphones size={22} className="stroke-[2.5]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-slate-900 truncate max-w-[200px] sm:max-w-xs">
                          {selectedAudio.name}
                        </p>
                        <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-wider shrink-0">
                          Narration
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {(selectedAudio.size / 1024 / 1024).toFixed(2)} MB · Duration: <strong className="text-slate-900 font-bold">{detectedAudioDuration || Math.round(narrationDuration)}s</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => audioFileInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition cursor-pointer shadow-xs"
                    >
                      Replace Audio
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectAudio(null)}
                      className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer shadow-xs"
                      title="Remove audio"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Custom Audio Waveform Visualizer */}
                <div className="space-y-2 pt-2">
                  <div
                    onClick={handleWaveformClick}
                    className="relative group flex items-center justify-between gap-0.5 sm:gap-1 h-14 sm:h-16 w-full cursor-pointer px-2.5 sm:px-3 py-2 rounded-2xl bg-slate-50/80 hover:bg-orange-50/40 border border-slate-200/80 transition-all select-none shadow-inner"
                    title="Click anywhere on waveform to scrub audio"
                  >
                    {WAVE_BARS.map((barHeight, idx) => {
                      const totalBars = WAVE_BARS.length;
                      const barPct = (idx / (totalBars - 1)) * 100;
                      const currentPct = narrationDuration > 0 ? (narrationCurrentTime / narrationDuration) * 100 : 0;
                      const isPlayed = barPct <= currentPct;
                      return (
                        <div
                          key={idx}
                          className="flex-1 flex items-center justify-center h-full"
                        >
                          <div
                            style={{ height: `${barHeight}%` }}
                            className={`w-full max-w-[4px] sm:max-w-[6px] rounded-full transition-all duration-150 ${
                              isPlayed
                                ? 'bg-gradient-to-t from-orange-600 to-amber-500 shadow-2xs'
                                : 'bg-slate-200 group-hover:bg-slate-300'
                            } ${
                              isPlayingNarration && isPlayed
                                ? 'scale-y-110 brightness-105'
                                : ''
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Scrubber & Audio Controls Bar */}
                  <div className="flex items-center justify-between gap-3 px-1 pt-1">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleTogglePlayNarration}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-md shadow-orange-500/25 active:scale-95 transition cursor-pointer"
                        title={isPlayingNarration ? 'Pause voiceover' : 'Play voiceover'}
                      >
                        {isPlayingNarration ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                      </button>

                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-700">
                        <span>{formatAudioTime(narrationCurrentTime)}</span>
                        <span className="text-slate-400">/</span>
                        <span>{formatAudioTime(narrationDuration || detectedAudioDuration)}</span>
                      </div>
                    </div>

                    {/* Progress Slider */}
                    <div className="flex-1 max-w-xs hidden sm:block">
                      <input
                        type="range"
                        min="0"
                        max={narrationDuration || detectedAudioDuration || 60}
                        step="0.1"
                        value={narrationCurrentTime}
                        onChange={(e) => handleScrubberChange(parseFloat(e.target.value))}
                        className="w-full accent-orange-500 cursor-pointer"
                      />
                    </div>

                    {/* Mute Button */}
                    <button
                      type="button"
                      onClick={handleToggleMuteNarration}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                      title={isNarrationMuted ? 'Unmute voiceover' : 'Mute voiceover'}
                    >
                      {isNarrationMuted ? <VolumeX size={16} className="text-red-500" /> : <Volume2 size={16} />}
                    </button>
                  </div>
                </div>

                {/* AI Speech Transcription Status Banner */}
                <div className="pt-1">
                  {transcribeState === 'transcribing' && (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-orange-50/80 border border-orange-200 text-xs">
                      <div className="flex items-center gap-2.5 text-orange-800 font-bold">
                        <Sparkles size={16} className="animate-spin text-orange-600" />
                        <span>Transcribing speech with AI (Groq Whisper)...</span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-orange-600 animate-pulse">
                        Detecting words &amp; stops...
                      </span>
                    </div>
                  )}

                  {transcribeState === 'ready' && (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                      <div className="flex items-center gap-2.5 text-emerald-900 font-bold min-w-0">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        <span className="truncate">
                          Speech Transcribed ({editableTranscript.split(/\s+/).filter(Boolean).length} words) · Synced with live preview subtitles
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => selectedAudio && triggerDirectTranscription(selectedAudio)}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-2 shrink-0 cursor-pointer ml-2"
                      >
                        Re-transcribe
                      </button>
                    </div>
                  )}

                  {transcribeState === 'error' && (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-red-50 border border-red-200 text-xs">
                      <div className="flex items-center gap-2.5 text-red-800 font-bold min-w-0">
                        <AlertCircle size={16} className="text-red-600 shrink-0" />
                        <span className="truncate">
                          {transcribeError || 'Speech transcription could not be completed.'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => selectedAudio && triggerDirectTranscription(selectedAudio)}
                        className="px-3 py-1 rounded-xl bg-red-600 text-white text-[11px] font-bold hover:bg-red-700 transition cursor-pointer shadow-xs shrink-0 ml-2"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {transcribeState === 'idle' && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                      <span>Audio ready for processing</span>
                      <button
                        type="button"
                        onClick={() => selectedAudio && triggerDirectTranscription(selectedAudio)}
                        className="text-[11px] font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                      >
                        Start Transcription
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
                {/* Smart Pacing Recommendation Card */}
                {selectedAudio && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-xs text-slate-600 space-y-1.5 shadow-2xs">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <Clock size={14} className="text-orange-600" />
                      <span>Cinematic Pacing Recommendation</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-500">
                      Audio duration is <strong className="text-slate-900 font-bold">{detectedAudioDuration}s</strong>. We recommend about <strong className="text-orange-600 font-bold">{Math.max(2, Math.round(detectedAudioDuration / 6))} to {Math.max(4, Math.round(detectedAudioDuration / 4))} photos</strong> for a smooth 4–6 second cinematic pacing per scene.
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Scene Photos & Visuals (55%) */}
              <div className="lg:col-span-7 space-y-4">
          {/* CARD 2: SCENE IMAGES MANAGER */}
          <div className="rounded-[24px] sm:rounded-[28px] border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-orange-600 shrink-0">
                  <ImageIcon size={18} />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    2. Scene Photos &amp; Visuals ({imageFiles.length}/100)
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    Photos for 16:9 cinema visual montage with Ken Burns motion
                  </p>
                </div>
              </div>

              {imageFiles.length > 0 && onClearAllImages && (
                <button
                  type="button"
                  onClick={onClearAllImages}
                  className="text-xs text-slate-500 hover:text-red-600 font-bold transition cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Hidden Input */}
            <input
              ref={imageFileInputRef}
              type="file"
              accept="image/*,.png,.jpg,.jpeg,.webp"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Image Upload Box */}
            <div
              onClick={() => imageFileInputRef.current?.click()}
              className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-orange-50/30 hover:border-orange-400 p-4 sm:p-6 text-center transition-all cursor-pointer shadow-inner"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 group-hover:bg-orange-50 group-hover:border-orange-200 text-slate-500 group-hover:text-orange-600 transition-all mb-2">
                <Upload size={20} />
              </div>
              <p className="text-xs font-bold text-slate-900 mb-0.5">
                Select or drop multiple scene images here
              </p>
              <p className="text-[11px] text-slate-500">
                Supports PNG, JPG, WEBP · Up to 100 images
              </p>
            </div>

            {/* Uploaded Images Thumbnail Grid */}
            {imageObjectUrls.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Scene Timeline Sequence:</span>
                  <span>Click thumbnail to view in video player</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
                  {imageObjectUrls.map((url, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActivePreviewIndex(idx)}
                      className={`group relative aspect-video rounded-xl overflow-hidden border transition-all cursor-pointer ${
                        activePreviewIndex === idx
                          ? 'border-orange-500 ring-2 ring-orange-500/30 scale-[1.02]'
                          : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Scene ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-mono font-bold text-white backdrop-blur-xs">
                        #{idx + 1}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveImage(idx);
                        }}
                        className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/80 hover:bg-red-600 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all cursor-pointer shadow-xs"
                        title="Delete image"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
              </div>

            </div>
          </div>
        )}
        {/* ======================================================================= */}
        {/* STEP 2: CHOOSE MUSIC (Soundtrack & Volume Control)                       */}
        {/* ======================================================================= */}
        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                2. Pick your soundtrack
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Choose ambient background music from our library or upload your own track. Music automatically ducks under your spoken voiceover.
              </p>
            </div>

            {/* Pinned Volume & Enable Bar */}
            <div className="p-5 rounded-3xl border border-slate-200 bg-slate-50/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={bgmEnabled}
                  onChange={(e) => onChangeBgmEnabled && onChangeBgmEnabled(e.target.checked)}
                  className="w-4 h-4 accent-orange-500 rounded"
                />
                <div>
                  <span className="text-xs sm:text-sm font-black text-slate-900">Enable Background Audio</span>
                  <p className="text-[11px] text-slate-500">Auto-ducks smoothly under spoken narration</p>
                </div>
              </label>

              {bgmEnabled && (
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                  <span className="text-xs font-bold text-slate-600">Volume:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={bgmVolume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="flex-1 sm:w-44 accent-orange-500 cursor-pointer"
                  />
                  <span className="font-mono text-xs font-bold text-orange-600 w-11 text-right">
                    {Math.round(bgmVolume * 100)}%
                  </span>
                </div>
              )}
            </div>

            {bgmEnabled && (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={bgmSearchQuery}
                    onChange={(e) => setBgmSearchQuery(e.target.value)}
                    placeholder="Search music by title, mood or category (e.g. Lofi, Cinematic, Piano)..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-orange-500 transition shadow-inner"
                  />
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {bgmCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setBgmCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                        bgmCategory === cat
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* List of Tracks (Comfortable 64px tall cards) */}
                <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {filteredBgmTracks.map((track) => {
                    const isSelected = selectedLibraryBgmUrl === track.path;
                    const isPlaying = playingBgmId === track.id;
                    return (
                      <div
                        key={track.id}
                        onClick={() => onChangeSelectedLibraryBgmUrl && onChangeSelectedLibraryBgmUrl(track.path)}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-2 border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20 shadow-xs'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0 pr-3">
                          {/* 40px Circular Play Button */}
                          {track.path !== 'none' ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTogglePlayBgm(track);
                              }}
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all cursor-pointer ${
                                isPlaying
                                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/30 scale-105'
                                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-2xs'
                              }`}
                              title="Audition track"
                            >
                              {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
                            </button>
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                              <VolumeX size={16} />
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-black text-slate-900 truncate">
                              {track.label}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {track.desc} · <span className="font-semibold text-slate-700">{track.category}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onChangeSelectedLibraryBgmUrl) onChangeSelectedLibraryBgmUrl(track.path);
                            }}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                              isSelected
                                ? 'bg-orange-600 text-white shadow-xs'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {isSelected ? '✓ Selected' : 'Select'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
        {/* ======================================================================= */}
        {/* STEP 3: CHOOSE STYLE & VISUAL MOTION (32 Caption Styles & Ken Burns)      */}
        {/* ======================================================================= */}
        {currentStep === 3 && (
          <div className="max-w-5xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                3. Choose Style &amp; Visual Motion
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Pick from 32 broadcast kinetic subtitle styles, configure camera motion (Ken Burns), and framing mode.
              </p>
            </div>

            {/* 32 Caption Styles Section matching user reference screenshots */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2 font-sans">
                    Pick a caption effect
                    <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 text-[10px] font-black uppercase">
                      32 Styles
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Extra emphasis applied to caption words. Click or hover any style to preview playback.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Autoplay Audition Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setIsAutoplayPreviewActive(!isAutoplayPreviewActive)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer select-none ${
                      isAutoplayPreviewActive
                        ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    title="Toggle continuous word animation on caption cards"
                  >
                    {isAutoplayPreviewActive ? (
                      <>
                        <Pause size={12} className="fill-orange-600" />
                        <span className="hidden sm:inline">Pause Preview</span>
                      </>
                    ) : (
                      <>
                        <Play size={12} className="fill-slate-600" />
                        <span className="hidden sm:inline">Play Preview</span>
                      </>
                    )}
                  </button>

                  {/* Search Input matching reference */}
                  <div className="relative w-full sm:w-56">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={captionSearchQuery}
                      onChange={(e) => setCaptionSearchQuery(e.target.value)}
                      placeholder="Search styles..."
                      className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 transition shadow-2xs"
                    />
                    {captionSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setCaptionSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-0.5 cursor-pointer"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Vibe Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {captionCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCaptionCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                      captionCategory === cat
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Visual Preview Cards Grid matching User Reference Screenshot */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 pt-1">
                {/* 0. Optional 'None' Card matching user reference image */}
                {(!captionSearchQuery || 'none'.includes(captionSearchQuery.toLowerCase())) && (captionCategory === 'All' || captionCategory === 'Clean') && (
                  <div
                    onClick={() => {
                      if (onChangeSubtitleStyle) onChangeSubtitleStyle('none');
                      setAuditioningStyleId('none');
                    }}
                    className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col text-left select-none ${
                      subtitleStyle === 'none'
                        ? 'ring-2 ring-orange-500 border-orange-500 shadow-md bg-orange-50/20'
                        : 'border-slate-200 hover:border-slate-400/80 hover:shadow-sm bg-white'
                    }`}
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 flex flex-col items-center justify-center p-4">
                      {subtitleStyle === 'none' && (
                        <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md z-10 animate-in zoom-in-75">
                          <Check size={13} className="stroke-[3]" />
                        </div>
                      )}
                      <div className="w-10 h-10 rounded-full border-2 border-slate-300 flex items-center justify-center text-slate-400 group-hover:border-slate-500 group-hover:text-slate-600 transition-colors">
                        <Ban size={18} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 mt-2">
                        No Burnt-in Captions
                      </span>
                    </div>
                    <div className="p-3 flex items-center justify-between gap-2 border-t border-slate-100 bg-white">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                          None
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          Clean cinema visuals only
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        Off
                      </span>
                    </div>
                  </div>
                )}

                {/* 32 Rich Visual Style Preview Cards with Cloudinary Creator Backdrop */}
                {filteredCaptionStyles.map((style) => {
                  const isSelected = subtitleStyle === style.id || subtitleStyle === style.name;
                  const isActivelyAuditioning =
                    (auditioningStyleId === style.id) ||
                    (hoveredStyleId === style.id) ||
                    (!auditioningStyleId && isSelected);

                  return (
                    <div
                      key={style.id}
                      onClick={() => {
                        if (onChangeSubtitleStyle) onChangeSubtitleStyle(style.id);
                        setAuditioningStyleId(style.id);
                      }}
                      onMouseEnter={() => setHoveredStyleId(style.id)}
                      onMouseLeave={() => setHoveredStyleId(null)}
                      className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col text-left select-none ${
                        isSelected
                          ? 'ring-2 ring-orange-500 border-orange-500 shadow-md bg-orange-50/20'
                          : 'border-slate-200 hover:border-slate-400/80 hover:shadow-sm bg-white'
                      }`}
                      title={`Select ${style.name}`}
                    >
                      {/* Video/Photo Preview Box with Cloudinary Backdrop */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                        <img
                          src={CAPTION_PREVIEW_CREATOR_IMAGE}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* High-contrast gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/35" />

                        {/* Top-Left Live Audition / Play Indicator */}
                        <div className="absolute top-2 left-2 z-10">
                          {isActivelyAuditioning ? (
                            <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider bg-black/80 backdrop-blur-xs text-orange-400 px-2.5 py-0.5 rounded-full border border-orange-500/50 shadow-sm animate-in fade-in">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping inline-block" />
                              Preview
                            </span>
                          ) : (
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-xs text-white px-2 py-0.5 rounded-md border border-white/20">
                              <Play size={9} fill="currentColor" /> Play
                            </span>
                          )}
                        </div>

                        {/* Top-Right Selected Checkmark Badge (matching reference screenshot) */}
                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg z-10 animate-in zoom-in-75">
                            <Check size={13} className="stroke-[3]" />
                          </div>
                        )}

                        {/* Center Animated Caption Text */}
                        <div className="relative z-10 w-full px-1">
                          {renderPreviewCaptionWords(
                            style.id,
                            style.color,
                            style.fontFamily,
                            isActivelyAuditioning ? previewWordStep : 1
                          )}
                        </div>
                      </div>

                      {/* Card Footer Info */}
                      <div className="p-3 flex items-center justify-between gap-2 border-t border-slate-100 bg-white">
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                            {style.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {style.desc}
                          </p>
                        </div>
                        <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-700 transition-colors">
                          {style.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Master Cinema Live Preview Banner */}
              <div className="mt-4 rounded-2xl bg-slate-950 p-4 sm:p-5 border border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                      Active Caption Preset
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                      {currentCaptionObj.name}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                        {currentCaptionObj.category}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {currentCaptionObj.desc}
                    </p>
                  </div>
                </div>

                {/* Dynamic Preview Words Chip */}
                <div className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-black/60 border border-slate-800 flex items-center justify-center">
                  {renderPreviewCaptionWords(
                    currentCaptionObj.id,
                    currentCaptionObj.color,
                    currentCaptionObj.fontFamily,
                    previewWordStep
                  )}
                </div>
              </div>
            </div>

            {/* Visual Framing & Camera Motion Settings */}
            {/* CARD 5: VIDEO FRAMING & MOTION SETTINGS */}
          <div className="rounded-[28px] border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
                <Sliders size={18} />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 tracking-tight">
                  5. Visual Framing &amp; Motion
                </h2>
                <p className="text-xs text-slate-500">
                  Project title, cinema fit mode, and camera zoom speed
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Project Title
                </label>
                <input
                  type="text"
                  value={topicTitle}
                  onChange={(e) => onChangeTopicTitle && onChangeTopicTitle(e.target.value)}
                  placeholder="e.g. Journey to the Stars..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Image Fit Mode
                </label>
                <select
                  value={fitMode}
                  onChange={(e) => onChangeFitMode && onChangeFitMode(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="cover">16:9 Cover (Cinematic Fill)</option>
                  <option value="blur-fill">Blur-Fill Ambient Letterbox</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Camera Motion
                </label>
                <select
                  value={cameraMotionPreset}
                  onChange={(e) => onChangeCameraMotionPreset && onChangeCameraMotionPreset(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="ken-burns">Ken Burns Smooth Zoom &amp; Pan</option>
                  <option value="subtle-parallax">Subtle Parallax Motion</option>
                  <option value="static">Static Cut</option>
                </select>
              </div>
            </div>
          </div>
          </div>
        )}
        {/* ======================================================================= */}
        {/* ======================================================================= */}
        {/* STEP 4: SMART SCENE & SUBTITLE EDITOR ("Edit & Render")                 */}
        {/* ======================================================================= */}
        {currentStep === 4 && (!selectedAudio || imageFiles.length === 0) && (
          <div className="max-w-2xl mx-auto text-center py-16 px-6 sm:px-8 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-6 animate-in fade-in duration-200 my-8">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shadow-2xs">
              <UploadCloud size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Upload Your Audio &amp; Photos to Preview
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Step 4 generates a live timeline preview of your actual narration speech and scene photos. Please complete Step 1 first.
              </p>
            </div>

            {/* Clear Checklist of what's missing */}
            <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${selectedAudio ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span>{selectedAudio ? `✓ Audio: ${selectedAudio.name}` : '• Narration Audio Needed'}</span>
              </div>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${imageFiles.length > 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span>{imageFiles.length > 0 ? `✓ ${imageFiles.length} Photos Uploaded` : '• Scene Photos Needed'}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs shadow-md shadow-orange-500/20 transition cursor-pointer inline-flex items-center gap-2"
              >
                <span>Go to Step 1 — Upload Assets</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && Boolean(selectedAudio && imageFiles.length > 0) && (
          <div className="max-w-7xl mx-auto w-full space-y-4 sm:space-y-5 animate-in fade-in duration-200">
            {/* Top Studio Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight font-sans flex items-center gap-2">
                  4. Edit &amp; Render · Timeline Studio
                  {isUsingAutoBroll && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200 shrink-0">
                      Auto B-Roll
                    </span>
                  )}
                </h2>
                <p className="hidden sm:block text-xs sm:text-sm text-slate-500 mt-0.5">
                  CapCut-style multitrack timeline editor. Preview is 100% free — fine-tune scenes, sentence text, and pacing before cloud render!
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-600 px-2.5 sm:px-3 py-1 rounded-xl bg-slate-100 border border-slate-200">
                  1080p Full HD · 30 FPS
                </span>
                <span className="text-[11px] sm:text-xs font-black text-orange-600 px-2.5 sm:px-3 py-1 rounded-xl bg-orange-50 border border-orange-200">
                  {calculatedCredits} Credit{calculatedCredits > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* =================================================================== */}
            {/* TOP SECTION: 16:9 CINEMA MONITOR (LEFT) + PROPERTIES INSPECTOR (RIGHT) */}
            {/* =================================================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              
              {/* LEFT 7 COLS: 16:9 CINEMA MONITOR STAGE */}
              <div className="lg:col-span-7 flex flex-col justify-between rounded-[24px] sm:rounded-[28px] border border-slate-200 bg-white p-3.5 sm:p-5 shadow-xs space-y-3 sm:space-y-3.5">
                {/* Top Monitor Bar */}
                <div className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="font-black text-slate-900 uppercase tracking-wider text-[11px] truncate">
                      <span className="hidden sm:inline">16:9 Cinema </span>Monitor
                    </span>
                    <span className="text-slate-300 shrink-0">·</span>
                    <span className="font-bold text-orange-600 text-[11px] whitespace-nowrap shrink-0">
                      Scene #{activePreviewIndex + 1}/{effectiveSceneDurations.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 whitespace-nowrap">
                      {(perSceneMotion[activePreviewIndex] || cameraMotionPreset) === 'ken-burns' ? 'Ken Burns' : 'Static'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('cinema-player-viewport');
                        if (el) {
                          if (document.fullscreenElement) {
                            document.exitFullscreen();
                          } else {
                            el.requestFullscreen();
                          }
                        }
                      }}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                      title="Toggle Fullscreen"
                    >
                      <Maximize2 size={13} />
                    </button>
                  </div>
                </div>

                {/* 16:9 Cinema Viewport Screen */}
                <div
                  id="cinema-player-viewport"
                  className="group relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-[#07090E] shadow-xl flex items-center justify-center select-none"
                >
                  {/* Active Scene Visual with Ken Burns Animation */}
                  {activeDisplaySceneUrls[activePreviewIndex] ? (
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                      <img
                        src={activeDisplaySceneUrls[activePreviewIndex]}
                        alt={`Scene ${activePreviewIndex + 1}`}
                        className={`w-full h-full transition-transform duration-1000 ${
                          (perSceneMotion[activePreviewIndex] || cameraMotionPreset) === 'static'
                            ? 'object-cover'
                            : fitMode === 'blur-fill'
                            ? 'object-contain scale-95 drop-shadow-2xl'
                            : 'object-cover scale-105 group-hover:scale-110 transition-transform duration-10000'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />
                    </div>
                  ) : (
                    <div className="text-slate-500 text-center p-6">
                      <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-bold text-slate-300">Cinema Monitor Ready</p>
                    </div>
                  )}

                  {/* Top-Right In-Canvas Controls */}
                  <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleTriggerReplaceScene(activePreviewIndex)}
                      className="px-2 sm:px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-white hover:bg-black text-[10px] font-bold flex items-center gap-1 transition cursor-pointer shadow-md"
                      title="Replace photo for this scene"
                    >
                      <RefreshCw size={11} />
                      <span className="hidden sm:inline">Replace Photo</span>
                      <span className="sm:hidden">Replace</span>
                    </button>
                  </div>

                  {/* Top-Left Scene Badge */}
                  <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono font-bold shadow-md">
                      Scene #{activePreviewIndex + 1} · {(effectiveSceneDurations[activePreviewIndex] || 4).toFixed(1)}s
                    </span>
                  </div>

                  {/* In-Canvas Kinetic Subtitle Typography (Strictly One Single Line) */}
                  {displaySubtitle && (
                    <div
                      onClick={() => setStep4ActiveTab('captions')}
                      className="absolute bottom-3 sm:bottom-5 left-2 sm:left-4 right-2 sm:right-4 z-20 flex justify-center cursor-pointer transition-transform hover:scale-102 select-none"
                      title="Click to edit subtitle text in Captions tab"
                    >
                      <div
                        className={`inline-block truncate whitespace-nowrap overflow-hidden max-w-[95%] sm:max-w-2xl px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl text-xs sm:text-base md:text-lg font-black tracking-wide shadow-2xl backdrop-blur-2xs border border-white/10 ${
                          currentCaptionObj.id === 'box-highlight' || currentCaptionObj.id === 'mrbeast-shorts-impact'
                            ? 'bg-yellow-400 text-black shadow-yellow-500/30'
                            : currentCaptionObj.id === 'pill-highlight' || currentCaptionObj.id === 'doctor-pill'
                            ? 'bg-teal-500 text-slate-950 shadow-teal-500/30'
                            : currentCaptionObj.id === 'hormozi-viral-pop'
                            ? 'bg-black/90 text-lime-400 border-2 border-lime-500 shadow-lime-500/30 uppercase'
                            : 'bg-black/65 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]'
                        }`}
                        style={{
                          fontFamily: currentCaptionObj.fontFamily,
                          color:
                            currentCaptionObj.id === 'box-highlight' || currentCaptionObj.id === 'mrbeast-shorts-impact'
                              ? '#000000'
                              : currentCaptionObj.color,
                        }}
                      >
                        {displaySubtitle}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Monitor Playback Controls Bar */}
                <div className="flex items-center justify-between gap-2 sm:gap-3 pt-1">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {/* Skip -5s */}
                    <button
                      type="button"
                      onClick={() => {
                        if (narrationAudioRef.current) {
                          const t = Math.max(0, narrationAudioRef.current.currentTime - 5);
                          narrationAudioRef.current.currentTime = t;
                          setNarrationCurrentTime(t);
                        }
                      }}
                      className="p-1 sm:p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer"
                      title="Rewind 5s"
                    >
                      <SkipBack size={13} />
                    </button>

                    {/* Master Play / Pause */}
                    <button
                      type="button"
                      onClick={handleTogglePlayNarration}
                      className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-md shadow-orange-500/25 transition cursor-pointer active:scale-95"
                      title={isPlayingNarration ? 'Pause (Space)' : 'Play (Space)'}
                    >
                      {isPlayingNarration ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                    </button>

                    {/* Skip +5s */}
                    <button
                      type="button"
                      onClick={() => {
                        if (narrationAudioRef.current) {
                          const t = Math.min(totalAudioTime, narrationAudioRef.current.currentTime + 5);
                          narrationAudioRef.current.currentTime = t;
                          setNarrationCurrentTime(t);
                        }
                      }}
                      className="p-1 sm:p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer"
                      title="Forward 5s"
                    >
                      <SkipForward size={13} />
                    </button>
                  </div>

                  {/* Scrubber Progress Bar */}
                  <div className="flex-1 flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <input
                      type="range"
                      min={0}
                      max={totalAudioTime || 1}
                      step={0.1}
                      value={narrationCurrentTime}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setNarrationCurrentTime(val);
                        if (narrationAudioRef.current) {
                          narrationAudioRef.current.currentTime = val;
                        }
                      }}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-600 shrink-0">
                      {formatTime(narrationCurrentTime)} / {formatTime(totalAudioTime)}
                    </span>
                  </div>

                  {/* Volume Toggle */}
                  <div className="flex items-center gap-1.5 text-slate-500 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const next = !isNarrationMuted;
                        setIsNarrationMuted(next);
                        if (narrationAudioRef.current) narrationAudioRef.current.muted = next;
                      }}
                      className="p-1 sm:p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                      title="Toggle Mute"
                    >
                      {isNarrationMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT 5 COLS: PRO PROPERTIES INSPECTOR DRAWER */}
              <div className="lg:col-span-5 flex flex-col justify-between rounded-[24px] sm:rounded-[28px] border border-slate-200 bg-white text-slate-900 p-3.5 sm:p-5 shadow-xs space-y-3 sm:space-y-4">
                {/* 4 Segmented Tabs: [🎬 Visuals] [💬 Captions] [✨ Summary] */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
                  <button
                    type="button"
                    onClick={() => setStep4ActiveTab('scene')}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      step4ActiveTab === 'scene'
                        ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Film size={12} className={step4ActiveTab === 'scene' ? 'text-orange-600' : ''} />
                    <span>Visuals</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep4ActiveTab('captions')}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      step4ActiveTab === 'captions'
                        ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <FileText size={12} className={step4ActiveTab === 'captions' ? 'text-orange-600' : ''} />
                    <span>Captions ({captionTracks.length || 0})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep4ActiveTab('summary')}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      step4ActiveTab === 'summary'
                        ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles size={12} className={step4ActiveTab === 'summary' ? 'text-orange-600' : ''} />
                    <span>Export</span>
                  </button>
                </div>

                {/* TAB CONTENT REGION */}
                <div className="flex-1 overflow-y-auto scrollbar-thin max-h-[380px] pr-1 space-y-4">
                  {/* TAB 1: VISUALS (Selected Scene Properties) */}
                  {step4ActiveTab === 'scene' && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                            Scene #{activePreviewIndex + 1} Properties
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
                              {(effectiveSceneDurations[activePreviewIndex] || 4).toFixed(1)}s
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Timeline: <span className="font-mono text-slate-700 font-bold">{(sceneTimeRanges[activePreviewIndex]?.start || 0).toFixed(1)}s</span> to <span className="font-mono text-slate-700 font-bold">{(sceneTimeRanges[activePreviewIndex]?.end || 4).toFixed(1)}s</span>
                          </p>
                        </div>
                      </div>

                      {/* Photo Thumbnail with Action Buttons */}
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-2xs">
                        {activeDisplaySceneUrls[activePreviewIndex] && (
                          <img
                            src={activeDisplaySceneUrls[activePreviewIndex]}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleTriggerReplaceScene(activePreviewIndex)}
                            className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1 shadow-md cursor-pointer"
                          >
                            <RefreshCw size={12} />
                            <span>Replace Photo</span>
                          </button>
                        </div>
                      </div>

                      {/* Scene Quick Action Buttons */}
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => handleTriggerReplaceScene(activePreviewIndex)}
                          className="py-2 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition cursor-pointer flex flex-col items-center gap-1 shadow-2xs"
                        >
                          <RefreshCw size={13} className="text-orange-600" />
                          <span>Replace</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicateScene(activePreviewIndex)}
                          className="py-2 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition cursor-pointer flex flex-col items-center gap-1 shadow-2xs"
                        >
                          <Copy size={13} className="text-sky-600" />
                          <span>Duplicate</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteScene(activePreviewIndex)}
                          className="py-2 px-2 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-xs font-bold text-slate-700 hover:text-red-600 transition cursor-pointer flex flex-col items-center gap-1 shadow-2xs"
                        >
                          <Trash2 size={13} className="text-red-500" />
                          <span>Delete</span>
                        </button>
                      </div>

                      {/* Duration Stepper */}
                      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">Scene Duration</span>
                          <span className="font-mono font-bold text-orange-600">
                            {(effectiveSceneDurations[activePreviewIndex] || 4).toFixed(1)}s
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleAdjustSceneDuration(activePreviewIndex, -0.5)}
                            disabled={(effectiveSceneDurations[activePreviewIndex] || 4) <= 1}
                            className="py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition cursor-pointer disabled:opacity-40 shadow-2xs"
                          >
                            − 0.5s
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdjustSceneDuration(activePreviewIndex, 0.5)}
                            disabled={(effectiveSceneDurations[activePreviewIndex] || 4) >= 30}
                            className="py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition cursor-pointer disabled:opacity-40 shadow-2xs"
                          >
                            + 0.5s
                          </button>
                        </div>
                      </div>

                      {/* Camera Motion Preset */}
                      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-2">
                        <span className="block text-xs font-bold text-slate-700">Camera Motion for this Scene</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleSceneMotion(activePreviewIndex, 'ken-burns')}
                            className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                              (perSceneMotion[activePreviewIndex] || cameraMotionPreset) === 'ken-burns'
                                ? 'bg-orange-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900'
                            }`}
                          >
                            Ken Burns (Zoom)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleSceneMotion(activePreviewIndex, 'static')}
                            className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                              (perSceneMotion[activePreviewIndex] || cameraMotionPreset) === 'static'
                                ? 'bg-orange-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900'
                            }`}
                          >
                            Static (Crisp Cut)
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: CAPTIONS (Editable Subtitle Segments & 1-Line Sync) */}
                  {step4ActiveTab === 'captions' && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xs font-bold text-slate-800 shrink-0">Preset:</span>
                          <span className="text-xs font-black text-orange-600 truncate">{currentCaptionObj.name}</span>
                        </div>
                        {/* Format into 1-line clips action */}
                        <button
                          type="button"
                          onClick={handleFormatAllCaptionsToSingleLine}
                          className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 text-[10px] font-bold transition flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                          title="Auto-format all captions into 1-line clips (max 5 words)"
                        >
                          <Sparkles size={11} className="text-orange-600" />
                          <span>1-Line Format</span>
                        </button>
                      </div>

                      {/* Search Subtitles */}
                      <div className="relative">
                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={subtitleSearchQuery}
                          onChange={(e) => setSubtitleSearchQuery(e.target.value)}
                          placeholder="Search speech subtitles..."
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition"
                        />
                      </div>

                      {/* Editable Sentence List */}
                      <div className="space-y-2.5 max-h-[290px] overflow-y-auto scrollbar-thin pr-1">
                        {captionTracks
                          .filter((c) => !subtitleSearchQuery.trim() || c.text.toLowerCase().includes(subtitleSearchQuery.toLowerCase()))
                          .map((c, cIdx) => {
                            const isCur = narrationCurrentTime >= c.startTime && narrationCurrentTime <= c.endTime;
                            return (
                              <div
                                key={c.id}
                                onClick={() => {
                                  if (narrationAudioRef.current) {
                                    narrationAudioRef.current.currentTime = c.startTime;
                                    setNarrationCurrentTime(c.startTime);
                                  }
                                }}
                                className={`p-2.5 rounded-xl border transition cursor-pointer text-left ${
                                  isCur
                                    ? 'bg-orange-50/90 border-orange-300 ring-1 ring-orange-400/30 shadow-2xs'
                                    : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                                }`}
                              >
                                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5">
                                  <span className="font-mono text-orange-600 font-bold bg-white px-1.5 py-0.5 rounded border border-orange-100 shadow-2xs">
                                    {formatTime(c.startTime)} - {formatTime(c.endTime)}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-slate-400">#{cIdx + 1}</span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteCaptionSegment(c.id);
                                      }}
                                      className="p-1 text-slate-400 hover:text-red-600 transition rounded hover:bg-white cursor-pointer"
                                      title="Delete caption segment"
                                    >
                                      <Trash2 size={11} />
                                    </button>
                                  </div>
                                </div>

                                {/* Direct In-Place Editable Textarea */}
                                <textarea
                                  rows={2}
                                  value={c.text}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => handleEditCaptionSegment(c.id, e.target.value)}
                                  placeholder="Type subtitle phrase..."
                                  className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition resize-none leading-relaxed"
                                />
                              </div>
                            );
                          })}

                        {captionTracks.length === 0 && (
                          <div className="text-center py-6 text-xs text-slate-400">
                            No subtitle tracks loaded yet. Upload audio or click Add below.
                          </div>
                        )}

                        {/* Add new subtitle button */}
                        <button
                          type="button"
                          onClick={handleAddCaptionSegment}
                          className="w-full py-2 rounded-xl border border-dashed border-slate-300 hover:border-orange-400 hover:bg-orange-50 text-slate-600 hover:text-orange-600 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Plus size={13} />
                          <span>Add Subtitle Phrase</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: EXPORT (Summary & Cloud Render) */}
                  {step4ActiveTab === 'summary' && (
                    <div className="space-y-4 animate-in fade-in duration-150 text-xs">
                      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm">Project Specifications</h4>
                        <div className="space-y-1 text-slate-600">
                          <div className="flex justify-between py-1 border-b border-slate-200/80">
                            <span>Format:</span>
                            <span className="font-bold text-slate-900">16:9 Widescreen MP4</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-200/80">
                            <span>Resolution:</span>
                            <span className="font-bold text-slate-900">1920 × 1080 (Full HD)</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-200/80">
                            <span>Total Duration:</span>
                            <span className="font-bold text-slate-900">{totalAudioTime.toFixed(0)} Seconds</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-200/80">
                            <span>Scene Count:</span>
                            <span className="font-bold text-slate-900">{effectiveSceneDurations.length} Scenes</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-200/80">
                            <span>Soundtrack:</span>
                            <span className="font-bold text-slate-900">{currentBgmObj.label}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span>Credit Rate:</span>
                            <span className="font-black text-orange-600">1 Min = 1 Credit</span>
                          </div>
                        </div>
                      </div>

                      {/* Render CTA */}
                      <button
                        type="button"
                        onClick={() => {
                          if (!canRender) {
                            setCurrentStep(1);
                            return;
                          }
                          if (onStartRender) onStartRender();
                        }}
                        disabled={isRendering}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white font-black text-sm shadow-md shadow-orange-500/25 transition cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                      >
                        <Sparkles size={16} />
                        <span>Render 1080p Video ({calculatedCredits} Credit{calculatedCredits > 1 ? 's' : ''})</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Bottom Inspector Pill */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Preview is 100% Free
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep4ActiveTab('summary')}
                    className="font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                  >
                    View Export Specs →
                  </button>
                </div>
              </div>
            </div>

            {/* =================================================================== */}
            {/* MIDDLE BAR: CAPCUT-STYLE ACTION TOOLBAR                             */}
            {/* =================================================================== */}
            <div className="rounded-2xl border border-slate-200 bg-white p-2 sm:p-2.5 px-3 sm:px-4 text-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-2 sm:gap-3 select-none">
              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-0.5 max-w-full">
                {/* Split at Playhead */}
                <button
                  type="button"
                  onClick={handleSplitClipAtPlayhead}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
                  title="Split active scene clip at playhead"
                >
                  <Scissors size={13} className="text-orange-600" />
                  <span>Split</span>
                </button>

                {/* Replace Photo */}
                <button
                  type="button"
                  onClick={() => handleTriggerReplaceScene(activePreviewIndex)}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
                  title="Replace photo for selected scene"
                >
                  <RefreshCw size={13} className="text-emerald-600" />
                  <span className="hidden sm:inline">Replace</span>
                </button>

                {/* Duplicate */}
                <button
                  type="button"
                  onClick={() => handleDuplicateScene(activePreviewIndex)}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
                  title="Duplicate scene"
                >
                  <Copy size={13} className="text-sky-600" />
                  <span className="hidden sm:inline">Duplicate</span>
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDeleteScene(activePreviewIndex)}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200 hover:border-red-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
                  title="Delete scene"
                >
                  <Trash2 size={13} className="text-red-500" />
                  <span className="hidden sm:inline">Delete</span>
                </button>

                {/* Add Photo */}
                <button
                  type="button"
                  onClick={() => imageFileInputRef.current?.click()}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
                  title="Add more photos"
                >
                  <Plus size={13} className="text-amber-500" />
                  <span className="hidden md:inline">Add Media</span>
                </button>

                <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block shrink-0" />

                {/* Undo / Redo */}
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={!canUndo}
                  className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 disabled:opacity-30 text-slate-700 transition cursor-pointer shadow-2xs shrink-0"
                  title="Undo"
                >
                  <Undo2 size={13} />
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={!canRedo}
                  className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 disabled:opacity-30 text-slate-700 transition cursor-pointer shadow-2xs shrink-0"
                  title="Redo"
                >
                  <Redo2 size={13} />
                </button>
              </div>

              {/* Right: Zoom Controls & Playhead Time */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-100 px-1.5 sm:px-2 py-1 rounded-xl text-xs border border-slate-200">
                  <ZoomOut size={12} className="text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setTimelineZoom(1)}
                    className={`px-1.5 sm:px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      timelineZoom === 1 ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    1x
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimelineZoom(1.5)}
                    className={`px-1.5 sm:px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      timelineZoom === 1.5 ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    1.5x
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimelineZoom(2)}
                    className={`px-1.5 sm:px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      timelineZoom === 2 ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    2x
                  </button>
                  <ZoomIn size={12} className="text-slate-400" />
                </div>

                <div className="text-xs font-mono font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 sm:px-2.5 py-1 rounded-xl">
                  {formatTime(narrationCurrentTime)}
                </div>
              </div>
            </div>

            {/* =================================================================== */}
            {/* BOTTOM SECTION: FULL-WIDTH MULTITRACK TIMELINE WORKSPACE             */}
            {/* =================================================================== */}
            <div className="rounded-[24px] sm:rounded-[28px] border border-slate-200 bg-white p-3.5 sm:p-5 text-slate-800 shadow-xs space-y-3 select-none overflow-hidden">
              
              {/* Timeline Header & Track Badges */}
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
                  <Layers size={13} className="text-orange-600" />
                  Multitrack Timeline
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {effectiveSceneDurations.length} Scenes · {totalAudioTime.toFixed(0)}s Duration
                </span>
              </div>

              {/* TIMELINE SCROLL REGION */}
              <div className="overflow-x-auto pb-2 scrollbar-thin touch-pan-x">
                <div
                  className="relative min-w-[620px] sm:min-w-[700px] space-y-2"
                  style={{ width: `${Math.max(100, timelineZoom * 100)}%` }}
                >
                  {/* LIVE ORANGE PLAYHEAD NEEDLE (Runs vertically through all 4 tracks) */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-orange-500 z-40 pointer-events-none transition-[left] duration-100"
                    style={{
                      left: `${Math.min(99.5, Math.max(0.2, (narrationCurrentTime / (totalAudioTime || 1)) * 100))}%`,
                    }}
                  >
                    <div className="w-3 h-3 bg-orange-500 rotate-45 -translate-x-[5px] -top-1.5 shadow-md shadow-orange-500/50" />
                  </div>

                  {/* 1. TIMECODE RULER HEADER */}
                  <div
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                      const newTime = ratio * totalAudioTime;
                      setNarrationCurrentTime(newTime);
                      if (narrationAudioRef.current) narrationAudioRef.current.currentTime = newTime;
                    }}
                    className="h-6 w-full rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-between px-3 text-[10px] font-mono text-slate-600 cursor-pointer"
                    title="Click to scrub playhead"
                  >
                    <span>00:00</span>
                    <span>{formatTime(totalAudioTime * 0.25)}</span>
                    <span>{formatTime(totalAudioTime * 0.5)}</span>
                    <span>{formatTime(totalAudioTime * 0.75)}</span>
                    <span>{formatTime(totalAudioTime)}</span>
                  </div>

                  {/* 2. TRACK 1: 🎬 SCENE & VIDEO TRACK */}
                  <div className="flex items-center gap-2">
                    <div className="w-20 sm:w-24 shrink-0 flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-black text-slate-700">
                      <Film size={12} className="text-orange-600" />
                      <span>Video</span>
                    </div>

                    <div className="flex-1 flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200 min-h-[76px] overflow-hidden">
                      {activeDisplaySceneUrls.map((url, idx) => {
                        const isCurrent = activePreviewIndex === idx;
                        const dur = effectiveSceneDurations[idx] || 4;
                        const range = sceneTimeRanges[idx] || { start: 0, end: dur };
                        const widthPct = Math.max(8, (dur / (totalAudioTime || 1)) * 100);

                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              setActivePreviewIndex(idx);
                              if (narrationAudioRef.current && range) {
                                narrationAudioRef.current.currentTime = range.start;
                                setNarrationCurrentTime(range.start);
                              }
                              setStep4ActiveTab('scene');
                            }}
                            style={{ width: `${widthPct}%` }}
                            className={`group relative h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 select-none min-w-[80px] sm:min-w-[96px] ${
                              isCurrent
                                ? 'border-orange-500 ring-2 ring-orange-500/40 shadow-md scale-102 z-10'
                                : 'border-slate-200 opacity-85 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                            {/* Scene Number Chip */}
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/80 text-[9px] font-mono font-bold text-white shadow-xs">
                              #{idx + 1}
                            </span>

                            {/* Interactive Clip Duration & Stepper Controls */}
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className={`absolute inset-x-1 bottom-1 flex items-center justify-between gap-1 transition-opacity ${
                                isCurrent ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => handleAdjustSceneDuration(idx, -0.5)}
                                className="h-4 w-4 rounded bg-black/80 hover:bg-black text-[10px] font-bold text-white/90 border border-white/20 flex items-center justify-center transition cursor-pointer"
                                title="Decrease clip by 0.5s"
                              >
                                -
                              </button>
                              <span className="px-1.5 py-0.5 rounded-md bg-orange-600 text-[9px] font-mono font-black text-white shadow-xs">
                                {dur.toFixed(1)}s
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAdjustSceneDuration(idx, 0.5)}
                                className="h-4 w-4 rounded bg-black/80 hover:bg-black text-[10px] font-bold text-white/90 border border-white/20 flex items-center justify-center transition cursor-pointer"
                                title="Increase clip by 0.5s"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. TRACK 2: 💬 SUBTITLE & KINETIC CAPTION TRACK */}
                  <div className="flex items-center gap-2">
                    <div className="w-20 sm:w-24 shrink-0 flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-black text-slate-700">
                      <FileText size={12} className="text-amber-500" />
                      <span>Captions</span>
                    </div>

                    <div className="flex-1 flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 min-h-[38px] overflow-hidden">
                      {captionTracks.length > 0 ? (
                        captionTracks.map((c) => {
                          const isCur = narrationCurrentTime >= c.startTime && narrationCurrentTime <= c.endTime;
                          const dur = Math.max(0.8, c.endTime - c.startTime);
                          const widthPct = Math.max(4, (dur / (totalAudioTime || 1)) * 100);

                          return (
                            <div
                              key={c.id}
                              onClick={() => {
                                if (narrationAudioRef.current) {
                                  narrationAudioRef.current.currentTime = c.startTime;
                                  setNarrationCurrentTime(c.startTime);
                                }
                                setStep4ActiveTab('captions');
                              }}
                              style={{ width: `${widthPct}%` }}
                              className={`h-7 rounded-lg px-2 flex items-center justify-between text-[10px] font-bold transition truncate cursor-pointer shrink-0 min-w-[56px] sm:min-w-[72px] ${
                                isCur
                                  ? 'bg-amber-400 text-black shadow-xs font-black scale-102 z-10'
                                  : 'bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100'
                              }`}
                              title={c.text}
                            >
                              <span className="truncate">{c.text}</span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="w-full text-center text-[10px] text-slate-400 font-mono py-1">
                          Kinetic Subtitles Track Synced to Voiceover
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 4. TRACK 3: 🎙️ VOICEOVER AUDIO WAVEFORM TRACK */}
                  <div className="flex items-center gap-2">
                    <div className="w-20 sm:w-24 shrink-0 flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-black text-slate-700">
                      <Mic size={12} className="text-cyan-600" />
                      <span>Voiceover</span>
                    </div>

                    <div className="flex-1 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center px-2 overflow-hidden gap-1">
                      {Array.from({ length: 64 }).map((_, barIdx) => {
                        const barRatio = barIdx / 64;
                        const barTime = barRatio * totalAudioTime;
                        const isPast = barTime <= narrationCurrentTime;
                        // Simulated speech energy height
                        const pseudoHeight = Math.max(20, Math.min(95, ((Math.sin(barIdx * 0.7) * 40 + Math.cos(barIdx * 1.3) * 35) + 50)));

                        return (
                          <div
                            key={barIdx}
                            style={{ height: `${pseudoHeight}%` }}
                            className={`flex-1 rounded-full transition-colors duration-150 ${
                              isPast ? 'bg-orange-500 shadow-xs' : 'bg-slate-200'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* 5. TRACK 4: 🎵 BACKGROUND MUSIC TRACK */}
                  <div className="flex items-center gap-2">
                    <div className="w-20 sm:w-24 shrink-0 flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-black text-slate-700">
                      <Music size={12} className="text-orange-500" />
                      <span>Music</span>
                    </div>

                    <div className="flex-1 h-8 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between px-3 text-[10px] font-bold text-orange-950">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        <span>{currentBgmObj.label}</span>
                        <span className="text-orange-700 font-normal">({bgmEnabled ? `${Math.round(bgmVolume * 100)}% Volume` : 'Muted'})</span>
                      </div>
                      <span className="font-mono text-[9px] text-orange-700 uppercase">
                        Auto-Ducked Soundtrack
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Hidden Single Image Replace File Input */}
            <input
              ref={singleImageReplaceInputRef}
              type="file"
              accept="image/*,.png,.jpg,.jpeg,.webp"
              onChange={handleSingleImageFileSelected}
              className="hidden"
            />
          </div>
        )}</main>
      {/* ========================================================================= */}
      {/* ROW 3: STICKY ACTION BAR (Back on left, primary Next/Render on right)      */}
      {/* ========================================================================= */}
      <footer className="shrink-0 border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 pb-[max(12px,env(safe-area-inset-bottom))] z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Left: Back Button */}
          <div className={currentStep === 1 ? 'hidden sm:block' : ''}>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (Math.max(1, prev - 1) as 1 | 2 | 3 | 4))}
                className="inline-flex items-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs sm:text-sm font-bold text-slate-700 transition cursor-pointer shadow-xs active:scale-98 min-h-[42px]"
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>
            ) : (
              <div className="text-xs text-slate-400 font-medium hidden sm:block">
                Step 1 of 4 · Upload Narration &amp; Photos
              </div>
            )}
          </div>

          {/* Center: Live Status / Guidance */}
          <div className="text-center hidden md:block">
            {currentStep === 1 && !canProceedToStep2 && (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
                {!selectedAudio ? '🎙 Upload narration audio to continue' : '🖼 Add at least 1 scene photo to continue'}
              </span>
            )}
            {currentStep === 1 && canProceedToStep2 && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                ✓ {detectedAudioDuration}s Audio · {imageFiles.length} Photos ready
              </span>
            )}
            {currentStep === 2 && (
              <span className="text-xs font-medium text-slate-600">
                Soundtrack: <strong className="text-slate-900">{currentBgmObj.label}</strong> ({bgmEnabled ? `${Math.round(bgmVolume * 100)}% Volume` : 'Disabled'})
              </span>
            )}
            {currentStep === 3 && (
              <span className="text-xs font-medium text-slate-600">
                Caption Style: <strong className="text-orange-600">{currentCaptionObj.name}</strong> · Motion: <strong className="text-slate-900">{cameraMotionPreset === 'ken-burns' ? 'Ken Burns' : 'Static'}</strong>
              </span>
            )}
            {currentStep === 4 && (
              <span className="text-xs font-medium text-slate-600">
                Ready to Render: <strong className="text-orange-600 font-mono font-bold">{calculatedCredits} Credit{calculatedCredits > 1 ? 's' : ''}</strong> (1080p Full HD)
              </span>
            )}
          </div>

          {/* Right: Next / Render Button */}
          <div className={`flex items-center gap-2 ${currentStep === 1 ? 'w-full sm:w-auto justify-end' : 'flex-1 sm:flex-initial justify-end'}`}>
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => {
                  setCurrentStep((prev) => (Math.min(4, prev + 1) as 1 | 2 | 3 | 4));
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all shadow-md shadow-orange-500/25 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white active:scale-98 cursor-pointer min-h-[42px]"
              >
                <span>
                  {currentStep === 1
                    ? 'Next: Choose Music'
                    : currentStep === 2
                    ? 'Next: Choose Style'
                    : 'Next: Preview Video'}
                </span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onStartRender && onStartRender()}
                disabled={isRendering || !canRender}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all shadow-md shadow-orange-500/25 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white active:scale-98 cursor-pointer min-h-[42px] disabled:opacity-50"
              >
                {isRendering ? (
                  <>
                    <Film size={16} className="animate-spin" />
                    <span>Rendering...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Render 1080p Video ({calculatedCredits} Cr)</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </footer>

    </div>
  );
}
