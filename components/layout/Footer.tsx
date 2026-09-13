'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronDown, 
  Linkedin, 
  Instagram, 
  Youtube, 
  UserRound, 
  Twitter, 
  Facebook,
  Mail,
  ArrowUpRight
} from 'lucide-react';
import BrandLogo from '@/components/brand/BrandLogo';

const footerGroups = [
  {
    title: 'Product',
    links: [
      { label: 'Platform Features', href: '/features' },
      { label: 'Video Workflows', href: '/video-types' },
      { label: 'Pricing & Credits', href: '/pricing' },
      { label: 'AI Studio Dashboard', href: '/dashboard' },
      { label: 'AI Audio Cleaner', href: '/tools/ai-audio-cleaner' },
      { label: 'Audio to MP3 Tool', href: '/wav-to-mp3' },
    ],
  },
  {
    title: 'Video Types',
    links: [
      { label: 'Auto Caption Generator', href: '/auto-caption-generator' },
      { label: 'Faceless Video Maker', href: '/faceless-video' },
      { label: 'Compare Explainer Video', href: '/video-types/compare-explainer' },
      { label: 'Long Video Clips & Promo', href: '/long-video-clips' },
      { label: 'Whiteboard Video', href: '/video-types/whiteboard-video' },
      { label: 'Kinetic Typography Video', href: '/video-types/typography-video' },
      { label: 'Explore All Workflows', href: '/video-types' },
    ],
  },
  {
    title: 'Use Cases',
    links: [
      { label: 'For Creators & Influencers', href: '/ai-reel-generator' },
      { label: 'For E-Commerce & Brands', href: '/ecommerce-video-maker' },
      { label: 'For Educators & Teachers', href: '/educational-video-maker' },
      { label: 'For Podcasters & Streamers', href: '/podcast-clips-generator' },
      { label: 'Instagram Reels Maker', href: '/instagram-reels-maker' },
      { label: 'YouTube Shorts Generator', href: '/youtube-shorts-generator' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Itnavideo', href: '/about' },
      { label: 'Contact Support', href: '/contact' },
      { label: 'Careers', href: '/careers' },
      { label: 'Official Blog', href: '/blog' },
      { label: 'Platform Facts & Specs', href: '/ai-platform-facts' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

const socialLinks = [
  { label: 'X (Twitter)', href: 'https://x.com/itnavideo', icon: Twitter },
  { label: 'Facebook', href: 'https://www.facebook.com/itnavideo', icon: Facebook },
  { label: 'Instagram', href: 'https://www.instagram.com/itnavideo/', icon: Instagram },
  { label: 'YouTube', href: 'https://www.youtube.com/@Itnavideo', icon: Youtube },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/itnavideo-ai/', icon: Linkedin },
  { label: 'Founder Profile', href: 'https://www.linkedin.com/in/syedrohi/', icon: UserRound },
];

export default function Footer() {
  return (
    <footer className="relative w-full border-t border-white/10 bg-[#08070B] text-zinc-300 overflow-hidden">
      {/* M3 Ambient Top Glow */}
      <div 
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(249,115,22,0.06),transparent_70%)]" 
        aria-hidden="true" 
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        {/* Main Grid - Desktop */}
        <div className="hidden md:grid md:grid-cols-6 md:gap-10 lg:gap-12">
          {/* Brand & Summary */}
          <div className="col-span-2 space-y-5">
            <BrandLogo size="md" showTagline />
            <p className="max-w-sm text-xs leading-relaxed text-zinc-400">
              AI video creation engine from audio, video, or text scripts. Built for viral Reels, Shorts, and automated creator production workflows.
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <a 
                href="mailto:rohi@itnavideo.com" 
                className="inline-flex items-center gap-2 text-xs font-semibold text-orange-400 transition hover:text-orange-300"
              >
                <Mail size={13} className="text-orange-400/80" />
                rohi@itnavideo.com
              </a>
              <span className="text-[11px] text-zinc-500">
                Support · Inquiries · Collaborations
              </span>
            </div>

            {/* M3 Circular Tonal Social Buttons */}
            <div className="flex items-center gap-2 pt-2">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a 
                    key={item.label} 
                    href={item.href} 
                    target="_blank" 
                    rel="me noopener noreferrer" 
                    aria-label={item.label} 
                    title={item.label} 
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 transition duration-200 hover:border-orange-500/40 hover:bg-white/[0.08] hover:text-orange-400 active:scale-95"
                  >
                    <Icon size={14} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Columns */}
          {footerGroups.map((group) => (
            <div key={group.title} className="space-y-4">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-100">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-xs text-zinc-400 transition duration-200 hover:translate-x-0.5 hover:text-orange-400"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight 
                        size={11} 
                        className="ml-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 text-orange-400" 
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile View - M3 Accordion */}
        <div className="md:hidden space-y-6">
          <div className="space-y-4">
            <BrandLogo size="md" showTagline />
            <p className="text-xs leading-relaxed text-zinc-400">
              AI video creation engine from audio, video, or text scripts. Built for viral Reels, Shorts, and creator workflows.
            </p>
            <div className="flex items-center gap-2">
              <a 
                href="mailto:rohi@itnavideo.com" 
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400"
              >
                <Mail size={13} />
                rohi@itnavideo.com
              </a>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a 
                    key={item.label} 
                    href={item.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label={item.label} 
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:border-orange-500/40 hover:text-orange-400 active:scale-95"
                  >
                    <Icon size={14} />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="divide-y divide-white/5 border-y border-white/10 rounded-2xl bg-zinc-950/60 px-4">
            {footerGroups.map((group) => (
              <FooterAccordion key={group.title} title={group.title} links={group.links} />
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-[11px] text-zinc-500 sm:flex-row">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Engine: 30 FPS Operational
            </span>
            <span>© 2026 Itnavideo AI. Bangalore, India.</span>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <Link href="/privacy" className="transition hover:text-zinc-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-zinc-200">
              Terms of Service
            </Link>
            <Link href="/contact" className="transition hover:text-zinc-200">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterAccordion({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3.5 text-xs font-semibold text-zinc-200"
        type="button"
      >
        <span>{title}</span>
        <ChevronDown 
          size={14} 
          className={`text-zinc-400 transition-transform duration-200 ${open ? 'rotate-180 text-orange-400' : ''}`} 
        />
      </button>
      {open ? (
        <ul className="space-y-2.5 pb-4 pl-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link 
                href={link.href} 
                className="flex items-center text-xs text-zinc-400 transition hover:text-orange-400"
              >
                <span>{link.label}</span>
                <ArrowUpRight size={10} className="ml-1 opacity-70 text-orange-400" />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
