'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-[100] px-6 py-4 bg-black/50 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Itna<span className="text-purple-500">video</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/pricing" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Pricing</Link>
          <Link href="/dashboard" className="bg-white text-black px-5 py-2 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all">Dashboard</Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-zinc-950 border-b border-white/5 p-6 flex flex-col gap-4 md:hidden">
          <Link href="/pricing" onClick={() => setIsOpen(false)} className="text-lg font-medium text-zinc-400 hover:text-white">Pricing</Link>
          <Link href="/dashboard" onClick={() => setIsOpen(false)} className="bg-white text-black px-5 py-3 rounded-xl text-center font-bold">Dashboard</Link>
        </div>
      )}
    </nav>
  );
}