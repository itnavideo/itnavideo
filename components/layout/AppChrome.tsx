'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const activePath = pathname || '';
  const isFocusedRoute = activePath === '/login' || activePath === '/signup' || activePath.startsWith('/admin');
  const isDashboard = activePath === '/dashboard';
  const isPricingPage = activePath === '/pricing';
  const isAboutPage = activePath === '/about';
  const isContactPage = activePath === '/contact';
  const isFeaturesPage = activePath === '/features';
  const isVideoTypesPage = activePath === '/video-types';
  const hideFullFooter = isPricingPage || isAboutPage || isContactPage || isFeaturesPage || isVideoTypesPage || isDashboard;
  // Sticky mobile CTA is an acquisition prompt — only for logged-out visitors on marketing pages.
  // Never on the dashboard/pricing (paid context) and never for signed-in users.
  const showStickyMobileCTA = !user && !isFocusedRoute && !isDashboard && !isPricingPage;

  if (isFocusedRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {/* pb offset so the fixed CTA never covers the last row of page content on mobile */}
      <main className={`flex-grow ${showStickyMobileCTA ? 'pb-24 sm:pb-0' : ''}`}>{children}</main>
      {!hideFullFooter ? <Footer /> : null}
      {showStickyMobileCTA ? <StickyMobileCTA /> : null}
    </>
  );
}

function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 block border-t border-white/10 bg-[#052e16]/92 px-4 py-3 backdrop-blur-lg sm:hidden">
      <Link
        href="/signup"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200/25 bg-emerald-400 px-6 py-3.5 text-sm font-black text-slate-950 shadow-[0_0_26px_rgba(34,211,238,0.25)] transition active:scale-[0.97]"
      >
        Get Started
      </Link>
    </div>
  );
}
