import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight,
  BookOpen,
  Captions,
  CheckCircle2,
  Cloud,
  Database,
  Film,
  FolderOpen,
  GitBranch,
  Layers3,
  Mic,
  Palette,
  Server,
  Sparkles,
  TerminalSquare,
  Type,
} from 'lucide-react';

export const metadata: Metadata = {
  title: "AI Reel Maker Documentation",
  description: "Learn how Itnavideo turns videos, scripts, and voiceovers into focused Video Explainer reels.",
  alternates: {
    canonical: "/docs",
  },
};

const sections = [
  {
    title: 'Choose the workflow',
    description: 'Use Video Explainer when the uploaded video should stay visible above the story text.',
    icon: Mic,
  },
  {
    title: 'Prepare the source',
    description: 'Keep speech clear, avoid background noise where possible, and remember Video Explainer uses the first minute.',
    icon: FolderOpen,
  },
  {
    title: 'Review the render',
    description: 'Check title language, asset relevance, safe zones, and final MP4 playback before posting.',
    icon: Captions,
  },
];

const deploymentItems = [
  {
    title: 'Product app',
    description: 'Runs the website, dashboard, and account screens.',
    icon: Cloud,
  },
  {
    title: 'Render worker',
    description: 'Plans scenes and renders the reel bundle through the configured render path.',
    icon: Server,
  },
  {
    title: 'Media storage',
    description: 'Stores temporary uploads and completed MP4 outputs for creator review and download.',
    icon: TerminalSquare,
  },
  {
    title: 'Site data',
    description: 'Keeps account, waitlist, careers, and settings data synced.',
    icon: Database,
  },
  {
    title: 'Release flow',
    description: 'Keeps product updates coordinated from one controlled release process.',
    icon: GitBranch,
  },
];

const templateLayers = [
  {
    layer: 'Top media frame',
    purpose: 'Displays the uploaded video or audio waveform.',
    style: '16:9 aspect ratio, premium border, subtle progress indicators.',
    output: 'Primary focus remains on the creator or main content.',
  },
  {
    layer: 'Middle subtitle zone',
    purpose: 'Shows transcript-synced captions for readability.',
    style: 'Large typography with active-word emphasis and highlights.',
    output: 'Ensures the message is understood even without sound.',
  },
  {
    layer: 'Bottom visual canvas',
    purpose: 'Renders scene-matched images, icons, or documents.',
    style: 'Sits below subtitles, uses safe-zone padding for social UI.',
    output: 'Provides visual proof and context for the spoken explanation.',
  },
  {
    layer: 'Matte background',
    purpose: 'Adds depth without distracting from the video.',
    style: 'Dark gradient, matte texture, low-opacity glow, clean borders.',
    output: 'Premium look while staying calm and readable.',
  },
  {
    layer: 'Sound cues',
    purpose: 'Adds small feedback at key text changes.',
    style: 'Soft pop, tick, or chime at low volume.',
    output: 'The reel feels edited, but not noisy.',
  },
];

const backgroundSteps = [
  ['1', 'Upload', 'Creator uploads one video file from the dashboard.'],
  ['2', 'Trim policy', 'The output uses up to 1 minute, so long videos stay manageable.'],
  ['3', 'Speech cleanup', 'Audio is prepared for clearer transcription and timing.'],
  ['4', 'Clean Hinglish text', 'Speech is converted into clean Roman Hinglish or English text.'],
  ['5', 'Smart text plan', 'The planner creates a compact title and scene text blocks.'],
  ['6', 'Render package', 'The renderer receives the video URL, timing, title, text, and small sound cues.'],
  ['7', 'Final MP4', 'A vertical reel is produced and shown in Recent Renders for download.'],
];

const styleRules = [
  'Production is focused on Video Explainer only until quality and speed are excellent.',
  'Maintain a clear 3-layer stack: top media, middle subtitles, and bottom visuals.',
  'No left-side labels like Hook, Reality, or Training inside the reel.',
  'No busy moving background behind the text area.',
  'Top video stays 16:9 so YouTube-style source videos fit cleanly.',
  'Bottom text uses title-first hierarchy with safe top and bottom spacing.',
];

const jsonExample = `{
  "templateName": "Video Explainer",
  "mediaType": "video",
  "mediaFit": "videoExplainer",
  "mediaTrimStartSeconds": 0,
  "durationSeconds": 60,
  "topicTitle": "RBI Job Update",
  "overlayTimeline": [
    {
      "id": "scene-01",
      "start": 0,
      "end": 6,
      "type": "hook",
      "text": "RBI job update",
      "body": "Aaj ka important point simple language me samjho.",
      "accentWord": "RBI",
      "align": "center",
      "sfx": "softPop"
    },
    {
      "id": "scene-02",
      "start": 6,
      "end": 14,
      "type": "point",
      "text": "Eligibility clear rakho",
      "body": "Form bharne se pehle age, qualification, aur dates check karo.",
      "accentWord": "Eligibility",
      "align": "left",
      "sfx": "softTick"
    }
  ]
}`;

const propRows = [
  ['topicTitle', 'Short title shown in the title pill.', 'RBI Job Update'],
  ['mediaSrc', 'Uploaded video URL used in the top frame.', 'Temporary secure media URL'],
  ['durationSeconds', 'Final render duration, capped at 1 minute.', '60'],
  ['overlayTimeline[].text', 'Main large text in the bottom content area.', 'Eligibility clear rakho'],
  ['overlayTimeline[].body', 'Optional supporting sentence below the main text.', 'Form bharne se pehle dates check karo.'],
  ['overlayTimeline[].accentWord', 'One highlighted word in the current text block.', 'Eligibility'],
  ['overlayTimeline[].sfx', 'Small sound cue when the scene text changes.', 'softTick'],
];

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#050506] px-6 pb-24 pt-32 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-7 inline-flex items-center gap-2 rounded-lg border border-brand-mint/20 bg-brand-mint/10 px-3 py-2 text-sm font-bold text-brand-mint">
          <BookOpen size={16} />
          Documentation
        </div>
        <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">Creator workflow docs.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
          A quick guide for using the current ItnaVideo short-form workflow while the product keeps improving.
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
          <h2 className="text-3xl font-black">Current production path</h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400">
            These are the moving parts behind the public creator flow.
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
          <h2 className="text-3xl font-black">Best practices</h2>
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            Use this checklist before generating or judging a reel.
          </p>
          <ul className="mt-6 grid gap-3 text-sm leading-6 text-zinc-300 md:grid-cols-2">
            <li className="rounded-lg border border-white/10 bg-black/40 p-4">Write or record in the language you want on screen.</li>
            <li className="rounded-lg border border-white/10 bg-black/40 p-4">Use topic words like job, exam, doctor, MBA, AI, finance, or college to help asset matching.</li>
            <li className="rounded-lg border border-white/10 bg-black/40 p-4">Keep the strongest hook in the first few seconds.</li>
            <li className="rounded-lg border border-white/10 bg-black/40 p-4">Regenerate if a scene uses the wrong visual or the title needs tightening.</li>
          </ul>
        </div>

        <section className="mt-14 overflow-hidden rounded-lg border border-brand-mint/20 bg-zinc-950">
          <div className="border-b border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-brand-mint/20 bg-brand-mint/10 px-3 py-2 text-sm font-bold text-brand-mint">
              <Film size={16} />
              Template style docs
            </div>
            <h2 className="max-w-4xl text-3xl font-black leading-tight text-white sm:text-5xl">
              Video Explainer
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
              This template keeps the uploaded video as the hero and uses the lower area for clean story text. The design is intentionally calm: strong typography, dark matte depth, a small title pill, and no distracting background motion.
            </p>
          </div>

          <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-black/25 p-5">
              <Palette className="mb-4 text-amber-200" size={22} />
              <h3 className="font-black text-white">Visual tone</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">Dark premium, gold-cyan accent, soft borders, matte texture.</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/25 p-5">
              <Type className="mb-4 text-cyan-200" size={22} />
              <h3 className="font-black text-white">Text behavior</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">One title moment plus one short body line, sized to avoid overflow.</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/25 p-5">
              <Sparkles className="mb-4 text-brand-mint" size={22} />
              <h3 className="font-black text-white">Motion policy</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">Subtle entry and soft audio cues only. No noisy animated background.</p>
            </div>
          </div>

          <div className="border-t border-white/10 p-4 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <Layers3 className="text-brand-mint" size={22} />
              <h3 className="text-2xl font-black">Template layers</h3>
            </div>
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.16em] text-zinc-400">
                  <tr>
                    <th className="border-b border-white/10 px-4 py-4">Layer</th>
                    <th className="border-b border-white/10 px-4 py-4">Purpose</th>
                    <th className="border-b border-white/10 px-4 py-4">Style</th>
                    <th className="border-b border-white/10 px-4 py-4">Viewer result</th>
                  </tr>
                </thead>
                <tbody>
                  {templateLayers.map((row) => (
                    <tr key={row.layer} className="border-b border-white/10 last:border-b-0">
                      <td className="px-4 py-4 font-black text-white">{row.layer}</td>
                      <td className="px-4 py-4 text-zinc-300">{row.purpose}</td>
                      <td className="px-4 py-4 text-zinc-400">{row.style}</td>
                      <td className="px-4 py-4 text-zinc-400">{row.output}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-6 border-t border-white/10 p-4 sm:p-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h3 className="text-2xl font-black">What happens in the background</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                The creator sees one simple button, but the pipeline quietly prepares media, text, timing, and render props.
              </p>
              <div className="mt-6 space-y-3">
                {backgroundSteps.map(([step, title, body]) => (
                  <div key={step} className="flex gap-3 rounded-lg border border-white/10 bg-black/25 p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-mint text-sm font-black text-black">{step}</div>
                    <div>
                      <p className="font-black text-white">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-black">Render JSON example</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                The real payload includes secure media URLs and timing data. This short example shows the shape only.
              </p>
              <pre className="mt-6 max-h-[560px] overflow-auto rounded-lg border border-white/10 bg-black p-4 text-xs leading-6 text-zinc-200">
                <code>{jsonExample}</code>
              </pre>
            </div>
          </div>

          <div className="border-t border-white/10 p-4 sm:p-6">
            <h3 className="text-2xl font-black">Important props</h3>
            <div className="mt-5 overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.16em] text-zinc-400">
                  <tr>
                    <th className="border-b border-white/10 px-4 py-4">Prop</th>
                    <th className="border-b border-white/10 px-4 py-4">What it controls</th>
                    <th className="border-b border-white/10 px-4 py-4">Example</th>
                  </tr>
                </thead>
                <tbody>
                  {propRows.map(([prop, purpose, example]) => (
                    <tr key={prop} className="border-b border-white/10 last:border-b-0">
                      <td className="px-4 py-4 font-mono text-xs text-brand-mint">{prop}</td>
                      <td className="px-4 py-4 text-zinc-300">{purpose}</td>
                      <td className="px-4 py-4 text-zinc-400">{example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-white/10 p-4 sm:p-6">
            <h3 className="text-2xl font-black">Design rules</h3>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {styleRules.map((rule) => (
                <div key={rule} className="flex gap-3 rounded-lg border border-white/10 bg-black/25 p-4 text-sm leading-6 text-zinc-300">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-brand-mint" size={18} />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

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
