import VideoCard from "@/components/VideoCard";

export const metadata = {
  title: "My Videos | Itnavideo",
  description: "Manage your AI-generated videos.",
};

export default function VideosPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          
          <div>
            <h1 className="text-5xl font-bold mb-3">
              My Videos
            </h1>

            <p className="text-zinc-400 text-lg">
              Manage and preview your AI-generated projects.
            </p>
          </div>

          <button className="mt-6 md:mt-0 bg-purple-600 hover:bg-purple-500 transition px-6 py-3 rounded-2xl font-semibold">
            + Create New Video
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-10">
          
          <button className="bg-purple-600 px-5 py-2 rounded-xl">
            All
          </button>

          <button className="bg-zinc-900 border border-zinc-800 px-5 py-2 rounded-xl hover:border-zinc-600 transition">
            Completed
          </button>

          <button className="bg-zinc-900 border border-zinc-800 px-5 py-2 rounded-xl hover:border-zinc-600 transition">
            Rendering
          </button>

          <button className="bg-zinc-900 border border-zinc-800 px-5 py-2 rounded-xl hover:border-zinc-600 transition">
            Drafts
          </button>
        </div>

        {/* Videos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <VideoCard
            title="Instagram Reel"
            duration="00:45"
            status="Completed"
          />

          <VideoCard
            title="Podcast Highlight"
            duration="01:12"
            status="Rendering"
          />

          <VideoCard
            title="YouTube Short"
            duration="00:58"
            status="Completed"
          />

          <VideoCard
            title="Business Promo"
            duration="00:37"
            status="Draft"
          />

          <VideoCard
            title="Motivational Reel"
            duration="00:50"
            status="Completed"
          />

          <VideoCard
            title="Tutorial Clip"
            duration="01:20"
            status="Rendering"
          />
        </div>
      </div>
    </main>
  );
}