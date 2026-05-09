// app/about/page.js

export const metadata = {
  title: "About | Itnavideo",
  description: "Learn more about Itnavideo and our mission to automate video creation using AI.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-5xl mx-auto">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-purple-400 mb-4">
            About Itnavideo
          </p>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            The AI Operating System
            <br />
            For Video Creation
          </h1>

          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Itnavideo helps creators, educators, and businesses transform
            simple voice recordings into cinematic short-form videos using AI.
          </p>
        </div>

        {/* Mission */}
        <section className="grid md:grid-cols-2 gap-10 mb-20">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <h2 className="text-2xl font-semibold mb-4">🚀 Our Mission</h2>

            <p className="text-gray-400 leading-8">
              We believe creators should spend more time creating ideas and
              less time editing timelines.
            </p>

            <p className="text-gray-400 leading-8 mt-4">
              Our goal is to automate the entire video production workflow using
              AI — from voice understanding to scene generation and final
              rendering.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <h2 className="text-2xl font-semibold mb-4">🎬 What We Build</h2>

            <ul className="space-y-4 text-gray-400">
              <li>• AI-generated reels & shorts</li>
              <li>• Smart captions with perfect sync</li>
              <li>• Auto scene planning</li>
              <li>• Dynamic animations</li>
              <li>• AI-powered storytelling</li>
              <li>• Long-form YouTube generation</li>
            </ul>
          </div>
        </section>

        {/* Founder */}
        <section className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/20 rounded-3xl p-10 mb-20">
          <h2 className="text-3xl font-bold mb-6">👨‍💻 Founder</h2>

          <p className="text-gray-300 leading-8 text-lg">
            <span className="font-semibold text-white">
              Syed Mohammed Rohi
            </span>{" "}
            is a creator and entrepreneur passionate about AI-powered content
            creation.
          </p>

          <p className="text-gray-400 leading-8 mt-4">
            After years of creating videos and understanding creator workflows,
            the vision behind Itnavideo became clear:
          </p>

          <div className="mt-6 text-2xl font-semibold leading-relaxed">
            “What if creators could generate professional videos simply by
            uploading their voice?”
          </div>
        </section>

        {/* Vision */}
        <section className="text-center">
          <h2 className="text-4xl font-bold mb-6">
            Built For The Next Generation Of Creators
          </h2>

          <p className="text-gray-400 text-lg leading-8 max-w-3xl mx-auto">
            We are building the future where anyone can create professional
            video content without editing skills, expensive software, or large
            production teams.
          </p>
        </section>
      </div>
    </main>
  );
}