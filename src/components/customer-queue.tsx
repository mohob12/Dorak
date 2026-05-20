"use client";

import {
  Bell,
  Clock,
  RotateCcw,
  Sparkles,
  TicketCheck,
  UsersRound,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { TurnAlert } from "@/components/turn-alert";
import { supabase } from "@/integrations/supabase/client";
import {
  createTicket,
  ensureShop,
  formatWaitTime,
  getTicket,
  getWaitingTickets,
  type Shop,
  type Ticket,
  type TicketStatus,
} from "@/lib/queue";

type CustomerQueueProps = {
  shopId: string;
};

const playNearTurnSound = () => {
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

  const notes = [880, 880];

  notes.forEach((frequency, index) => {
    const delay = index * 0.3;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(0.0001, audioContext.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(
      0.08,
      audioContext.currentTime + delay + 0.02
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + delay + 0.18
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(audioContext.currentTime + delay);
    oscillator.stop(audioContext.currentTime + delay + 0.2);
  });

  window.setTimeout(() => {
    void audioContext.close();
  }, 800);
};

const playNearTurnVibration = () => {
  navigator.vibrate?.([120, 80, 120]);
  window.setTimeout(() => {
    navigator.vibrate?.([120, 80, 120]);
  }, 300);
};

export function CustomerQueue({ shopId }: CustomerQueueProps) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [waitingTickets, setWaitingTickets] = useState<Ticket[]>([]);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [showTurnAlert, setShowTurnAlert] = useState(false);
  const [hasMissedTurn, setHasMissedTurn] = useState(false);
  const [showNearTurnAlert, setShowNearTurnAlert] = useState(false);
  const previousTicketStatus = useRef<TicketStatus | null>(null);
  const previousPosition = useRef<number | null>(null);
  const nearTurnToastShown = useRef(false);

  const storageKey = `dorak-ticket-${shopId}`;

  const loadQueue = useCallback(async () => {
    const loadedShop = await ensureShop(shopId);
    const tickets = await getWaitingTickets(loadedShop.id);
    const storedTicketId = window.localStorage.getItem(storageKey);

    setShop(loadedShop);
    setWaitingTickets(tickets);

    if (storedTicketId) {
      const ticket = await getTicket(storedTicketId);
      setCurrentTicket(ticket);
    }
  }, [shopId, storageKey]);

  useEffect(() => {
    loadQueue().catch((error) => {
      toast.error(error instanceof Error ? error.message : "تعذر تحميل الطابور");
    });

    const channel = supabase
      .channel(`customer-queue-${shopId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tickets",
          filter: `shop_id=eq.${shopId}`,
        },
        () => {
          loadQueue().catch((error) => {
            toast.error(
              error instanceof Error ? error.message : "تعذر تحديث الطابور"
            );
          });
        }
      )
      .subscribe();

    const refreshTimer = window.setInterval(() => {
      loadQueue().catch((error) => {
        toast.error(error instanceof Error ? error.message : "تعذر تحديث الطابور");
      });
    }, 12000);

    return () => {
      window.clearInterval(refreshTimer);
      supabase.removeChannel(channel);
    };
  }, [loadQueue, shopId]);

  useEffect(() => {
    if (
      currentTicket?.status === "served" &&
      previousTicketStatus.current === "waiting"
    ) {
      setShowTurnAlert(true);
      toast.success("حان دورك الآن! توجه إلى مكان الخدمة", {
        duration: 9000,
      });
    }

    previousTicketStatus.current = currentTicket?.status || null;
  }, [currentTicket?.status]);

  useEffect(() => {
    if (currentTicket?.status !== "served" || !currentTicket.served_at) {
      setHasMissedTurn(false);
      return;
    }

    const servedAtTime = new Date(currentTicket.served_at).getTime();
    const twoMinutesLater = servedAtTime + 2 * 60 * 1000;
    const remainingTime = twoMinutesLater - Date.now();

    if (remainingTime <= 0) {
      setHasMissedTurn(true);
      return;
    }

    setHasMissedTurn(false);

    const timer = window.setTimeout(() => {
      setHasMissedTurn(true);
    }, remainingTime);

    return () => {
      window.clearTimeout(timer);
    };
  }, [currentTicket?.served_at, currentTicket?.status]);

  const ticketPosition = useMemo(() => {
    if (!currentTicket || currentTicket.status !== "waiting") {
      return 0;
    }

    const index = waitingTickets.findIndex(
      (ticket) => ticket.id === currentTicket.id
    );

    return index >= 0 ? index : 0;
  }, [currentTicket, waitingTickets]);

  const estimatedWaitMinutes = useMemo(() => {
    return ticketPosition * (shop?.avg_service_minutes || 4);
  }, [shop?.avg_service_minutes, ticketPosition]);

  const shouldShowNearTurnAlert = estimatedWaitMinutes <= 5 && estimatedWaitMinutes > 0;

  useEffect(() => {
    if (!currentTicket || currentTicket.status !== "waiting") {
      previousPosition.current = null;
      nearTurnToastShown.current = false;
      setShowNearTurnAlert(false);
      return;
    }

    if (shouldShowNearTurnAlert) {
      setShowNearTurnAlert(true);

      if (!nearTurnToastShown.current) {
        playNearTurnVibration();
        playNearTurnSound();

        toast("اقترب دورك", {
          description: "بقي تقريباً 5 دقائق أو أقل على دورك. يرجى الاستعداد.",
          duration: 7000,
        });
        nearTurnToastShown.current = true;
      }
    } else {
      setShowNearTurnAlert(false);
      nearTurnToastShown.current = false;
    }

    if (
      previousPosition.current !== null &&
      ticketPosition <= 1 &&
      previousPosition.current > 1
    ) {
      playNearTurnVibration();
      playNearTurnSound();

      toast("اقترب دورك", {
        description: "بقي أمامك شخص واحد أو أقل، يرجى الاستعداد.",
        duration: 7000,
      });
    }

    previousPosition.current = ticketPosition;
  }, [currentTicket, shouldShowNearTurnAlert, ticketPosition]);

  const estimatedWait = formatWaitTime(
    ticketPosition * (shop?.avg_service_minutes || 4)
  );

  const displayTicketNumber = currentTicket?.ticket_number ?? "—";
  const isServed = currentTicket?.status === "served";

  const bookTicket = async () => {
    const trimmedName = customerName.trim();

    if (!trimmedName) {
      toast.error("يرجى إدخال الاسم أولاً");
      return;
    }

    setIsBooking(true);

    try {
      const ticket = await createTicket(shopId, trimmedName);

      window.localStorage.setItem(storageKey, ticket.id);
      previousTicketStatus.current = ticket.status;
      previousPosition.current = null;
      setCurrentTicket(ticket);
      setCustomerName("");
      setShowTurnAlert(false);
      setHasMissedTurn(false);
      setShowNearTurnAlert(false);
      nearTurnToastShown.current = false;
      toast.success(`تم حجز دور ${trimmedName} بنجاح: رقم ${ticket.ticket_number ?? "—"}`);
      await loadQueue();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر حجز الدور");
    } finally {
      setIsBooking(false);
    }
  };

  const handleBookAgain = () => {
    window.localStorage.removeItem(storageKey);
    setCurrentTicket(null);
    setShowTurnAlert(false);
    setHasMissedTurn(false);
    setShowNearTurnAlert(false);
    previousTicketStatus.current = null;
    previousPosition.current = null;
    nearTurnToastShown.current = false;
    toast.success("يمكنك الآن حجز دور جديد");
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f6fbf8] px-4 py-5 text-slate-950 sm:px-6"
    >
      <div className="mx-auto flex max-w-md flex-col gap-5">
        <header className="rounded-[2rem] bg-teal-700 p-6 text-white shadow-xl shadow-teal-900/15">
          <div className="mb-10 flex items-center justify-between">
            <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
              Dorak | دورك
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>

          <p className="text-sm text-teal-50/80">إدارة الطوابير الرقمية</p>
          <h1 className="mt-2 text-3xl font-black leading-tight">
            احجز دورك بدون انتظار عند الباب
          </h1>
          <p className="mt-3 text-sm leading-7 text-teal-50/85">
            اضغط الزر واحصل على رقمك فوراً، وسنخبرك بعدد الأشخاص قبلك والوقت
            المتوقع.
          </p>
        </header>

        {showTurnAlert && isServed && currentTicket?.ticket_number !== null ? (
          <TurnAlert ticketNumber={currentTicket.ticket_number} />
        ) : null}

        {showNearTurnAlert && currentTicket && !isServed ? (
          <section className="relative overflow-hidden rounded-[2rem] border border-amber-300 bg-[#fff7df] p-5 shadow-[0_18px_50px_rgba(245,158,11,0.18)]">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-amber-200/80 blur-2xl" />
            <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-teal-200/50 blur-3xl" />

            <div className="relative flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 ring-4 ring-white/60">
                <Bell className="h-7 w-7 animate-pulse" />
              </div>

              <div className="flex-1">
                <div className="inline-flex rounded-full bg-teal-700 px-3 py-1 text-xs font-black text-white shadow-sm">
                  اقترب دورك
                </div>
                <h3 className="mt-3 text-2xl font-black leading-tight text-slate-950">
                  اقترب دورك
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  بقي تقريباً {estimatedWait} على دورك. يرجى الاستعداد والاقتراب من مكان الخدمة.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-700 ring-1 ring-amber-100">
                    انتظار مباشر
                  </span>
                  <span className="rounded-full bg-teal-50 px-3 py-2 text-xs font-bold text-teal-800 ring-1 ring-teal-100">
                    تحديث فوري
                  </span>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {currentTicket && !isServed ? (
          <div className="rounded-[1.7rem] border border-teal-100 bg-white px-5 py-4 shadow-sm shadow-teal-900/5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-800">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <p className="font-black text-slate-950">التحديث مباشر</p>
                <p className="text-sm text-slate-500">
                  سننبهك عندما يقترب دورك، ثم تظهر شاشة تنبيه كاملة عند حلول الدور.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <section className="rounded-[2rem] border border-teal-100 bg-white p-5 shadow-sm shadow-teal-900/5">
          {!currentTicket ? (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-amber-100 text-amber-700">
                <TicketCheck className="h-9 w-9" />
              </div>
              <h2 className="text-2xl font-black">جاهز تحجز دورك؟</h2>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-7 text-slate-500">
                اكتب اسمك لحجز دورك في قائمة الإنتظار
              </p>

              <div className="mt-5 text-right">
                <label className="mb-2 block text-sm font-black text-slate-700">
                  الاسم
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="مثال: محمد"
                  className="w-full rounded-2xl border border-teal-100 bg-slate-50 px-4 py-4 text-right font-bold text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white"
                />
              </div>

              <button
                type="button"
                onClick={bookTicket}
                disabled={isBooking}
                className="mt-6 w-full rounded-3xl bg-amber-500 px-5 py-4 text-lg font-black text-slate-950 shadow-lg shadow-amber-500/25 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isBooking ? "جاري الحجز..." : "احجز دوري"}
              </button>
            </div>
          ) : (
            <div>
              <div
                className={`rounded-[1.7rem] p-5 text-center ${
                  hasMissedTurn
                    ? "bg-red-100 text-red-800"
                    : isServed
                      ? "bg-emerald-100 text-emerald-900"
                      : "bg-amber-100 text-amber-950"
                }`}
              >
                <p className="text-sm font-bold">
                  {hasMissedTurn
                    ? "تم اجتياز دورك"
                    : isServed
                      ? "حان دورك الآن"
                      : "رقم تذكرتك"}
                </p>
                <p className="mt-2 text-6xl font-black tracking-tight">
                  {displayTicketNumber}
                </p>
              </div>

              {hasMissedTurn ? (
                <p className="mt-4 rounded-2xl bg-red-50 px-4 py-4 text-center text-lg font-black leading-7 text-red-700">
                  تم اجتياز دورك
                </p>
              ) : null}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-[1.5rem] bg-slate-50 p-4">
                  <UsersRound className="mb-3 h-5 w-5 text-teal-700" />
                  <p className="text-xs font-bold text-slate-500">
                    الأشخاص قبلك
                  </p>
                  <p className="mt-1 text-3xl font-black">
                    {isServed ? 0 : ticketPosition}
                  </p>
                </div>

                <div className="rounded-[1.5rem] bg-slate-50 p-4">
                  <Clock className="mb-3 h-5 w-5 text-teal-700" />
                  <p className="text-xs font-bold text-slate-500">
                    الانتظار المتوقع
                  </p>
                  <p className="mt-1 text-xl font-black">
                    {isServed ? "الآن" : estimatedWait}
                  </p>
                </div>
              </div>

              <p className="mt-4 rounded-2xl bg-teal-50 px-4 py-3 text-center text-sm leading-6 text-teal-800">
                {hasMissedTurn
                  ? "مرّ أكثر من دقيقتين على دورك. يمكنك التسجيل مرة ثانية إذا أردت."
                  : isServed
                    ? "تم اجتياز دورك، ويمكنك الآن التسجيل مرة ثانية في الطابور إذا أردت."
                    : ticketPosition <= 1
                      ? "دورك قريب جداً، يرجى الاستعداد."
                      : "هذه الصفحة تتحدث تلقائياً عند تغيّر الطابور."}
              </p>

              {isServed ? (
                <button
                  type="button"
                  onClick={handleBookAgain}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-amber-500 px-5 py-4 text-lg font-black text-slate-950 shadow-lg shadow-amber-500/25 transition hover:bg-amber-400"
                >
                  <RotateCcw className="h-5 w-5" />
                  التسجيل مرة ثانية
                </button>
              ) : null}
            </div>
          )}
        </section>

        <p className="text-center text-xs text-slate-400">
          By Daorak : {shop?.id || shopId}
        </p>
      </div>
    </main>
  );
}