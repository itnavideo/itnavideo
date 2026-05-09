export default function VideoCard({ title }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
      
      <div className="h-52 bg-gradient-to-br from-purple-600/20 to-pink-600/20" />

      <div className="p-6">
        
        <h3 className="text-2xl font-semibold mb-3">
          {title}
        </h3>

        <button className="w-full bg-zinc-800 hover:bg-zinc-700 py-3 rounded-xl">
          Open Video
        </button>
      </div>
    </div>
  );
}