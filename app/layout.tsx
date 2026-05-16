import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { AuthProvider } from '@/components/auth/AuthContext';
import { AdminProvider } from '@/components/admin/AdminContext'; // Pehle se hai ✓
import { Toaster } from 'sonner';
import AppChrome from '@/components/layout/AppChrome';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Itnavideo | AI-Powered Video Engine",
  description: "Create typography-first 720p Shorts from voiceover audio with Itnavideo.",
  verification: {
    google: "fUpspvl0Zqhd0nPIDewDuDrP4DKNztIOINBz_5lSa4c",
  },
  openGraph: {
    title: "Itnavideo",
    description: "Audio-first Shorts rendered with AI planning and a private media engine.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} font-sans bg-black text-white antialiased`}
      >
        {/* AuthProvider user authentication ke liye */}
        <AuthProvider>
          {/* AdminProvider admin panel access ke liye */}
          <AdminProvider>
            <div className="relative flex flex-col min-h-screen">
              <AppChrome>{children}</AppChrome>
            </div>
            
            {/* Popups/Toasts ke liye */}
            <Toaster richColors position="top-right" closeButton />
          </AdminProvider>
        </AuthProvider>
      </body>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-8NSFBYS9EF" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-8NSFBYS9EF');
        `}
      </Script>
    </html>
  );
}

