# ItnaVideo — Complete Project Summary

*Last updated: July 2026*

---

## 1. Project Overview

### What is ItnaVideo?

ItnaVideo is an AI-powered short video creation platform. Users upload their content (video, audio, images, or text prompts) and the platform generates polished, ready-to-post 9:16 vertical videos — styled with captions, motion graphics, layouts, and professional formatting.

It is NOT a video editor. There is no timeline, no manual cuts, no drag-and-drop layers. The AI handles structure, timing, captions, and visual layout automatically.

### What problem does it solve?

Creating professional short-form video content is time-consuming. Creators, educators, businesses, and marketers need to:
- Record content
- Edit manually in CapCut/Premiere/Final Cut
- Add captions by hand
- Design thumbnails
- Format for each platform

ItnaVideo removes 80% of this work. Upload once → get a finished video back.

### Target audience

- **Content creators** — Instagram, YouTube Shorts, TikTok
- **Educators** — teachers, course sellers, tutors
- **Finance creators** — banking, investment, insurance explainers
- **Small businesses** — product videos, promos
- **Coaches** — fitness, life, business coaching
- **Marketers** — social media managers, agencies
- **Indian creators** — Hindi/Hinglish speaking audience

### What makes it different?

| Traditional editors | ItnaVideo |
|---|---|
| Manual timeline editing | No timeline at all |
| User creates layout | AI creates layout |
| User adds captions manually | AI generates word-level captions |
| Hours of work per video | Minutes per video |
| Requires editing skills | Zero skills needed |
| Free but time-expensive | Paid but time-saving |

---

## 2. Vision

### Long-term direction

ItnaVideo aims to become the **AI-first video creation platform** where:

- Any idea can become a professional video in minutes
- Multiple distinct "Video Types" serve different content needs
- The platform scales from 4 types today to 50+ specialized types
- Quality is premium — output should feel like a professional editor made it
- The AI does the work, not the user
- Every video type has a clear input → output promise

### Product principles

- **Premium quality over quantity** — fewer features, each one polished
- **AI-first** — the system makes creative decisions, user just provides content
- **Fast** — upload to export in 3-5 minutes
- **Clean** — no cluttered UI, no confusing options
- **Easy for beginners** — no prior editing experience needed
- **Professional enough for businesses** — output is commercial-grade
- **Honest pricing** — credits only used on final render, not on experimentation

---

## 3. Current Video Types (Live)

### 1. Auto Caption Video
- **Purpose:** Add professional styled captions to talking videos
- **Input:** Video with speech (MP4/MOV)
- **Output:** Same video with burned-in word-level captions, 9:16 MP4
- **Styles:** 30 caption styles (Karaoke Fill, Bold Fire, Studio Clean, Metallic Gradient, Glass Blur, Neon Pulse, etc.)
- **Target users:** All creators who post talking-head content
- **Most used video type** — captions are the universal need

### 2. Custom AI Reel
- **Purpose:** User describes their video in plain English, optionally uploads media (images, video clips, audio, logo), and AI builds a custom reel
- **Input:** Text prompt + optional images/video/audio/logo
- **Output:** Custom timeline with text scenes, media scenes, logo end screen
- **Target users:** Creators who want full control over structure but don't want to edit
- **Most flexible video type**

### 3. Compare Explainer Video
- **Purpose:** Side-by-side comparison videos with a sticker character presenter
- **Input:** Audio voiceover + 2 comparison images
- **Output:** Left vs right comparison layout with captions, animated character, title overlay
- **Target users:** Educators, finance creators, product reviewers, career coaches
- **Character system:** 16 premium sticker packs with 6-10 poses each, intent-based pose switching synced to transcript

### 4. Long Video Promo
- **Purpose:** Create a vertical promo reel for a long YouTube video/podcast/course
- **Input:** Promo clip (10-60s) + thumbnail image + title
- **Output:** Thumbnail-led vertical promo with title overlay and clip playing
- **Target users:** YouTubers, podcasters, course creators, religious content creators

---

## 4. Planned / Future Video Types

### Near-term (building confidence in AI quality first)

- **AI Presenter Explainer** — animated character explains a topic with AI-planned scenes (evolution of Auto Draw concept)
- **Product Showcase Reel** — e-commerce product photos → polished product video
- **Testimonial Video** — text review + customer photo → video testimonial
- **News Reel** — trending topic + text → news-style short video

### Medium-term

- **Jewellery Video** — product images → luxury-style jewellery showcase
- **English Learning Video** — vocabulary/grammar → educational animation
- **Event Invite Reel** — event details → stylish invitation video
- **Job Posting Reel** — job description → hiring video
- **Before/After Reel** — two images → transformation video

### Long-term vision

- **Long-form video** (2-5 minute explainers)
- **AI avatar/presenter** with lip sync
- **Batch video generation** (100+ videos from a spreadsheet)
- **Multi-language** subtitles
- **Brand kit** (colors, fonts, logos saved per account)
- **API access** for agencies and automation tools

---

## 5. AI Workflow

```
User action                    System response
─────────────────────────────────────────────────
Choose a Video Type     →     Dashboard shows relevant upload fields
Upload content          →     Files uploaded to S3 (temporary, 48h)
Click "Create Reel"     →     System starts processing:
                              1. Transcription (Groq Whisper)
                              2. AI Planning (timeline, scenes)
                              3. Render (Remotion Lambda)
                              4. Export (1080x1920 MP4)
Download video          →     Ready to post on any platform
```

### Technical pipeline

- **Transcription:** Groq Whisper (free tier, English + Hinglish)
- **AI Planning:** Gemini 2.0 Flash (free) for scene planning, local deterministic planners for most types
- **Rendering:** Remotion on AWS Lambda (serverless, scales to zero)
- **Storage:** AWS S3 (temporary, auto-deletes after 48 hours)
- **Frontend:** Next.js on Vercel
- **Auth:** Supabase
- **Payments:** Razorpay (Indian payments)

### What AI decides automatically

- Caption timing (word-level from Groq)
- Caption style application
- Scene structure (for Compare, Custom AI)
- Character pose selection (for Compare)
- Music selection (optional, when enabled)
- Layout and spacing
- Safe zones for platform UI

---

## 6. Product Philosophy

### Design principles

| Principle | What it means |
|---|---|
| Fast | Upload to export in 3-5 minutes |
| Clean | Dark premium UI, minimal options, no clutter |
| Premium | Output should feel like a professional made it |
| Minimal | Show only what the user needs for their chosen Video Type |
| Beginner-friendly | Zero prior experience required |
| Professional output | Businesses can use these videos commercially |
| AI does the work | User provides content, AI makes all creative decisions |
| Honest | Credits only charged on successful final renders |
| Focused | Better to have 4 great Video Types than 20 average ones |

### Business model

- Free: one watermarked Auto Caption Video up to 60 seconds after signup
- Paid: 20 credits valid for 31 days, ₹499 in India and $19 internationally
- Credit cost varies by video type and is shown before render
- Long-form Captioned Video uses 1 credit per started minute; Long Video Clips use 3–12 credits
- Failed system renders release their reserved credits

---

## 7. Current Homepage

### Sections (top to bottom)

1. **Hero** — Headline + sub-headline + CTA + free credit badge + 7 video type preview cards
2. **How It Works** — 4-step flow (choose type → upload → AI processes → download)
3. **Auto Caption Before/After** — 3 real video comparisons (raw vs captioned)
4. **Long Video Promo Before/After** — link share vs promo reel comparison
5. **Use Case Gallery** — showing different Video Types with descriptions
6. **Features** — 8 feature cards (transcript timing, platform exports, etc.)
7. **Creator Rewards** — referral/promotion section
8. **FAQ** — common questions
9. **Search Intent** — SEO-focused links

### What works well

- Dark premium aesthetic is consistent
- Video type cards in the hero give immediate product understanding
- Before/After videos are convincing (when they load properly)
- Free credit messaging is clear
- CTA buttons are visible

### What feels weak

- **Hero headline** ("Create reels people can judge by watching, not reading") — unclear value prop, doesn't immediately communicate what the product does
- **Too many sections** — page is long, main message gets diluted
- **No pricing visibility** — user has to leave to see pricing
- **No social proof** — no testimonials, no user count, no logos, no "as seen in"
- **Video type cards are small** — hard to understand what each one does
- **Before/After videos don't autoplay** — user may not interact with them
- **No demo video** — seeing the product in action would be more convincing than static screenshots
- **Mobile experience** — cards and videos are cramped on phone

---

## 8. Conversion Problems

### Why visitors may not convert

| Problem | Impact |
|---|---|
| Unclear value proposition in the first 3 seconds | High — users leave before scrolling |
| No social proof (0 testimonials, 0 user count) | High — no trust signals |
| No product demo (video showing the actual flow) | High — users don't understand what they'll get |
| Hero focuses on "reels" — feels like another editor | Medium — doesn't differentiate from CapCut |
| Pricing not visible on homepage | Medium — users assume expensive |
| Too many concepts at once (7 video types on first screen) | Medium — overwhelms first-time visitors |
| No urgency or scarcity | Low — no reason to act now |
| Free credit offer gets lost in busy hero | Medium — strongest conversion tool is not prominent enough |

### Biggest conversion blockers (priority order)

1. **"What does this actually do?"** — first 5 seconds don't answer this clearly
2. **"Can I trust this?"** — zero social proof
3. **"Show me the output"** — no product demo video
4. **"What will it cost?"** — pricing hidden on separate page
5. **"Is it easy?"** — the 4-step flow helps but could be more visual

---

## 9. Homepage Improvement Ideas

### A. Hero redesign

**Current:** Abstract headline + crowded cards
**Better:** Single powerful sentence + ONE clear demo video + CTA

Example:
> **Upload your video. Get captions + layout back in 2 minutes.**
> No editing skills. No timeline. Just your content, styled by AI.
> [Create My Free Video →]

Show a 15-second looping demo of: raw talking video → click → captioned output.

### B. Social proof section (add immediately)

Even with 1 user, show:
- "1000+ videos generated" (count renders)
- "Used by creators in India, USA, and 12 countries" (use Supabase geo data)
- Founder quote with photo
- "Built by ex-YC applicant" badge (if applicable)
- Show the rendered output quality (not UI screenshots)

### C. Simplified video type showcase

Instead of 7 tiny cards, show 3-4 large comparison demos:
- Auto Caption: before/after video (already built)
- Compare Explainer: animated character explaining
- Long Video Promo: plain link vs promo reel

Each one = full-width card with playing video, not a thumbnail.

### D. Pricing on homepage

Add a simple pricing card or summary:
> Free: one watermarked Auto Caption Video up to 60 seconds
> Paid: 20 credits / ₹499 in India or $19 internationally (valid 31 days)
> [See credit rates →]

### E. Product demo video (30 seconds)

Record a screen capture showing:
1. Dashboard opens
2. Select Auto Caption
3. Upload video
4. Click render
5. Download captioned video

This is the single highest-impact change for conversion.

### F. Mobile-first layout

- Stack everything single-column
- Make CTAs full-width
- Make before/after videos larger
- Reduce section padding

### G. Trust badges

- "Made with Remotion" (video tech credibility)
- "Powered by Groq Whisper" (AI credibility)
- "Hosted on Vercel + AWS" (reliability)
- "YC-quality product" (if applicable)
- "No watermark on exports"

---

## 10. Key Documentation References

### Files that define the product

| File | Purpose |
|---|---|
| `docs/ITNAVIDEO_PROJECT_CONTEXT.md` | Master product context |
| `AGENTS.md` | Rules for code agents |
| `.kiro/steering/subtitles-language-rule.md` | Caption language policy |
| `services/ai/reelPlanner.ts` | Template registry + planning engine |
| `app/dashboard/page.tsx` | Dashboard UI + all modes |
| `app/api/reels/jobs/route.ts` | Render pipeline |
| `remotion/templates/` | All video type render code |
| `lib/blogPosts.ts` | Blog content (SEO) |
| `lib/seo-pages.ts` | SEO landing pages |
| `public/assets/stickman/` | Character sticker packs |

### Key technical decisions

- **No paid translation APIs** — only English + Hinglish via Groq
- **No stock assets** — all visuals come from user uploads or minimal generative
- **Temporary storage** — rendered videos expire after 48 hours
- **Credits-only pricing** — no subscription tiers lock features
- **Provider-neutral** — AI services can be swapped (Groq → OpenAI, Gemini → Claude)
- **Lambda rendering** — serverless, scales to zero, no fixed server costs

### Current metrics

- Users: 1 (founder only)
- Google indexed pages: 1 (homepage only)
- Monthly traffic: 0
- Renders completed: testing only
- Revenue: ₹0 (pre-launch)

---

## Summary

ItnaVideo is a pre-launch AI video platform with 4 working video types, a complete render pipeline, 30 caption styles, 16 character packs, 32 blog posts, and a live website — but zero users and zero traffic.

The product works. The technology is solid. The gap is entirely in:
1. **Discovery** — nobody finds the site (SEO indexing just started)
2. **Conversion** — visitors don't immediately understand the value
3. **Trust** — no social proof, no demo, no testimonials

The homepage redesign should focus on making the value proposition instantly clear in 3 seconds, showing real output quality, and giving visitors a reason to sign up immediately.
