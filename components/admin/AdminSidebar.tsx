'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useAdmin } from "./AdminContext";
import { useRouter, usePathname } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { ADMIN_SIDEBAR_ITEMS } from "./AdminSidebarItems";
import { LogOut, Menu, X } from "lucide-react";

export default function AdminSidebar() {
  const { logout } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80 p-5 select-none text-slate-800">
      {/* Brand & Logo */}
      <div className="px-2 pt-1 pb-6 border-b border-slate-100 flex items-center justify-between">
        <Link href="/admin/dashboard">
          <BrandLogo size="md" showTagline={false} />
        </Link>
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1.5 pt-6">
        {ADMIN_SIDEBAR_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href === '/admin/dashboard' && (pathname === '/admin' || pathname === '/admin/dashboard'));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-[#FF6D00]/10 text-[#FF6D00] font-bold border border-[#FF6D00]/20 shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              }`}
            >
              <Icon
                size={18}
                className={`shrink-0 ${
                  isActive ? "text-[#FF6D00]" : "text-slate-400"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="mt-auto pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center gap-3 px-3.5 py-2.5 bg-slate-50 border border-slate-200/70 rounded-2xl">
          <div className="h-8 w-8 rounded-full bg-[#FF6D00] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            R
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">Admin</p>
            <p className="text-[10px] text-slate-500 truncate font-mono">admin@itnavideo.com</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-4 py-2.5 rounded-2xl transition font-semibold text-xs border border-slate-200/50"
        >
          <LogOut size={14} className="text-slate-500" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200/80 px-4 py-3 flex items-center justify-between shadow-2xs">
        <BrandLogo size="sm" />
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-60 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsOpen(false)} />
          <div className="relative w-64 max-w-xs h-full z-50 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
