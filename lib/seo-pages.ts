export type SeoLandingPage = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  primaryKeyword: string;
  audience: string;
  useCases: string[];
  benefits: string[];
  faqs: { question: string; answer: string }[];
};

const page = (item: SeoLandingPage) => item;

export const seoLandingPages: SeoLandingPage[] = [
  page({
    slug: "ai-reel-generator",
    title: "AI Reel Generator for Reels and Shorts | Itnavideo",
    description: "Create polished 9:16 reels from your video, audio, or images using focused AI video types for captions, explainers, promos, and creator edits.",
    h1: "AI reel generator for creators who need polished short videos",
    eyebrow: "AI reel generator",
    primaryKeyword: "AI reel generator",
    audience: "creators, educators, YouTubers, coaches, and small teams",
    useCases: [
      "Turn talking-head videos into dynamic creator reels",
      "Add clean auto captions to existing reels",
      "Create comparison explainers from audio and two images",
      "Promote long-form videos with short vertical promos"
    ],
    benefits: [
      "Focused production video types instead of a crowded library",
      "English and Roman Hinglish captions from real speech",
      "Preview-first flow for supported video types before final render",
      "1080x1920 MP4 output ready for Reels, Shorts, and TikTok"
    ],
    faqs: [
      { question: "What can I create with Itnavideo?", answer: "You can create short vertical videos using focused video types such as Dynamic Creator Reel, Auto Caption Reel, Compare Explainer, Auto Draw Explainer, Long Video Promo, and Creator Background Replace." },
      { question: "Does Itnavideo use my real uploaded content?", answer: "Yes. The product is built around the user's uploaded video, audio, images, and transcript so the final reel follows the actual content." },
      { question: "How long can videos be?", answer: "The current product is focused on short reels and shorts, with video type flows designed around videos up to about 60 seconds." }
    ]
  }),
  page({
    slug: "instagram-reels-maker",
    title: "Instagram Reels Maker with AI Captions | Itnavideo",
    description: "Make Instagram-ready reels from creator videos, voiceovers, thumbnails, and images with AI captions and focused short-form video types.",
    h1: "Instagram Reels maker with AI captions and creator video types",
    eyebrow: "Instagram Reels",
    primaryKeyword: "Instagram Reels maker",
    audience: "Instagram creators, personal brands, educators, and social media teams",
    useCases: [
      "Add styled captions to talking reels",
      "Create dynamic typography edits from creator videos",
      "Make comparison reels for products, tools, or concepts",
      "Turn a long-video promo clip into a short reel"
    ],
    benefits: [
      "Mobile-first 9:16 output",
      "Caption styles designed for social viewing",
      "No manual timeline editing required",
      "Downloadable MP4 that can be posted anywhere"
    ],
    faqs: [
      { question: "Can I post the output directly on Instagram?", answer: "Yes. Itnavideo exports a vertical MP4 that works for Instagram Reels and other short-video platforms." },
      { question: "Can I choose caption style and color?", answer: "Yes. Auto Caption lets users choose style, font, size, position, text color, highlight color, and background color." },
      { question: "Does it support Hinglish captions?", answer: "Yes. Itnavideo supports English and Roman Hinglish captions through Groq Whisper transcription." }
    ]
  }),
  page({
    slug: "youtube-shorts-generator",
    title: "YouTube Shorts Generator for Creators | Itnavideo",
    description: "Create YouTube Shorts from creator videos, voiceovers, and promo clips with AI captions, typography, and focused video type layouts.",
    h1: "YouTube Shorts generator for creator videos and promos",
    eyebrow: "YouTube Shorts",
    primaryKeyword: "YouTube Shorts generator",
    audience: "YouTubers, educators, podcasters, and long-form creators",
    useCases: [
      "Promote a long YouTube video with a short vertical teaser",
      "Turn a talking video into a typography-led Short",
      "Add burned-in captions to existing clips",
      "Create whiteboard-style Shorts from voiceovers"
    ],
    benefits: [
      "Built for 9:16 mobile viewing",
      "Long Video Promo video type for thumbnail-led teasers",
      "Auto captions are burned into the MP4",
      "Finished videos appear in Your Videos for 48 hours"
    ],
    faqs: [
      { question: "Can I promote long videos?", answer: "Yes. Long Video Promo is built for short vertical teasers using a promo clip, thumbnail, and title." },
      { question: "Does this automatically cut a long video?", answer: "The current flow expects a short uploaded promo clip rather than processing an entire long video." },
      { question: "Can I download the final Short?", answer: "Yes. The final MP4 can be previewed and downloaded from the dashboard." }
    ]
  }),
  page({
    slug: "ai-shorts-generator",
    title: "AI Shorts Generator for Social Video | Itnavideo",
    description: "Generate short vertical videos with AI captions, dynamic typography, comparison layouts, whiteboard scenes, and promo video types.",
    h1: "AI Shorts generator for focused, production-quality video types",
    eyebrow: "AI Shorts",
    primaryKeyword: "AI Shorts generator",
    audience: "short-form creators, marketers, educators, and founders",
    useCases: [
      "Create captioned shorts from existing videos",
      "Make faceless whiteboard explainers from voiceover",
      "Build comparison Shorts with two images",
      "Replace a creator video background with an uploaded image"
    ],
    benefits: [
      "Quality-over-quantity video type library",
      "Works with common video, audio, and image inputs",
      "Credits are used for final renders, not basic preview editing",
      "Temporary video storage helps control cost"
    ],
    faqs: [
      { question: "How many video types are active?", answer: "The product is focused on a small set of production video types instead of many average layouts." },
      { question: "Is this a full video editor?", answer: "No. Itnavideo is a video-type-based AI video creation workflow for short reels and shorts." },
      { question: "What happens after rendering?", answer: "Generated videos are available in the Your Videos section for about 48 hours." }
    ]
  }),
  page({
    slug: "ai-subtitle-generator",
    title: "AI Subtitle Generator for Reels | Itnavideo",
    description: "Generate word-timed subtitles for short videos with English and Roman Hinglish captions, style presets, colors, fonts, and safe positioning.",
    h1: "AI subtitle generator for short-form videos",
    eyebrow: "AI subtitles",
    primaryKeyword: "AI subtitle generator for reels",
    audience: "video creators, educators, podcast clippers, and social media teams",
    useCases: [
      "Add captions to Instagram Reels",
      "Burn subtitles into YouTube Shorts",
      "Create Hinglish captioned videos",
      "Fix caption text in preview before final render"
    ],
    benefits: [
      "Word-level timing from speech transcription",
      "Studio Clean and Karaoke Fill style options",
      "User-selected fonts, colors, size, and position",
      "No translation API dependency for default subtitles"
    ],
    faqs: [
      { question: "Are captions burned into the video?", answer: "Yes. Captions are rendered into the final MP4 so they appear on any platform." },
      { question: "Which languages are supported?", answer: "English and Roman Hinglish are supported for the current subtitle workflow." },
      { question: "Can I edit wrong words?", answer: "Supported preview flows are designed so users can review and fix mistakes before the final render." }
    ]
  }),
  page({
    slug: "add-subtitles-to-video",
    title: "Add Subtitles to Video Online | Itnavideo",
    description: "Upload a video and add styled, burned-in subtitles with position, font, size, color, and caption style controls.",
    h1: "Add subtitles to video online with AI captions",
    eyebrow: "Add subtitles",
    primaryKeyword: "add subtitles to video online",
    audience: "creators, educators, social media managers, and founders",
    useCases: [
      "Caption a speaking video for social media",
      "Make videos easier to watch on mute",
      "Create English or Hinglish subtitles",
      "Export a captioned MP4 without editing manually"
    ],
    benefits: [
      "Simple upload-to-render flow",
      "Caption preview before final export on supported flows",
      "Style presets plus manual color controls",
      "Original video audio stays unchanged"
    ],
    faqs: [
      { question: "How do I add subtitles?", answer: "Choose Auto Caption Reel, upload a video with speech, pick caption style settings, preview where supported, and render the final MP4." },
      { question: "Can I remove a wrong upload?", answer: "Yes. The dashboard supports removing uploaded files and selecting a new one before generation." },
      { question: "Does Itnavideo change my original video?", answer: "Auto Caption keeps the original video as the main content and adds captions on top." }
    ]
  }),
  page({
    slug: "auto-caption-video-generator",
    title: "Auto Caption Video Generator | Itnavideo",
    description: "Automatically caption short videos with professional preset styles, color controls, font settings, and word-timed subtitles.",
    h1: "Auto caption video generator for reels and shorts",
    eyebrow: "Auto captions",
    primaryKeyword: "auto caption video generator",
    audience: "short-video creators, coaches, educators, and brands",
    useCases: [
      "Caption creator videos for Reels",
      "Add subtitles to podcast clips",
      "Create readable educational clips",
      "Make videos more accessible"
    ],
    benefits: [
      "Focused caption-only video type",
      "No unrelated effects added to the video",
      "Presets apply matching text, highlight, background, font, and size",
      "User settings are passed into final render"
    ],
    faqs: [
      { question: "Does Auto Caption add extra visuals?", answer: "No. Auto Caption is intentionally focused on the user's original video plus captions." },
      { question: "Can I customize caption placement?", answer: "Yes. Caption position can be set to bottom, center, or top." },
      { question: "Can I use my brand colors?", answer: "Yes. Users can choose text, highlight, and background colors." }
    ]
  }),
  page({
    slug: "dynamic-creator-reel-maker",
    title: "Dynamic Creator Reel Maker | Itnavideo",
    description: "Turn a talking-head creator video into a premium typography-led reel with transcript-based key phrases and dynamic text overlays.",
    h1: "Dynamic creator reel maker for talking videos",
    eyebrow: "Dynamic creator reel",
    primaryKeyword: "dynamic creator reel maker",
    audience: "founders, creators, coaches, educators, and personal brands",
    useCases: [
      "Make talking-head clips feel more edited",
      "Add punchy typography to key phrases",
      "Repurpose creator videos into short reels",
      "Create high-retention social clips from speech"
    ],
    benefits: [
      "Creator video remains the main visual",
      "No random stock visuals or b-roll",
      "Typography follows the transcript",
      "Designed around premium short-form pacing"
    ],
    faqs: [
      { question: "Do I need to upload images?", answer: "No. Dynamic Creator Reel focuses on the creator video and typography only." },
      { question: "Does it support audio-only input?", answer: "No. This video type needs a creator video because the video is the main visual." },
      { question: "Will text cover the speaker?", answer: "The video type is designed to keep typography in safe areas, but every source video should still be visually checked." }
    ]
  }),
  page({
    slug: "compare-explainer-video-maker",
    title: "Compare Explainer Video Maker | Itnavideo",
    description: "Create left-vs-right comparison reels from a voiceover and two images with captions and a sticker presenter.",
    h1: "Compare explainer video maker for side-by-side reels",
    eyebrow: "Compare explainer",
    primaryKeyword: "compare explainer video maker",
    audience: "educators, reviewers, product creators, SaaS teams, and finance pages",
    useCases: [
      "Compare two products or tools",
      "Explain plan differences visually",
      "Create educational left-vs-right reels",
      "Make decision-style social videos"
    ],
    benefits: [
      "Two-image comparison layout",
      "Sticker presenter points to the correct side",
      "Captions from the uploaded voiceover",
      "Pose logic supports left, right, question, warning, success, and conclusion moments"
    ],
    faqs: [
      { question: "What do I upload?", answer: "Upload one audio voiceover plus exactly two comparison images: left and right." },
      { question: "Can the sticker point to the correct side?", answer: "Yes. Pose names and planner instructions are designed around left-side and right-side explainer intent." },
      { question: "Can I replace a wrong image before rendering?", answer: "Yes. The dashboard allows uploaded comparison images to be removed and replaced." }
    ]
  }),
  page({
    slug: "whiteboard-video-maker",
    title: "Whiteboard Video Maker from Voiceover | Itnavideo",
    description: "Create whiteboard-style explainer reels from audio or video speech with AI-planned scenes and clean educational visuals.",
    h1: "Whiteboard video maker for voiceover explainers",
    eyebrow: "Auto Draw",
    primaryKeyword: "whiteboard video maker",
    audience: "teachers, educators, course creators, students, and trainers",
    useCases: [
      "Turn lessons into whiteboard reels",
      "Explain concepts with simple drawn scenes",
      "Create study content from voice notes",
      "Make educational Shorts without drawing manually"
    ],
    benefits: [
      "Gemini-assisted scene planning",
      "Clean educational whiteboard style",
      "Works from audio or video with speech",
      "No uploaded images required"
    ],
    faqs: [
      { question: "Do I need to draw anything?", answer: "No. Upload speech content and Auto Draw creates whiteboard-style scenes from the transcript." },
      { question: "Is this good for education?", answer: "Yes. Auto Draw is built for concept explanations, lessons, and study content." },
      { question: "Does it require a video?", answer: "No. Audio or video with clear speech can be used." }
    ]
  }),
  page({
    slug: "long-video-promo-maker",
    title: "Long Video Promo Maker for YouTube and Podcasts | Itnavideo",
    description: "Create a short vertical promo reel for a long-form video using a promo clip, thumbnail, title, and optional duration details.",
    h1: "Long video promo maker for short teasers",
    eyebrow: "Long Video Promo",
    primaryKeyword: "long video promo maker",
    audience: "YouTubers, podcasters, educators, musicians, and religious content creators",
    useCases: [
      "Promote a YouTube video",
      "Create a podcast episode teaser",
      "Promote a lecture, bayan, noha, or course video",
      "Turn a thumbnail and short clip into a vertical promo"
    ],
    benefits: [
      "Thumbnail-first promo layout",
      "Works with uploaded audio or video promo clips",
      "Designed for short social distribution",
      "Final video is easy to find in Your Videos"
    ],
    faqs: [
      { question: "Do I upload the full long video?", answer: "For now, upload a short promo clip plus the thumbnail and title." },
      { question: "Can I use a YouTube thumbnail?", answer: "Yes. A 16:9 thumbnail works best for this video type." },
      { question: "Is this only for YouTube?", answer: "No. It also works for podcast, lecture, music, and educational promo reels." }
    ]
  }),
  page({
    slug: "video-background-image-replace",
    title: "Replace Video Background with Image | Itnavideo",
    description: "Upload a creator video and one background image, preview the placement, adjust crop and scale, then export a background-replaced short video.",
    h1: "Replace a creator video background with an uploaded image",
    eyebrow: "Background replace",
    primaryKeyword: "replace video background with image",
    audience: "creators, educators, founders, coaches, and short-form video makers",
    useCases: [
      "Put a creator in front of a branded background",
      "Replace a messy room background",
      "Create clean reels without a studio",
      "Match creator videos to campaign visuals"
    ],
    benefits: [
      "Simple creator video plus background image workflow",
      "Live preview for position and scale adjustments",
      "Final render uses the same saved adjustment values",
      "Short-video focused to control processing cost"
    ],
    faqs: [
      { question: "Can I upload my own background image?", answer: "Yes. Upload one background image and adjust fit, zoom, and position before export." },
      { question: "Can I adjust the creator placement?", answer: "Yes. The dashboard includes controls for creator position and scale." },
      { question: "Is this for long videos?", answer: "No. This is focused on reels and shorts because high-quality background removal is compute-heavy." }
    ]
  }),
  page({
    slug: "audio-to-reels",
    title: "Audio to Reels Generator | Itnavideo",
    description: "Turn voiceovers and audio lessons into short reels using video types such as Compare Explainer, Auto Draw Explainer, and Long Video Promo.",
    h1: "Audio to reels generator for voiceover content",
    eyebrow: "Audio to reels",
    primaryKeyword: "audio to reels generator",
    audience: "voiceover creators, educators, course sellers, and faceless creators",
    useCases: [
      "Create whiteboard explainers from audio",
      "Make comparison reels from voiceover",
      "Turn lessons into short educational videos",
      "Create promos from audio clips"
    ],
    benefits: [
      "Audio-first video types for explainers and promos",
      "Transcript-based planning and captions",
      "No manual editing timeline",
      "Short vertical MP4 output"
    ],
    faqs: [
      { question: "Can I create a reel from only audio?", answer: "Yes, audio-based video types such as Compare Explainer and Auto Draw work from voiceover." },
      { question: "Does every video type support audio-only?", answer: "No. Dynamic Creator and Auto Caption require video because the uploaded video is the main visual." },
      { question: "Do I need images?", answer: "Compare Explainer needs two images, while Auto Draw does not require uploaded images." }
    ]
  }),
  page({
    slug: "hinglish-caption-generator",
    title: "Hinglish Caption Generator for Reels | Itnavideo",
    description: "Create Roman Hinglish captions for short videos using speech transcription and clean caption styles built for Reels and Shorts.",
    h1: "Hinglish caption generator for short videos",
    eyebrow: "Hinglish captions",
    primaryKeyword: "Hinglish caption generator",
    audience: "Indian creators, educators, finance pages, coaches, and YouTube Shorts creators",
    useCases: [
      "Caption Hindi-English mixed speech in Roman script",
      "Make educational Hinglish reels easier to follow",
      "Add readable captions to creator videos",
      "Create Shorts for Indian audiences"
    ],
    benefits: [
      "Roman Hinglish subtitle support",
      "No Devanagari requirement for default captions",
      "Readable social caption presets",
      "Works for common Indian creator workflows"
    ],
    faqs: [
      { question: "Does Itnavideo create Devanagari captions?", answer: "The current default subtitle workflow supports English and Roman Hinglish, not Devanagari." },
      { question: "Is this useful for Indian creators?", answer: "Yes. It is built for English and Roman Hinglish short-form creator workflows." },
      { question: "Can I choose English instead?", answer: "Yes. Users can choose English or Hinglish subtitle output." }
    ]
  }),
  page({
    slug: "free-ai-video-generator",
    title: "Free AI Video Generator Online — Create Videos with AI | Itnavideo",
    description: "Generate high-quality AI videos for free. Turn audio, text scripts, talking clips, and images into polished Reels, Shorts, and 16:9 widescreen videos without complex editing.",
    h1: "Free AI video generator for creators, marketers & businesses",
    eyebrow: "Free AI Video Generator",
    primaryKeyword: "free ai video generator",
    audience: "content creators, YouTubers, marketers, founders, agencies, and educators",
    useCases: [
      "Generate viral social media reels and shorts for free",
      "Create captions, typography, and b-roll videos from speech",
      "Transform podcast audio into engaging video clips",
      "Make educational whiteboard & comparison explainers"
    ],
    benefits: [
      "No complex timeline or video editing experience needed",
      "11 purpose-built video workflows for short and long-form video",
      "Word-level sync captions in English and Roman Hinglish",
      "Instant cloud rendering with 1080p full HD MP4 downloads"
    ],
    faqs: [
      { question: "Is Itnavideo really a free AI video generator?", answer: "Yes. You can test workflows with free starter credits to create and export AI-generated videos." },
      { question: "What types of videos can I generate for free?", answer: "You can generate auto-captioned reels, typography videos, podcast clips, faceless videos, whiteboard explainers, and comparison videos." },
      { question: "Do I need to install any software?", answer: "No. Itnavideo runs entirely in your web browser with ultra-fast cloud rendering." }
    ]
  }),
  page({
    slug: "ai-video-generator",
    title: "AI Video Generator — Create Professional Videos in Minutes | Itnavideo",
    description: "The modern AI video generator for short-form reels and long-form videos. Automated captions, kinetic typography, whiteboard explainers, and AI scene planning.",
    h1: "AI video generator built for scalable content creation",
    eyebrow: "AI Video Generator",
    primaryKeyword: "ai video generator",
    audience: "video creators, digital agencies, DTC brands, podcasters, and educators",
    useCases: [
      "Turn raw video clips into styled high-retention reels",
      "Generate 16:9 widescreen landscape YouTube videos",
      "Automate social video publishing across TikTok, Instagram, and Shorts",
      "Produce faceless storytelling videos from audio voiceovers"
    ],
    benefits: [
      "Focused production workflows with structured layouts",
      "Precise word-level subtitle timing powered by AI transcription",
      "Automated scene pacing, visuals, and safe zone alignment",
      "Direct cloud rendering engine ready in 60 seconds"
    ],
    faqs: [
      { question: "How does the AI video generator work?", answer: "Simply select a video type, upload your video, audio, or script, customize your caption style, and click render. AI handles the layout, motion, and export." },
      { question: "Can I create 16:9 landscape videos for YouTube?", answer: "Yes. Itnavideo supports 16:9 Faceless Video up to 20 minutes." },
      { question: "What formats can I export?", answer: "All videos are exported as standard high-bitrate MP4 files compatible with all video platforms." }
    ]
  }),
  page({
    slug: "best-ai-video-generator",
    title: "Best AI Video Generator in 2026 — Features & Comparison | Itnavideo",
    description: "Looking for the best AI video generator? Discover Itnavideo: 11 specialized workflows, word-synced subtitles, faceless long-form video, and instant cloud rendering.",
    h1: "The best AI video generator for creators and production teams",
    eyebrow: "Best AI Video Generator",
    primaryKeyword: "best ai video generator",
    audience: "professional creators, media agencies, media production teams, and growth marketers",
    useCases: [
      "Replace expensive video editors and tedious timeline software",
      "Produce dozens of branded video assets weekly",
      "Convert voiceover scripts into polished multi-scene videos",
      "Clean audio, remove pauses, and burn viral animated subtitles"
    ],
    benefits: [
      "Deterministic, high-quality layouts without AI hallucinations",
      "Zero manual keyframing or subtitle alignment required",
      "Transparent pay-as-you-go credit system with no lock-in contracts",
      "Built-in audio cleaning, mistake removal, and script previews"
    ],
    faqs: [
      { question: "Why is Itnavideo considered one of the best AI video generators?", answer: "Unlike generic AI tools that hallucinate random images, Itnavideo uses specialized production templates with real speech transcription, precise safe zones, and word-level typography." },
      { question: "How fast is the rendering speed?", answer: "Most short reels render in 30 to 60 seconds, and long-form videos render in just 2 to 3 minutes on our dedicated cloud infrastructure." },
      { question: "Can I use Itnavideo for client commercial work?", answer: "Yes. You have full commercial rights to all videos and audio files rendered with Itnavideo." }
    ]
  }),
  page({
    slug: "ai-video-maker",
    title: "AI Video Maker Online — Make Viral Videos with AI | Itnavideo",
    description: "Make high-retention videos with our AI video maker. Upload audio, video, or photos and let AI handle transcription, timing, dynamic overlays, and HD video export.",
    h1: "AI video maker for YouTube Shorts, Reels & TikTok",
    eyebrow: "AI Video Maker",
    primaryKeyword: "ai video maker",
    audience: "short-form creators, TikTokers, YouTubers, personal brands, and entrepreneurs",
    useCases: [
      "Make talking-head videos pop with kinetic text and sound sync",
      "Convert podcast audio highlights into viral vertical reels",
      "Build educational side-by-side comparison videos",
      "Create high-converting video promos for courses and products"
    ],
    benefits: [
      "Fast upload-to-video workflow in 3 simple steps",
      "23+ customizable caption presets and animated text styles",
      "Automatic silence cutting and audio enhancement",
      "Studio quality 1080x1920 MP4 outputs ready to share"
    ],
    faqs: [
      { question: "Can I make videos without showing my face?", answer: "Yes! Our Faceless Video, Whiteboard Video, and Compare Explainer templates allow you to create complete videos using only voiceovers or scripts." },
      { question: "Can I customize the caption fonts and colors?", answer: "Yes. You have full control over fonts, text color, highlight color, background boxes, and positioning." },
      { question: "Does it work on mobile phones?", answer: "Yes. The Itnavideo dashboard is fully responsive and works across mobile, tablet, and desktop browsers." }
    ]
  }),
  page({
    slug: "ai-video-creator",
    title: "AI Video Creator — Turn Ideas & Scripts into Videos | Itnavideo",
    description: "Create studio-quality videos effortlessly with Itnavideo AI video creator. No timeline editing required — AI automatically designs, captions, and renders your content.",
    h1: "All-in-one AI video creator for modern creators",
    eyebrow: "AI Video Creator",
    primaryKeyword: "ai video creator",
    audience: "educators, course creators, content teams, podcasters, and business owners",
    useCases: [
      "Transform written scripts into narrated explainer videos",
      "Automate regular video production for YouTube and social media",
      "Create clean educational tutorials with synchronized subtitles",
      "Promote long videos with dynamic teaser clips"
    ],
    benefits: [
      "AI-driven scene generation and layout planning",
      "Crystal clear audio with built-in voice cleaner and silence remover",
      "Consistent typography and visual styling across all renders",
      "Batch workflow support for creators managing multiple channels"
    ],
    faqs: [
      { question: "What files can I upload to the AI video creator?", answer: "You can upload MP4, MOV, WEBM videos, MP3, WAV, M4A audio files, and JPG, PNG images." },
      { question: "How long are my rendered videos stored?", answer: "Rendered videos are stored safely in Your Videos for 48 hours so you can preview and download them anytime." },
      { question: "Can I edit the script before rendering?", answer: "Yes. Preview-supported video types allow you to review the transcript and fix any words before final generation." }
    ]
  }),
  page({
    slug: "text-to-video-generator",
    title: "Text to Video Generator — Turn Scripts into HD Videos | Itnavideo",
    description: "Turn text prompts, articles, and voiceover scripts into engaging 9:16 and 16:9 videos with AI-selected visuals, synchronized captions, and background music.",
    h1: "Text to video generator for faceless channels & explainers",
    eyebrow: "Text to Video Generator",
    primaryKeyword: "text to video generator",
    audience: "faceless channel owners, blog authors, educators, marketers, and storytellers",
    useCases: [
      "Convert blog posts and articles into video summaries",
      "Generate YouTube automation videos from scripts",
      "Create animated whiteboard explainers from lessons",
      "Produce dynamic typography promo videos from quotes"
    ],
    benefits: [
      "Direct script-to-video planning with AI scene director",
      "Automatic synchronization between narration and visual scenes",
      "Supports both 9:16 vertical and 16:9 widescreen formats",
      "High-speed cloud rendering without burning computer resources"
    ],
    faqs: [
      { question: "How does text to video work on Itnavideo?", answer: "You input your script or voiceover, and the AI plans scenes, selects typography, builds animations, and renders a finished video automatically." },
      { question: "Can I choose between vertical and widescreen video?", answer: "Yes. You can create 9:16 vertical reels for Shorts & TikTok or 16:9 widescreen videos for YouTube." },
      { question: "Do I need a microphone to record voiceover?", answer: "You can upload your own voice recording or audio file, and the AI will transcribe, align, and sync the visuals to your words." }
    ]
  })
];

export const seoLandingSlugs = seoLandingPages.map((page) => page.slug);

export function getSeoLandingPage(slug: string) {
  return seoLandingPages.find((page) => page.slug === slug);
}
