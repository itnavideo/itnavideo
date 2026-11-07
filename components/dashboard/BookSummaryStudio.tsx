'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  { label: '📚 Wealth & Compounding', value: 'wealth' },
  { label: '⚡ Habits & Productivity', value: 'habits' },
  { label: '🧠 Mindset & Psychology', value: 'psychology' },
  { label: '🚀 Business & Leadership', value: 'business' },
  { label: '🎯 Philosophy & Focus', value: 'philosophy' },
];

// Master AWS S3 Media Library Background Music Tracks
const AWS_BGM_TRACKS = [
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

// 20 Master YouTube 16:9 Caption Styles
const TWENTY_CAPTION_STYLES = [
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

export const BookSummaryStudio: React.FC<BookSummaryStudioProps> = ({
  onStartRender,
  renderStatus,
  onResetRender,
  onRetryRender,
  onCancelRender,
}) => {
  // Step 1: Upload & Info State (Strictly 16:9 Cinema Landscape, max 5 min / 300s)
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [audioS3Key, setAudioS3Key] = useState<string>('');
  const [audioFileName, setAudioFileName] = useState<string>('');
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string>('');
  const [bookTitle, setBookTitle] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('wealth');

  // Background Music State (Default Volume = 12%)
  const [selectedBgmTrack, setSelectedBgmTrack] = useState<string>(AWS_BGM_TRACKS[0].path);
  const [customBgmUrl, setCustomBgmUrl] = useState<string>('');
  const [customBgmName, setCustomBgmName] = useState<string>('');
  const [bgmVolume, setBgmVolume] = useState<number>(12); // Default 12%
  const [isUploadingBgm, setIsUploadingBgm] = useState(false);
  const [playingBgmPreview, setPlayingBgmPreview] = useState<string | null>(null);

  // Caption Theme State (20 Options)
  const [selectedCaptionTheme, setSelectedCaptionTheme] = useState<string>('glow-viral');
  const [captionSearchFilter, setCaptionSearchFilter] = useState<string>('all');

  // Images & Visuals
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
  const [editableTranscript, setEditableTranscript] = useState<string>('');
  const [transcriptSavedFeedback, setTranscriptSavedFeedback] = useState(false);
  const [showTranscriptEditor, setShowTranscriptEditor] = useState(false);
  const [planWords, setPlanWords] = useState<unknown[]>([]);
  const [planTimestampSegments, setPlanTimestampSegments] = useState<unknown[]>([]);
  const [durationSeconds, setDurationSeconds] = useState<number>(60);

  // Compulsory Preview & Sync Player States
  const [previewReviewed, setPreviewReviewed] = useState(false);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [isPreviewAudioPlaying, setIsPreviewAudioPlaying] = useState(false);
  const [previewAudioCurrentTime, setPreviewAudioCurrentTime] = useState(0);

  // Metadata copy states
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedChapters, setCopiedChapters] = useState(false);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const bgmInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const authorInputRef = useRef<HTMLInputElement>(null);
  const refImagesInputRef = useRef<HTMLInputElement>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgmPreviewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Rule 4.1 Credit Calculation: 1 Min = 1 Credit (1m=1, 2m=2, 3m=3, 4m=4, 5m=5 Cr)
  const effectiveDuration = audioDuration > 0 ? audioDuration : (durationSeconds || 60);
  const calculatedCredits = Math.max(1, Math.min(5, Math.ceil(effectiveDuration / 60)));

  // S3 & Cloudinary Upload Helpers
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

  // Handle Custom Background Music Upload
  const handleBgmUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      setInputError('Please upload a valid background music audio file (MP3, WAV, AAC, M4A).');
      return;
    }

    setInputError(null);
    setIsUploadingBgm(true);
    setCustomBgmName(file.name);

    try {
      const { readUrl } = await uploadAudioToS3(file);
      setCustomBgmUrl(readUrl);
      setSelectedBgmTrack(readUrl);
    } catch (err: any) {
      setInputError(err?.message || 'Failed to upload custom background music.');
      setCustomBgmUrl('');
      setCustomBgmName('');
    } finally {
      setIsUploadingBgm(false);
      if (e.target) e.target.value = '';
    }
  };

  // Handle Audio Selection & Instant Duration Detection
  const handleAudioSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/') && !file.type.includes('mp4')) {
      setInputError('Please upload a valid audio file (MP3, WAV, M4A, AAC) or MP4.');
      return;
    }

    setInputError(null);
    setIsUploadingAudio(true);
    setAudioFileName(file.name);

    const localUrl = URL.createObjectURL(file);
    setAudioPreviewUrl(localUrl);

    try {
      const audioEl = new Audio(localUrl);
      audioEl.onloadedmetadata = () => {
        if (audioEl.duration && Number.isFinite(audioEl.duration)) {
          const detected = Math.round(audioEl.duration);
          if (detected > 300) {
            setInputError('Narration audio exceeds the 5-minute (300s) maximum limit for Book Summary videos.');
            return;
          }
          setAudioDuration(detected);
          setDurationSeconds(detected);
        }
      };

      const { key, readUrl } = await uploadAudioToS3(file);
      setAudioS3Key(key);
      setAudioUrl(readUrl);
    } catch (err: any) {
      setInputError(err?.message || 'Failed to upload audio. Please try again.');
      setAudioUrl('');
      setAudioPreviewUrl('');
    } finally {
      setIsUploadingAudio(false);
      if (e.target) e.target.value = '';
    }
  };

  // Book Cover Upload
  const handleCoverSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInputError(null);
    setIsUploadingCover(true);
    try {
      const url = await uploadImageToCloudinary(file, 'itnavideo12345/book-covers');
      setBookCoverUrl(url);
    } catch (err: any) {
      setInputError(err?.message || 'Failed to upload book cover.');
    } finally {
      setIsUploadingCover(false);
      if (e.target) e.target.value = '';
    }
  };

  // Author Portrait Upload
  const handleAuthorSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInputError(null);
    setIsUploadingAuthor(true);
    try {
      const url = await uploadImageToCloudinary(file, 'itnavideo12345/authors');
      setAuthorPortraitUrl(url);
    } catch (err: any) {
      setInputError(err?.message || 'Failed to upload author portrait.');
    } finally {
      setIsUploadingAuthor(false);
      if (e.target) e.target.value = '';
    }
  };

  // Reference Images Upload (up to 20 images)
  const handleRefImagesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const remainingSlots = 20 - referenceImages.length;
    if (remainingSlots <= 0) {
      setInputError('Maximum 20 reference images allowed.');
      return;
    }
    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setInputError(null);
    setIsUploadingRef(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of filesToUpload) {
        const url = await uploadImageToCloudinary(file, 'itnavideo12345/book-references');
        uploadedUrls.push(url);
      }
      setReferenceImages(prev => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      setInputError(err?.message || 'Failed to upload reference images.');
    } finally {
      setIsUploadingRef(false);
      if (e.target) e.target.value = '';
    }
  };

  // Step 1 -> Step 2: Run Storyboard Analysis API
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
      setTranscript(data.transcript || '');
      setEditableTranscript(data.transcript || '');
      setPlanWords(Array.isArray(data.words) ? data.words : []);
      setPlanTimestampSegments(Array.isArray(data.timestampSegments) ? data.timestampSegments : []);
      setPreviewReviewed(false);
      setActivePreviewIndex(0);
      if (data.durationSeconds) {
        setDurationSeconds(data.durationSeconds);
        if (!audioDuration) setAudioDuration(Math.round(data.durationSeconds));
      }
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      setStudioStep('storyboard');
    } catch (err: any) {
      setInputError(err?.message || 'Error creating AI Storyboard plan. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Storyboard editing helpers
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

  const handleUpdateSceneType = (sceneId: string, newType: BookSummarySceneType) => {
    if (!plan) return;
    setPlan({
      ...plan,
      scenes: plan.scenes.map(s => s.id === sceneId ? { ...s, type: newType } : s),
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
      subtitle: bookTitle ? `Key Insight • ${bookTitle}` : 'Core Concept',
    };
    setPlan({
      ...plan,
      scenes: [...plan.scenes, newScene].sort((a, b) => a.startSeconds - b.startSeconds),
    });
  };

  // Editorial Transcript Editor Save Handler
  const handleSaveEditedTranscript = () => {
    setTranscript(editableTranscript);
    setTranscriptSavedFeedback(true);
    setTimeout(() => setTranscriptSavedFeedback(false), 2500);
  };

  // Preview Music Track Preview Player
  const togglePlayBgmTrack = (trackPath: string) => {
    if (trackPath === 'none') {
      if (bgmPreviewAudioRef.current) bgmPreviewAudioRef.current.pause();
      setPlayingBgmPreview(null);
      return;
    }
    if (playingBgmPreview === trackPath) {
      if (bgmPreviewAudioRef.current) bgmPreviewAudioRef.current.pause();
      setPlayingBgmPreview(null);
    } else {
      if (bgmPreviewAudioRef.current) {
        bgmPreviewAudioRef.current.pause();
        bgmPreviewAudioRef.current.src = trackPath.startsWith('http') ? trackPath : `/${trackPath.replace(/^\/+/, '')}`;
        bgmPreviewAudioRef.current.volume = Math.max(0.05, bgmVolume / 100);
        bgmPreviewAudioRef.current.play().then(() => {
          setPlayingBgmPreview(trackPath);
        }).catch(() => setPlayingBgmPreview(null));
      }
    }
  };

  // Live Audio Narration Sync in Preview
  const togglePreviewAudio = () => {
    if (!previewAudioRef.current) return;
    if (isPreviewAudioPlaying) {
      previewAudioRef.current.pause();
      setIsPreviewAudioPlaying(false);
    } else {
      previewAudioRef.current.play().then(() => {
        setIsPreviewAudioPlaying(true);
      }).catch(err => {
        console.warn('Playback error:', err);
      });
    }
  };

  const activeScenes = plan ? plan.scenes.filter(s => !s.disabled) : [];
  const currentPreviewScene = activeScenes[activePreviewIndex] || activeScenes[0];

  // Sync active preview scene with audio playback time
  useEffect(() => {
    const audio = previewAudioRef.current;
    if (!audio || !plan) return;

    const onTimeUpdate = () => {
      const curTime = audio.currentTime;
      setPreviewAudioCurrentTime(curTime);
      const matchingIdx = activeScenes.findIndex(
        s => curTime >= s.startSeconds && curTime <= s.endSeconds
      );
      if (matchingIdx !== -1 && matchingIdx !== activePreviewIndex) {
        setActivePreviewIndex(matchingIdx);
      }
    };

    const onEnded = () => {
      setIsPreviewAudioPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [plan, activeScenes, activePreviewIndex]);

  // Step 2 -> Step 3: Trigger Final Video Render Job (Guarded by Compulsory Preview)
  const handleStartFinalRender = () => {
    if (!previewReviewed) {
      setInputError('Compulsory Preview: Please review and click "Approve & Confirm Preview" before starting the render.');
      if (typeof window !== 'undefined') window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    if (!plan || !onStartRender || isSubmittingRender) return;

    // Pause audio previews if playing
    if (previewAudioRef.current && isPreviewAudioPlaying) {
      previewAudioRef.current.pause();
      setIsPreviewAudioPlaying(false);
    }
    if (bgmPreviewAudioRef.current && playingBgmPreview) {
      bgmPreviewAudioRef.current.pause();
      setPlayingBgmPreview(null);
    }

    setIsSubmittingRender(true);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    setStudioStep('rendering');

    // Final BGM Selection (Custom Upload || Selected AWS Track)
    const finalBgmUrl = customBgmUrl || selectedBgmTrack;

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
      captionsTheme: selectedCaptionTheme,
      bgmUrl: finalBgmUrl === 'none' ? 'none' : finalBgmUrl,
      bgmVolume: finalBgmUrl === 'none' ? 0 : bgmVolume / 100, // Normalized (e.g. 12% -> 0.12)
      aspectRatio: '16:9',
      transcript: editableTranscript || transcript,
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

  // Reset Studio Handler
  const handleStartOver = () => {
    if (confirm('Start a new book summary? This will clear current inputs.')) {
      setAudioUrl('');
      setAudioS3Key('');
      setAudioFileName('');
      setAudioDuration(0);
      setAudioPreviewUrl('');
      setBookTitle('');
      setAuthorName('');
      setBookCoverUrl('');
      setAuthorPortraitUrl('');
      setReferenceImages([]);
      setCustomBgmUrl('');
      setCustomBgmName('');
      setPlan(null);
      setStudioStep('inputs');
      setPreviewReviewed(false);
      setInputError(null);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filter 20 Caption Styles
  const filteredCaptionStyles = TWENTY_CAPTION_STYLES.filter(s => {
    if (captionSearchFilter === 'all') return true;
    return s.category.toLowerCase() === captionSearchFilter.toLowerCase();
  });

  // Render Active Cloud Render View
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
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#0066FF]/10 border border-[#0066FF]/30 p-2.5 text-[#0066FF]">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">YouTube &amp; Social Publishing Metadata</h3>
                  <p className="text-xs text-slate-500">Auto-generated metadata, chapters, and key takeaways for 16:9 upload</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Suggested YouTube Title */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0066FF]">Suggested Title</span>
                  <button
                    onClick={() => copyToClipboard(plan.metadata.suggestedTitle, setCopiedTitle)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
                  >
                    {copiedTitle ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span>{copiedTitle ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-base font-bold text-slate-900">{plan.metadata.suggestedTitle}</p>
              </div>

              {/* 2. YouTube Description */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0066FF]">Description</span>
                  <button
                    onClick={() => copyToClipboard(plan.metadata.description, setCopiedDesc)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
                  >
                    {copiedDesc ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span>{copiedDesc ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{plan.metadata.description}</p>
              </div>

              {/* 3. Chapter Timestamps */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-3 md:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0066FF]">Chapter Timestamps</span>
                  <button
                    onClick={() => {
                      const text = plan.metadata.chapters.map(c => `${c.timestamp} - ${c.title}`).join('\n');
                      copyToClipboard(text, setCopiedChapters);
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
                  >
                    {copiedChapters ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span>{copiedChapters ? 'Copied All' : 'Copy Chapters'}</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {plan.metadata.chapters.map((chap, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                      <span className="font-mono text-xs font-bold text-[#0066FF] bg-[#0066FF]/10 px-2 py-1 rounded-md border border-[#0066FF]/20">
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
    <div className="relative rounded-[28px] border border-slate-200/90 bg-white p-5 sm:p-8 shadow-xl shadow-slate-200/40 min-w-0 max-w-full overflow-x-hidden space-y-8 text-slate-900">
      {/* Magic UI BorderBeam Glowing Effect */}
      <BorderBeam size={320} duration={14} colorFrom="#0066FF" colorTo="#2563EB" />

      {/* Hidden BGM preview player */}
      <audio ref={bgmPreviewAudioRef} onEnded={() => setPlayingBgmPreview(null)} />

      {/* Studio Stage Stepper Banner (Clean Light Surface) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/90 p-4 sm:p-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 rounded-2xl bg-gradient-to-r from-[#0066FF] via-[#2563EB] to-[#2563EB] p-2.5 text-white shadow-md shadow-[#0066FF]/20">
            <BookOpen size={22} className="stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 truncate">Book Summary Studio</h2>
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#0066FF]">
                16:9 Widescreen
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 leading-tight mt-0.5">
              1080p Full HD • 20 Caption Styles • BGM Audio Studio • {calculatedCredits} Credit{calculatedCredits > 1 ? 's' : ''} (1 Min = 1 Cr)
            </p>
          </div>
        </div>

        {/* Step Indicator Navigation Pills */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          {audioUrl && (
            <button
              type="button"
              onClick={handleStartOver}
              className="mr-2 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              title="Reset and start over"
            >
              <RotateCcw size={12} />
              <span className="hidden sm:inline">Start Over</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setStudioStep('inputs')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
              studioStep === 'inputs'
                ? 'bg-gradient-to-r from-[#0066FF] to-[#2563EB] text-white font-black shadow-md shadow-[#0066FF]/20'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            1. Media &amp; Setup
          </button>
          <span className="text-slate-300">/</span>
          <button
            type="button"
            disabled={!plan}
            onClick={() => plan && setStudioStep('storyboard')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
              studioStep === 'storyboard'
                ? 'bg-gradient-to-r from-[#0066FF] to-[#2563EB] text-white font-black shadow-md shadow-[#0066FF]/20'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            2. Storyboard &amp; Preview
          </button>
        </div>
      </div>

      {/* Process Workflow Roadmap (Full Width Standalone Block) */}
      <StudioWorkflowRoadmap mode="bookSummary" />

      {/* Input Error Callout */}
      {inputError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-center justify-between gap-3 text-red-800 text-sm font-bold shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="flex-shrink-0 text-red-500" />
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

      {/* STAGE 1: MEDIA & BOOK INFO INPUTS */}
      {studioStep === 'inputs' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 Columns: Media Uploads (Audio + Book Cover + Author/Visuals) */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Spoken Audio Narration */}
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-7 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-xl bg-blue-500/10 p-2 text-[#0066FF] border border-blue-500/20">
                      <Mic size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-black uppercase tracking-wider text-slate-900">Audio Narration</span>
                      <p className="text-[11px] text-slate-500">Spoken book summary or chapter overview (Up to 5 min)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!audioUrl && (
                      <button
                        type="button"
                        onClick={handleLoadSampleDemo}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-[11px] font-bold text-[#0066FF] hover:bg-blue-100 transition cursor-pointer shadow-xs"
                        title="Load ready-made demo narration for testing"
                      >
                        <Sparkles size={12} />
                        <span>Try Sample Demo</span>
                      </button>
                    )}
                    <span className="text-[11px] font-extrabold uppercase bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full">
                      Required
                    </span>
                  </div>
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
                    className="w-full h-44 border-2 border-dashed border-slate-200 hover:border-[#0066FF]/60 rounded-2xl bg-slate-50/70 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-slate-900 cursor-pointer group"
                  >
                    <div className="rounded-full bg-white p-3 group-hover:scale-110 shadow-xs group-hover:bg-blue-50 transition-transform">
                      <UploadCloud size={32} className="text-[#0066FF]" />
                    </div>
                    <div className="text-center px-4">
                      <p className="text-sm font-bold text-slate-800">
                        {isUploadingAudio ? 'Uploading Narration Audio...' : 'Click to Upload Narration Audio'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">MP3, WAV, M4A, or MP4 audio • Max 5 Minutes (300s)</p>
                      <span className="inline-block mt-2 font-mono text-[11px] text-[#0066FF] bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 font-bold">
                        1 Min = 1 Credit
                      </span>
                    </div>
                  </button>
                ) : (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600 shrink-0">
                          <CheckCircle2 size={22} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-900 truncate">{audioFileName || 'Narration Audio'}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-xs font-bold text-emerald-700">
                              {formatTime(audioDuration || durationSeconds)} / 05:00 Max
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs font-bold text-amber-700">
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
                          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
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
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer border border-red-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Integrated Playable Audio Waveform Preview */}
                    {audioPreviewUrl && (
                      <div className="pt-2 border-t border-emerald-200/60 flex items-center gap-3">
                        <Volume2 size={16} className="text-emerald-600 shrink-0" />
                        <audio
                          controls
                          src={audioPreviewUrl}
                          className="w-full h-8 accent-[#FF5722]"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Visual Assets (Book Cover 3D Mockup + Author Portrait + Reference B-Roll) */}
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-7 space-y-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-xl bg-blue-500/10 p-2 text-[#0066FF] border border-blue-500/20">
                      <ImagePlus size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-black uppercase tracking-wider text-slate-900">Visual Assets</span>
                      <p className="text-[11px] text-slate-500">Book cover art, author portrait, and thematic visuals</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold uppercase bg-blue-50 border border-blue-200 text-[#0066FF] px-3 py-1 rounded-full">
                    At Least 1 Image Required
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Book Cover with 3D Preview */}
                  <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverSelect} className="hidden" />
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">Book Cover (Front Art)</label>
                      <span className="text-[10px] text-[#0066FF] font-semibold">Recommended</span>
                    </div>

                    {!bookCoverUrl ? (
                      <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        disabled={isUploadingCover}
                        className="w-full h-36 border border-slate-200 hover:border-[#0066FF]/50 rounded-2xl bg-slate-50/70 hover:bg-blue-50/20 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-slate-900 transition cursor-pointer group"
                      >
                        <div className="rounded-xl bg-white p-2.5 group-hover:scale-105 transition-transform shadow-xs">
                          <BookOpen size={22} className="text-[#0066FF]" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          {isUploadingCover ? 'Uploading Cover...' : 'Upload Book Cover'}
                        </span>
                        <span className="text-[10px] text-slate-400">Creates 3D book intro card</span>
                      </button>
                    ) : (
                      <div className="relative rounded-2xl border border-slate-200 bg-slate-50/70 p-3 flex items-center gap-4 group">
                        {/* 3D Book Cover Mockup Miniature */}
                        <div className="relative w-16 h-22 rounded-r-md shadow-md overflow-hidden shrink-0 border border-slate-200">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-r from-black/40 to-transparent z-10" />
                          <img src={bookCoverUrl} alt="Cover" className="w-full h-full object-cover" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">Book Cover Uploaded</p>
                          <p className="text-[10px] text-emerald-600 font-semibold">3D Intro &amp; Outro Ready</p>
                          <button
                            type="button"
                            onClick={() => coverInputRef.current?.click()}
                            className="mt-1 text-[11px] text-[#0066FF] hover:underline font-bold cursor-pointer"
                          >
                            Change Cover
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setBookCoverUrl('')}
                          className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 transition cursor-pointer border border-slate-200"
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
                      <label className="text-xs font-bold text-slate-700">Author Portrait (Optional)</label>
                      <span className="text-[10px] text-slate-400 font-semibold">Optional</span>
                    </div>

                    {!authorPortraitUrl ? (
                      <button
                        type="button"
                        onClick={() => authorInputRef.current?.click()}
                        disabled={isUploadingAuthor}
                        className="w-full h-36 border border-slate-200 hover:border-[#0066FF]/50 rounded-2xl bg-slate-50/70 hover:bg-blue-50/20 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-slate-900 transition cursor-pointer group"
                      >
                        <div className="rounded-full bg-white p-2.5 group-hover:scale-105 transition-transform shadow-xs">
                          <User size={22} className="text-[#0066FF]" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          {isUploadingAuthor ? 'Uploading Portrait...' : 'Upload Author Photo'}
                        </span>
                        <span className="text-[10px] text-slate-400">Shows on quote cards</span>
                      </button>
                    ) : (
                      <div className="relative rounded-2xl border border-slate-200 bg-slate-50/70 p-3 flex items-center gap-4 group">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-400 shrink-0 shadow-sm">
                          <img src={authorPortraitUrl} alt="Author" className="w-full h-full object-cover" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">Author Portrait Uploaded</p>
                          <p className="text-[10px] text-emerald-600 font-semibold">Quote Cards Styled</p>
                          <button
                            type="button"
                            onClick={() => authorInputRef.current?.click()}
                            className="mt-1 text-[11px] text-[#0066FF] hover:underline font-bold cursor-pointer"
                          >
                            Change Photo
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setAuthorPortraitUrl('')}
                          className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 transition cursor-pointer border border-slate-200"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reference Images / Thematic Visuals (Up to 20 images) */}
                <input ref={refImagesInputRef} type="file" accept="image/*" multiple onChange={handleRefImagesSelect} className="hidden" />
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-slate-800">Thematic Reference Images ({referenceImages.length}/20)</label>
                      <p className="text-[11px] text-slate-500">Diagrams, charts, or custom chapter visuals</p>
                    </div>
                    <button
                      type="button"
                      disabled={referenceImages.length >= 20 || isUploadingRef}
                      onClick={() => refImagesInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 text-xs font-bold text-[#0066FF] hover:bg-blue-100 disabled:opacity-40 transition cursor-pointer"
                    >
                      <Plus size={13} />
                      <span>{isUploadingRef ? 'Uploading...' : 'Add Images'}</span>
                    </button>
                  </div>

                  {referenceImages.length > 0 && (
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                      {referenceImages.map((url, idx) => (
                        <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 group shadow-xs">
                          <img src={url} alt={`Ref ${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setReferenceImages(referenceImages.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 p-1 rounded-md bg-black/70 text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-600 cursor-pointer"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Audio & Background Music (BGM) Studio (AWS Tracks + Custom Upload + Volume Slider) */}
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-7 space-y-6 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-xl bg-blue-500/10 p-2 text-[#0066FF] border border-blue-500/20">
                      <Music size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-black uppercase tracking-wider text-slate-900">Background Music (AWS S3 &amp; Custom Upload)</span>
                      <p className="text-[11px] text-slate-500">Pick from 13+ production tracks or upload your own MP3</p>
                    </div>
                  </div>

                  {/* Volume Pill Display */}
                  <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
                    <Volume2 size={14} className="text-[#0066FF]" />
                    <span className="text-xs font-black text-slate-800">BGM Volume: {bgmVolume}%</span>
                  </div>
                </div>

                {/* Interactive Volume Slider (Default: 12%) */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Sliders size={13} className="text-[#0066FF]" />
                      <span>Background Music Volume (Default: 12%)</span>
                    </span>
                    <span className="font-mono text-xs font-black text-[#0066FF] bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {bgmVolume}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={bgmVolume}
                    onChange={e => setBgmVolume(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#FF5722]"
                  />

                  {/* Quick Volume Presets */}
                  <div className="flex items-center gap-2 pt-1">
                    {[
                      { label: 'Mute (0%)', val: 0 },
                      { label: 'Subtle (12% - Recommended)', val: 12 },
                      { label: 'Moderate (20%)', val: 20 },
                      { label: 'Prominent (35%)', val: 35 },
                    ].map(p => (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => setBgmVolume(p.val)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-md border transition cursor-pointer ${
                          bgmVolume === p.val
                            ? 'bg-[#FF5722] text-white border-[#0066FF]'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom User Background Music Upload Box */}
                <input
                  ref={bgmInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleBgmUpload}
                  className="hidden"
                />

                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0066FF] shrink-0">
                      <Upload size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 truncate">
                        {customBgmName ? `Uploaded: ${customBgmName}` : 'Upload Your Own Custom Background Track'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {customBgmUrl ? 'Custom music active for video render' : 'Upload custom MP3, WAV or royalty-free audio'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {customBgmUrl ? (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomBgmUrl('');
                          setCustomBgmName('');
                          setSelectedBgmTrack(AWS_BGM_TRACKS[0].path);
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition cursor-pointer"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isUploadingBgm}
                        onClick={() => bgmInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition cursor-pointer shadow-xs"
                      >
                        <Upload size={12} />
                        <span>{isUploadingBgm ? 'Uploading...' : 'Upload BGM Audio'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* AWS S3 Preset Music Tracks (13+ Curated Library Tracks) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Or Pick from AWS S3 Production Music Library ({AWS_BGM_TRACKS.length} Tracks)</span>
                    <span className="text-[10px] text-slate-400">All royalty-free for YouTube monetization</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                    {AWS_BGM_TRACKS.map(track => {
                      const isSelected = !customBgmUrl && selectedBgmTrack === track.path;
                      const isPlaying = playingBgmPreview === track.path;

                      return (
                        <div
                          key={track.id}
                          onClick={() => {
                            setCustomBgmUrl('');
                            setSelectedBgmTrack(track.path);
                          }}
                          className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between gap-2.5 ${
                            isSelected
                              ? 'border-[#0066FF] bg-blue-50/70 text-slate-900 shadow-xs ring-1 ring-orange-500'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black truncate">{track.label}</span>
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                                {track.category}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 truncate block mt-0.5">{track.desc}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {track.path !== 'none' && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePlayBgmTrack(track.path);
                                }}
                                title="Listen to Preview"
                                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer shadow-xs"
                              >
                                {isPlaying ? <Pause size={12} className="text-[#0066FF]" /> : <Play size={12} className="text-slate-600" />}
                              </button>
                            )}

                            {isSelected && (
                              <CheckCircle2 size={16} className="text-[#0066FF]" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 4. 20 YouTube Subtitle & Caption Themes Selector */}
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-7 space-y-5 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-xl bg-blue-500/10 p-2 text-[#0066FF] border border-blue-500/20">
                      <Type size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-black uppercase tracking-wider text-slate-900">20 YouTube Subtitle &amp; Caption Styles</span>
                      <p className="text-[11px] text-slate-500">Pick from 20 cinematic styles with kinetic word highlights</p>
                    </div>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                    {['all', 'viral', 'cinema', 'modern', 'editorial', 'book'].map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCaptionSearchFilter(cat)}
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border transition cursor-pointer ${
                          captionSearchFilter === cat
                            ? 'bg-[#FF5722] text-white border-[#0066FF]'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 20 Caption Cards Gallery */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                  {filteredCaptionStyles.map(theme => {
                    const isSelected = selectedCaptionTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setSelectedCaptionTheme(theme.id)}
                        className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#0066FF] bg-blue-50/70 text-slate-900 shadow-xs ring-1 ring-orange-500'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full shadow-xs" style={{ backgroundColor: theme.color }} />
                            <span className="text-xs font-black text-slate-900">{theme.name}</span>
                          </div>
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                            {theme.badge}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1.5">{theme.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Book Details, Topic Category & Generate CTA */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-7 space-y-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-xl bg-blue-500/10 p-2 text-[#0066FF] border border-blue-500/20">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-black uppercase tracking-wider text-slate-900">Book Information</span>
                      <p className="text-[11px] text-slate-500">Powers title cards &amp; YouTube metadata</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold uppercase bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1 rounded-full">
                    Optional
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Book Title</label>
                    <input
                      type="text"
                      value={bookTitle}
                      onChange={e => setBookTitle(e.target.value)}
                      placeholder="e.g. Atomic Habits, Psychology of Money"
                      className="w-full mt-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] focus:outline-none transition shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Author Name</label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={e => setAuthorName(e.target.value)}
                      placeholder="e.g. James Clear, Morgan Housel"
                      className="w-full mt-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] focus:outline-none transition shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Tag size={13} className="text-[#0066FF]" />
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
                              ? 'border-[#0066FF] bg-blue-50 text-[#0066FF] shadow-xs'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>Output Aspect Ratio:</span>
                  <span className="font-black text-slate-900 flex items-center gap-1">
                    <Sparkles size={12} className="text-[#0066FF]" />
                    16:9 Landscape Widescreen
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>Selected Subtitle Style:</span>
                  <span className="font-bold text-slate-900">
                    {TWENTY_CAPTION_STYLES.find(c => c.id === selectedCaptionTheme)?.name || 'Flame Glow'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>Audio BGM Track &amp; Volume:</span>
                  <span className="font-bold text-slate-900">
                    {customBgmUrl ? 'Custom Upload' : (AWS_BGM_TRACKS.find(b => b.path === selectedBgmTrack)?.label || 'None')} ({bgmVolume}%)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 pt-2 border-t border-slate-200">
                  <span>Estimated Credit Cost:</span>
                  <span className="font-mono text-sm font-black text-[#0066FF]">
                    {calculatedCredits} Credit{calculatedCredits > 1 ? 's' : ''} (1 Min = 1 Cr)
                  </span>
                </div>
              </div>

              {/* Main Call to Action: Build AI Storyboard */}
              <button
                type="button"
                onClick={handleAnalyzeAndBuildStoryboard}
                disabled={isAnalyzing || !audioUrl}
                className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#0066FF] via-[#2563EB] to-[#2563EB] px-6 py-4 text-base font-black text-white shadow-xl shadow-[#0066FF]/20 transition hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles size={20} className="animate-spin text-white" />
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

      {/* STAGE 2: STORYBOARD REVIEW & COMPULSORY VISUAL PREVIEW & EDITORIAL TRANSCRIPT */}
      {studioStep === 'storyboard' && plan && (
        <div className="space-y-6">

          {/* Top Bar with Active Scene Count & Add Takeaway */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <span>AI Storyboard &amp; Scene Timeline</span>
                <span className="text-xs font-extrabold bg-blue-100 border border-blue-200 text-[#0066FF] px-2.5 py-0.5 rounded-full">
                  {activeScenes.length} Active Scenes
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect preview cards, fix typos in transcript, or customize scene types before rendering
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowTranscriptEditor(!showTranscriptEditor)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                  showTranscriptEditor
                    ? 'border-[#0066FF] bg-blue-50 text-[#0066FF]'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 shadow-xs'
                }`}
              >
                <Edit3 size={14} />
                <span>{showTranscriptEditor ? 'Hide Transcript Editor' : 'Edit Spoken Transcript'}</span>
              </button>

              <button
                type="button"
                onClick={handleAddKeyIdeaScene}
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-[#0066FF] hover:bg-blue-100 transition cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Key Takeaway Card</span>
              </button>
            </div>
          </div>

          {/* EDITORIAL TRANSCRIPT MARKDOWN EDITOR (Fix Spelling Mistakes & Typos) */}
          {showTranscriptEditor && (
            <div className="rounded-[28px] border-2 border-blue-200 bg-white p-6 space-y-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 text-[#0066FF] border border-blue-200">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-wider text-slate-900">
                      Editorial Transcript Editor (Correct Spelling &amp; Jargon)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Fix any misheard author names, technical book jargon, or typos before generating burnt-in subtitles
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveEditedTranscript}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition cursor-pointer shadow-xs"
                >
                  {transcriptSavedFeedback ? (
                    <>
                      <CheckCheck size={14} />
                      <span>Changes Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span>Save &amp; Update Subtitles</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                value={editableTranscript}
                onChange={e => setEditableTranscript(e.target.value)}
                rows={6}
                placeholder="Spoken narration transcript..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm font-medium text-slate-900 leading-relaxed focus:bg-white focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] focus:outline-none transition shadow-inner font-mono"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{editableTranscript.trim().split(/\s+/).filter(Boolean).length} Words</span>
                <span>Clicking &ldquo;Save &amp; Update Subtitles&rdquo; updates the narration transcript for render.</span>
              </div>
            </div>
          )}

          {/* COMPULSORY INTERACTIVE 16:9 VISUAL PREVIEW PLAYER WITH AUDIO SYNC */}
          <div className="rounded-[28px] border-2 border-blue-200 bg-white p-6 sm:p-7 space-y-5 shadow-lg shadow-[#0066FF]/10">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-[#0066FF] border border-blue-500/20">
                  <Eye size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-slate-900">
                    Live 16:9 Visual Preview (Compulsory Review)
                  </h4>
                  <p className="text-xs text-slate-500">
                    High-contrast typography, 3D cards, and synced audio narration preview
                  </p>
                </div>
              </div>

              {/* Status indicator badge */}
              <div className="flex items-center gap-2">
                {audioPreviewUrl && (
                  <button
                    type="button"
                    onClick={togglePreviewAudio}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    {isPreviewAudioPlaying ? (
                      <>
                        <Pause size={13} className="text-[#0066FF]" />
                        <span>Pause Audio Sync</span>
                      </>
                    ) : (
                      <>
                        <Play size={13} className="text-[#0066FF]" />
                        <span>Play Audio Sync</span>
                      </>
                    )}
                  </button>
                )}

                {previewReviewed ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    Preview Confirmed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-black animate-pulse">
                    <AlertCircle size={14} className="text-amber-600" />
                    Preview Required
                  </span>
                )}
              </div>
            </div>

            {/* Hidden audio element for preview sync */}
            {audioPreviewUrl && (
              <audio ref={previewAudioRef} src={audioPreviewUrl} preload="auto" />
            )}

            {/* 16:9 Canvas Mockup */}
            <div className="aspect-video w-full rounded-2xl border border-slate-200 bg-[#FAFAFA] relative overflow-hidden flex flex-col items-center justify-center p-8 sm:p-12 text-center shadow-inner">
              {/* Dot Grid Pattern */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.08) 1.5px, transparent 1.5px)`,
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Soft Ambient Glows */}
              <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

              {/* Scene Content inside Canvas */}
              {currentPreviewScene ? (
                <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center justify-center space-y-4">
                  {/* Category Pill */}
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-blue-100 text-[#0066FF] border border-blue-200">
                    {currentPreviewScene.type === 'BOOK_COVER' ? '3D BOOK COVER INTRO' :
                     currentPreviewScene.type === 'LESSON_TITLE' ? 'CHAPTER TITLE' :
                     currentPreviewScene.type === 'KEY_IDEA' ? 'CORE TAKEAWAY' :
                     currentPreviewScene.type === 'QUOTE' ? 'MEMORABLE QUOTE' :
                     currentPreviewScene.type === 'COMPARISON' ? 'MINDSET COMPARISON' :
                     currentPreviewScene.type === 'KEY_STEPS' ? '3-STEP ACTION ROADMAP' :
                     currentPreviewScene.type === 'STAT_INSIGHT' ? 'NUMERICAL PRINCIPLE' :
                     currentPreviewScene.type === 'CONCLUSION' ? 'FINAL SUMMARY' : 'SCENE PREVIEW'}
                  </span>

                  {/* Scene Graphic Simulation */}
                  {currentPreviewScene.type === 'BOOK_COVER' && (
                    <div className="flex items-center gap-6 my-2">
                      {bookCoverUrl ? (
                        <div className="w-20 h-28 rounded-r-md shadow-xl overflow-hidden border border-slate-300 transform -rotate-3 transition hover:rotate-0">
                          <img src={bookCoverUrl} alt="Cover" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-20 h-28 rounded-r-md bg-gradient-to-br from-[#0066FF] to-amber-600 flex items-center justify-center text-white font-black text-xs p-2 shadow-xl">
                          {bookTitle || 'Book'}
                        </div>
                      )}
                      <div className="text-left">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                          {currentPreviewScene.text || bookTitle || 'Book Summary'}
                        </h2>
                        <p className="text-sm font-semibold text-slate-600 mt-1">
                          By {authorName || 'Author'}
                        </p>
                      </div>
                    </div>
                  )}

                  {currentPreviewScene.type !== 'BOOK_COVER' && (
                    <>
                      <h2 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight">
                        &ldquo;{currentPreviewScene.text || 'Key Principle'}&rdquo;
                      </h2>
                      {currentPreviewScene.subtitle && (
                        <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-lg">
                          {currentPreviewScene.subtitle}
                        </p>
                      )}
                    </>
                  )}

                  <div className="pt-2 text-[11px] font-mono font-bold text-slate-500">
                    Timestamp: {formatTime(currentPreviewScene.startSeconds)} - {formatTime(currentPreviewScene.endSeconds)}
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-sm">No scenes available</p>
              )}
            </div>

            {/* Scene Selector Scrubber Tabs & Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActivePreviewIndex(prev => Math.max(0, prev - 1))}
                  disabled={activePreviewIndex === 0}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 cursor-pointer shadow-xs"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-bold text-slate-700">
                  Scene {activePreviewIndex + 1} of {activeScenes.length}
                </span>
                <button
                  type="button"
                  onClick={() => setActivePreviewIndex(prev => Math.min(activeScenes.length - 1, prev + 1))}
                  disabled={activePreviewIndex >= activeScenes.length - 1}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 cursor-pointer shadow-xs"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Compulsory Approval Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  setPreviewReviewed(true);
                  setInputError(null);
                }}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                  previewReviewed
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-gradient-to-r from-[#0066FF] via-[#2563EB] to-[#2563EB] text-white shadow-md shadow-[#0066FF]/25/20 hover:brightness-110 active:scale-95'
                }`}
              >
                {previewReviewed ? (
                  <>
                    <ShieldCheck size={16} />
                    <span>✓ Preview Confirmed (Ready to Render)</span>
                  </>
                ) : (
                  <>
                    <Eye size={16} />
                    <span>Approve &amp; Confirm Preview (Required)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Storyboard List */}
          <div className="space-y-3.5">
            {plan.scenes.map((scene, idx) => (
              <div
                key={scene.id || idx}
                className={`rounded-2xl border p-5 transition-all ${
                  scene.disabled
                    ? 'border-slate-200 bg-slate-100/60 opacity-50'
                    : 'border-slate-200 bg-white hover:border-[#0066FF]/50 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Scene Time & Type Badge */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-black text-[#0066FF] bg-[#0066FF]/10 px-2.5 py-1 rounded-lg border border-[#0066FF]/20">
                      {formatTime(scene.startSeconds)} - {formatTime(scene.endSeconds)}
                    </span>

                    {/* Scene Type Selector Dropdown */}
                    <select
                      value={scene.type}
                      onChange={e => handleUpdateSceneType(scene.id, e.target.value as BookSummarySceneType)}
                      className="text-[10px] font-black uppercase px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 cursor-pointer focus:outline-none focus:border-[#0066FF]"
                    >
                      <option value="LESSON_TITLE">Chapter Title</option>
                      <option value="KEY_IDEA">Core Takeaway</option>
                      <option value="QUOTE">Quote Card</option>
                      <option value="BOOK_COVER">Book Cover Intro</option>
                      <option value="COMPARISON">Mindset Comparison</option>
                      <option value="KEY_STEPS">3-Step Roadmap</option>
                      <option value="STAT_INSIGHT">Numeric Principle</option>
                      <option value="CONCLUSION">Final Summary</option>
                    </select>

                    {scene.subtitle && (
                      <span className="text-xs text-slate-500 font-medium truncate max-w-xs">
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
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                    >
                      {scene.disabled ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteScene(scene.id)}
                      title="Delete Scene"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Editable Text Area */}
                {scene.type !== 'CAPTIONS' && (
                  <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Primary Headline
                      </label>
                      <input
                        type="text"
                        value={scene.text || ''}
                        onChange={e => handleUpdateSceneText(scene.id, e.target.value)}
                        placeholder="Scene Headline..."
                        className="w-full mt-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-900 focus:border-[#0066FF] focus:outline-none shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Subtitle / Chapter Label
                      </label>
                      <input
                        type="text"
                        value={scene.subtitle || ''}
                        onChange={e => handleUpdateSceneSubtitle(scene.id, e.target.value)}
                        placeholder="e.g. Core Principle #1..."
                        className="w-full mt-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 focus:border-[#0066FF] focus:outline-none shadow-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Bar (Guarded by Compulsory Preview) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                setStudioStep('inputs');
              }}
              className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-100 px-6 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            >
              ← Back to Media Setup
            </button>

            <button
              type="button"
              onClick={handleStartFinalRender}
              disabled={isSubmittingRender || !previewReviewed}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl px-8 py-4 text-base font-black transition-all duration-200 ${
                !previewReviewed
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                  : isSubmittingRender
                  ? "bg-gradient-to-r from-[#0066FF] via-[#2563EB] to-[#2563EB] text-white opacity-80 cursor-wait animate-pulse shadow-xl"
                  : "bg-gradient-to-r from-[#0066FF] via-[#2563EB] to-[#2563EB] text-white shadow-xl shadow-[#0066FF]/30 hover:brightness-110 active:scale-95 cursor-pointer"
              }`}
            >
              {!previewReviewed ? (
                <>
                  <Lock size={18} className="text-slate-400" />
                  <span>Preview Required to Unlock Render</span>
                </>
              ) : (
                <>
                  <Film size={18} className="stroke-[2.5]" />
                  <span>
                    {isSubmittingRender
                      ? "Submitting Cloud Render..."
                      : `Render 1080p Widescreen Video (${calculatedCredits} Credit${calculatedCredits > 1 ? 's' : ''})`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sticky Action Bar */}
      {studioStep === 'inputs' && audioUrl && (
        <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase text-[#0066FF] tracking-wider truncate">
              {bookTitle || 'Book Summary'}
            </p>
            <p className="text-[10px] text-slate-500 font-bold">
              {calculatedCredits} Credit{calculatedCredits > 1 ? 's' : ''} • 16:9
            </p>
          </div>
          <button
            type="button"
            onClick={handleAnalyzeAndBuildStoryboard}
            disabled={isAnalyzing}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0066FF] via-[#2563EB] to-[#2563EB] px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-[#0066FF]/20 active:scale-95 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Sparkles size={14} className="animate-spin text-white" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>Build Storyboard</span>
                <ArrowRight size={14} className="stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      )}

      {studioStep === 'storyboard' && plan && (
        <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
              setStudioStep('inputs');
            }}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 px-2 py-1"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleStartFinalRender}
            disabled={isSubmittingRender || !previewReviewed}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-black shadow-lg transition ${
              !previewReviewed
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#0066FF] via-[#2563EB] to-[#2563EB] text-white shadow-[#0066FF]/20 active:scale-95"
            }`}
          >
            {!previewReviewed ? (
              <span>Preview First</span>
            ) : (
              <>
                <Film size={14} className="stroke-[2.5]" />
                <span>{isSubmittingRender ? 'Submitting...' : `Render (${calculatedCredits} Cr)`}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
