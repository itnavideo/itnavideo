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
  'Upload audio or video with clear speech.',
  'Itnavideo transcribes the speech and builds timed subtitle chunks.',
  'The planner creates 10 content-matched scenes for the Explainer Video template.',
  'The renderer exports a vertical MP4 for Reels, Shorts, and mobile sharing.',
];

const defaultFaqs = (keyword: string) => [
  {
    question: `What is the best way to use a ${keyword}?`,
    answer: 'Start with a short source video or voiceover, keep the speech clear, and let Itnavideo create a polished vertical explainer with subtitles and matching scene visuals.',
  },
  {
    question: 'Can I use my own video or audio?',
    answer: 'Yes. Itnavideo is built around real uploaded audio or video so the final reel follows your actual transcript instead of generic demo text.',
  },
  {
    question: 'Is this made for YouTube Shorts and Instagram Reels?',
    answer: 'Yes. The current template is a 9:16 Video Explainer layout with top video, middle subtitles, and bottom scene visuals.',
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
    'ai-explainer-video-generator',
    'AI explainer video generator',
    'AI Explainer Video Generator for Reels and Shorts',
    'Create polished explainer videos from uploaded audio or video with transcript-timed subtitles, scene visuals, and a vertical MP4 export.',
    'Turn a real talking video or voiceover into a clean explainer reel without designing every frame yourself.',
    'Best for creators who want one focused template: top video, premium subtitles, and content-matched images.',
    ['Educators', 'finance creators', 'career pages', 'founders', 'news explainers'],
    ['Topic explainers', 'course clips', 'finance updates', 'career advice', 'product education'],
  ),
  page(
    'ai-reel-generator',
    'AI reel generator',
    'AI Reel Generator for Short-Form Creators',
    'Generate vertical reels from speech, subtitles, and matched scene visuals using Itnavideo’s focused Explainer Video workflow.',
    'Create a reel from your own source instead of starting with a blank editor.',
    'Itnavideo keeps the actual speaker visible while adding subtitles and supporting visuals below.',
    ['Instagram creators', 'YouTube creators', 'coaches', 'small businesses', 'agencies'],
    ['Educational reels', 'talking-head clips', 'faceless explainers', 'brand tips', 'how-to reels'],
  ),
  page(
    'ai-shorts-generator',
    'AI Shorts generator',
    'AI Shorts Generator for YouTube and Social Video',
    'Turn voiceovers and videos into short vertical explainers with subtitles, music, sound effects, and scene images.',
    'Make Shorts that explain one idea clearly in under a minute.',
    'The template is optimized for fast mobile viewing and clear speech-first storytelling.',
    ['YouTube Shorts creators', 'educators', 'tutorial makers', 'business creators'],
    ['Short lessons', 'quick updates', 'creator tips', 'news summaries', 'micro tutorials'],
  ),
  page(
    'youtube-shorts-generator',
    'YouTube Shorts generator',
    'YouTube Shorts Generator for Explainer Videos',
    'Create YouTube Shorts from uploaded audio or video with readable subtitles and matched visual scenes.',
    'Convert one spoken idea into a vertical Short that is easier to watch and understand.',
    'Designed for creators who want to publish consistent Shorts without manual timeline editing.',
    ['YouTubers', 'educators', 'podcast clippers', 'course creators', 'founders'],
    ['Explainer Shorts', 'lesson highlights', 'video summaries', 'creator clips', 'topic breakdowns'],
  ),
  page(
    'instagram-reels-maker',
    'Instagram Reels maker',
    'Instagram Reels Maker with AI Subtitles and Visuals',
    'Make Instagram Reels from real speech with a polished layout, subtitles, background music, and visual scene support.',
    'Keep the creator video visible and add a premium explainer layer below it.',
    'Built for reels where clarity matters more than random effects.',
    ['Instagram educators', 'coaches', 'personal brands', 'finance pages', 'marketing teams'],
    ['Advice reels', 'story reels', 'explainers', 'personal brand clips', 'launch posts'],
  ),
  page(
    'script-to-video',
    'script to video',
    'Script to Video AI for Explainer Reels',
    'Use Itnavideo to turn spoken scripts and voiceovers into vertical explainer videos with subtitles and scenes.',
    'Move from a script or recorded voice to a finished reel faster.',
    'The workflow follows your words, timing, and message instead of using generic filler visuals.',
    ['Script writers', 'faceless creators', 'educators', 'marketers', 'agencies'],
    ['Tutorial scripts', 'sales scripts', 'lesson scripts', 'motivation scripts', 'brand explainers'],
  ),
  page(
    'voice-to-video-ai',
    'voice to video AI',
    'Voice to Video AI for Reels and Shorts',
    'Upload a voiceover and create a vertical video with timed subtitles, scene visuals, music, and sound effects.',
    'Your voice becomes the timeline, subtitles, and visual direction for the final video.',
    'Ideal when you have audio ready but do not want to edit every scene manually.',
    ['Voiceover creators', 'coaches', 'educators', 'faceless channels', 'small teams'],
    ['Voice notes', 'AI voiceovers', 'podcast clips', 'course audio', 'narrated explainers'],
  ),
  page(
    'video-to-reel-maker',
    'video to reel maker',
    'Video to Reel Maker for Explainer Clips',
    'Convert a source video into a polished vertical reel with the original video on top, subtitles in the middle, and images below.',
    'Use one uploaded video to create a clearer, more structured reel.',
    'Great for talking-head clips where the facecam should stay visible while the story gets visual support.',
    ['Talking-head creators', 'teachers', 'founders', 'consultants', 'course creators'],
    ['Long video clips', 'webinar snippets', 'lesson excerpts', 'interview answers', 'creator advice'],
  ),
  page(
    'ai-subtitle-generator',
    'AI subtitle generator',
    'AI Subtitle Generator for Reels and Shorts',
    'Create timed subtitles from real speech and render them inside a polished short-form video template.',
    'Make subtitles readable, premium, and synced to the spoken content.',
    'Itnavideo combines subtitles with video and scene visuals, not just plain caption text.',
    ['Creators', 'educators', 'social media teams', 'YouTubers', 'agencies'],
    ['Talking videos', 'educational clips', 'business tips', 'voiceover reels', 'short explainers'],
  ),
  page(
    'faceless-video-generator',
    'faceless video generator',
    'Faceless Video Generator for Voiceover Explainers',
    'Create faceless explainer reels from audio using timed subtitles, scene images, background music, and SFX.',
    'Turn a voiceover into a visual reel even when you do not want to appear on camera.',
    'Best for education, motivational, finance, and informational creators.',
    ['Faceless channels', 'educators', 'motivation pages', 'finance pages', 'automation creators'],
    ['Narrated facts', 'list videos', 'mini lessons', 'motivational reels', 'topic explainers'],
  ),
  page(
    'ai-video-generator-for-education',
    'AI video generator for education',
    'AI Video Generator for Education and Lessons',
    'Create educational reels from lectures, voiceovers, or short teaching videos with subtitles and topic-matched visuals.',
    'Make lessons easier to watch on mobile without rebuilding the full edit manually.',
    'Useful for turning clear speech into structured micro-learning videos.',
    ['Teachers', 'online educators', 'course creators', 'student pages', 'coaching institutes'],
    ['Lesson clips', 'exam explainers', 'course promos', 'study tips', 'concept breakdowns'],
  ),
  page(
    'ai-video-generator-for-business',
    'AI video generator for business',
    'AI Video Generator for Business Explainers',
    'Create business explainer reels for products, updates, training, and founder-led content.',
    'Turn business ideas into clear short videos for social media and internal sharing.',
    'The layout keeps the message clean, direct, and professional.',
    ['Founders', 'startups', 'consultants', 'sales teams', 'marketing teams'],
    ['Product explainers', 'feature updates', 'training clips', 'founder videos', 'customer education'],
  ),
  page(
    'ai-video-generator-for-coaches',
    'AI video generator for coaches',
    'AI Video Generator for Coaches and Personal Brands',
    'Create coaching reels from advice, lessons, and voiceovers with subtitles and visual support.',
    'Make your message feel structured and premium without spending hours editing.',
    'Built for advice-led content where clarity and trust matter.',
    ['Coaches', 'consultants', 'mentors', 'trainers', 'personal brands'],
    ['Mindset reels', 'career advice', 'relationship advice', 'business coaching', 'life lessons'],
  ),
  page(
    'ai-video-generator-for-youtube-creators',
    'AI video generator for YouTube creators',
    'AI Video Generator for YouTube Creators',
    'Repurpose voiceovers and clips into YouTube Shorts with subtitles, visuals, and a vertical explainer layout.',
    'Convert ideas from your channel into short videos for discovery.',
    'Good for creators who want more Shorts without editing a new timeline every time.',
    ['YouTubers', 'podcasters', 'educators', 'commentary creators', 'tutorial channels'],
    ['Shorts from videos', 'podcast moments', 'lesson clips', 'channel promos', 'topic summaries'],
  ),
  page(
    'ai-video-generator-for-instagram-creators',
    'AI video generator for Instagram creators',
    'AI Video Generator for Instagram Creators',
    'Make Instagram-ready reels from speech with polished subtitles and matching bottom-layer visuals.',
    'Create cleaner reels for personal brands, pages, and social media workflows.',
    'The format is made for mobile-first attention and fast comprehension.',
    ['Instagram creators', 'social media managers', 'coaches', 'educators', 'brand pages'],
    ['Explainer reels', 'advice clips', 'educational posts', 'brand stories', 'thought leadership'],
  ),
  page(
    'ai-video-generator-india',
    'AI video generator India',
    'AI Video Generator for Indian Creators',
    'Create reels and Shorts for Indian creators with English transcript planning, vertical exports, and simple first-video pricing.',
    'A practical AI video workflow for creators, educators, and businesses in India.',
    'Start with one short video and export a polished 1080p reel.',
    ['Indian creators', 'students', 'educators', 'founders', 'small businesses'],
    ['Education reels', 'finance explainers', 'career clips', 'business updates', 'creator content'],
  ),
];

export function getSeoLandingPage(slug: string) {
  return seoLandingPages.find((item) => item.slug === slug);
}
