'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { 
  AudioLines, 
  LayoutDashboard, 
  LogIn, 
  LogOut,
  Sparkles, 
  ChevronDown, 
  Captions, 
  Layers3, 
  Film, 
  Zap, 
  Menu, 
  X, 
  ArrowRight,
  User,
  ShieldCheck,
  CreditCard,
  Settings
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import BrandLogo from '@/components/brand/BrandLogo';

const FEATURED_WORKFLOWS = [
  {
    label: 'Auto Caption Generator',
    desc: 'Word-synced animated captions for Reels & Videos',
    href: '/auto-caption-generator',
    icon: Captions,
    color: 'from-amber-500 to-orange-400',
  },
  {
    label: 'Compare Explainer',
    desc: 'Side-by-side versus comparison',
    href: '/video-types/compare-explainer',
    icon: Layers3,
    color: 'from-indigo-500 to-purple-400',
  },
  {
    label: 'AI Video Generator',
    desc: '16:9 & 9:16 long-form AI studio',
    href: '/ai-video-generator',
    icon: Film,
    color: 'from-cyan-500 to-emerald-400',
  },
  {
    label: 'AI Audio Cleaner',
    desc: 'Studio voice isolate & noise cancellation',
    href: '/tools/ai-audio-cleaner',
    icon: Zap,
    color: 'from-amber-500 to-orange-400',
  },
];

const NAV_PAGES = [
  { label: 'Pricing', href: '/pricing', badge: 'Packs' },
  { label: 'Features', href: '/features' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const isDashboard = pathname === '/dashboard';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
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

  return (
    <>
      <header
        className={`fixed top-0 z-[100] w-full transition-all duration-300 px-4 py-2.5 md:px-8 border-b ${
          scrolled
            ? 'border-slate-800/90 bg-[#09090b]/95 text-white backdrop-blur-2xl shadow-xl'
            : 'border-slate-800/60 bg-[#09090b]/85 text-white backdrop-blur-xl'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          {/* BRAND LOGO WITH AI STUDIO BADGE */}
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" showBadge={true} />
          </div>

          {/* DESKTOP NAVIGATION BAR (UNIFIED HIGH-CONTRAST PILLS) */}
          {!isDashboard && (
            <nav className="hidden md:flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/90 p-1.5 text-xs font-semibold backdrop-blur-xl shadow-lg">
              
              {/* VIDEO WORKFLOWS DROPDOWN TRIGGER */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onMouseEnter={() => setDropdownOpen(true)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
                    dropdownOpen || pathname.startsWith('/video-types')
                      ? 'bg-slate-800 text-amber-400 border border-amber-400/40 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                      : 'text-slate-200 hover:bg-slate-800/80 hover:text-amber-400'
                  }`}
                >
                  <AudioLines size={14} className="text-amber-400" />
                  <span>Video Workflows</span>
                  <ChevronDown size={13} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* MEGA DROPDOWN MENU */}
                {dropdownOpen && (
                  <div 
                    onMouseLeave={() => setDropdownOpen(false)}
                    className="absolute left-0 top-full mt-2 w-80 rounded-2xl border border-slate-800 bg-[#09090b] p-3 text-slate-100 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="mb-2 px-3 pt-1 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">11 AI Video Workflows</span>
                      <Sparkles size={12} className="text-amber-400" />
                    </div>

                    <div className="grid gap-1">
                      {FEATURED_WORKFLOWS.map((wf) => {
                        const Icon = wf.icon;
                        return (
                          <Link
                            key={wf.label}
                            href={wf.href}
                            onClick={() => setDropdownOpen(false)}
                            className="group flex items-start gap-3 rounded-xl p-2.5 transition duration-200 hover:bg-slate-800/80"
                          >
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr ${wf.color} text-slate-950 shadow-sm transition group-hover:scale-105`}>
                              <Icon size={16} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-100 group-hover:text-amber-400 transition">{wf.label}</p>
                              <p className="text-[10px] text-slate-400">{wf.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="mt-2 border-t border-slate-800 pt-2 px-1">
                      <Link
                        href="/video-types"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center justify-between rounded-xl bg-slate-800/60 px-3 py-2 text-xs font-bold text-amber-400 transition hover:bg-slate-800"
                      >
                        <span>Explore All Video Workflows</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* UNIFIED HIGH-CONTRAST NAV PAGES */}
              {NAV_PAGES.map((page) => {
                const active = pathname === page.href;
                return (
                  <Link
                    key={page.label}
                    href={page.href}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
                      active
                        ? 'bg-slate-800 text-amber-400 border border-amber-400/40 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                        : 'text-slate-200 hover:bg-slate-800/80 hover:text-amber-400'
                    }`}
                  >
                    <span>{page.label}</span>
                    {page.badge && (
                      <span className="rounded-full bg-amber-400/15 px-1.5 py-0.2 text-[9px] font-black uppercase text-amber-400 border border-amber-400/30">
                        {page.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

            </nav>
          )}

          {/* DESKTOP RIGHT USER ACCOUNT & CTA BAR */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                {/* USER PROFILE BUTTON WITH DROPDOWN TRIGGER */}
                <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 p-1 backdrop-blur-xl shadow-md">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full hover:bg-slate-800 transition text-left cursor-pointer"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 font-black text-xs shadow-md ring-2 ring-amber-400/30">
                      {user.email ? user.email.charAt(0).toUpperCase() : <User size={13} />}
                    </div>
                    <span className="max-w-[120px] truncate text-xs font-extrabold text-slate-100">
                      {user.email?.split('@')[0]}
                    </span>
                    <ChevronDown size={13} className={`text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 px-4 py-1.5 text-xs font-black text-slate-950 shadow-md shadow-amber-500/20 transition-all duration-200 hover:scale-[1.03] hover:shadow-amber-500/30 active:scale-95"
                  >
                    <LayoutDashboard size={14} />
                    <span>Dashboard</span>
                  </Link>
                </div>

                {/* USER PROFILE DROPDOWN MENU */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-800 bg-[#09090b] p-2 text-slate-100 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Signed in as</p>
                      <p className="text-xs font-black text-slate-100 truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-amber-400 transition"
                    >
                      <LayoutDashboard size={14} className="text-amber-400" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      href="/billing"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-amber-400 transition"
                    >
                      <CreditCard size={14} className="text-amber-400" />
                      <span>Billing & Credits</span>
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-amber-400 transition"
                    >
                      <Settings size={14} className="text-purple-400" />
                      <span>Account Settings</span>
                    </Link>

                    <div className="mt-1 pt-1 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          void logout();
                        }}
                        className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/15 transition"
                      >
                        <LogOut size={14} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-xs font-bold text-slate-200 transition hover:bg-slate-800 hover:text-amber-400"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 px-5 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-amber-500/30 active:scale-95"
                >
                  <span>Get Started</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-white shadow-md active:scale-90 transition-all duration-200 hover:border-amber-400/50 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? (
              <X size={20} className="text-amber-400 animate-in spin-in-90 duration-200" />
            ) : (
              <div className="flex flex-col gap-[4.5px] items-center justify-center">
                <span className="h-[2px] w-5 rounded-full bg-white transition-all" />
                <span className="h-[2px] w-3.5 rounded-full bg-amber-400 transition-all self-start ml-[2.5px]" />
                <span className="h-[2px] w-5 rounded-full bg-white transition-all" />
              </div>
            )}
          </button>

        </div>
      </header>

      {/* MOBILE FLYOUT DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex flex-col justify-between bg-slate-950/98 text-white backdrop-blur-3xl p-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-300 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <BrandLogo size="sm" />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Navigation</p>

              <Link
                href="/video-types"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between rounded-2xl bg-slate-900 p-4 text-sm font-bold text-slate-100 hover:text-amber-400"
              >
                <div className="flex items-center gap-3">
                  <AudioLines size={18} className="text-amber-400" />
                  <span>Video Workflows</span>
                </div>
                <ArrowRight size={16} />
              </Link>

              {NAV_PAGES.map((page) => (
                <Link
                  key={page.label}
                  href={page.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-2xl bg-slate-900/60 p-4 text-sm font-bold text-slate-200 hover:text-amber-400"
                >
                  <span>{page.label}</span>
                  {page.badge && (
                    <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-extrabold uppercase text-amber-400">
                      {page.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-900 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 font-black text-sm">
                    {user.email ? user.email.charAt(0).toUpperCase() : <User size={16} />}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-100 truncate">{user.email}</p>
                    <p className="text-[10px] text-amber-400 font-semibold">Active Studio Plan</p>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 py-3.5 text-sm font-black text-slate-950 shadow-lg"
                >
                  <LayoutDashboard size={16} />
                  <span>Go to Dashboard</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    void logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-rose-500/10 py-3 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition"
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 py-3.5 text-sm font-black text-slate-950 shadow-lg"
                >
                  <span>Get Started</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
