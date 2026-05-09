// app/layout.js

import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from '@/components/AuthContext';
import { AdminProvider } from '@/components/AdminContext';
import { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Itnavideo",
  description:
    "AI-powered video creation platform for creators, educators, and businesses.",
  verification: {
    google: "fUpspvl0Zqhd0nPIDewDuDrP4DKNztIOINBz_5lSa4c",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-black text-white antialiased`}
      >
        <AuthProvider>
          <AdminProvider>
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main>
              {children}
            </main>

            <Footer />
          </AdminProvider>
        </AuthProvider>
      </body>
    </html>
  );
}