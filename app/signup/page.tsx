'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Eye, EyeOff, Loader2, Lock, Mail, Sparkles, User as UserIcon } from 'lucide-react';
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
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
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
        const targetEmail = email.trim();
        setConfirmationEmail(targetEmail);
        toast.success('Account created. Check your inbox for the verification link.');
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    const targetEmail = confirmationEmail || email.trim();

    if (!targetEmail) {
      toast.error('Enter your email address first.');
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

  return (
    <AuthShell
      eyebrow="Itnavideo Account Setup"
      title="Start Creating Professional AI Videos."
      subtitle="Sign up for your Itnavideo account. Choose a credit pack after signup to unlock 1080p Full HD AI video creation."
    >
      <div className="rounded-[28px] border border-white/10 bg-zinc-900/80 p-7 sm:p-9 shadow-2xl shadow-black/60 backdrop-blur-xl ring-1 ring-white/5">
        {confirmationEmail ? (
          <div>
            <div className="mb-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
                <Mail size={22} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">Verify your email</h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-300">
                We sent a verification link to <span className="font-bold text-white">{confirmationEmail}</span>. Open that link to activate your workspace.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                If it does not arrive in a minute, check Spam/Promotions or send the link again.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={resendLoading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {resendLoading ? <Loader2 className="animate-spin" size={18} /> : 'Resend verification email'}
              </button>
              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded-full border border-white/15 bg-white/5 py-3 text-sm font-bold text-zinc-200 transition-all hover:bg-white/10 active:scale-[0.98]"
              >
                Go to login
              </Link>
            </div>
          </div>
        ) : (
        <>
        <div className="mb-7">
          <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-300">
            <Sparkles size={14} className="text-amber-400" />
            <span>Choose a paid credit pack after signup</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">Create workspace</h2>
          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-zinc-400">
            Sign up to create your account. Select a Creator, Pro, or Agency plan after signup to start rendering 1080p Full HD AI videos instantly.
          </p>
          <div className="mt-4 grid gap-2 text-xs font-bold text-zinc-300">
            {['11 AI Video Workflows Unlocked', 'Full 1080p HD Resolution, Zero Watermark', 'Fast Remotion Lambda Render Engine'].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <Check size={14} className="text-amber-400" />
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <AuthInput
            icon={<UserIcon size={17} />}
            label="Full Name"
            value={name}
            onChange={setName}
            placeholder="Jane Doe"
            autoComplete="name"
          />

          <AuthInput
            icon={<Mail size={17} />}
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

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-300">
              Password
            </label>
            <div className="relative flex items-center rounded-2xl border border-white/15 bg-zinc-950/70 transition-all duration-200 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20">
              <Lock className="absolute left-4 text-zinc-400 pointer-events-none" size={17} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent py-3.5 pl-12 pr-11 text-sm text-white placeholder:text-zinc-500 outline-none font-medium"
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="mt-1.5 text-[11px] font-medium tracking-normal text-zinc-400">
              Minimum 6 characters required.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Create Account'}
          </button>
        </form>

        <div className="relative my-7">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-zinc-900/95 px-3 font-bold text-zinc-400">Or continue with</span></div>
        </div>

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 py-3.5 text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-black text-black">G</span>
          <span>Join with Google</span>
        </button>

        <p className="mt-7 text-center text-xs sm:text-sm text-zinc-400">
          Already have an account? <Link href="/login" className="font-bold text-amber-400 hover:text-amber-300 transition-colors ml-1">Sign in</Link>
        </p>
        </>
        )}
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
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-300">{label}</span>
      <div className="relative flex items-center rounded-2xl border border-white/15 bg-zinc-950/70 transition-all duration-200 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20">
        <span className="absolute left-4 text-zinc-400 pointer-events-none">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none font-medium"
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

function getErrorMessage(error: unknown) {
  const code = getErrorCode(error);
  const message = getRawErrorMessage(error).toLowerCase();

  switch (code) {
    case 'auth/timeout':
      return 'Signup is taking too long. Check your connection and try again.';
  }

  if (message.includes('already registered') || message.includes('already exists')) {
    return 'An account with this email already exists. Sign in, use Google, or resend verification if the email was not confirmed.';
  }
  if (message.includes('provider') || message.includes('oauth')) {
    return 'Google sign-in is not connected yet. Please enable Google provider in the auth dashboard and try again.';
  }
  if (message.includes('redirect') || message.includes('url not allowed')) {
    return 'Google sign-in redirect URL is not allowed yet. Add this site URL in the auth dashboard redirect settings.';
  }
  if (message.includes('email')) return 'Enter a valid email address.';
  if (message.includes('password')) return 'Password should be at least 6 characters.';

  return getRawErrorMessage(error) || 'Signup failed. Please try again.';
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

