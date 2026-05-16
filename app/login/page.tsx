'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import AuthShell from '@/components/auth/AuthShell';
import { supabase } from '@/lib/supabase/client';
import { getAuthRedirectUrl } from '@/lib/supabase/redirect';

const AUTH_TIMEOUT_MS = 15000;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showResetHelp, setShowResetHelp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError('');
    setShowResetHelp(false);
    setLoading(true);

    try {
      const result = await withTimeout(
        supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        }),
        'auth/timeout'
      );

      if (result.error) throw result.error;
      if (!result.data.user) throw new Error('No user returned from Supabase.');

      toast.success('Authenticated successfully.');
      router.push('/dashboard');
    } catch (error: any) {
      const message = getErrorMessage(error);
      setAuthError(message);
      setShowResetHelp(isCredentialError(error));
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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

  const handleForgotPassword = async () => {
    const targetEmail = email.trim();

    if (!targetEmail) {
      const message = 'Please enter your email address first.';
      setAuthError(message);
      return;
    }

    setResetLoading(true);

    try {
      const result = await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: getAuthRedirectUrl('/login'),
      });
      if (result.error) throw result.error;
      toast.success('Reset link sent to your inbox.');
    } catch (error: any) {
      toast.error(getPasswordResetMessage(error));
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Engine Access"
      title="Continue building your AI video engine."
      subtitle="Sign in to manage your automated video pipeline."
    >
      <div className="rounded-xl border border-white/5 bg-zinc-950/50 p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-white">Welcome back</h2>
          <p className="mt-1 text-sm text-zinc-400">Access your rendering pipeline and projects.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500/50"
                placeholder="name@company.com"
                required
                autoComplete="email"
                inputMode="email"
                autoCapitalize="none"
                spellCheck={false}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex justify-between">
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 disabled:opacity-60"
              >
                {resetLoading ? 'Sending...' : 'Forgot?'}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 py-3 pl-10 pr-10 text-sm outline-none transition focus:border-emerald-500/50"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {authError && (
            <div className="rounded-lg border border-red-400/20 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
              <p>{authError}</p>
              {showResetHelp && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={loading || resetLoading}
                  className="mt-3 font-bold text-emerald-200 transition hover:text-emerald-100 disabled:opacity-60"
                >
                  {resetLoading ? 'Sending reset link...' : 'Send password reset link'}
                </button>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 text-sm font-bold text-black transition hover:bg-zinc-200 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign In'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-950 px-2 font-medium text-zinc-500">Or continue with</span></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 py-3 text-sm font-medium transition hover:bg-white/10 disabled:opacity-50"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-black text-black">G</span>
          Google Account
        </button>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Don&apos;t have an account? <Link href="/signup" className="font-bold text-emerald-400 hover:text-emerald-300">Create one</Link>
        </p>
      </div>
    </AuthShell>
  );
}

function getErrorMessage(error: any) {
  const code = String(error?.code || error?.name || '');
  const message = String(error?.message || '').toLowerCase();

  switch (code) {
    case 'auth/timeout':
      return 'Login is taking too long. Check your connection and try again.';
  }

  if (message.includes('invalid login') || message.includes('invalid credentials')) {
    return 'Email or password did not match. Use your saved password, choose Google account, or reset the password.';
  }
  if (message.includes('email')) return 'Enter a valid email address.';
  if (message.includes('rate') || message.includes('too many')) return 'Too many attempts. Please try again later.';

  return error?.message || 'Login failed. Please try again.';
}

function isCredentialError(error: any) {
  const message = String(error?.message || '').toLowerCase();
  return message.includes('invalid login') || message.includes('invalid credentials');
}

function getPasswordResetMessage(error: any) {
  const code = String(error?.code || error?.name || '');
  const message = String(error?.message || '').toLowerCase();

  switch (code) {
    case 'auth/timeout':
      return 'Password reset is taking too long. Check your connection and try again.';
  }

  if (message.includes('email')) return 'Enter a valid email address.';
  if (message.includes('rate') || message.includes('too many')) return 'Too many reset attempts. Please try again later.';
  return 'If this email has an account, a reset link will arrive shortly.';
}

function withTimeout<T>(promise: Promise<T>, code: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => reject({ code }), AUTH_TIMEOUT_MS);
    }),
  ]);
}


