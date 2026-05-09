import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <Link href="/" className="text-xl font-bold tracking-tight">
            Itna<span className="text-purple-500">video</span>
          </Link>
          <p className="text-zinc-500 text-sm mt-2">© 2024 Itnavideo. AI-first video OS.</p>
        </div>

        <div className="flex gap-8">
          <FooterLink href="/pricing" label="Pricing" />
          <FooterLink href="/dashboard" label="Dashboard" />
          <FooterLink href="mailto:support@itnavideo.com" label="Support" />
        </div>

        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center cursor-pointer hover:bg-zinc-800 transition-colors">
            <span className="text-xs">𝕏</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="text-sm text-zinc-400 hover:text-white transition-colors">
      {label}
    </Link>
  );
}