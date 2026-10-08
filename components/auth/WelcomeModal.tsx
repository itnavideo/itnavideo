'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, X, ArrowRight, Gift, Zap } from 'lucide-react';
import { fireSignupCelebration } from '@/lib/utils/confetti';

interface WelcomeModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  forceShow?: boolean;
}

export default function WelcomeModal({
  isOpen: propsIsOpen,
  onClose,
  forceShow = false,
}: WelcomeModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // If explicitly controlled via props
    if (propsIsOpen !== undefined) {
      setIsOpen(propsIsOpen);
      if (propsIsOpen) {
        fireSignupCelebration();
      }
      return;
    }

    if (forceShow) {
      setIsOpen(true);
      fireSignupCelebration();
      return;
    }

    // STRICT FIRST-TIME SIGNUP ONLY: Only show if explicitly requested via signup URL parameter AND if never seen before
    const isNewSignupParam = searchParams.get('welcome') === 'true' || searchParams.get('signup') === 'true';
    const hasSeenWelcome = typeof window !== 'undefined' && localStorage.getItem('itna_welcome_celebration_shown') === 'true';

    if (isNewSignupParam && !hasSeenWelcome) {
      setIsOpen(true);
      fireSignupCelebration();
      if (typeof window !== 'undefined') {
        localStorage.setItem('itna_welcome_celebration_shown', 'true');
        localStorage.setItem('itna_onboarded', 'true');
      }
    }
  }, [propsIsOpen, forceShow, searchParams]);

  const handleDismiss = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('itna_welcome_celebration_shown', 'true');
      localStorage.setItem('itna_onboarded', 'true');
    }
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handlePrimaryAction = () => {
    handleDismiss();
    router.push('/dashboard');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0E1526] p-6 shadow-2xl shadow-[#FF6D00]/20 animate-in zoom-in-95 duration-200">
        
        {/* Top-Right Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition"
          aria-label="Close Modal"
        >
          <X size={18} />
        </button>

        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-32 w-32 rounded-full bg-[#FF6D00]/25 blur-3xl" />

        {/* Modal Header & Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF6D00] via-[#FF8F00] to-[#FFA726] text-black shadow-lg shadow-[#FF6D00]/30 animate-bounce">
            <Gift size={28} className="fill-black stroke-black" />
          </div>

          <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-[#FF6D00]/30 bg-[#FF6D00]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FF9100]">
            <Sparkles size={13} className="text-[#FF9100] animate-pulse" />
            <span>First-Time Creator Bonus</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Welcome to ItnaVideo! 🎉
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xs">
            Your creative studio is unlocked. We've credited your account with free creation credits to get you started immediately.
          </p>
        </div>

        {/* Styled Credit Card Box */}
        <div className="my-5 flex items-center justify-between rounded-xl border border-[#FF6D00]/30 bg-[#FF6D00]/10 p-3.5 shadow-inner">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF6D00]/20 border border-[#FF6D00]/40 text-[#FF9100]">
              <Zap size={18} className="fill-[#FF9100]" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white">Starter Creator Pack</div>
              <div className="text-[10px] text-slate-400">1080p Full HD Render Engine</div>
            </div>
          </div>

          <div className="rounded-lg bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] px-3 py-1.5 text-xs font-black text-black shadow-md shadow-[#FF6D00]/20">
            45 Free Credits Active
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={handlePrimaryAction}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6D00] via-[#FF8F00] to-[#FFA726] px-5 py-3.5 text-sm font-black text-black shadow-lg shadow-[#FF6D00]/25 transition hover:brightness-110 active:scale-98"
          >
            <span>Create My First Video</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
          </button>

          <button
            onClick={handleDismiss}
            className="text-xs font-medium text-slate-400 hover:text-slate-200 transition py-1"
          >
            Skip to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}


