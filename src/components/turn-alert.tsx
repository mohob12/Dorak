"use client";

import { BellRing, CheckCircle2, Volume2 } from "lucide-react";
import { useEffect } from "react";

type TurnAlertProps = {
  ticketNumber: number;
};

const playTurnSound = () => {
  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & {
      webkitAudioContext?: typeof AudioContext;
    }).webkitAudioContext;

  if (!AudioContextClass) {
    return undefined;
  }

  const audioContext = new AudioContextClass();
  void audioContext.resume();

  const notes = [880, 1046, 1320, 1046, 1320, 1568];

  notes.forEach((frequency, index) => {
    const delay = index * 0.18;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
      frequency,
      audioContext.currentTime + delay
    );
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(
      0.38,
      audioContext.currentTime + delay + 0.025
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + delay + 0.16
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(audioContext.currentTime + delay);
    oscillator.stop(audioContext.currentTime + delay + 0.18);
  });

  const closeTimer = window.setTimeout(() => {
    void audioContext.close();
  }, 1800);

  return () => window.clearTimeout(closeTimer);
};

export function TurnAlert({ ticketNumber }: TurnAlertProps) {
  useEffect(() => {
    navigator.vibrate?.([900, 180, 900, 180, 1100, 220, 700]);
    const cleanupSound = playTurnSound();

    return () => {
      cleanupSound?.();
    };
  }, [ticketNumber]);

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-teal-950/75 px-4 py-8 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border-4 border-amber-300 bg-amber-400 p-6 text-center text-slate-950 shadow-2xl shadow-amber-500/40 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/25" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-teal-700/20" />

        <div className="relative mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white text-amber-700 shadow-xl ring-8 ring-white/35">
          <BellRing className="h-12 w-12 animate-bounce" />
        </div>

        <p className="relative inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">
          تنبيه فوري من Dorak
        </p>
        <h2 className="relative mt-4 text-5xl font-black leading-tight">
          حان دورك الآن!
        </h2>
        <p className="relative mt-4 rounded-[1.5rem] bg-white px-5 py-4 text-2xl font-black text-teal-900 shadow-lg">
          تذكرة رقم {ticketNumber}
        </p>
        <p className="relative mt-4 text-base font-black leading-7 text-slate-900">
          توجه الآن إلى مكان الخدمة. تم تشغيل صوت واهتزاز لتنبيهك.
        </p>

        <div className="relative mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/85 px-4 py-3 text-sm font-black text-teal-900">
            <Volume2 className="mx-auto mb-1 h-5 w-5" />
            صوت تنبيه
          </div>
          <div className="rounded-2xl bg-white/85 px-4 py-3 text-sm font-black text-teal-900">
            <CheckCircle2 className="mx-auto mb-1 h-5 w-5" />
            تحديث مباشر
          </div>
        </div>
      </div>
    </section>
  );
}
