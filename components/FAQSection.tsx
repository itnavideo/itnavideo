import React from 'react';

export default function FAQSection() {
  const faqs = [
    { q: "How does it work?", a: "Simply upload your voice recording, and our AI handles the rest - from captioning to scene selection." },
    { q: "What platforms are supported?", a: "We currently optimize for Instagram Reels, TikTok, and YouTube Shorts (9:16 aspect ratio)." },
    { q: "Can I use my own footage?", a: "Yes, you can upload your own clips or let our AI suggest B-roll for you." }
  ];

  return (
    <section className="py-24 px-6 bg-black">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
              <h3 className="text-xl font-bold mb-2">{faq.q}</h3>
              <p className="text-zinc-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}