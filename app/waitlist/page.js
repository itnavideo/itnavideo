export default function WaitlistPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      
      <div className="max-w-3xl text-center">
        
        <h1 className="text-6xl font-bold mb-6">
          Long-Form AI Video Waitlist
        </h1>

        <p className="text-zinc-400 text-lg leading-8 mb-10">
          Join early access for AI-generated YouTube videos,
          podcast visuals, and cinematic storytelling.
        </p>

        <form className="flex flex-col sm:flex-row gap-4 justify-center">
          
          <input
            type="email"
            placeholder="Enter your email"
            className="bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 w-full max-w-md"
          />

          <button className="bg-purple-600 hover:bg-purple-500 px-8 py-4 rounded-2xl font-semibold">
            Join Waitlist
          </button>
        </form>
      </div>
    </main>
  );
}