'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });

    // Set the session cookie required by middleware.js
    document.cookie = "admin_session=authenticated; path=/; max-age=3600; SameSite=Lax";

    // Simulation: In a real app, verify credentials here.
    // For now, we redirect to the admin portal.
    router.push('/admin');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white px-6">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-md space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-10 shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-white">Login to itnavideo Admin</h1>
        <p className="text-zinc-400 text-sm">Enter your credentials to access the admin portal.</p>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-white focus:border-purple-500 focus:outline-none" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-white focus:border-purple-500 focus:outline-none" required />
        <button type="submit" className="w-full rounded-xl bg-purple-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-purple-700">Login</button>
      </form>
    </div>
  );
}