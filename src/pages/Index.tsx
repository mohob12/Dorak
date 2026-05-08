import { Link } from "react-router-dom";
import { ArrowLeft, Clock, QrCode, ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import MarketingNav from "@/components/MarketingNav";
import PricingCards from "@/components/PricingCards";

const Index = () => {
  return (
    <main dir="rtl" className="min-h-screen bg-white text-slate-950">
      <MarketingNav />

      <section className="relative overflow-hidden bg-teal-50 px-4 py-16 sm:py-24">
        <div className="absolute left-0 top-12 h-44 w-44 rounded-full bg-amber-200/60 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-teal-300/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-5 inline-flex rounded-full bg-white px-5 py-2 text-sm font-black text-teal-700 shadow-sm">
              دورك وصل: طابور رقمي بدون فوضى وبدون انتظار مزعج
            </p>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl">
              حوّل انتظار عملائك إلى تجربة منظمة واحترافية
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-slate-650 text-slate-700">
              Dorak يساعدك على إدارة الطوابير عبر QR بسيط، يري العميل رقم دوره
              والوقت المتوقع، ويمنح صاحب العمل لوحة تحكم سهلة لتقديم الخدمة
              بثقة.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-teal-600 px-8 text-base font-black text-white shadow-xl shadow-teal-200 hover:bg-teal-700"
              >
                <Link to="/login">
                  سجّل كصاحب عمل
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-teal-200 bg-white px-8 text-base font-black text-teal-700 hover:bg-teal-50"
              >
                <a href="#pricing">شاهد الباقات</a>
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                "إعداد سريع خلال دقائق",
                "مناسب للهاتف أولًا",
                "تجربة مجانية 3 أيام",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-black text-slate-700 shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white bg-white p-5 shadow-2xl shadow-teal-100">
            <div className="rounded-[2rem] bg-slate-950 p-5 text-white">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-teal-200">متجر Dorak</p>
                  <h2 className="text-2xl font-black">لوحة الطابور</h2>
                </div>
                <div className="rounded-full bg-teal-500 px-4 py-2 text-sm font-black">
                  مباشر
                </div>
              </div>

              <div className="grid gap-3">
                {[
                  { label: "الدور الحالي", value: "12" },
                  { label: "في الانتظار", value: "8" },
                  { label: "الوقت المتوقع", value: "24 د" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between rounded-3xl bg-white/10 p-4"
                  >
                    <span className="text-white/75">{stat.label}</span>
                    <span className="text-3xl font-black text-amber-300">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-3xl bg-teal-500 p-5 text-center">
                <QrCode className="mx-auto mb-2 h-12 w-12" />
                <p className="font-black">امسح QR واحجز دورك</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {[
            {
              icon: QrCode,
              title: "QR لكل متجر",
              text: "رابط خاص بصفحة الحجز يمكن طباعته أو مشاركته بسهولة.",
            },
            {
              icon: Clock,
              title: "وقت انتظار واضح",
              text: "يعرف العميل عدد الأشخاص قبله والوقت المتوقع بشكل مباشر.",
            },
            {
              icon: ShieldCheck,
              title: "ثقة وتنظيم",
              text: "قلّل الازدحام وارفع جودة الخدمة بصورة بسيطة واحترافية.",
            },
          ].map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-[2rem] border border-teal-100 bg-white p-6 shadow-sm"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-black text-slate-950">
                  {feature.title}
                </h3>
                <p className="mt-3 leading-8 text-slate-600">{feature.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <PricingCards />

      <section className="bg-slate-950 px-4 py-16 text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <Smartphone className="h-12 w-12 text-amber-300" />
          <h2 className="text-3xl font-black sm:text-4xl">
            اجعل أول انطباع عن متجرك أكثر تنظيمًا
          </h2>
          <p className="max-w-2xl text-lg leading-9 text-white/75">
            ابدأ اليوم، اطبع QR، واترك Dorak يرتّب الطابور بينما تركّز أنت على
            خدمة عملائك.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-amber-300 px-8 text-base font-black text-slate-950 hover:bg-amber-200"
          >
            <Link to="/login">ابدأ التجربة المجانية</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Index;