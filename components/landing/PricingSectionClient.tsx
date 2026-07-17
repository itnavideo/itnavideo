'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    description: 'Try Itnavideo before you buy.',
    features: ['1 free AI video', 'Watermark included', 'Limited features'],
    cta: 'Get Started Free',
    href: '/signup',
    accent: '#94A3B8',
    popular: false,
  },
  {
    name: 'Pro',
    priceKey: 'proPrice' as const,
    description: 'For creators who publish regularly.',
    features: ['25 AI videos/month', 'No watermark', 'All templates', 'Priority support'],
    cta: 'Upgrade to Pro',
    href: '/pricing',
    accent: '#22D3EE',
    popular: true,
  },
  {
    name: 'Business',
    price: 'Team plan',
    description: 'For agencies and teams at scale.',
    features: ['65 AI videos/month', 'Team collaboration', 'Brand Kit', 'Priority support'],
    cta: 'Get Business',
    href: '/pricing',
    accent: '#A78BFA',
    popular: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Custom usage, API access, and support.',
    features: ['API access', 'Dedicated account manager', 'SLA support'],
    cta: 'Contact Sales',
    href: '/pricing',
    accent: '#FBBF24',
    popular: false,
  },
];

export function PricingSectionClient({ proPrice }: { proPrice: string }) {
  return (
    <section className="relative overflow-hidden px-5 py-24 sm:px-8" style={{ background: '#080C14' }}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 800px 400px at 50% 20%, rgba(34,211,238,0.06) 0%, transparent 60%)' }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-mint/25 bg-brand-mint/[0.07] px-4 py-1.5 text-xs font-bold text-brand-mint">
            <Sparkles size={12} />
            Simple pricing
          </div>
          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Plans for every stage.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-slate-400">
            Start free, then upgrade for more videos, no watermark, and priority rendering.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => {
            const displayPrice = plan.priceKey === 'proPrice' ? proPrice : plan.price;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="relative flex flex-col rounded-2xl border p-6"
                style={{
                  borderColor: plan.popular ? `${plan.accent}66` : 'rgba(255,255,255,0.08)',
                  background: plan.popular
                    ? 'linear-gradient(160deg, rgba(34,211,238,0.1) 0%, rgba(15,23,42,0.97) 55%)'
                    : 'rgba(255,255,255,0.02)',
                  boxShadow: plan.popular ? `0 24px 60px ${plan.accent}22` : undefined,
                }}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest"
                    style={{ background: plan.accent, color: '#0B1120' }}
                  >
                    <BadgeCheck size={11} />
                    Most Popular
                  </div>
                )}
                <p className="text-lg font-black text-white">{plan.name}</p>
                <p className="mt-1 text-xs text-slate-500">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-3xl font-black text-white">{displayPrice}</span>
                  {plan.priceKey === 'proPrice' && <span className="ml-1 text-xs font-semibold text-slate-500">/month</span>}
                </div>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                      <Check size={13} className="mt-0.5 shrink-0" style={{ color: plan.accent }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-black transition hover:-translate-y-0.5"
                  style={plan.popular
                    ? { background: plan.accent, color: '#0B1120', boxShadow: `0 8px 32px ${plan.accent}44` }
                    : { background: 'rgba(255,255,255,0.06)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Pricing is shown in your local currency. Failed system renders don't count against your plan.
        </p>
      </div>
    </section>
  );
}
