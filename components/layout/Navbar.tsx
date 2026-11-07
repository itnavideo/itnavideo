'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  Sparkles,
  LayoutDashboard,
  LogOut,
  User,
  CreditCard,
  X,
  Smartphone,
  Captions,
  Film,
  MonitorPlay,
  Mic,
  PenTool,
  FileText,
  Tv,
  Scissors,
  Columns,
  BookOpen,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import BrandLogo from '@/components/brand/BrandLogo';

const SHORT_STUDIOS = [
  { label: 'Auto Caption Generator', desc: 'Kinetic animated captions for Reels & Shorts', href: '/auto-caption-generator', icon: Smartphone, emoji: '💬' },
  { label: 'Faceless Shorts', desc: 'Auto B-roll, voiceovers & captions', href: '/faceless-shorts', icon: Film, emoji: '🎬' },
  { label: 'Whiteboard Animation', desc: 'Stickman & sketch doodle explainers', href: '/whiteboard-video', icon: PenTool, emoji: '✏️' },
  { label: 'Compare Explainer', desc: 'Side-by-side comparison video generator', href: '/compare-explainer', icon: Columns, emoji: '⚖️' },
  { label: 'Long Video to Clips', desc: 'Cut viral shorts from long YouTube videos', href: '/long-video-clips', icon: Scissors, emoji: '✂️' },
  { label: 'Long Video Promo', desc: 'Turn YouTube videos into viral promo Shorts', href: '/long-video-promo', icon: Tv, emoji: '📺' },
];

const WIDESCREEN_STUDIOS = [
  { label: 'Faceless Long Video', desc: 'AI documentary & cinematic stories', href: '/faceless-video', icon: MonitorPlay, emoji: '🎥' },
  { label: 'Book Summary Video', desc: 'Turn book narration into cinematic lesson cards', href: '/book-summary', icon: BookOpen, emoji: '📚' },
  { label: 'Image to Video AI', desc: 'Animate photos into cinematic video beats', href: '/image-to-video-ai', icon: Film, emoji: '🎞️' },
  { label: 'YouTube Subtitles', desc: '1080p Full HD burnt-in subtitles for podcasts', href: '/video-types/youtube-subtitle-generator', icon: Captions, emoji: '📝' },
  { label: 'AI Audio Cleaner', desc: 'Studio voice cleanup & mistake detection', href: '/ai-audio-cleaner', icon: Mic, emoji: '🎙️' },
];

const RESOURCE_ITEMS = [
  { label: 'Video Types & Specs', desc: 'Master directory & specs for all video studios', href: '/video-types', icon: BookOpen },
  { label: 'Official Blog', desc: 'In-depth creator guides, strategies & growth breakdowns', href: '/blog', icon: FileText },
  { label: 'Pricing & Credit Packs', desc: 'Flexible credit packages with zero monthly expiry', href: '/pricing', icon: CreditCard },
  { label: 'About Itnavideo', desc: 'Our mission and cloud video rendering engine', href: '/about', icon: Sparkles },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileStudiosOpen, setMobileStudiosOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'products' | 'resources' | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const isDashboard = pathname.startsWith('/dashboard');
  const isLightPage = !isDashboard;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const toggleMenu = (menu: 'products' | 'resources') => {
    setUserMenuOpen(false);
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  const toggleUserMenu = () => {
    setActiveMenu(null);
    setUserMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
    setMobileStudiosOpen(false);
  };

  return (
    <>
      <header
        ref={navRef}
        className={`sticky top-0 z-50 w-full transition-all duration-300 px-4 py-3.5 md:px-8 border-b ${isLightPage
            ? scrolled
              ? 'border-slate-200 bg-white/95 text-slate-900 backdrop-blur-md shadow-xs'
              : 'border-slate-100 bg-white text-slate-900'
            : 'border-white/10 bg-black text-white'
          }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          {/* LEFT: BRAND LOGO */}
          <div className="flex items-center gap-10">
            <BrandLogo size="sm" showBadge={false} variant={isLightPage ? 'light' : 'dark'} />

            {/* DESKTOP NAVIGATION LINKS */}
            {!isDashboard && (
              <nav className={`hidden lg:flex items-center gap-7 text-sm font-medium ${isLightPage ? 'text-slate-700' : 'text-zinc-300'}`}>

                {/* 1. Products Mega Menu Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleMenu('products')}
                    className={`flex items-center gap-1 transition cursor-pointer py-1 font-semibold ${activeMenu === 'products'
                        ? 'text-[#0066FF] font-bold'
                        : isLightPage
                          ? 'text-slate-800 hover:text-[#0066FF]'
                          : 'text-zinc-300 hover:text-white'
                      }`}
                  >
                    <span>Products</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${activeMenu === 'products' ? 'rotate-180 text-[#0066FF]' : 'text-slate-400'
                      }`} />
                  </button>

                  {activeMenu === 'products' && (
                    <div
                      style={{ backgroundColor: '#ffffff', opacity: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', zIndex: 60 }}
                      className="absolute left-0 top-full mt-2 w-[540px] sm:w-[560px] bg-white rounded-2xl border border-gray-200/90 shadow-2xl p-5 z-50 text-slate-900 animate-in fade-in zoom-in-95 duration-150"
                    >
                      {/* 2 Column Layout for Studios */}
                      <div className="grid grid-cols-2 gap-4 pb-3">
                        {/* Column 1: Short Video Studios (9:16) */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-extrabold text-[#0066FF] uppercase tracking-wider block px-1">
                            📱 9:16 Shorts &amp; Reels
                          </span>

                          {SHORT_STUDIOS.map((studio) => (
                            <Link
                              key={studio.label}
                              href={studio.href}
                              onClick={() => setActiveMenu(null)}
                              className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-blue-50/70 transition-colors group"
                            >
                              <span className="p-2 bg-blue-50 text-blue-600 rounded-lg text-base flex items-center justify-center shrink-0">
                                {studio.emoji}
                              </span>
                              <div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors leading-snug">
                                  {studio.label}
                                </h4>
                                <p className="text-[11px] text-gray-500 font-medium leading-tight mt-0.5">{studio.desc}</p>
                              </div>
                            </Link>
                          ))}
                        </div>

                        {/* Column 2: Widescreen & Long Form (16:9) */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider block px-1">
                            🖥️ 16:9 Cinema &amp; Long-Form
                          </span>

                          {WIDESCREEN_STUDIOS.map((studio) => (
                            <Link
                              key={studio.label}
                              href={studio.href}
                              onClick={() => setActiveMenu(null)}
                              className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-blue-50/70 transition-colors group"
                            >
                              <span className="p-2 bg-slate-100 text-slate-700 rounded-lg text-base flex items-center justify-center shrink-0">
                                {studio.emoji}
                              </span>
                              <div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors leading-snug">
                                  {studio.label}
                                </h4>
                                <p className="text-[11px] text-gray-500 font-medium leading-tight mt-0.5">{studio.desc}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Banner */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs px-2 -mx-2 -mb-2 bg-slate-50/90 rounded-b-xl p-3">
                        <span className="text-[11px] font-semibold text-gray-600 hidden sm:inline">
                          ⚡ 1080p Cloud Render • All 10 Video Studios
                        </span>
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          <Link
                            href="/video-types"
                            onClick={() => setActiveMenu(null)}
                            className="font-bold text-slate-700 hover:text-[#0066FF] flex items-center gap-1 text-xs transition-colors"
                          >
                            <span>Browse All Video Types &amp; Specs</span>
                            <ArrowRight size={13} />
                          </Link>
                          <span className="text-slate-300">|</span>
                          <Link
                            href="/dashboard"
                            onClick={() => setActiveMenu(null)}
                            className="font-bold text-[#0066FF] hover:text-[#0052CC] flex items-center gap-1 text-xs"
                          >
                            <span>Open Dashboard</span>
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Features */}
                <Link
                  href="/features"
                  className={`transition font-semibold ${isActive('/features')
                      ? 'text-[#0066FF] font-bold'
                      : isLightPage
                        ? 'text-slate-800 hover:text-[#0066FF]'
                        : 'text-zinc-300 hover:text-white'
                    }`}
                >
                  Features
                </Link>

                {/* 3. Pricing */}
                <Link
                  href="/pricing"
                  className={`transition font-semibold ${isActive('/pricing')
                      ? 'text-[#0066FF] font-bold'
                      : isLightPage
                        ? 'text-slate-800 hover:text-[#0066FF]'
                        : 'text-zinc-300 hover:text-white'
                    }`}
                >
                  Pricing
                </Link>

                {/* 4. Blog (Direct Top Level Link) */}
                <Link
                  href="/blog"
                  className={`transition font-semibold ${isActive('/blog')
                      ? 'text-[#0066FF] font-bold'
                      : isLightPage
                        ? 'text-slate-800 hover:text-[#0066FF]'
                        : 'text-zinc-300 hover:text-white'
                    }`}
                >
                  Blog
                </Link>

                {/* 5. Resources Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleMenu('resources')}
                    className={`flex items-center gap-1 transition cursor-pointer py-1 font-semibold ${activeMenu === 'resources'
                        ? 'text-[#0066FF] font-bold'
                        : isLightPage
                          ? 'text-slate-800 hover:text-[#0066FF]'
                          : 'text-zinc-300 hover:text-white'
                      }`}
                  >
                    <span>Resources</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${activeMenu === 'resources' ? 'rotate-180 text-[#0066FF]' : 'text-slate-400'
                      }`} />
                  </button>

                  {activeMenu === 'resources' && (
                    <div
                      style={{ backgroundColor: '#ffffff', opacity: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', zIndex: 60 }}
                      className="absolute left-0 top-full mt-2 w-80 rounded-2xl border border-gray-200/90 bg-white p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 text-gray-900"
                    >
                      <div className="space-y-1">
                        {RESOURCE_ITEMS.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.label}
                              href={item.href}
                              onClick={() => setActiveMenu(null)}
                              className="flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-blue-50/70 group"
                            >
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-200/80 bg-blue-50 text-[#0066FF] group-hover:bg-[#0066FF] group-hover:text-white group-hover:border-transparent transition">
                                <Icon size={16} />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors">
                                  {item.label}
                                </p>
                                <p className="text-[11px] font-medium leading-snug mt-0.5 text-gray-500">
                                  {item.desc}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

              </nav>
            )}
          </div>

          {/* RIGHT SIDE: AUTH & CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={toggleUserMenu}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 transition text-left cursor-pointer shadow-2xs ${isLightPage
                      ? 'border-slate-200 bg-slate-100 hover:bg-slate-200'
                      : 'border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-purple-500/50'
                    }`}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white font-black text-xs shadow-xs">
                    {user?.email ? user.email.charAt(0).toUpperCase() : <User size={13} />}
                  </div>
                  <span className={`max-w-[110px] truncate text-xs font-bold capitalize ${isLightPage ? 'text-slate-900' : 'text-white'
                    }`}>
                    {user?.displayName || (user?.email?.split('@')[0] ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1) : 'Creator')}
                  </span>
                  <ChevronDown size={12} className={`transition-transform duration-200 ${isLightPage ? 'text-slate-500' : 'text-zinc-400'
                    } ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div
                    style={{ backgroundColor: '#ffffff', opacity: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', zIndex: 60 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-gray-200/90 bg-white p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-900"
                  >
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Signed in as</p>
                      <p className="text-xs font-black truncate text-slate-900">{user?.email}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                    >
                      <LayoutDashboard size={14} className="text-[#0066FF]" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      href="/billing"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                    >
                      <CreditCard size={14} className="text-[#0066FF]" />
                      <span>Billing &amp; Videos</span>
                    </Link>

                    <div className="mt-1 pt-1 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => { setUserMenuOpen(false); void logout(); }}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      >
                        <LogOut size={14} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className={`text-sm font-semibold transition px-2 py-1 ${isLightPage ? 'text-slate-700 hover:text-slate-900' : 'text-zinc-300 hover:text-white'
                    }`}
                >
                  Log In
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0052CC] via-[#0066FF] to-[#2563EB] px-5 sm:px-6 py-2.5 text-xs font-black text-white shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:brightness-110 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                >
                  <Sparkles size={13} className="fill-white stroke-white" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            type="button"
            className={`relative flex h-10 w-10 items-center justify-center rounded-2xl border shadow-xs active:scale-95 transition-all duration-300 hover:border-blue-500/50 lg:hidden cursor-pointer ${isLightPage
                ? 'border-slate-200 bg-slate-50 text-slate-900'
                : 'border-white/10 bg-[#0F1117] text-white'
              }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="relative flex flex-col justify-between h-[13px] w-[18px]">
              <span
                className={`h-[2px] w-full rounded-full transition-all duration-300 transform origin-left ${isLightPage ? 'bg-slate-900' : 'bg-white'
                  } ${isOpen ? 'rotate-45 translate-x-[2px] -translate-y-[1px] !bg-[#0066FF]' : ''}`}
              />
              <span
                className={`h-[2px] w-[14px] rounded-full transition-all duration-300 ${isLightPage ? 'bg-slate-900' : 'bg-white'
                  } ${isOpen ? 'opacity-0 translate-x-2' : ''}`}
              />
              <span
                className={`h-[2px] w-full rounded-full transition-all duration-300 transform origin-left ${isLightPage ? 'bg-slate-900' : 'bg-white'
                  } ${isOpen ? '-rotate-45 translate-x-[2px] translate-y-[1px] !bg-[#0066FF]' : ''}`}
              />
            </div>
          </button>

        </div>
      </header>

      {/* MOBILE FLYOUT DRAWER — CLEAN FULL-HEIGHT ACCORDION LAYOUT */}
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex flex-col bg-white text-slate-900 lg:hidden animate-in fade-in duration-200">

          {/* Top Brand & Close Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
            <BrandLogo size="sm" showBadge={false} variant="light" />
            <button
              type="button"
              onClick={closeMobileMenu}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Navigation Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">

            {/* 1. Video Studios Accordion */}
            <div className="border-b border-slate-100 pb-2">
              <button
                type="button"
                onClick={() => setMobileStudiosOpen((prev) => !prev)}
                className="flex w-full items-center justify-between py-3 text-base font-bold text-slate-900 hover:text-[#0066FF] transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>Video Studios</span>
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-[#0066FF]">
                    10 Modes
                  </span>
                </span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 transition-transform duration-200 ${mobileStudiosOpen ? 'rotate-180 text-[#0066FF]' : ''
                    }`}
                />
              </button>

              {mobileStudiosOpen && (
                <div className="space-y-4 pt-1 pb-3 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* 9:16 Shorts */}
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0066FF] px-2 block mb-1.5">
                      📱 9:16 Shorts &amp; Reels
                    </span>
                    <div className="space-y-1">
                      {SHORT_STUDIOS.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-blue-50/70 transition"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-base shrink-0">
                            {item.emoji}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{item.label}</p>
                            <p className="text-[11px] text-slate-500 truncate">{item.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* 16:9 Cinema & Long-Form */}
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 px-2 block mb-1.5">
                      🖥️ 16:9 Cinema &amp; Long-Form
                    </span>
                    <div className="space-y-1">
                      {WIDESCREEN_STUDIOS.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-blue-50/70 transition"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-base shrink-0">
                            {item.emoji}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{item.label}</p>
                            <p className="text-[11px] text-slate-500 truncate">{item.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/video-types"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70 text-xs font-bold text-[#0066FF] hover:bg-blue-100 transition"
                  >
                    <span>Browse All 10 Video Types &amp; Specs</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>

            {/* 2. Primary Navigation Links */}
            <nav className="flex flex-col divide-y divide-slate-100">
              <Link
                href="/features"
                onClick={closeMobileMenu}
                className={`flex items-center justify-between py-3.5 text-base font-bold transition-colors ${isActive('/features') ? 'text-[#0066FF]' : 'text-slate-900 hover:text-[#0066FF]'
                  }`}
              >
                <span>Features</span>
                <ChevronRight size={17} className="text-slate-300" />
              </Link>

              <Link
                href="/pricing"
                onClick={closeMobileMenu}
                className={`flex items-center justify-between py-3.5 text-base font-bold transition-colors ${isActive('/pricing') ? 'text-[#0066FF]' : 'text-slate-900 hover:text-[#0066FF]'
                  }`}
              >
                <span>Pricing</span>
                <ChevronRight size={17} className="text-slate-300" />
              </Link>

              <Link
                href="/blog"
                onClick={closeMobileMenu}
                className={`flex items-center justify-between py-3.5 text-base font-bold transition-colors ${isActive('/blog') ? 'text-[#0066FF]' : 'text-slate-900 hover:text-[#0066FF]'
                  }`}
              >
                <span>Blog</span>
                <ChevronRight size={17} className="text-slate-300" />
              </Link>

              <Link
                href="/video-types"
                onClick={closeMobileMenu}
                className={`flex items-center justify-between py-3.5 text-base font-bold transition-colors ${isActive('/video-types') ? 'text-[#0066FF]' : 'text-slate-900 hover:text-[#0066FF]'
                  }`}
              >
                <span>Video Types &amp; Specs</span>
                <ChevronRight size={17} className="text-slate-300" />
              </Link>

              <Link
                href="/about"
                onClick={closeMobileMenu}
                className={`flex items-center justify-between py-3.5 text-base font-bold transition-colors ${isActive('/about') ? 'text-[#0066FF]' : 'text-slate-900 hover:text-[#0066FF]'
                  }`}
              >
                <span>About Us</span>
                <ChevronRight size={17} className="text-slate-300" />
              </Link>

              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className={`flex items-center justify-between py-3.5 text-base font-bold transition-colors ${isActive('/contact') ? 'text-[#0066FF]' : 'text-slate-900 hover:text-[#0066FF]'
                  }`}
              >
                <span>Contact Us</span>
                <ChevronRight size={17} className="text-slate-300" />
              </Link>
            </nav>
          </div>

          {/* Bottom Sticky Action Bar */}
          <div className="p-6 border-t border-slate-100 bg-white shrink-0 space-y-2.5">
            {user ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0052CC] via-[#0066FF] to-[#2563EB] py-3.5 text-sm font-black text-white shadow-lg shadow-blue-500/25 active:scale-98 transition-all"
                >
                  <Sparkles size={16} />
                  <span>Open Dashboard</span>
                  <ArrowRight size={16} />
                </Link>
                <button
                  type="button"
                  onClick={() => { closeMobileMenu(); void logout(); }}
                  className="w-full text-center text-xs font-semibold text-slate-500 py-1.5 hover:text-rose-600 transition cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0052CC] via-[#0066FF] to-[#2563EB] py-3.5 text-sm font-black text-white shadow-lg shadow-blue-500/25 active:scale-98 transition-all"
                >
                  <Sparkles size={16} />
                  <span>Get Started</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="w-full text-center rounded-2xl border border-slate-200 bg-slate-50 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
