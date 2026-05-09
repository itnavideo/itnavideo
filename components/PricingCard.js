export default function PricingCard({ title, price }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
      
      <h2 className="text-3xl font-bold mb-4">
        {title}
      </h2>

      <p className="text-5xl font-bold mb-8">
        {price}
      </p>

      <button className="w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-xl font-semibold">
        Choose Plan
      </button>
    </div>
  );
}