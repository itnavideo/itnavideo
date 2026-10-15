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

const WIDESCREEN_PRODUCTS = [
  { label: 'Faceless Video AI', desc: 'Auto B-roll, voiceovers & 16:9 YouTube story', href: '/dashboard/faceless-video', icon: MonitorPlay },
  { label: 'Book Summary Video', desc: 'Turn book narration into cinematic lesson cards', href: '/dashboard/book-summary', icon: BookOpen },
  { label: 'Image to Video AI', desc: 'Animate photos into cinematic video beats', href: '/dashboard/image-to-video-ai', icon: Film },
  { label: 'YouTube Subtitles', desc: '1080p Full HD burned subtitles for podcasts', href: '/dashboard/youtube-subtitles', icon: Captions },
  { label: 'AI Audio Cleaner', desc: 'Studio audio noise cleanup & retake detection', href: '/dashboard/audio-cleaner', icon: Mic },
];

const VERTICAL_PRODUCTS = [
  { label: 'Auto Caption Generator', desc: 'Kinetic animated captions for Reels & Shorts', href: '/dashboard/auto-caption', icon: Smartphone },
  { label: 'Kinetic Typography', desc: 'Dynamic speech-to-text kinetic motion presets', href: '/dashboard/typography-video', icon: FileText },
  { label: 'Whiteboard Video', desc: 'Whiteboard stickman animation explainers', href: '/dashboard/whiteboard-video', icon: PenTool },
  { label: 'Compare Explainer', desc: 'Side-by-side comparison video generator', href: '/dashboard/compare-explainer', icon: Columns },
  { label: 'Long Video to Clips', desc: 'Auto hook detector clips from long videos', href: '/dashboard/long-video-clips', icon: Scissors },
  { label: 'Long Video Promo', desc: 'Turn YouTube videos into viral promo Shorts', href: '/dashboard/long-video-promo', icon: Tv },
];

const RESOURCE_ITEMS = [
  { label: 'Video Types & Specs', desc: 'Master documentation for all 11 video pipelines', href: '/features', icon: BookOpen },
  { label: 'Pricing & Packs', desc: 'Flexible video credit packages for creators', href: '/pricing', icon: CreditCard },
  { label: 'About Itnavideo', desc: 'Learn about our AI video rendering engine', href: '/about', icon: Sparkles },
];

const LANGUAGES = [
  { code: 'EN', name: 'English (EN)' },
  { code: 'HI', name: 'Hinglish (HI)' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'products' | 'resources' | 'lang' | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const isDashboard = pathname.startsWith('/dashboard');
  const isLightPage = !isDashboard;

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

  const toggleMenu = (menu: 'products' | 'resources' | 'lang') => {
    setUserMenuOpen(false);
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  const toggleUserMenu = () => {
    setActiveMenu(null);
    setUserMenuOpen((prev) => !prev);
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
            <BrandLogo size="sm" showBadge={false} variant={isLightPage ? 'light' : 'dark'} />

            {/* DESKTOP NAVIGATION LINKS */}
            {!isDashboard && (
              <nav className={`hidden lg:flex items-center gap-7 text-sm font-medium ${isLightPage ? 'text-slate-700' : 'text-zinc-300'}`}>
                
                {/* 1. Products Mega Menu Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleMenu('products')}
                    className={`flex items-center gap-1 transition cursor-pointer py-1 font-semibold ${
                      isLightPage
                        ? activeMenu === 'products' ? 'text-orange-600 font-bold' : 'text-slate-800 hover:text-orange-600'
                        : activeMenu === 'products' ? 'text-white font-semibold' : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    <span>Products</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${
                      isLightPage ? 'text-slate-500' : 'text-zinc-400'
                    } ${activeMenu === 'products' ? 'rotate-180 text-orange-600' : ''}`} />
                  </button>

                  {activeMenu === 'products' && (
                    <div
                      style={{ backgroundColor: '#ffffff', opacity: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', zIndex: 60 }}
                      className="absolute left-0 top-full mt-2 w-[540px] sm:w-[560px] bg-white rounded-2xl border border-gray-200/90 shadow-2xl p-5 z-50 text-slate-900 animate-in fade-in zoom-in-95 duration-150"
                    >
                      {/* 2 Column Layout for Studios */}
                      <div className="grid grid-cols-2 gap-4 pb-3">
                        {/* Column 1: Short Video Studios (9:16) */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-extrabold text-orange-600 uppercase tracking-wider block px-1">
                            📱 9:16 Shorts &amp; Reels
                          </span>

                          <Link
                            href="/dashboard/faceless-video"
                            onClick={() => setActiveMenu(null)}
                            className="flex items-start gap-3 p-2 rounded-xl hover:bg-orange-50/70 transition-colors group"
                          >
                            <span className="p-2 bg-orange-100 text-orange-600 rounded-lg text-lg flex items-center justify-center shrink-0">
                              🎬
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                Faceless Video AI
                              </h4>
                              <p className="text-xs text-gray-500 font-medium">Auto B-roll, voiceover &amp; captions</p>
                            </div>
                          </Link>

                          <Link
                            href="/dashboard/auto-caption"
                            onClick={() => setActiveMenu(null)}
                            className="flex items-start gap-3 p-2 rounded-xl hover:bg-orange-50/70 transition-colors group"
                          >
                            <span className="p-2 bg-orange-100 text-orange-600 rounded-lg text-lg flex items-center justify-center shrink-0">
                              💬
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                Auto Captions
                              </h4>
                              <p className="text-xs text-gray-500 font-medium">Kinetic captions for Reels &amp; Shorts</p>
                            </div>
                          </Link>

                          <Link
                            href="/dashboard/typography-video"
                            onClick={() => setActiveMenu(null)}
                            className="flex items-start gap-3 p-2 rounded-xl hover:bg-orange-50/70 transition-colors group"
                          >
                            <span className="p-2 bg-orange-100 text-orange-600 rounded-lg text-lg flex items-center justify-center shrink-0">
                              ✨
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                Kinetic Typography
                              </h4>
                              <p className="text-xs text-gray-500 font-medium">Dynamic speech-to-text motion</p>
                            </div>
                          </Link>

                          <Link
                            href="/dashboard/whiteboard-video"
                            onClick={() => setActiveMenu(null)}
                            className="flex items-start gap-3 p-2 rounded-xl hover:bg-orange-50/70 transition-colors group"
                          >
                            <span className="p-2 bg-orange-100 text-orange-600 rounded-lg text-lg flex items-center justify-center shrink-0">
                              ✏️
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                Whiteboard Video
                              </h4>
                              <p className="text-xs text-gray-500 font-medium">Stickman &amp; doodle explainers</p>
                            </div>
                          </Link>

                          <Link
                            href="/dashboard/compare-explainer"
                            onClick={() => setActiveMenu(null)}
                            className="flex items-start gap-3 p-2 rounded-xl hover:bg-orange-50/70 transition-colors group"
                          >
                            <span className="p-2 bg-orange-100 text-orange-600 rounded-lg text-lg flex items-center justify-center shrink-0">
                              ⚖️
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                Compare Explainer
                              </h4>
                              <p className="text-xs text-gray-500 font-medium">Side-by-side comparison generator</p>
                            </div>
                          </Link>
                        </div>

                        {/* Column 2: Widescreen & Long Form (16:9) */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-extrabold text-amber-600 uppercase tracking-wider block px-1">
                            🖥️ 16:9 Long-Form
                          </span>

                          <Link
                            href="/dashboard/long-video-clips"
                            onClick={() => setActiveMenu(null)}
                            className="flex items-start gap-3 p-2 rounded-xl hover:bg-orange-50/70 transition-colors group"
                          >
                            <span className="p-2 bg-orange-100 text-orange-600 rounded-lg text-lg flex items-center justify-center shrink-0">
                              ✂️
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                Long Video Clips
                              </h4>
                              <p className="text-xs text-gray-500 font-medium">Cut viral shorts from long videos</p>
                            </div>
                          </Link>

                          <Link
                            href="/dashboard/book-summary"
                            onClick={() => setActiveMenu(null)}
                            className="flex items-start gap-3 p-2 rounded-xl hover:bg-orange-50/70 transition-colors group"
                          >
                            <span className="p-2 bg-orange-100 text-orange-600 rounded-lg text-lg flex items-center justify-center shrink-0">
                              📚
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                Book Summary Video
                              </h4>
                              <p className="text-xs text-gray-500 font-medium">Cinematic explainer lesson cards</p>
                            </div>
                          </Link>

                          <Link
                            href="/dashboard/image-to-video-ai"
                            onClick={() => setActiveMenu(null)}
                            className="flex items-start gap-3 p-2 rounded-xl hover:bg-orange-50/70 transition-colors group"
                          >
                            <span className="p-2 bg-orange-100 text-orange-600 rounded-lg text-lg flex items-center justify-center shrink-0">
                              🎞️
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                Image to Video AI
                              </h4>
                              <p className="text-xs text-gray-500 font-medium">Animate photos into video beats</p>
                            </div>
                          </Link>

                          <Link
                            href="/dashboard/youtube-subtitles"
                            onClick={() => setActiveMenu(null)}
                            className="flex items-start gap-3 p-2 rounded-xl hover:bg-orange-50/70 transition-colors group"
                          >
                            <span className="p-2 bg-orange-100 text-orange-600 rounded-lg text-lg flex items-center justify-center shrink-0">
                              🎯
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                YouTube Subtitles
                              </h4>
                              <p className="text-xs text-gray-500 font-medium">1080p burned-in subtitles</p>
                            </div>
                          </Link>

                          <Link
                            href="/dashboard/audio-cleaner"
                            onClick={() => setActiveMenu(null)}
                            className="flex items-start gap-3 p-2 rounded-xl hover:bg-orange-50/70 transition-colors group"
                          >
                            <span className="p-2 bg-orange-100 text-orange-600 rounded-lg text-lg flex items-center justify-center shrink-0">
                              🎙️
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                AI Audio Cleaner
                              </h4>
                              <p className="text-xs text-gray-500 font-medium">Studio voice cleanup &amp; retake fix</p>
                            </div>
                          </Link>
                        </div>
                      </div>

                      {/* Bottom Banner */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs px-2 -mx-2 -mb-2 bg-slate-50/90 rounded-b-xl p-3">
                        <span className="text-[11px] font-semibold text-gray-600">
                          ⚡ 1080p Cloud Render in 60s • 1 Free Credit on Signup
                        </span>
                        <Link
                          href="/dashboard"
                          onClick={() => setActiveMenu(null)}
                          className="font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 text-xs"
                        >
                          <span>Open All Studios</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Features / Specs */}
                <Link href="/features" className={`transition font-semibold ${isLightPage ? 'text-slate-800 hover:text-orange-600' : 'text-zinc-300 hover:text-white'}`}>
                  Features
                </Link>

                {/* 3. Pricing */}
                <Link href="/pricing" className={`transition font-semibold ${isLightPage ? 'text-slate-800 hover:text-orange-600' : 'text-zinc-300 hover:text-white'}`}>
                  Pricing
                </Link>

                {/* 4. Resources Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleMenu('resources')}
                    className={`flex items-center gap-1 transition cursor-pointer py-1 font-semibold ${
                      isLightPage
                        ? activeMenu === 'resources' ? 'text-orange-600 font-bold' : 'text-slate-800 hover:text-orange-600'
                        : activeMenu === 'resources' ? 'text-white font-semibold' : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    <span>Resources</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${
                      isLightPage ? 'text-slate-500' : 'text-zinc-400'
                    } ${activeMenu === 'resources' ? 'rotate-180 text-orange-600' : ''}`} />
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
                              className="flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-orange-50/70 group"
                            >
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-200/80 bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white group-hover:border-transparent transition">
                                <Icon size={16} />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
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

          {/* RIGHT SIDE: LANGUAGE + LOGIN + PRIMARY CTA */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu('lang')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer border ${
                  isLightPage
                    ? 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800'
                    : 'border-white/15 bg-white/[0.06] text-zinc-200 hover:bg-white/10'
                }`}
              >
                <Globe size={14} className={isLightPage ? 'text-gray-600' : 'text-zinc-400'} />
                <span>{selectedLang.code}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${
                  isLightPage ? 'text-gray-500' : 'text-zinc-400'
                } ${activeMenu === 'lang' ? 'rotate-180' : ''}`} />
              </button>

              {activeMenu === 'lang' && (
                <div
                  style={{ backgroundColor: '#ffffff', opacity: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', zIndex: 60 }}
                  className="absolute right-0 top-full mt-2 w-44 rounded-2xl border border-gray-200/90 bg-white p-1.5 text-xs shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 text-gray-800"
                >
                  <div className="space-y-0.5">
                    {LANGUAGES.map((lang) => {
                      const isSelected = selectedLang.code === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            setSelectedLang(lang);
                            setActiveMenu(null);
                          }}
                          className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left transition cursor-pointer font-bold ${
                            isSelected ? 'bg-orange-50 text-orange-600' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span>{lang.name}</span>
                          {isSelected && <span className="h-2 w-2 rounded-full bg-orange-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={toggleUserMenu}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 transition text-left cursor-pointer shadow-2xs ${
                    isLightPage
                      ? 'border-slate-200 bg-slate-100 hover:bg-slate-200'
                      : 'border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white font-black text-xs shadow-xs">
                    {user?.email ? user.email.charAt(0).toUpperCase() : <User size={13} />}
                  </div>
                  <span className={`max-w-[110px] truncate text-xs font-bold capitalize ${
                    isLightPage ? 'text-slate-900' : 'text-white'
                  }`}>
                    {user?.displayName || (user?.email?.split('@')[0] ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1) : 'Dev Tester')}
                  </span>
                  <ChevronDown size={12} className={`transition-transform duration-200 ${
                    isLightPage ? 'text-slate-500' : 'text-zinc-400'
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
                      <LayoutDashboard size={14} className="text-[#FF5722]" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      href="/billing"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                    >
                      <CreditCard size={14} className="text-[#FF5722]" />
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
                  className={`text-sm font-semibold transition px-2 py-1 ${
                    isLightPage ? 'text-slate-700 hover:text-slate-900' : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  Log In
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-5 py-2 text-xs font-black text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 active:scale-95 transition-all duration-200"
                >
                  <Sparkles size={13} className="fill-white stroke-white" />
                  <span>Start Free</span>
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          {/* MOBILE HAMBURGER BUTTON */}
          <button
            type="button"
            className={`relative flex h-10 w-10 items-center justify-center rounded-2xl border shadow-xs active:scale-95 transition-all duration-300 hover:border-orange-500/50 lg:hidden cursor-pointer ${
              isLightPage
                ? 'border-slate-200 bg-slate-50 text-slate-900'
                : 'border-white/10 bg-[#0F1117] text-white'
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="relative flex flex-col justify-between h-[13px] w-[18px]">
              <span
                className={`h-[2px] w-full rounded-full transition-all duration-300 transform origin-left ${
                  isLightPage ? 'bg-slate-900' : 'bg-white'
                } ${isOpen ? 'rotate-45 translate-x-[2px] -translate-y-[1px] !bg-[#FF5722]' : ''}`}
              />
              <span
                className={`h-[2px] w-[14px] rounded-full transition-all duration-300 ${
                  isLightPage ? 'bg-slate-900' : 'bg-white'
                } ${isOpen ? 'opacity-0 translate-x-2' : ''}`}
              />
              <span
                className={`h-[2px] w-full rounded-full transition-all duration-300 transform origin-left ${
                  isLightPage ? 'bg-slate-900' : 'bg-white'
                } ${isOpen ? '-rotate-45 translate-x-[2px] translate-y-[1px] !bg-[#FF5722]' : ''}`}
              />
            </div>
          </button>

        </div>
      </header>

      {/* MOBILE FLYOUT DRAWER — CLEAN LIGHT BRAND PALETTE */}
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex flex-col justify-between bg-white/98 backdrop-blur-2xl text-slate-900 p-5 sm:p-6 lg:hidden animate-in fade-in slide-in-from-top-4 duration-200 overflow-y-auto">
          <div className="space-y-5">
            {/* Top Brand & Close Bar */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80">
              <BrandLogo size="sm" showBadge={false} variant="light" />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition cursor-pointer"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Primary Action Hero Card */}
            <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-50 via-amber-50/40 to-white p-4 space-y-2.5 shadow-xs">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-orange-800">
                <Sparkles size={11} className="text-[#FF5722]" />
                <span>1 Free Credit On Signup</span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Create 1080p AI Videos
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Turn voiceovers or scripts into YouTube 16:9 &amp; vertical Shorts with automatic B-roll and subtitles.
              </p>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 active:scale-95 transition-all duration-200"
              >
                <span>Start Creating Free</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* SIMPLIFIED DIRECT NAVIGATION FOR NEW USERS */}
            <div className="space-y-2 pt-1">
              <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 px-1">
                Video Studios
              </p>

              <div className="flex flex-col gap-1.5">
                <Link
                  href="/dashboard/faceless-video"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/80 px-3.5 py-2.5 text-xs font-bold text-slate-800 hover:border-orange-500/40 hover:bg-orange-50/40 hover:text-orange-950 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600">
                      <Tv size={14} />
                    </span>
                    <span>
                      <span className="block text-slate-900 font-extrabold">16:9 Faceless Video</span>
                      <span className="block text-[10px] text-slate-500 font-normal">YouTube long-form explainers</span>
                    </span>
                  </span>
                  <ChevronRight size={15} className="text-slate-400" />
                </Link>

                <Link
                  href="/dashboard/auto-caption"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/80 px-3.5 py-2.5 text-xs font-bold text-slate-800 hover:border-orange-500/40 hover:bg-orange-50/40 hover:text-orange-950 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                      <Captions size={14} />
                    </span>
                    <span>
                      <span className="block text-slate-900 font-extrabold">Auto Caption Generator</span>
                      <span className="block text-[10px] text-slate-500 font-normal">Kinetic subtitles for Reels &amp; Shorts</span>
                    </span>
                  </span>
                  <ChevronRight size={15} className="text-slate-400" />
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/80 px-3.5 py-2.5 text-xs font-bold text-slate-800 hover:border-orange-500/40 hover:bg-orange-50/40 hover:text-orange-950 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200/70 text-slate-700">
                      <LayoutDashboard size={14} />
                    </span>
                    <span>
                      <span className="block text-slate-900 font-extrabold">All 10 Studios Hub</span>
                      <span className="block text-[10px] text-slate-500 font-normal">Explore full video studio suite</span>
                    </span>
                  </span>
                  <ChevronRight size={15} className="text-slate-400" />
                </Link>

                <Link
                  href="/pricing"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/80 px-3.5 py-2.5 text-xs font-bold text-slate-800 hover:border-orange-500/40 hover:bg-orange-50/40 hover:text-orange-950 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                      <CreditCard size={14} />
                    </span>
                    <span>
                      <span className="block text-slate-900 font-extrabold">Pricing &amp; Plans</span>
                      <span className="block text-[10px] text-slate-500 font-normal">Free trial &amp; creator packs</span>
                    </span>
                  </span>
                  <ChevronRight size={15} className="text-slate-400" />
                </Link>
              </div>
            </div>
          </div>

          {/* BOTTOM ACCOUNT / ACTION BAR */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            {user ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] py-3 text-xs font-black text-white shadow-md shadow-orange-500/25 hover:brightness-110 transition"
                >
                  Open Studio Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => { setIsOpen(false); void logout(); }}
                  className="w-full text-center text-xs font-semibold text-rose-600 py-1.5 hover:text-rose-700 transition cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] py-3 text-xs font-black text-white shadow-md shadow-orange-500/25 hover:brightness-110 transition"
                >
                  Start Free (1 Free Credit)
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
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
