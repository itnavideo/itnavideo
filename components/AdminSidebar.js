import Link from "next/link";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/videos", label: "Videos" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar() {
  return (
    <aside className="w-72 min-h-screen bg-zinc-950 border-r border-zinc-800 p-6">
      <div className="mb-10">
        <p className="text-3xl font-bold text-white">Admin</p>
        <p className="text-zinc-500 mt-2 text-sm">Manage your startup from one place.</p>
      </div>

      <nav className="space-y-3 text-zinc-300">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-2xl px-4 py-3 hover:bg-zinc-900 hover:text-white transition"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
