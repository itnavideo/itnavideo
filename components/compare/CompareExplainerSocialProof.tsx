"use client";

import { useRef } from "react";
import Link from "next/link";
import { BarChart3, ChevronLeft, ChevronRight, Instagram, Sparkles, Users } from "lucide-react";

const CLOUDINARY_IMAGE_BASE = "https://res.cloudinary.com/dhouh9idx/image/upload";

const screenshotIds = [
  "v1787471481/Screenshot_20260823-113249_Instagram_necvcr",
  "v1787471480/Screenshot_20260823-113331_Instagram_vugsjb",
  "v1787471480/Screenshot_20260823-120450_Instagram_khmbw1",
  "v1787471480/Screenshot_20260823-113225_Instagram_dcwn4u",
  "v1787471479/Screenshot_20260823-113439_Instagram_mlup8i",
  "v1787471296/Screenshot_20260823-113354_Instagram_mhym2p",
  "v1787471296/Screenshot_20260823-114059_Instagram_x1ntcq",
  "v1787471296/Screenshot_20260823-115904_Instagram_yz7ur8",
  "v1787471295/Screenshot_20260823-113938_Instagram_krhch0",
  "v1787471295/Screenshot_20260823-113647_Instagram_tl9giz",
  "v1787471295/Screenshot_20260823-115953_Instagram_blgiy4",
  "v1787471294/Screenshot_20260823-114235_Instagram_gg6njw",
  "v1787471294/Screenshot_20260823-113913_Instagram_xjikku",
  "v1787471294/Screenshot_20260823-120012_Instagram_uo4odv",
  "v1787471294/Screenshot_20260823-113602_Instagram_dtijlz",
  "v1787471294/Screenshot_20260823-113757_Instagram_z6emi3",
  "v1787471293/Screenshot_20260823-113743_Instagram_xcwocv",
  "v1787471293/Screenshot_20260823-114319_Instagram_qku5sd",
  "v1787471293/Screenshot_20260823-120101_Instagram_gpshwp",
  "v1787471293/Screenshot_20260823-120214_Instagram_yvthyl",
  "v1787471293/Screenshot_20260823-113722_Instagram_h1gjus",
];

const stickers = [
  ["2D Teacher", "/visuals/stickers/previews/2d-teacher.png"],
  ["Cartoon Teacher", "/visuals/stickers/previews/cartoon-teacher.png"],
  ["Stickman Explainer", "/visuals/stickers/previews/stickman-explainer.png"],
  ["Girl Teacher", "/visuals/stickers/previews/girl-teacher.png"],
  ["2D Pro", "/visuals/stickers/previews/teacher-2d-pro.png"],
  ["Indian Teacher", "/visuals/stickers/previews/indian-teacher-woman.png"],
  ["Girl 3D", "/visuals/stickers/previews/girl-teacher-3d.png"],
  ["Grandpa 3D", "/visuals/stickers/previews/grandpa-teacher-3d.png"],
  ["Young Presenter", "/visuals/stickers/previews/young-presenter-3d.png"],
  ["Chibi Boy", "/visuals/stickers/previews/chibi-boy-3d.png"],
  ["Corporate Woman", "/visuals/stickers/previews/corporate-woman-3d.png"],
  ["Doctor 3D", "/visuals/stickers/previews/doctor-3d-half.png"],
  ["Banker 3D", "/visuals/stickers/previews/banker-3d-half.png"],
  ["News Anchor", "/visuals/stickers/previews/news-anchor-3d-half.png"],
  ["Lawyer Girl", "/visuals/stickers/previews/lawyer-girl-3d.png"],
  ["Islamic Scholar", "/visuals/stickers/previews/shia-moulana-3d.png"],
] as const;

export interface CompareExplainerSocialProofProps {
  layout?: "grid" | "scroll";
  theme?: "dark" | "light";
}

export function CompareExplainerSocialProof({ layout = "scroll", theme = "light" }: CompareExplainerSocialProofProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLight = theme === "light";

  // Dynamic Tailwind Classes for Theme Adaptability
  const sectionBg = isLight ? "border-y border-slate-200 bg-white" : "border-y border-white/10 bg-slate-900/50";
  const badgeText = isLight ? "text-blue-600" : "text-cyan-400";
  const titleText = isLight ? "text-slate-900" : "text-white";
  const subtitleText = isLight ? "text-slate-600" : "text-zinc-300";
  
  const metricCardBg = isLight ? "border-slate-200 bg-slate-50 shadow-xs" : "border-cyan-400/20 bg-slate-950/60";
  const metricValueText = isLight ? "text-slate-900 font-extrabold" : "text-white font-black";
  const metricLabelText = isLight ? "text-slate-500 font-semibold" : "text-zinc-400";

  const screenshotCardBg = isLight ? "border-slate-200/80 bg-white shadow-xs" : "border-white/10 bg-slate-950 shadow-lg";
  const scrollButtonBg = isLight 
    ? "border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50" 
    : "border-white/20 bg-slate-950/80 text-white shadow-xl hover:bg-slate-900";

  const dividerBorder = isLight ? "border-slate-200" : "border-white/10";
  const stickerCardBg = isLight 
    ? "border-slate-200 bg-slate-50/60 p-2.5 transition hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white shadow-xs hover:shadow-sm" 
    : "border-white/10 bg-slate-950/70 p-2.5 transition hover:-translate-y-1 hover:border-cyan-400/50";
  const stickerImgBg = isLight ? "bg-white border border-slate-200/50" : "bg-slate-800/70";
  const stickerText = isLight ? "text-slate-700" : "text-zinc-300";

  return (
    <section className={`relative z-10 px-4 py-16 sm:px-6 ${sectionBg}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest ${badgeText}`}>
            <Instagram size={14} /> Creator proof
          </span>
          <h2 className={`mt-2 text-3xl font-black ${titleText} sm:text-4xl`}>Comparison content that earns attention</h2>
          <p className={`mt-4 text-sm leading-relaxed ${subtitleText} sm:text-base`}>
            Explore real Instagram comparison-content examples shared by creators in our community—built to make complex choices easy to watch, save, and share.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-3 sm:grid-cols-3">
          {[
            [Users, "100K+", "follower growth shown"],
            [BarChart3, "Millions", "of views captured"],
            [Sparkles, "21", "creator examples"],
          ].map(([Icon, value, label]) => {
            const MetricIcon = Icon as typeof Users;
            return (
              <div key={value as string} className={`rounded-2xl border px-3 py-4 text-center ${metricCardBg}`}>
                <MetricIcon className={`mx-auto ${isLight ? "text-blue-600" : "text-cyan-400"}`} size={18} />
                <p className={`mt-2 text-xl ${metricValueText}`}>{value as string}</p>
                <p className={`text-[10px] uppercase tracking-wide ${metricLabelText}`}>{label as string}</p>
              </div>
            );
          })}
        </div>

        {layout === "scroll" ? (
          <div className="relative group/scroll-area mt-10">
            {/* Left Scroll Button */}
            <button
              onClick={() => {
                if (scrollRef.current) {
                  scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
                }
              }}
              className={`absolute -left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border transition active:scale-95 cursor-pointer opacity-0 group-hover/scroll-area:opacity-100 duration-200 ${scrollButtonBg}`}
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>

            {/* Scrollable Row */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-4 pt-1 px-2 no-scrollbar scroll-smooth w-full touch-pan-x"
            >
              {screenshotIds.slice(0, 8).map((id, index) => (
                <figure
                  key={id}
                  className={`group relative overflow-hidden rounded-2xl border w-48 sm:w-56 flex-shrink-0 ${screenshotCardBg}`}
                >
                  <div className={`aspect-[9/16] overflow-hidden ${isLight ? "bg-slate-100" : "bg-slate-800"}`}>
                    <img
                      src={`${CLOUDINARY_IMAGE_BASE}/f_auto,q_auto,c_fill,g_north,w_420,h_747/${id}.png`}
                      alt={`Instagram comparison content result ${index + 1}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </figure>
              ))}
            </div>

            {/* Right Scroll Button */}
            <button
              onClick={() => {
                if (scrollRef.current) {
                  scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
                }
              }}
              className={`absolute -right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border transition active:scale-95 cursor-pointer opacity-0 group-hover/scroll-area:opacity-100 duration-200 ${scrollButtonBg}`}
              aria-label="Scroll right"
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {screenshotIds.slice(0, 8).map((id, index) => (
              <figure key={id} className={`group overflow-hidden rounded-2xl border ${screenshotCardBg}`}>
                <div className={`aspect-[9/16] overflow-hidden ${isLight ? "bg-slate-100" : "bg-slate-800"}`}>
                  <img
                    src={`${CLOUDINARY_IMAGE_BASE}/f_auto,q_auto,c_fill,g_north,w_420,h_747/${id}.png`}
                    alt={`Instagram comparison content result ${index + 1}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </figure>
            ))}
          </div>
        )}

        <div className={`mt-16 border-t pt-16 text-center ${dividerBorder}`}>
          <span className={`text-xs font-black uppercase tracking-widest ${badgeText}`}>Your presenter, your style</span>
          <h2 className={`mt-2 text-2xl font-black ${titleText} sm:text-3xl`}>Choose from 16+ sticker presenters</h2>
          <p className={`mx-auto mt-3 max-w-2xl text-sm leading-relaxed ${subtitleText}`}>
            The same presenter styles available in the Compare Explainer dashboard—each automatically switches poses as your narration moves from one side to the other.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-5">

            {stickers.slice(0, 5).map(([name, image]) => (
              <div key={name} className={`group rounded-2xl ${stickerCardBg}`}>
                <div className={`flex aspect-square items-center justify-center rounded-xl ${stickerImgBg}`}>
                  <img src={image} alt={name} className="h-[76%] w-[76%] object-contain transition group-hover:scale-110" loading="lazy" />
                </div>
                <p className={`mt-2 truncate text-[10px] font-bold ${stickerText}`}>{name}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link 
              href="/video-types/compare-explainer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700"
            >
              Read more about Compare Explainer
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
