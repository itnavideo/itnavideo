export type HomepageWorkflowCategory = 'shorts' | 'youtube' | 'audio';
export type HomepageWorkflowMediaKind = 'video' | 'image';

export interface HomepageWorkflow {
  id: string;
  name: string;
  shortName: string;
  category: HomepageWorkflowCategory;
  description: string;
  inputs: string;
  output: string;
  limit: string;
  dashboardHref: string;
  publicHref: string;
  mediaKind: HomepageWorkflowMediaKind;
  mediaSrc: string;
  posterSrc?: string;
  images?: readonly string[];
  popular?: boolean;
}

/**
 * Canonical public homepage registry for the ten active Itnavideo studios.
 * All homepage media is hosted on Cloudinary CDN for instant loading and 100% uptime.
 */
export const HOMEPAGE_WORKFLOWS: readonly HomepageWorkflow[] = [
  {
    id: 'auto-caption',
    name: 'Auto Caption Generator',
    shortName: 'Auto Caption',
    category: 'shorts',
    description: 'Add word-synced animated captions to vertical Reels, Shorts, and TikTok videos.',
    inputs: 'Vertical video with clear speech',
    output: '9:16 1080p Full HD captioned MP4',
    limit: 'Up to 3 minutes (180s)',
    dashboardHref: '/dashboard/auto-caption',
    publicHref: '/auto-caption-generator',
    mediaKind: 'image',
    mediaSrc: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1790376821/itnavideo-assets/homepage/autocaption.1.png',
    images: [
      'https://res.cloudinary.com/dhouh9idx/image/upload/v1790376821/itnavideo-assets/homepage/autocaption.1.png',
      'https://res.cloudinary.com/dhouh9idx/image/upload/v1790376823/itnavideo-assets/homepage/autocaption.2.png',
    ],
    popular: true,
  },
  {
    id: 'compare-explainer',
    name: 'Compare Explainer',
    shortName: 'Compare',
    category: 'shorts',
    description: 'Create a side-by-side comparison with two images, narration, captions, and winner emphasis.',
    inputs: 'Voiceover audio + exactly 2 images',
    output: '9:16 1080p Full HD comparison MP4',
    limit: 'Up to 3 minutes (180s)',
    dashboardHref: '/dashboard/compare-explainer',
    publicHref: '/video-types/compare-explainer',
    mediaKind: 'image',
    mediaSrc: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1790376825/itnavideo-assets/homepage/compareexplainer.1.png',
    images: [
      'https://res.cloudinary.com/dhouh9idx/image/upload/v1790376825/itnavideo-assets/homepage/compareexplainer.1.png',
      'https://res.cloudinary.com/dhouh9idx/image/upload/v1790376827/itnavideo-assets/homepage/compareexplainer.2.png',
    ],
  },
  {
    id: 'whiteboard-video',
    name: 'Whiteboard Video',
    shortName: 'Whiteboard',
    category: 'shorts',
    description: 'Turn spoken explanations into structured whiteboard scenes synchronized to the narration.',
    inputs: 'Voiceover audio or video with speech',
    output: '9:16 1080p Full HD whiteboard MP4',
    limit: 'Up to 3 minutes (180s)',
    dashboardHref: '/dashboard/whiteboard-video',
    publicHref: '/video-types/whiteboard-video',
    mediaKind: 'image',
    mediaSrc: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1790376840/itnavideo-assets/homepage/whiteboard.1.png',
    images: ['https://res.cloudinary.com/dhouh9idx/image/upload/v1790376840/itnavideo-assets/homepage/whiteboard.1.png'],
  },
  {
    id: 'typography-video',
    name: 'Kinetic Motion',
    shortName: 'Kinetic Motion',
    category: 'shorts',
    description: 'Transform speech into dynamic, animated kinetic text — 11 motion presets synced to your voice.',
    inputs: 'Talking video or voiceover audio',
    output: '9:16 1080p Full HD kinetic motion MP4',
    limit: 'Up to 3 minutes (180s)',
    dashboardHref: '/dashboard/typography-video',
    publicHref: '/video-types/typography-video',
    mediaKind: 'image',
    mediaSrc: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1790376838/itnavideo-assets/homepage/typography.1.png',
    images: ['https://res.cloudinary.com/dhouh9idx/image/upload/v1790376838/itnavideo-assets/homepage/typography.1.png'],
  },
  {
    id: 'long-video-promo',
    name: 'Long Video Promo',
    shortName: 'Video Promo',
    category: 'shorts',
    description: 'Promote a widescreen YouTube video with its thumbnail, title, creator handle, and CTA layout.',
    inputs: 'Video clip + thumbnail image',
    output: '9:16 1080p Full HD promo MP4',
    limit: 'Up to 3 minutes (180s)',
    dashboardHref: '/dashboard/long-video-promo',
    publicHref: '/video-types/long-video-promo',
    mediaKind: 'image',
    mediaSrc: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1790376834/itnavideo-assets/homepage/longvideopromo.1.png',
    images: ['https://res.cloudinary.com/dhouh9idx/image/upload/v1790376834/itnavideo-assets/homepage/longvideopromo.1.png'],
  },
  {
    id: 'youtube-subtitles',
    name: 'YouTube Subtitle Generator',
    shortName: 'YouTube Subtitles',
    category: 'youtube',
    description: 'Burn clean professional subtitles into widescreen podcasts, tutorials, interviews, and lectures.',
    inputs: '16:9 video with speech',
    output: '16:9 1080p Full HD subtitled MP4',
    limit: 'Up to 12 minutes (720s)',
    dashboardHref: '/dashboard/youtube-subtitles',
    publicHref: '/youtube-subtitle-generator',
    mediaKind: 'image',
    mediaSrc: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1790376842/itnavideo-assets/homepage/youtubesubtitlesgenerator.1.png',
    images: ['https://res.cloudinary.com/dhouh9idx/image/upload/v1790376842/itnavideo-assets/homepage/youtubesubtitlesgenerator.1.png'],
  },
  {
    id: 'long-video-clips',
    name: 'Long Video Clips',
    shortName: 'Viral Clips',
    category: 'youtube',
    description: 'Find strong moments in a long-form video or podcast and turn them into viral captioned clips.',
    inputs: '16:9 long-form video or podcast',
    output: '9:16 1080p Full HD viral clips MP4',
    limit: 'Input up to 3 Hours • 30s–60s Clips',
    dashboardHref: '/dashboard/long-video-clips',
    publicHref: '/video-types/long-video-clips',
    mediaKind: 'image',
    mediaSrc: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1790376836/itnavideo-assets/homepage/longvideotoviralclips.1.png',
    images: ['https://res.cloudinary.com/dhouh9idx/image/upload/v1790376836/itnavideo-assets/homepage/longvideotoviralclips.1.png'],
    popular: true,
  },
  {
    id: 'image-to-video',
    name: 'Image to Video AI',
    shortName: 'Image to Video',
    category: 'youtube',
    description: 'Synchronize narration with your uploaded photos or curated visuals using cinematic camera motion.',
    inputs: 'Voiceover or AI voice + images',
    output: '16:9 1080p Full HD cinematic MP4',
    limit: 'Up to 12 minutes (720s)',
    dashboardHref: '/dashboard/image-to-video',
    publicHref: '/tools/image-to-video-ai',
    mediaKind: 'image',
    mediaSrc: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1790376831/itnavideo-assets/homepage/imagetovideo.1.png',
    images: ['https://res.cloudinary.com/dhouh9idx/image/upload/v1790376831/itnavideo-assets/homepage/imagetovideo.1.png'],
    popular: true,
  },
  {
    id: 'faceless-video',
    name: 'Faceless Video',
    shortName: 'Faceless Video',
    category: 'youtube',
    description: 'Build a widescreen YouTube video from narration with planned scenes, motion, captions, and music.',
    inputs: 'Voiceover audio or supported script flow',
    output: '16:9 1080p Full HD YouTube MP4',
    limit: 'Up to 12 minutes (720s)',
    dashboardHref: '/dashboard/faceless-video',
    publicHref: '/video-types/faceless-video',
    mediaKind: 'image',
    mediaSrc: '/assets/workflows/faceless.png',
    images: ['/assets/workflows/faceless.png'],
    popular: true,
  },
  {
    id: 'audio-cleaner',
    name: 'AI Audio Cleaner',
    shortName: 'Audio Cleaner',
    category: 'audio',
    description: 'Review the transcript, detect retakes and filler words, then export clean studio-ready audio.',
    inputs: 'Audio or video recording',
    output: 'Studio mastered 48kHz audio (MP3)',
    limit: 'Up to 12 minutes (single) / 3h (chunked)',
    dashboardHref: '/dashboard/audio-cleaner',
    publicHref: '/tools/ai-audio-cleaner',
    mediaKind: 'image',
    mediaSrc: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1790376819/itnavideo-assets/homepage/audiocleaner.1.png',
    images: ['https://res.cloudinary.com/dhouh9idx/image/upload/v1790376819/itnavideo-assets/homepage/audiocleaner.1.png'],
  },
  {
    id: 'book-summary',
    name: 'Book Summary Video',
    shortName: 'Book Summary',
    category: 'youtube',
    description: 'Turn any book narration audio into a 16:9 lesson-card video with AI-generated storyboard.',
    inputs: 'Narration audio + optional book cover image',
    output: '16:9 1080p Full HD Book Summary MP4',
    limit: 'Up to 12 minutes (720s)',
    dashboardHref: '/dashboard/book-summary',
    publicHref: '/dashboard/book-summary',
    mediaKind: 'image',
    mediaSrc: '/assets/workflows/book-summary.png',
    images: ['/assets/workflows/book-summary.png'],
  },
] as const;

export const HOMEPAGE_WORKFLOW_COUNT = HOMEPAGE_WORKFLOWS.length;

export const HOMEPAGE_WORKFLOW_GROUPS: readonly {
  id: HomepageWorkflowCategory;
  label: string;
  description: string;
}[] = [
  {
    id: 'shorts',
    label: '9:16 (Reels/Shorts/Tiktok)',
    description: 'Five focused workflows for vertical social reels, captions, and explainers.',
  },
  {
    id: 'youtube',
    label: 'YouTube & Widescreen',
    description: 'Four workflows for long-form video, viral clips, widescreen subtitles, and faceless videos.',
  },
  {
    id: 'audio',
    label: 'Audio',
    description: 'One studio for transcript review, retake removal, and audio mastering.',
  },
] as const;
