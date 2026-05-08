import { Check, Crown, Gift, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "مناسبة للتجربة والبدايات الصغيرة",
    icon: Gift,
    features: ["صفحة حجز QR", "طابور مباشر", "لوحة تحكم بسيطة"],
    highlighted: false,
  },
  {
    name: "Premium",
    price: "$9",
    description: "للمتاجر التي تريد تجربة أسرع وأكثر احترافية",
    icon: Crown,
    features: [
      "كل مزايا Free",
      "تحميل QR بصيغ PNG و PDF",
      "رسائل تسويقية أفضل للعملاء",
      "أولوية في التطوير والدعم",
    ],
    highlighted: true,
  },
  {
    name: "تجربة مجانية",
    price: "3 أيام",
    description: "جرّب دورك بثقة قبل اختيار الباقة",
    icon: Zap,
    features: ["بدون تعقيد", "تفعيل فوري", "مثالية لاختبار المتجر"],
    highlighted: false,
  },
];

const PricingCards = () => {
  return (
    <section id="pricing" className="bg-white px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 inline-flex rounded-full bg-teal-50 px-4 py-2 text-sm font-bold text-teal-700">
            أسعار واضحة بالدولار
          </p>
          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            اختر الباقة التي تناسب نشاطك
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600">
            ابدأ مجانًا، ثم انتقل إلى Premium عندما تريد تجربة أكثر احترافية
            لعملائك.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <div
                key={plan.name}
                className={`relative rounded-[2rem] border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                  plan.highlighted
                    ? "border-teal-500 bg-teal-600 text-white shadow-teal-100"
                    : "border-teal-100 bg-teal-50/40 text-slate-950"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 right-6 rounded-full bg-amber-300 px-4 py-1 text-xs font-black text-slate-950">
                    الأكثر قيمة
                  </div>
                )}

                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${
                    plan.highlighted
                      ? "bg-white/15 text-white"
                      : "bg-white text-teal-700"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-2xl font-black">{plan.name}</h3>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-4xl font-black">{plan.price}</span>
                  {plan.name === "Premium" && (
                    <span className="pb-2 text-sm font-bold opacity-80">
                      / شهريًا
                    </span>
                  )}
                </div>
                <p
                  className={`mt-4 min-h-14 leading-7 ${
                    plan.highlighted ? "text-white/85" : "text-slate-600"
                  }`}
                >
                  {plan.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          plan.highlighted
                            ? "bg-white text-teal-700"
                            : "bg-teal-600 text-white"
                        }`}
                      >
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-bold">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`mt-8 w-full rounded-full font-black ${
                    plan.highlighted
                      ? "bg-white text-teal-700 hover:bg-teal-50"
                      : "bg-teal-600 text-white hover:bg-teal-700"
                  }`}
                >
                  <Link to="/login">سجّل وابدأ الآن</Link>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingCards;