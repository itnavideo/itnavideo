import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { AuthProvider } from '@/components/auth/AuthContext';
import { AdminProvider } from '@/components/admin/AdminContext'; // Pehle se hai ✓
import { Toaster } from 'sonner';
import AppChrome from '@/components/layout/AppChrome';

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.itnavideo.com";
const siteName = "Itnavideo";
const siteDescription =
  "Create polished short reels or long caption pro videos from your uploads. Itnavideo adds timed captions while preserving original video and audio.";

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
    default: "Itnavideo - AI Video Creation Platform | 11 Workflows",
    template: "%s | Itnavideo",
  },
  description: siteDescription,
  keywords: [
    "free ai video generator",
    "ai video generator free",
    "ai video generators",
    "ai videogenerator",
    "ai video generator",
    "text to video generator",
    "ai video maker",
    "ai video creator",
    "best ai video generator",
    "ai generate video",
    "ai video generation",
    "best ai video generators",
    "ai video generation platform",
    "ai generate videos",
    "ai video gen",
    "ai video makers",
    "ai generated videos",
    "video ai generator",
    "ai free video generator",
    "reel creator",
    "ai video creators",
    "automatic captions generator",
    "video creator ai",
    "ai cartoon video generator",
    "auto caption generator free",
    "video making ai",
    "make ai videos",
    "ai reel maker",
    "ai generated video free",
    "ai reels maker",
    "ai animation video generator",
    "ai animated video generator",
    "audio to video ai",
    "ai video creator free",
    "ai video making",
    "free ai generated video",
    "reel maker ai",
    "videos subtitle generator",
    "ai avatar video generator",
    "ai text to video generator",
    "ai generator video",
    "ai video creation platform",
    "online ai video generator",
    "ai creator video",
    "instagram reels generator",
    "add text into video",
    "subtitle generator free",
    "make video with ai",
    "free ai video creator",
    "youtube shorts maker",
    "caption generator from video",
    "text to video ai generator",
    "ai subtitle generator",
    "free subtitle generator",
    "make a short video",
    "ai make video",
    "free caption generator for videos",
    "ai making videos",
    "video caption generator free",
    "auto subtitle generator free",
  ],
  authors: [{ name: "Itnavideo" }],
  creator: "Itnavideo",
  publisher: "Itnavideo",
  alternates: {
    canonical: siteUrl,
    languages: {
      "en": siteUrl,
      "en-US": siteUrl,
      "x-default": siteUrl,
    },
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
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
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} font-sans bg-background text-foreground antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Itnavideo",
              url: siteUrl,
              logo: `${siteUrl}/icon`,
              sameAs: [
                "https://x.com/itnavideo",
                "https://www.facebook.com/itnavideo",
                "https://www.instagram.com/itnavideo/",
                "https://www.youtube.com/@Itnavideo",
                "https://www.linkedin.com/company/itnavideo-ai/",
                "https://www.linkedin.com/in/syedrohi/",
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
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


