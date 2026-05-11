import { CheckCircle2, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSession } from "@/hooks/use-session";
import { updateOwnerPlan } from "@/lib/owner-profile";
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans";

const PLAN_STORAGE_KEY = "dorak-selected-owner-plan";
const PAID_SIGNUP_APPROVED_KEY = "dorak-paid-signup-approved";

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useSession();
  const monthlyPlan = SUBSCRIPTION_PLANS.find((plan) => plan.id === "monthly");

  const handleContinuePayment = async () => {
    window.localStorage.setItem(PLAN_STORAGE_KEY, "monthly");

    if (user) {
      const loadingToast = toast.loading("جاري ترقية حسابك الحالي...");

      const upgradedProfile = await updateOwnerPlan(user.id, "monthly");

      toast.dismiss(loadingToast);
      toast.success("تمت ترقية حسابك الحالي بنجاح بدون تغيير بيانات الطابور");

      navigate("/dashboard", {
        replace: true,
        state: { upgradedPlan: upgradedProfile.subscription_plan },
      });
      return;
    }

    window.localStorage.setItem(PAID_SIGNUP_APPROVED_KEY, "true");
    toast.success("تم تأكيد الدفع، يمكنك الآن إنشاء الحساب الشهري");
    navigate("/auth?plan=monthly&paid=success", { replace: true });
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f6fbf8] px-4 py-6 text-slate-950 sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
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

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="rounded-[2.4rem] bg-teal-700 p-7 text-white shadow-xl shadow-teal-900/15 sm:p-10">
            <div className="mb-6 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
              الترقية إلى الباقة الشهرية
            </div>

            <h1 className="text-4xl font-black leading-tight sm:text-5xl">
              ترقية آمنة بدون فقدان بيانات الطابور
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-teal-50/85">
              الحسابات المسجلة يمكن ترقيتها مباشرة إلى الباقة الشهرية مع الحفاظ
              على نفس المتجر ونفس بيانات الزبائن والتذاكر الحالية داخل الطابور.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.5rem] bg-white/12 p-4 ring-1 ring-white/15">
                <Sparkles className="mb-3 h-6 w-6 text-amber-300" />
                <p className="font-black">ترقية مباشرة</p>
                <p className="mt-1 text-sm text-teal-50/80">
                  على نفس الحساب الحالي
                </p>
              </div>

              <div className="rounded-[1.5rem] bg-white/12 p-4 ring-1 ring-white/15">
                <ShieldCheck className="mb-3 h-6 w-6 text-amber-300" />
                <p className="font-black">بدون فقدان البيانات</p>
                <p className="mt-1 text-sm text-teal-50/80">
                  بيانات الزبائن والطابور تبقى كما هي
                </p>
              </div>

              <div className="rounded-[1.5rem] bg-white/12 p-4 ring-1 ring-white/15">
                <CreditCard className="mb-3 h-6 w-6 text-amber-300" />
                <p className="font-black">دفع أولاً</p>
                <p className="mt-1 text-sm text-teal-50/80">
                  ثم تفعيل أو إنشاء الحساب
                </p>
              </div>
            </div>
          </div>

          <section className="rounded-[2.4rem] border border-amber-200 bg-white p-6 shadow-sm shadow-teal-900/5 sm:p-8">
            <div className="mb-4 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
              الباقة المدفوعة
            </div>

            <h2 className="text-3xl font-black">
              {monthlyPlan?.name || "الباقة الشهرية"}
            </h2>

            <p className="mt-3 text-5xl font-black text-teal-800">
              {monthlyPlan?.price || "$9 / شهر"}
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              {monthlyPlan?.description ||
                "باقة مناسبة للمتاجر التي تريد إدارة الطابور يومياً بسهولة."}
            </p>

            <ul className="mt-6 space-y-3">
              {(monthlyPlan?.features || []).map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm font-bold text-slate-700"
                >
                  <CheckCircle2 className="h-4 w-4 text-teal-700" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-[1.7rem] bg-slate-50 p-5">
              <p className="text-sm font-black text-slate-800">
                {user ? "ترقية الحساب الحالي" : "إنشاء حساب بعد الدفع"}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {user
                  ? "إذا كان لديك حساب مسجل بالفعل، فسيتم تفعيل الباقة الشهرية على نفس الحساب مباشرة بدون تغيير أو حذف بيانات الزبائن في الطابور."
                  : "إذا لم يكن لديك حساب بعد، فسيتم الدفع أولاً ثم توجيهك مباشرة إلى إنشاء حساب جديد للباقة الشهرية."}
              </p>

              <button
                type="button"
                onClick={handleContinuePayment}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-5 py-4 font-black text-slate-950 transition hover:bg-amber-400"
              >
                <CreditCard className="h-5 w-5" />
                {user ? "الدفع ثم ترقية الحساب الحالي" : "الدفع ثم إنشاء الحساب"}
              </button>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
};

export default Pricing;