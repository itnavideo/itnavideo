'use client';

import Link from "next/link";
import { useAdmin } from "./AdminContext";
import { useRouter, usePathname } from "next/navigation";
import BrandLogo from "@/components/brand/BrandLogo";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin", label: "Control room" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/videos", label: "Videos" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar() {
  const { logout } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <aside className="w-72 min-h-screen bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col">
      <div className="mb-10">
        <BrandLogo size="md" showTagline />
        <p className="text-zinc-500 mt-4 text-sm">Founder control room</p>
      </div>

      <nav className="space-y-3 text-zinc-300 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-4 py-3 text-sm font-bold transition ${
                isActive
                  ? "bg-brand-mint text-black shadow-lg shadow-blue-500/10"
                  : "hover:bg-zinc-900 hover:text-white text-zinc-400"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 text-red-400 px-4 py-3 rounded-lg transition font-semibold"
      >
        Logout
      </button>
    </aside>
  );
}

