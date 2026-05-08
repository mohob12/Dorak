"use client";

import { Copy, QrCode } from "lucide-react";
import { toast } from "sonner";

type ShopQrCardProps = {
  shopId: string;
};

export function ShopQrCard({ shopId }: ShopQrCardProps) {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const shopUrl = `${origin}/shop/${shopId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=16&data=${encodeURIComponent(
    shopUrl
  )}`;

  const copyUrl = async () => {
    await navigator.clipboard.writeText(shopUrl);
    toast.success("تم نسخ رابط صفحة العميل");
  };

  return (
    <section className="rounded-[2rem] border border-teal-100 bg-white p-5 text-center shadow-sm shadow-teal-900/5">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-teal-100 text-teal-800">
        <QrCode className="h-7 w-7" />
      </div>

      <h2 className="text-xl font-black text-slate-950">رمز QR للزبائن</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        اطبع هذا الرمز أو شاركه ليحجز الزبائن أدوارهم مباشرة.
      </p>

      <div className="mt-5 rounded-[1.5rem] bg-slate-50 p-4">
        <img
          src={qrUrl}
          alt="QR Code"
          className="mx-auto h-56 w-56 rounded-2xl"
        />
      </div>

      <p className="mt-4 break-all rounded-2xl bg-teal-50 px-3 py-3 text-xs font-bold text-teal-900">
        {shopUrl}
      </p>

      <button
        type="button"
        onClick={copyUrl}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-700 px-5 py-3 font-black text-white transition hover:bg-teal-800"
      >
        <Copy className="h-4 w-4" />
        نسخ الرابط
      </button>
    </section>
  );
}