'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Video, Twitter, Github, Linkedin } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      // newsletter collection mein email aur timestamp add karein
      await addDoc(collection(db, 'newsletter'), {
        email: email,
        subscribedAt: serverTimestamp(),
      });

      setEmail('');
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <footer className="w-full bg-black border-t border-white/5 pt-20 pb-10 px-6">
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 pb-16 border-b border-white/5">
        <div className="max-w-md">
          <h3 className="text-white font-bold text-xl mb-2 tracking-tight">Stay updated</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Get the latest news on AI video features and cinematic tools directly in your inbox.
          </p>
        </div>
        <form className="flex flex-col w-full md:w-auto gap-2" onSubmit={handleSubscribe}>
          <div className="flex gap-2 w-full">
          <input 
            type="email" 
            placeholder="Email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all w-full md:w-72 placeholder:text-zinc-600"
            required
            disabled={status === 'loading'}
          />
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="bg-white text-black text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-zinc-200 transition-all whitespace-nowrap active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
          </div>
          {status === 'success' && <p className="text-green-500 text-xs font-medium animate-fade-in">Successfully subscribed! 🎉</p>}
          {status === 'error' && <p className="text-red-500 text-xs font-medium animate-fade-in">Something went wrong. Please try again.</p>}
        </form>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
        
        {/* Brand Section */}
        <div className="col-span-2">
          <Link href="/" className="text-2xl font-extrabold text-white flex items-center gap-2 mb-6 group">
            <div className="bg-purple-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
              <Video size={18} fill="white" />
            </div>
            <span className="tracking-tighter">Itna<span className="text-purple-500">video</span></span>
          </Link>
          <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
            The AI operating system for modern creators. Turn your voice into cinematic videos in seconds.
          </p>
          <div className="flex gap-4 mt-6">
            <Twitter size={20} className="text-zinc-600 hover:text-purple-400 cursor-pointer transition" />
            <Github size={20} className="text-zinc-600 hover:text-purple-400 cursor-pointer transition" />
            <Linkedin size={20} className="text-zinc-600 hover:text-purple-400 cursor-pointer transition" />
          </div>
        </div>

        {/* Links: Product */}
        <div>
          <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Product</h4>
          <ul className="space-y-4 text-zinc-500 text-sm">
            <li><Link href="/#features" className="hover:text-purple-400 hover:underline transition-colors">Features</Link></li>
            <li><Link href="/#ai-voice" className="hover:text-purple-400 hover:underline transition-colors">AI Voice</Link></li>
            <li><Link href="/pricing" className="hover:text-purple-400 hover:underline transition-colors">Pricing</Link></li>
            <li><Link href="/roadmap" className="hover:text-purple-400 hover:underline transition-colors">Roadmap</Link></li>
          </ul>
        </div>

        {/* Links: Resources */}
        <div>
          <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Resources</h4>
          <ul className="space-y-4 text-zinc-500 text-sm">
            <li><Link href="/docs" className="hover:text-purple-400 hover:underline transition-colors">Documentation</Link></li>
            <li><Link href="/blog" className="hover:text-purple-400 hover:underline transition-colors">AI Blog</Link></li>
            <li><Link href="/community" className="hover:text-purple-400 hover:underline transition-colors">Community</Link></li>
            <li><Link href="/support" className="hover:text-purple-400 hover:underline transition-colors">Help Center</Link></li>
          </ul>
        </div>

        {/* Links: Company */}
        <div>
          <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Company</h4>
          <ul className="space-y-4 text-zinc-500 text-sm">
            <li><Link href="/about" className="hover:text-purple-400 hover:underline transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-purple-400 hover:underline transition-colors">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-purple-400 hover:underline transition-colors">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-purple-400 hover:underline transition-colors">Terms</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600 font-medium">
        <p className="text-zinc-500">© 2026 Itnavideo Inc. All rights reserved.</p>
        <div className="flex gap-8 text-zinc-500">
          <Link href="/admin/login" className="hover:text-purple-400 hover:underline transition-colors">Admin Portal</Link>
          <span>Built with ❤️ for creators</span>
        </div>
      </div>
    </footer>
  );
}