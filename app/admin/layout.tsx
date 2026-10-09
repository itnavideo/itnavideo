'use client';

import React, { useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminProvider, useAdmin } from "@/components/admin/AdminContext";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

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
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-[#FF6D00] mx-auto" />
          <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans antialiased">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Clean Light Top Header Bar matching screenshot */}
        <header className="h-16 bg-[#F8FAFC] border-b border-slate-200/60 sticky top-0 z-20 px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-500 hidden sm:inline">ItnaVideo</span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="text-sm font-bold text-slate-900 capitalize">
              {pathname.replace('/admin/', '').replace('/admin', 'Dashboard').replace('/', ' › ') || 'Dashboard'}
            </span>
          </div>

          {/* Top Right Admin Profile Pill matching screenshot */}
          <div className="flex items-center gap-2.5 ml-auto cursor-pointer hover:opacity-90 transition">
            <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              R
            </div>
            <span className="text-xs font-bold text-slate-800">Admin</span>
            <ChevronDown size={14} className="text-slate-500" />
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
