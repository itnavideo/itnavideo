// app/pricing/page.js

import { Check } from "lucide-react";

export const metadata = {
  title: "Pricing | Itnavideo",
  description: "Simple and transparent pricing for AI video generation.",
};

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for testing the platform",
    features: [
      "1 video per month",
      "720p exports",
      "Basic AI captions",
      "Limited rendering speed",
      "Watermarked videos",
    ],
    button: "Get Started",
    popular: false,
  },

  {
    name: "Basic",
    price: "$9",
    description: "For creators growing consistently",
    features: [
      "20 videos per month",
      "1080p exports",
      "AI captions & animations",
      "Faster rendering",
      "No watermark",
      "Instagram & TikTok optimization",
    ],
    button: "Start Basic",
    popular: false,
  },

  {
    name: "Pro",
    price: "$29",
    description: "Best for serious creators & businesses",
    features: [
      "100 videos per month",
      "4K exports",
      "Premium AI scene generation",
      "Priority rendering",
      "Advanced motion graphics",
      "AI sound synchronization",
      "Long-form waitlist access",
    ],
    button: "Go Pro",
    popular: true,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-20">
          
          <p className="text-purple-400 uppercase tracking-[0.3em] text-sm mb-5">
            Pricing
          </p>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Simple Pricing
            <br />
            For Modern Creators
          </h1>

          <p className="text-zinc-400 text-lg max-w-3xl mx-auto leading-8">
            Generate cinematic AI-powered videos without expensive editors,
            complicated timelines, or massive production teams.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl border p-8 transition duration-300 hover:scale-[1.02]
              ${
                plan.popular
                  ? "border-purple-500 bg-gradient-to-b from-purple-600/20 to-pink-600/10"
                  : "border-zinc-800 bg-zinc-900"
              }`}
            >
              
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-5 right-5 bg-purple-600 px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}

              {/* Plan */}
              <h2 className="text-3xl font-bold mb-3">
                {plan.name}
              </h2>

              <p className="text-zinc-400 mb-8">
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-8">
                <span className="text-6xl font-bold">
                  {plan.price}
                </span>

                <span className="text-zinc-400 text-lg">
                  /month
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-10">
                
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-zinc-300"
                  >
                    <Check
                      size={20}
                      className="text-purple-400 mt-1"
                    />

                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button
                className={`w-full py-4 rounded-2xl font-semibold transition
                ${
                  plan.popular
                    ? "bg-purple-600 hover:bg-purple-500"
                    : "bg-zinc-800 hover:bg-zinc-700"
                }`}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-24 text-center">
          
          <h2 className="text-4xl font-bold mb-6">
            Need Enterprise Features?
          </h2>

          <p className="text-zinc-400 max-w-2xl mx-auto leading-8 mb-8">
            Custom AI workflows, dedicated GPU rendering, team collaboration,
            API access, and enterprise-grade infrastructure for agencies and
            large creator teams.
          </p>

          <button className="bg-white text-black px-8 py-4 rounded-2xl font-semibold hover:opacity-90 transition">
            Contact Sales
          </button>
        </div>
      </div>
    </main>
  );
}