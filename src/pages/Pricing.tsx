import {
  CheckCircle2,
  CreditCard,
  Crown,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans";

const WHATSAPP_URL = "https://wa.me/213672786604";

const getPaypalPaymentUrl = (baseUrl: string, planId: string) => {
  const returnUrl = encodeURIComponent(
    `${window.location.origin}/auth?plan=${planId}&paid=success`
  );
  const cancelUrl = encodeURIComponent(`${window.location.origin}/pricing`);

  return `${baseUrl}?return=${returnUrl}&cancel_return=${cancelUrl}`;
};

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
            بعد إتمام الدفع سيتم تحويلك تلقائياً إلى صفحة تسجيل صاحب العمل
            للباقة التي اخترتها.
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
              <p className="font-black">رجوع تلقائي</p>
              <p className="mt-1 text-sm text-teal-50/80">
                ستعود مباشرة لنفس الباقة بعد الدفع
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
            const paymentBaseUrl =
              plan.id === "premium"
                ? "https://www.paypal.com/ncp/payment/FEXVQSYBCUUXS"
                : "https://www.paypal.com/ncp/payment/45DEYVZCEW2AA";
            const paymentUrl = getPaypalPaymentUrl(paymentBaseUrl, plan.id);

            return (
              <section
                key={plan.id}
                className={`relative overflow-hidden rounded-[2.6rem] border bg-white p-6 shadow-sm shadow-teal-900/5 sm:p-8 ${
                  isPremium
                    ? "border-amber-300 bg-[#fff9ec] shadow-[0_24px_80px_rgba(245,158,11,0.18)] ring-1 ring-amber-200"
                    : "border-amber-200"
                }`}
              >
                {isPremium ? (
                  <>
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-200/50 blur-2xl" />
                    <div className="absolute -bottom-12 -left-10 h-44 w-44 rounded-full bg-yellow-200/45 blur-2xl" />
                    <div className="pointer-events-none absolute left-6 top-6 flex flex-col items-start gap-3 text-left sm:left-8 sm:top-8">
                      <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white shadow-lg">
                        <Crown className="h-4 w-4 text-amber-300" />
                        أفضل باقة
                      </div>
                      <div className="flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-white text-amber-700 shadow-lg ring-1 ring-amber-200">
                        <Crown className="h-8 w-8" />
                      </div>
                    </div>
                  </>
                ) : null}

                <div className="relative">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${
                        isPremium
                          ? "bg-amber-200 text-amber-950"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {plan.badge}
                    </div>
                  </div>

                  <h2
                    className={`text-3xl font-black ${
                      isPremium ? "text-slate-950" : ""
                    }`}
                  >
                    {plan.name}
                  </h2>

                  <p
                    className={`mt-3 text-5xl font-black ${
                      isPremium ? "text-amber-700" : "text-teal-800"
                    }`}
                  >
                    {plan.price}
                  </p>

                  <p
                    className={`mt-4 text-sm leading-7 ${
                      isPremium ? "text-slate-700" : "text-slate-600"
                    }`}
                  >
                    {plan.description}
                  </p>

                  {isPremium ? (
                    <div className="mt-6 rounded-[1.8rem] border border-amber-200 bg-white/80 p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                          <Star className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-black text-slate-950">
                            مخصصة للأعمال التي تريد تجربة أقوى
                          </p>
                          <p className="mt-1 text-sm leading-7 text-slate-600">
                            تصميم أقوى، تحكم أكبر، وخصائص أوسع لإدارة الطوابير
                            بشكل أكثر احترافية.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className={`flex items-center gap-2 text-sm font-bold ${
                          isPremium ? "text-slate-800" : "text-slate-700"
                        }`}
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

                  <div
                    className={`mt-8 rounded-[1.8rem] p-5 ${
                      isPremium
                        ? "border border-amber-200 bg-white/85 shadow-sm"
                        : "bg-slate-50"
                    }`}
                  >
                    <p className="text-sm font-black text-slate-800">
                      الدفع لـ {plan.name}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      اضغط على الزر التالي لإتمام الدفع، وسيتم إعادتك تلقائياً
                      إلى صفحة إنشاء الحساب الخاصة بهذه الباقة.
                    </p>

                    <a
                      href={paymentUrl}
                      target="_self"
                      rel="noreferrer"
                      className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 font-black transition ${
                        isPremium
                          ? "bg-slate-950 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800"
                          : "bg-amber-500 text-slate-950 hover:bg-amber-400"
                      }`}
                    >
                      {isPremium ? (
                        <Crown className="h-5 w-5 text-amber-300" />
                      ) : (
                        <CreditCard className="h-5 w-5" />
                      )}
                      إتمام الدفع
                    </a>

                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noreferrer"
                      className={`mt-3 inline-flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-sm font-black text-white shadow-lg transition ${
                        isPremium
                          ? "border border-[#1b7a4d] bg-[#1ea95f] shadow-[#1ea95f]/25 hover:bg-[#189953] hover:shadow-[#189953]/30"
                          : "border-2 border-[#1e8f5a] bg-[#25D366] shadow-[#25D366]/25 hover:bg-[#1fb659] hover:shadow-[#1fb659]/30"
                      }`}
                    >
                      <MessageCircle className="h-5 w-5" />
                      او تواصل معنا لتسجيل الإشتراك
                    </a>
                  </div>
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