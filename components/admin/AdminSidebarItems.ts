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
  PenTool,
  PlusCircle,
  Image as ImageIcon,
  Globe,
  Tag,
  Layers
} from "lucide-react";

export type SidebarItem = {
  label: string;
  href: string;
  icon: any;
  category: "Overview" | "Content / CMS" | "Operations" | "System";
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

  // Content / CMS (WordPress Integrated)
  {
    label: "Content Hub",
    href: "/admin/cms",
    icon: PenTool,
    category: "Content / CMS",
    badge: "WordPress",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    subItems: [
      { label: "All Posts", href: "/admin/cms", icon: FileText },
      { label: "Add New Post", href: "/admin/cms/posts/new", icon: PlusCircle },
      { label: "Media Library", href: "/admin/cms/media", icon: ImageIcon },
      { label: "Custom Pages", href: "/admin/cms/pages", icon: Globe },
    ],
  },

  // Operations
  {
    label: "Users & Accounts",
    href: "/admin/users",
    icon: Users,
    category: "Operations",
  },
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
  {
    label: "Credits & Usage",
    href: "/admin/credits",
    icon: Coins,
    category: "Operations",
  },
  {
    label: "Subscriptions",
    href: "/admin/subscriptions",
    icon: CreditCard,
    category: "Operations",
  },
  {
    label: "Revenue & Billing",
    href: "/admin/revenue",
    icon: TrendingUp,
    category: "Operations",
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
