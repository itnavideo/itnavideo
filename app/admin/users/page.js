export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10">
        <h1 className="text-4xl font-bold text-white">User management</h1>
        <p className="mt-3 text-zinc-400">
          Manage accounts, invite creators, and review waitlist applications.
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-zinc-400">Example user list</p>
          </div>
          <button className="rounded-2xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-500 transition">
            Invite new user
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-zinc-800">
          <table className="min-w-full divide-y divide-zinc-800">
            <thead className="bg-zinc-950 text-left text-sm uppercase tracking-[0.2em] text-zinc-500">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 bg-zinc-900 text-sm text-zinc-300">
              <tr>
                <td className="px-6 py-4">Asha Patel</td>
                <td className="px-6 py-4">asha@itnavideo.com</td>
                <td className="px-6 py-4">Admin</td>
                <td className="px-6 py-4">Active</td>
              </tr>
              <tr>
                <td className="px-6 py-4">Jordan Lee</td>
                <td className="px-6 py-4">jordan@creator.com</td>
                <td className="px-6 py-4">Creator</td>
                <td className="px-6 py-4">Pending</td>
              </tr>
              <tr>
                <td className="px-6 py-4">Maria Kim</td>
                <td className="px-6 py-4">maria@education.org</td>
                <td className="px-6 py-4">Business</td>
                <td className="px-6 py-4">Active</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
