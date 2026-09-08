'use client';

import React, { useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdmin } from "@/components/admin/AdminContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
  Bell,
  Sparkles,
  HelpCircle,
  FileText
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdminLoggedIn, loading } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !isAdminLoggedIn && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [isAdminLoggedIn, loading, router, isLoginPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-[#1a73e8] mx-auto" />
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Loading Admin Console...
          </p>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAdminLoggedIn && !isLoginPage) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans antialiased">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Google Analytics Style Top Bar */}
        <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-20 px-6 lg:px-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Console
            </span>
            <span className="hidden sm:inline-block text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-700 capitalize">
              {pathname.replace('/admin/', '').replace('/admin', 'Dashboard').replace('/', ' › ') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* System Status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs">
              <span className="h-2 w-2 rounded-full bg-[#34a853] animate-pulse" />
              <span className="text-emerald-700 font-semibold text-[11px]">Lambda Engine: Ready</span>
            </div>

            {/* View Live Website Link */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              <Globe size={13} className="text-[#1a73e8]" /> Live Site
            </Link>

            {/* Quick Link to Blog */}
            <Link
              href="/blog"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              <FileText size={13} className="text-[#34a853]" /> Public Blog
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
