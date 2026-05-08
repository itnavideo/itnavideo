import React from 'react';
import { 
  Play, Video, Zap, Smartphone, ArrowRight, Star, 
  CheckCircle2, MessageSquare, ShieldCheck, Sparkles, PlusCircle 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-blue-500/30">
      {/* Background Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 px-6 py-4 md:px-12 flex items-center justify-between">
        <div className="text-2xl font-black tracking-tighter italic bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          ITNA<span className="text-blue-500">VIDEO</span>.AI
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-400">
          <a href="#how-it-works" className="hover:text-white transition">How it Works</a>
          <a href="#showcase" className="hover:text-white transition">Showcase</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
        </div>
        <button className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-500 hover:text-white transition-all">
          Get Started
        </button>
      </nav>

      {/* 1. HERO SECTION */}
      <main className="relative flex flex-col items-center justify-center text-center px-4 pt-24 pb-20">
        <div className="animate-bounce inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full mb-8">
          <Sparkles size={14} className="text-blue-400" />
          <span className="text-[10px] md:text-xs font-bold tracking-widest text-blue-400 uppercase">New: Text-to-Video 2.0</span>
        </div>
        
        <h1 className="text-6xl md:text-[110px] font-black tracking-tighter mb-8 leading-[0.85]">
          STOP EDITING.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-600">
            START CREATING.
          </span>
        </h1>

        <p className="max-w-2xl text-gray-400 text-lg md:text-xl mb-12 leading-relaxed">
          The world's first AI video engine designed for creators. Turn your wildest ideas into viral shorts, reels, and cinematic videos in seconds.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto px-6">
          <button className="group bg-blue-600 text-white px-10 py-5 rounded-2xl font-black flex items-center justify-center space-x-3 hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all">
            <span>START FOR FREE</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </main>

      {/* 2. REELS/SHORTS SHOWCASE */}
      <section id="showcase" className="py-24 px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-4">MADE WITH ITNAVIDEO</h2>
          <p className="text-gray-500 uppercase tracking-widest text-sm font-bold">Scroll to explore viral formats</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[9/16] rounded-[32px] bg-white/5 border border-white/10 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold tracking-tighter">AI Creator #{i}</span>
                </div>
                <p className="text-xs text-gray-400">"Generated from: A futuristic city in rain..."</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                 <Play fill="white" size={48} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS (INSTRUCTIONS) */}
      <section id="how-it-works" className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-20 italic">HOW IT WORKS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            <InstructionStep 
              number="01" 
              title="Write Prompt" 
              desc="Just type what you want to see. Our AI understands emotion and cinematic styles." 
            />
            <InstructionStep 
              number="02" 
              title="Choose Style" 
              desc="Select from Realistic, Anime, 3D, or Cinematic 4K presets." 
            />
            <InstructionStep 
              number="03" 
              title="Export & Go" 
              desc="Your video is ready in 60 seconds. One-click export to Reels, Shorts, or YouTube." 
            />
          </div>
        </div>
      </section>

      {/* 4. REVIEWS SECTION */}
      <section className="py-24 px-6 overflow-hidden">
        <h2 className="text-center text-4xl font-black mb-16">LOVED BY CREATORS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <ReviewCard name="Rahul Verma" role="YouTuber" text="ItnaVideo changed my content game. I don't need a cameraman anymore." />
          <ReviewCard name="Sarah J." role="Insta Creator" text="The quality is better than any other AI I've used. Worth every penny." />
          <ReviewCard name="Amit Shah" role="Marketing Head" text="We saved 90% on our ad production costs. This is insane." />
        </div>
      </section>

      {/* 5. PRICING (CONVERSION) */}
      <section id="pricing" className="py-24 px-6 bg-blue-600/5">
        <div className="max-w-4xl mx-auto border border-blue-500/30 rounded-[40px] p-8 md:p-16 bg-gradient-to-b from-blue-500/10 to-transparent">
          <div className="text-center mb-10">
            <h2 className="text-5xl font-black mb-4">CHOOSE YOUR PLAN</h2>
            <p className="text-gray-400">Join the future of video production today.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold mb-2">Free Starter</h3>
              <div className="text-4xl font-black mb-6">$0 <span className="text-sm text-gray-500">/mo</span></div>
              <ul className="space-y-4 mb-8 text-gray-400 text-sm">
                <li className="flex items-center"><CheckCircle2 size={16} className="mr-2 text-green-500"/> 5 AI Videos / Month</li>
                <li className="flex items-center"><CheckCircle2 size={16} className="mr-2 text-green-500"/> 720p Quality</li>
                <li className="flex items-center"><CheckCircle2 size={16} className="mr-2 text-green-500"/> Watermark</li>
              </ul>
              <button className="w-full py-3 rounded-xl border border-white/20 font-bold hover:bg-white/10 transition">Start Free</button>
            </div>
            <div className="p-8 rounded-3xl bg-blue-600 border border-blue-400 shadow-[0_0_40px_rgba(37,99,235,0.2)]">
              <h3 className="text-xl font-bold mb-2 text-white">Pro Creator</h3>
              <div className="text-4xl font-black mb-6 text-white">$29 <span className="text-sm text-blue-200">/mo</span></div>
              <ul className="space-y-4 mb-8 text-blue-100 text-sm">
                <li className="flex items-center"><CheckCircle2 size={16} className="mr-2"/> Unlimited AI Videos</li>
                <li className="flex items-center"><CheckCircle2 size={16} className="mr-2"/> 4K Ultra HD Quality</li>
                <li className="flex items-center"><CheckCircle2 size={16} className="mr-2"/> Commercial License</li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-white text-blue-600 font-black hover:bg-gray-100 transition">Go Pro Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-24 max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-black text-center mb-16 italic">FAQS</h2>
        <div className="space-y-6">
          <FAQItem q="Do I need technical skills?" a="Not at all! If you can type a text message, you can create a video on ItnaVideo.AI." />
          <FAQItem q="Can I use videos for YouTube?" a="Yes! Pro plan users get a full commercial license for YouTube, Instagram, and TikTok." />
          <FAQItem q="Is it better than Sora or Runway?" a="We focus specifically on social media formats (Reels/Shorts) with 10x faster rendering." />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 text-center px-6">
        <div className="text-xl font-black mb-4">ITNAVIDEO.AI</div>
        <p className="text-gray-500 text-sm">© 2024 itnavideo. All rights reserved. Made for the dreamers.</p>
      </footer>
    </div>
  );
}

function InstructionStep({ number, title, desc }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-6xl font-black text-white/5 mb-[-30px] z-0">{number}</div>
      <h3 className="text-2xl font-bold mb-4 z-10">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function ReviewCard({ name, role, text }) {
  return (
    <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all">
      <div className="flex text-yellow-500 mb-4">
        {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" />)}
      </div>
      <p className="text-gray-300 italic mb-6">"{text}"</p>
      <div>
        <div className="font-bold">{name}</div>
        <div className="text-blue-500 text-xs font-bold uppercase tracking-tighter">{role}</div>
      </div>
    </div>
  );
}

function FAQItem({ q, a }) {
  return (
    <div className="border-b border-white/5 pb-6">
      <h3 className="text-lg font-bold mb-3">{q}</h3>
      <p className="text-gray-400 text-sm">{a}</p>
    </div>
  );
}