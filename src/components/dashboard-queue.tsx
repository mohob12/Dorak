"use client";

import {
  ArrowLeft,
  CheckCircle2,
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
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans";
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

  const trialDaysLeft = useMemo(() => {
    if (!profile?.trial_ends_at) {
      return null;
    }

    const diff = new Date(profile.trial_ends_at).getTime() - Date.now();

    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [profile?.trial_ends_at]);

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
        return loadQueue(ownerProfile.shop_id, user.id);
      })
      .then(() => setIsPreparingDashboard(false));
  }, [loading, navigate, user]);

  useEffect(() => {
    if (!user || !activeShopId) {
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
  }, [activeShopId, user]);

  const applyShopId = async () => {
    if (!user) {
      return;
    }

    const normalizedShopId = cleanShopId(shopIdInput) || DEFAULT_SHOP_ID;
    const updatedProfile = await updateOwnerShopId(user.id, normalizedShopId);

    setProfile(updatedProfile);
    setShopIdInput(normalizedShopId);
    setActiveShopId(normalizedShopId);
    await loadQueue(normalizedShopId, user.id);
    toast.success("تم تحديث متجر لوحة التحكم الخاصة بك");
  };

  const serveNext = async () => {
    setIsServing(true);
    const servedTicket = await serveNextTicket(activeShopId);

    if (servedTicket) {
      toast.success(`تم تمرير التذكرة رقم ${servedTicket.ticket_number}`);
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
              <div className="flex items-center gap-2">
                <Link
                  to="/auth"
                  className="rounded-2xl bg-white/12 px-4 py-3 text-sm font-black text-white ring-1 ring-white/15 transition hover:bg-white/18"
                >
                  الباقات
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
                تحديث المتجر
              </button>
            </div>
          </header>

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
                to="/auth"
                className="rounded-2xl bg-amber-500 px-5 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-amber-400"
              >
                تغيير الباقة
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
              <p className="mt-2 text-4xl font-black">
                {nextTicket?.ticket_number || "—"}
              </p>
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
                    className="flex items-center justify-between rounded-[1.4rem] border border-slate-100 bg-slate-50 px-4 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl font-black ${
                          index === 0
                            ? "bg-amber-500 text-slate-950"
                            : "bg-white text-teal-700"
                        }`}
                      >
                        {ticketItem.ticket_number}
                      </div>
                      <div>
                        <p className="font-black">
                          تذكرة رقم {ticketItem.ticket_number}
                        </p>
                        <p className="text-xs text-slate-500">
                          {index === 0 ? "الدور التالي" : `${index} قبله`}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800">
                      ينتظر
                    </span>
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