"use client";

import { BellRing, Volume2 } from "lucide-react";
import { useEffect } from "react";

type TurnAlertProps = {
  ticketNumber: number;
};

export function TurnAlert({ ticketNumber }: TurnAlertProps) {
  useEffect(() => {
    navigator.vibrate?.([700, 180, 700, 180, 900]);

    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }).webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    const audioContext = new AudioContextClass();
    void audioContext.resume();

    [0, 0.28, 0.56].forEach((delay) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(
        880,
        audioContext.currentTime + delay
      );
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(
        0.35,
        audioContext.currentTime + delay + 0.02
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + delay + 0.22
      );

      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(audioContext.currentTime + delay);
      oscillator.stop(audioContext.currentTime + delay + 0.24);
    });

    const closeTimer = window.setTimeout(() => {
      void audioContext.close();
    }, 1400);

    return () => {
      window.clearTimeout(closeTimer);
    };
  }, []);

  return (
    <section className="animate-in zoom-in-95 slide-in-from-bottom-4 rounded-[2rem] border-4 border-amber-300 bg-amber-400 p-6 text-center text-slate-950 shadow-2xl shadow-amber-500/40 duration-500">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-white text-amber-700 shadow-lg">
        <BellRing className="h-10 w-10 animate-pulse" />
      </div>

      <p className="text-lg font-black">تنبيه مهم</p>
      <h2 className="mt-2 text-4xl font-black leading-tight">
        حان دورك الآن!
      </h2>
      <p className="mt-3 text-lg font-black">
        تذكرة رقم {ticketNumber} — توجه إلى مكان الخدمة
      </p>

      <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-amber-800">
        <Volume2 className="h-4 w-4" />
        تم تشغيل الصوت والاهتزاز
      </div>
    </section>
  );
}