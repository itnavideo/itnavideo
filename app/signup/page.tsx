'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Lock, Mail, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import AuthShell from '@/components/auth/AuthShell';
import { supabase } from '@/lib/supabase/client';
import { getAuthRedirectUrl } from '@/lib/supabase/redirect';

const AUTH_TIMEOUT_MS = 15000;

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await withTimeout(
        supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              name: name.trim(),
              full_name: name.trim(),
            },
            emailRedirectTo: getAuthRedirectUrl('/dashboard'),
          },
        }),
        'auth/timeout'
      );

      if (result.error) throw result.error;
      const user = result.data.user;
      if (!user) throw new Error('No user returned from Supabase.');

      if (result.data.session) {
        toast.success('Account created. Welcome to Itnavideo.');
        router.push('/dashboard');
      } else {
        toast.success('Account created. Check your email to confirm sign in.');
        router.push('/login');
      }
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);

    try {
      const result = await withTimeout(
        supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: getAuthRedirectUrl('/dashboard'),
            queryParams: {
              prompt: 'select_account',
            },
          },
        }),
        'auth/timeout'
      );

      if (result.error) throw result.error;

      toast.success('Opening Google sign-in.');
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Start Building"
      title="Turn your voice into publish-ready videos."
      subtitle="Create an account to access our automated AI video pipeline."
    >
      <div className="rounded-xl border border-white/5 bg-zinc-950/50 p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-white">Create workspace</h2>
          <p className="mt-1 text-sm text-zinc-400">Your AI video journey starts here.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <AuthInput
            icon={<UserIcon size={16} />}
            label="Full Name"
            value={name}
            onChange={setName}
            placeholder="Jane Doe"
            autoComplete="name"
          />

          <AuthInput
            icon={<Mail size={16} />}
            label="Email Address"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="jane@company.com"
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
          />

          <div className="relative">
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 py-3 pl-10 pr-10 text-sm outline-none transition focus:border-emerald-500/50"
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="mt-2 text-[10px] uppercase leading-relaxed tracking-normal text-zinc-600">
              Minimum 6 characters required.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 text-sm font-bold text-black transition hover:bg-zinc-200 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Create Account'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-950 px-2 font-medium text-zinc-500">Or</span></div>
        </div>

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 py-3 text-sm font-medium transition hover:bg-white/10 disabled:opacity-50"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-black text-black">G</span>
          Join with Google
        </button>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Already have an account? <Link href="/login" className="font-bold text-emerald-400 hover:text-emerald-300">Sign in</Link>
        </p>
      </div>
    </AuthShell>
  );
}

function AuthInput({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  autoComplete,
  inputMode,
  autoCapitalize,
  spellCheck,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  autoComplete: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  autoCapitalize?: string;
  spellCheck?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">{label}</span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black/40 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500/50"
          placeholder={placeholder}
          required
          autoComplete={autoComplete}
          inputMode={inputMode}
          autoCapitalize={autoCapitalize}
          spellCheck={spellCheck}
        />
      </div>
    </label>
  );
}

function getErrorMessage(error: any) {
  const code = String(error?.code || error?.name || '');
  const message = String(error?.message || '').toLowerCase();

  switch (code) {
    case 'auth/timeout':
      return 'Signup is taking too long. Check your connection and try again.';
  }

  if (message.includes('already registered') || message.includes('already exists')) {
    return 'An account with this email already exists. Sign in, choose Google account, or use Forgot password on the login page.';
  }
  if (message.includes('email')) return 'Enter a valid email address.';
  if (message.includes('password')) return 'Password should be at least 6 characters.';

  return error?.message || 'Signup failed. Please try again.';
}

function withTimeout<T>(promise: Promise<T>, code: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => reject({ code }), AUTH_TIMEOUT_MS);
    }),
  ]);
}
