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

export const seoLandingPages: SeoLandingPage[] = [
  {
    slug: "ai-explainer-video-generator",
    title: "AI Explainer Video Generator for Reels | Itnavideo",
    description:
      "Create short explainer videos from audio or video. Itnavideo turns real speech into vertical reels with creator video, subtitles, title, and supporting visuals.",
    h1: "AI explainer video generator for short reels",
    eyebrow: "Explainer video maker",
    primaryKeyword: "AI explainer video generator",
    audience: "creators, educators, coaches, finance pages, and career content creators",
    useCases: [
      "Turn a talking-head video into a short explainer reel",
      "Create educational reels from voice notes or screen recordings",
      "Add transcript-based subtitles and a clear topic title",
      "Use one support image to explain the idea visually"
    ],
    benefits: [
      "Simple creator-video layout",
      "Real transcript subtitles",
      "Vertical MP4 for Reels and Shorts",
      "Good for finance, career, education, and tutorial content"
    ],
    faqs: [
      {
        question: "What is an AI explainer video generator?",
        answer:
          "It is a tool that turns spoken content into a short explainer video with subtitles, title text, and supporting visuals."
      },
      {
        question: "Can I create reels from my own video?",
        answer:
          "Yes. Upload a video or audio file, add a title, and use a supporting image for the explanation section."
      },
      {
        question: "Is this for long videos?",
        answer:
          "Itnavideo is focused on short vertical videos for Reels, Shorts, and social content."
      }
    ]
  },
  {
    slug: "audio-to-reels",
    title: "Audio to Reels Generator | Turn Voice Into Short Videos",
    description:
      "Upload audio or voiceover and create short vertical reels with subtitles, title, and explainer visuals using Itnavideo.",
    h1: "Audio to reels generator for creators",
    eyebrow: "Audio to video reels",
    primaryKeyword: "audio to reels generator",
    audience: "voiceover creators, educators, course sellers, and social media creators",
    useCases: [
      "Turn a voiceover into a vertical reel",
      "Convert short audio lessons into explainer videos",
      "Create subtitle-based reels from spoken content",
      "Make mobile-first videos without editing manually"
    ],
    benefits: [
      "Upload audio directly",
      "Transcript-based subtitle timing",
      "Explainer-first video layout",
      "Ready for Instagram Reels, YouTube Shorts, and TikTok"
    ],
    faqs: [
      {
        question: "Can I make a reel from only audio?",
        answer:
          "Yes. You can upload clear speech audio and create a subtitle-based explainer reel."
      },
      {
        question: "Does the tool add subtitles?",
        answer:
          "Yes. Speech-based templates use the real transcript for subtitles."
      },
      {
        question: "Who is this useful for?",
        answer:
          "It is useful for educators, coaches, creators, and anyone who records voice notes or lessons."
      }
    ]
  },
  {
    slug: "finance-reel-generator",
    title: "Finance Reel Generator for Explainer Videos | Itnavideo",
    description:
      "Create finance explainer reels from audio or video. Add subtitles, topic title, and supporting images for financial education content.",
    h1: "Finance reel generator for educational explainers",
    eyebrow: "Finance content reels",
    primaryKeyword: "finance reel generator",
    audience: "finance educators, banking pages, career creators, exam channels, and money-content creators",
    useCases: [
      "Explain banking topics in short reels",
      "Create RBI, loan, salary, career, or investment explainers",
      "Turn finance voiceovers into visual reels",
      "Use a supporting finance image in the bottom explanation section"
    ],
    benefits: [
      "Built for educational short-form content",
      "Clean creator video plus subtitle layout",
      "Good for finance and career topics",
      "Vertical export for mobile platforms"
    ],
    faqs: [
      {
        question: "Can I use Itnavideo for finance education reels?",
        answer:
          "Yes. The Video Explainer layout works well for finance, banking, career, and exam explanation content."
      },
      {
        question: "Can I add my own finance image?",
        answer:
          "Yes. The Video Explainer flow supports a bottom explanation image."
      },
      {
        question: "Is this better than random AI visuals?",
        answer:
          "For finance education, a clear uploaded support image is often better than random visuals because it keeps the message focused."
      }
    ]
  },
  {
    slug: "hinglish-explainer-video-maker",
    title: "Hinglish Explainer Video Maker for Reels | Itnavideo",
    description:
      "Create Hinglish explainer reels from speech. Itnavideo helps creators turn audio or video into subtitle-based short videos.",
    h1: "Hinglish explainer video maker for reels",
    eyebrow: "Hinglish creator videos",
    primaryKeyword: "Hinglish explainer video maker",
    audience: "Indian creators, educators, finance pages, coaching pages, and career channels",
    useCases: [
      "Create Hinglish reels from voiceover",
      "Explain career or finance topics in a simple reel format",
      "Turn educational speech into subtitle-based videos",
      "Make mobile-first videos for Indian audiences"
    ],
    benefits: [
      "Good for English and Roman Hinglish content",
      "Simple explainer layout",
      "Subtitle-focused output",
      "Useful for education, finance, and creator content"
    ],
    faqs: [
      {
        question: "Can I create Hinglish explainer videos?",
        answer:
          "Yes. Itnavideo is designed for clear English and Roman Hinglish subtitle-style creator content."
      },
      {
        question: "Does it create Hindi Devanagari subtitles?",
        answer:
          "The recommended style for this workflow is English or Roman Hinglish for readability in short videos."
      },
      {
        question: "Is it useful for Indian creators?",
        answer:
          "Yes. It is useful for Indian creators making finance, career, education, and explainer reels."
      }
    ]
  },
  {
    slug: "faceless-explainer-video-maker",
    title: "Faceless Explainer Video Maker for Reels | Itnavideo",
    description:
      "Create faceless explainer reels from audio. Use subtitles, title, and supporting visuals for educational short videos.",
    h1: "Faceless explainer video maker for short reels",
    eyebrow: "Faceless reels",
    primaryKeyword: "faceless explainer video maker",
    audience: "faceless creators, educators, niche pages, and social media publishers",
    useCases: [
      "Create reels from voiceover without showing your face",
      "Use support images for educational explanation",
      "Make finance, career, or tutorial videos",
      "Repurpose audio into vertical short videos"
    ],
    benefits: [
      "No need to record facecam",
      "Subtitle-driven explainer output",
      "Simple vertical format",
      "Good for niche educational content"
    ],
    faqs: [
      {
        question: "Can I make faceless videos with Itnavideo?",
        answer:
          "Yes. You can use audio and supporting visuals to create a faceless explainer reel."
      },
      {
        question: "What should I upload?",
        answer:
          "Upload clear speech audio and a relevant supporting image for the explanation section."
      },
      {
        question: "Can I use this for YouTube Shorts?",
        answer:
          "Yes. The output is designed for short vertical video platforms."
      }
    ]
  },
  {
    slug: "video-to-reel-maker",
    title: "Video to Reel Maker | Turn Videos Into Explainer Reels",
    description:
      "Turn a video into a short vertical explainer reel with creator frame, subtitles, title, and supporting image using Itnavideo.",
    h1: "Video to reel maker for explainer content",
    eyebrow: "Video to reels",
    primaryKeyword: "video to reel maker",
    audience: "creators, teachers, coaches, marketers, and short-form video makers",
    useCases: [
      "Repurpose talking-head videos into reels",
      "Create vertical explainers from source video",
      "Add subtitles and a title automatically",
      "Use a bottom visual to support the explanation"
    ],
    benefits: [
      "Keeps original video visible",
      "Creates mobile-first vertical layout",
      "Simple explainer format",
      "Useful for Reels, Shorts, and TikTok"
    ],
    faqs: [
      {
        question: "Can I turn my video into a reel?",
        answer:
          "Yes. Upload a video with clear speech and Itnavideo can create a short vertical explainer reel."
      },
      {
        question: "Does the original video stay visible?",
        answer:
          "Yes. The Video Explainer template keeps the creator video visible in the top frame."
      },
      {
        question: "Can I add a supporting image?",
        answer:
          "Yes. You can add one bottom explanation image for visual support."
      }
    ]
  },
  {
    slug: "compare-explainer-video-maker",
    title: "Compare Explainer Video Maker for Reels | Itnavideo",
    description:
      "Create comparison explainer reels with title, two visual panels, subtitles, and a teacher-style explanation layout using Itnavideo.",
    h1: "Compare explainer video maker for reels",
    eyebrow: "Compare video template",
    primaryKeyword: "compare explainer video maker",
    audience: "educators, SaaS creators, finance pages, product explainers, and comparison content creators",
    useCases: [
      "Compare website vs web app in a short reel",
      "Explain two products, plans, tools, or options visually",
      "Create educational comparison reels with subtitles",
      "Use a teacher-style visual to make the comparison easier to understand"
    ],
    benefits: [
      "Clear two-panel compare layout",
      "Title, subtitle, and visual sections stay separated",
      "Good for product, education, finance, and SaaS comparisons",
      "Vertical format for Reels, Shorts, and TikTok"
    ],
    faqs: [
      {
        question: "What is a compare explainer video maker?",
        answer:
          "It is a tool for creating short comparison videos with two visual sides, subtitles, a title, and an explanation style."
      },
      {
        question: "Can I compare two images?",
        answer:
          "Yes. A compare template can show two images or concepts side by side with labels and subtitles."
      },
      {
        question: "What kind of content works well?",
        answer:
          "Website vs web app, product comparisons, plan comparisons, finance comparisons, and educational explainers work well."
      }
    ]
  },
  {
    slug: "ai-reel-generator",
    title: "AI Reel Generator — Create Reels from Video or Audio | Itnavideo",
    description: "Upload video or audio and get a ready-to-post 9:16 reel with captions, title, and professional layout. No editing skills needed.",
    h1: "AI reel generator for Instagram and YouTube Shorts",
    eyebrow: "AI Reel Generator",
    primaryKeyword: "ai reel generator",
    audience: "content creators, educators, coaches, and social media marketers",
    useCases: [
      "Turn a talking-head video into a captioned reel in minutes",
      "Convert podcast clips into short vertical videos",
      "Create educational explainer reels from voiceover",
      "Add styled subtitles to any video automatically"
    ],
    benefits: [
      "Upload once, get a finished reel",
      "5 templates for different content styles",
      "Real speech-based subtitles with word timing",
      "Export 1080x1920 MP4 for Reels, Shorts, TikTok"
    ],
    faqs: [
      { question: "How does the AI reel generator work?", answer: "Upload your video or audio. The AI transcribes speech, generates timed subtitles, and renders a professional 9:16 reel with your chosen template style." },
      { question: "What formats can I upload?", answer: "MP4, MOV, M4V video files and MP3, WAV, M4A audio files. Maximum 60 seconds per reel." },
      { question: "Do I need editing experience?", answer: "No. Choose a template, upload your file, and the AI handles layout, subtitles, and timing automatically." },
      { question: "Can I customize the subtitle style?", answer: "Yes. Choose from Yellow Pop, Clean White, or Black Box styles with custom colors and position." }
    ]
  },
  {
    slug: "instagram-reels-maker",
    title: "Instagram Reels Maker — AI-Powered Reel Creator | Itnavideo",
    description: "Create Instagram Reels from video or audio with AI subtitles, templates, and professional layouts. No editing app needed.",
    h1: "Instagram Reels maker with AI subtitles",
    eyebrow: "Instagram Reels",
    primaryKeyword: "instagram reels maker",
    audience: "Instagram creators, influencers, brand pages, and small business owners",
    useCases: [
      "Post daily reels without spending hours editing",
      "Add trending subtitle styles to your videos",
      "Create educational content reels with explainer layouts",
      "Repurpose long videos into short Instagram Reels"
    ],
    benefits: [
      "9:16 vertical format ready for Instagram",
      "AI generates captions from real speech",
      "Multiple template styles to match your brand",
      "Download MP4 and post directly to Instagram"
    ],
    faqs: [
      { question: "Can I create Instagram Reels with this tool?", answer: "Yes. Itnavideo creates 1080x1920 vertical MP4 videos ready to upload directly to Instagram Reels." },
      { question: "Does it add captions automatically?", answer: "Yes. The AI transcribes your speech and adds word-timed subtitles in your chosen style and language." },
      { question: "How long can my reel be?", answer: "Up to 60 seconds. Upload any length video and the AI uses the best 60-second speech window." }
    ]
  },
  {
    slug: "youtube-shorts-generator",
    title: "YouTube Shorts Generator — AI Video to Shorts Converter | Itnavideo",
    description: "Convert videos into YouTube Shorts with AI captions, explainer layouts, and professional templates. Upload and download in minutes.",
    h1: "YouTube Shorts generator with AI captions",
    eyebrow: "YouTube Shorts",
    primaryKeyword: "youtube shorts generator",
    audience: "YouTubers, educators, podcast creators, and content repurposing teams",
    useCases: [
      "Turn long YouTube videos into short clips with captions",
      "Create Shorts from podcast audio clips",
      "Make educational explainer Shorts with visuals",
      "Add subtitles to existing video clips for Shorts"
    ],
    benefits: [
      "Vertical 9:16 format for YouTube Shorts",
      "AI transcription with accurate word timing",
      "Professional templates without editing",
      "Download and upload directly to YouTube"
    ],
    faqs: [
      { question: "Can I make YouTube Shorts with Itnavideo?", answer: "Yes. Upload a video or audio clip, choose a template, and get a 9:16 MP4 ready for YouTube Shorts." },
      { question: "What is the maximum length?", answer: "YouTube Shorts supports up to 60 seconds. Itnavideo creates reels up to 60 seconds from your content." },
      { question: "Does it work for educational content?", answer: "Yes. The Video Explainer and Auto Draw templates are built specifically for educational and explainer content." }
    ]
  },
  {
    slug: "ai-subtitle-generator",
    title: "AI Subtitle Generator for Reels — Auto Captions | Itnavideo",
    description: "Generate accurate subtitles for short videos automatically. AI transcribes speech and adds styled captions synced to your video.",
    h1: "AI subtitle generator for short-form video",
    eyebrow: "Auto Subtitles",
    primaryKeyword: "ai subtitle generator for reels",
    audience: "video creators, social media managers, podcast editors, and content teams",
    useCases: [
      "Add accurate subtitles to reels without manual typing",
      "Generate captions in multiple languages including Hindi and Kannada",
      "Style subtitles with colors, positions, and highlight effects",
      "Sync captions perfectly with speech timing"
    ],
    benefits: [
      "Word-level timing accuracy from AI transcription",
      "13 languages supported including Hindi, Tamil, Spanish",
      "3 caption styles with custom colors",
      "Position captions at top, center, or bottom"
    ],
    faqs: [
      { question: "How accurate are the AI subtitles?", answer: "Very accurate. Itnavideo uses Groq Whisper for transcription with word-level timing and domain-specific corrections." },
      { question: "Can I get subtitles in Hindi or other languages?", answer: "Yes. Supported languages include Hindi, Kannada, Tamil, Urdu, Spanish, French, German, Arabic, and more." },
      { question: "Can I customize how subtitles look?", answer: "Yes. Choose Yellow Pop, Clean White, or Black Box style. Pick text color, highlight color, and position." }
    ]
  },
  {
    slug: "ai-shorts-generator",
    title: "AI Shorts Generator — Video to Shorts with Captions | Itnavideo",
    description: "Create vertical short videos with AI captions and professional templates. Turn any video or audio into ready-to-post Shorts.",
    h1: "AI Shorts generator for creators",
    eyebrow: "AI Shorts",
    primaryKeyword: "ai shorts generator",
    audience: "creators, marketers, educators, and social media teams",
    useCases: [
      "Create short videos from existing content without editing",
      "Add captions to talking-head clips for better engagement",
      "Make explainer shorts from voiceover recordings",
      "Create professional shorts for multiple platforms at once"
    ],
    benefits: [
      "Works with video, audio, or images",
      "AI handles transcription and timing",
      "5 professional templates included",
      "One upload works for Instagram, YouTube, and TikTok"
    ],
    faqs: [
      { question: "What makes this different from other AI video tools?", answer: "Itnavideo is built specifically for short-form vertical videos. Templates are designed for 9:16 with proper safe zones." },
      { question: "Can I use it for TikTok?", answer: "Yes. The output is standard 1080x1920 MP4 which works on TikTok, Instagram Reels, YouTube Shorts, and any platform." },
      { question: "How fast is it?", answer: "Most reels are ready in 1-3 minutes after upload. The AI transcribes, plans, and renders in the cloud." }
    ]
  },
  {
    slug: "add-subtitles-to-video",
    title: "Add Subtitles to Video Online — AI Caption Generator | Itnavideo",
    description: "Add subtitles to any video automatically with AI. Upload your video, get word-timed captions in your chosen language and style.",
    h1: "Add subtitles to video online with AI",
    eyebrow: "Add Subtitles",
    primaryKeyword: "add subtitles to video online",
    audience: "video editors, content creators, social media managers, and accessibility teams",
    useCases: [
      "Add subtitles to Instagram Reels and YouTube Shorts",
      "Generate multilingual captions for global audiences",
      "Improve video accessibility with accurate captions",
      "Style subtitles to match your brand colors"
    ],
    benefits: [
      "No manual typing — AI generates from speech",
      "Accurate word-level timing",
      "Multiple languages and styles",
      "Burned-in captions in final MP4"
    ],
    faqs: [
      { question: "How do I add subtitles to my video?", answer: "Upload your video, select Auto Caption template, choose language and style, click Create. AI adds captions automatically." },
      { question: "Are subtitles burned into the video?", answer: "Yes. Subtitles are rendered directly into the MP4 so they display on any platform without SRT files." },
      { question: "What languages are supported?", answer: "English, Hinglish, Hindi, Kannada, Tamil, Urdu, Spanish, French, German, Portuguese, Arabic, Indonesian, and Farsi." }
    ]
  },
  {
    slug: "auto-caption-video-generator",
    title: "Auto Caption Video Generator — AI Subtitles for Reels | Itnavideo",
    description: "Add auto captions to any video. Upload your reel and get styled subtitles generated from speech. No manual typing needed.",
    h1: "Auto caption video generator for social media",
    eyebrow: "Auto Captions",
    primaryKeyword: "auto caption video generator",
    audience: "social media creators, influencers, brands, and content teams",
    useCases: [
      "Add captions to Instagram Reels automatically",
      "Create subtitled TikTok videos from raw footage",
      "Improve video engagement with readable captions",
      "Generate multilingual subtitles for global reach"
    ],
    benefits: [
      "AI transcribes speech with word-level accuracy",
      "Choose from multiple caption styles and colors",
      "Captions are burned into the video file",
      "Supports 13 languages including Hindi and Spanish"
    ],
    faqs: [
      { question: "How do auto captions work?", answer: "Upload your video. AI transcribes speech, generates word-timed captions, and renders them onto your video in your chosen style." },
      { question: "Is this better than Instagram's built-in captions?", answer: "Yes. More style control, better accuracy for non-English speech, language translation, and permanent captions in your video." },
      { question: "Can I choose the caption style?", answer: "Yes. Pick Yellow Pop, Clean White, or Black Box. Customize text color, highlight color, and position." }
    ]
  },
  {
    slug: "whiteboard-video-maker",
    title: "Whiteboard Video Maker — AI Draws Your Explanation | Itnavideo",
    description: "Create whiteboard-style explainer videos from audio. AI generates drawn scenes with titles, bullet points, and highlights.",
    h1: "Whiteboard video maker powered by AI",
    eyebrow: "Whiteboard Videos",
    primaryKeyword: "whiteboard video maker",
    audience: "educators, course creators, corporate trainers, and marketing teams",
    useCases: [
      "Create whiteboard explainer reels from voiceover",
      "Make educational content without drawing skills",
      "Turn bullet points into animated whiteboard scenes",
      "Create training content in a clean, focused format"
    ],
    benefits: [
      "No drawing or animation skills needed",
      "Clean whiteboard aesthetic with numbered scenes",
      "Spring physics animations for professional feel",
      "Perfect for educational and corporate content"
    ],
    faqs: [
      { question: "Do I need to draw anything?", answer: "No. Upload your voiceover and AI generates whiteboard-style scenes with titles, bullet points, checkmarks, and highlight boxes." },
      { question: "What does the output look like?", answer: "Clean white background with numbered circles, bold titles, checkmark bullets, and highlight boxes with spring animations." },
      { question: "Can I use this for course content?", answer: "Yes. The Auto Draw template is built for educational explainers, course previews, and topic breakdowns." }
    ]
  }
];

export const seoLandingSlugs = seoLandingPages.map((page) => page.slug);

export function getSeoLandingPage(slug: string) {
  return seoLandingPages.find((page) => page.slug === slug);
}

