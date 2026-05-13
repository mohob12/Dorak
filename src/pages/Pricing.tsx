import { CheckCircle2, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans";

const PAYPAL_MONTHLY_PAYMENT_URL =
  "https://www.paypal.com/ncp/payment/FEXVQSYBCUUXS";
const PAYPAL_PREMIUM_PAYMENT_URL =
  "https://www.paypal.com/ncp/payment/FEXVQSYBCUUXS";

const Pricing = () => {
  const paidPlans = SUBSCRIPTION_PLANS.filter(
    (plan) => plan.id === "monthly" || plan.id === "premium"
  );

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f6fbf8] px-4 py-6 text-slate-950 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <nav className="mb-8 flex items-center justify-between rounded-full border border-teal-100 bg-white/90 px-4 py-3 shadow-sm shadow-teal-900/5">
          <div className="text-xl font-black text-teal-800">Dorak | دورك</div>
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="rounded-full bg-teal-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-800"
            >
              العودة للوحة التحكم
            </Link>
            <Link
              to="/"
              className="rounded-full bg-white px-4 py-2 text-sm font-bold text-teal-800 ring-1 ring-teal-100 transition hover:bg-teal-50"
            >
              الصفحة الرئيسية
            </Link>
          </div>
        </nav>

        <section className="rounded-[2.4rem] bg-teal-700 p-7 text-white shadow-xl shadow-teal-900/15 sm:p-10">
          <div className="mb-6 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
            الدفع للباقات المدفوعة
          </div>

          <h1 className="text-4xl font-black leading-tight sm:text-5xl">
            ادفع أولاً ثم أكمل إنشاء الحساب
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-teal-50/85">
            الباقات المدفوعة في Dorak تتطلب إتمام الدفع أولاً قبل السماح بإنشاء
            حساب جديد. بعد الدفع يمكنك الرجوع لإكمال التسجيل في الباقة التي اخترتها.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] bg-white/12 p-4 ring-1 ring-white/15">
              <Sparkles className="mb-3 h-6 w-6 text-amber-300" />
              <p className="font-black">دفع مباشر</p>
              <p className="mt-1 text-sm text-teal-50/80">
                خطوة سريعة قبل إنشاء الحساب
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-white/12 p-4 ring-1 ring-white/15">
              <ShieldCheck className="mb-3 h-6 w-6 text-amber-300" />
              <p className="font-black">تفعيل منظم</p>
              <p className="mt-1 text-sm text-teal-50/80">
                كل باقة مدفوعة لها مسار واضح
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-white/12 p-4 ring-1 ring-white/15">
              <CreditCard className="mb-3 h-6 w-6 text-amber-300" />
              <p className="font-black">اختيار مرن</p>
              <p className="mt-1 text-sm text-teal-50/80">
                الأساسية أو الذهبية
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          {paidPlans.map((plan) => {
            const isPremium = plan.id === "premium";
            const paymentUrl =
              plan.id === "premium"
                ? PAYPAL_PREMIUM_PAYMENT_URL
                : PAYPAL_MONTHLY_PAYMENT_URL;

            return (
              <section
                key={plan.id}
                className={`rounded-[2.4rem] border bg-white p-6 shadow-sm shadow-teal-900/5 sm:p-8 ${
                  isPremium
                    ? "border-amber-300 bg-[#fff8e8]"
                    : "border-amber-200"
                }`}
              >
                <div
                  className={`mb-4 inline-flex rounded-full px-3 py-1 text-xs font-black ${
                    isPremium
                      ? "bg-amber-200 text-amber-950"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {plan.badge}
                </div>

                <h2 className="text-3xl font-black">{plan.name}</h2>

                <p
                  className={`mt-3 text-5xl font-black ${
                    isPremium ? "text-amber-700" : "text-teal-800"
                  }`}
                >
                  {plan.price}
                </p>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {plan.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm font-bold text-slate-700"
                    >
                      <CheckCircle2
                        className={`h-4 w-4 ${
                          isPremium ? "text-amber-700" : "text-teal-700"
                        }`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 rounded-[1.7rem] bg-slate-50 p-5">
                  <p className="text-sm font-black text-slate-800">
                    الدفع لـ {plan.name}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    اضغط على الزر التالي لإتمام الدفع أولاً، ثم ارجع إلى التطبيق
                    وأنشئ حسابك في هذه الباقة.
                  </p>

                  <a
                    href={paymentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 font-black transition ${
                      isPremium
                        ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                        : "bg-amber-500 text-slate-950 hover:bg-amber-400"
                    }`}
                  >
                    <CreditCard className="h-5 w-5" />
                    إتمام الدفع
                  </a>

                  <Link
                    to="/postal-payment"
                    className="mt-3 inline-flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-[#1f2a7a] bg-[#24348f] px-5 py-4 text-sm font-black text-white shadow-lg shadow-[#24348f]/25 transition hover:bg-[#1d2d7d] hover:shadow-[#1d2d7d]/30"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 shadow-sm">
                      <img
                        src="/algerie-poste-logo.svg"
                        alt="شعار بريد الجزائر"
                        className="h-7 w-7 object-contain"
                      />
                    </span>
                    الدفع عبر بريد الجزائر
                  </Link>
                </div>
              </section>
            );
          })}
        </section>

        <div className="mt-8 p-4 text-center">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            The entirety of this site is protected by copyright © 2026
          </p>
        </div>
      </div>
    </main>
  );
};

export default Pricing;