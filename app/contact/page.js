import { ArrowRight, Building2, Instagram, Mail, MessageSquare, Send, Sparkles } from "lucide-react";

export const metadata = {
  title: "Contact | Itnavideo",
  description: "Contact Itnavideo for support, partnerships, early access, and business inquiries.",
};

const contactCards = [
  {
    title: "Founder and product",
    desc: "Questions about the roadmap, early access, or the AI video pipeline.",
    href: "mailto:hello@itnavideo.com",
    label: "hello@itnavideo.com",
    icon: Mail,
  },
  {
    title: "Partnerships",
    desc: "For creator teams, agencies, and platform integrations.",
    href: "mailto:sales@itnavideo.com",
    label: "sales@itnavideo.com",
    icon: Building2,
  },
  {
    title: "Instagram",
    desc: "Follow the official Itnavideo page for updates and launch clips.",
    href: "https://www.instagram.com/itnavideo?igsh=dWY3OWVyeDRzbDVh",
    label: "@itnavideo",
    icon: Instagram,
  },
];

export default function ContactPage() {
  return (
    <main className="brand-surface min-h-screen px-6 py-32 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <section>
            <div className="mb-7 inline-flex items-center gap-2 rounded-lg border border-brand-mint/20 bg-brand-mint/10 px-3 py-2 text-sm font-bold text-brand-mint">
              <Sparkles size={16} />
              Contact
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">
              Let’s talk about the future of AI video.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300">
              Reach out for support, creator access, partnerships, or feedback. If it helps creators move from voice to finished video faster, we want to hear it.
            </p>

            <div className="mt-10 grid gap-4">
              {contactCards.map((card) => {
                const Icon = card.icon;
                return (
                  <a
                    key={card.title}
                    href={card.href}
                    target={card.href.startsWith("http") ? "_blank" : undefined}
                    rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group rounded-lg border border-white/10 bg-zinc-950/75 p-5 transition hover:border-brand-mint/40"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-brand-mint/10 text-brand-mint">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h2 className="font-bold">{card.title}</h2>
                        <p className="mt-1 text-sm leading-6 text-zinc-400">{card.desc}</p>
                        <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-brand-mint">
                          {card.label}
                          <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                        </p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-zinc-950/90 p-6 shadow-2xl shadow-black/30">
            <div className="mb-8">
              <MessageSquare className="mb-5 text-brand-mint" size={28} />
              <h2 className="text-3xl font-black">Send a message</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                The form is ready for your contact integration. For now it opens an email draft with your message.
              </p>
            </div>

            <form action="mailto:hello@itnavideo.com" method="post" encType="text/plain" className="space-y-5">
              <Field label="Full name" name="name" placeholder="Your name" />
              <Field label="Email address" name="email" type="email" placeholder="you@example.com" />
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-zinc-300">Message</span>
                <textarea
                  name="message"
                  rows="7"
                  placeholder="Tell us what you are building, creating, or trying to automate..."
                  className="w-full resize-none rounded-lg border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-brand-mint"
                />
              </label>
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-mint px-6 py-4 font-black text-black transition hover:bg-white sm:w-auto">
                <Send size={18} />
                Send message
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({ label, name, placeholder, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-zinc-300">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-brand-mint"
      />
    </label>
  );
}
