"use client";

import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Home,
  LogOut,
  Sparkles,
  Store,
  Ticket,
  UsersRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ShopQrCard } from "@/components/shop-qr-card";
import { TicketPrintCard } from "@/components/ticket-print-card";
import { useSession } from "@/hooks/use-session";
import {
  ensureOwnerProfile,
  updateOwnerShopId,
  type OwnerProfile,
} from "@/lib/owner-profile";
import {
  DEFAULT_SHOP_ID,
  cleanShopId,
  ensureShop,
  getWaitingTickets,
  serveNextTicket,
  type Shop,
  type Ticket as QueueTicket,
} from "@/lib/queue";
import {
  SUBSCRIPTION_PLANS,
  getTrialDaysLeft,
  isTrialEndingSoon,
  isTrialExpired,
} from "@/lib/subscription-plans";
import { supabase } from "@/integrations/supabase/client";

export function DashboardQueue() {
  const navigate = useNavigate();
  const { user, loading, signOut } = useSession();
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [shopIdInput, setShopIdInput] = useState(DEFAULT_SHOP_ID);
  const [activeShopId, setActiveShopId] = useState(DEFAULT_SHOP_ID);
  const [shop, setShop] = useState<Shop | null>(null);
  const [waitingTickets, setWaitingTickets] = useState<QueueTicket[]>([]);
  const [isServing, setIsServing] = useState(false);
  const [isPreparingDashboard, setIsPreparingDashboard] = useState(true);

  const activePlan = useMemo(() => {
    return SUBSCRIPTION_PLANS.find(
      (plan) => plan.id === profile?.subscription_plan
    );
  }, [profile?.subscription_plan]);

  const plansPageLink = "/pricing";
  const upgradePlanLabel =
    profile?.subscription_plan === "trial" ? "الترقية الآن" : "عرض الباقة المدفوعة";

  const trialDaysLeft = useMemo(() => {
    return getTrialDaysLeft(profile?.trial_ends_at || null);
  }, [profile?.trial_ends_at]);

  const trialExpired =
    profile?.subscription_plan === "trial" &&
    isTrialExpired(profile?.trial_ends_at || null);

  const trialEndingSoon =
    profile?.subscription_plan === "trial" &&
    isTrialEndingSoon(profile?.trial_ends_at || null);

  const loadQueue = async (shopId: string, ownerId: string) => {
    const loadedShop = await ensureShop(shopId, ownerId);
    const tickets = await getWaitingTickets(loadedShop.id);

    setShop(loadedShop);
    setWaitingTickets(tickets);
  };

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }

    ensureOwnerProfile(user.id, user.email)
      .then((ownerProfile) => {
        setProfile(ownerProfile);
        setShopIdInput(ownerProfile.shop_id);
        setActiveShopId(ownerProfile.shop_id);

        if (
          ownerProfile.subscription_plan === "trial" &&
          isTrialExpired(ownerProfile.trial_ends_at)
        ) {
          setIsPreparingDashboard(false);
          return;
        }

        return loadQueue(ownerProfile.shop_id, user.id).then(() =>
          setIsPreparingDashboard(false)
        );
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "تعذر فتح اللوحة");
        setIsPreparingDashboard(false);
      });
  }, [loading, navigate, user]);

  useEffect(() => {
    if (trialEndingSoon) {
      toast("تنبيه الباقة التجريبية", {
        description:
          "اقترب انتهاء 3 أيام المجانية. قم بالترقية إلى الباقة الشهرية للاستمرار.",
        duration: 9000,
      });
    }
  }, [trialEndingSoon]);

  useEffect(() => {
    if (!user || !activeShopId || trialExpired) {
      return;
    }

    const channel = supabase
      .channel(`dashboard-queue-${activeShopId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tickets",
          filter: `shop_id=eq.${activeShopId}`,
        },
        () => {
          loadQueue(activeShopId, user.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeShopId, trialExpired, user]);

  const applyShopId = async () => {
    if (!user || trialExpired) {
      return;
    }

    const normalizedShopId = cleanShopId(shopIdInput) || DEFAULT_SHOP_ID;
    const updatedProfile = await updateOwnerShopId(user.id, normalizedShopId);

    setProfile(updatedProfile);
    setShopIdInput(normalizedShopId);
    setActiveShopId(normalizedShopId);
    await loadQueue(normalizedShopId, user.id);
    toast.success("تم تحديث القائمة");
  };

  const serveNext = async () => {
    if (trialExpired) {
      return;
    }

    setIsServing(true);
    const servedTicket = await serveNextTicket(activeShopId);

    if (servedTicket) {
      toast.success(`تم تمرير التذكرة رقم ${servedTicket.ticket_number ?? "—"}`);
    } else {
      toast.info("لا يوجد زبائن في الطابور حالياً");
    }

    if (user) {
      await loadQueue(activeShopId, user.id);
    }

    setIsServing(false);
  };

  const logout = async () => {
    await signOut();
    toast.success("تم تسجيل الخروج");
    navigate("/auth", { replace: true });
  };

  const nextTicket = waitingTickets[0];
  const nextTicketNumber = nextTicket?.ticket_number ?? "—";

  if (loading || isPreparingDashboard) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6fbf8] px-4 text-slate-950">
        <div className="rounded-[2rem] border border-teal-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-teal-100 text-teal-700">
            <Sparkles className="h-7 w-7" />
          </div>
          <p className="text-xl font-black">جاري تجهيز لوحة التحكم...</p>
          <p className="mt-2 text-sm text-slate-500">
            سننقلك للوحة متجرك الخاصة خلال لحظات.
          </p>
        </div>
      </main>
    );
  }

  if (trialExpired) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#f6fbf8] px-4 py-6 text-slate-950 sm:px-6"
      >
        <div className="mx-auto max-w-2xl">
          <section className="rounded-[2.4rem] border border-amber-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-100 text-amber-700">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-black">انتهت المهلة المجانية</h1>
            <p className="mt-3 text-sm leading-8 text-slate-600">
              انتهت مدة التجربة المجانية الخاصة بحسابك. للمتابعة في استخدام
              المنصة يجب الترقية إلى الخطة الشهرية المدفوعة.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to={plansPageLink}
                className="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-6 py-4 font-black text-slate-950 transition hover:bg-amber-400"
              >
                عرض الباقة المدفوعة
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-6 py-4 font-black text-slate-800 transition hover:bg-slate-200"
              >
                تسجيل الخروج
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f6fbf8] px-4 py-5 text-slate-950 sm:px-6"
    >
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1fr_360px]">
        <section className="flex flex-col gap-5">
          <header className="rounded-[2rem] bg-teal-700 p-6 text-white shadow-xl shadow-teal-900/15">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-teal-50/80">Dorak | دورك</p>
                <h1 className="mt-1 text-3xl font-black">
                  لوحة التحكم الخاصة بك
                </h1>
                <p className="mt-2 text-sm text-teal-50/75">
                  الحساب: {user?.email}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white/12 px-4 py-3 text-sm font-black text-white ring-1 ring-white/15 transition hover:bg-white/18"
                >
                  <Home className="h-4 w-4" />
                  الصفحة الرئيسية
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-teal-800 transition hover:bg-teal-50"
                >
                  <LogOut className="h-4 w-4" />
                  خروج
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                value={shopIdInput}
                onChange={(event) => setShopIdInput(event.target.value)}
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-right text-sm font-bold text-white outline-none placeholder:text-white/60 focus:border-white/50"
                placeholder="معرف المتجر"
              />
              <button
                type="button"
                onClick={applyShopId}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-teal-800 transition hover:bg-teal-50"
              >
                تحديث القائمة
              </button>
            </div>
          </header>

          {trialEndingSoon ? (
            <section className="rounded-[1.7rem] border border-amber-200 bg-amber-50 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-200 text-amber-800">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-amber-900">
                    تنبيه: المهلة المجانية قاربت على الانتهاء
                  </p>
                  <p className="mt-1 text-sm leading-7 text-amber-900/80">
                    متبقّي تقريباً {trialDaysLeft} يوم. راجع الباقة المدفوعة
                    للاستمرار دون توقف.
                  </p>
                  <Link
                    to={plansPageLink}
                    className="mt-3 inline-flex rounded-2xl bg-amber-500 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-400"
                  >
                    الترقية الآن
                  </Link>
                </div>
              </div>
            </section>
          ) : null}

          <section className="rounded-[1.7rem] border border-amber-100 bg-amber-50 p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-amber-700">باقتك الحالية</p>
                <h2 className="mt-1 text-2xl font-black">
                  {activePlan?.name || "تجربة مجانية"}
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {profile?.subscription_plan === "trial"
                    ? `متبقي تقريباً ${trialDaysLeft} يوم من التجربة المجانية.`
                    : "اشتراكك الشهري مفعل للوحة التحكم الخاصة بك."}
                </p>
              </div>
              <Link
                to={plansPageLink}
                className="rounded-2xl bg-amber-500 px-5 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-amber-400"
              >
                {upgradePlanLabel}
              </Link>
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.6rem] border border-teal-100 bg-white p-5 shadow-sm">
              <UsersRound className="mb-4 h-6 w-6 text-teal-700" />
              <p className="text-sm font-bold text-slate-500">في الانتظار</p>
              <p className="mt-2 text-4xl font-black">
                {waitingTickets.length}
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-amber-100 bg-amber-50 p-5 shadow-sm">
              <Ticket className="mb-4 h-6 w-6 text-amber-700" />
              <p className="text-sm font-bold text-slate-500">الدور الحالي</p>
              <p className="mt-2 text-4xl font-black">{nextTicketNumber}</p>
            </div>

            <button
              type="button"
              onClick={serveNext}
              disabled={isServing || waitingTickets.length === 0}
              className="group rounded-[1.6rem] bg-amber-500 p-5 text-right text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CheckCircle2 className="mb-4 h-6 w-6" />
              <p className="text-sm font-bold">الإجراء</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-2xl font-black">
                  {isServing ? "جاري..." : "التالي"}
                </span>
                <ArrowLeft className="h-5 w-5 transition group-hover:-translate-x-1" />
              </div>
            </button>
          </section>

          <section className="rounded-[2rem] border border-teal-100 bg-white p-5 shadow-sm shadow-teal-900/5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black">قائمة الطابور</h2>
                <p className="mt-1 text-sm text-slate-500">
                  يتم التحديث تلقائياً عند حجز أو تمرير أي دور.
                </p>
              </div>
              <Store className="h-7 w-7 text-teal-700" />
            </div>

            {waitingTickets.length > 0 ? (
              <div className="space-y-3">
                {waitingTickets.map((ticketItem, index) => (
                  <div
                    key={ticketItem.id}
                    className="rounded-[1.4rem] border border-slate-100 bg-slate-50 px-4 py-4"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-2xl font-black ${
                            index === 0
                              ? "bg-amber-500 text-slate-950"
                              : "bg-white text-teal-700"
                          }`}
                        >
                          {ticketItem.ticket_number ?? "—"}
                        </div>
                        <div>
                          <p className="font-black">
                            {ticketItem.customer_name ||
                              `تذكرة رقم ${ticketItem.ticket_number ?? "—"}`}
                          </p>
                          <p className="text-xs text-slate-500">
                            {index === 0 ? "الدور التالي" : `${index} قبله`}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <span className="inline-flex w-fit rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800">
                          ينتظر
                        </span>
                        <TicketPrintCard
                          shopId={activeShopId}
                          ticket={ticketItem}
                          peopleAhead={index}
                          avgServiceMinutes={shop?.avg_service_minutes || 4}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[1.5rem] bg-slate-50 px-5 py-10 text-center">
                <p className="text-lg font-black">الطابور فارغ الآن</p>
                <p className="mt-2 text-sm text-slate-500">
                  شارك رمز QR ليبدأ الزبائن بحجز أدوارهم.
                </p>
              </div>
            )}
          </section>
        </section>

        <aside className="lg:sticky lg:top-5 lg:self-start">
          <ShopQrCard shopId={shop?.id || activeShopId} />
        </aside>
      </div>
    </main>
  );
}