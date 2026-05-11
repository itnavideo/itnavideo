'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { Video, Twitter, Github, Linkedin, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Types for better maintainability
type SubscriptionStatus = 'idle' | 'loading' | 'success' | 'error';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubscriptionStatus>('idle');

  const handleSubscribe = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail || status === 'loading') return;

    setStatus('loading');

    try {
      // Newsletter collection
      await addDoc(collection(db, 'newsletter'), {
        email: trimmedEmail,
        subscribedAt: serverTimestamp(),
        source: 'footer_newsletter',
        active: true
      });

      setEmail('');
      setStatus('success');
      setTimeout(() => setStatus('idle'), 4000);
    } catch (error) {
      console.error("Newsletter error:", error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  }, [email, status]);

  return (
    <footer className="w-full bg-black border-t border-white/5 pt-20 pb-10 px-6">
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 pb-16 border-b border-white/5">
        <div className="max-w-md">
          <h3 className="text-white font-bold text-xl mb-2 tracking-tight">Stay updated</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Get the latest news on AI video features and cinematic tools directly in your inbox.
          </p>
        </div>
        
        <form className="flex flex-col w-full md:w-auto gap-3" onSubmit={handleSubscribe}>
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all w-full md:w-72 placeholder:text-zinc-600"
              required
              disabled={status === 'loading'}
              autoComplete="email"
            />
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="relative bg-white text-black text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-zinc-200 transition-all whitespace-nowrap active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden min-w-[120px]"
            >
              <span className={status === 'loading' ? 'opacity-0' : 'opacity-100'}>
                {status === 'success' ? 'Subscribed!' : 'Subscribe'}
              </span>
              {status === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              )}
            </button>
          </div>
          
          {/* Status Messages */}
          <div className="h-4"> {/* Fixed height to prevent layout shift */}
            {status === 'success' && (
              <p className="text-purple-400 text-xs font-medium animate-in fade-in slide-in-from-top-1">
                Welcome to the future of video! 🎉
              </p>
            )}
            {status === 'error' && (
              <p className="text-red-500 text-xs font-medium animate-in fade-in">
                Please try a different email or check your connection.
              </p>
            )}
          </div>
        </form>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
        {/* Brand Section */}
        <div className="col-span-2">
          <Link href="/" className="text-2xl font-extrabold text-white flex items-center gap-2 mb-6 group">
            <div className="bg-purple-600 p-1.5 rounded-lg group-hover:rotate-6 transition-transform">
              <Video size={18} fill="white" />
            </div>
            <span className="tracking-tighter">Itna<span className="text-purple-500">video</span></span>
          </Link>
          <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
            The AI operating system for modern creators. Turn your voice into cinematic videos in seconds.
          </p>
          <div className="flex gap-5 mt-8">
            <Twitter size={18} className="text-zinc-500 hover:text-white cursor-pointer transition-colors" />
            <Github size={18} className="text-zinc-500 hover:text-white cursor-pointer transition-colors" />
            <Linkedin size={18} className="text-zinc-500 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Links: Column logic remains same but with refined typography */}
        {['Product', 'Resources', 'Company'].map((title) => (
          <div key={title}>
            <h4 className="text-white font-semibold mb-6 text-[11px] uppercase tracking-[0.2em]">{title}</h4>
            <ul className="space-y-4 text-zinc-500 text-sm">
              {title === 'Product' && (
                <>
                  <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
                  <li><Link href="/#ai-voice" className="hover:text-white transition-colors">AI Voice</Link></li>
                  <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                </>
              )}
              {title === 'Resources' && (
                <>
                  <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                  <li><Link href="/blog" className="hover:text-white transition-colors">AI Blog</Link></li>
                  <li><Link href="/community" className="hover:text-white transition-colors">Discord</Link></li>
                </>
              )}
              {title === 'Company' && (
                <>
                  <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                </>
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-zinc-600 font-medium">
        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
          <p>© 2026 Itnavideo Inc.</p>
          <span className="hidden md:inline text-zinc-800">|</span>
          <p>Delaware, USA</p>
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/admin/login" className="hover:text-zinc-400 transition-colors uppercase tracking-wider">Internal Access</Link>
          <span className="text-zinc-800">•</span>
          <span className="text-zinc-500">Scale your vision 🚀</span>
        </div>
      </div>
    </footer>
  );
}