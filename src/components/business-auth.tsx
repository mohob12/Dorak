"use client";

import {
  BriefcaseBusiness,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { SubscriptionPlans } from "@/components/subscription-plans";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";
import { ensureOwnerProfile, updateOwnerPlan } from "@/lib/owner-profile";
import type { SubscriptionPlanId } from "@/lib/subscription-plans";

const PLAN_STORAGE_KEY = "dorak-selected-owner-plan";

type AuthMode = "sign_in" | "sign_up";
type AuthAction = AuthMode | null;

const isSubscriptionPlan = (value: string | null): value is SubscriptionPlanId =>
  value === "trial" || value === "monthly";

export function BusinessAuth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session, loading, authError } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanId>("trial");
  const [mode, setMode] = useState<AuthMode>("sign_up");
  const [lastAuthAction, setLastAuthAction] = useState<AuthAction>(null);
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPreparingAccount, setIsPreparingAccount] = useState(false);
  const [accountPrepared, setAccountPrepared] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  useEffect(() => {
    const planFromUrl = searchParams.get("plan");
    const storedPlan = window.localStorage.getItem(PLAN_STORAGE_KEY);

    if (isSubscriptionPlan(planFromUrl)) {
      setSelectedPlan(planFromUrl);
      window.localStorage.setItem(PLAN_STORAGE_KEY, planFromUrl);
      return;
    }

    if (isSubscriptionPlan(storedPlan)) {
      setSelectedPlan(storedPlan);
    }
  }, [searchParams]);

  useEffect(() => {
    if (loading || !session?.user || isPreparingAccount || accountPrepared) {
      return;
    }

    if (!lastAuthAction) {
      navigate("/dashboard", { replace: true });
      return;
    }

    setIsPreparingAccount(true);

    ensureOwnerProfile(session.user.id, session.user.email, selectedPlan)
      .then((profile) => {
        if (lastAuthAction === "sign_up") {
          return updateOwnerPlan(session.user.id, selectedPlan);
        }

        return profile;
      })
      .then(() => {
        setAccountPrepared(true);
        toast.success("تم تجهيز لوحة التحكم الخاصة بك");
        navigate("/dashboard", { replace: true });
      })
      .finally(() => setIsPreparingAccount(false));
  }, [
    accountPrepared,
    isPreparingAccount,
    lastAuthAction,
    loading,
    navigate,
    selectedPlan,
    session?.user,
  ]);

  const selectPlan = (plan: SubscriptionPlanId) => {
    setSelectedPlan(plan);
    window.localStorage.setItem(PLAN_STORAGE_KEY, plan);
  };

  const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage(null);
    setLastAuthAction(mode);
    setIsPreparingAccount(true);

    if (mode === "sign_up") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            business_name: businessName || email.split("@")[0],
            subscription_plan: selectedPlan,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast.error(error.message);
        setIsPreparingAccount(false);
        return;
      }

      if (!data.session) {
        setFormMessage(
          "تم إنشاء الحساب. إذا طُلب منك تأكيد البريد، افتح رسالة التأكيد ثم سجّل الدخول."
        );
        toast.success("تم إرسال طلب إنشاء الحساب");
        setMode("sign_in");
        setIsPreparingAccount(false);
        return;
      }

      toast.success("تم إنشاء الحساب بنجاح");
      setIsPreparingAccount(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setIsPreparingAccount(false);
      return;
    }

    toast.success("تم تسجيل الدخول");
    setIsPreparingAccount(false);
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f6fbf8] px-4 py-6 text-slate-950 sm:px-6"
    >
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <section className="rounded-[2.4rem] bg-teal-700 p-6 text-white shadow-xl shadow-teal-900/15 sm:p-8">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <p className="text-sm text-teal-50/80">Dorak | دورك</p>
              <h1 className="mt-2 text-3xl font-black leading-tight sm:text-5xl">
                سجّل متجرك واحصل على لوحة تحكم خاصة
              </h1>
            </div>
            <div className="hidden h-14 w-14 items-center justify-center rounded-3xl bg-white/15 sm:flex">
              <BriefcaseBusiness className="h-7 w-7" />
            </div>
          </div>

          <p className="text-base leading-8 text-teal-50/85">
            اختر الباقة المناسبة، ثم أنشئ حساب صاحب العمل بالبريد وكلمة المرور.
            بعد التسجيل سيتم تجهيز لوحة تحكم خاصة بمتجرك مع رابط QR جاهز.
          </p>

          <div className="mt-8 rounded-[1.7rem] bg-white/12 p-5 ring-1 ring-white/15">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-amber-300" />
              <p className="font-black">حساب آمن وخاص</p>
            </div>
            <p className="mt-2 text-sm leading-7 text-teal-50/80">
              كل صاحب عمل يدخل إلى لوحة متجره فقط، ولوحة إدارة التطبيق لها رابط
              خاص وغير ظاهرة لأصحاب العمل.
            </p>
          </div>

          <Link
            to="/"
            className="mt-6 inline-flex rounded-2xl bg-white/12 px-4 py-3 text-sm font-black text-white ring-1 ring-white/15 transition hover:bg-white/18"
          >
            العودة للصفحة الرئيسية
          </Link>
        </section>

        <section className="space-y-5">
          <div className="rounded-[2rem] border border-teal-100 bg-white/90 p-5 shadow-sm shadow-teal-900/5">
            <div className="mb-4">
              <h2 className="text-2xl font-black">اختر الباقة</h2>
              <p className="mt-1 text-sm text-slate-500">
                الأسعار بالدولار، ويمكنك البدء بالتجربة المجانية لمدة 3 أيام.
              </p>
            </div>

            <SubscriptionPlans
              selectedPlan={selectedPlan}
              onSelectPlan={selectPlan}
            />
          </div>

          <div className="rounded-[2rem] border border-teal-100 bg-white/90 p-5 shadow-sm shadow-teal-900/5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black">
                  {mode === "sign_up" ? "تسجيل صاحب عمل" : "دخول صاحب العمل"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  استخدم بريدك الإلكتروني وكلمة المرور للوصول إلى لوحة التحكم.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMode(mode === "sign_up" ? "sign_in" : "sign_up");
                  setFormMessage(null);
                  setLastAuthAction(null);
                }}
                className="rounded-2xl bg-teal-50 px-4 py-3 text-sm font-black text-teal-800 transition hover:bg-teal-100"
              >
                {mode === "sign_up" ? "لدي حساب بالفعل" : "إنشاء حساب جديد"}
              </button>
            </div>

            {authError ? (
              <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {authError}
              </p>
            ) : null}

            {formMessage ? (
              <p className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
                {formMessage}
              </p>
            ) : null}

            {loading || isPreparingAccount ? (
              <div className="rounded-[1.5rem] bg-teal-50 px-5 py-8 text-center">
                <p className="font-black text-teal-900">
                  جاري تجهيز حسابك...
                </p>
              </div>
            ) : (
              <form onSubmit={submitAuth} className="space-y-3">
                {mode === "sign_up" ? (
                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-slate-700">
                      اسم النشاط التجاري
                    </span>
                    <div className="flex items-center gap-2 rounded-2xl border border-teal-100 bg-white px-4 py-3 focus-within:border-teal-400">
                      <BriefcaseBusiness className="h-5 w-5 text-teal-700" />
                      <input
                        value={businessName}
                        onChange={(event) =>
                          setBusinessName(event.target.value)
                        }
                        className="w-full bg-transparent text-right outline-none placeholder:text-slate-400"
                        placeholder="مثال: صالون محمد"
                      />
                    </div>
                  </label>
                ) : null}

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
                      className="w-full bg-transparent text-right outline-none placeholder:text-slate-400"
                      placeholder="name@example.com"
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
                      minLength={6}
                      className="w-full bg-transparent text-right outline-none placeholder:text-slate-400"
                      placeholder="6 أحرف أو أكثر"
                    />
                  </div>
                </label>

                <button
                  type="submit"
                  className="w-full rounded-3xl bg-amber-500 px-5 py-4 text-lg font-black text-slate-950 shadow-lg shadow-amber-500/25 transition hover:bg-amber-400"
                >
                  {mode === "sign_up" ? "إنشاء الحساب" : "دخول للوحة التحكم"}
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}