import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Settings,
} from "lucide-react";

export type SidebarItem = {
  label: string;
  href: string;
  icon: any;
};

export const ADMIN_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Revenue",
    href: "/admin/revenue",
    icon: TrendingUp,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];
