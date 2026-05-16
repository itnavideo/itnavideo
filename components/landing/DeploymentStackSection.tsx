import { Cloud, Code2, Database, GitBranch, Server, TerminalSquare } from 'lucide-react';

const stackItems = [
  {
    title: 'Product app',
    description: 'The website, dashboard, account screens, upload flows, and lightweight orchestration run in a managed cloud app.',
    icon: Cloud,
  },
  {
    title: 'Dedicated render system',
    description: 'Heavy video jobs run away from the user-facing app so uploads, progress, and page loads stay responsive.',
    icon: Server,
  },
  {
    title: 'Video automation engine',
    description: 'Backend media tooling plans cuts, zooms, captions, overlays, audio polish, and export-safe layouts.',
    icon: TerminalSquare,
  },
  {
    title: 'Secure project data',
    description: 'Account state, project metadata, progress, leads, and video library records stay synced in a managed data layer.',
    icon: Database,
  },
  {
    title: 'Release workflow',
    description: 'The product and render systems ship from one organized release flow, keeping updates consistent.',
    icon: GitBranch,
  },
  {
    title: 'Media delivery layer',
    description: 'Uploads and final MP4 exports are stored in a delivery-optimized media layer for smooth playback.',
    icon: Code2,
  },
];

export default function DeploymentStackSection() {
  return (
    <section className="relative overflow-hidden bg-black px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.7fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-cyan-300">Production workflow</p>
            <h2 className="text-4xl font-black leading-tight tracking-normal text-white md:text-6xl">
              Built to keep creation fast while video work runs safely.
            </h2>
          </div>
          <p className="text-lg leading-8 text-zinc-400">
            Itnavideo separates the user experience from heavy video work: creators see a responsive dashboard while the media system processes, exports, and syncs progress in the background.
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
