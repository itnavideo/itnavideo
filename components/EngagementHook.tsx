'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeIndianRupee,
  Bot,
  Captions,
  Film,
  Frame,
  Globe2,
  MapPinned,
  ServerOff,
  ShieldCheck,
  Sparkles,
  Table2,
} from 'lucide-react';

const zones = [
  { label: '0-200 px', value: 'clean top safe zone' },
  { label: '200-740 px', value: '16:9 floating frame' },
  { label: '800-1620 px', value: 'icons, charts, callouts' },
  { label: '1620-1920 px', value: 'platform buttons stay clear' },
];

const themes = [
  {
    name: 'Finance',
    accent: 'from-emerald-300 to-teal-500',
    ring: 'border-emerald-300/35 bg-emerald-300/10 text-emerald-100',
    icon: BadgeIndianRupee,
    headline: 'SHOULD WE TAKE A LOAN',
    keyword: 'LOAN',
    subLabel: 'ON INTEREST',
    metricA: ['EMI', '₹9,650/mo'],
    metricB: ['RATE', '10%'],
  },
  {
    name: 'Tech AI',
    accent: 'from-cyan-300 to-blue-500',
    ring: 'border-cyan-300/35 bg-cyan-300/10 text-cyan-100',
    icon: Bot,
    headline: 'AUTOMATE THE NEXT STEP',
    keyword: 'AUTOMATE',
    subLabel: 'WITH NODE',
    metricA: ['TASKS', '42/min'],
    metricB: ['LATENCY', '0.8s'],
  },
  {
    name: 'Motivation',
    accent: 'from-amber-300 to-orange-500',
    ring: 'border-amber-300/35 bg-amber-300/10 text-amber-100',
    icon: Sparkles,
    headline: 'BREAK THE OLD PATTERN',
    keyword: 'BREAKTHROUGH',
    subLabel: 'UNLOCKED',
    metricA: ['FOCUS', '2x'],
    metricB: ['STREAK', '21 days'],
  },
];

const iconSources = [
  { label: 'Open SVG set', value: 'Lucide', icon: Globe2 },
  { label: 'Local imports', value: 'No API wait', icon: ServerOff },
  { label: 'Startup safe', value: 'Permissive', icon: ShieldCheck },
];

const triggerExamples = [
  { word: 'LOAN', visual: 'keyword card', icon: BadgeIndianRupee },
  { word: 'INVEST', visual: 'pop label', icon: Sparkles },
  { word: 'PIN CODE', visual: 'map callout', icon: MapPinned },
  { word: 'SENSEX', visual: 'table row', icon: Table2 },
];

const exampleRows = [
  { rank: '#3', title: 'Altamount Road', city: 'Mumbai', value: '₹1 lakh' },
  { rank: '#2', title: "Lutyens' Delhi", city: 'Delhi', value: '₹1.5 lakh' },
  { rank: '#1', title: 'Worli Sea Face', city: 'Mumbai', value: '₹2.8 lakh' },
];

export default function EngagementHook() {
  const [activeTheme, setActiveTheme] = useState(themes[0]);

  return (
    <section className="bg-zinc-950 px-4 py-24 text-zinc-100 sm:px-6">
      <div className="mx-auto grid max-w-6xl items-start gap-14 lg:grid-cols-12">
        <div className="space-y-9 lg:col-span-7">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2"
            >
              <Frame size={15} className="text-cyan-300" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                Top Frame Reel System
              </span>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl"
            >
              Layout engine built for high-retention shorts.
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="mt-6 max-w-2xl text-lg font-normal leading-8 text-zinc-400"
            >
              Itnavideo locks the top 16:9 content frame, lower visual area, and platform-safe bottom zone.
              Spoken words trigger lower-zone cards, icons, maps, and tables at exact timestamps.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Select niche engine</p>
              <span className="rounded-md bg-cyan-300/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-200">
                Interactive
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {themes.map((theme) => {
                const Icon = theme.icon;
                const selected = activeTheme.name === theme.name;

                return (
                  <button
                    key={theme.name}
                    type="button"
                    onClick={() => setActiveTheme(theme)}
                    onMouseEnter={() => setActiveTheme(theme)}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
                      selected ? theme.ring : 'border-white/10 bg-zinc-950/70 text-zinc-400 hover:border-white/20 hover:text-zinc-100'
                    }`}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${theme.accent} text-zinc-950`}>
                      <Icon size={17} />
                    </span>
                    <span className="text-sm font-semibold">{theme.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="grid gap-3 sm:grid-cols-3"
          >
            {iconSources.map((source) => {
              const Icon = source.icon;
              return (
                <div key={source.label} className="rounded-lg border border-white/10 bg-zinc-900/35 p-4">
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                    <Icon size={16} />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">{source.label}</p>
                  <p className="mt-1 text-sm font-semibold text-white">{source.value}</p>
                </div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-lg border border-white/10 bg-zinc-900/25 p-4"
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Word-trigger examples</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {triggerExamples.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.word} className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-black/25 px-3 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Icon size={16} className="shrink-0 text-cyan-200" />
                      <span className="truncate text-sm font-semibold text-white">{item.word}</span>
                    </div>
                    <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-500">{item.visual}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
          className="mx-auto w-full max-w-[370px] lg:sticky lg:top-10 lg:col-span-5"
        >
          <div className="relative aspect-[9/19] overflow-hidden rounded-[34px] border-[6px] border-zinc-800 bg-zinc-950 p-3 shadow-2xl ring-1 ring-white/10">
            <div className="absolute left-1/2 top-4 z-20 h-4 w-28 -translate-x-1/2 rounded-full bg-zinc-800" />

            <div className="flex h-full flex-col overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,#111827_0%,#08090d_46%,#1e0f0b_100%)] p-4 pt-10">
              <div className="overflow-hidden rounded-lg border border-white/12 bg-black shadow-xl">
                <div className="relative aspect-video bg-[radial-gradient(circle_at_center,#1e293b,#050505_72%)]">
                  <div className={`absolute inset-0 bg-gradient-to-br ${activeTheme.accent} opacity-20`} />
                  <div className="relative flex h-full items-center justify-center">
                    <Film size={38} className="text-white/75" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/65 px-3 py-2 text-center">
                      <span className="text-[11px] font-bold leading-none text-white [text-shadow:0_2px_0_#000]">
                        {activeTheme.headline}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-center gap-4 py-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTheme.name}
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="-rotate-1 rounded-lg border border-white/80 bg-white p-3 shadow-xl"
                  >
                    <div className="flex items-end justify-between gap-3">
                      <span className="min-w-0 truncate text-[30px] font-extrabold leading-none tracking-tight text-[#35110d]">
                        {activeTheme.keyword}
                      </span>
                      <span className="pb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-600">
                        {activeTheme.subLabel}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="grid grid-cols-2 gap-2">
                  {[activeTheme.metricA, activeTheme.metricB].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-white px-3 py-2 text-[#35110d]">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] opacity-70">{label}</p>
                      <p className="mt-1 truncate text-lg font-extrabold leading-none">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border border-white/10 bg-black/35 p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <Captions size={13} className="text-cyan-300" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-500">Triggered rows</span>
                  </div>
                  <div className="space-y-1.5">
                    {exampleRows.map((row) => (
                      <div key={row.rank} className="grid grid-cols-[24px_1fr_66px] items-center gap-2 text-[11px]">
                        <span className="rounded bg-white/10 py-1 text-center font-bold text-zinc-300">{row.rank}</span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-zinc-100">{row.title}</p>
                          <p className="truncate text-[9px] font-medium text-zinc-500">{row.city}</p>
                        </div>
                        <div className="rounded border border-white/10 bg-white px-1.5 py-1 text-right text-[#35110d]">
                          <p className="truncate font-extrabold">{row.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-3">
                <div className="mb-2 flex items-center justify-between px-1 text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-600">
                  <span>Safe zone map</span>
                  <Table2 size={11} />
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {zones.slice(2).map((zone) => (
                    <div key={zone.label} className="rounded-md border border-white/10 bg-white/[0.03] p-2 text-center">
                      <p className="text-[9px] font-bold text-cyan-300">{zone.label}</p>
                      <p className="truncate text-[8px] font-semibold uppercase tracking-[0.04em] text-zinc-500">{zone.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-2">
            {zones.map((zone) => (
              <div key={zone.label} className="grid grid-cols-[96px_1fr] rounded-md border border-white/10 bg-white/[0.03] px-4 py-3">
                <span className="text-xs font-bold text-cyan-200">{zone.label}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-400">{zone.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
