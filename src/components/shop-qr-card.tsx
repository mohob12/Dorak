"use client";

import { Download, ExternalLink, QrCode } from "lucide-react";
import { toast } from "sonner";

type ShopQrCardProps = {
  shopId: string;
};

export function ShopQrCard({ shopId }: ShopQrCardProps) {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const shopUrl = `${origin}/shop/${shopId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=20&data=${encodeURIComponent(
    shopUrl
  )}`;

  const downloadBlob = (blob: Blob, fileName: string) => {
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(objectUrl);
  };

  const downloadPng = async () => {
    const response = await fetch(qrUrl);
    const blob = await response.blob();
    downloadBlob(blob, `dorak-qr-${shopId}.png`);
    toast.success("تم تحميل QR بصيغة PNG");
  };

  const downloadPdf = async () => {
    const [{ jsPDF }, response] = await Promise.all([
      import("jspdf"),
      fetch(qrUrl),
    ]);

    const blob = await response.blob();
    const imageUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("Dorak QR Code", 105, 24, { align: "center" });
    pdf.setFontSize(11);
    pdf.text(shopUrl, 105, 32, { align: "center", maxWidth: 170 });
    pdf.addImage(imageUrl, "PNG", 45, 45, 120, 120);
    pdf.save(`dorak-qr-${shopId}.pdf`);

    toast.success("تم تحميل QR بصيغة PDF");
  };

  return (
    <section className="rounded-[2rem] border border-teal-100 bg-white p-5 text-center shadow-sm shadow-teal-900/5">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-teal-100 text-teal-800">
        <QrCode className="h-7 w-7" />
      </div>

      <h2 className="text-xl font-black text-slate-950">رابط ورمز متجرك</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        استخدم هذا الرابط مع الزبائن، ويمكنك تحميل رمز QR بصيغة صورة أو PDF.
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
          <a
            href={shopUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-teal-800 ring-1 ring-teal-100 transition hover:bg-teal-50"
          >
            <ExternalLink className="h-4 w-4" />
            فتح صفحة الزبائن
          </a>
        </div>

        <div className="rounded-[1.4rem] border border-amber-100 bg-amber-50 p-4">
          <p className="text-sm font-black text-amber-900">
            تحميل رمز QR
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={downloadPng}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-400"
            >
              <Download className="h-4 w-4" />
              تحميل PNG
            </button>
            <button
              type="button"
              onClick={downloadPdf}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-amber-900 ring-1 ring-amber-200 transition hover:bg-amber-100"
            >
              <Download className="h-4 w-4" />
              تحميل PDF
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}