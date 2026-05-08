export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-6">
      <main className="text-center">
        <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          ItnaVideo.AI
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl">
          Convert your thoughts into viral short-form videos in seconds. 
          Powered by AI, built for creators.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold transition">
            Get Started Free
          </button>
          <button className="border border-gray-700 hover:bg-gray-900 px-8 py-3 rounded-full font-bold transition">
            View Demo
          </button>
        </div>
      </main>
    </div>
  );
}