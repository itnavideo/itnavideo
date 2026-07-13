'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Starter',
    price: '$9',
    period: '/month',
    description: 'Explore all video types. Perfect for getting started.',
    accent: '#60A5FA',
    features: [
      '25 reel credits',
      'All video types',
      'HD 1080×1920 export',
      'No watermark',
    ],
    cta: 'Get Starter',
    href: '/dashboard',
    highlighted: false,
  },
  {
    name: 'Creator',
    price: '$19',
    period: '/month',
    description: 'For creators publishing reels regularly.',
    accent: '#22C55E',
    features: [
      '60 reel credits',
      'All video types',
      'Priority render',
      'Caption styles',
    ],
    cta: 'Get Creator',
    href: '/dashboard',
    highlighted: true,
  },
  {
    name: 'Business',
    price: '$39',
    period: '/month',
    description: 'For agencies and teams creating at scale.',
    accent: '#A78BFA',
    features: [
      '150 reel credits',
      'Priority queue',
      'Commercial usage',
      'All premium video types',
    ],
    cta: 'Get Business',
    href: '/dashboard',
    highlighted: false,
  },
];

export default function PricingSection() {
  return (
    <section className="relative overflow-hidden px-5 py-24 sm:px-8" style={{ background: '#080C14' }}>
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 800px 400px at 50% 20%, rgba(96,165,250,0.06) 0%, transparent 60%)' }}
      />

      <div className="relative mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/[0.07] px-4 py-1.5 text-xs font-bold text-emerald-400">
            <Sparkles size={12} />
            Simple pricing
          </div>
          <h2 className="text-3xl font-black text-white sm:text-4xl">
            1 video = 1 credit. That&apos;s it.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-slate-400">
            Choose a plan, get video credits. Use any video type. Export 1080p MP4 ready for Instagram Reels, YouTube Shorts, and TikTok.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative rounded-2xl border p-6"
              style={{
                borderColor: plan.highlighted ? `${plan.accent}55` : 'rgba(255,255,255,0.08)',
                background: plan.highlighted
                  ? 'linear-gradient(160deg, rgba(34,197,94,0.08) 0%, rgba(15,23,42,0.95) 50%)'
                  : 'rgba(255,255,255,0.02)',
                boxShadow: plan.highlighted ? `0 24px 60px rgba(34,197,94,0.1), 0 0 0 1px ${plan.accent}22` : undefined,
                transform: plan.highlighted ? 'scale(1.04)' : undefined,
              }}
            >
              {plan.highlighted && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest"
                  style={{ background: plan.accent, color: '#0B1120' }}
                >
                  Recommended
                </div>
              )}

              <p className="text-lg font-black text-white">{plan.name}</p>
              <p className="mt-1 text-xs text-slate-500">{plan.description}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                <span className="text-sm text-slate-500">{plan.period}</span>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <Check size={14} className="mt-0.5 shrink-0" style={{ color: plan.accent }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className="mt-6 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-black transition hover:-translate-y-0.5"
                style={{
                  background: plan.highlighted ? plan.accent : 'rgba(255,255,255,0.06)',
                  color: plan.highlighted ? '#0B1120' : '#e2e8f0',
                  border: plan.highlighted ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: plan.highlighted ? `0 8px 32px ${plan.accent}44` : undefined,
                }}
              >
                <Zap size={14} />
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-8 text-center text-xs text-slate-500">
          No credit card required to sign up. Start creating immediately.
        </p>
      </div>
    </section>
  );
}
