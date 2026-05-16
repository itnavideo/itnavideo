export const metadata = {
  title: "Settings | Itnavideo",
  description: "Manage your Itnavideo account settings.",
};

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          
          <h1 className="text-5xl font-bold mb-4">
            Settings
          </h1>

          <p className="text-zinc-400 text-lg">
            Manage your account, profile, and preferences.
          </p>
        </div>

        <div className="space-y-8">
          
          {/* Profile */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            
            <h2 className="text-3xl font-bold mb-8">
              Profile Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              
              <div>
                <label className="block mb-3 text-zinc-300">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Syed Mohammed Rohi"
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-4 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block mb-3 text-zinc-300">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="hello@itnavideo.com"
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-4 outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <button className="mt-8 bg-purple-600 hover:bg-purple-500 transition px-8 py-4 rounded-2xl font-semibold">
              Save Changes
            </button>
          </section>

          {/* Password */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            
            <h2 className="text-3xl font-bold mb-8">
              Change Password
            </h2>

            <div className="space-y-5">
              
              <input
                type="password"
                placeholder="Current Password"
                className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-4 outline-none focus:border-purple-500"
              />

              <input
                type="password"
                placeholder="New Password"
                className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-4 outline-none focus:border-purple-500"
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-4 outline-none focus:border-purple-500"
              />
            </div>

            <button className="mt-8 bg-purple-600 hover:bg-purple-500 transition px-8 py-4 rounded-2xl font-semibold">
              Update Password
            </button>
          </section>

          {/* Preferences */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            
            <h2 className="text-3xl font-bold mb-8">
              Preferences
            </h2>

            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    Email Notifications
                  </h3>

                  <p className="text-zinc-400">
                    Receive updates about renders and features.
                  </p>
                </div>

                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between">
                
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    Auto Save Projects
                  </h3>

                  <p className="text-zinc-400">
                    Automatically save editing progress.
                  </p>
                </div>

                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5"
                />
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8">
            
            <h2 className="text-3xl font-bold mb-4 text-red-400">
              Danger Zone
            </h2>

            <p className="text-zinc-400 mb-8">
              Permanently delete your account and all associated videos.
            </p>

            <button className="bg-red-600 hover:bg-red-500 transition px-8 py-4 rounded-2xl font-semibold">
              Delete Account
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
