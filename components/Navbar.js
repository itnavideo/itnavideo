'use client';

import Link from 'next/link';
import { useAuth } from './AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full p-6 border-b border-zinc-800 bg-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-3xl font-bold text-white hover:opacity-90 transition flex items-center gap-1">
          <span>Itna</span><span className="text-purple-500 font-bold">video</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/about" className="text-zinc-400 hover:text-white transition">
            About
          </Link>
          <Link href="/pricing" className="text-zinc-400 hover:text-white transition">
            Pricing
          </Link>
          <Link href="/contact" className="text-zinc-400 hover:text-white transition">
            Contact
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-zinc-400 hover:text-white transition"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl text-sm transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-zinc-400 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-xl text-sm font-semibold transition"
              >
                Sign Up
              </Link>
            </>
          )}
          <Link
            href="/admin/login"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition ml-2"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}