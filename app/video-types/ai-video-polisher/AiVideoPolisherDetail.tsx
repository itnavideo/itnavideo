'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Tv,
  Zap,
  CheckCircle2,
  Clock,
  Play,
  FileText,
  Sliders,
  ChevronDown,
  BarChart3,
  Flame,
  Type,
  ShieldCheck,
  Award,
  Layers,
  ZoomIn,
  Volume2,
  Scissors,
  Check,
  X,
  Video,
} from 'lucide-react';
import ExploreMoreVideoTools from '@/components/landing/ExploreMoreVideoTools';

export default function AiVideoPolisherDetail() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqData = [
    {
      q: 'What is the AI YouTube Video Polisher, and how does it elevate raw camera footage?',
      a: 'The AI YouTube Video Polisher turns raw, single-take 16:9 talking head video recordings into highly engaging, broadcast-ready YouTube videos. Instead of spending hours in Premiere Pro manually cutting pauses, inserting B-roll clips, zooming in on punchlines, and keyframing subtitles, our AI engine automatically detects speech pauses, applies smooth digital camera zoom cuts, inserts topic-matched stock visuals, auto-ducks focus background music, and burns in professional 16:9 landscape subtitles.',
    },
    {
      q: 'How does the AI determine when to zoom in or cut to B-roll?',
      a: 'Our AI speech intelligence analyzes your vocal inflection, sentence transitions, and spoken keywords. When you introduce a new concept, emphasize a key takeaway, or pause for emphasis, the system automatically triggers a calculated 1.15x zoom punch-in or cuts smoothly to a relevant high-definition B-roll clip, maintaining viewer dopamine levels and boosting audience retention.',
    },
    {
      q: 'Do I have to re-shoot if I make small speaking mistakes or hesitate?',
      a: 'No. The AI Video Polisher identifies silent gaps, awkward pauses, and sentence retakes. It trims empty dead air cleanly without audio clicks or visual jumps, giving your final video the crisp, confident delivery of a seasoned creator.',
    },
    {
      q: 'What is the credit pricing and maximum duration for AI YouTube Video Polisher?',
      a: 'In accordance with Itnavideo’s master credit rules, 16:9 widescreen videos are billed strictly at 1 Minute = 1 Credit (1 min = 1 credit, 2 min = 2 credits, 3 min = 3 credits, 4 min = 4 credits, up to 5 minutes maximum = 5 credits). You can upload videos longer than 5 minutes; the system seamlessly processes the first 5 minutes (300 seconds). Rendered in full 1080p 30 FPS MP4.',
    },
    {
      q: 'Can I customize the subtitle styles, background music, and visual overlays?',
      a: 'Yes. You have total creative control in the studio. You can choose from signature YouTube typography presets (such as Ali Abdaal clean modern, Vox documentary serif, or bold highlight styles), adjust background music volume, toggle sound effect swooshes, and customize color accents.',
    },
    {
      q: 'Does it support English and Hinglish spoken narration?',
      a: 'Yes! Groq Whisper cloud speech recognition provides millisecond-precise transcription for both clear English and natural Hinglish conversational speech, rendering clean, easy-to-read Roman subtitles with 100% pronunciation fidelity.',
    },
    {
      q: 'Are the stock visuals and background music safe for YouTube monetization?',
      a: 'Every video rendered with Itnavideo includes 100% royalty-free commercial licensing for all included B-roll, background audio tracks, and graphic overlays. You will never receive copyright strikes or Content ID claims on YouTube.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 border-b border-slate-100 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,87,34,0.08),rgba(255,255,255,0))]" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Turn Raw Talking Head Footage into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000]">
              Studio-Grade YouTube Videos
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Stop spending 10 hours in Premiere Pro cutting dead air, sourcing B-roll, and keyframing zoom cuts. Itnavideo automatically polishes raw 16:9 recordings into high-retention widescreen videos in under 2 minutes.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard/ai-video-polisher"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-8 py-4 text-base font-black text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 active:scale-95 transition-all duration-200"
            >
              <Sparkles size={18} className="fill-white stroke-white" />
              <span>Polish Your Video Free</span>
              <ArrowRight size={18} />
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 text-base font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            >
              <Play size={16} className="text-slate-500" />
              <span>See How It Works</span>
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-slate-500">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              Auto Zoom Punch-Ins
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              Smart B-Roll Overlays
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              Auto Dead-Air Trimming
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              16:9 Widescreen 1080p MP4
            </span>
          </div>
        </div>
      </section>

      {/* ─── 2. WHAT IS AI YOUTUBE VIDEO POLISHER ─── */}
      <section className="py-16 sm:py-24 border-b border-slate-100 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                The Secret to 70%+ Audience Retention on YouTube
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                Viewer attention spans are shorter than ever. A static, unedited camera shot causes viewer fatigue within 15 seconds. Top-tier creators like Ali Abdaal, MrBeast, and Vox maintain sky-high watch time by changing camera angles every 4 to 6 seconds, inserting relevant b-roll graphics, and reinforcing points with on-screen text.
              </p>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                The <strong>AI YouTube Video Polisher</strong> gives solo creators, educators, and enterprise marketing teams the automated editing power of a 5-person post-production studio. Simply upload your raw camera file or podcast clip, and our engine automatically structures, paces, and polishes your content for maximum retention.
              </p>
              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[#FF5722] shrink-0 mt-0.5">
                    <Check size={14} />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-700">
                    <strong>Pacing AI:</strong> Automatically detects dramatic pauses and applies dynamic digital push-ins to highlight key insights.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[#FF5722] shrink-0 mt-0.5">
                    <Check size={14} />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-700">
                    <strong>Contextual Visual Matching:</strong> Instantly pairs your spoken topics with cinematic stock footage from our curated cloud library.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[#FF5722] shrink-0 mt-0.5">
                    <Check size={14} />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-700">
                    <strong>Audio Auto-Ducking:</strong> Background music ducks seamlessly to 15% volume whenever you speak, keeping your voice crystal clear.
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BarChart3 className="text-[#FF5722]" size={20} />
                Traditional Video Editing vs. Itnavideo Polisher
              </h3>
              <div className="space-y-4 text-sm">
                <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">
                  <div className="font-bold text-red-900 flex items-center gap-2 mb-1">
                    <X size={16} className="text-red-500" />
                    Traditional Manual Editing (Premiere / Final Cut)
                  </div>
                  <ul className="list-disc list-inside text-red-700 text-xs sm:text-sm space-y-1 mt-2">
                    <li>6 to 10 hours of manual timeline scrubbing per video</li>
                    <li>Searching 10+ stock websites for license-safe B-roll clips</li>
                    <li>Manually keyframing scale and position for zoom punch-ins</li>
                    <li>Syncing and adjusting subtitle timing word-by-word</li>
                    <li>Expensive hardware required for 4K timeline playback</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                  <div className="font-bold text-emerald-900 flex items-center gap-2 mb-1">
                    <Check size={16} className="text-emerald-600" />
                    Itnavideo AI YouTube Video Polisher
                  </div>
                  <ul className="list-disc list-inside text-emerald-700 text-xs sm:text-sm space-y-1 mt-2">
                    <li>Complete hands-free edit rendered in under 2 minutes</li>
                    <li>Automatic stock B-roll visual inserts matched to speech</li>
                    <li>Automated digital zoom punch-ins at key retention hooks</li>
                    <li>Word-synced 16:9 landscape subtitles with YouTube safe zones</li>
                    <li>100% cloud rendering — zero CPU or RAM strain on your computer</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. HOW IT WORKS WORKFLOW ─── */}
      <section id="how-it-works" className="py-16 sm:py-24 border-b border-slate-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            How It Works in 3 Simple Steps
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Go from unpolished raw video to an export-ready YouTube masterpiece with zero technical editing skills required.
          </p>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] font-black text-lg mb-5">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Upload Raw Video</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Drag and drop your raw 16:9 talking head camera footage or screen recording (MP4, MOV, WEBM). Videos longer than 5 minutes are fully supported; the first 300 seconds are seamlessly analyzed.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] font-black text-lg mb-5">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Select Style & Presets</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Choose your typography preset (Ali Abdaal, Vox Documentary, Huberman Lab), toggle background music genre, and customize your camera zoom punch-in intensity.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-[#FF5722] font-black text-lg mb-5">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Cloud Render</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Click render to initiate high-speed cloud generation. Download your polished 1080p 30 FPS MP4 ready to upload directly to YouTube with guaranteed monetization safety.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. CORE FEATURES & CAPABILITIES ─── */}
      <section className="py-16 sm:py-24 border-b border-slate-100 bg-slate-50/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Purpose-Built Features for YouTube Creators
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              Every detail is engineered around long-form retention algorithms and clean professional branding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#FF5722] mb-4">
                <ZoomIn size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Dynamic Camera Zoom Punch-Ins</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Emulates multi-camera studio setups by applying tasteful 1.15x push-ins on high-impact sentences and core thesis statements.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
                <Tv size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">16:9 Landscape Subtitle Safe Zones</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Calibrated bottom margins ensure your burned-in subtitles never collide with the YouTube video progress scrubber or TV player overlays.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
                <Layers size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Contextual Stock B-Roll Overlays</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                AI extracts key conceptual keywords from your speech and overlays cinematic 1080p stock footage to illustrate complex ideas visually.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-4">
                <Volume2 size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Automated Background Audio Ducking</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Smart audio leveling ducks backing tracks during spoken narration and swells volume during transitions for high-budget broadcast feel.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 mb-4">
                <Scissors size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Automatic Dead-Air Trimming</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Removes silent pauses longer than 400ms automatically, eliminating stuttering and awkward silences for snappy, confident flow.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                <ShieldCheck size={22} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">100% Monetization Safe</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Full commercial rights on all included media assets. Safe for YouTube AdSense monetization, brand sponsorships, and paid course portals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. WHO IS IT FOR / USE CASES ─── */}
      <section className="py-16 sm:py-24 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Built for Today’s Highest-Growth Content Formats
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600">
              Whether you are an independent YouTube creator or an enterprise product marketer, AI Video Polisher cuts post-production bottlenecks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Award className="text-[#FF5722]" size={20} />
                YouTube Solo Creators & Vloggers
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Film your video in one single continuous recording on your webcam or mirrorless camera. Let the polisher cut out pauses, add professional zoom punch-ins, and insert B-roll clips so your weekly upload schedule stays consistent without burning out.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="text-[#FF5722]" size={20} />
                Educators, Coaches & Course Creators
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Transform dry webcam lectures into dynamic masterclass videos. On-screen animated captions and visual topic overlays keep students engaged throughout long conceptual explanations.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <BarChart3 className="text-[#FF5722]" size={20} />
                SaaS Founders & Product Marketers
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Record product walkthroughs, company announcements, and customer case studies. The polisher outputs clean, broadcast-standard horizontal MP4s suitable for website embeds, investor updates, and YouTube ads.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Tv className="text-[#FF5722]" size={20} />
                Video Podcasters & Interview Shows
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Elevate raw remote interview recordings into episodic studio shows. Add subtitle tracks with speaker emphasis, subtle background atmosphere, and zoom framing that keeps visual energy high.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. FAQ ACCORDION ─── */}
      <section className="py-16 sm:py-24 border-b border-slate-100 bg-slate-50/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqData.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left transition cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-900 pr-4">{faq.q}</span>
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-transform ${
                        isOpen ? 'rotate-180 bg-orange-100 text-[#FF5722]' : ''
                      }`}
                    >
                      <ChevronDown size={16} />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 7. BOTTOM CONVERSION CTA ─── */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-orange-50 via-amber-50/50 to-orange-50/80 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
            Polish Your Next YouTube Video in 2 Minutes
          </h2>
          <p className="text-slate-600 text-base max-w-xl mx-auto mb-8">
            Upload your raw talking-head footage and experience automated zoom cuts, B-roll overlays, and subtitles.
          </p>
          <Link
            href="/dashboard/ai-video-polisher"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-8 py-4 text-base font-black text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 active:scale-95 transition-all duration-200"
          >
            <Sparkles size={18} className="fill-white stroke-white" />
            <span>Open AI YouTube Polisher Studio</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ─── 8. EXPLORE ALL 14 OTHER VIDEO TOOLS ─── */}
      <ExploreMoreVideoTools currentToolId="aiVideoPolisher" />
    </div>
  );
}

