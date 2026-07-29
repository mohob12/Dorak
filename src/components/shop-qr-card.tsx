"use client";

import { Download, ExternalLink, QrCode } from "lucide-react";
import { toast } from "sonner";

type ShopQrCardProps = {
  shopId: string;
};

const CANVAS_WIDTH = 1240;
const CANVAS_HEIGHT = 1754;

type TextBlock = {
  text: string;
  x: number;
  y: number;
  font: string;
  color?: string;
  direction?: CanvasDirection;
  maxWidth?: number;
  lineHeight?: number;
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
) => {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = ctx.measureText(testLine).width;

    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
      return;
    }

    currentLine = testLine;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

const drawTextBlock = (
  ctx: CanvasRenderingContext2D,
  block: TextBlock
) => {
  const {
    text,
    x,
    y,
    font,
    color = "#0f172a",
    direction = "ltr",
    maxWidth,
    lineHeight = 44,
  } = block;

  ctx.save();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.direction = direction;

  const lines =
    maxWidth && ctx.measureText(text).width > maxWidth
      ? wrapText(ctx, text, maxWidth)
      : text.split("\n");

  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });

  ctx.restore();
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

    await document.fonts.ready;

    const qrBlob = await response.blob();
    const qrImageUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(qrBlob);
    });

    const qrImage = await loadImage(qrImageUrl);

    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("تعذر إنشاء ملف PDF");
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const centerX = CANVAS_WIDTH / 2;

    drawTextBlock(ctx, {
      text: "Dorak QR Code",
      x: centerX,
      y: 120,
      font: "700 56px Tajawal, Arial, sans-serif",
      color: "#0f172a",
      direction: "ltr",
    });

    drawTextBlock(ctx, {
      text: `المعرف: ${shopId}`,
      x: centerX,
      y: 210,
      font: "700 42px Tajawal, Arial, sans-serif",
      color: "#0f766e",
      direction: "rtl",
      maxWidth: 980,
    });

    drawTextBlock(ctx, {
      text: "امسح الرمز واحجز دورك في الطابور",
      x: centerX,
      y: 275,
      font: "700 36px Tajawal, Arial, sans-serif",
      color: "#111827",
      direction: "rtl",
      maxWidth: 980,
    });

    drawTextBlock(ctx, {
      text: "Scan code QR",
      x: centerX,
      y: 332,
      font: "700 28px Tajawal, Arial, sans-serif",
      color: "#475569",
      direction: "ltr",
    });

    ctx.save();
    ctx.fillStyle = "#f8fafc";
    ctx.strokeStyle = "#d1fae5";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(250, 430, 740, 740, 36);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.drawImage(qrImage, 320, 500, 600, 600);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, 297);
    pdf.save(`dorak-qr-${shopId}.pdf`);

    toast.success("تم تحميل QR بصيغة PDF");
  };

  return (
    <section className="rounded-[2rem] border border-teal-100 bg-white p-5 text-center shadow-sm shadow-teal-900/5">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-teal-100 text-teal-800">
        <QrCode className="h-7 w-7" />
      </div>

      <h2 className="text-xl font-black text-slate-950">QR حجز الأدوار</h2>
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
          <p className="text-sm font-black text-amber-900">تحميل رمز QR</p>
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