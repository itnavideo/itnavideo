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
      eyebrow="1 Free AI Video Credit"
      title="Create your first AI video for free."
      subtitle="Sign up and get 1 Free AI Video Credit. Create your first video free, no credit card needed."
    >
      <div className="rounded-xl border border-white/5 bg-zinc-950/50 p-8 shadow-2xl backdrop-blur-md">
        {confirmationEmail ? (
          <div>
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <Mail size={22} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Verify your email</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                We sent a verification link to <span className="font-bold text-zinc-200">{confirmationEmail}</span>. Open that link to activate your workspace.
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                If it does not arrive in a minute, check Spam/Promotions or send the link again.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={resendLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 text-sm font-bold text-black transition hover:bg-zinc-200 disabled:opacity-50"
              >
                {resendLoading ? <Loader2 className="animate-spin" size={18} /> : 'Resend verification email'}
              </button>
              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded-lg border border-white/10 bg-white/5 py-3 text-sm font-bold text-zinc-200 transition hover:bg-white/10"
              >
                Go to login
              </Link>
            </div>
          </div>
        ) : (
        <>
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-pink-300/25 bg-pink-500/[0.09] px-3 py-2 text-xs font-black text-pink-100">
            <Sparkles size={14} className="text-pink-300" />
            1 Free AI Video Credit after signup
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Create workspace</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Upload your content and use your free credit to generate one ready-to-post AI video. Failed renders are not charged.
          </p>
          <div className="mt-4 grid gap-2 text-xs font-bold text-zinc-300">
            {['AI captions and reel planning', 'Preview before final render', 'No credit card needed'].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <Check size={13} className="text-brand-mint" />
                {item}
              </span>
            ))}
          </div>
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
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Create Account + Create My Free Video'}
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
          Join with Google + Create My Free Video
        </button>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Already have an account? <Link href="/login" className="font-bold text-emerald-500 hover:text-emerald-400">Sign in</Link>
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
