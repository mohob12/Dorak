"use client";

import { Copy, ExternalLink, QrCode } from "lucide-react";
import { toast } from "sonner";

type ShopQrCardProps = {
  shopId: string;
};

export function ShopQrCard({ shopId }: ShopQrCardProps) {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const shopUrl = `${origin}/shop/${shopId}`;
  const dashboardUrl = `${origin}/dashboard`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=16&data=${encodeURIComponent(
    shopUrl
  )}`;

  const copyUrl = async (value: string, message: string) => {
    await navigator.clipboard.writeText(value);
    toast.success(message);
  };

  return (
    <section className="rounded-[2rem] border border-teal-100 bg-white p-5 text-center shadow-sm shadow-teal-900/5">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-teal-100 text-teal-800">
        <QrCode className="h-7 w-7" />
      </div>

      <h2 className="text-xl font-black text-slate-950">روابط متجرك</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        استخدم رابط الزبائن مع رمز QR، واحتفظ برابط لوحة التحكم لنفسك فقط.
      </p>

      <div className="mt-5 rounded-[1.5rem] bg-slate-50 p-4">
        <img
          src={qrUrl}
          alt="QR Code"
          className="mx-auto h-56 w-56 rounded-2xl"
        />
      </div>

      <div className="mt-5 space-y-3 text-right">
        <div className="rounded-[1.4rem] border border-teal-100 bg-teal-50 p-4">
          <p className="text-sm font-black text-teal-900">رابط صفحة الزبائن</p>
          <p className="mt-2 break-all text-xs font-bold text-teal-800">
            {shopUrl}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => copyUrl(shopUrl, "تم نسخ رابط الزبائن")}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-teal-700 px-4 py-3 text-sm font-black text-white transition hover:bg-teal-800"
            >
              <Copy className="h-4 w-4" />
              نسخ
            </button>
            <a
              href={shopUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-teal-800 ring-1 ring-teal-100 transition hover:bg-teal-50"
            >
              <ExternalLink className="h-4 w-4" />
              فتح
            </a>
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-amber-100 bg-amber-50 p-4">
          <p className="text-sm font-black text-amber-900">رابط لوحة التحكم</p>
          <p className="mt-2 break-all text-xs font-bold text-amber-900">
            {dashboardUrl}
          </p>
          <button
            type="button"
            onClick={() => copyUrl(dashboardUrl, "تم نسخ رابط لوحة التحكم")}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-400"
          >
            <Copy className="h-4 w-4" />
            نسخ رابط اللوحة
          </button>
        </div>
      </div>
    </section>
  );
}