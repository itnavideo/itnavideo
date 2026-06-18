'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AudioLines, LayoutDashboard, LogIn, Menu, Sparkles, X } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import BrandLogo from '@/components/brand/BrandLogo';

const productLinks = [
  { label: 'Templates', href: '/#templates', icon: AudioLines },
  { label: 'Features', href: '/features', icon: Sparkles },
];

const pageLinks = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Careers', href: '/careers', badge: 'Hiring' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 z-[100] w-full px-4 py-3 transition-all duration-300 md:px-6 ${
      scrolled ? 'border-b border-white/10 bg-black/88 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl' : 'bg-black/20 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <BrandLogo size="sm" />

        <div className="hidden items-center gap-1 rounded-full border border-white/8 bg-white/[0.035] p-1 md:flex">
          {productLinks.map((item) => (
            <NavPill key={item.label} href={item.href} label={item.label} active={isActivePath(pathname, item.href)} strong />
          ))}
          {pageLinks.map((item) => (
            <NavPill key={item.label} href={item.href} label={item.label} badge={'badge' in item ? item.badge : undefined} active={isActivePath(pathname, item.href)} />
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <a href="/dashboard" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-black text-black shadow-[0_0_24px_rgba(255,255,255,0.12)] transition hover:bg-zinc-200">
                <LayoutDashboard size={16} />
                Dashboard
              </a>
              <button onClick={logout} className="rounded-lg px-3 py-2 text-sm font-bold text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-300">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-bold text-zinc-300 transition-colors hover:bg-white/8 hover:text-white">Login</Link>
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-lg bg-brand-mint px-5 py-2.5 text-sm font-black text-black shadow-[0_0_26px_rgba(79,255,213,0.18)] transition hover:bg-white">
                <Sparkles size={16} />
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition hover:bg-white/10 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full w-full border-b border-white/10 bg-zinc-950/98 p-5 shadow-2xl backdrop-blur-xl md:hidden animate-in fade-in zoom-in duration-200">
          <div className="grid gap-3">
            {productLinks.map((item) => {
              const Icon = item.icon;
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-4 font-black text-white transition hover:bg-white/8 ${
                    active ? 'border-brand-mint/40 bg-brand-mint/10' : 'border-white/10 bg-white/[0.035]'
                  }`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-mint/10 text-brand-mint">
                    <Icon size={19} />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-4 grid gap-1 border-t border-white/10 pt-4">
            {pageLinks.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between rounded-md px-3 py-3 text-base font-bold transition hover:bg-white/5 hover:text-white ${
                    active ? 'bg-white/8 text-white' : 'text-zinc-400'
                  }`}
                >
                  <span>{item.label}</span>
                  {'badge' in item && item.badge ? (
                    <span className="rounded-md bg-brand-mint px-2 py-1 text-[10px] font-black uppercase tracking-wide text-black">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>

          <div className="mt-5 grid gap-3">
          {user ? (
            <>
              <a href="/dashboard" onClick={() => setIsOpen(false)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-4 text-center font-black text-black">
                <LayoutDashboard size={18} />
                Open Dashboard
              </a>
              <button
                onClick={() => {
                  setIsOpen(false);
                  void logout();
                }}
                className="rounded-lg border border-red-400/20 bg-red-500/10 px-5 py-3 text-center font-bold text-red-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/signup" onClick={() => setIsOpen(false)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-mint px-5 py-4 text-center font-black text-black">
                <Sparkles size={18} />
                Start Creating
              </Link>
              <Link href="/login" onClick={() => setIsOpen(false)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-center font-bold text-white">
                <LogIn size={17} />
                Login
              </Link>
            </>
          )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavPill({
  href,
  label,
  badge,
  active,
  strong = false,
}: {
  href: string;
  label: string;
  badge?: string;
  active: boolean;
  strong?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm transition ${
        active
          ? 'bg-white text-black shadow-[0_8px_26px_rgba(255,255,255,0.12)]'
          : strong
            ? 'font-black text-zinc-200 hover:bg-white/8 hover:text-white'
            : 'font-bold text-zinc-400 hover:bg-white/8 hover:text-white'
      }`}
    >
      <span>{label}</span>
      {badge ? (
        <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${
          active ? 'bg-black text-brand-mint' : 'bg-brand-mint text-black'
        }`}>
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === '/dashboard') return pathname === '/dashboard';
  return pathname === href || pathname.startsWith(`${href}/`);
}

