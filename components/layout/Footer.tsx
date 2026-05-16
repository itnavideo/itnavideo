'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { Twitter, Github, Linkedin, Instagram, Loader2 } from 'lucide-react';
import BrandLogo from '@/components/brand/BrandLogo';

// Types for better maintainability
type SubscriptionStatus = 'idle' | 'loading' | 'success' | 'error';

const footerGroups = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'AI Voice', href: '/features#features' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'AI Blog', href: '/blog' },
      { label: 'Discord', href: '/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our Story', href: '/about' },
      { label: 'Careers', href: '/careers', badge: 'Hiring' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubscriptionStatus>('idle');

  const handleSubscribe = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail || status === 'loading') return;

    setStatus('loading');

    try {
      await submitLead({
        kind: 'newsletter',
        email: trimmedEmail,
        source: 'footer_newsletter',
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
              className="bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-mint/50 transition-all w-full md:w-72 placeholder:text-zinc-600"
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
              <p className="text-brand-mint text-xs font-medium animate-in fade-in slide-in-from-top-1">
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
          <div className="mb-6">
            <BrandLogo size="md" showTagline />
          </div>
          <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
            AI short-form video creation for faceless voiceovers and face-camera edits, powered by a private cloud media engine.
          </p>
          <div className="flex gap-5 mt-8">
            <a
              href="https://www.instagram.com/itnavideo?igsh=dWY3OWVyeDRzbDVh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Itnavideo on Instagram"
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <Instagram size={18} />
            </a>
            <a href="#" aria-label="Itnavideo on X" className="text-zinc-500 hover:text-white transition-colors">
              <Twitter size={18} />
            </a>
            <a href="#" aria-label="Itnavideo community" className="text-zinc-500 hover:text-white transition-colors">
              <Github size={18} />
            </a>
            <a href="#" aria-label="Itnavideo on LinkedIn" className="text-zinc-500 hover:text-white transition-colors">
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        {/* Links: Column logic remains same but with refined typography */}
        {footerGroups.map((group) => (
          <div key={group.title}>
            <h4 className="text-white font-semibold mb-6 text-[11px] uppercase tracking-[0.2em]">{group.title}</h4>
            <ul className="space-y-4 text-zinc-500 text-sm">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="inline-flex items-center gap-2 transition-colors hover:text-white">
                    <span>{link.label}</span>
                    {'badge' in link && link.badge ? (
                      <span className="rounded-md bg-brand-mint px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-black">
                        {link.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
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
          <span className="text-zinc-500">Scale your vision</span>
        </div>
      </div>
    </footer>
  );
}

async function submitLead(input: { kind: 'newsletter'; email: string; source: string }) {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(data.details || data.error || 'Newsletter signup failed.');
  }
}
