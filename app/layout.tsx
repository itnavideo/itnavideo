import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from '@/components/AuthContext';
import { AdminProvider } from '@/components/AdminContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Itnavideo | AI-Powered Video Engine",
  description:
    "Transform voiceovers into viral cinematic videos in seconds with Itnavideo.",
  verification: {
    google: "fUpspvl0Zqhd0nPIDewDuDrP4DKNztIOINBz_5lSa4c",
  },
  // OpenGraph standard for YC-level startups
  openGraph: {
    title: "Itnavideo",
    description: "The better way to create viral content.",
    type: "website",
  }
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-black text-white antialiased`}
      >
        {/* AuthProvider must wrap AdminProvider because Admin depends on Auth */}
        <AuthProvider>
          <AdminProvider>
            <div className="relative flex flex-col min-h-screen">
              <Navbar />
              
              <main className="flex-grow">
                {children}
              </main>

              <Footer />
            </div>
          </AdminProvider>
        </AuthProvider>
      </body>
    </html>
  );
}