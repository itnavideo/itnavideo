'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Coins, Layers, Scissors, X, Zap } from 'lucide-react';

const comparisons = [
  {
    feature: 'Editing time',
    manual: '4-6 hours of editing work',
    ai: 'Upload source, review a rendered draft',
    manualIcon: Clock,
    aiIcon: Zap,
  },
  {
    feature: 'Visual planning',
    manual: 'Search clips, place overlays, keep rebuilding',
    ai: 'Script-driven scene plan and asset matching',
    manualIcon: Layers,
    aiIcon: Check,
  },
  {
    feature: 'Captions',
    manual: 'Manual timing and keyframes',
    ai: 'Large typography moments with clean safe zones',
    manualIcon: Scissors,
    aiIcon: Check,
  },
  {
    feature: 'Production cost',
    manual: 'Editors, plugins, stock assets',
    ai: 'Template-based workflow with 6 focused formats',
    manualIcon: Coins,
    aiIcon: Check,
  },
];

export default function ComparisonSection() {
  return (
    <section className="relative overflow-hidden bg-black px-6 py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-14 max-w-3xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-blue-400">The bottleneck</p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black leading-tight tracking-normal text-white md:text-6xl"
          >
            Creators have ideas. Editing keeps stealing the schedule.
          </motion.h2>
          <p className="mt-5 text-lg leading-8 text-zinc-400">
            ItnaVideo removes the first blank-page problem: transcript, scene plan, visual direction, and render are handled before you open an editor.
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950">
          <div className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-white/10 bg-white/[0.03] text-sm font-bold uppercase tracking-[0.16em] text-zinc-500">
            <div className="p-4">Workflow</div>
            <div className="border-l border-white/10 p-4">Manual editing</div>
            <div className="border-l border-white/10 p-4 text-blue-300">Itnavideo</div>
          </div>

          {comparisons.map((item, index) => {
            const ManualIcon = item.manualIcon;
            const AiIcon = item.aiIcon;

            return (
              <motion.div
                key={item.feature}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="grid grid-cols-1 border-b border-white/8 last:border-b-0 md:grid-cols-[1.1fr_1fr_1fr]"
              >
                <div className="p-5">
                  <p className="font-bold text-white">{item.feature}</p>
                </div>
                <div className="flex items-start gap-3 border-t border-white/8 p-5 md:border-l md:border-t-0">
                  <div className="mt-0.5 rounded-md bg-red-400/10 p-2 text-red-300">
                    <ManualIcon size={17} />
                  </div>
                  <p className="text-sm leading-6 text-zinc-400">{item.manual}</p>
                </div>
                <div className="flex items-start gap-3 border-t border-white/8 bg-blue-400/[0.035] p-5 md:border-l md:border-t-0">
                  <div className="mt-0.5 rounded-md bg-blue-400/12 p-2 text-blue-300">
                    <AiIcon size={17} />
                  </div>
                  <p className="text-sm font-semibold leading-6 text-zinc-100">{item.ai}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 rounded-lg border border-cyan-300/15 bg-cyan-300/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-white">Production focus</p>
            <p className="mt-1 text-sm text-zinc-400">6 focused templates live. Upload content, choose a polished output style, get a ready-to-post reel.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-cyan-200">
            <X size={16} className="text-zinc-500" />
            No overloaded scenes
          </div>
        </div>
      </div>
    </section>
  );
}
