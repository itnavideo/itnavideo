'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AudioLines, Camera, LayoutDashboard, LogIn, Menu, Sparkles, X } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import BrandLogo from '@/components/brand/BrandLogo';

const productLinks = [
  { label: 'Faceless Video', href: '/dashboard', icon: AudioLines },
  { label: 'Face Camera', href: '/dashboard', icon: Camera },
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-[100] px-6 py-4 transition-all duration-300 ${
      scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <BrandLogo size="sm" />

        <div className="hidden md:flex items-center gap-6">
          {productLinks.map((item) => (
            <Link key={item.label} href={item.href} className="text-sm font-bold text-zinc-300 hover:text-white transition-colors">
              {item.label}
            </Link>
          ))}
          {pageLinks.map((item) => (
            <Link key={item.label} href={item.href} className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-white">
              {item.label}
              {'badge' in item && item.badge ? (
                <span className="rounded-md bg-brand-mint px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-black">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="bg-white text-black px-5 py-2 rounded-lg text-sm font-black hover:bg-zinc-200 transition-all">Dashboard</Link>
              <button onClick={logout} className="text-sm font-medium text-zinc-400 hover:text-red-400 transition-colors">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Login</Link>
              <Link href="/signup" className="bg-brand-mint text-black px-5 py-2 rounded-lg text-sm font-black hover:bg-white transition-all">Sign Up</Link>
            </div>
          )}
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full w-full border-b border-white/10 bg-zinc-950/98 p-5 shadow-2xl md:hidden animate-in fade-in zoom-in duration-200">
          <div className="grid gap-3">
            {productLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] px-4 py-4 font-black text-white transition hover:bg-white/8"
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
            {pageLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between rounded-md px-3 py-3 text-base font-bold text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                <span>{item.label}</span>
                {'badge' in item && item.badge ? (
                  <span className="rounded-md bg-brand-mint px-2 py-1 text-[10px] font-black uppercase tracking-wide text-black">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>

          <div className="mt-5 grid gap-3">
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-4 text-center font-black text-black">
                <LayoutDashboard size={18} />
                Open Dashboard
              </Link>
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

