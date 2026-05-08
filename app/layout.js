import { ClerkProvider } from '@clerk/nextjs'; // 1. Clerk ko import kiya
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Itnavideo | AI Video Generator",
  description: "Transform your voice into viral short-form videos.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider> {/* 2. Pura app iske andar hona chahiye */}
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <body className="bg-black text-white min-h-screen">
          <Navbar />
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}