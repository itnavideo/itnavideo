'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activePath = pathname || '';
  const isFocusedRoute = activePath === '/login' || activePath === '/signup' || activePath.startsWith('/admin');
  const isDashboard = activePath.startsWith('/dashboard');
  const isPricingPage = activePath === '/pricing';
  const isAboutPage = activePath === '/about';
  const isContactPage = activePath === '/contact';
  const isFeaturesPage = activePath === '/features';
  const isVideoTypesPage = activePath === '/video-types';
  const hideFullFooter = isPricingPage || isAboutPage || isContactPage || isFeaturesPage || isVideoTypesPage || isDashboard;

  if (isFocusedRoute) {
    return <>{children}</>;
  }

  return (
    <>
      {!isDashboard && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!hideFullFooter ? <Footer /> : null}
    </>
  );
}
