"use client";

import {
  BarChart3,
  LockKeyhole,
  LogOut,
  Mail,
  RefreshCw,
  ShieldCheck,
  Store,
  Ticket,
  UsersRound,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAIL = "067mohammed.dz@gmail.com";

type AdminStats = {
  owners: number;
  shops: number;
  tickets: number;
  waitingTickets: number;
  servedTickets: number;
  trialOwners: number;
  monthlyOwners: number;
};

type AdminProfile = {
  id: string;
  business_name: string | null;
  shop_id: string;
  subscription_plan: string;
  subscription_status: string;
  trial_ends_at: string | null;
  created_at: string;
};

type AdminShop = {
  id: string;
  name: string;
  avg_service_minutes: number;
  owner_id: string | null;
  created_at: string;
};

type AdminTicket = {
  id: string;
  shop_id: string;
  ticket_number: number;
  status: string;
  created_at: string;
  served_at: string | null;
};

type AdminOverview = {
  stats: AdminStats;
  profiles: AdminProfile[];
  shops: AdminShop[];
  tickets: AdminTicket[];
};

export function AdminDashboard() {
  const { user, loading, signOut } = useSession();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isLoadingOverview, setIsLoadingOverview] = useState(false);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const statCards = useMemo(() => {
    if (!overview) {
      return [];
    }

    return [
      {
        label: "أصحاب العمل",
        value: overview.stats.owners,
        icon: UsersRound,
        color: "bg-teal-100 text-teal-800",
      },
      {
        label: "المتاجر",
        value: overview.stats.shops,
        icon: Store,
        color: "bg-emerald-100 text-emerald-800",
      },
      {
        label: "كل التذاكر",
        value: overview.stats.tickets,
        icon: Ticket,
        color: "bg-amber-100 text-amber-800",
      },
      {
        label: "ينتظرون الآن",
        value: overview.stats.waitingTickets,
        icon: BarChart3,
        color: "bg-sky-100 text-sky-800",
      },
    ];
  }, [overview]);

  const loadOverview = async () => {
    setIsLoadingOverview(true);

    const { data, error } = await supabase.functions.invoke("admin-overview");

    if (error) {
      toast.error(error.message);
      setIsLoadingOverview(false);
      return;
    }

    setOverview(data as AdminOverview);
    setIsLoadingOverview(false);
  };

  useEffect(() => {
    if (isAdmin) {
      loadOverview();
    }
  }, [isAdmin]);

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSigningIn(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setIsSigningIn(false);
      return;
    }

    toast.success("تم الدخول إلى لوحة إدارة التطبيق");
    setIsSigningIn(false);
  };

  const logout = async () => {
    await signOut();
    setOverview(null);
    toast.success("تم تسجيل الخروج");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6fbf8] px-4">
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
          <p className="text-xl font-black">جاري التحقق...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#f6fbf8] px-4 py-8 text-slate-950 sm:px-6"
      >
        <section className="mx-auto max-w-md rounded-[2.4rem] border border-teal-100 bg-white p-6 shadow-xl shadow-teal-900/10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-teal-100 text-teal-800">
            <ShieldCheck className="h-8 w-8" />
          </div>

          <h1 className="text-center text-3xl font-black">
            لوحة إدارة التطبيق
          </h1>
          <p className="mt-2 text-center text-sm leading-7 text-slate-500">
            هذه الصفحة خاصة بمالك التطبيق فقط، ولا تظهر لأصحاب العمل.
          </p>

          <form onSubmit={submitLogin} className="mt-6 space-y-3">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">
                البريد الإلكتروني
              </span>
              <div className="flex items-center gap-2 rounded-2xl border border-teal-100 bg-white px-4 py-3 focus-within:border-teal-400">
                <Mail className="h-5 w-5 text-teal-700" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full bg-transparent text-right outline-none"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">
                كلمة المرور
              </span>
              <div className="flex items-center gap-2 rounded-2xl border border-teal-100 bg-white px-4 py-3 focus-within:border-teal-400">
                <LockKeyhole className="h-5 w-5 text-teal-700" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="w-full bg-transparent text-right outline-none"
                  placeholder="كلمة المرور"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={isSigningIn}
              className="w-full rounded-3xl bg-teal-700 px-5 py-4 text-lg font-black text-white shadow-lg shadow-teal-700/20 transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSigningIn ? "جاري الدخول..." : "دخول"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6fbf8] px-4 text-slate-950">
        <section className="max-w-md rounded-[2rem] border border-red-100 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-red-100 text-red-700">
            <LockKeyhole className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black">غير مسموح بالدخول</h1>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            هذه اللوحة مخصصة لبريد مالك التطبيق فقط.
          </p>
          <button
            type="button"
            onClick={logout}
            className="mt-5 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700"
          >
            خروج
          </button>
        </section>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f6fbf8] px-4 py-6 text-slate-950 sm:px-6"
    >
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="rounded-[2.4rem] bg-teal-700 p-6 text-white shadow-xl shadow-teal-900/15">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-teal-50/80">Dorak Admin</p>
              <h1 className="mt-1 text-3xl font-black">
                لوحة إدارة التطبيق
              </h1>
              <p className="mt-2 text-sm text-teal-50/80">
                دخول خاص: {user.email}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={loadOverview}
                disabled={isLoadingOverview}
                className="inline-flex items-center gap-2 rounded-2xl bg-white/12 px-4 py-3 text-sm font-black text-white ring-1 ring-white/15 transition hover:bg-white/18 disabled:opacity-60"
              >
                <RefreshCw className="h-4 w-4" />
                تحديث
              </button>
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
        </header>

        {isLoadingOverview && !overview ? (
          <section className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
            <p className="text-xl font-black">جاري تحميل بيانات التطبيق...</p>
          </section>
        ) : null}

        {overview ? (
          <>
            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {statCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.label}
                    className="rounded-[1.7rem] border border-teal-100 bg-white p-5 shadow-sm"
                  >
                    <div
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${card.color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-500">
                      {card.label}
                    </p>
                    <p className="mt-2 text-4xl font-black">{card.value}</p>
                  </div>
                );
              })}
            </section>

            <section className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-teal-100 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-black">أصحاب العمل</h2>
                <div className="mt-4 space-y-3">
                  {overview.profiles.map((profile) => (
                    <div
                      key={profile.id}
                      className="rounded-[1.4rem] bg-slate-50 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-black">
                          {profile.business_name || "بدون اسم"}
                        </p>
                        <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-black text-teal-800">
                          {profile.subscription_plan === "monthly"
                            ? "شهري"
                            : "تجربة"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        المتجر: {profile.shop_id}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-teal-100 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-black">المتاجر</h2>
                <div className="mt-4 space-y-3">
                  {overview.shops.map((shop) => (
                    <div
                      key={shop.id}
                      className="rounded-[1.4rem] bg-slate-50 p-4"
                    >
                      <p className="font-black">{shop.name}</p>
                      <p className="mt-2 text-sm text-slate-500">
                        المعرف: {shop.id}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        متوسط الخدمة: {shop.avg_service_minutes} دقائق
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-teal-100 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black">آخر التذاكر</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {overview.tickets.map((ticketItem) => (
                  <div
                    key={ticketItem.id}
                    className="rounded-[1.4rem] bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-2xl font-black">
                        #{ticketItem.ticket_number}
                      </p>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          ticketItem.status === "waiting"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {ticketItem.status === "waiting"
                          ? "ينتظر"
                          : "تمت خدمته"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">
                      المتجر: {ticketItem.shop_id}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}