"use client";
import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition">
          ITNAVIDEO<span className="text-purple-500">.</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
          <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
          <Link 
            href="/create" 
            className="bg-white text-black px-4 py-2 rounded-lg hover:bg-purple-500 hover:text-white transition"
          >
            Create Video
          </Link>
        </div>
      </div>
    </nav>
  );
}