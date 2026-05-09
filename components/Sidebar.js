export default function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-zinc-950 border-r border-zinc-800 p-6">
      
      <h1 className="text-3xl font-bold text-white mb-10">
        Itna<span className="text-purple-500">video</span>
      </h1>

      <nav className="space-y-4 text-zinc-400">
        
        <div className="hover:text-white cursor-pointer">
          Dashboard
        </div>

        <div className="hover:text-white cursor-pointer">
          Upload
        </div>

        <div className="hover:text-white cursor-pointer">
          Videos
        </div>

        <div className="hover:text-white cursor-pointer">
          Settings
        </div>
      </nav>
    </aside>
  );
}