import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { AuthProvider } from '@/components/auth/AuthContext';
import { AdminProvider } from '@/components/admin/AdminContext'; // Pehle se hai ✓
import { Toaster } from 'sonner';
import AppChrome from '@/components/layout/AppChrome';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.itnavideo.com";
const siteName = "Itnavideo";
const siteDescription =
  "Create AI explainer videos from audio or video. Itnavideo turns real speech into short vertical reels with creator video, subtitles, title, and support visuals.";

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
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: "Itnavideo | AI Explainer Video Generator for Reels and Shorts",
    template: "%s | Itnavideo",
  },
  description: siteDescription,
  keywords: [
    "AI video generator",
    "AI explainer video generator",
    "audio to reels generator",
    "finance reel generator",
    "Hinglish explainer video maker",
    "faceless explainer video maker",
    "AI reel maker",
    "YouTube Shorts generator",
    "Instagram Reels maker",
    "script to video",
    "voice to video AI",
    "video to reel",
    "video to reel maker",
    "AI subtitles for reels",
    "explainer video maker",
    "short form video generator",
  ],
  authors: [{ name: "Itnavideo" }],
  creator: "Itnavideo",
  publisher: "Itnavideo",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "fUpspvl0Zqhd0nPIDewDuDrP4DKNztIOINBz_5lSa4c",
  },
  openGraph: {
    title: "Itnavideo | AI Video Generator for Reels and Shorts",
    description: siteDescription,
    url: siteUrl,
    siteName,
    type: "website",
    images: [
      {
        url: "/visuals/previews/video-explainer-homepage.png",
        width: 1080,
        height: 1920,
        alt: "Itnavideo AI reel maker video type preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Itnavideo | AI Video Generator",
    description: siteDescription,
    images: ["/visuals/previews/video-explainer-homepage.png"],
  },
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


