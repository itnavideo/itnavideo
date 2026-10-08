'use client';

import React, { useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminProvider, useAdmin } from "@/components/admin/AdminContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Globe
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProvider>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
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
      <div className="min-h-screen bg-[#070B14] text-zinc-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/10 border-t-[#FF6D00] mx-auto" />
          <p className="text-xs font-black tracking-wider text-zinc-400 uppercase">
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
    <div className="min-h-screen bg-[#070B14] text-zinc-100 flex font-sans antialiased">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Google Analytics Style Dark Top Bar */}
        <header className="h-16 border-b border-white/10 bg-[#0E1526]/90 backdrop-blur-md sticky top-0 z-20 px-6 lg:px-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[11px] font-black text-zinc-500 uppercase tracking-wider">
              Console
            </span>
            <span className="hidden sm:inline-block text-zinc-600">/</span>
            <span className="text-xs font-black text-white capitalize">
              {pathname.replace('/admin/', '').replace('/admin', 'Dashboard').replace('/', ' › ') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* System Status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#151E30] border border-white/10 rounded-full text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold text-[11px]">AWS Lambda Render Active</span>
            </div>

            {/* View Live Website Link */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-[#151E30] text-xs font-bold text-zinc-300 hover:text-white hover:border-[#FF6D00]/50 transition"
            >
              <Globe size={13} className="text-[#FF9100]" /> Live Site
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
