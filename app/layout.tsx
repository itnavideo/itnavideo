import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono, Instrument_Serif, Playfair_Display, Caveat, Lora } from "next/font/google";
import { AuthProvider } from '@/components/auth/AuthContext';
import { Toaster } from 'sonner';
import AppChrome from '@/components/layout/AppChrome';
import { HOMEPAGE_WORKFLOW_COUNT } from '@/constants/homepageWorkflows';

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
  `AI video creation platform with ${HOMEPAGE_WORKFLOW_COUNT} purpose-built studios for captions, Reels, YouTube videos, explainers, clips, image stories, and audio cleanup.`;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: `Itnavideo - AI Video Creation Platform | ${HOMEPAGE_WORKFLOW_COUNT} Workflows`,
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
  other: {
    "google-adsense-account": "ca-pub-7016787089009547",
  },
  openGraph: {
    title: "Itnavideo | AI Video Generator for Reels and Shorts",
    description: siteDescription,
    url: siteUrl,
    siteName,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Itnavideo AI Video Generator & Maker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Itnavideo | AI Video Generator",
    description: siteDescription,
    images: ["/og-image.png"],
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
    <html lang="en" suppressHydrationWarning className={`scroll-smooth ${inter.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} ${playfairDisplay.variable} ${caveat.variable} ${lora.variable}`}>
      <head>
        <meta name="google-adsense-account" content="ca-pub-7016787089009547" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7016787089009547"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} ${playfairDisplay.variable} ${caveat.variable} ${lora.variable} font-sans bg-background text-foreground antialiased`}
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
        <AuthProvider>
          <div className="relative flex flex-col min-h-screen">
            <AppChrome>{children}</AppChrome>
          </div>

          <Toaster richColors position="top-right" closeButton />
        </AuthProvider>
      </body>
      <Script strategy="lazyOnload" async src="https://www.googletagmanager.com/gtag/js?id=G-8NSFBYS9EF" />
      <Script id="google-analytics" strategy="lazyOnload">
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


