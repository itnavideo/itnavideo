export default function BillingPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-5xl font-bold mb-10">
          Billing
        </h1>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          
          <h2 className="text-3xl font-bold mb-4">
            Current Plan: Pro
          </h2>

          <p className="text-zinc-400 mb-8">
            You are currently subscribed to the Pro plan.
          </p>

          <button className="bg-purple-600 hover:bg-purple-500 px-8 py-4 rounded-2xl font-semibold">
            Upgrade Plan
          </button>
        </div>
      </div>
    </main>
  );
}