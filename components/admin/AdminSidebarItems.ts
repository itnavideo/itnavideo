import {
  LayoutDashboard,
  BarChart3,
  Users,
  Film,
  Sparkles,
  Coins,
  CreditCard,
  TrendingUp,
  ListOrdered,
  FileText,
  Activity,
  Settings,
  Layers,
  IndianRupee,
  UserCheck,
} from "lucide-react";

export type SidebarItem = {
  label: string;
  href: string;
  icon: any;
  category: "Overview" | "Users & Revenue" | "Operations" | "System";
  badge?: string;
  badgeColor?: string;
  subItems?: { label: string; href: string; icon?: any }[];
};

export const ADMIN_SIDEBAR_ITEMS: SidebarItem[] = [
  // Overview
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    category: "Overview",
  },
  {
    label: "Product Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    category: "Overview",
  },

  // Users & Revenue (primary focus)
  {
    label: "Users & Accounts",
    href: "/admin/users",
    icon: Users,
    category: "Users & Revenue",
  },
  {
    label: "Subscriptions",
    href: "/admin/subscriptions",
    icon: CreditCard,
    category: "Users & Revenue",
  },
  {
    label: "Revenue & Billing",
    href: "/admin/revenue",
    icon: TrendingUp,
    category: "Users & Revenue",
    badge: "₹",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    label: "Credits & Usage",
    href: "/admin/credits",
    icon: Coins,
    category: "Users & Revenue",
  },

  // Operations
  {
    label: "Rendered Videos",
    href: "/admin/videos",
    icon: Film,
    category: "Operations",
  },
  {
    label: "Templates Catalog",
    href: "/admin/templates",
    icon: Sparkles,
    category: "Operations",
  },
  {
    label: "Typography Analyzer",
    href: "/admin/typography-analyzer",
    icon: Layers,
    category: "Operations",
    badge: "AI Vision",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },

  // System
  {
    label: "Render Queue",
    href: "/admin/queue",
    icon: ListOrdered,
    category: "System",
  },
  {
    label: "Activity Audit Logs",
    href: "/admin/activity",
    icon: FileText,
    category: "System",
  },
  {
    label: "System Health",
    href: "/admin/health",
    icon: Activity,
    category: "System",
  },
  {
    label: "Global Settings",
    href: "/admin/settings",
    icon: Settings,
    category: "System",
  },
];
