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
  Clock,
  Tag,
  Headphones,
  RefreshCw,
  Download,
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
  { id: 'hormozi-viral-pop', name: 'Hormozi Viral Pop', color: '#22C55E', fontFamily: 'Impact, sans-serif', category: 'Viral', badge: 'Retention', desc: 'Ultra-bold lime green high-retention text' },
  { id: 'mrbeast-shorts-impact', name: 'MrBeast Shorts Impact', color: '#FFE500', fontFamily: 'Impact, Montserrat, sans-serif', category: 'Viral', badge: 'Creator', desc: 'Punchy yellow bounding box with bold pop' },
  { id: 'solo-word-pop', name: 'Solo Word Pop', color: '#EA580C', fontFamily: 'Montserrat, sans-serif', category: 'Kinetic', badge: 'Solo', desc: 'One high-impact word at a time in center' },

  // Row 5
  { id: 'crazy-kinetic', name: 'Crazy Kinetic', color: '#EC4899', fontFamily: 'Impact, sans-serif', category: 'Kinetic', badge: 'Crazy', desc: 'High-speed bouncing kinetic typography' },
  { id: 'submagic-glow', name: 'Submagic Glow', color: '#A855F7', fontFamily: 'Montserrat, sans-serif', category: 'Viral', badge: 'Magic', desc: 'Vibrant purple magical outer glow' },
  { id: 'simple-clean', name: 'Simple Clean', color: '#F8FAFC', fontFamily: 'Inter, system-ui, sans-serif', category: 'Clean', badge: 'Minimal', desc: 'Distraction-free minimal clean font' },
  { id: 'ali-abdaal-modern', name: 'Ali Abdaal Modern', color: '#38BDF8', fontFamily: 'Inter, system-ui, sans-serif', category: 'Modern', badge: 'Productive', desc: 'Subtle slate pill with sky blue active word' },

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

export interface ImageToVideoStudioProps {
  selectedAudio: File | null;
  onSelectAudio: (file: File | null) => void;
  imageFiles: File[];
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

export function ImageToVideoStudio({
  selectedAudio,
  onSelectAudio,
  imageFiles,
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
  const [playingBgmId, setPlayingBgmId] = useState<string | null>(null);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);
  const [captionCategory, setCaptionCategory] = useState<string>('All');
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
    onRemoveImage(indexToRemove);
    if (activePreviewIndex >= imageFiles.length - 1) {
      setActivePreviewIndex(Math.max(0, imageFiles.length - 2));
    }
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

  const displaySubtitle = 
    activeCaption?.text ||
    (activeSceneText.trim().length > 0 
      ? activeSceneText 
      : (editableTranscript.trim().length > 0 ? editableTranscript : ''));

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

  // Audio Duration Detection & Preview URL
  const [detectedAudioDuration, setDetectedAudioDuration] = useState<number>(estimatedDurationSeconds);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string>('');

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

      // Populate sentence-by-sentence caption tracks from Groq Whisper segments
      if (Array.isArray(payload.segments) && payload.segments.length > 0) {
        const tracks: CaptionTrackItem[] = payload.segments.map((seg: any, idx: number) => ({
          id: `seg-${idx + 1}-${Date.now()}`,
          index: idx + 1,
          startTime: Number((seg.start || 0).toFixed(2)),
          endTime: Number((seg.end || (seg.start || 0) + 3).toFixed(2)),
          text: String(seg.text || '').trim(),
        }));
        setCaptionTracks(tracks);
      } else if (rawTranscript) {
        const sentences = rawTranscript
          .split(/(?<=[.?!])\s+/)
          .map((s: string) => s.trim())
          .filter(Boolean);
        const duration = detectedAudioDuration > 0 ? detectedAudioDuration : (estimatedDurationSeconds || 60);
        const step = duration / Math.max(1, sentences.length);
        const tracks: CaptionTrackItem[] = sentences.map((st, idx) => ({
          id: `seg-${idx + 1}-${Date.now()}`,
          index: idx + 1,
          startTime: Number((idx * step).toFixed(2)),
          endTime: Number(((idx + 1) * step).toFixed(2)),
          text: st,
        }));
        setCaptionTracks(tracks);
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

  // Load sample demo subtitles
  const handleLoadDemoCaptions = () => {
    const sampleSentences = [
      "Welcome to this comprehensive tutorial on web development and design systems.",
      "Today we are exploring modern UI architecture and state management.",
      "First, let's understand how rendering performance works with virtual lists.",
      "Notice how seamless the synchronization is between the video timeline and text.",
      "You can edit any caption line directly by clicking on the edit button.",
      "Notice the active highlight following the current timestamp precisely.",
      "Searching through caption tracks takes less than a few milliseconds.",
      "Subtitles enhance accessibility and video engagement across all global audiences.",
      "Let's fine-tune the timing offsets for frame-perfect caption alignment.",
      "Exporting your completed transcript as standard .srt format takes one click."
    ];

    let curTime = 0;
    const tracks: CaptionTrackItem[] = sampleSentences.map((st, idx) => {
      const dur = 3.5;
      const item: CaptionTrackItem = {
        id: `sample-${idx + 1}-${Date.now()}`,
        index: idx + 1,
        startTime: Number(curTime.toFixed(2)),
        endTime: Number((curTime + dur).toFixed(2)),
        text: st,
      };
      curTime += dur + 0.2;
      return item;
    });
    setCaptionTracks(tracks);
    if (tracks.length > 0) {
      setNarrationDuration(tracks[tracks.length - 1].endTime + 2);
    }
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

  // Filter 32 caption styles by search query (instant responsive filtering)
  const filteredCaptionStyles = useMemo(() => {
    if (!captionSearchQuery.trim()) return THIRTY_TWO_CAPTION_STYLES;
    const q = captionSearchQuery.toLowerCase();
    return THIRTY_TWO_CAPTION_STYLES.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        (c.desc && c.desc.toLowerCase().includes(q)) ||
        (c.badge && c.badge.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q))
      );
    });
  }, [captionSearchQuery]);

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
  const currentCaptionObj = useMemo(() => {
    return (
      THIRTY_TWO_CAPTION_STYLES.find(
        (c) => c.id === subtitleStyle || c.name.toLowerCase() === (subtitleStyle || '').toLowerCase()
      ) || THIRTY_TWO_CAPTION_STYLES[0]
    );
  }, [subtitleStyle]);

  const canRender = Boolean(selectedAudio && imageFiles.length > 0 && !inputError);

  return (
    <div className="w-full space-y-8 bg-white text-slate-900 pb-20 lg:pb-0">
      
      {/* Studio Header Card (Clean White Surface) */}
      <div className="relative rounded-[28px] border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs overflow-hidden">
        <BorderBeam size={220} duration={14} delay={0} colorFrom="#EA580C" colorTo="#F97316" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-sans">
              Image to Video <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">AI Studio</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Transform spoken narration and scene photos into a broadcast-ready 16:9 widescreen video with Ken Burns motion, kinetic subtitle styles, and ducked background audio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Studio Layout Switcher (Preview on Right vs Left - Desktop & Laptop Only) */}
            <div className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider">
                Preview
              </span>
              <button
                type="button"
                onClick={() => setPreviewPosition('right')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  previewPosition === 'right'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Position preview on the right side (Default)"
              >
                <span>Right Side</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewPosition('left')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  previewPosition === 'left'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Position preview on the left side"
              >
                <span>Left Side</span>
              </button>
            </div>

            <div className="rounded-2xl border border-orange-500/30 bg-orange-50 px-4 py-2 text-center shadow-xs">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-orange-600">Render Rate</span>
              <span className="text-xs sm:text-sm font-black text-orange-600">
                1 Credit / Min ({calculatedCredits} Cr)
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
      </div>

      {/* Main Studio Grid: Reversible Layout (Preview on Right or Left per User Preference) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================================= */}
        {/* CONTROLS COLUMN: Audio, Photos, Caption Styles, BGM                       */}
        {/* ========================================================================= */}
        <div className={`lg:col-span-6 space-y-6 ${previewPosition === 'left' ? 'lg:order-last' : 'lg:order-first'}`}>

          {/* CARD 1: SPOKEN NARRATION AUDIO (BIG SIZE MAIN INPUT) */}
          <div className="rounded-[32px] border-2 border-orange-500/30 bg-gradient-to-b from-orange-50/20 via-white to-white p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-md shadow-orange-500/25">
                  <Mic size={22} className="stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
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
                className="group relative flex flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-orange-300 hover:border-orange-500 bg-white hover:bg-orange-50/40 min-h-[220px] p-8 sm:p-10 text-center transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 group-hover:bg-orange-500 text-orange-600 group-hover:text-white transition-all duration-200 shadow-sm mb-4">
                  <UploadCloud size={30} className="stroke-[2.5]" />
                </div>
                
                <p className="text-base sm:text-lg font-black text-slate-900 mb-1">
                  Drop your narration audio here, or <span className="text-orange-600 underline underline-offset-4">Browse File</span>
                </p>
                
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-4">
                  Supports MP3, WAV, M4A, AAC · Maximum 5 Minutes (300s) · Millisecond Speech Sync
                </p>

                <div className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-black text-white px-5 py-2.5 text-xs font-bold transition shadow-sm">
                  <Upload size={14} />
                  <span>Select Voiceover Audio</span>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border-2 border-orange-300/80 bg-gradient-to-b from-orange-50/40 via-white to-white p-5 sm:p-6 shadow-xs space-y-4">
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

          {/* CARD 2: SCENE IMAGES MANAGER */}
          <div className="rounded-[28px] border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
                  <ImageIcon size={18} />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900 tracking-tight">
                    2. Scene Photos &amp; Visuals ({imageFiles.length}/100)
                  </h2>
                  <p className="text-xs text-slate-500">
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
              className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-orange-50/30 hover:border-orange-400 p-6 text-center transition-all cursor-pointer shadow-inner"
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

          {/* CARD 3: 16:9 KINETIC CAPTION STYLES */}
          <div className="rounded-[28px] border border-slate-200/90 bg-white shadow-xs overflow-hidden transition-all">
            {/* Card Header (Click to Open/Close) */}
            <div
              onClick={() => setIsCaptionsExpanded(!isCaptionsExpanded)}
              className="p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-50/70 transition"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 shadow-xs">
                  <Layers size={20} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-slate-900 tracking-tight">
                      3. Kinetic Caption Styles
                    </h2>
                    <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 text-[10px] font-black uppercase">
                      32 Styles
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    Active: <strong className="font-black text-orange-600">{currentCaptionObj.name}</strong> · Live 16:9 Preview
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <span className="hidden sm:inline-block text-xs font-bold text-orange-600">
                  {isCaptionsExpanded ? 'Collapse' : 'Choose Style'}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition">
                  {isCaptionsExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>
            </div>

            {/* Expanded Content: Faithfully matching reference screenshot media_1794072028915_c9a1f210.png */}
            {isCaptionsExpanded && (
              <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                {/* Header Row: "Captions · style names" on left, Search on right */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                      Captions <span className="text-slate-300 font-normal">·</span> <span className="text-slate-500 font-medium text-sm sm:text-base">style names</span>
                    </h3>
                  </div>

                  {/* Search Input matching reference image */}
                  <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={captionSearchQuery}
                      onChange={(e) => setCaptionSearchQuery(e.target.value)}
                      placeholder="Search styles..."
                      className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 transition shadow-2xs"
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

                {/* 4-Column Grid of 32 Clean Style Buttons matching reference */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2.5 sm:gap-3 pt-1">
                  {filteredCaptionStyles.map((style) => {
                    const isSelected = subtitleStyle === style.id || subtitleStyle === style.name;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => onChangeSubtitleStyle && onChangeSubtitleStyle(style.id)}
                        className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border text-xs sm:text-sm transition-all cursor-pointer text-center select-none truncate ${
                          isSelected
                            ? 'border-2 border-orange-500 bg-orange-50/50 text-orange-600 font-bold shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-800 font-medium shadow-2xs'
                        }`}
                        title={style.name}
                      >
                        {style.name}
                      </button>
                    );
                  })}
                </div>

                {/* If no styles match search */}
                {filteredCaptionStyles.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No caption styles match "{captionSearchQuery}".
                    <button
                      type="button"
                      onClick={() => setCaptionSearchQuery('')}
                      className="block mx-auto mt-2 text-orange-600 font-bold hover:underline cursor-pointer"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CARD 4: BACKGROUND MUSIC (EXPANDABLE ACCORDION) */}
          <div className="rounded-[28px] border border-slate-200/90 bg-white shadow-xs overflow-hidden transition-all">
            {/* Card Header (Click to Open/Close) */}
            <div
              onClick={() => setIsBgmExpanded(!isBgmExpanded)}
              className="p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-50/70 transition"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 shadow-xs">
                  <Music size={20} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-slate-900 tracking-tight">
                      4. Background Music
                    </h2>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                      bgmEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {bgmEnabled ? `${Math.round(bgmVolume * 100)}% Volume` : 'Off'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    Active: <strong className="font-black text-slate-900">{currentBgmObj.label}</strong> ({currentBgmObj.category})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Quick Audition Button right on header */}
                {selectedLibraryBgmUrl !== 'none' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const track = AWS_BGM_TRACKS.find((t) => t.path === selectedLibraryBgmUrl);
                      if (track) handleTogglePlayBgm(track);
                    }}
                    className={`p-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer ${
                      playingBgmId && AWS_BGM_TRACKS.find((t) => t.id === playingBgmId)?.path === selectedLibraryBgmUrl
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                    title="Audition selected track"
                  >
                    {playingBgmId && AWS_BGM_TRACKS.find((t) => t.id === playingBgmId)?.path === selectedLibraryBgmUrl ? (
                      <Pause size={14} />
                    ) : (
                      <Play size={14} />
                    )}
                  </button>
                )}

                <span className="hidden sm:inline-block text-xs font-bold text-orange-600">
                  {isBgmExpanded ? 'Collapse' : 'Choose Music'}
                </span>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition">
                  {isBgmExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>
            </div>

            {/* Expanded Content (Shows when clicked) */}
            {isBgmExpanded && (
              <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                {/* Volume & Enable Bar */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bgmEnabled}
                      onChange={(e) => onChangeBgmEnabled && onChangeBgmEnabled(e.target.checked)}
                      className="w-4 h-4 accent-orange-500 rounded"
                    />
                    <span className="text-xs font-black text-slate-800">Enable Background Audio</span>
                  </label>

                  {bgmEnabled && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-600">Volume:</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={bgmVolume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-28 sm:w-36 accent-orange-500 cursor-pointer"
                      />
                      <span className="font-mono text-xs font-bold text-orange-600 w-11 text-right">
                        {Math.round(bgmVolume * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {bgmEnabled && (
                  <>
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

                    {/* List of Tracks (Matching reference mockup Image 2) */}
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {filteredBgmTracks.map((track) => {
                        const isSelected = selectedLibraryBgmUrl === track.path;
                        const isPlaying = playingBgmId === track.id;
                        return (
                          <div
                            key={track.id}
                            onClick={() => onChangeSelectedLibraryBgmUrl && onChangeSelectedLibraryBgmUrl(track.path)}
                            className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                              isSelected
                                ? 'border-orange-500 bg-orange-50/25 ring-2 ring-orange-500/20 shadow-xs'
                                : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 pr-3">
                              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                                isSelected
                                  ? 'bg-orange-500 text-white border-orange-400'
                                  : 'bg-white text-slate-500 border-slate-200'
                              }`}>
                                <Music size={16} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-black text-slate-900 truncate">
                                  {track.label}
                                </p>
                                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                  {track.desc} · <span className="font-semibold text-slate-700">{track.category}</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {track.path !== 'none' && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTogglePlayBgm(track);
                                  }}
                                  className={`p-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer ${
                                    isPlaying
                                      ? 'bg-orange-500 text-white shadow-sm'
                                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
                                  }`}
                                  title="Audition track"
                                >
                                  {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onChangeSelectedLibraryBgmUrl) onChangeSelectedLibraryBgmUrl(track.path);
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                                  isSelected
                                    ? 'bg-orange-600 text-white shadow-xs'
                                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                                }`}
                              >
                                {isSelected ? 'Selected' : 'Select'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

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

        {/* ========================================================================= */}
        {/* PREVIEW COLUMN: BIG SIZE EDITABLE PREVIEW & RENDER HUB (lg:col-span-6)    */}
        {/* ========================================================================= */}
        <div className={`lg:col-span-6 space-y-6 ${previewPosition === 'left' ? 'lg:order-first' : 'lg:order-last'}`}>

          {/* 16:9 BIG LIVE WIDESCREEN SIMULATED CANVAS & INTERACTIVE INSPECTOR */}
          <div className="rounded-[32px] border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
            
            {/* Top Bar with Live Indicator & Resolution */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-black uppercase tracking-wider text-slate-900">
                  16:9 Cinema Live Editor
                </span>
              </div>
              <div className="flex items-center gap-2">
                {imageFiles.length > 0 && (
                  <span className="text-xs font-bold text-orange-600 px-2.5 py-0.5 rounded-lg bg-orange-50 border border-orange-200">
                    Scene {activePreviewIndex + 1} of {imageFiles.length}
                  </span>
                )}
                <span className="text-xs font-mono font-bold text-slate-500 px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200">
                  1920×1080 Full HD
                </span>
              </div>
            </div>

            {/* Hidden Single Image Replace Input */}
            <input
              ref={singleImageReplaceInputRef}
              type="file"
              accept="image/*,.png,.jpg,.jpeg,.webp"
              onChange={handleSingleImageFileSelected}
              className="hidden"
            />

            {/* BIG 16:9 Cinema Stage */}
            <div className="group relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-slate-800 bg-[#0B0B0E] shadow-xl flex items-center justify-center">
              {/* Active Image Visual with Ken Burns Animation */}
              {imageObjectUrls.length > 0 && imageObjectUrls[activePreviewIndex] ? (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  <img
                    src={imageObjectUrls[activePreviewIndex]}
                    alt={`Scene ${activePreviewIndex + 1}`}
                    className={`w-full h-full transition-transform duration-1000 ${
                      fitMode === 'blur-fill' ? 'object-contain scale-95 drop-shadow-2xl' : 'object-cover'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                </div>
              ) : (
                <div
                  onClick={() => imageFileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center text-zinc-500 gap-3 p-8 text-center cursor-pointer hover:text-zinc-300 transition"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-zinc-400 group-hover:scale-105 transition">
                    <ImageIcon size={34} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-200">
                      Live 16:9 Cinema Preview
                    </p>
                    <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                      Drop voiceover audio and scene photos to start live visual editing
                    </p>
                  </div>
                </div>
              )}

              {/* TOP IN-CANVAS TOOLBAR (Scene Info & Photo Controls Inside Player) */}
              {imageFiles.length > 0 && (
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-white shadow-md">
                      Scene #{activePreviewIndex + 1} of {imageFiles.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => onChangeFitMode && onChangeFitMode(fitMode === 'cover' ? 'blur-fill' : 'cover')}
                      className="px-2.5 py-1.5 rounded-xl bg-black/80 hover:bg-black/95 backdrop-blur-md border border-white/20 text-[11px] font-bold text-slate-200 hover:text-white shadow-md transition cursor-pointer"
                      title="Toggle framing mode"
                    >
                      {fitMode === 'cover' ? '16:9 Cover' : 'Blur Letterbox'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleTriggerReplaceScene(activePreviewIndex)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-orange-600 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-md transition cursor-pointer"
                      title="Replace photo for this scene"
                    >
                      <RefreshCw size={12} />
                      <span>Replace Photo</span>
                    </button>

                    {imageFiles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleSafeRemoveImage(activePreviewIndex)}
                        className="p-1.5 rounded-xl bg-black/80 hover:bg-red-600 backdrop-blur-md border border-white/20 text-white shadow-md transition cursor-pointer"
                        title="Delete this scene photo"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Canvas Left & Right Stepper Arrows */}
              {imageFiles.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActivePreviewIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activePreviewIndex === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white disabled:opacity-0 transition-all cursor-pointer z-20"
                    title="Previous Scene"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePreviewIndex((prev) => Math.min(imageFiles.length - 1, prev + 1))}
                    disabled={activePreviewIndex === imageFiles.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white disabled:opacity-0 transition-all cursor-pointer z-20"
                    title="Next Scene"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* ON-SCREEN SUBTITLE OVERLAY (Click Directly on Video to Edit!) */}
              {displaySubtitle && displaySubtitle.trim().length > 0 ? (
                <div className="absolute bottom-12 sm:bottom-16 left-2 right-2 sm:left-4 sm:right-4 flex justify-center z-20 pointer-events-auto">
                  {isEditingOnScreenText ? (
                    <div className="w-full max-w-xl bg-slate-950/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-orange-500 shadow-2xl space-y-2 animate-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-orange-400">
                          Editing Scene #{activePreviewIndex + 1} Subtitle:
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {(activeSceneText || editableTranscript).split(/\s+/).filter(Boolean).length} words
                        </span>
                      </div>
                      <textarea
                        value={activeSceneText || editableTranscript}
                        onChange={(e) => {
                          handleSceneTextChange(e.target.value);
                          setEditableTranscript(e.target.value);
                        }}
                        autoFocus
                        rows={2}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs sm:text-sm font-semibold text-white leading-relaxed focus:outline-none focus:border-orange-500 shadow-inner"
                        placeholder="Type spoken sentence for this scene..."
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingOnScreenText(false)}
                          className="px-3.5 py-1 rounded-lg text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 transition cursor-pointer shadow-xs"
                        >
                          Save &amp; Close
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setIsEditingOnScreenText(true)}
                      className={`group/sub max-w-xl text-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border shadow-2xl transition-all cursor-pointer hover:ring-2 hover:ring-orange-500/50 hover:scale-[1.01] ${
                        currentCaptionObj.id === 'box-highlight' || currentCaptionObj.id === 'mrbeast-shorts-impact'
                          ? 'bg-yellow-400 border-yellow-500 text-black shadow-yellow-500/20'
                          : currentCaptionObj.id === 'pill-highlight' || currentCaptionObj.id === 'doctor-pill'
                          ? 'bg-teal-950/90 border-teal-500/50 text-teal-100'
                          : currentCaptionObj.id === 'neon-glow' || currentCaptionObj.id === 'submagic-glow'
                          ? 'bg-purple-950/90 border-purple-500/50 shadow-purple-500/30'
                          : currentCaptionObj.id === 'hormozi-viral-pop'
                          ? 'bg-black/95 border-lime-500/50 text-lime-400'
                          : currentCaptionObj.id === 'typewriter'
                          ? 'bg-black/90 border-emerald-500/30 text-emerald-300'
                          : currentCaptionObj.id === 'devane-luxury-serif' || currentCaptionObj.id === 'editorial-dark-gold'
                          ? 'bg-[#0f0e0c]/90 border-amber-500/40 text-amber-200'
                          : 'bg-black/85 backdrop-blur-md border-white/20'
                      }`}
                      title="Click directly to edit subtitle text"
                    >
                      <div className="relative">
                        <p
                          className="text-xs sm:text-sm font-black tracking-wide leading-snug drop-shadow-md"
                          style={{
                            color:
                              currentCaptionObj.id === 'box-highlight' || currentCaptionObj.id === 'mrbeast-shorts-impact'
                                ? '#000000'
                                : currentCaptionObj.color,
                            fontFamily: currentCaptionObj.fontFamily,
                          }}
                        >
                          {displaySubtitle.slice(0, 95)}{displaySubtitle.length > 95 ? '...' : ''}
                        </p>
                        <span className="absolute -top-7 right-0 opacity-0 group-hover/sub:opacity-100 transition-opacity bg-orange-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md pointer-events-none">
                          <Edit3 size={9} /> Click to edit text
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {/* BOTTOM IN-CANVAS TOOLBAR (All Controls Directly INSIDE the Video Player) */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-black/85 backdrop-blur-md border border-white/15 text-white z-20 pointer-events-auto shadow-lg overflow-x-auto scrollbar-none">
                {/* Play/Pause & Time */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTogglePlayNarration}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-600 hover:bg-orange-500 text-white transition cursor-pointer shadow-xs"
                    title={isPlayingNarration ? "Pause Preview" : "Play Preview"}
                  >
                    {isPlayingNarration ? <Pause size={13} /> : <Play size={13} />}
                  </button>
                  <span className="text-[11px] font-mono text-slate-300">
                    {formatAudioTime(narrationCurrentTime)} / {formatAudioTime(narrationDuration || 60)}
                  </span>
                </div>

                {/* In-Canvas Action Controls */}
                <div className="flex items-center gap-1.5">
                  {/* On-Screen Edit Subtitle Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsEditingOnScreenText(!isEditingOnScreenText)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      isEditingOnScreenText
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-white/10 hover:bg-white/20 text-slate-200'
                    }`}
                    title="Edit subtitle text directly on video"
                  >
                    <Edit3 size={11} />
                    <span className="hidden sm:inline">Edit Text</span>
                  </button>

                  {/* Caption Style Switcher Popover */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setInPlayerActivePopover(inPlayerActivePopover === 'style' ? null : 'style')}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                        inPlayerActivePopover === 'style'
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-white/10 hover:bg-white/20 text-slate-200'
                      }`}
                      title="Choose caption style"
                    >
                      <Layers size={11} />
                      <span className="hidden sm:inline truncate max-w-[85px]">{currentCaptionObj.name}</span>
                      <ChevronDown size={10} />
                    </button>

                    {inPlayerActivePopover === 'style' && (
                      <div className="absolute bottom-full right-0 mb-2 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2.5 space-y-1 z-30 max-h-60 overflow-y-auto">
                        <div className="text-[10px] font-bold text-slate-400 px-1 uppercase tracking-wider pb-1">
                          Caption Style (32)
                        </div>
                        {THIRTY_TWO_CAPTION_STYLES.map((st) => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => {
                              onChangeSubtitleStyle && onChangeSubtitleStyle(st.id);
                              setInPlayerActivePopover(null);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition cursor-pointer ${
                              subtitleStyle === st.id || subtitleStyle === st.name
                                ? 'bg-orange-600 text-white font-bold'
                                : 'text-slate-200 hover:bg-white/10'
                            }`}
                          >
                            <span className="truncate">{st.name}</span>
                            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: st.color }} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* BGM Volume Popover */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setInPlayerActivePopover(inPlayerActivePopover === 'audio' ? null : 'audio')}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                        inPlayerActivePopover === 'audio'
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-white/10 hover:bg-white/20 text-slate-200'
                      }`}
                      title="Adjust music volume"
                    >
                      {bgmVolume === 0 ? <VolumeX size={11} /> : <Volume2 size={11} />}
                      <span className="hidden sm:inline">{Math.round(bgmVolume * 100)}%</span>
                      <ChevronDown size={10} />
                    </button>

                    {inPlayerActivePopover === 'audio' && (
                      <div className="absolute bottom-full right-0 mb-2 w-48 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-3 space-y-2 z-30">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                          <span>Music Volume</span>
                          <span className="text-orange-400 font-mono">{Math.round(bgmVolume * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={bgmVolume}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            onChangeBgmVolume && onChangeBgmVolume(val);
                          }}
                          className="w-full accent-orange-500 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>

                  {/* Camera Motion Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      const nextPreset = cameraMotionPreset === 'ken-burns' ? 'static' : 'ken-burns';
                      onChangeCameraMotionPreset && onChangeCameraMotionPreset(nextPreset);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/10 hover:bg-white/20 text-slate-200 transition cursor-pointer"
                    title={`Camera Motion: ${cameraMotionPreset === 'ken-burns' ? 'Ken Burns' : 'Static'}`}
                  >
                    <Sliders size={11} />
                    <span className="hidden sm:inline">{cameraMotionPreset === 'ken-burns' ? 'Ken Burns' : 'Static'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Scene Filmstrip / Timeline */}
            {imageObjectUrls.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Film size={14} className="text-orange-600" />
                    <span className="font-bold text-slate-800">
                      Scene Timeline ({imageFiles.length} Photos)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => imageFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Photos</span>
                  </button>
                </div>

                <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                  {imageObjectUrls.map((url, idx) => {
                    const isCurrent = activePreviewIndex === idx;
                    const snippet = imagePhrases[idx] || '';
                    return (
                      <div
                        key={idx}
                        onClick={() => setActivePreviewIndex(idx)}
                        className={`group relative shrink-0 w-24 sm:w-28 aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          isCurrent
                            ? 'border-orange-500 ring-2 ring-orange-500/30 scale-102 shadow-md'
                            : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={url}
                          alt={`Scene ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                        
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/80 text-[9px] font-mono font-bold text-white">
                          #{idx + 1}
                        </span>

                        <div className="absolute top-1 right-1 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTriggerReplaceScene(idx);
                            }}
                            className="p-1 rounded bg-black/80 hover:bg-orange-600 text-white cursor-pointer"
                            title="Replace this photo"
                          >
                            <RefreshCw size={10} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSafeRemoveImage(idx);
                            }}
                            className="p-1 rounded bg-black/80 hover:bg-red-600 text-white cursor-pointer"
                            title="Delete scene"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>

                        {snippet && (
                          <p className="absolute bottom-1 left-1 right-1 text-[9px] font-bold text-white truncate px-1">
                            {snippet}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  {/* Add Card at the end */}
                  <div
                    onClick={() => imageFileInputRef.current?.click()}
                    className="shrink-0 w-20 sm:w-24 aspect-video rounded-xl border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50 hover:bg-orange-50/30 flex flex-col items-center justify-center text-slate-500 hover:text-orange-600 transition cursor-pointer"
                    title="Add more photos"
                  >
                    <Plus size={16} />
                    <span className="text-[10px] font-bold mt-0.5">Add</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* STUDIO SUBTITLE ENGINE: TIMESTAMPED CAPTIONS TRACK & TIMELINE SYNC */}
          <div className="rounded-[32px] border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
            
            {/* Header: Title, Segment Count & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-orange-600 shadow-xs">
                  <FileText size={18} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                      Studio Captions Track
                    </h3>
                    {captionTracks.length > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 text-[10px] font-black uppercase">
                        {captionTracks.length} Segments
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    Click line to jump video · Auto-syncs speech with live 16:9 preview
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2 shrink-0">
                {captionTracks.length > 0 ? (
                  <>
                    <button
                      type="button"
                      onClick={handleAddCaptionTrack}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition cursor-pointer shadow-xs"
                      title="Add a new subtitle track at current timestamp"
                    >
                      <Plus size={13} className="text-orange-600" />
                      <span>Add Line</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportSRT}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-xs font-bold text-white transition cursor-pointer shadow-xs"
                      title="Export as standard .SRT subtitle file"
                    >
                      <Download size={13} className="text-orange-400" />
                      <span>Export .SRT</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleLoadDemoCaptions}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-xs font-bold text-orange-700 transition cursor-pointer shadow-xs"
                    title="Load sample subtitle tracks to test live timeline sync"
                  >
                    <Sparkles size={13} className="text-orange-600" />
                    <span>Demo 10 Tracks</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsCaptionsListExpanded(!isCaptionsListExpanded)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition cursor-pointer"
                  title={isCaptionsListExpanded ? "Collapse" : "Expand"}
                >
                  {isCaptionsListExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>

            {isCaptionsListExpanded && (
              <div className="space-y-3 pt-1 animate-in fade-in duration-200">
                {/* Search Bar & Auto-Sync Toggle */}
                {captionTracks.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="relative flex-1">
                      <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        value={subtitlesSearchQuery}
                        onChange={(e) => setSubtitlesSearchQuery(e.target.value)}
                        placeholder={`Search across ${captionTracks.length} subtitles...`}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-orange-500 transition shadow-2xs"
                      />
                      {subtitlesSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setSubtitlesSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-0.5 cursor-pointer"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-600 hover:text-slate-900 font-medium">
                        <input
                          type="checkbox"
                          checked={isAutoScrollEnabled}
                          onChange={(e) => setIsAutoScrollEnabled(e.target.checked)}
                          className="w-3.5 h-3.5 accent-orange-500 rounded"
                        />
                        <span>Auto-scroll with speech</span>
                      </label>
                      {activeCaption && (
                        <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200 text-[10px]">
                          Active #{activeCaption.index}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Captions Scrollable List */}
                {captionTracks.length > 0 ? (
                  <div
                    ref={captionsListContainerRef}
                    className="max-h-72 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-300"
                  >
                    {filteredCaptionTracks.map((cap) => {
                      const isActive = activeCaption?.id === cap.id;
                      const isEditing = editingCaptionId === cap.id;

                      if (isEditing) {
                        return (
                          <div
                            key={cap.id}
                            className="rounded-2xl border-2 border-orange-500 bg-orange-50/40 p-3.5 shadow-md space-y-3 animate-in zoom-in-95 duration-100"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-orange-700">
                                Editing Segment #{cap.index}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleSaveEditCaption(cap.id)}
                                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs cursor-pointer transition"
                                >
                                  <Check size={12} />
                                  <span>Save</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingCaptionId(null)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer transition"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>

                            <textarea
                              value={captionEditForm.text}
                              onChange={(e) => setCaptionEditForm({ ...captionEditForm, text: e.target.value })}
                              rows={2}
                              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-orange-500 shadow-inner"
                              placeholder="Subtitle text..."
                            />

                            <div className="flex items-center gap-3 text-xs">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Start:</span>
                                <input
                                  type="number"
                                  step="0.1"
                                  value={captionEditForm.startTime}
                                  onChange={(e) => setCaptionEditForm({ ...captionEditForm, startTime: parseFloat(e.target.value) || 0 })}
                                  className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-mono font-bold text-slate-800"
                                />
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">End:</span>
                                <input
                                  type="number"
                                  step="0.1"
                                  value={captionEditForm.endTime}
                                  onChange={(e) => setCaptionEditForm({ ...captionEditForm, endTime: parseFloat(e.target.value) || 0 })}
                                  className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-mono font-bold text-slate-800"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={cap.id}
                          ref={isActive ? activeCaptionCardRef : null}
                          onClick={() => handleSeekCaption(cap.startTime)}
                          className={`group relative rounded-2xl border p-3 transition-all cursor-pointer select-none ${
                            isActive
                              ? 'border-2 border-orange-500 bg-orange-50/70 shadow-md ring-2 ring-orange-500/20 text-orange-950 font-bold scale-[1.005]'
                              : 'border-slate-200 bg-white hover:bg-slate-50/80 hover:border-slate-300 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                                  isActive
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                                }`}
                              >
                                #{cap.index}
                              </span>
                              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                                <Clock size={11} className={isActive ? 'text-orange-600' : 'text-slate-400'} />
                                <span>{formatTimestamp(cap.startTime)} → {formatTimestamp(cap.endTime)}</span>
                                <span className="text-[10px] text-slate-400">
                                  ({(cap.endTime - cap.startTime).toFixed(1)}s)
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartEditCaption(cap);
                                }}
                                className="p-1 rounded-md text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition cursor-pointer"
                                title="Edit this caption line"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCaption(cap.id);
                                }}
                                className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                title="Delete this caption line"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          <p className={`text-xs leading-relaxed ${isActive ? 'text-slate-900 font-bold' : 'text-slate-700 font-medium'}`}>
                            {cap.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center space-y-2">
                    <p className="text-xs font-bold text-slate-700">
                      No timestamped speech subtitles yet
                    </p>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                      Drop voiceover audio in Card 1 to automatically generate sentence-by-sentence captions, or click below to load demo tracks.
                    </p>
                    <button
                      type="button"
                      onClick={handleLoadDemoCaptions}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-300 bg-white hover:bg-orange-50 text-xs font-bold text-orange-600 transition cursor-pointer shadow-xs mt-1"
                    >
                      <Sparkles size={13} />
                      <span>Load 10 Demo Tracks</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PROJECT SUMMARY & PRIMARY RENDER ACTION CARD */}
          <div className="rounded-[32px] border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Render Export Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Video Format:</span>
                <span className="font-bold text-slate-900">16:9 Cinema Full HD (1920×1080)</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Voiceover Duration:</span>
                <span className="font-bold text-slate-900">{detectedAudioDuration} Seconds</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Scene Images:</span>
                <span className="font-bold text-slate-900">{imageFiles.length} Photos</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Active Caption Style:</span>
                <span className="font-bold text-orange-600">{currentCaptionObj.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Render Cost:</span>
                <span className="font-mono font-bold text-orange-600 text-sm">
                  1 Min = 1 Cr ({calculatedCredits} Credit{calculatedCredits > 1 ? 's' : ''})
                </span>
              </div>
            </div>

            {/* PRIMARY RENDER BUTTON */}
            <button
              type="button"
              onClick={() => onStartRender && onStartRender()}
              disabled={isRendering || !canRender}
              className={`w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-black text-sm transition-all duration-300 shadow-md cursor-pointer ${
                !canRender
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : isRendering
                  ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white opacity-80 cursor-wait animate-pulse'
                  : 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white shadow-lg shadow-orange-500/25 active:scale-98'
              }`}
            >
              {!selectedAudio ? (
                <>
                  <Lock size={16} />
                  <span>Upload Audio Narration to Enable Render</span>
                </>
              ) : imageFiles.length === 0 ? (
                <>
                  <Lock size={16} />
                  <span>Add Scene Photos to Enable Render</span>
                </>
              ) : isRendering ? (
                <>
                  <Film size={16} className="animate-spin" />
                  <span>Submitting Cloud Render...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Render 1080p Widescreen Video ({calculatedCredits} Cr)</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {!canRender && (
              <p className="text-[11px] text-slate-500 text-center font-medium">
                Add your audio narration and at least one image to unlock rendering
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
