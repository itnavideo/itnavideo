import { Cloud, Code2, Database, GitBranch, Server, TerminalSquare } from 'lucide-react';

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
    <section className="relative overflow-hidden bg-black px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.7fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-cyan-300">Product structure</p>
            <h2 className="text-4xl font-black leading-tight tracking-normal text-white md:text-6xl">
              Clean foundation for a heavier video engine.
            </h2>
          </div>
          <p className="text-lg leading-8 text-zinc-400">
            The public site, dashboard, render path, and data layer are organized so creator-facing video work can improve without breaking the whole product.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stackItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-lg border border-white/10 bg-zinc-950 p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-cyan-300/10 text-cyan-200">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
