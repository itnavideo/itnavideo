import React from 'react';
import Link from 'next/link';
import { ArrowRight, Wand2, Smartphone, LayoutTemplate, Palette, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FacelessShortsDetail() {
  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-100">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950" />
        <div className="container relative mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-sm font-medium mb-6">
              <Wand2 className="w-4 h-4" />
              <span>Introducing Faceless Shorts</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-400">
              Generate Viral Faceless Shorts with AI
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Transform your voiceovers into highly engaging 9:16 vertical short-form videos. The AI selects dynamic SVGs, creates kinetic typography, and adds motion graphics to keep viewers hooked for up to 90 seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard?mode=facelessShorts">
                <Button size="lg" className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium shadow-lg shadow-indigo-500/20 transition-all">
                  Create Faceless Shorts
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-20 bg-zinc-900/50 border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="prose prose-invert prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-white mb-6">The Ultimate Faceless Shorts AI Generator</h2>
            <p>
              In today's fast-paced digital landscape, short-form content is the undisputed king of organic reach. Platforms like YouTube Shorts, Instagram Reels, and TikTok prioritize 9:16 vertical videos that capture attention within the first three seconds and deliver value rapidly. However, producing high-quality faceless shorts—where the creator doesn't appear on camera—requires significant time, editing skills, and an eye for visual storytelling. That's where our newly designed <strong>Faceless Shorts AI Generator</strong> comes in.
            </p>
            <p>
              This isn't just another template wrapper. The Faceless Shorts pipeline is a dedicated, story-first video generation engine engineered specifically for the 9:16 aspect ratio. Whether you're a marketer, educator, storyteller, or entrepreneur, you can now generate compelling 30 to 90-second vertical videos from a simple voiceover or script.
            </p>

            <h3 className="text-2xl font-semibold text-white mt-10 mb-4">Story-First Visual Intelligence</h3>
            <p>
              Most generic AI video makers simply slap stock footage over subtitles and call it a day. Our approach is entirely different. At the core of the Faceless Shorts generator is our advanced visual intelligence planner. Before rendering a single frame, the AI deeply analyzes the semantic meaning, emotional tone, and narrative progression of your script.
            </p>
            <p>
              Every visual element chosen has a purpose. If you're discussing financial growth, the AI dynamically generates an upward-trending chart. If you're explaining a multi-step process, it automatically drafts a numbered list layout. For technical concepts, it deploys clean SVG illustrations and diagrams. This ensures that the visuals actively enhance the viewer's understanding rather than just serving as background noise.
            </p>

            <h3 className="text-2xl font-semibold text-white mt-10 mb-4">Professional Motion Graphics & Typography</h3>
            <p>
              Retention is critical for shorts. To keep viewers engaged, the visual density must adapt to the pacing of the narration. The Faceless Shorts engine utilizes a curated library of professional, broadcast-quality visual layouts:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4 text-zinc-300">
              <li><strong>Kinetic Typography:</strong> Bold, animated text that highlights key phrases and syncs perfectly with spoken words.</li>
              <li><strong>Dynamic Split-Screens:</strong> Beautifully composed side-by-side layouts for comparisons or multi-faceted concepts.</li>
              <li><strong>Data Visualizations & Charts:</strong> Animated donut breakdowns and stat cards when precise numbers are mentioned.</li>
              <li><strong>Clean SVG Animations:</strong> Minimalist, scalable vector graphics that draw themselves onto the screen, conveying ideas without clutter.</li>
              <li><strong>Social & UI Mockups:</strong> Interactive-looking chat dialogues and social post layouts for storytelling.</li>
            </ul>

            <h3 className="text-2xl font-semibold text-white mt-10 mb-4">A Zero-Compromise 9:16 Pipeline</h3>
            <p>
              Unlike tools that crudely crop widescreen 16:9 videos into vertical frames—often cutting off important information—our pipeline is built natively for 9:16. Every text mask, title safe area, and camera pan is calculated to fit perfectly on mobile screens. Subtitles are smartly positioned to avoid interfering with TikTok or YouTube UI elements like like buttons and captions.
            </p>
            <p>
              Furthermore, the entire process is handled in the cloud. We understand that heavy local rendering can freeze machines, so the heavy lifting is offloaded to our AWS rendering engines. You simply upload your audio, review the AI's storyboard, and hit render.
            </p>

            <h3 className="text-2xl font-semibold text-white mt-10 mb-4">Maximize Your Content Strategy</h3>
            <p>
              Building a faceless channel has never been more accessible. With the Faceless Shorts generator, you can rapidly test different niches—from motivational quotes and historical facts to software tutorials and business case studies. By combining high-retention visual pacing, context-aware graphics, and your unique script, you can output professional-grade shorts that satisfy the algorithm and captivate real audiences. Start scaling your short-form presence today, entirely camera-free.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
