// app/contact/page.js

export const metadata = {
  title: "Contact | Itnavideo",
  description: "Get in touch with the Itnavideo team.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-purple-400 mb-4">
            Contact
          </p>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Let’s Build The Future Of AI Video
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have questions, partnership ideas, or want early access?
            Reach out to the Itnavideo team.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <h2 className="text-2xl font-semibold mb-4">
              📩 Email
            </h2>

            <p className="text-gray-400 mb-3">
              For support, partnerships, or business inquiries:
            </p>

            <a
              href="mailto:hello@itnavideo.com"
              className="text-purple-400 text-lg hover:text-purple-300 transition"
            >
              hello@itnavideo.com
            </a>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <h2 className="text-2xl font-semibold mb-4">
              🌍 Website
            </h2>

            <p className="text-gray-400 mb-3">
              Visit our official website:
            </p>

            <a
              href="https://itnavideo.com"
              target="_blank"
              className="text-purple-400 text-lg hover:text-purple-300 transition"
            >
              itnavideo.com
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <h2 className="text-3xl font-bold mb-8">
            Send a Message
          </h2>

          <form className="space-y-6">
            
            <div>
              <label className="block mb-2 text-gray-300">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-4 outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-4 outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300">
                Message
              </label>

              <textarea
                rows="6"
                placeholder="Write your message..."
                className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-4 outline-none focus:border-purple-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 transition px-8 py-4 rounded-xl font-semibold"
            >
              Send Message
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}