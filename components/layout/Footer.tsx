'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Linkedin, Instagram, Youtube, UserRound } from 'lucide-react';
import BrandLogo from '@/components/brand/BrandLogo';

const footerGroups = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Templates', href: '/templates' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    title: 'Templates',
    links: [
      { label: 'Auto Caption Reel', href: '/templates/auto-caption-reel' },
      { label: 'Compare Explainer', href: '/templates/compare-explainer' },
      { label: 'Long Video Promo', href: '/templates/long-video-promo' },
      { label: 'Dynamic Creator Reel', href: '/templates/dynamic-creator-reel' },
      { label: 'Auto Draw Explainer', href: '/templates/auto-draw-explainer' },
      { label: 'View all templates', href: '/templates' },
    ],
  },
  {
    title: 'Use Cases',
    links: [
      { label: 'For Creators', href: '/ai-reel-generator' },
      { label: 'For Businesses', href: '/ecommerce-product-video-maker' },
      { label: 'For Educators', href: '/whiteboard-video-maker' },
      { label: 'For Podcasters', href: '/youtube-video-promo-maker' },
      { label: 'Instagram Reels', href: '/instagram-reels-maker' },
      { label: 'YouTube Shorts', href: '/youtube-shorts-generator' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/itnavideo/', icon: Instagram },
  { label: 'YouTube', href: 'https://www.youtube.com/@Itnavideo', icon: Youtube },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/itnavideo-ai/', icon: Linkedin },
  { label: 'Founder', href: 'https://www.linkedin.com/in/syedrohi/', icon: UserRound },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 px-4 pb-10 pt-16 sm:px-6" style={{ background: 'var(--bg-darkest)' }}>
      <div className="mx-auto max-w-7xl">
        {/* Main grid - desktop */}
        <div className="hidden md:grid md:grid-cols-6 md:gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <BrandLogo size="md" showTagline />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-400">
              AI video creation from audio, video, or text. Built for Reels, Shorts, and creator workflows.
            </p>
            <a href="mailto:rohi@itnavideo.com" className="mt-4 inline-block text-sm font-semibold text-brand-mint transition hover:text-white">
              rohi@itnavideo.com
            </a>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label} className="text-zinc-500 transition hover:text-white">
                    <Icon size={17} />
                  </a>
                );
              })}
            </div>
          </div>
          {/* Link columns */}
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h4
                className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em]"
                style={{ color: group.title === 'Templates' ? 'var(--color-secondary-light)' : '#FFFFFF' }}
              >
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition"
                      style={{ fontSize: '13px', color: 'var(--text-dark-secondary)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary-hover)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dark-secondary)'; }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile - Accordion */}
        <div className="md:hidden">
          {/* Brand */}
          <div className="mb-8">
            <BrandLogo size="md" showTagline />
            <p className="mt-3 text-sm text-zinc-400">AI video creation for Reels, Shorts, and creator workflows.</p>
            <div className="mt-4 flex gap-4">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label} className="text-zinc-500 transition hover:text-white">
                    <Icon size={17} />
                  </a>
                );
              })}
            </div>
          </div>
          {/* Accordion groups */}
          {footerGroups.map((group) => (
            <FooterAccordion key={group.title} title={group.title} links={group.links} />
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-3 border-t border-white/5 pt-8 text-[11px] text-zinc-600 sm:flex-row sm:justify-between">
          <p>© 2026 Itnavideo Inc. Delaware, USA.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition hover:text-white">Privacy</Link>
            <Link href="/terms" className="transition hover:text-white">Terms</Link>
            <Link href="/contact" className="transition hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterAccordion({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-sm font-bold text-white"
        type="button"
      >
        {title}
        <ChevronDown size={16} className={`text-zinc-500 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? (
        <ul className="space-y-3 pb-4 pl-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-sm text-zinc-500 transition hover:text-white">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
