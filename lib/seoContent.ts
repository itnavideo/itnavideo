export type SeoPageKind = "tool" | "useCase" | "comparison";

export type SeoFaq = {
  question: string;
  answer: string;
};

export type SeoInternalLink = {
  label: string;
  href: string;
};

export type SeoContentPage = {
  kind: SeoPageKind;
  slug: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  hero: string;
  shortExplanation: string;
  primaryKeyword: string;
  relatedKeywords: string[];
  dashboardType: string;
  previewImage: string;
  howItWorks: string[];
  benefits: string[];
  useCases: string[];
  whyItnavideo: string[];
  faqs: SeoFaq[];
  internalLinks: SeoInternalLink[];
};

const toolLink = (slug: string, label: string): SeoInternalLink => ({ label, href: `/tools/${slug}` });
const audienceLink = (slug: string, label: string): SeoInternalLink => ({ label, href: `/use-cases/${slug}` });
const blogLink = (slug: string, label: string): SeoInternalLink => ({ label, href: `/blog/${slug}` });
const compareLink = (slug: string, label: string): SeoInternalLink => ({ label, href: `/compare/${slug}` });

const allVideoTypes = [
  "Auto Caption Video",
  "Compare Explainer Video",
  "Long Video Promo",
  "Whiteboard Video",
  "Typography Video",
];

const commonWhy = [
  "It uses focused Video Types instead of a confusing manual timeline editor.",
  "It is built for mobile-first 9:16 reels, Shorts, and short social videos.",
  `It can support multiple creator workflows, including ${allVideoTypes.slice(0, 4).join(", ")}, ${allVideoTypes.slice(4).join(", ")}.`,
  "It keeps the workflow conversion-focused: upload, generate, review, and download.",
];

const page = (item: Omit<SeoContentPage, "path"> & { basePath: "/tools" | "/use-cases" | "/compare" }): SeoContentPage => ({
  ...item,
  path: `${item.basePath}/${item.slug}`,
});

export const toolSeoPages: SeoContentPage[] = [
  page({
    kind: "tool",
    basePath: "/tools",
    slug: "auto-caption-video-generator",
    title: "Auto Caption Video Generator for Reels and Shorts",
    description: "Use Itnavideo as an auto caption generator and video caption generator for reels, Shorts, podcasts, lessons, and talking videos.",
    h1: "Auto caption video generator for reels, Shorts, and talking videos",
    eyebrow: "Auto Caption Video",
    hero: "Upload a video with speech, choose a caption style, and generate a polished captioned MP4 without manually timing subtitles.",
    shortExplanation: "This page targets creators who need an auto caption generator, video caption generator, and AI subtitle workflow for short-form content. Itnavideo keeps the original video as the main content and adds readable, word-timed captions on top.",
    primaryKeyword: "auto caption video generator",
    relatedKeywords: ["auto caption generator", "video caption generator", "AI subtitle generator", "caption reels", "AI video generator"],
    dashboardType: "auto-caption-video",
    previewImage: "/preview/Auto Caption Reel.png",
    howItWorks: [
      "Upload a short video with clear speech.",
      "Itnavideo transcribes the audio with Groq Whisper.",
      "Choose a caption style, size, position, text color, and highlight color.",
      "Render a 9:16 MP4 with burned-in captions ready for social platforms.",
    ],
    benefits: [
      "Save manual caption timing work in CapCut or Premiere.",
      "Make videos easier to watch on mute.",
      "Use caption styles that look like real creator reels.",
      "Keep the original video and audio unchanged.",
    ],
    useCases: [
      "Instagram Reels with captions",
      "YouTube Shorts subtitles",
      "Podcast clips",
      "Course clips and educational lessons",
      "Business talking-head clips",
    ],
    whyItnavideo: commonWhy,
    faqs: [
      { question: "Can I use this as an auto caption generator?", answer: "Yes. Upload a video with speech, pick a caption style, and render a captioned MP4." },
      { question: "Are captions burned into the final video?", answer: "Yes. Captions are rendered into the MP4 so they show on Instagram, YouTube Shorts, TikTok, and other platforms." },
      { question: "Does Itnavideo support Hinglish captions?", answer: "The current caption flow supports English and Roman Hinglish output from the supported transcription pipeline." },
    ],
    internalLinks: [
      toolLink("ai-reel-generator", "AI reel generator"),
      blogLink("how-to-add-captions-to-instagram-reels", "How to add captions to Instagram Reels"),
      blogLink("how-to-add-captions-to-youtube-shorts", "How to add captions to YouTube Shorts"),
      compareLink("best-auto-caption-tools", "Best auto caption tools"),
    ],
  }),
  page({
    kind: "tool",
    basePath: "/tools",
    slug: "ai-reel-generator",
    title: "AI Reel Generator for Creators, Coaches, and Businesses",
    description: "Create reels with Itnavideo's AI reel generator for captions, creator videos, explainers, promos, background replacement, and custom AI reels.",
    h1: "AI reel generator for polished short videos without manual editing",
    eyebrow: "AI Reel Generator",
    hero: "Create short-form reels from real videos, voiceovers, images, thumbnails, or prompts using focused Itnavideo Video Types.",
    shortExplanation: "Itnavideo is an AI video generator and AI reel generator for creators who want publish-ready 9:16 videos without opening a traditional timeline editor.",
    primaryKeyword: "AI reel generator",
    relatedKeywords: ["AI video generator", "reel maker", "AI shorts generator", "video generator", "short form video generator"],
    dashboardType: "dynamic-creator-reel",
    previewImage: "/preview/Dynamic Creator Reel.png",
    howItWorks: [
      "Choose the Video Type that matches your goal.",
      "Upload the required video, audio, images, thumbnail, or prompt.",
      "Itnavideo prepares transcription, captions, scene timing, or layout.",
      "Render and download a mobile-first MP4.",
    ],
    benefits: [
      "One platform for captions, creator reels, explainers, promos, and custom reels.",
      "No manual cuts or complex editing timeline.",
      "Built around creator use cases, not generic stock video slides.",
      "Conversion-focused workflow from upload to download.",
    ],
    useCases: [
      "Creator reels",
      "AI Shorts",
      "Educational explainers",
      "Long video promos",
      "Business and coaching videos",
    ],
    whyItnavideo: commonWhy,
    faqs: [
      { question: "Is Itnavideo an AI video generator?", answer: "Yes. Itnavideo generates short-form videos from uploaded content and focused Video Type workflows." },
      { question: "Is this a manual editor?", answer: "No. Itnavideo is designed for users who want to upload content and let the system handle the structure and render." },
      { question: "What Video Types are available?", answer: `Itnavideo tracks ${allVideoTypes.join(", ")} as product workflows.` },
    ],
    internalLinks: [
      toolLink("auto-caption-video-generator", "Auto caption video generator"),
      toolLink("custom-ai-reel-generator", "Custom AI reel generator"),
      audienceLink("ai-video-tool-for-creators", "AI video tool for creators"),
      compareLink("best-ai-video-tools-for-reels", "Best AI video tools for reels"),
    ],
  }),
  page({
    kind: "tool",
    basePath: "/tools",
    slug: "custom-ai-reel-generator",
    title: "Custom AI Reel Generator from Prompts and Uploaded Media",
    description: "Describe your reel idea, upload optional images or a logo, and use Itnavideo's Custom AI Reel workflow to create a polished 9:16 video.",
    h1: "Custom AI reel generator for prompt-based short videos",
    eyebrow: "Custom AI Reel",
    hero: "Turn a simple prompt into a structured short video with optional screenshots, images, and logo assets.",
    shortExplanation: "Custom AI Reel is for users who need a flexible AI reel generator when standard Video Types do not fully match the idea.",
    primaryKeyword: "custom AI reel generator",
    relatedKeywords: ["AI reel generator", "AI video generator", "prompt to reel", "custom reel maker"],
    dashboardType: "custom-ai-reel",
    previewImage: "/preview/Custom AI Reel.png",
    howItWorks: [
      "Describe the video in simple English.",
      "Optionally upload images, screenshots, and a logo.",
      "Itnavideo creates a structured timeline for the reel.",
      "Render a 9:16 MP4 for social use.",
    ],
    benefits: [
      "Flexible workflow when a fixed Video Type is not enough.",
      "Supports text-only and media-supported reel ideas.",
      "Keeps uploaded media central instead of using random visuals.",
      "Useful for product promos, announcements, and custom explainers.",
    ],
    useCases: ["Product explainers", "Launch videos", "App promos", "Screenshot reels", "Simple text-based campaigns"],
    whyItnavideo: commonWhy,
    faqs: [
      { question: "Can I make a reel from only a prompt?", answer: "Yes, text-only Custom AI Reels can be created when the prompt is clear enough." },
      { question: "Can I upload screenshots?", answer: "Yes. Custom AI Reel is designed to use optional uploaded images and screenshots." },
      { question: "Does it add random stock assets?", answer: "The planned workflow prioritizes user-uploaded media and structured timeline generation." },
    ],
    internalLinks: [
      toolLink("ai-reel-generator", "AI reel generator"),
      audienceLink("ai-video-tool-for-businesses", "AI video tool for businesses"),
      blogLink("how-to-create-reels-from-audio", "Create reels from audio"),
    ],
  }),
  page({
    kind: "tool",
    basePath: "/tools",
    slug: "long-video-promo-maker",
    title: "Long Video Promo Maker for YouTube, Podcasts, and Courses",
    description: "Promote long videos with short vertical promos using a thumbnail, title, and promo clip in Itnavideo.",
    h1: "Long video promo maker for short social teasers",
    eyebrow: "Long Video Promo",
    hero: "Use a thumbnail, title, and short clip to create a vertical promo for your long-form content.",
    shortExplanation: "This page targets creators who need a reel maker for YouTube videos, podcasts, courses, webinars, lectures, noha, munajat, bayan, and long-form episodes.",
    primaryKeyword: "long video promo maker",
    relatedKeywords: ["YouTube promo maker", "podcast clip maker", "AI shorts generator", "reel maker"],
    dashboardType: "long-video-promo",
    previewImage: "/preview/Long Video Promo.png",
    howItWorks: [
      "Upload a thumbnail image.",
      "Add the video title.",
      "Upload a short promo clip.",
      "Render a 9:16 promo reel for Shorts, Reels, or TikTok.",
    ],
    benefits: [
      "Promote long-form content without manually designing a teaser.",
      "Keep the thumbnail and title visible.",
      "Create social clips for YouTube, podcasts, and courses.",
      "Save time when every new long video needs a promo.",
    ],
    useCases: ["YouTube video promos", "Podcast teasers", "Course launches", "Lecture clips", "Religious content promos"],
    whyItnavideo: commonWhy,
    faqs: [
      { question: "Do I upload the full long video?", answer: "For this workflow, upload a short promo clip plus the thumbnail and title." },
      { question: "Can podcasters use this?", answer: "Yes. It works well for podcast episode teasers and interview highlights." },
      { question: "Can I use it for YouTube Shorts?", answer: "Yes. The output is a vertical MP4 suitable for YouTube Shorts and similar platforms." },
    ],
    internalLinks: [
      audienceLink("ai-video-tool-for-podcasters", "AI video tool for podcasters"),
      audienceLink("ai-video-tool-for-course-creators", "AI video tool for course creators"),
      blogLink("how-to-turn-long-videos-into-short-promos", "Turn long videos into short promos"),
    ],
  }),
  page({
    kind: "tool",
    basePath: "/tools",
    slug: "compare-explainer-video-maker",
    title: "Compare Explainer Video Maker for Side-by-Side Reels",
    description: "Create comparison videos from voiceover and two images with Itnavideo's Compare Explainer Video Type.",
    h1: "Compare explainer video maker for products, ideas, and concepts",
    eyebrow: "Compare Explainer Video",
    hero: "Build left-vs-right comparison reels with captions, labels, images, and presenter-style elements.",
    shortExplanation: "Use this comparison reel maker for product comparisons, educational explainers, finance topics, coaching content, and business decisions.",
    primaryKeyword: "compare explainer video maker",
    relatedKeywords: ["comparison video maker", "AI video generator", "explainer video maker", "reel maker"],
    dashboardType: "compare-explainer",
    previewImage: "/preview/Compare Explainer.png",
    howItWorks: [
      "Upload a voiceover or speech video.",
      "Upload left and right comparison images.",
      "Add labels for each side.",
      "Render a side-by-side comparison reel.",
    ],
    benefits: [
      "Turns complex choices into a simple visual comparison.",
      "Great for education, reviews, product pages, and finance explainers.",
      "Captions help viewers follow the voiceover.",
      "Presenter elements make the reel more engaging than a static slide.",
    ],
    useCases: ["Product A vs Product B", "Tool comparisons", "Finance explainers", "Education topics", "Course lessons"],
    whyItnavideo: commonWhy,
    faqs: [
      { question: "What do I need to upload?", answer: "Upload speech plus two images: one for the left side and one for the right side." },
      { question: "Can I compare services or ideas?", answer: "Yes. Compare Explainer works for products, tools, services, ideas, and concepts." },
      { question: "Does it include captions?", answer: "Yes. Speech-based comparison videos can use captions from the uploaded voiceover." },
    ],
    internalLinks: [
      toolLink("compare-explainer-video-maker", "Compare explainer video maker"),
      audienceLink("ai-video-tool-for-teachers", "AI video tool for teachers"),
      compareLink("best-ai-video-tools-for-reels", "Best AI video tools for reels"),
    ],
  }),
  page({
    kind: "tool",
    basePath: "/tools",
    slug: "auto-draw-explainer-video-generator",
    title: "Auto Draw Explainer Video Generator for Teaching Reels",
    description: "Create whiteboard and notes-style explainer reels from audio or video speech with Itnavideo's Auto Draw Explainer.",
    h1: "Auto draw explainer video generator for whiteboard-style reels",
    eyebrow: "Auto Draw Explainer Video",
    hero: "Upload speech and create a notes-style explainer where headings, bullets, sketches, and highlights reveal with the lesson.",
    shortExplanation: "This AI video generator helps teachers, coaches, and course creators turn lessons into visual reels without drawing manually.",
    primaryKeyword: "auto draw explainer video generator",
    relatedKeywords: ["whiteboard explainer video", "AI video generator", "teaching reels", "explainer video maker"],
    dashboardType: "auto-draw-explainer",
    previewImage: "/preview/Auto Draw Explainer.png",
    howItWorks: [
      "Upload audio or video with clear speech.",
      "Itnavideo transcribes the message.",
      "Auto Draw plans notes, highlights, sketches, and reveal timing.",
      "Render a clean educational 9:16 explainer.",
    ],
    benefits: [
      "No drawing skill required.",
      "Useful for lessons, concepts, study notes, and course clips.",
      "Makes educational content more visual.",
      "Works well for teachers and coaches.",
    ],
    useCases: ["Whiteboard explainers", "Study notes", "Course clips", "Coaching lessons", "Concept breakdowns"],
    whyItnavideo: commonWhy,
    faqs: [
      { question: "Do I need to draw anything?", answer: "No. Auto Draw builds visual notes from the uploaded speech." },
      { question: "Is this for teachers?", answer: "Yes. It is designed for educators, course creators, coaches, and study content." },
      { question: "Can I upload only audio?", answer: "Yes. Auto Draw can work from audio or video with speech." },
    ],
    internalLinks: [
      audienceLink("ai-video-tool-for-teachers", "AI video tool for teachers"),
      audienceLink("ai-video-tool-for-course-creators", "AI video tool for course creators"),
      blogLink("how-to-create-reels-from-audio", "Create reels from audio"),
    ],
  }),
  page({
    kind: "tool",
    basePath: "/tools",
    slug: "background-replace-video",
    title: "Background Replace Video Tool for Creator Reels",
    description: "Replace a creator video's background with an uploaded image and export a clean short-form video with Itnavideo.",
    h1: "Background replace video tool for cleaner creator reels",
    eyebrow: "Background Replace Video",
    hero: "Upload a creator video and a background image, adjust placement, and export a cleaner vertical video.",
    shortExplanation: "This tool helps creators and businesses create a studio-like look without filming in a perfect location.",
    primaryKeyword: "background replace video",
    relatedKeywords: ["replace video background", "AI video generator", "creator reel maker", "video background image replace"],
    dashboardType: "background-replace",
    previewImage: "/preview/Background Replace Video.png",
    howItWorks: [
      "Upload the creator video.",
      "Upload the background image.",
      "Adjust fit, zoom, and position in the dashboard preview.",
      "Render the final background-replaced MP4.",
    ],
    benefits: [
      "Hide messy or distracting backgrounds.",
      "Match videos to brand or campaign visuals.",
      "Create a cleaner creator presence.",
      "Useful for short-form business and coaching content.",
    ],
    useCases: ["Creator videos", "Business reels", "Coaching clips", "Product explainers", "Brand backgrounds"],
    whyItnavideo: commonWhy,
    faqs: [
      { question: "Can I upload my own background?", answer: "Yes. Upload an image and adjust its position before final render." },
      { question: "Is this for long videos?", answer: "No. Background replacement is focused on short reels because processing is compute-heavy." },
      { question: "Does the final render keep the audio?", answer: "The Background Replace workflow is designed to mux the original audio back into the final MP4." },
    ],
    internalLinks: [
      toolLink("dynamic-explainer-video-generator", "Dynamic explainer video generator"),
      audienceLink("ai-video-tool-for-businesses", "AI video tool for businesses"),
      audienceLink("ai-video-tool-for-coaches", "AI video tool for coaches"),
    ],
  }),
  page({
    kind: "tool",
    basePath: "/tools",
    slug: "dynamic-explainer-video-generator",
    title: "Dynamic Explainer Video Generator for Creator Reels",
    description: "Turn talking-head videos into dynamic creator reels with transcript-led typography and short-form pacing.",
    h1: "Dynamic explainer video generator for creator-led reels",
    eyebrow: "Dynamic Creator Reel Video",
    hero: "Upload a talking-head video and create a creator-style reel with key phrases, typography, and polished short-form structure.",
    shortExplanation: "This page targets users searching for an AI video generator, dynamic explainer video generator, and reel maker for creator videos.",
    primaryKeyword: "dynamic explainer video generator",
    relatedKeywords: ["AI video generator", "creator reel maker", "AI reel generator", "video generator"],
    dashboardType: "dynamic-creator-reel",
    previewImage: "/preview/Dynamic Creator Reel.png",
    howItWorks: [
      "Upload a talking-head video with speech.",
      "Itnavideo transcribes the speech.",
      "The workflow highlights key phrases with creator-style typography.",
      "Render a 9:16 reel for social platforms.",
    ],
    benefits: [
      "Make talking videos feel edited without manual typography work.",
      "Keep the creator as the main visual.",
      "Avoid unrelated stock visuals.",
      "Create short-form content from real speech.",
    ],
    useCases: ["Founder clips", "Coach videos", "Education reels", "Business explainers", "Personal brand clips"],
    whyItnavideo: commonWhy,
    faqs: [
      { question: "Does this use my real video?", answer: "Yes. Dynamic Creator Reel keeps the uploaded creator video as the main visual." },
      { question: "Can I use only audio?", answer: "This workflow is intended for talking-head video because the creator video is the core visual." },
      { question: "What makes it different from Auto Caption?", answer: "Auto Caption focuses on captions only. Dynamic Creator Reel adds key phrase typography and creator-style pacing." },
    ],
    internalLinks: [
      audienceLink("ai-video-tool-for-creators", "AI video tool for creators"),
      audienceLink("ai-video-tool-for-coaches", "AI video tool for coaches"),
      toolLink("auto-caption-video-generator", "Auto caption video generator"),
    ],
  }),
];

export const useCaseSeoPages: SeoContentPage[] = [
  page({
    kind: "useCase",
    basePath: "/use-cases",
    slug: "ai-video-tool-for-creators",
    title: "AI Video Tool for Creators Who Need Reels Fast",
    description: "Itnavideo helps creators turn videos, voiceovers, prompts, thumbnails, and images into polished short-form videos.",
    h1: "AI video tool for creators who need consistent reels",
    eyebrow: "For creators",
    hero: "Create captioned videos, dynamic creator reels, explainers, promos, and custom AI reels without editing every clip by hand.",
    shortExplanation: "Creators need a repeatable AI video generator and reel maker that supports real content, not generic slides. Itnavideo is built around focused Video Types for common creator workflows.",
    primaryKeyword: "AI video tool for creators",
    relatedKeywords: ["AI video generator", "AI reel generator", "reel maker", "video generator"],
    dashboardType: "dynamic-creator-reel",
    previewImage: "/preview/Dynamic Creator Reel.png",
    howItWorks: ["Choose a creator-focused Video Type.", "Upload your video, voiceover, image, thumbnail, or prompt.", "Let Itnavideo prepare captions, timing, layout, or scene structure.", "Render and download your reel."],
    benefits: ["Save editing time.", "Create more consistently.", "Repurpose existing content.", "Use one platform for multiple creator formats."],
    useCases: ["Talking-head reels", "Captioned clips", "Long video promos", "Comparison explainers", "Custom AI reels"],
    whyItnavideo: commonWhy,
    faqs: [
      { question: "Is Itnavideo for full-time creators?", answer: "Yes. It is useful for creators who need repeatable short-form output without editing every reel manually." },
      { question: "Can I use my own video?", answer: "Yes. Several Video Types are built around user-uploaded videos and voiceovers." },
      { question: "Can I create different styles of reels?", answer: "Yes. Itnavideo has focused Video Types for captions, creator videos, explainers, promos, background replacement, and custom reels." },
    ],
    internalLinks: [toolLink("ai-reel-generator", "AI reel generator"), toolLink("auto-caption-video-generator", "Auto caption video generator"), blogLink("how-to-create-reels-from-audio", "Create reels from audio")],
  }),
  page({
    kind: "useCase",
    basePath: "/use-cases",
    slug: "ai-video-tool-for-coaches",
    title: "AI Video Tool for Coaches and Consultants",
    description: "Create coaching reels, lesson clips, captioned talking videos, and short explainers with Itnavideo.",
    h1: "AI video tool for coaches who want more short-form content",
    eyebrow: "For coaches",
    hero: "Turn coaching ideas, voiceovers, and talking videos into reels that explain, teach, and convert.",
    shortExplanation: "Coaches need clear short videos for trust, education, and lead generation. Itnavideo helps turn real teaching content into polished reels.",
    primaryKeyword: "AI video tool for coaches",
    relatedKeywords: ["AI reel generator", "coach video maker", "AI video generator", "reel maker"],
    dashboardType: "dynamic-creator-reel",
    previewImage: "/preview/Dynamic Creator Reel.png",
    howItWorks: ["Record a quick talking video or voice note.", "Choose Dynamic Creator Reel, Auto Caption, or Auto Draw.", "Generate captions, typography, or notes-style visuals.", "Download and post."],
    benefits: ["Teach without complex editing.", "Repurpose coaching calls or lessons.", "Create authority-building reels.", "Make content easier to watch on mute."],
    useCases: ["Mindset tips", "Business coaching", "Fitness coaching", "Career advice", "Consulting explainers"],
    whyItnavideo: commonWhy,
    faqs: [
      { question: "Can coaches use Itnavideo for talking videos?", answer: "Yes. Dynamic Creator Reel and Auto Caption are strong fits for coaching clips." },
      { question: "Can I create educational note-style reels?", answer: "Yes. Auto Draw Explainer can turn speech into visual notes-style content." },
      { question: "Does it help with lead generation content?", answer: "It helps create clearer, more consistent reels that can support authority and conversion." },
    ],
    internalLinks: [toolLink("dynamic-explainer-video-generator", "Dynamic explainer video generator"), toolLink("auto-draw-explainer-video-generator", "Auto Draw explainer"), audienceLink("ai-video-tool-for-course-creators", "AI video tool for course creators")],
  }),
  page({
    kind: "useCase",
    basePath: "/use-cases",
    slug: "ai-video-tool-for-teachers",
    title: "AI Video Tool for Teachers and Educators",
    description: "Create whiteboard explainers, captioned lesson clips, comparison videos, and study reels with Itnavideo.",
    h1: "AI video tool for teachers making educational reels",
    eyebrow: "For teachers",
    hero: "Turn lessons, voiceovers, and topic explanations into short videos students can watch on mobile.",
    shortExplanation: "Teachers and educators can use Itnavideo as an AI video generator for whiteboard explainers, comparison lessons, captions, and short study content.",
    primaryKeyword: "AI video tool for teachers",
    relatedKeywords: ["whiteboard video maker", "AI video generator", "education reel maker", "explainer video maker"],
    dashboardType: "auto-draw-explainer",
    previewImage: "/preview/Auto Draw Explainer.png",
    howItWorks: ["Upload a lesson voiceover or short teaching video.", "Choose Auto Draw, Compare Explainer, or Auto Caption.", "Generate notes, comparison visuals, or captions.", "Download a 9:16 educational reel."],
    benefits: ["Turn lessons into visual content.", "Support mobile learning.", "Make complex topics easier to understand.", "Create repeatable study content."],
    useCases: ["Whiteboard lessons", "Exam tips", "Concept comparisons", "Study notes", "Course previews"],
    whyItnavideo: commonWhy,
    faqs: [
      { question: "Can teachers create whiteboard videos?", answer: "Yes. Auto Draw Explainer is designed for notes and whiteboard-style educational reels." },
      { question: "Can I compare two concepts?", answer: "Yes. Compare Explainer works well for two-topic educational comparisons." },
      { question: "Is the output mobile-friendly?", answer: "Yes. Current outputs are focused on 9:16 vertical short videos." },
    ],
    internalLinks: [toolLink("auto-draw-explainer-video-generator", "Auto Draw explainer"), toolLink("compare-explainer-video-maker", "Compare explainer"), blogLink("how-to-create-reels-from-audio", "Create reels from audio")],
  }),
  page({
    kind: "useCase",
    basePath: "/use-cases",
    slug: "ai-video-tool-for-businesses",
    title: "AI Video Tool for Small Businesses and Brands",
    description: "Use Itnavideo to create business reels, product explainers, comparison videos, promos, captions, and custom AI reels.",
    h1: "AI video tool for businesses that need more social content",
    eyebrow: "For businesses",
    hero: "Create product explainers, service comparisons, promo videos, and branded short-form content faster.",
    shortExplanation: "Small businesses need social video but often lack editing time. Itnavideo gives teams focused Video Types for product education and content marketing.",
    primaryKeyword: "AI video tool for businesses",
    relatedKeywords: ["AI video generator", "business reel maker", "video generator", "AI shorts generator"],
    dashboardType: "custom-ai-reel",
    previewImage: "/preview/Custom AI Reel.png",
    howItWorks: ["Choose a business use case.", "Upload clips, images, screenshots, voiceover, thumbnail, or prompt.", "Generate a focused business reel.", "Download and publish."],
    benefits: ["Create more product content.", "Explain services visually.", "Make comparison videos for buyer education.", "Repurpose existing assets."],
    useCases: ["Product explainers", "Service promos", "Feature comparisons", "Founder clips", "Offer announcements"],
    whyItnavideo: commonWhy,
    faqs: [
      { question: "Can businesses use Itnavideo for product videos?", answer: "Yes. Custom AI Reel, Compare Explainer, and Long Video Promo can support product and service content." },
      { question: "Can I use screenshots?", answer: "Custom AI Reel supports optional uploaded images and screenshots in its milestone workflow." },
      { question: "Is this faster than editing manually?", answer: "The goal is to reduce manual editing by turning uploads and prompts into structured short videos." },
    ],
    internalLinks: [toolLink("custom-ai-reel-generator", "Custom AI reel generator"), toolLink("compare-explainer-video-maker", "Compare explainer"), audienceLink("ai-video-tool-for-creators", "AI video tool for creators")],
  }),
  page({
    kind: "useCase",
    basePath: "/use-cases",
    slug: "ai-video-tool-for-podcasters",
    title: "AI Video Tool for Podcasters and Interview Clips",
    description: "Create captioned podcast clips, episode teasers, and long video promos for social platforms with Itnavideo.",
    h1: "AI video tool for podcasters creating social clips",
    eyebrow: "For podcasters",
    hero: "Turn podcast clips into captioned reels and vertical promos that help people discover the full episode.",
    shortExplanation: "Podcasters need short clips that work on mute and lead viewers back to the full episode. Itnavideo supports captioning, promo layouts, and creator-style reels.",
    primaryKeyword: "AI video tool for podcasters",
    relatedKeywords: ["podcast clip maker", "auto caption generator", "AI reel generator", "YouTube Shorts generator"],
    dashboardType: "long-video-promo",
    previewImage: "/preview/Long Video Promo.png",
    howItWorks: ["Upload a podcast clip or promo segment.", "Use Auto Caption or Long Video Promo.", "Add captions, thumbnail, or title where needed.", "Download a social-ready clip."],
    benefits: ["Make clips watchable on mute.", "Promote full episodes.", "Create repeatable short-form content.", "Use thumbnails and titles for better context."],
    useCases: ["Podcast teasers", "Interview highlights", "Guest quote clips", "Episode promos", "Educational podcast clips"],
    whyItnavideo: commonWhy,
    faqs: [
      { question: "Can I caption podcast clips?", answer: "Yes. Auto Caption Video is useful for podcast clips with speech." },
      { question: "Can I promote a full episode?", answer: "Yes. Long Video Promo is designed for thumbnail and title-based promos." },
      { question: "Does it export MP4?", answer: "Yes. Itnavideo renders downloadable MP4 output." },
    ],
    internalLinks: [toolLink("long-video-promo-maker", "Long video promo maker"), toolLink("auto-caption-video-generator", "Auto caption video generator"), blogLink("how-to-turn-long-videos-into-short-promos", "Long video promo guide")],
  }),
  page({
    kind: "useCase",
    basePath: "/use-cases",
    slug: "ai-video-tool-for-course-creators",
    title: "AI Video Tool for Course Creators and Online Educators",
    description: "Repurpose course lessons into captioned reels, whiteboard explainers, comparison videos, and promo clips with Itnavideo.",
    h1: "AI video tool for course creators turning lessons into reels",
    eyebrow: "For course creators",
    hero: "Create lesson clips, course promos, and educational reels from existing teaching content.",
    shortExplanation: "Course creators can use Itnavideo to create short videos that promote lessons, explain concepts, and make educational content more discoverable.",
    primaryKeyword: "AI video tool for course creators",
    relatedKeywords: ["course video maker", "AI video generator", "whiteboard video maker", "reel maker"],
    dashboardType: "auto-draw-explainer",
    previewImage: "/preview/Auto Draw Explainer.png",
    howItWorks: ["Select a course lesson or voiceover.", "Choose Auto Draw, Auto Caption, Compare, or Long Video Promo.", "Generate a short visual version.", "Share it on social or landing pages."],
    benefits: ["Repurpose course content.", "Create lead magnets.", "Explain concepts visually.", "Promote modules and webinars."],
    useCases: ["Lesson previews", "Module promos", "Whiteboard summaries", "Course comparison clips", "Student-friendly recaps"],
    whyItnavideo: commonWhy,
    faqs: [
      { question: "Can I use existing lessons?", answer: "Yes. Upload clear clips or voiceovers and choose the Video Type that matches the goal." },
      { question: "Which Video Type is best for teaching?", answer: "Auto Draw Explainer is strong for teaching concepts, while Auto Caption helps with lesson clips." },
      { question: "Can I promote a webinar?", answer: "Yes. Long Video Promo can create a short teaser using a thumbnail, title, and promo clip." },
    ],
    internalLinks: [toolLink("auto-draw-explainer-video-generator", "Auto Draw explainer"), toolLink("long-video-promo-maker", "Long video promo maker"), blogLink("how-to-create-reels-from-audio", "Create reels from audio")],
  }),
];

export const comparisonSeoPages: SeoContentPage[] = [
  page({
    kind: "comparison",
    basePath: "/compare",
    slug: "best-ai-video-tools-for-reels",
    title: "Best AI Video Tools for Reels: What Creators Should Compare",
    description: "Compare AI video tools for reels, captions, Shorts, explainers, promos, and creator workflows, and see where Itnavideo fits.",
    h1: "Best AI video tools for reels: what matters before you choose",
    eyebrow: "AI video tool comparison",
    hero: "The best AI video tool is not just the one with the most effects. It should help you create watchable, clear, mobile-first reels from real content.",
    shortExplanation: "This comparison page targets AI video generator, AI reel generator, AI shorts generator, and reel maker searches while helping creators choose based on real workflow needs.",
    primaryKeyword: "best AI video tools for reels",
    relatedKeywords: ["AI video generator", "AI reel generator", "AI shorts generator", "reel maker"],
    dashboardType: "dynamic-creator-reel",
    previewImage: "/preview/Dynamic Creator Reel.png",
    howItWorks: ["Start with your content type.", "Check if the tool handles captions and timing.", "Compare how much manual editing is still required.", "Choose the workflow that gets you to a ready MP4 fastest."],
    benefits: ["Avoid choosing based only on flashy demos.", "Match the tool to your actual content workflow.", "Prioritize captions, mobile output, and repeatable formats.", "Understand where Itnavideo fits against broad editors."],
    useCases: ["Creator reels", "Captioned videos", "Education content", "Promo clips", "Business videos"],
    whyItnavideo: commonWhy,
    faqs: [
      { question: "What should I look for in an AI video tool?", answer: "Look for accurate captions, mobile-first output, useful Video Types, export quality, and a workflow that saves real editing time." },
      { question: "Is Itnavideo a broad video editor?", answer: "No. Itnavideo focuses on upload-to-render Video Types instead of manual timeline editing." },
      { question: "Can one tool handle every video format?", answer: "Usually not well. It is better to choose a tool that fits your repeated content workflow." },
    ],
    internalLinks: [toolLink("ai-reel-generator", "AI reel generator"), toolLink("auto-caption-video-generator", "Auto caption generator"), compareLink("best-auto-caption-tools", "Best auto caption tools")],
  }),
  page({
    kind: "comparison",
    basePath: "/compare",
    slug: "best-auto-caption-tools",
    title: "Best Auto Caption Tools for Reels and Shorts",
    description: "Compare auto caption tools for reels, Shorts, podcasts, lessons, and creator videos, including what to look for before choosing one.",
    h1: "Best auto caption tools for short-form creators",
    eyebrow: "Auto caption comparison",
    hero: "Auto captions are not only about transcription. The best tools also handle style, safe-area placement, readability, and final MP4 export.",
    shortExplanation: "This comparison page targets auto caption generator, video caption generator, AI subtitle generator, and auto caption tools searches.",
    primaryKeyword: "best auto caption tools",
    relatedKeywords: ["auto caption generator", "video caption generator", "AI subtitle generator", "caption reels"],
    dashboardType: "auto-caption-video",
    previewImage: "/preview/Auto Caption Reel.png",
    howItWorks: ["Upload a short speaking video.", "Transcription creates word timings.", "The tool groups captions into readable chunks.", "Styles and safe-area placement make the final video social-ready."],
    benefits: ["Save manual caption timing.", "Improve mute viewing.", "Create more accessible videos.", "Make captions look intentional rather than pasted on."],
    useCases: ["Talking reels", "Podcast clips", "YouTube Shorts", "Course clips", "Business videos"],
    whyItnavideo: commonWhy,
    faqs: [
      { question: "What makes an auto caption tool good?", answer: "Good auto caption tools need accurate transcription, readable chunking, caption styles, safe placement, and reliable export." },
      { question: "Does Itnavideo focus on captions?", answer: "Yes. Auto Caption Video is a dedicated Video Type for captioning existing videos." },
      { question: "Can captions help SEO?", answer: "Captions can improve engagement and watchability. Search visibility still depends on page content, titles, metadata, and distribution." },
    ],
    internalLinks: [toolLink("auto-caption-video-generator", "Auto caption video generator"), blogLink("how-to-add-captions-to-instagram-reels", "Instagram Reels captions"), blogLink("how-to-add-captions-to-youtube-shorts", "YouTube Shorts captions")],
  }),
];

export const seoContentPages = [...toolSeoPages, ...useCaseSeoPages, ...comparisonSeoPages];

export function getSeoContentPage(kind: SeoPageKind, slug: string) {
  return seoContentPages.find((page) => page.kind === kind && page.slug === slug);
}

export function getSeoPagesByKind(kind: SeoPageKind) {
  return seoContentPages.filter((page) => page.kind === kind);
}
