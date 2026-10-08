'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useAdmin } from "./AdminContext";
import { useRouter, usePathname } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";
import { ADMIN_SIDEBAR_ITEMS, SidebarItem } from "./AdminSidebarItems";
import {
  LogOut,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Plus
} from "lucide-react";

export default function AdminSidebar() {
  const { logout } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string>("Users & Revenue");

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const categories = ["Overview", "Users & Revenue", "Operations", "System"] as const;

  const toggleSection = (category: string) => {
    setExpandedSection((prev) => (prev === category ? "" : category));
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0E1526] border-r border-white/10 p-4 select-none text-zinc-100">
      {/* Brand & Admin Badge */}
      <div className="px-2 pt-2 pb-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <BrandLogo size="md" showTagline={false} />
          <div className="flex items-center gap-2 mt-2">
            <span className="h-2 w-2 rounded-full bg-[#FF6D00] shadow-[0_0_8px_#FF6D00] animate-pulse" />
            <span className="text-[11px] font-black text-zinc-400 uppercase tracking-wider font-sans">
              Admin Workspace
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10"
        >
          <X size={18} />
        </button>
      </div>

      {/* Quick Action: Manage Users */}
      <div className="pt-4 pb-2 px-1">
        <Link
          href="/admin/users"
          onClick={() => setIsOpen(false)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] hover:brightness-110 text-black text-xs font-black transition shadow-sm active:scale-95"
        >
          <Plus size={15} strokeWidth={2.5} /> Manage Users
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto space-y-5 pt-2 pr-1 custom-scrollbar">
        {categories.map((category) => {
          const items = ADMIN_SIDEBAR_ITEMS.filter((item) => item.category === category);

          return (
            <div key={category} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                {category}
              </div>

              <div className="space-y-0.5">
                {items.map((item) => {
                  const isActive = pathname === item.href || (item.subItems && item.subItems.some((s) => pathname === s.href));
                  const Icon = item?.icon || Sparkles;
                  const hasSubItems = item.subItems && item.subItems.length > 0;

                  return (
                    <div key={item.href} className="space-y-0.5">
                      <Link
                        href={item.href}
                        onClick={() => {
                          if (!hasSubItems) setIsOpen(false);
                        }}
                        className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all duration-150 ${
                          pathname === item.href
                            ? "bg-gradient-to-r from-[#FF6D00]/20 to-[#FF8F00]/10 border border-[#FF6D00]/40 text-[#FFA726] font-black"
                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            size={16}
                            className={`shrink-0 ${
                              pathname === item.href
                                ? "text-[#FF9100]"
                                : "text-zinc-500 group-hover:text-zinc-300"
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FF6D00]/20 text-[#FFA726] border border-[#FF6D00]/30">
                            {item.badge}
                          </span>
                        )}
                      </Link>

                      {/* WordPress Sub-items when on Content / CMS */}
                      {hasSubItems && (
                        <div className="pl-7 pr-1 py-1 space-y-0.5 border-l-2 border-white/10 ml-5 my-0.5">
                          {item.subItems!.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            const SubIcon = sub?.icon || Sparkles;
                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                                  isSubActive
                                    ? "bg-[#FF6D00] text-black font-black shadow-xs"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                                }`}
                              >
                                {SubIcon && <SubIcon size={12} className={isSubActive ? "text-black" : "text-zinc-500"} />}
                                <span>{sub.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Profile & Logout */}
      <div className="mt-auto pt-4 border-t border-white/10 space-y-2">
        <div className="flex items-center gap-2.5 px-3 py-2 bg-[#151E30] border border-white/10 rounded-xl">
          <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-[#FF6D00] to-[#FFA726] text-black flex items-center justify-center font-black text-xs shadow-xs">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">Administrator</p>
            <p className="text-[10px] text-zinc-400 truncate font-mono">founder@itnavideo.com</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-1.5 bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-red-400 px-3 py-2 rounded-xl transition font-bold text-xs"
        >
          <LogOut size={13} />
          <span>Exit Admin Session</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0E1526] border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-sm">
        <BrandLogo size="sm" />
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/15"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 shadow-sm z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-72 max-w-sm h-full z-50 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
