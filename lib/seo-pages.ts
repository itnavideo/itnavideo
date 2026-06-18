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
  }
];

export const seoLandingSlugs = seoLandingPages.map((page) => page.slug);

export function getSeoLandingPage(slug: string) {
  return seoLandingPages.find((page) => page.slug === slug);
}

