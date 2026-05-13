export type SubscriptionPlanId = "trial" | "monthly" | "premium";

export type SubscriptionPlan = {
  id: SubscriptionPlanId;
  name: string;
  price: string;
  badge: string;
  description: string;
  features: string[];
  isComingSoon?: boolean;
};

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "trial",
    name: "تجربة مجانية ( 3 ايام )",
    price: "$0",
    badge: "Free",
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
    price: "$7 / شهر",
    badge: "Basic",
    description: "باقة مناسبة للمتاجر التي تريد إدارة الطابور يومياً بسهولة.",
    features: [
      "استخدام مستمر بدون حد تجريبي",
      "لوحة تحكم خاصة بكل متجر",
      "تحديث فوري للطابور",
      "مناسبة للمتاجر الصغيرة والمتوسطة",
    ],
  },
  {
    id: "premium",
    name: "الباقة الذهبية",
    price: "قريباً",
    badge: "Premium",
    description:
      "باقة متقدمة للمتاجر التي تريد أدوات أوسع وتحكماً أكبر وقراءة أوضح لأداء الطوابير.",
    features: [
      "لوحة تحكم متقدمة",
      "قسم تحليل البيانات والنتائج",
      "إمكانية تخصيص الطوابير",
      "إمكانية إلغاء الأدوار من الطابور",
      "خيارات أكثر لإدارة المتجر",
      "مناسبة للأعمال التي تحتاج تحكمًا أوسع",
    ],
    isComingSoon: true,
  },
];

export function getTrialEndsAt() {
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 3);

  return trialEndDate.toISOString();
}

export function getTrialDaysLeft(trialEndsAt: string | null) {
  if (!trialEndsAt) {
    return null;
  }

  const diff = new Date(trialEndsAt).getTime() - Date.now();

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isTrialExpired(trialEndsAt: string | null) {
  const daysLeft = getTrialDaysLeft(trialEndsAt);

  if (daysLeft === null) {
    return false;
  }

  return daysLeft < 0;
}

export function isTrialEndingSoon(trialEndsAt: string | null) {
  const daysLeft = getTrialDaysLeft(trialEndsAt);

  if (daysLeft === null) {
    return false;
  }

  return daysLeft <= 1 && daysLeft >= 0;
}