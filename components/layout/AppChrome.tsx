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
  const isDashboard = activePath.startsWith('/dashboard');
  const isPricingPage = activePath === '/pricing';
  const isAboutPage = activePath === '/about';
  const isContactPage = activePath === '/contact';
  const isFeaturesPage = activePath === '/features';
  const isVideoTypesPage = activePath === '/video-types';
  const hideFullFooter = isPricingPage || isAboutPage || isContactPage || isFeaturesPage || isVideoTypesPage || isDashboard;
  // Sticky mobile CTA is an acquisition prompt — only for logged-out visitors on marketing pages.
  // Never on the dashboard/pricing (paid context) and never for signed-in users.
  const showStickyMobileCTA = !user && !isFocusedRoute && !isDashboard && !isPricingPage;

  const isStudioSubpage = activePath.startsWith('/dashboard/') && activePath !== '/dashboard';

  if (isFocusedRoute) {
    return <>{children}</>;
  }

  return (
    <>
      {!isStudioSubpage && <Navbar />}
      {/* pb offset so the fixed CTA never covers the last row of page content on mobile */}
      <main className={`flex-grow ${showStickyMobileCTA ? 'pb-24 sm:pb-0' : ''}`}>{children}</main>
      {!hideFullFooter ? <Footer /> : null}
      {showStickyMobileCTA ? <StickyMobileCTA /> : null}
    </>
  );
}

function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 block border-t border-white/10 bg-black/95 px-4 py-3 backdrop-blur-lg sm:hidden shadow-2xl">
      <Link
        href="/signup"
        className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-6 py-3.5 text-sm font-black text-black shadow-lg shadow-[#FF6D00]/25 transition active:scale-[0.97] hover:brightness-110"
      >
        <Sparkles size={15} />
        <span>Get Started Free — 3 Free Videos</span>
      </Link>
    </div>
  );
}
