import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  LayoutDashboard,
  QrCode,
  Smartphone,
} from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { DEFAULT_SHOP_ID } from "@/lib/queue";
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans";

const Index = () => {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef4f8_100%)] px-4 py-6 text-slate-950 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <nav className="mb-8 flex items-center justify-between rounded-full border border-white/70 bg-white/80 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="text-xl font-black tracking-tight text-slate-900">
            Dorak | دورك
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/auth?mode=sign_up&plan=trial"
              className="hidden rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800 sm:inline-flex"
            >
              تسجيل صاحب عمل
            </Link>
            <Link
              to="/auth?mode=sign_in"
              className="rounded-full bg-amber-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-400"
            >
              لوحة التحكم
            </Link>
          </div>
        </nav>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2.6rem] border border-slate-200 bg-slate-950 p-7 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)] sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(45,212,191,0.16),transparent_35%)]" />
            <div className="relative">
              <div className="mb-10 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-amber-200 backdrop-blur">
                نظام طوابير رقمي بسيط للمتاجر
              </div>
              <h1 className="text-4xl font-black leading-tight sm:text-6xl">
                رقمن طوابيرك ،وخلي الزبون يحجز دوره من جواله
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                Dorak يساعد المتاجر على إدارة الطابور بدون تعقيد: رابط QR
                للزبائن، تذاكر رقمية، ولوحة تحكم خاصة لصاحب العمل تعرض الدور
                التالي فورياً.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/auth?mode=sign_up&plan=trial"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-6 py-4 font-black text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400"
                >
                  سجّل كصاحب عمل
                  <BriefcaseBusiness className="h-5 w-5" />
                </Link>
                <Link
                  to="/auth?mode=sign_in"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-6 py-4 font-black text-white ring-1 ring-white/15 transition hover:bg-white/15"
                >
                  الدخول للوحة التحكم
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <Link
                  to={`/shop/${DEFAULT_SHOP_ID}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-6 py-4 font-black text-white ring-1 ring-white/15 transition hover:bg-white/15"
                >
                  تجربة صفحة الزبون
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <Smartphone className="mb-5 h-8 w-8 text-slate-900" />
              <h2 className="text-xl font-black">صفحة زبون سهلة</h2>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                زر واحد لحجز الدور، مع رقم التذكرة وعدد المنتظرين والوقت المتوقع.
              </p>
            </div>

            <div className="rounded-[2rem] border border-amber-100 bg-amber-50 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
              <LayoutDashboard className="mb-5 h-8 w-8 text-amber-700" />
              <h2 className="text-xl font-black">لوحة تحكم خاصة</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                أصحاب العمل يسجلون حساباً خاصاً ثم يديرون متجرهم ورمز QR من لوحة
                محمية.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <QrCode className="mb-5 h-8 w-8 text-slate-900" />
              <h2 className="text-xl font-black">QR لكل متجر</h2>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                كل معرف متجر ينتج رابطاً ورمز QR خاصاً به للمشاركة أو الطباعة.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2.6rem] border border-white/80 bg-white/85 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur sm:p-7">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black text-amber-600">باقات الاشتراك</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight">
                اختر خطة بسيطة بسعر واضح
              </h2>
            </div>
            <p className="text-sm font-bold text-slate-500">
              التسعير بالدولار — مع تجربة مجانية 3 أيام
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-[2rem] border p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
                  plan.id === "monthly"
                    ? "border-slate-200 bg-slate-950 text-white"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div
                  className={`mb-4 inline-flex rounded-full px-3 py-1 text-xs font-black ${
                    plan.id === "monthly"
                      ? "bg-white/10 text-amber-200"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {plan.id === "trial" ? "Free" : "premium"}
                </div>
                <h3 className="text-2xl font-black">{plan.name}</h3>
                <p
                  className={`mt-2 text-4xl font-black ${
                    plan.id === "monthly" ? "text-amber-300" : "text-slate-900"
                  }`}
                >
                  {plan.price}
                </p>
                <p
                  className={`mt-3 text-sm leading-7 ${
                    plan.id === "monthly" ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {plan.description}
                </p>

                <ul className="mt-5 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-center gap-2 text-sm font-bold ${
                        plan.id === "monthly" ? "text-slate-100" : "text-slate-700"
                      }`}
                    >
                      <CheckCircle2
                        className={`h-4 w-4 ${
                          plan.id === "monthly" ? "text-amber-300" : "text-amber-600"
                        }`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/auth?mode=sign_up&plan=${plan.id}`}
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-2xl px-5 py-4 font-black transition ${
                    plan.id === "monthly"
                      ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  ابدأ بهذه الباقة
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
      <MadeWithDyad />
    </main>
  );
};

export default Index;