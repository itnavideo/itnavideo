export type SeoLandingPage = {
  slug: string;
  keyword: string;
  title: string;
  description: string;
  hero: string;
  proof: string;
  audience: string[];
  useCases: string[];
  workflow: string[];
  faqs: Array<{question: string; answer: string}>;
};

const defaultWorkflow = [
  'Choose one focused Itnavideo video type for the job.',
  'Upload the required video, audio, image, or thumbnail assets.',
  'Itnavideo transcribes speech or prepares the video-type-specific render plan.',
  'Preview where supported, then render a 9:16 MP4 for Reels, Shorts, and TikTok.',
];

const defaultFaqs = (keyword: string) => [
  {
    question: `What is the best way to use a ${keyword}?`,
    answer: 'Start with clear source content, choose the video type that matches the output you want, preview where supported, then create the final short video.',
  },
  {
    question: 'Can I use my own video, audio, and images?',
    answer: 'Yes. Itnavideo is built around user uploads, including creator videos, voiceovers, comparison images, thumbnails, and background images.',
  },
  {
    question: 'Is this made for YouTube Shorts and Instagram Reels?',
    answer: 'Yes. Current video types focus on 9:16 short-form videos for Reels, Shorts, TikTok, and similar mobile platforms.',
  },
];

const page = (
  slug: string,
  keyword: string,
  title: string,
  description: string,
  hero: string,
  proof: string,
  audience: string[],
  useCases: string[],
): SeoLandingPage => ({
  slug,
  keyword,
  title,
  description,
  hero,
  proof,
  audience,
  useCases,
  workflow: defaultWorkflow,
  faqs: defaultFaqs(keyword),
});

export const seoLandingPages: SeoLandingPage[] = [
  page(
    'ai-reel-generator',
    'AI reel generator',
    'AI Reel Generator for Short-Form Creators',
    'Create 9:16 reels from uploaded video, audio, and images using focused Itnavideo video types.',
    'Turn real creator content into a polished short video without manual timeline editing.',
    'Focused production video types: captions, creator edits, comparisons, whiteboard explainers, promos, and background replacement.',
    ['Creators', 'educators', 'YouTubers', 'coaches', 'small teams'],
    ['Auto captions', 'creator reels', 'comparison explainers', 'whiteboard explainers', 'long-video promos'],
  ),
  page(
    'auto-caption-video-generator',
    'auto caption video generator',
    'Auto Caption Video Generator',
    'Upload a speaking video and render word-timed captions with style, color, font, size, and position controls.',
    'Add professional captions to existing reels without changing the original video.',
    'Designed for English and Roman Hinglish captions with clean preset styles.',
    ['Social creators', 'educators', 'podcast clippers', 'brands'],
    ['Captioned reels', 'muted viewing', 'Hinglish captions', 'short video accessibility'],
  ),
  page(
    'dynamic-creator-reel-maker',
    'dynamic creator reel maker',
    'Dynamic Creator Reel Maker',
    'Turn a talking-head video into a typography-led short reel using the creator video as the main visual.',
    'Make creator videos feel edited with transcript-based key phrase overlays.',
    'No stock visuals, no random b-roll, just creator video and typography.',
    ['Founders', 'coaches', 'personal brands', 'educators'],
    ['Talking-head clips', 'creator advice', 'short social edits', 'founder content'],
  ),
  page(
    'compare-explainer-video-maker',
    'compare explainer video maker',
    'Compare Explainer Video Maker',
    'Create left-vs-right comparison reels from one voiceover and two images.',
    'Explain two options with captions and a sticker presenter that points to the correct side.',
    'Useful for product, SaaS, finance, and educational comparisons.',
    ['Educators', 'reviewers', 'SaaS creators', 'finance pages'],
    ['Product comparisons', 'tool comparisons', 'plan comparisons', 'concept comparisons'],
  ),
  page(
    'whiteboard-video-maker',
    'whiteboard video maker',
    'Whiteboard Video Maker from Voiceover',
    'Create whiteboard-style explainer reels from audio or video speech.',
    'Turn lessons and voice notes into clean educational short videos.',
    'Gemini-assisted planning creates simple drawn explainer scenes.',
    ['Teachers', 'course creators', 'students', 'trainers'],
    ['Lessons', 'study videos', 'topic breakdowns', 'training clips'],
  ),
  page(
    'long-video-promo-maker',
    'long video promo maker',
    'Long Video Promo Maker',
    'Create a short teaser reel using a promo clip, thumbnail, and title.',
    'Promote a long YouTube video, podcast, lecture, or music release with a vertical teaser.',
    'Designed for creators who already have a short promo clip and a thumbnail.',
    ['YouTubers', 'podcasters', 'educators', 'musicians'],
    ['YouTube promos', 'podcast teasers', 'course promos', 'lecture promos'],
  ),
  page(
    'video-background-image-replace',
    'replace video background with image',
    'Replace Video Background with Image',
    'Upload a creator video and a background image, adjust placement, then export a short background-replaced video.',
    'Make creator videos look cleaner without shooting in a studio.',
    'Built for short videos to keep compute cost controlled.',
    ['Creators', 'founders', 'coaches', 'educators'],
    ['Branded backgrounds', 'clean creator reels', 'campaign visuals', 'studio-style shorts'],
  ),
];

export function getSeoLandingPage(slug: string) {
  return seoLandingPages.find((item) => item.slug === slug);
}
