'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, GraduationCap, Megaphone, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: 'I can record a voice idea and get a polished short without opening a complex editor.',
    name: 'Short-form creator',
    role: 'Reels and Shorts',
    icon: Megaphone,
  },
  {
    quote: 'The best part is how quickly a lesson becomes something I can actually post.',
    name: 'Online educator',
    role: 'Course content',
    icon: GraduationCap,
  },
  {
    quote: 'This is the type of workflow agencies need for repeatable client shorts and fast content testing.',
    name: 'Content agency',
    role: 'Client videos',
    icon: Building2,
  },
];

export default function TestimonialSection() {
  return (
    <section className="bg-black px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-blue-400">Testimonials</p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-black leading-tight tracking-normal text-white md:text-6xl"
            >
              Built for creators who want videos faster.
            </motion.h2>
            <p className="mt-5 text-lg leading-8 text-zinc-400">
              Itnavideo is designed for voice-first creators, educators, and teams who need polished short-form videos without heavy editing work.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-3">
              {testimonials.map((testimonial, index) => {
                const Icon = testimonial.icon;

                return (
                  <motion.div
                    key={testimonial.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06 }}
                    className="rounded-lg border border-white/10 bg-zinc-950 p-6"
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <Icon size={22} className="text-blue-300" />
                      <Quote size={20} className="text-zinc-700" />
                    </div>
                    <p className="text-sm leading-7 text-zinc-300">“{testimonial.quote}”</p>
                    <div className="mt-6 border-t border-white/10 pt-4">
                      <h3 className="font-bold text-white">{testimonial.name}</h3>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{testimonial.role}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

