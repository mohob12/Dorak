import { ArrowLeft, CreditCard, MessageCircle, QrCode, Store } from "lucide-react";
import { Link } from "react-router-dom";

const WHATSAPP_URL = "https://wa.me/0784329316";

const PostalPayment = () => {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f6fbf8] px-4 py-6 text-slate-950 sm:px-6"
    >
      <div className="mx-auto max-w-4xl">
        <nav className="mb-8 flex items-center justify-between rounded-full border border-teal-100 bg-white/90 px-4 py-3 shadow-sm shadow-teal-900/5">
          <div className="text-xl font-black text-teal-800">Daorak | دورك</div>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-800"
          >
            <ArrowLeft className="h-4 w-4" />
            العودة للتسعير
          </Link>
        </nav>

        <section className="overflow-hidden rounded-[2.5rem] border border-indigo-100 bg-white shadow-xl shadow-indigo-900/10">
          <div className="bg-[#2f3192] px-6 py-8 text-white sm:px-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-black">
                  الدفع عبر بريد الجزائر
                </div>
                <h1 className="mt-4 text-3xl font-black sm:text-5xl">
                  معلومات الدفع
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-8 text-white/85">
                  بعد إتمام الدفع، أرسل الوصل مباشرة عبر واتساب حتى نفعّل طلبك.
                </p>
              </div>

              <div className="flex h-20 w-20 items-center justify-center rounded-[1.8rem] bg-white/15 ring-1 ring-white/20">
                <img
                  src="/algerie-poste-logo.png"
                  alt="شعار بريد الجزائر"
                  className="h-14 w-14 object-contain"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:p-10">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.7rem] bg-slate-50 p-5">
                <CreditCard className="mb-3 h-6 w-6 text-[#2f3192]" />
                <p className="text-sm font-black text-slate-500">CCP</p>
                <p className="mt-2 text-xl font-black text-slate-950">
                  0018607291 87
                </p>
              </div>

              <div className="rounded-[1.7rem] bg-slate-50 p-5">
                <Store className="mb-3 h-6 w-6 text-[#ffd200]" />
                <p className="text-sm font-black text-slate-500">Name, pre</p>
                <p className="mt-2 text-lg font-black leading-7 text-slate-950">
                  MOHAMMED LAID MAHAMMEDI
                </p>
              </div>

              <div className="rounded-[1.7rem] bg-slate-50 p-5">
                <QrCode className="mb-3 h-6 w-6 text-[#2f3192]" />
                <p className="text-sm font-black text-slate-500">بريدي موب</p>
                <p className="mt-2 text-xl font-black text-slate-950">
                  00799999001860729187
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-indigo-100 bg-[#f8f9ff] p-5">
              <p className="text-sm font-black text-indigo-900">
                بعد الدفع أرسل الوصل عبر واتساب إلى هذا الرقم
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                اضغط الزر أدناه لفتح المحادثة مباشرة مع رقم المتابعة.
              </p>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-5 py-4 text-lg font-black text-white shadow-lg shadow-green-500/25 transition hover:bg-[#1fb659]"
              >
                <MessageCircle className="h-5 w-5" />
                إرسال الوصل عبر واتساب
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PostalPayment;