'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { 
  ChevronDown, 
  Globe, 
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

const PRODUCT_ITEMS = [
  { label: 'Auto Caption Generator', desc: 'Add kinetic animated captions to Reels & Shorts', href: '/dashboard/auto-caption', icon: Smartphone },
  { label: 'YouTube Subtitles', desc: '1080p Full HD subtitles for widescreen videos', href: '/dashboard/youtube-subtitles', icon: Captions },
  { label: 'Image to Video AI', desc: 'Animate photos & images into cinematic video beats', href: '/dashboard/image-to-video-ai', icon: Film },
  { label: 'Faceless Video AI', desc: 'Script-to-video auto B-roll & voiceover generator', href: '/dashboard/faceless-video', icon: MonitorPlay },
  { label: 'AI Audio Cleaner', desc: 'Studio audio noise cleanup & retake detection', href: '/dashboard/audio-cleaner', icon: Mic },
];

const STUDIO_ITEMS = [
  { label: 'Compare Explainer', desc: 'Side-by-side comparison video generator', href: '/dashboard/compare-explainer', icon: Columns },
  { label: 'Whiteboard Video', desc: 'Whiteboard stickman animation explainers', href: '/dashboard/whiteboard-video', icon: PenTool },
  { label: 'Kinetic Motion', desc: '11 dynamic typography kinetic motion presets', href: '/dashboard/kinetic-motion', icon: FileText },
  { label: 'Long Video Promo', desc: 'Turn YouTube videos into viral promo Shorts', href: '/dashboard/long-video-promo', icon: Tv },
  { label: 'Long Video Clips', desc: 'Auto hook detector clips from long videos', href: '/dashboard/long-video-clips', icon: Scissors },
];

const RESOURCE_ITEMS = [
  { label: 'Video Types & Specs', desc: 'Master documentation for all 11 video pipelines', href: '/features', icon: BookOpen },
  { label: 'Pricing & Packs', desc: 'Flexible video credit packages for creators', href: '/pricing', icon: CreditCard },
  { label: 'About Itnavideo', desc: 'Learn about our AI video rendering engine', href: '/about', icon: Sparkles },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'product' | 'studios' | 'resources' | 'lang' | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const isDashboard = pathname.startsWith('/dashboard');
  const isLightPage = pathname.startsWith('/blog');

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

  const toggleMenu = (menu: 'product' | 'studios' | 'resources' | 'lang') => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <>
      <header
        ref={navRef}
        className={`sticky top-0 z-50 w-full transition-all duration-300 px-4 py-3.5 md:px-8 border-b ${
          isLightPage
            ? scrolled
              ? 'border-slate-200 bg-white/95 text-slate-900 backdrop-blur-md shadow-xs'
              : 'border-slate-100 bg-white text-slate-900'
            : 'border-white/10 bg-black text-white'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          {/* LEFT: BRAND LOGO */}
          <div className="flex items-center gap-8">
            <BrandLogo size="sm" showBadge={false} variant={isLightPage ? 'light' : 'auto'} />

            {/* DESKTOP NAVIGATION LINKS */}
            {!isDashboard && (
              <nav className={`hidden lg:flex items-center gap-7 text-sm font-medium ${isLightPage ? 'text-slate-600' : 'text-zinc-300'}`}>
                
                {/* Product Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleMenu('product')}
                    className={`flex items-center gap-1 transition cursor-pointer py-1 ${
                      isLightPage
                        ? activeMenu === 'product' ? 'text-slate-900 font-bold' : 'text-slate-700 hover:text-slate-900'
                        : activeMenu === 'product' ? 'text-white font-semibold' : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    <span>Product</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${
                      isLightPage ? 'text-slate-500' : 'text-zinc-400'
                    } ${activeMenu === 'product' ? 'rotate-180' : ''}`} />
                  </button>

                  {activeMenu === 'product' && (
                    <div className={`absolute left-0 top-full mt-3 w-80 rounded-2xl border p-2 shadow-2xl backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-150 ${
                      isLightPage
                        ? 'border-slate-200 bg-white text-slate-900 shadow-slate-900/10'
                        : 'border-white/10 bg-[#0B101D] text-zinc-100 ring-1 ring-white/10 shadow-black/80'
                    }`}>
                      {PRODUCT_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setActiveMenu(null)}
                            className={`flex items-start gap-3 rounded-xl p-2.5 transition group ${
                              isLightPage ? 'hover:bg-slate-50' : 'hover:bg-[#151821]'
                            }`}
                          >
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-[#FF9100] transition ${
                              isLightPage ? 'bg-slate-100 border-slate-200' : 'bg-[#151821] border-white/10'
                            }`}>
                              <Icon size={16} />
                            </div>
                            <div>
                              <p className={`text-xs font-bold transition ${
                                isLightPage ? 'text-slate-900 group-hover:text-[#FF6D00]' : 'text-white group-hover:text-[#FFA726]'
                              }`}>{item.label}</p>
                              <p className={`text-[11px] leading-snug mt-0.5 ${
                                isLightPage ? 'text-slate-500' : 'text-zinc-400'
                              }`}>{item.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Studios Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleMenu('studios')}
                    className={`flex items-center gap-1 transition cursor-pointer py-1 ${
                      isLightPage
                        ? activeMenu === 'studios' ? 'text-slate-900 font-bold' : 'text-slate-700 hover:text-slate-900'
                        : activeMenu === 'studios' ? 'text-white font-semibold' : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    <span>Studios</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${
                      isLightPage ? 'text-slate-500' : 'text-zinc-400'
                    } ${activeMenu === 'studios' ? 'rotate-180' : ''}`} />
                  </button>

                  {activeMenu === 'studios' && (
                    <div className={`absolute left-0 top-full mt-3 w-80 rounded-2xl border p-2 shadow-2xl backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-150 ${
                      isLightPage
                        ? 'border-slate-200 bg-white text-slate-900 shadow-slate-900/10'
                        : 'border-white/[0.08] bg-[#0F1117] text-zinc-100 ring-1 ring-white/10'
                    }`}>
                      {STUDIO_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setActiveMenu(null)}
                            className={`flex items-start gap-3 rounded-xl p-2.5 transition group ${
                              isLightPage ? 'hover:bg-slate-50' : 'hover:bg-[#151821]'
                            }`}
                          >
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-[#FF9100] transition ${
                              isLightPage ? 'bg-slate-100 border-slate-200' : 'bg-[#151821] border-white/10'
                            }`}>
                              <Icon size={16} />
                            </div>
                            <div>
                              <p className={`text-xs font-bold transition ${
                                isLightPage ? 'text-slate-900 group-hover:text-[#FF6D00]' : 'text-white group-hover:text-[#FFA726]'
                              }`}>{item.label}</p>
                              <p className={`text-[11px] leading-snug mt-0.5 ${
                                isLightPage ? 'text-slate-500' : 'text-zinc-400'
                              }`}>{item.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Features / Specs */}
                <Link href="/features" className={`transition ${isLightPage ? 'hover:text-slate-900' : 'hover:text-white'}`}>
                  Features
                </Link>

                {/* Pricing */}
                <Link href="/pricing" className={`transition ${isLightPage ? 'hover:text-slate-900' : 'hover:text-white'}`}>
                  Pricing
                </Link>

                {/* Resources Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleMenu('resources')}
                    className={`flex items-center gap-1 transition cursor-pointer py-1 ${
                      isLightPage
                        ? activeMenu === 'resources' ? 'text-slate-900 font-bold' : 'text-slate-700 hover:text-slate-900'
                        : activeMenu === 'resources' ? 'text-white font-semibold' : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    <span>Resources</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${
                      isLightPage ? 'text-slate-500' : 'text-zinc-400'
                    } ${activeMenu === 'resources' ? 'rotate-180' : ''}`} />
                  </button>

                  {activeMenu === 'resources' && (
                    <div className={`absolute left-0 top-full mt-3 w-72 rounded-2xl border p-2 shadow-2xl backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-150 ${
                      isLightPage
                        ? 'border-slate-200 bg-white text-slate-900 shadow-slate-900/10'
                        : 'border-white/10 bg-[#0B101D] text-zinc-100 ring-1 ring-white/10 shadow-black/80'
                    }`}>
                      {RESOURCE_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setActiveMenu(null)}
                            className={`flex items-start gap-3 rounded-xl p-2.5 transition group ${
                              isLightPage ? 'hover:bg-slate-50' : 'hover:bg-[#151E30]'
                            }`}
                          >
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-[#FF9100] transition ${
                              isLightPage ? 'bg-slate-100 border-slate-200' : 'bg-[#151E30] border-white/10'
                            }`}>
                              <Icon size={16} />
                            </div>
                            <div>
                              <p className={`text-xs font-bold transition ${
                                isLightPage ? 'text-slate-900 group-hover:text-[#FF6D00]' : 'text-white group-hover:text-[#FFA726]'
                              }`}>{item.label}</p>
                              <p className={`text-[11px] leading-snug mt-0.5 ${
                                isLightPage ? 'text-slate-500' : 'text-zinc-400'
                              }`}>{item.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* About Us */}
                <Link href="/about" className={`transition ${isLightPage ? 'hover:text-slate-900' : 'hover:text-white'}`}>
                  About
                </Link>

              </nav>
            )}
          </div>

          {/* RIGHT SIDE: LANGUAGE + LOGIN + PRIMARY CTA */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* EN Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu('lang')}
                className={`flex items-center gap-1.5 text-xs font-medium transition cursor-pointer py-1 ${
                  isLightPage ? 'text-slate-700 hover:text-slate-900' : 'text-zinc-300 hover:text-white'
                }`}
              >
                <Globe size={14} className={isLightPage ? 'text-slate-500' : 'text-zinc-400'} />
                <span>EN</span>
                <ChevronDown size={12} className={isLightPage ? 'text-slate-500' : 'text-zinc-400'} />
              </button>

              {activeMenu === 'lang' && (
                <div className={`absolute right-0 top-full mt-3 w-36 rounded-xl border p-1.5 text-xs shadow-2xl backdrop-blur-2xl ${
                  isLightPage
                    ? 'border-slate-200 bg-white text-slate-800'
                    : 'border-white/10 bg-[#0B101D] text-zinc-200 shadow-black/80'
                }`}>
                  <button type="button" onClick={() => setActiveMenu(null)} className={`w-full text-left rounded-lg px-3 py-1.5 font-bold ${
                    isLightPage ? 'bg-slate-100 text-slate-900' : 'bg-white/10 text-white'
                  }`}>English (EN)</button>
                  <button type="button" onClick={() => setActiveMenu(null)} className={`w-full text-left rounded-lg px-3 py-1.5 transition ${
                    isLightPage ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}>Hinglish (HI)</button>
                </div>
              )}
            </div>

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 transition text-left cursor-pointer ${
                    isLightPage
                      ? 'border-slate-200 bg-slate-100 hover:bg-slate-200'
                      : 'border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#FF6D00]/50'
                  }`}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF6D00] to-[#FF8F00] text-black font-black text-xs shadow-md">
                    {user?.email ? user.email.charAt(0).toUpperCase() : <User size={13} />}
                  </div>
                  <span className={`max-w-[100px] truncate text-xs font-bold capitalize ${
                    isLightPage ? 'text-slate-900' : 'text-white'
                  }`}>
                    {user?.displayName || (user?.email?.split('@')[0] ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1) : '')}
                  </span>
                  <ChevronDown size={12} className={isLightPage ? 'text-slate-500' : 'text-zinc-400'} />
                </button>

                {userMenuOpen && (
                  <div className={`absolute right-0 top-full mt-2 w-56 rounded-2xl border p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 ${
                    isLightPage
                      ? 'border-slate-200 bg-white text-slate-900 shadow-slate-900/10'
                      : 'border-white/10 bg-[#0B101D] text-zinc-100 shadow-black/80'
                  }`}>
                    <div className={`px-3 py-2 border-b mb-1 ${isLightPage ? 'border-slate-100' : 'border-white/10'}`}>
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${isLightPage ? 'text-slate-400' : 'text-zinc-400'}`}>Signed in as</p>
                      <p className={`text-xs font-black truncate ${isLightPage ? 'text-slate-900' : 'text-white'}`}>{user?.email}</p>
                    </div>

                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                      isLightPage ? 'text-slate-700 hover:bg-slate-50' : 'text-zinc-200 hover:bg-[#151821]'
                    }`}>
                      <LayoutDashboard size={14} className="text-[#FF8F00]" />
                      <span>Dashboard</span>
                    </Link>

                    <Link href="/billing" onClick={() => setUserMenuOpen(false)} className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                      isLightPage ? 'text-slate-700 hover:bg-slate-50' : 'text-zinc-200 hover:bg-[#151821]'
                    }`}>
                      <CreditCard size={14} className="text-[#FF8F00]" />
                      <span>Billing &amp; Videos</span>
                    </Link>

                    <div className={`mt-1 pt-1 border-t ${isLightPage ? 'border-slate-100' : 'border-white/10'}`}>
                      <button
                        type="button"
                        onClick={() => { setUserMenuOpen(false); void logout(); }}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 transition"
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
                  className={`text-sm font-semibold transition px-2 py-1 ${
                    isLightPage ? 'text-slate-700 hover:text-slate-900' : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  Log In
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-5 py-2 text-xs font-black text-black shadow-lg shadow-[#FF6D00]/25 transition hover:brightness-110 active:scale-95"
                >
                  <Sparkles size={13} className="fill-black stroke-black" />
                  <span>Start Free</span>
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            type="button"
            className={`relative flex h-10 w-10 items-center justify-center rounded-2xl border shadow-md active:scale-95 transition-all duration-300 hover:border-[#FF6D00]/50 lg:hidden cursor-pointer ${
              isLightPage
                ? 'border-slate-200 bg-slate-100 text-slate-900'
                : 'border-white/10 bg-[#0F1117] text-white'
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="relative flex flex-col justify-between h-[13px] w-[18px]">
              <span
                className={`h-[2px] w-full rounded-full transition-all duration-300 transform origin-left ${
                  isLightPage ? 'bg-slate-900' : 'bg-white'
                } ${isOpen ? 'rotate-45 translate-x-[2px] -translate-y-[1px] bg-[#FF9100]' : ''}`}
              />
              <span
                className={`h-[2px] w-[14px] rounded-full transition-all duration-300 ${
                  isLightPage ? 'bg-slate-900' : 'bg-white'
                } ${isOpen ? 'opacity-0 translate-x-2' : ''}`}
              />
              <span
                className={`h-[2px] w-full rounded-full transition-all duration-300 transform origin-left ${
                  isLightPage ? 'bg-slate-900' : 'bg-white'
                } ${isOpen ? '-rotate-45 translate-x-[2px] translate-y-[1px] bg-[#FF9100]' : ''}`}
              />
            </div>
          </button>

        </div>
      </header>

      {/* MOBILE FLYOUT DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex flex-col justify-between bg-[#050505]/98 backdrop-blur-2xl text-white p-6 lg:hidden animate-in fade-in slide-in-from-top-4 duration-200 overflow-y-auto">
          <div className="space-y-6">
            {/* Top Brand & Close Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <BrandLogo size="sm" showBadge={false} />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#0F1117] text-zinc-300 hover:text-white transition cursor-pointer"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Primary Action Hero Banner */}
            <div className="rounded-2xl border border-[#FF6D00]/30 bg-gradient-to-r from-[#FF6D00]/15 via-[#FF8F00]/10 to-transparent p-4 space-y-3">
              <div className="flex items-center gap-2 text-[#FF9100] text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} />
                <span>Next-Gen AI Video Engine</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                Create viral reels, shorts &amp; explainers with 1080p full HD cloud rendering.
              </p>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-4 py-2.5 text-xs font-black text-black shadow-lg shadow-[#FF6D00]/25 hover:brightness-110 transition active:scale-95"
              >
                <span>Start Creating Free</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* DIRECT CATEGORIZED NAVIGATION LINKS */}
            <div className="space-y-4 pt-2">
              <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                Navigation
              </p>

              <div className="flex flex-col gap-2">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#0F1117] px-4 py-3 text-sm font-bold text-white hover:border-[#FF6D00]/50 hover:bg-[#151821] transition"
                >
                  <span className="flex items-center gap-2.5">
                    <LayoutDashboard size={16} className="text-[#FF9100]" />
                    <span>AI Studios &amp; Dashboard</span>
                  </span>
                  <ChevronRight size={16} className="text-zinc-500" />
                </Link>

                <Link
                  href="/features"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#0F1117] px-4 py-3 text-sm font-bold text-white hover:border-[#FF6D00]/50 hover:bg-[#151821] transition"
                >
                  <span className="flex items-center gap-2.5">
                    <Sparkles size={16} className="text-[#FF9100]" />
                    <span>Features &amp; Specs</span>
                  </span>
                  <ChevronRight size={16} className="text-zinc-500" />
                </Link>

                <Link
                  href="/pricing"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#0F1117] px-4 py-3 text-sm font-bold text-white hover:border-[#FF6D00]/50 hover:bg-[#151821] transition"
                >
                  <span className="flex items-center gap-2.5">
                    <CreditCard size={16} className="text-[#FF9100]" />
                    <span>Pricing &amp; Plans</span>
                  </span>
                  <ChevronRight size={16} className="text-zinc-500" />
                </Link>

                <Link
                  href="/about"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#0F1117] px-4 py-3 text-sm font-bold text-white hover:border-[#FF6D00]/50 hover:bg-[#151821] transition"
                >
                  <span className="flex items-center gap-2.5">
                    <BookOpen size={16} className="text-[#FF9100]" />
                    <span>About Us</span>
                  </span>
                  <ChevronRight size={16} className="text-zinc-500" />
                </Link>
              </div>
            </div>
          </div>

          {/* BOTTOM ACCOUNT / ACTION BAR */}
          <div className="mt-8 pt-5 border-t border-white/10">
            {user ? (
              <div className="flex flex-col gap-2.5">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center rounded-2xl bg-white py-3 text-xs font-black text-black hover:bg-zinc-200 transition shadow-md"
                >
                  Open Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => { setIsOpen(false); void logout(); }}
                  className="w-full text-center text-xs font-bold text-rose-400 py-2 hover:text-rose-300 transition"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center rounded-2xl bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] py-3 text-xs font-black text-black shadow-lg shadow-[#FF6D00]/25 hover:brightness-110 transition"
                >
                  Start Free
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center rounded-2xl border border-white/[0.08] bg-[#0F1117] py-3 text-xs font-bold text-white hover:bg-[#151821] transition"
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
