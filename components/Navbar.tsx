'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Video } from 'lucide-react';
import { useAuth } from './AuthContext';

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
        <Link href="/" className="text-2xl font-bold tracking-tight flex items-center gap-2 group">
          <div className="bg-purple-600 p-1 rounded-lg group-hover:scale-110 transition-transform">
            <Video size={18} fill="white" className="text-white" />
          </div>
          <span className="text-white">Itna<span className="text-purple-500">video</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/about" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">About</Link>
          <Link href="/pricing" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Pricing</Link>
          <Link href="/contact" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Contact</Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="bg-white text-black px-5 py-2 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all">Dashboard</Link>
              <button onClick={logout} className="text-sm font-medium text-zinc-400 hover:text-red-400 transition-colors">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Login</Link>
              <Link href="/signup" className="bg-purple-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-purple-500 transition-all">Sign Up</Link>
            </div>
          )}
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-zinc-950 border-b border-white/5 p-6 flex flex-col gap-4 md:hidden animate-in fade-in zoom-in duration-200">
          <Link href="/about" onClick={() => setIsOpen(false)} className="text-lg font-medium text-zinc-400 hover:text-white">About</Link>
          <Link href="/pricing" onClick={() => setIsOpen(false)} className="text-lg font-medium text-zinc-400 hover:text-white">Pricing</Link>
          {user ? (
            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="bg-white text-black px-5 py-3 rounded-xl text-center font-bold">Dashboard</Link>
          ) : (
            <Link href="/signup" onClick={() => setIsOpen(false)} className="bg-purple-600 text-white px-5 py-3 rounded-xl text-center font-bold">Sign Up</Link>
          )}
        </div>
      )}
    </nav>
  );
}