'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activePath = pathname || '';
  const isFocusedRoute = activePath === '/login' || activePath === '/signup' || activePath.startsWith('/admin');

  if (isFocusedRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}

