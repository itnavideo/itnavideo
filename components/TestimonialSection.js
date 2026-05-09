'use client';

import { motion } from 'framer-motion';
import { Quote, UserCircle } from 'lucide-react';

const testimonials = [
  {
    quote: "Itnavideo transformed my content workflow! What used to take hours now takes minutes. My engagement has skyrocketed!",
    author: "Alex V.",
    title: "YouTube Shorts Creator",
    avatar: "/images/avatars/alex.jpg", // Placeholder image path
    social: "@AlexCreatesAI",
  },
  {
    quote: "The AI captions are spot-on, and the auto B-roll selection is pure magic. This is a game-changer for educators like me.",
    author: "Dr. Maya S.",
    title: "Educational Content Creator",
    avatar: "/images/avatars/maya.jpg", // Placeholder image path
    social: "@EduTech_Maya",
  },
  {
    quote: "I've cut my video production costs by 80% with Itnavideo. The quality is consistently professional. Highly recommend!",
    author: "Ben K.",
    title: "E-commerce Marketer",
    avatar: "/images/avatars/ben.jpg", // Placeholder image path
    social: "@BenKMarketing",
  },
  {
    quote: "The mood detection feature is incredible! My videos now perfectly match the tone of my voiceovers. It's like having a professional editor on demand.",
    author: "Chloe L.",
    title: "Lifestyle Influencer",
    avatar: "/images/avatars/chloe.jpg", // Placeholder image path
    social: "@ChloeLifeStyle",
  },
  {
    quote: "From idea to publish in less than 5 minutes. Itnavideo has unlocked a new level of productivity for my agency clients.",
    author: "David R.",
    title: "Marketing Agency Owner",
    avatar: "/images/avatars/david.jpg", // Placeholder image path
    social: "@DigitalGrowth",
  },
  {
    quote: "Finally, an AI tool that truly understands storytelling. My tutorials are more engaging, and my audience loves the dynamic visuals.",
    author: "Sarah P.",
    title: "Tech Reviewer",
    avatar: "/images/avatars/sarah.jpg", // Placeholder image path
    social: "@GadgetGuru",
  },
];

export default function TestimonialSection() {
  return (
    <section className="py-32 px-6 bg-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-pink-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white mb-6"
          >
            What Our <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">
              Creators Say
            </span>
          </motion.h2>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            Hear from AI creators who are transforming their content strategy with Itnavideo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-sm hover:border-purple-500/30 transition-all group"
            >
              <Quote size={32} className="text-purple-400 mb-6 group-hover:scale-110 transition-transform" />
              <p className="text-white text-lg leading-relaxed mb-6 font-medium">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                {testimonial.avatar ? (
                  <img src={testimonial.avatar} alt={testimonial.author} className="w-12 h-12 rounded-full object-cover border border-purple-500/50" />
                ) : (
                  <UserCircle size={48} className="text-zinc-500" />
                )}
                <div>
                  <p className="text-white font-semibold">{testimonial.author}</p>
                  <p className="text-zinc-400 text-sm">{testimonial.title}</p>
                  {testimonial.social && <p className="text-purple-300 text-xs mt-0.5">{testimonial.social}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}