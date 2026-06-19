import { ArrowRight, Check, Image as ImageIcon, Layers3, Mic2, Play, Sparkles, Users, Wand2, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Explainer — Left vs Right Comparison Reel Maker | Itnavideo',
  description: 'Upload audio + 2-4 images. AI creates a comparison reel with left vs right panels, VS badge, animated sticker, and timed subtitles. Ready for social.',
  alternates: { canonical: '/templates/compare-explainer' },
  openGraph: {
    title: 'Compare Explainer — Side by Side Comparison Reels',
    description: 'Audio + images = professional left vs right comparison reel in seconds.',
    images: ['/visuals/previews/Compare Explainer Homepage Hero.png'],
  },
};

const reelElements = [
  { label: 'Title Tabs', desc: 'Gradient blue + purple pills with Option A & B labels', color: 'bg-blue-500' },
  { label: 'Image Panels', desc: 'Left and right images side by side with clean borders', color: 'bg-red-500' },
  { label: 'VS Badge', desc: 'Orange circle badge between the two options', color: 'bg-orange-500' },
  { label: 'Caption Strip', desc: 'Timed subtitle card from your voiceover', color: 'bg-yellow-500' },
  { label: 'Teacher Sticker', desc: 'Animated character that reacts to your script', color: 'bg-purple-500' },
];

const features = [
  { icon: Layers3, title: 'Left vs Right Layout', body: 'Two clear image panels show each option side by side. No confusion.' },
  { icon: Users, title: '16 Sticker Styles', body: 'Teacher, Girl, Grandpa, Doctor, Banker, Lawyer, Islamic Scholar & more. User picks.' },
  { icon: Sparkles, title: 'Smart Pose Changes', body: 'Sticker points left/right, thinks, celebrates — based on your script timing.' },
  { icon: Mic2, title: 'Audio Voiceover', body: 'Upload MP3/WAV voiceover. AI transcribes and syncs to the comparison.' },
  { icon: ImageIcon, title: '2 or 4 Images', body: '2 images = 1 scene. 4 images = 2 comparison scenes in one reel.' },
  { icon: Wand2, title: 'Sound Effects', body: 'Whoosh, pop, and ding sounds auto-placed at scene transitions.' },
];

const examples = [
  { left: 'Debit Card', right: 'Credit Card', topic: 'Banking' },
  { left: 'Website', right: 'Web App', topic: 'Tech' },
  { left: 'Before', right: 'After', topic: 'Transformation' },
  { left: 'Free Plan', right: 'Paid Plan', topic: 'SaaS' },
  { left: 'Old Method', right: 'New Method', topic: 'Education' },
  { left: 'iPhone', right: 'Android', topic: 'Products' },
];

export default function CompareExplainerPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-28 pb-12 sm:px-6 md:pt-36 md:pb-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(16,185,129,0.05)_0%,transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
                <Layers3 size={14} />
                Compare Template
              </span>
              <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Compare Two Ideas<br />
                <span className="text-emerald-600">in One Reel</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-zinc-500 sm:text-lg">
                Upload your voiceover + comparison images. AI creates a professional left vs right reel with timed captions, VS badge, and an animated teacher that reacts to your script.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/dashboard?template=compare" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-4 text-sm font-black text-white shadow-lg shadow-emerald-600/15 transition hover:bg-emerald-700">
                  Create Compare Reel <ArrowRight size={16} />
                </Link>
                <Link href="#examples" className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-6 py-4 text-sm font-black text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50">
                  See Examples
                </Link>
              </div>
              <p className="mt-5 text-xs text-zinc-400">One credit = one reel. Use with any plan.</p>
            </div>

            {/* Preview */}
            <div className="relative mx-auto max-w-[300px] lg:max-w-[340px]">
              <div className="overflow-hidden rounded-3xl border border-zinc-200 shadow-2xl">
                <Image src="/visuals/previews/Compare Explainer Homepage Hero.png" alt="Compare Explainer reel preview" width={540} height={720} className="w-full object-cover object-top" priority />
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-2xl border border-zinc-100 bg-white px-4 py-3 shadow-lg">
                <p className="text-[10px] font-bold text-zinc-400">Includes</p>
                <p className="text-sm font-black text-zinc-900">VS Badge + Sticker</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reel elements */}
      <section className="bg-zinc-50 px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-600">Reel Structure</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">What&apos;s in Your Compare Reel</h2>
            <p className="mt-3 text-zinc-500">Five visual elements automatically composed from your upload.</p>
          </div>
          <div className="mt-10 space-y-3">
            {reelElements.map((el, i) => (
              <div key={el.label} className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${el.color} text-sm font-black text-white`}>
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-sm font-black text-zinc-900">{el.label}</h3>
                  <p className="mt-0.5 text-xs text-zinc-500">{el.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-600">Process</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Audio + Images = Compare Reel</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { step: '1', icon: Mic2, title: 'Upload Voiceover', body: 'Record a comparison explanation. MP3, WAV, M4A accepted.', accent: 'bg-emerald-50 text-emerald-600' },
              { step: '2', icon: ImageIcon, title: 'Add 2-4 Images', body: 'Left image = Option A. Right image = Option B. Add 4 for two scenes.', accent: 'bg-orange-50 text-orange-600' },
              { step: '3', icon: Play, title: 'Generate & Download', body: 'AI builds the comparison, adds sticker, syncs captions. Download MP4.', accent: 'bg-purple-50 text-purple-600' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${item.accent}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-black">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-zinc-50 px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-600">Features</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Built for Comparison Content</h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-sm font-black">{f.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-zinc-500">{f.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Examples */}
      <section id="examples" className="px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-black sm:text-3xl">Perfect For Any Comparison</h2>
          <p className="mt-3 text-zinc-500">Any two options, products, or ideas — turn them into a reel.</p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {examples.map((ex) => (
              <div key={`${ex.left}-${ex.right}`} className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
                <div className="flex">
                  <div className="flex-1 border-r border-zinc-100 bg-blue-50 px-3 py-4 text-center">
                    <p className="text-xs font-bold text-blue-400">LEFT</p>
                    <p className="mt-1 text-sm font-black text-blue-700">{ex.left}</p>
                  </div>
                  <div className="flex items-center justify-center px-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-[10px] font-black text-orange-600">VS</span>
                  </div>
                  <div className="flex-1 border-l border-zinc-100 bg-purple-50 px-3 py-4 text-center">
                    <p className="text-xs font-bold text-purple-400">RIGHT</p>
                    <p className="mt-1 text-sm font-black text-purple-700">{ex.right}</p>
                  </div>
                </div>
                <div className="border-t border-zinc-100 bg-zinc-50 px-3 py-2 text-center">
                  <span className="text-[10px] font-bold text-zinc-400">{ex.topic}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticker styles */}
      <section className="bg-zinc-50 px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-2xl font-black sm:text-3xl">16 Character Stickers to Choose</h2>
          <p className="mt-3 text-zinc-500">Each character reacts to your script with 6 poses: welcome, pointing left, pointing right, thinking, warning, and success.</p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
            {[
              { name: '2D Teacher', image: '/assets/stickman/2d-teacher/teacher-welcome.png' },
              { name: 'Cartoon Teacher', image: '/assets/stickman/cartoon-teacher/teacher-answering.png' },
              { name: 'Stickman Explainer', image: '/assets/stickman/stickman-explainer/follow.png' },
              { name: 'Girl Teacher', image: '/assets/stickman/girl-teacher/teacher-welcome.png' },
              { name: 'Girl 3D', image: '/assets/stickman/girl-teacher-3d/teacher-welcome.png' },
              { name: 'Grandpa 3D', image: '/assets/stickman/grandpa-teacher-3d/teacher-welcome.png' },
              { name: 'Young Presenter', image: '/assets/stickman/young-presenter-3d/teacher-welcome.png' },
              { name: '2D Pro', image: '/assets/stickman/teacher-2d-pro/teacher-welcome.png' },
              { name: 'Chibi Boy', image: '/assets/stickman/chibi-boy-3d/teacher-welcome.png' },
              { name: 'Corporate Woman', image: '/assets/stickman/corporate-woman-3d/teacher-welcome.png' },
              { name: 'Indian Teacher', image: '/assets/stickman/indian-teacher-woman/teacher-welcome.png' },
              { name: 'Doctor 3D', image: '/assets/stickman/doctor-3d-half/teacher-welcome.png' },
              { name: 'Banker 3D', image: '/assets/stickman/banker-3d-half/teacher-welcome.png' },
              { name: 'News Anchor', image: '/assets/stickman/news-anchor-3d-half/teacher-welcome.png' },
              { name: 'Lawyer Girl', image: '/assets/stickman/lawyer-girl-3d/teacher-welcome.png' },
              { name: 'Islamic Scholar', image: '/assets/stickman/shia-moulana-3d/teacher-welcome.png' },
            ].map((sticker) => (
              <div key={sticker.name} className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
                <div className="mx-auto h-24 w-24 overflow-hidden rounded-full bg-zinc-50">
                  <img src={sticker.image} alt={sticker.name} className="h-full w-full object-contain" />
                </div>
                <p className="mt-3 text-xs font-black text-zinc-700">{sticker.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 p-10 text-center text-white sm:p-14">
          <Zap className="mx-auto mb-4" size={32} />
          <h2 className="text-3xl font-black sm:text-4xl">Ready to Compare?</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-emerald-100">
            Upload audio + images. Get a professional comparison reel with sticker, VS badge, and timed captions. One credit per reel.
          </p>
          <Link href="/dashboard?template=compare" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-black text-emerald-700 shadow-xl transition hover:bg-emerald-50">
            Create Compare Reel <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
