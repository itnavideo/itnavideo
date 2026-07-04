import Link from 'next/link';
import type { Metadata } from 'next';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Boxes,
  CheckCircle2,
  ClipboardList,
  Cloud,
  Code2,
  Database,
  FileText,
  Film,
  GitBranch,
  Layers3,
  LineChart,
  LockKeyhole,
  Rocket,
  Server,
  ShieldCheck,
  Sparkles,
  Table2,
  TerminalSquare,
  Wand2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Itnavideo Internal Product Docs',
  description:
    'Professional Itnavideo documentation hub covering startup notes, product strategy, video types, architecture, deployment, issues, roadmap, and internal operating rules.',
  alternates: {
    canonical: '/docs',
  },
};

const docFiles = [
  {
    file: '01-startup-overview.md',
    title: 'Startup Overview',
    audience: 'Founders, investors',
    summary: 'Problem, solution, target users, current status, and vision.',
    status: 'Source',
    accent: 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100',
  },
  {
    file: '02-product-and-features.md',
    title: 'Product and Features',
    audience: 'Product, design, growth',
    summary: 'Video type catalog, inputs, outputs, future video type ideas, and format rules.',
    status: 'Source',
    accent: 'border-amber-300/30 bg-amber-300/10 text-amber-100',
  },
  {
    file: '03-technical-architecture.md',
    title: 'Technical Architecture',
    audience: 'Engineering',
    summary: 'Stack, render pipeline, deployment flow, costs, and Supabase tables.',
    status: 'Source',
    accent: 'border-blue-300/30 bg-blue-300/10 text-blue-100',
  },
  {
    file: '04-video-type-rules.md',
    title: 'Video Type Rules',
    audience: 'Engineering, design',
    summary: 'Video type creation, Remotion rules, naming, testing, and quality standards.',
    status: 'Source',
    accent: 'border-fuchsia-300/30 bg-fuchsia-300/10 text-fuchsia-100',
  },
  {
    file: '05-subtitle-language-rules.md',
    title: 'Subtitle Language Rules',
    audience: 'Product, engineering',
    summary: 'English and Hinglish caption rules, paused translation scope, and provider policy.',
    status: 'Source',
    accent: 'border-lime-300/30 bg-lime-300/10 text-lime-100',
  },
  {
    file: '06-assets-and-s3.md',
    title: 'Assets and S3',
    audience: 'Engineering, ops',
    summary: 'Asset storage, S3 lifecycle, CDN rules, and Vercel deployment constraints.',
    status: 'Source',
    accent: 'border-sky-300/30 bg-sky-300/10 text-sky-100',
  },
  {
    file: '07-known-issues-and-fixes.md',
    title: 'Known Issues and Fixes',
    audience: 'Engineering, support',
    summary: 'Common render, subtitle, asset, and deployment issues with fixes.',
    status: 'Source',
    accent: 'border-red-300/30 bg-red-300/10 text-red-100',
  },
  {
    file: '08-roadmap.md',
    title: 'Roadmap',
    audience: 'Founders, product',
    summary: 'Immediate, short-term, and future product direction.',
    status: 'Source',
    accent: 'border-violet-300/30 bg-violet-300/10 text-violet-100',
  },
  {
    file: '09-yc-investor-notes.md',
    title: 'YC / Investor Notes',
    audience: 'Founders, investors',
    summary: 'YC advice, decisions log, metrics, demo notes, and competitive landscape.',
    status: 'Source',
    accent: 'border-orange-300/30 bg-orange-300/10 text-orange-100',
  },
  {
    file: 'GOOGLE_DOC_CONTENT.md',
    title: 'Google Doc Content',
    audience: 'All team',
    summary: 'Original combined startup documentation imported from Google Docs.',
    status: 'Source archive',
    accent: 'border-teal-300/30 bg-teal-300/10 text-teal-100',
  },
  {
    file: 'ITNAVIDEO_INTERNAL_PRODUCT_DOCUMENTATION.md',
    title: 'Internal Product Documentation',
    audience: 'Founders, investors, devs, designers',
    summary: 'Reorganized professional master doc with video types, trackers, risks, APIs, and roadmap.',
    status: 'Master',
    accent: 'border-brand-mint/30 bg-brand-mint/10 text-brand-mint',
  },
];

const productStats = [
  ['Primary promise', 'Raw creator content to polished reels'],
  ['Current output', '9:16 MP4 short videos'],
  ['Target speed', 'Under 3 minutes'],
  ['Render engine', 'Remotion on AWS Lambda'],
  ['Transcription', 'Groq Whisper'],
  ['Storage policy', 'Temporary S3 uploads and outputs'],
];

const videoTypes = [
  ['Auto Caption Video', 'Captioned reels from uploaded videos', 'Video with speech', 'Captioned MP4'],
  ['Dynamic Explainer Video', 'Text cards, icons, highlights, motion', 'Audio/script/video', 'Explainer reel'],
  ['Compare Explainer Video', 'Side-by-side comparison with presenter elements', 'Audio + 2 sides', 'VS reel'],
  ['Auto Draw Explainer Video', 'Notebook or whiteboard style teaching video', 'Audio/script', 'Animated notes reel'],
  ['Long Video Promo', 'Promo reel for long videos', 'Clip + thumbnail + title', 'Promo short'],
  ['Background Replace Video', 'Clean vertical video with changed background', 'Video + background', 'Background replaced reel'],
  ['Custom AI Reel', 'Prompt-led custom reel workflow', 'Prompt + optional media', 'Needs status confirmation'],
];

const architectureRows = [
  ['Frontend', 'Next.js App Router, React, Tailwind CSS', 'Dashboard, pages, API entry points'],
  ['Auth and data', 'Supabase', 'Accounts, render history, app data, credits'],
  ['Transcription', 'Groq Whisper', 'Audio to transcript and word-level timestamps'],
  ['Planning', 'Local planners + Gemini for Auto Draw', 'Scenes, captions, timelines, visual instructions'],
  ['Rendering', 'Remotion Lambda', 'Animated compositions and final video render'],
  ['Media processing', 'FFmpeg', 'Audio extraction, trim, convert, compress, screenshot, merge'],
  ['Storage', 'AWS S3', 'Temporary uploads, temporary render files, final outputs'],
  ['Payments', 'Razorpay', 'Plans, credits, paid user flow'],
];

const trackers = [
  {
    title: 'Video type tracker',
    icon: Table2,
    body: 'Tracks total video types, status, owner, priority, issues, planned improvements, and testing state.',
    tag: 'Master doc',
  },
  {
    title: 'Issue tracker',
    icon: AlertTriangle,
    body: 'Tracks ID, date, module, severity, root cause, proposed fix, owner, and resolution date.',
    tag: 'Operations',
  },
  {
    title: 'Improvement tracker',
    icon: ClipboardList,
    body: 'Tracks module, current state, suggested improvement, expected impact, priority, and status.',
    tag: 'Product',
  },
  {
    title: 'Decision log',
    icon: GitBranch,
    body: 'Tracks decisions such as provider changes, video type simplification, and language scope.',
    tag: 'Founder notes',
  },
];

const qaRules = [
  'No blank video output.',
  'Captions must be readable, synced, and inside safe areas.',
  'Render failures must show a clear error and should not waste credits.',
  'Every render uses the current upload, not cached transcript data.',
  'Video type changes require visual QA and documentation updates.',
  'Production video/render code changes need both Vercel and Lambda deploys.',
];

const pipelineSteps = [
  ['1', 'Upload', 'Creator selects a video type and uploads the required media.'],
  ['2', 'Validate', 'API validates file type, user, credits, and required inputs.'],
  ['3', 'Store', 'Uploads go to S3 through temporary secure URLs.'],
  ['4', 'Transcribe', 'FFmpeg extracts audio where needed; Groq Whisper returns transcript and timestamps.'],
  ['5', 'Plan', 'Local planner or approved AI planner builds scenes, captions, and render props.'],
  ['6', 'Render', 'Remotion Lambda creates the 9:16 MP4.'],
  ['7', 'Deliver', 'Job status returns progress, final URL, download, and history entry.'],
];

const renderPayload = `{
  "compositionId": "AUTO-CAPTION-REEL",
  "durationSeconds": 60,
  "mediaSrc": "https://signed-s3-url.example/input.mp4",
  "captions": [
    {
      "start": 0.4,
      "end": 1.8,
      "text": "create better reels",
      "words": [
        { "word": "create", "start": 0.4, "end": 0.7 },
        { "word": "better", "start": 0.7, "end": 1.1 },
        { "word": "reels", "start": 1.1, "end": 1.8 }
      ]
    }
  ],
  "captionStyle": "studioClean",
  "settings": {
    "position": "bottom-safe-area",
    "font": "Inter",
    "highlight": "Yellow"
  }
}`;

const sourcePath = 'docs/startup/';

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#09111f] text-white">
      <section className="border-b border-white/10 bg-[#101827] px-5 pb-16 pt-28 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-brand-mint/25 bg-brand-mint/10 px-3 py-2 text-sm font-bold text-brand-mint">
            <BookOpen size={16} />
            Internal docs hub
          </div>
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-4xl font-black leading-tight sm:text-6xl lg:text-7xl">
                Itnavideo product, startup, and engineering docs.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                A polished reading layer for the startup files, original Google Doc content, and the new internal product documentation. Use this page to orient founders, investors, developers, designers, and future team members.
              </p>
            </div>
            <div className="rounded-lg border border-amber-300/25 bg-amber-300/10 p-5">
              <div className="flex items-center gap-3 text-amber-100">
                <ShieldCheck size={22} />
                <h2 className="text-lg font-black">Source of truth</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-amber-50/80">
                Markdown files remain the editable internal record. This page organizes them visually and points the team to the right file.
              </p>
              <p className="mt-4 rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-xs text-amber-50">
                {sourcePath}
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {productStats.map(([label, value]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
                <p className="mt-2 text-sm font-black text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex items-center gap-3">
            <FileText className="text-brand-mint" size={24} />
            <div>
              <h2 className="text-3xl font-black">Startup Docs Index</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Files `01` to `09`, the original Google Doc archive, and the master internal product documentation are all represented here.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {docFiles.map((doc) => (
              <article key={doc.file} className="rounded-lg border border-white/10 bg-[#111b2d] p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-md border px-2.5 py-1 text-xs font-black ${doc.accent}`}>{doc.status}</span>
                  <span className="rounded-md border border-white/10 bg-black/25 px-2.5 py-1 text-xs text-slate-300">{doc.audience}</span>
                </div>
                <h3 className="mt-5 text-xl font-black">{doc.title}</h3>
                <p className="mt-3 min-h-16 text-sm leading-6 text-slate-400">{doc.summary}</p>
                <p className="mt-5 rounded-lg border border-white/10 bg-black/35 px-3 py-2 font-mono text-xs text-cyan-100">
                  {String(sourcePath)}
                  {String('displayFile' in doc ? doc.displayFile : doc.file)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#111827] px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm font-bold text-cyan-100">
                <Film size={16} />
                Product catalog
              </div>
              <h2 className="text-3xl font-black leading-tight sm:text-5xl">Video types and render coverage.</h2>
              <p className="mt-5 text-sm leading-7 text-slate-400">
                The docs preserve both the current production context and the founder notes. Custom AI Reel is kept visible, but its production status should be confirmed because documentation sources differ.
              </p>
              <div className="mt-6 rounded-lg border border-red-300/25 bg-red-300/10 p-4 text-sm leading-6 text-red-50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 shrink-0" size={18} />
                  <p>
                    Current project context says 6 production video types. The Google Docs source lists 7 including Custom AI Reel. The master documentation marks this as a confirmation item.
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#0d1424]">
              <table className="w-full min-w-[840px] border-collapse text-left text-sm">
                <thead className="bg-white/[0.05] text-xs uppercase tracking-[0.16em] text-slate-400">
                  <tr>
                    <th className="border-b border-white/10 px-4 py-4">Video type</th>
                    <th className="border-b border-white/10 px-4 py-4">Purpose</th>
                    <th className="border-b border-white/10 px-4 py-4">Input</th>
                    <th className="border-b border-white/10 px-4 py-4">Output</th>
                  </tr>
                </thead>
                <tbody>
                  {videoTypes.map(([name, purpose, input, output]) => (
                    <tr key={name} className="border-b border-white/10 last:border-b-0">
                      <td className="px-4 py-4 font-black text-white">{name}</td>
                      <td className="px-4 py-4 text-slate-300">{purpose}</td>
                      <td className="px-4 py-4 text-slate-400">{input}</td>
                      <td className="px-4 py-4 text-slate-400">{output}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-3">
            <Layers3 className="text-amber-200" size={24} />
            <div>
              <h2 className="text-3xl font-black">Architecture Summary</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">The core product flow from upload to final MP4.</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-3">
              {pipelineSteps.map(([step, title, body]) => (
                <div key={step} className="flex gap-3 rounded-lg border border-white/10 bg-[#101827] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-mint text-sm font-black text-black">{step}</div>
                  <div>
                    <h3 className="font-black text-white">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-lg border border-white/10 bg-[#101827]">
              <div className="border-b border-white/10 p-5">
                <div className="flex items-center gap-3">
                  <Boxes className="text-cyan-200" size={22} />
                  <h3 className="text-2xl font-black">System layers</h3>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.16em] text-slate-400">
                    <tr>
                      <th className="border-b border-white/10 px-4 py-4">Layer</th>
                      <th className="border-b border-white/10 px-4 py-4">Technology</th>
                      <th className="border-b border-white/10 px-4 py-4">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {architectureRows.map(([layer, tech, role]) => (
                      <tr key={layer} className="border-b border-white/10 last:border-b-0">
                        <td className="px-4 py-4 font-black text-white">{layer}</td>
                        <td className="px-4 py-4 text-cyan-100">{tech}</td>
                        <td className="px-4 py-4 text-slate-400">{role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0f172a] px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-violet-300/20 bg-violet-300/10 px-3 py-2 text-sm font-bold text-violet-100">
                <Code2 size={16} />
                Render props
              </div>
              <h2 className="text-3xl font-black leading-tight sm:text-5xl">Code blocks belong in the docs too.</h2>
              <p className="mt-5 text-sm leading-7 text-slate-400">
                The master documentation explains the product. The docs hub also shows shapes and examples so developers can understand how captions, settings, and render props fit together.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4">
                  <TerminalSquare className="mb-3 text-cyan-100" size={22} />
                  <h3 className="font-black">Dev friendly</h3>
                  <p className="mt-2 text-sm leading-6 text-cyan-50/75">Examples stay close to the actual render pipeline.</p>
                </div>
                <div className="rounded-lg border border-amber-300/20 bg-amber-300/10 p-4">
                  <Sparkles className="mb-3 text-amber-100" size={22} />
                  <h3 className="font-black">Founder friendly</h3>
                  <p className="mt-2 text-sm leading-6 text-amber-50/75">Callouts and tables make the system easy to explain.</p>
                </div>
              </div>
            </div>
            <pre className="max-h-[560px] overflow-auto rounded-lg border border-white/10 bg-black p-5 text-xs leading-6 text-slate-200">
              <code>{renderPayload}</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-3">
            <LineChart className="text-brand-mint" size={24} />
            <div>
              <h2 className="text-3xl font-black">Trackers and Operating System</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                The new master doc adds the working trackers needed for a startup team.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {trackers.map((tracker) => {
              const Icon = tracker.icon;
              return (
                <div key={tracker.title} className="rounded-lg border border-white/10 bg-[#111b2d] p-5">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-brand-mint/10 text-brand-mint">
                    <Icon size={20} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{tracker.tag}</p>
                  <h3 className="mt-2 text-xl font-black">{tracker.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{tracker.body}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 rounded-lg border border-white/10 bg-[#101827] p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <CheckCircle2 className="text-brand-mint" size={24} />
              <h3 className="text-2xl font-black">Quality gates</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {qaRules.map((rule) => (
                <div key={rule} className="flex gap-3 rounded-lg border border-white/10 bg-black/25 p-4 text-sm leading-6 text-slate-300">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-brand-mint" size={18} />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#101827] px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-white/10 bg-black/25 p-5">
              <Cloud className="mb-4 text-cyan-200" size={24} />
              <h3 className="font-black">Deployment</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">Vercel for frontend/API and Remotion Lambda for render engine.</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/25 p-5">
              <Database className="mb-4 text-amber-200" size={24} />
              <h3 className="font-black">Database</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">Supabase handles auth, history, credits, app data, and user state.</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/25 p-5">
              <Server className="mb-4 text-fuchsia-200" size={24} />
              <h3 className="font-black">Rendering</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">Remotion compositions render serverlessly with S3 media URLs.</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/25 p-5">
              <LockKeyhole className="mb-4 text-lime-200" size={24} />
              <h3 className="font-black">Security</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">Private files, protected APIs, limited URLs, safe logs, and credit protection.</p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-mint px-6 py-4 font-black text-black transition hover:bg-white"
            >
              Open dashboard
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/video-types"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-6 py-4 font-black text-white transition hover:border-white/35 hover:bg-white/10"
            >
              View video types
              <Wand2 size={17} />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-6 py-4 font-black text-white transition hover:border-white/35 hover:bg-white/10"
            >
              Pricing
              <Rocket size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
