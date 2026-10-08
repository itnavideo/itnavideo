'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Eye, EyeOff, Loader2, Lock, Mail, Sparkles, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import AuthShell from '@/components/auth/AuthShell';
import { supabase } from '@/lib/supabase/client';
import { getAuthRedirectUrl } from '@/lib/supabase/redirect';
import { trackSignUp, trackLogin, setAnalyticsUser } from '@/lib/analytics/gtag';

const AUTH_TIMEOUT_MS = 15000;

function GoogleSvgIcon({ className = "w-5 h-5 shrink-0" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 10.03 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export default function SignupPage() {
  const [activeTab, setActiveTab] = useState<'signup' | 'signin'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError('');
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

      // GA4 Sign Up Conversion Event
      trackSignUp('email', 'free_trial');
      setAnalyticsUser(user.id, { plan_tier: 'free_trial' });

      if (result.data.session) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('itna_onboarded');
        }
        toast.success('Account created! Welcome to Itnavideo.');
        router.push('/dashboard?welcome=true');
      } else {
        const targetEmail = email.trim();
        setConfirmationEmail(targetEmail);
        toast.success('Account created. Check your inbox for the verification link.');
      }
    } catch (error) {
      const msg = getErrorMessage(error);
      setAuthError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError('');
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

      // GA4 Login Event
      trackLogin('email');
      setAnalyticsUser(result.data.user.id);

      toast.success('Authenticated successfully.');
      router.push('/dashboard');
    } catch (error) {
      const msg = getErrorMessage(error);
      setAuthError(msg);
      toast.error(msg);
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

  const handleGoogleAuth = async () => {
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
      title="Start Creating Viral Videos with AI."
      subtitle="Claim 45 free render credits on signup. No credit card required."
    >
      {/* Surface Container Extra-Large Card */}
      <div className="rounded-[28px] border border-white/[0.08] bg-[#131722]/95 p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-2xl ring-1 ring-white/5">
        {confirmationEmail ? (
          <div>
            <div className="mb-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
                <Mail size={22} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">Verify your email</h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-300">
                We sent a verification link to <span className="font-bold text-white">{confirmationEmail}</span>. Open that link to activate your workspace.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                If it does not arrive in a minute, check Spam/Promotions or send the link again.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={resendLoading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {resendLoading ? <Loader2 className="animate-spin text-slate-950" size={18} /> : 'Resend verification email'}
              </button>
              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded-full border border-white/12 bg-white/5 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-white/10 active:scale-[0.98]"
              >
                Go to login
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Segmented Button Tab Switcher */}
            <div className="mb-6 p-1 rounded-full bg-[#0B0E17] border border-white/[0.08] flex items-center relative">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setAuthError('');
                }}
                className={`flex-1 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === 'signin'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-orange-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setAuthError('');
                }}
                className={`flex-1 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === 'signup'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-orange-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
                {activeTab === 'signup' ? 'Create workspace' : 'Welcome back'}
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-400 leading-relaxed">
                {activeTab === 'signup'
                  ? 'Sign up to create your account and start rendering AI videos instantly.'
                  : 'Open your creator dashboard and continue from your latest render.'}
              </p>
            </div>

            {/* M3 Outlined Google SSO Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-white/12 bg-white/[0.04] hover:bg-white/[0.08] py-3.5 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <GoogleSvgIcon />
              <span>{activeTab === 'signup' ? 'Join with Google' : 'Continue with Google'}</span>
            </button>

            {/* M3 Tonal Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/[0.08]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                <span className="bg-[#121622] px-3 text-slate-400">or with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={activeTab === 'signup' ? handleSignup : handleLogin} className="space-y-4">
              {activeTab === 'signup' && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                    Full Name
                  </label>
                  <div className="relative flex items-center rounded-2xl border border-white/12 bg-[#0C0F17]/80 transition-all duration-200 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 focus-within:bg-[#0F131C]">
                    <UserIcon className="absolute left-4 text-slate-400 pointer-events-none" size={17} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 outline-none font-medium"
                      placeholder="Jane Doe"
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                  Email Address
                </label>
                <div className="relative flex items-center rounded-2xl border border-white/12 bg-[#0C0F17]/80 transition-all duration-200 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 focus-within:bg-[#0F131C]">
                  <Mail className="absolute left-4 text-slate-400 pointer-events-none" size={17} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 outline-none font-medium"
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
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  {activeTab === 'signin' && (
                    <Link
                      href="/login"
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      Forgot?
                    </Link>
                  )}
                </div>
                <div className="relative flex items-center rounded-2xl border border-white/12 bg-[#0C0F17]/80 transition-all duration-200 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 focus-within:bg-[#0F131C]">
                  <Lock className="absolute left-4 text-slate-400 pointer-events-none" size={17} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent py-3.5 pl-12 pr-11 text-sm text-white placeholder:text-slate-500 outline-none font-medium"
                    placeholder="••••••••"
                    required
                    minLength={activeTab === 'signup' ? 6 : undefined}
                    autoComplete={activeTab === 'signup' ? 'new-password' : 'current-password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {activeTab === 'signup' && (
                  <p className="mt-1.5 text-[11px] font-medium text-slate-400">
                    Minimum 6 characters required.
                  </p>
                )}
              </div>

              {/* Error Box */}
              {authError && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs sm:text-sm leading-relaxed text-red-200">
                  <p>{authError}</p>
                </div>
              )}

              {/* Primary Filled Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-orange-500/25 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer mt-3"
              >
                {loading ? (
                  <Loader2 className="animate-spin text-slate-950" size={18} />
                ) : (
                  <span>{activeTab === 'signup' ? 'Create Free Account' : 'Sign In'}</span>
                )}
              </button>
            </form>

            {/* Bottom Toggle Text (Generous padding - No clipping) */}
            <div className="mt-6 pt-1 text-center text-xs sm:text-sm text-slate-400">
              {activeTab === 'signup' ? (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signin');
                      setAuthError('');
                    }}
                    className="font-bold text-amber-400 hover:text-amber-300 transition-colors ml-1 cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              ) : (
                <p>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      setAuthError('');
                    }}
                    className="font-bold text-amber-400 hover:text-amber-300 transition-colors ml-1 cursor-pointer"
                  >
                    Create one
                  </button>
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </AuthShell>
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

