import { Cloud, Code2, Database, GitBranch, Server, TerminalSquare, ShieldCheck } from 'lucide-react';

const stackItems = [
  {
    title: 'Product app',
    description: 'The website, dashboard, and account screens stay clean while the new creator tools are planned.',
    icon: Cloud,
  },
  {
    title: 'Render path',
    description: 'Media planning and secure rendering stay separate from the public marketing pages.',
    icon: Server,
  },
  {
    title: 'Storage controls',
    description: 'Temporary uploads and completed MP4 links are handled with lifecycle-aware storage.',
    icon: TerminalSquare,
  },
  {
    title: 'Secure site data',
    description: 'Auth, waitlist, careers, and basic settings stay in a managed data layer.',
    icon: Database,
  },
  {
    title: 'Release flow',
    description: 'Product updates ship from one organized release flow.',
    icon: GitBranch,
  },
  {
    title: 'Automation layer',
    description: 'Planner, asset matching, status sync, and cleanup tasks can evolve without redesigning the site.',
    icon: Code2,
  },
];

export default function DeploymentStackSection() {
  return (
    <section className="relative overflow-hidden bg-background border-t border-border px-6 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_0px,rgba(245,158,11,0.02),transparent_100%)]" />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="mb-16 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <ShieldCheck size={12} />
              <span>PRODUCT STRUCTURE</span>
            </p>
            <h2 className="text-3xl font-black leading-tight tracking-tight text-foreground md:text-5xl font-sans">
              Clean foundation for a <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">heavier video engine.</span>
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The public site, dashboard, render path, and data layer are organized so creator-facing video work can improve without breaking the whole product.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {stackItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-3xl border border-border bg-card p-6 shadow-sm backdrop-blur-md transition duration-300 hover:border-amber-500/20 hover:bg-accent dark:border-border dark:bg-muted/20 dark:hover:bg-muted/40 group">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 group-hover:text-orange-500 dark:group-hover:text-orange-400 group-hover:border-orange-500/20 transition duration-300">
                  <Icon size={18} />
                </div>
                <h3 className="text-base font-bold text-card-foreground transition">{item.title}</h3>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

