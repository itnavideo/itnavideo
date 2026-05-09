// app/dashboard/page.js

import {
  Upload,
  Video,
  Clock3,
  Sparkles,
  FolderOpen,
  BarChart3,
} from "lucide-react";

export const metadata = {
  title: "Dashboard | Itnavideo",
  description: "AI Video Creation Dashboard",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white flex">
      
      {/* Sidebar */}
      <aside className="hidden md:flex w-72 border-r border-zinc-800 bg-zinc-950 p-6 flex-col">
        
        <div className="mb-12">
          <h1 className="text-3xl font-bold">
            Itna<span className="text-purple-500">video</span>
          </h1>

          <p className="text-zinc-500 mt-2 text-sm">
            AI Video Operating System
          </p>
        </div>

        <nav className="space-y-3">
          <SidebarItem icon={<BarChart3 size={20} />} label="Dashboard" active />
          <SidebarItem icon={<Upload size={20} />} label="Upload" />
          <SidebarItem icon={<Video size={20} />} label="My Videos" />
          <SidebarItem icon={<FolderOpen size={20} />} label="Projects" />
          <SidebarItem icon={<Clock3 size={20} />} label="History" />
          <SidebarItem icon={<Sparkles size={20} />} label="AI Tools" />
        </nav>

        <div className="mt-auto">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-5">
            <h3 className="font-semibold mb-2">
              Upgrade To Pro 🚀
            </h3>

            <p className="text-sm text-white/80 mb-4">
              Unlock 4K exports, unlimited renders, and premium AI features.
            </p>

            <button className="bg-white text-black px-4 py-2 rounded-xl font-medium w-full">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          
          <div>
            <h2 className="text-4xl font-bold">
              Welcome Back 👋
            </h2>

            <p className="text-zinc-400 mt-2">
              Generate cinematic AI-powered videos in minutes.
            </p>
          </div>

          <button className="mt-5 md:mt-0 bg-purple-600 hover:bg-purple-500 transition px-6 py-3 rounded-2xl font-semibold">
            + Create Video
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Videos Generated" value="24" />
          <StatCard title="Hours Saved" value="96h" />
          <StatCard title="Storage Used" value="12GB" />
          <StatCard title="Plan" value="Pro" />
        </div>

        {/* Upload Section */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-10">
          
          <div className="flex items-center gap-3 mb-6">
            <Upload className="text-purple-500" />
            <h3 className="text-2xl font-semibold">
              Upload Voice & Media
            </h3>
          </div>

          <div className="border-2 border-dashed border-zinc-700 rounded-3xl p-12 text-center hover:border-purple-500 transition">
            
            <Upload size={48} className="mx-auto text-zinc-500 mb-4" />

            <h4 className="text-2xl font-semibold mb-3">
              Drag & Drop Files
            </h4>

            <p className="text-zinc-400 mb-6">
              Upload voiceovers, screenshots, clips, or images
            </p>

            <button className="bg-purple-600 hover:bg-purple-500 transition px-6 py-3 rounded-xl font-semibold">
              Choose Files
            </button>
          </div>
        </section>

        {/* Recent Projects */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-bold">
              Recent Projects
            </h3>

            <button className="text-purple-400 hover:text-purple-300">
              View All
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            <ProjectCard
              title="Instagram Reel"
              status="Completed"
              duration="00:45"
            />

            <ProjectCard
              title="YouTube Short"
              status="Rendering"
              duration="01:12"
            />

            <ProjectCard
              title="Podcast Clip"
              status="Completed"
              duration="00:58"
            />
          </div>
        </section>
      </section>
    </main>
  );
}

/* Sidebar Item */
function SidebarItem({ icon, label, active }) {
  return (
    <button
      className={`flex items-center gap-4 w-full px-4 py-3 rounded-2xl transition ${
        active
          ? "bg-purple-600 text-white"
          : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/* Stat Card */
function StatCard({ title, value }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
      <p className="text-zinc-400 mb-3">{title}</p>

      <h3 className="text-4xl font-bold">{value}</h3>
    </div>
  );
}

/* Project Card */
function ProjectCard({ title, status, duration }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
      
      <div className="h-44 bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center">
        <Video size={52} className="text-white/80" />
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-semibold">{title}</h4>

          <span
            className={`text-sm px-3 py-1 rounded-full ${
              status === "Completed"
                ? "bg-green-500/20 text-green-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {status}
          </span>
        </div>

        <p className="text-zinc-400">
          Duration: {duration}
        </p>

        <button className="mt-5 w-full bg-zinc-800 hover:bg-zinc-700 transition py-3 rounded-xl">
          Open Project
        </button>
      </div>
    </div>
  );
}