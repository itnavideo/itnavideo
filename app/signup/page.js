export default function SignupPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
        
        <h1 className="text-4xl font-bold mb-3">
          Create Account
        </h1>

        <p className="text-zinc-400 mb-8">
          Start creating AI-powered videos.
        </p>

        <form className="space-y-5">
          
          <input
            type="text"
            placeholder="Full Name"
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-4"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-4"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-4"
          />

          <button className="w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-xl font-semibold">
            Create Account
          </button>
        </form>
      </div>
    </main>
  );
}