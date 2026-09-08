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
  const [resendLoading, setResendLoading] = useState(false);
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
    } catch (error) {
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
      if (result.data?.url) {
        window.location.assign(result.data.url);
        return;
      }

      toast.success('Opening Google sign-in.');
    } catch (error) {
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
    } catch (error) {
      toast.error(getPasswordResetMessage(error));
    } finally {
      setResetLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    const targetEmail = email.trim();

    if (!targetEmail) {
      const message = 'Please enter your email address first.';
      setAuthError(message);
      return;
    }

    setResendLoading(true);

    try {
      const result = await withTimeout(
        supabase.auth.resend({
          type: 'signup',
          email: targetEmail,
          options: {
            emailRedirectTo: getAuthRedirectUrl('/dashboard'),
          },
        }),
        'auth/timeout'
      );

      if (result.error) throw result.error;
      toast.success('Verification email sent again. Check inbox and spam folder.');
    } catch (error) {
      toast.error(getResendErrorMessage(error));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Engine Access"
      title="Continue building with Itnavideo."
      subtitle="Sign in to manage uploads, render status, and completed reel links."
    >
      <div className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-7 sm:p-9 shadow-2xl shadow-black/60 backdrop-blur-xl ring-1 ring-white/5">
        <div className="mb-7">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">Welcome back</h2>
          <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Open your creator dashboard and continue from your latest render.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-300">
              Email Address
            </label>
            <div className="relative flex items-center rounded-2xl border border-white/15 bg-zinc-950/70 transition-all duration-200 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20">
              <Mail className="absolute left-4 text-zinc-400 pointer-events-none" size={17} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none font-medium"
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
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-60 cursor-pointer"
              >
                {resetLoading ? 'Sending...' : 'Forgot?'}
              </button>
            </div>
            <div className="relative flex items-center rounded-2xl border border-white/15 bg-zinc-950/70 transition-all duration-200 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20">
              <Lock className="absolute left-4 text-zinc-400 pointer-events-none" size={17} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent py-3.5 pl-12 pr-11 text-sm text-white placeholder:text-zinc-500 outline-none font-medium"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {authError && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs sm:text-sm leading-relaxed text-red-200">
              <p>{authError}</p>
              {showResetHelp && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={loading || resetLoading}
                  className="mt-3 font-bold text-amber-400 transition hover:text-amber-300 disabled:opacity-60 cursor-pointer"
                >
                  {resetLoading ? 'Sending reset link...' : 'Send password reset link'}
                </button>
              )}
              {isUnconfirmedEmailMessage(authError) && (
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={loading || resendLoading}
                  className="mt-3 block font-bold text-amber-400 transition hover:text-amber-300 disabled:opacity-60 cursor-pointer"
                >
                  {resendLoading ? 'Sending verification...' : 'Resend verification email'}
                </button>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign In'}
          </button>
        </form>

        <div className="relative my-7">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-zinc-900/95 px-3 font-bold text-zinc-400">Or continue with</span></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 py-3.5 text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-black text-black">G</span>
          <span>Google Account</span>
        </button>

        <p className="mt-7 text-center text-xs sm:text-sm text-zinc-400">
          Don&apos;t have an account? <Link href="/signup" className="font-bold text-amber-400 hover:text-amber-300 transition-colors ml-1">Create one</Link>
        </p>
      </div>
    </AuthShell>
  );
}

function getErrorMessage(error: unknown) {
  const code = getErrorCode(error);
  const message = getRawErrorMessage(error).toLowerCase();

  switch (code) {
    case 'auth/timeout':
      return 'Login is taking too long. Check your connection and try again.';
  }

  if (message.includes('invalid login') || message.includes('invalid credentials')) {
    return 'Email or password did not match. Use your saved password, choose Google account, or reset the password.';
  }
  if (message.includes('not confirmed') || message.includes('confirm')) {
    return 'This email is not verified yet. Please open the verification link or resend it below.';
  }
  if (message.includes('provider') || message.includes('oauth')) {
    return 'Google sign-in is not connected yet. Please enable Google provider in the auth dashboard and try again.';
  }
  if (message.includes('redirect') || message.includes('url not allowed')) {
    return 'Google sign-in redirect URL is not allowed yet. Add this site URL in the auth dashboard redirect settings.';
  }
  if (message.includes('email')) return 'Enter a valid email address.';
  if (message.includes('rate') || message.includes('too many')) return 'Too many attempts. Please try again later.';

  return getRawErrorMessage(error) || 'Login failed. Please try again.';
}

function isUnconfirmedEmailMessage(message: string) {
  const normalized = String(message || '').toLowerCase();
  return normalized.includes('not verified') || normalized.includes('verification');
}

function isCredentialError(error: unknown) {
  const message = getRawErrorMessage(error).toLowerCase();
  return message.includes('invalid login') || message.includes('invalid credentials');
}

function getResendErrorMessage(error: unknown) {
  const code = getErrorCode(error);
  const message = getRawErrorMessage(error).toLowerCase();

  switch (code) {
    case 'auth/timeout':
      return 'Verification email is taking too long. Check your connection and try again.';
  }

  if (message.includes('rate') || message.includes('too many')) {
    return 'Too many verification emails requested. Please wait a minute and try again.';
  }
  if (message.includes('email')) return 'Enter a valid email address.';

  return getRawErrorMessage(error) || 'Could not resend verification email. Please try again.';
}

function getPasswordResetMessage(error: unknown) {
  const code = getErrorCode(error);
  const message = getRawErrorMessage(error).toLowerCase();

  switch (code) {
    case 'auth/timeout':
      return 'Password reset is taking too long. Check your connection and try again.';
  }

  if (message.includes('email')) return 'Enter a valid email address.';
  if (message.includes('rate') || message.includes('too many')) return 'Too many reset attempts. Please try again later.';
  return 'If this email has an account, a reset link will arrive shortly.';
}

function getErrorCode(error: unknown) {
  if (!error || typeof error !== 'object') return '';
  const value = (error as { code?: unknown; name?: unknown }).code || (error as { name?: unknown }).name;
  return typeof value === 'string' ? value : '';
}

function getRawErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '';
}

function withTimeout<T>(promise: Promise<T>, code: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => reject({ code }), AUTH_TIMEOUT_MS);
    }),
  ]);
}



