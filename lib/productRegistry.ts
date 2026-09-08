export interface ProductFeature {
  name: string;
  whatItIs: string;
  whyItSavesTime: string;
  dashboardUrl: string;
  landingUrl: string;
  category?: string;
  ctaHeadline?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  keyBenefits?: string[];
  previewImage?: string;
  problemItSolves?: string;
  whyUseItnavideo?: string;
  demoVideo?: {
    title?: string;
    description?: string;
    samplePromptOrScript?: string;
    outputSpecs?: string;
    videoUrl?: string;
  };
  relatedLinks?: Array<{ href: string; label: string; description?: string }>;
}

export const PRODUCT_REGISTRY: Record<string, ProductFeature> = {
  'auto-caption': {
    name: 'Auto Caption Generator',
    whatItIs: 'AI-powered motion typography caption generator that transcribes speech with word-level timing precision.',
    whyItSavesTime: 'Automatically animates captions in 10 modern motion design styles in seconds.',
    dashboardUrl: '/dashboard?mode=autoCaption',
    landingUrl: '/features/auto-caption',
    category: 'Captions & Subtitles',
    ctaHeadline: 'Make Your Videos 10x More Engaging With Motion Captions',
    ctaDescription: 'Generate animated, word-synced subtitles in seconds.',
    ctaButtonText: 'Try Auto Caption Generator →',
    keyBenefits: ['Word-level precision', '10 kinetic motion styles', '1-click render'],
    previewImage: 'auto-caption.jpg',
  },
};
