import Link from 'next/link';
import { ArrowRight, BookOpen, Captions, Cloud, Database, FolderOpen, GitBranch, Mic, Server, TerminalSquare } from 'lucide-react';

const sections = [
  {
    title: 'Choose a video mode',
    description: 'Use faceless mode for required audio and optional visuals, or face-camera mode for one uploaded talking-head video.',
    icon: Mic,
  },
  {
    title: 'Upload your source',
    description: 'Faceless accepts audio plus optional images, screenshots, and clips. Face camera accepts a video file for editing.',
    icon: FolderOpen,
  },
  {
    title: 'Review the render',
    description: 'Check jump cuts, zooms, captions, icons, audio polish, and the final 720p vertical MP4.',
    icon: Captions,
  },
];

const deploymentItems = [
  {
    title: 'Product app',
    description: 'Runs the website, dashboard, account screens, upload flows, and lightweight orchestration.',
    icon: Cloud,
  },
  {
    title: 'Media system',
    description: 'Handles long video jobs, final export, media delivery, and progress updates away from the main app.',
    icon: Server,
  },
  {
    title: 'Media intelligence',
    description: 'Plans talking-head cuts, zooms, captions, overlays, sound timing, and export-safe layouts.',
    icon: TerminalSquare,
  },
  {
    title: 'Project data',
    description: 'Keeps account state, project records, progress, leads, and dashboard video metadata synced.',
    icon: Database,
  },
  {
    title: 'Release flow',
    description: 'Keeps product and media-system updates coordinated from one controlled release process.',
    icon: GitBranch,
  },
];

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#050506] px-6 pb-24 pt-32 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-7 inline-flex items-center gap-2 rounded-lg border border-brand-mint/20 bg-brand-mint/10 px-3 py-2 text-sm font-bold text-brand-mint">
          <BookOpen size={16} />
          Documentation
        </div>
        <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">Create videos with Itnavideo.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
          A simple guide for using the two creation modes and understanding the current production workflow.
        </p>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <div key={section.title} className="rounded-lg border border-white/10 bg-zinc-950 p-6">
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-md bg-brand-mint/10 text-brand-mint">
                  <Icon size={20} />
                </div>
                <h2 className="text-xl font-bold">{section.title}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{section.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-14">
          <h2 className="text-3xl font-black">Production workflow</h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400">
            The app is split so video generation does not block the website. The product experience stays responsive while a dedicated media system handles long processing work and keeps progress synced.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {deploymentItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-lg border border-white/10 bg-zinc-950 p-5">
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md bg-cyan-300/10 text-cyan-200">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-3 text-xs leading-5 text-zinc-400">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-14 rounded-lg border border-white/10 bg-zinc-950 p-8">
          <h2 className="text-3xl font-black">Tips for better videos</h2>
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            Keep the voiceover or camera audio clean, use vertical visuals when possible, and name reusable media clearly so captions, icons, and overlays are easier to match.
          </p>
          <ul className="mt-6 grid gap-3 text-sm leading-6 text-zinc-300 md:grid-cols-2">
            <li className="rounded-lg border border-white/10 bg-black/40 p-4">Use MP3 or WAV voiceovers with low background noise.</li>
            <li className="rounded-lg border border-white/10 bg-black/40 p-4">For face-camera videos, leave a little space around the speaker for captions and icons.</li>
            <li className="rounded-lg border border-white/10 bg-black/40 p-4">Choose 9:16 clips and images for Reels, TikTok, and Shorts.</li>
            <li className="rounded-lg border border-white/10 bg-black/40 p-4">Add reusable icons with names like money.png, warning.png, idea.png, or clock.png.</li>
          </ul>
        </div>

        <Link
          href="/dashboard"
          className="mt-10 inline-flex items-center gap-2 rounded-lg bg-brand-mint px-6 py-4 font-black text-black transition hover:bg-white"
        >
          Open dashboard
          <ArrowRight size={17} />
        </Link>
      </section>
    </main>
  );
}
