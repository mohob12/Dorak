"use client";

import {
  BriefcaseBusiness,
  Eye,
  EyeOff,
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
const PAID_SIGNUP_APPROVED_KEY = "dorak-paid-signup-approved";

type AuthMode = "sign_in" | "sign_up";
type AuthAction = AuthMode | null;

const isSubscriptionPlan = (
  value: string | null
): value is SubscriptionPlanId =>
  value === "trial" || value === "monthly" || value === "premium";

const getAuthMessage = (message: string) => {
  if (message.includes("User already registered")) {
    return "هذا البريد الإلكتروني مسجل بالفعل، استخدم تسجيل الدخول.";
  }

  if (message.includes("Invalid login credentials")) {
    return "هذا الحساب غير موجود أو أن البريد الإلكتروني أو كلمة المرور غير صحيحة.";
  }

  return message;
};

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
  const [showPassword, setShowPassword] = useState(false);
  const [isPreparingAccount, setIsPreparingAccount] = useState(false);
  const [accountPrepared, setAccountPrepared] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const requiresPayment =
    selectedPlan === "monthly" || selectedPlan === "premium";

  const hasPaidSignupApproval =
    typeof window !== "undefined" &&
    window.localStorage.getItem(PAID_SIGNUP_APPROVED_KEY) === "true";

  useEffect(() => {
    const planFromUrl = searchParams.get("plan");
    const storedPlan = window.localStorage.getItem(PLAN_STORAGE_KEY);
    const paidApproved = searchParams.get("paid") === "success";

    if (paidApproved) {
      window.localStorage.setItem(PAID_SIGNUP_APPROVED_KEY, "true");
      setFormMessage(null);
    }

    if (isSubscriptionPlan(planFromUrl)) {
      setSelectedPlan(planFromUrl);
      setMode("sign_up");
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

    ensureOwnerProfile(
      session.user.id,
      session.user.email,
      selectedPlan,
      businessName
    )
      .then((profile) => {
        if (lastAuthAction === "sign_up") {
          return updateOwnerPlan(session.user.id, selectedPlan);
        }

        return profile;
      })
      .then(() => {
        setAccountPrepared(true);
        if (requiresPayment) {
          window.localStorage.removeItem(PAID_SIGNUP_APPROVED_KEY);
        }
        toast.success("تم تجهيز لوحة التحكم الخاصة بك");
        navigate("/dashboard", { replace: true });
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "تعذر تجهيز الحساب");
      })
      .finally(() => setIsPreparingAccount(false));
  }, [
    accountPrepared,
    businessName,
    isPreparingAccount,
    lastAuthAction,
    loading,
    navigate,
    requiresPayment,
    selectedPlan,
    session?.user,
  ]);

  const selectPlan = (plan: SubscriptionPlanId) => {
    setSelectedPlan(plan);
    window.localStorage.setItem(PLAN_STORAGE_KEY, plan);

    if (plan === "trial") {
      window.localStorage.removeItem(PAID_SIGNUP_APPROVED_KEY);
    }
  };

  const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage(null);
    setLastAuthAction(mode);
    setIsPreparingAccount(true);

    if (mode === "sign_up") {
      if (requiresPayment && !hasPaidSignupApproval) {
        setIsPreparingAccount(false);
        toast.error("يجب إتمام الدفع أولاً قبل إنشاء حساب هذه الباقة");
        navigate("/pricing", { replace: false });
        return;
      }

      const trimmedBusinessName = businessName.trim();

      if (!trimmedBusinessName) {
        toast.error("يرجى إدخال اسم النشاط التجاري أولاً");
        setIsPreparingAccount(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            business_name: trimmedBusinessName,
            subscription_plan: selectedPlan,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast.error(getAuthMessage(error.message));
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

      ensureOwnerProfile(
        data.session.user.id,
        data.session.user.email,
        selectedPlan,
        trimmedBusinessName
      )
        .then(() => updateOwnerPlan(data.session.user.id, selectedPlan))
        .then(() => {
          setAccountPrepared(true);
          if (requiresPayment) {
            window.localStorage.removeItem(PAID_SIGNUP_APPROVED_KEY);
          }
          toast.success("تم إنشاء الحساب وتجهيز لوحة التحكم");
          navigate("/dashboard", { replace: true });
        })
        .catch((error) => {
          toast.error(
            error instanceof Error ? error.message : "تعذر إتمام العملية"
          );
        })
        .finally(() => setIsPreparingAccount(false));

      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(getAuthMessage(error.message));
      setIsPreparingAccount(false);
      return;
    }

    if (data.session?.user) {
      ensureOwnerProfile(
        data.session.user.id,
        data.session.user.email,
        selectedPlan,
        businessName
      )
        .then(() => {
          toast.success("تم تسجيل الدخول");
          navigate("/dashboard", { replace: true });
        })
        .catch((error) => {
          toast.error(
            error instanceof Error ? error.message : "تعذر إتمام العملية"
          );
        })
        .finally(() => setIsPreparingAccount(false));

      return;
    }

    setIsPreparingAccount(false);
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f6fbf8] px-4 py-6 text-slate-950 sm:px-6 sm:py-8"
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
            في الباقات المدفوعة يجب إتمام الدفع أولاً قبل السماح بإنشاء الحساب.
          </p>

          <div className="mt-8 rounded-[1.7rem] bg-white/12 p-5 ring-1 ring-white/15">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-amber-300" />
              <p className="font-black">دخول للحسابات الحقيقية فقط</p>
            </div>
            <p className="mt-2 text-sm leading-7 text-teal-50/80">
              تسجيل الدخول مخصص فقط للحسابات الموجودة مسبقاً، أما إنشاء الحساب
              الجديد للباقات المدفوعة فيتطلب الدفع أولاً.
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
                  {mode === "sign_up" ? "إنشاء حساب صاحب عمل" : "تسجيل الدخول"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {mode === "sign_up"
                    ? "أنشئ حساباً جديداً حسب الباقة المختارة."
                    : "الدخول فقط للحسابات المسجلة بالفعل."}
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

            <p className="mb-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold leading-7 text-slate-700">
              ملاحظة: من لا يملك حساباً مسجلاً لا يمكنه الدخول من شاشة تسجيل الدخول.
            </p>

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
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      minLength={6}
                      className="w-full bg-transparent text-right outline-none placeholder:text-slate-400"
                      placeholder="6 أحرف أو أكثر"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-teal-700 transition hover:bg-teal-50"
                      aria-label={
                        showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                      }
                      title={
                        showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </label>

                {mode === "sign_up" && requiresPayment && !hasPaidSignupApproval ? (
                  <Link
                    to="/pricing"
                    className="inline-flex w-full items-center justify-center rounded-3xl bg-amber-500 px-5 py-4 text-lg font-black text-slate-950 shadow-lg shadow-amber-500/25 transition hover:bg-amber-400"
                  >
                    الذهاب إلى الدفع أولاً
                  </Link>
                ) : (
                  <button
                    type="submit"
                    className="w-full rounded-3xl bg-amber-500 px-5 py-4 text-lg font-black text-slate-950 shadow-lg shadow-amber-500/25 transition hover:bg-amber-400"
                  >
                    {mode === "sign_up" ? "إنشاء الحساب" : "دخول للوحة التحكم"}
                  </button>
                )}
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}