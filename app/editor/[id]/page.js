export default function EditorPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-5xl font-bold mb-10">
          AI Video Editor
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Preview */}
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl h-[500px] flex items-center justify-center text-zinc-500 text-2xl">
            Video Preview
          </div>

          {/* Controls */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            
            <h2 className="text-2xl font-semibold mb-6">
              Rendering Controls
            </h2>

            <button className="w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-xl font-semibold mb-4">
              Render Video
            </button>

            <button className="w-full bg-zinc-800 hover:bg-zinc-700 py-4 rounded-xl font-semibold">
              Export MP4
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}