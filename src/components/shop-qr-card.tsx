"use client";

import { Copy, Download, FileImage, FileText, QrCode } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

type ShopQrCardProps = {
  shopId: string;
};

export function ShopQrCard({ shopId }: ShopQrCardProps) {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const shopUrl = `${origin}/shop/${shopId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=900x900&margin=24&data=${encodeURIComponent(
    shopUrl
  )}`;

  const fileSafeShopId = shopId.replace(/[^a-z0-9-]/gi, "-").toLowerCase();

  const copyUrl = () => {
    navigator.clipboard.writeText(shopUrl);
    toast.success("تم نسخ رابط صفحة العميل");
  };

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getQrBlob = async () => {
    const response = await fetch(qrUrl);
    return response.blob();
  };

  const blobToDataUrl = async (blob: Blob) => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result as string);
      };

      reader.readAsDataURL(blob);
    });
  };

  const downloadPng = async () => {
    const blob = await getQrBlob();
    downloadBlob(blob, `dorak-qr-${fileSafeShopId}.png`);
    toast.success("تم تحميل رمز QR بصيغة PNG");
  };

  const downloadPdf = async () => {
    const blob = await getQrBlob();
    const imageDataUrl = await blobToDataUrl(blob);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const qrSize = 118;
    const qrX = (pageWidth - qrSize) / 2;

    pdf.setFillColor(246, 251, 248);
    pdf.rect(0, 0, pageWidth, 297, "F");

    pdf.setFillColor(15, 118, 110);
    pdf.roundedRect(18, 18, pageWidth - 36, 42, 8, 8, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text("Dorak Customer QR", pageWidth / 2, 36, { align: "center" });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.text("Scan this code to join the queue", pageWidth / 2, 48, {
      align: "center",
    });

    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(qrX - 8, 78, qrSize + 16, qrSize + 16, 10, 10, "F");
    pdf.addImage(imageDataUrl, "PNG", qrX, 86, qrSize, qrSize);

    pdf.setTextColor(15, 23, 42);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.text(`Shop ID: ${shopId}`, pageWidth / 2, 226, { align: "center" });

    pdf.setTextColor(15, 118, 110);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    const wrappedUrl = pdf.splitTextToSize(shopUrl, pageWidth - 44);
    pdf.text(wrappedUrl, pageWidth / 2, 240, { align: "center" });

    pdf.save(`dorak-qr-${fileSafeShopId}.pdf`);
    toast.success("تم تحميل رمز QR بصيغة PDF");
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

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={downloadPng}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-400"
        >
          <FileImage className="h-4 w-4" />
          تحميل PNG
        </button>

        <button
          type="button"
          onClick={downloadPdf}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800"
        >
          <FileText className="h-4 w-4" />
          تحميل PDF
        </button>
      </div>

      <div className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500">
        <Download className="h-3.5 w-3.5" />
        مناسب للطباعة والمشاركة
      </div>
    </section>
  );
}