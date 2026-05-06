export type SubscriptionPlanId = "trial" | "monthly";

export type SubscriptionPlan = {
  id: SubscriptionPlanId;
  name: string;
  price: string;
  badge: string;
  description: string;
  features: string[];
};

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "trial",
    name: "تجربة مجانية",
    price: "$0",
    badge: "3 أيام مجاناً",
    description: "ابدأ فوراً واختبر لوحة التحكم الخاصة بمتجرك بدون دفع.",
    features: [
      "لوحة تحكم خاصة",
      "رابط QR للزبائن",
      "تذاكر رقمية مباشرة",
      "تجربة كاملة لمدة 3 أيام",
    ],
  },
  {
    id: "monthly",
    name: "الباقة الشهرية",
    price: "$9 / شهر",
    badge: "سعر مدروس",
    description: "باقة مناسبة للمتاجر التي تريد إدارة الطابور يومياً بسهولة.",
    features: [
      "استخدام مستمر بدون حد تجريبي",
      "لوحة تحكم خاصة بكل متجر",
      "تحديث فوري للطابور",
      "مناسبة للمتاجر الصغيرة والمتوسطة",
    ],
  },
];

export function getTrialEndsAt() {
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 3);

  return trialEndDate.toISOString();
}