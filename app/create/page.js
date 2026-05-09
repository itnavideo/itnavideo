import {
  Upload,
  Mic,
  Image,
  Video,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Create Video | Itnavideo",
  description: "Create AI-powered cinematic videos.",
};

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-14">
          
          <p className="text-purple-400 uppercase tracking-[0.3em] text-sm mb-4">
            AI Creation Studio
          </p>

          <h1 className="text-5xl md:text-6xl font-bold mb-5">
            Create New Video
          </h1>

          <p className="text-zinc-400 text-lg max-w-3xl leading-8">
            Upload your voice, screenshots, clips, and media.
            AI will automatically generate cinematic short-form videos.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Upload Box */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              
              <div className="flex items-center gap-3 mb-8">
                <Upload className="text-purple-400" />
                
                <h2 className="text-3xl font-bold">
                  Upload Files
                </h2>
              </div>

              <div className="border-2 border-dashed border-zinc-700 hover:border-purple-500 transition rounded-3xl p-16 text-center">
                
                <Upload
                  size={55}
                  className="mx-auto text-zinc-500 mb-5"
                />

                <h3 className="text-3xl font-semibold mb-4">
                  Drag & Drop Files
                </h3>

                <p className="text-zinc-400 mb-8">
                  Upload voiceovers, screenshots, clips, or images
                </p>

                <button className="bg-purple-600 hover:bg-purple-500 transition px-8 py-4 rounded-2xl font-semibold">
                  Choose Files
                </button>
              </div>
            </section>

            {/* Media Types */}
            <section className="grid md:grid-cols-3 gap-6">
              
              <MediaCard
                icon={<Mic size={30} />}
                title="Voiceovers"
                desc="Upload narration audio"
              />

              <MediaCard
                icon={<Image size={30} />}
                title="Screenshots"
                desc="Add screenshots & images"
              />

              <MediaCard
                icon={<Video size={30} />}
                title="Video Clips"
                desc="Upload short video assets"
              />
            </section>
          </div>

          {/* Right */}
          <div className="space-y-8">
            
            {/* AI Settings */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="text-purple-400" />

                <h2 className="text-3xl font-bold">
                  AI Settings
                </h2>
              </div>

              <div className="space-y-6">
                
                <div>
                  <label className="block mb-3 text-zinc-300">
                    Video Format
                  </label>

                  <select className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-4">
                    <option>Instagram Reel</option>
                    <option>YouTube Short</option>
                    <option>TikTok Video</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-3 text-zinc-300">
                    Caption Style
                  </label>

                  <select className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-4">
                    <option>Modern</option>
                    <option>Bold</option>
                    <option>Cinematic</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-3 text-zinc-300">
                    Video Quality
                  </label>

                  <select className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-4">
                    <option>720p</option>
                    <option>1080p</option>
                    <option>4K</option>
                  </select>
                </div>
              </div>

              <button className="w-full mt-8 bg-purple-600 hover:bg-purple-500 transition py-4 rounded-2xl font-semibold text-lg">
                Generate AI Video
              </button>
            </section>

            {/* Tips */}
            <section className="bg-gradient-to-br from-purple-600/20 to-pink-600/10 border border-purple-500/20 rounded-3xl p-8">
              
              <h2 className="text-2xl font-bold mb-5">
                Pro Tips 🚀
              </h2>

              <ul className="space-y-4 text-zinc-300">
                <li>• Use clear voice recordings</li>
                <li>• Add high-quality screenshots</li>
                <li>• Keep clips under 30 seconds</li>
                <li>• Use energetic narration</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function MediaCard({ icon, title, desc }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
      
      <div className="w-14 h-14 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-400 mb-6">
        {icon}
      </div>

      <h3 className="text-2xl font-semibold mb-3">
        {title}
      </h3>

      <p className="text-zinc-400">
        {desc}
      </p>
    </div>
  );
}