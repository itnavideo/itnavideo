'use client';

import Link from "next/link";
import { useAdmin } from "./AdminContext";
import { useRouter, usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/videos", label: "Videos" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar() {
  const { logout } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <aside className="w-72 min-h-screen bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col">
      <div className="mb-10">
        <p className="text-3xl font-bold text-white">Admin</p>
        <p className="text-zinc-500 mt-2 text-sm">Manage your startup from one place.</p>
      </div>

      <nav className="space-y-3 text-zinc-300 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-2xl px-4 py-3 transition ${
                isActive 
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" 
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
        className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 text-red-400 px-4 py-3 rounded-2xl transition font-semibold"
      >
        Logout
      </button>
    </aside>
  );
}
