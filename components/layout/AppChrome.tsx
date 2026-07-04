'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activePath = pathname || '';
  const isFocusedRoute = activePath === '/login' || activePath === '/signup' || activePath.startsWith('/admin');
  const isDashboard = activePath === '/dashboard';
  const isPricingPage = activePath === '/pricing';
  const isAboutPage = activePath === '/about';
  const isContactPage = activePath === '/contact';
  const isFeaturesPage = activePath === '/features';
  const isVideoTypesPage = activePath === '/video-types';
  const hideFullFooter = isPricingPage || isAboutPage || isContactPage || isFeaturesPage || isVideoTypesPage || isDashboard;
  const showStickyMobileCTA = !isFocusedRoute && !isDashboard && !isPricingPage && (activePath === '/' || activePath.startsWith('/video-types') || activePath.length <= 40);

  if (isFocusedRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      {!hideFullFooter ? <Footer /> : null}
      {showStickyMobileCTA ? <StickyMobileCTA /> : null}
    </>
  );
}

function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 block border-t border-white/10 bg-black/90 px-4 py-3 backdrop-blur-lg sm:hidden">
      <Link
        href="/dashboard"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-500 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-pink-500/20 transition active:scale-[0.97]"
      >
        Create My Free Video
      </Link>
    </div>
  );
}
