'use client';

import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdmin } from "@/components/admin/AdminContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }) {
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading admin panel...</p>
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
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="flex-1 p-8 lg:p-12">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

