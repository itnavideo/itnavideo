'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '12', label: 'Video Types', suffix: '' },
  { value: '30', label: 'Caption Styles', suffix: '+' },
  { value: '<3', label: 'Min Render', suffix: '' },
  { value: '1080p', label: 'HD Export', suffix: '' },
];

export default function StatsBar() {
  return (
    <section className="relative border-y border-white/[0.06] bg-[#022c22] px-4 py-12 sm:px-6 sm:py-14">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-10 sm:gap-14 md:gap-20">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="text-center"
          >
            <p className="text-4xl font-black text-white sm:text-5xl md:text-6xl">
              {stat.value}<span className="text-primary">{stat.suffix}</span>
            </p>
            <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

