'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '8', label: 'Video Types', suffix: '' },
  { value: '30', label: 'Caption Styles', suffix: '+' },
  { value: '<3', label: 'Min Render', suffix: '' },
  { value: '1080p', label: '9:16 Export', suffix: '' },
];

export default function StatsBar() {
  return (
    <section className="relative border-y border-white/[0.06] bg-[#060A14] px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="text-center"
          >
            <p className="text-2xl font-black text-white sm:text-3xl">
              {stat.value}<span className="text-brand-cyan">{stat.suffix}</span>
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
