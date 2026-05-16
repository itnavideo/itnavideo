import { Cloud, Code2, Database, GitBranch, Server, TerminalSquare } from 'lucide-react';

const stackItems = [
  {
    title: 'Next.js on Vercel',
    description: 'The website, dashboard, auth screens, upload flows, and lightweight API orchestration run on Vercel.',
    icon: Cloud,
  },
  {
    title: 'Render worker',
    description: 'Long FFmpeg jobs run on the dedicated Render backend so Vercel does not get stuck on video rendering.',
    icon: Server,
  },
  {
    title: 'Python video engine',
    description: 'Python assists with timeline planning, jump cuts, zooms, captions, icon overlays, and FFmpeg filter generation.',
    icon: TerminalSquare,
  },
  {
    title: 'Supabase data',
    description: 'Auth, project metadata, render status, leads, and video library state are stored in Supabase.',
    icon: Database,
  },
  {
    title: 'GitHub source',
    description: 'The deployable codebase is organized for separate Vercel app and Render worker deployments from the same repo.',
    icon: GitBranch,
  },
  {
    title: 'Cloudinary media',
    description: 'User uploads and final MP4 renders are uploaded to Cloudinary for reliable playback and delivery.',
    icon: Code2,
  },
];

export default function DeploymentStackSection() {
  return (
    <section className="relative overflow-hidden bg-black px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.7fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-cyan-300">Production stack</p>
            <h2 className="text-4xl font-black leading-tight tracking-normal text-white md:text-6xl">
              Deployed as a web app plus a render worker.
            </h2>
          </div>
          <p className="text-lg leading-8 text-zinc-400">
            Itnavideo now separates the user experience from heavy video work: Next.js handles the product, Render handles FFmpeg, Python handles editing logic, and Supabase keeps status in sync.
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
