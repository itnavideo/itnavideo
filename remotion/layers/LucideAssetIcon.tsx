import {
  AlertTriangle,
  BadgeIndianRupee,
  Banknote,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  FileText,
  GraduationCap,
  HeartPulse,
  HelpCircle,
  Landmark,
  Laptop,
  Lightbulb,
  LineChart,
  MessageCircle,
  PenLine,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Upload,
  UserRound,
  UsersRound,
  WalletCards,
  type LucideIcon,
} from 'lucide-react';

type LucideAssetIconProps = {
  name?: string;
  title?: string;
};

const ICONS: Record<string, LucideIcon> = {
  'alert-triangle': AlertTriangle,
  warning: AlertTriangle,
  'badge-indian-rupee': BadgeIndianRupee,
  rupee: BadgeIndianRupee,
  banknote: Banknote,
  money: CircleDollarSign,
  'circle-dollar-sign': CircleDollarSign,
  book: BookOpen,
  'book-open': BookOpen,
  briefcase: BriefcaseBusiness,
  'briefcase-business': BriefcaseBusiness,
  calendar: CalendarDays,
  'calendar-days': CalendarDays,
  check: CheckCircle2,
  'check-circle': CheckCircle2,
  'check-circle-2': CheckCircle2,
  clock: Clock3,
  'clock-3': Clock3,
  document: FileText,
  file: FileText,
  'file-text': FileText,
  'file-check': FileCheck2,
  'file-check-2': FileCheck2,
  education: GraduationCap,
  graduation: GraduationCap,
  'graduation-cap': GraduationCap,
  health: HeartPulse,
  'heart-pulse': HeartPulse,
  help: HelpCircle,
  'help-circle': HelpCircle,
  government: Landmark,
  landmark: Landmark,
  laptop: Laptop,
  idea: Lightbulb,
  lightbulb: Lightbulb,
  chart: LineChart,
  'line-chart': LineChart,
  comment: MessageCircle,
  'message-circle': MessageCircle,
  pen: PenLine,
  'pen-line': PenLine,
  search: Search,
  shield: ShieldCheck,
  'shield-check': ShieldCheck,
  sparkles: Sparkles,
  star: Star,
  target: Target,
  growth: TrendingUp,
  'trending-up': TrendingUp,
  upload: Upload,
  user: UserRound,
  'user-round': UserRound,
  users: UsersRound,
  'users-round': UsersRound,
  wallet: WalletCards,
  'wallet-cards': WalletCards,
};

export function LucideAssetIcon({name, title}: LucideAssetIconProps) {
  const Icon = ICONS[normalizeIconName(name)] || iconForTitle(title);

  return (
    <div className="asset-shot-lucide" aria-label={title || name || 'Icon'}>
      <Icon size={132} strokeWidth={2.6} />
    </div>
  );
}

function iconForTitle(title?: string) {
  const normalized = normalizeIconName(title);
  if (/\b(job|career|work|office|private)\b/.test(normalized)) return BriefcaseBusiness;
  if (/\b(government|exam|bank|rbi)\b/.test(normalized)) return Landmark;
  if (/\b(money|salary|income|rupee|paisa|finance|loan|pay)\b/.test(normalized)) return BadgeIndianRupee;
  if (/\b(date|time|deadline|minute|hour)\b/.test(normalized)) return Clock3;
  if (/\b(document|form|apply|admit|card|file)\b/.test(normalized)) return FileCheck2;
  if (/\b(skill|learn|student|study|education|course)\b/.test(normalized)) return GraduationCap;
  if (/\b(plan|target|goal|backup)\b/.test(normalized)) return Target;
  if (/\b(growth|opportunity|market|chart)\b/.test(normalized)) return TrendingUp;
  if (/\b(warn|risk|problem|attention|fail|error)\b/.test(normalized)) return AlertTriangle;
  if (/\b(question|comment|cta)\b/.test(normalized)) return HelpCircle;
  return Sparkles;
}

function normalizeIconName(value?: string) {
  return String(value || '')
    .replace(/^lucide:/i, '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
