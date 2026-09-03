'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Linkedin, Instagram, Youtube, UserRound, Twitter, Facebook } from 'lucide-react';
import BrandLogo from '@/components/brand/BrandLogo';

const footerGroups = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Video Types', href: '/video-types' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    title: 'Video Types',
    links: [
      { label: 'AI Video Generator', href: '/ai-video-generator' },
      { label: 'Auto Caption Generator', href: '/auto-caption-generator' },
      { label: 'Compare Explainer Video', href: '/video-types/compare-explainer' },
      { label: 'Long Video Promo', href: '/video-types/long-video-promo' },
      { label: 'Whiteboard Video', href: '/video-types/whiteboard-video' },
      { label: 'Typography Video', href: '/video-types/typography-video' },
      { label: 'View all video types', href: '/video-types' },
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
  { label: 'X (Twitter)', href: 'https://x.com/itnavideo', icon: Twitter },
  { label: 'Twitter', href: 'https://twitter.com/itnavideo', icon: Twitter },
  { label: 'Facebook Page', href: 'https://www.facebook.com/itnavideo', icon: Facebook },
  { label: 'Instagram', href: 'https://www.instagram.com/itnavideo/', icon: Instagram },
  { label: 'YouTube', href: 'https://www.youtube.com/@Itnavideo', icon: Youtube },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/itnavideo-ai/', icon: Linkedin },
  { label: 'Founder', href: 'https://www.linkedin.com/in/syedrohi/', icon: UserRound },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background text-foreground px-4 pb-12 pt-20 sm:px-6">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main grid - desktop */}
        <div className="hidden md:grid md:grid-cols-6 md:gap-10">
          {/* Brand */}
          <div className="col-span-2 space-y-4">
            <BrandLogo size="md" showTagline />
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              AI video creation from audio, video, or text. Built for Reels, Shorts, and creator workflows.
            </p>
            <a href="mailto:rohi@itnavideo.com" className="inline-block text-xs font-bold text-primary hover:underline transition duration-300">
              rohi@itnavideo.com
            </a>
            <div className="flex gap-4 pt-2">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.href} href={item.href} target="_blank" rel="me noopener noreferrer" aria-label={item.label} title={item.label} className="text-muted-foreground transition hover:text-foreground">
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>
          {/* Link columns */}
          {footerGroups.map((group) => (
            <div key={group.title} className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted-foreground hover:text-primary transition duration-300"
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
          <div className="mb-8 space-y-3">
            <BrandLogo size="md" showTagline />
            <p className="text-xs text-muted-foreground">AI video creation for Reels, Shorts, and creator workflows.</p>
            <div className="flex gap-4">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label} className="text-muted-foreground transition hover:text-foreground">
                    <Icon size={16} />
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
        <div className="mt-16 flex flex-col items-center gap-4 border-t border-border pt-8 text-[10px] font-medium text-muted-foreground sm:flex-row sm:justify-between">
          <p>© 2026 Itnavideo. Bangalore, India.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="transition hover:text-foreground">Terms</Link>
            <Link href="/contact" className="transition hover:text-foreground">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterAccordion({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-xs font-bold text-foreground"
        type="button"
      >
        {title}
        <ChevronDown size={14} className={`text-muted-foreground transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? (
        <ul className="space-y-3 pb-4 pl-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-xs text-muted-foreground transition hover:text-foreground">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
