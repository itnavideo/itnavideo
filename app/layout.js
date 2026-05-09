// app/layout.js

import "./globals.css";
import Navbar from "@/components/Navbar";
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Itnavideo",
  description:
    "AI-powered video creation platform for creators, educators, and businesses.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <AuthProvider>
          {/* Navbar */}
          <Navbar />

          {/* Main Content */}
          <main>
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-zinc-800 mt-20">

            <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">

              <div>
                <h2 className="text-2xl font-bold">
                  Itna<span className="text-purple-500">video</span>
                </h2>

                <p className="text-zinc-500 mt-2 text-sm">
                  Built for the next generation of creators 🚀
                </p>
              </div>

              <div className="flex items-center gap-6 text-zinc-400 text-sm">
                <a href="/about" className="hover:text-white transition">
                  About
                </a>

                <a href="/pricing" className="hover:text-white transition">
                  Pricing
                </a>

                <a href="/contact" className="hover:text-white transition">
                  Contact
                </a>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}