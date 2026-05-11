"use client";

import { MonitorPlay, Store, Ticket, UsersRound, Volume2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  ensureShop,
  getTickets,
  type Shop,
  type Ticket as QueueTicket,
} from "@/lib/queue";

type QueueDisplayScreenProps = {
  shopId: string;
};

const playDisplayAlert = () => {
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

  const notes = [784, 988, 1174, 1568, 1174, 1568];

  notes.forEach((frequency, index) => {
    const delay = index * 0.22;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(
      frequency,
      audioContext.currentTime + delay
    );

    gain.gain.setValueAtTime(0.0001, audioContext.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(
      0.3,
      audioContext.currentTime + delay + 0.03
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + delay + 0.2
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(audioContext.currentTime + delay);
    oscillator.stop(audioContext.currentTime + delay + 0.22);
  });

  window.setTimeout(() => {
    void audioContext.close();
  }, 2200);
};

export function QueueDisplayScreen({ shopId }: QueueDisplayScreenProps) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [tickets, setTickets] = useState<QueueTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightTurn, setHighlightTurn] = useState(false);
  const previousCurrentTurnId = useRef<string | null>(null);

  const loadDisplayData = useCallback(async () => {
    const loadedShop = await ensureShop(shopId);
    const loadedTickets = await getTickets(loadedShop.id);

    setShop(loadedShop);
    setTickets(loadedTickets);
    setIsLoading(false);
  }, [shopId]);

  useEffect(() => {
    loadDisplayData();

    const channel = supabase
      .channel(`queue-display-${shopId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tickets",
          filter: `shop_id=eq.${shopId}`,
        },
        () => {
          void loadDisplayData();
        }
      )
      .subscribe();

    const refreshTimer = window.setInterval(() => {
      void loadDisplayData();
    }, 3000);

    return () => {
      window.clearInterval(refreshTimer);
      void supabase.removeChannel(channel);
    };
  }, [loadDisplayData, shopId]);

  const waitingTickets = useMemo(() => {
    return tickets.filter((ticket) => ticket.status === "waiting");
  }, [tickets]);

  const servedTickets = useMemo(() => {
    return tickets
      .filter((ticket) => ticket.status === "served")
      .sort((a, b) => {
        const aTime = a.served_at ? new Date(a.served_at).getTime() : 0;
        const bTime = b.served_at ? new Date(b.served_at).getTime() : 0;
        return bTime - aTime;
      });
  }, [tickets]);

  const currentTurn = servedTickets[0] || null;
  const upcomingTurns = waitingTickets.slice(0, 6);

  useEffect(() => {
    if (!currentTurn?.id) {
      previousCurrentTurnId.current = null;
      return;
    }

    if (
      previousCurrentTurnId.current &&
      previousCurrentTurnId.current !== currentTurn.id
    ) {
      setHighlightTurn(true);
      playDisplayAlert();

      const timer = window.setTimeout(() => {
        setHighlightTurn(false);
      }, 4500);

      previousCurrentTurnId.current = currentTurn.id;

      return () => {
        window.clearTimeout(timer);
      };
    }

    previousCurrentTurnId.current = currentTurn.id;
  }, [currentTurn?.id]);

  if (isLoading) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#f6fbf8] px-4 text-slate-950"
      >
        <div className="rounded-[2rem] bg-white px-8 py-10 text-center shadow-sm">
          <p className="text-2xl font-black">جاري تحميل شاشة العرض...</p>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f6fbf8] px-4 py-6 text-slate-950 sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[2.5rem] bg-teal-700 p-6 text-white shadow-xl shadow-teal-900/15 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-black">
                Dorak | دورك
              </div>
              <h1 className="mt-4 text-4xl font-black sm:text-6xl">
                شاشة عرض الأدوار
              </h1>
              <p className="mt-3 text-base leading-8 text-teal-50/85 sm:text-lg">
                تابع الدور الحالي والأدوار القادمة بشكل مباشر.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.7rem] bg-white/12 p-5 ring-1 ring-white/15">
                <UsersRound className="mb-3 h-7 w-7 text-amber-300" />
                <p className="text-sm text-teal-50/80">في الانتظار</p>
                <p className="mt-2 text-4xl font-black">{waitingTickets.length}</p>
              </div>

              <div className="rounded-[1.7rem] bg-white/12 p-5 ring-1 ring-white/15">
                <Store className="mb-3 h-7 w-7 text-amber-300" />
                <p className="text-sm text-teal-50/80">المعرف</p>
                <p className="mt-2 text-2xl font-black">{shop?.id || shopId}</p>
              </div>
            </div>
          </div>
        </header>

        {highlightTurn && currentTurn ? (
          <section className="mt-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="rounded-[2rem] border-4 border-amber-300 bg-amber-400 px-6 py-5 text-center text-slate-950 shadow-2xl shadow-amber-500/30">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-amber-700">
                <Volume2 className="h-7 w-7 animate-pulse" />
              </div>
              <p className="text-lg font-black">تنبيه جديد</p>
              <p className="mt-2 text-3xl font-black sm:text-4xl">
                الآن الدور رقم {currentTurn.ticket_number ?? "—"}
              </p>
              <p className="mt-2 text-sm font-bold text-slate-800">
                يرجى توجه صاحب هذا الرقم إلى مكان الخدمة فوراً
              </p>
            </div>
          </section>
        ) : null}

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div
            className={`rounded-[2.5rem] p-6 text-center text-slate-950 shadow-xl sm:p-10 ${
              highlightTurn
                ? "animate-pulse bg-amber-300 shadow-amber-500/30 ring-4 ring-amber-200"
                : "bg-amber-400 shadow-amber-500/20"
            }`}
          >
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white text-amber-700 shadow-lg">
              <MonitorPlay className="h-10 w-10" />
            </div>

            <p className="text-lg font-black">الدور الحالي</p>
            <div className="mt-5 rounded-[2rem] bg-white px-6 py-8 shadow-lg">
              <p className="text-sm font-bold text-slate-500">رقم التذكرة</p>
              <p
                className={`mt-3 font-black tracking-tight sm:text-9xl ${
                  highlightTurn ? "text-8xl text-teal-800" : "text-7xl"
                }`}
              >
                {currentTurn?.ticket_number ?? "—"}
              </p>
            </div>

            <p className="mt-5 text-base font-black text-slate-900 sm:text-xl">
              {currentTurn
                ? "يرجى توجه صاحب هذا الرقم إلى مكان الخدمة"
                : "لم يتم استدعاء أي دور بعد"}
            </p>
          </div>

          <div className="rounded-[2.5rem] border border-teal-100 bg-white p-6 shadow-sm shadow-teal-900/5 sm:p-8">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black">الأدوار القادمة</h2>
                <p className="mt-1 text-sm text-slate-500">
                  أول الأدوار المنتظرة حالياً في الطابور.
                </p>
              </div>
              <Ticket className="h-8 w-8 text-teal-700" />
            </div>

            {upcomingTurns.length > 0 ? (
              <div className="space-y-3">
                {upcomingTurns.map((ticketItem, index) => (
                  <div
                    key={ticketItem.id}
                    className={`flex items-center justify-between rounded-[1.7rem] px-5 py-4 ${
                      index === 0
                        ? "bg-teal-700 text-white"
                        : "bg-slate-50 text-slate-950"
                    }`}
                  >
                    <div>
                      <p
                        className={`text-sm font-bold ${
                          index === 0 ? "text-teal-50/85" : "text-slate-500"
                        }`}
                      >
                        {index === 0 ? "التالي مباشرة" : `بعد ${index} دور`}
                      </p>
                      <p className="mt-1 text-3xl font-black">
                        {ticketItem.ticket_number ?? "—"}
                      </p>
                    </div>

                    <div
                      className={`rounded-full px-4 py-2 text-sm font-black ${
                        index === 0
                          ? "bg-white text-teal-800"
                          : "bg-white text-slate-700 ring-1 ring-slate-200"
                      }`}
                    >
                      انتظار
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[1.7rem] bg-slate-50 px-5 py-10 text-center">
                <p className="text-xl font-black">لا توجد أدوار منتظرة الآن</p>
                <p className="mt-2 text-sm text-slate-500">
                  ستظهر الأدوار القادمة هنا فور تسجيل الزبائن.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}