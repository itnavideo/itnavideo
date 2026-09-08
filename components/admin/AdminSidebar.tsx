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
  const [expandedSection, setExpandedSection] = useState<string>("Content / CMS");

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const categories = ["Overview", "Content / CMS", "Operations", "System"] as const;

  const toggleSection = (category: string) => {
    setExpandedSection((prev) => (prev === category ? "" : category));
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 p-4 select-none">
      {/* Brand & Admin Badge */}
      <div className="px-2 pt-2 pb-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <BrandLogo size="md" showTagline={false} />
          <div className="flex items-center gap-2 mt-2">
            <span className="h-2 w-2 rounded-full bg-[#34a853] shadow-[0_0_6px_#34a853]" />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-sans">
              Admin Workspace
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
        >
          <X size={18} />
        </button>
      </div>

      {/* Quick Action: New Post */}
      <div className="pt-4 pb-2 px-1">
        <Link
          href="/admin/cms/posts/new"
          onClick={() => setIsOpen(false)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#1a73e8] hover:bg-[#1967d2] text-white text-xs font-bold transition shadow-sm"
        >
          <Plus size={15} strokeWidth={2.5} /> Write New Article
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto space-y-5 pt-2 pr-1 custom-scrollbar">
        {categories.map((category) => {
          const items = ADMIN_SIDEBAR_ITEMS.filter((item) => item.category === category);
          const isContentCategory = category === "Content / CMS";

          return (
            <div key={category} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {category}
              </div>

              <div className="space-y-0.5">
                {items.map((item) => {
                  const isActive = pathname === item.href || (item.subItems && item.subItems.some((s) => pathname === s.href));
                  const Icon = item.icon;
                  const hasSubItems = item.subItems && item.subItems.length > 0;

                  return (
                    <div key={item.href} className="space-y-0.5">
                      <Link
                        href={item.href}
                        onClick={() => {
                          if (!hasSubItems) setIsOpen(false);
                        }}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-150 ${
                          pathname === item.href
                            ? "bg-[#1a73e8]/10 text-[#1a73e8] font-bold"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            size={16}
                            className={`shrink-0 ${
                              pathname === item.href
                                ? "text-[#1a73e8]"
                                : "text-slate-400 group-hover:text-slate-600"
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
                            {item.badge}
                          </span>
                        )}
                      </Link>

                      {/* WordPress Sub-items when on Content / CMS */}
                      {hasSubItems && (
                        <div className="pl-7 pr-1 py-1 space-y-0.5 border-l-2 border-slate-100 ml-5 my-0.5">
                          {item.subItems!.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            const SubIcon = sub.icon;
                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition ${
                                  isSubActive
                                    ? "bg-[#1a73e8] text-white font-bold shadow-xs"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                }`}
                              >
                                {SubIcon && <SubIcon size={12} className={isSubActive ? "text-white" : "text-slate-400"} />}
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
      <div className="mt-auto pt-4 border-t border-slate-200 space-y-2">
        <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg">
          <div className="h-7 w-7 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">Administrator</p>
            <p className="text-[10px] text-slate-500 truncate font-mono">founder@itnavideo.com</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-3 py-2 rounded-lg transition font-semibold text-xs"
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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <BrandLogo size="sm" />
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
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
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-72 max-w-sm h-full z-50 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
