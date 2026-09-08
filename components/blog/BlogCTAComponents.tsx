import Link from 'next/link';
import { ArrowRight, Sparkles, Play, Zap } from 'lucide-react';
import { ProductFeature } from '@/lib/productRegistry';

interface CTAProps {
  feature: ProductFeature;
}

/** 1. Feature CTA Component */
export function FeatureCTA({ feature }: CTAProps) {
  return (
    <section className="my-10 rounded-2xl border-2 border-blue-600/30 bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/40 p-7 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-xs">
          <Sparkles size={13} />
          ITNAVIDEO FEATURE SPOTLIGHT
        </span>
        <span className="text-xs font-bold text-blue-700">{feature.name}</span>
      </div>

      <h3 className="mt-4 font-sans text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
        Create {feature.name} with Itnavideo
      </h3>

      <p className="mt-2 text-xs text-slate-600 leading-relaxed max-w-2xl">
        {feature.whatItIs} {feature.whyItSavesTime}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href={feature.dashboardUrl}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 hover:scale-[1.01] active:scale-100"
        >
          <span>Try Itnavideo →</span>
          <ArrowRight size={16} />
        </Link>
        <Link
          href={feature.landingUrl}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-blue-600 underline underline-offset-4"
        >
          <span>Explore Feature Details</span>
        </Link>
      </div>
    </section>
  );
}

/** 2. Product Benefit CTA Component */
export function ProductBenefitCTA({ feature }: CTAProps) {
  return (
    <section className="my-10 rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/40 p-7 shadow-md">
      <div className="flex items-center gap-2">
        <span className="rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">
          PRODUCTIVITY BENEFIT
        </span>
        <span className="text-xs font-medium text-emerald-700">• Save 4+ Hours Per Video</span>
      </div>

      <h3 className="mt-4 font-sans text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
        Turn Your Content Into Professional Videos
      </h3>

      <p className="mt-2 text-xs text-slate-700 leading-relaxed max-w-2xl font-serif text-[15px]">
        {feature.problemItSolves || ''} With Itnavideo, {feature.whyUseItnavideo ? feature.whyUseItnavideo.toLowerCase() : 'create high-converting videos faster.'} Enjoy instant cloud rendering with zero watermarks.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href={feature.dashboardUrl}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 hover:scale-[1.01]"
        >
          <span>Create Your Video →</span>
          <Zap size={16} />
        </Link>
      </div>
    </section>
  );
}

/** 3. Example CTA Component */
export function ExampleCTA({ feature }: CTAProps) {
  const demo = feature.demoVideo;
  return (
    <section className="my-10 rounded-2xl border border-indigo-200 bg-gradient-to-br from-slate-900 to-indigo-950 p-7 text-white shadow-xl">
      <div className="flex items-center gap-2 mb-3">
        <Play size={16} className="text-indigo-400 fill-indigo-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
          SEE WHAT YOU CAN CREATE
        </span>
      </div>

      <h3 className="font-sans text-xl font-bold text-white md:text-2xl">
        {demo?.title || `Sample ${feature.name} Output`}
      </h3>

      <p className="mt-2 text-xs text-slate-300 leading-relaxed">
        {demo?.description || feature.ctaDescription}
      </p>

      {demo?.samplePromptOrScript ? (
        <div className="mt-4 rounded-xl bg-slate-950/90 p-4 border border-indigo-500/30 text-xs">
          <span className="text-indigo-400 font-bold block mb-1">SAMPLE CREATOR SCRIPT:</span>
          <p className="font-serif italic text-slate-200">{demo.samplePromptOrScript}</p>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-slate-400 font-medium">
          Specs: {demo?.outputSpecs || '9:16 Portrait • 1080x1920 HD'}
        </span>
        <Link
          href={feature.dashboardUrl}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-600 transition"
        >
          <span>Try It Yourself →</span>
        </Link>
      </div>
    </section>
  );
}

