import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import { Download, FileImage, FileText, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";

type QrDownloadCardProps = {
  shopId: string;
  shopName: string;
};

const QrDownloadCard = ({ shopId, shopName }: QrDownloadCardProps) => {
  const [qrUrl, setQrUrl] = useState("");

  const shopUrl = useMemo(() => {
    return `${window.location.origin}/shop/${shopId}`;
  }, [shopId]);

  useEffect(() => {
    QRCode.toDataURL(shopUrl, {
      width: 900,
      margin: 2,
      color: {
        dark: "#0f766e",
        light: "#ffffff",
      },
    }).then(setQrUrl);
  }, [shopUrl]);

  const downloadPng = () => {
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `dorak-${shopId}-qr.png`;
    link.click();
    showSuccess("تم تحميل QR بصيغة PNG");
  };

  const downloadPdf = () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    pdf.setFillColor(240, 253, 250);
    pdf.rect(0, 0, 210, 297, "F");
    pdf.setTextColor(15, 118, 110);
    pdf.setFontSize(24);
    pdf.text("Dorak - QR", 105, 32, { align: "center" });
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(16);
    pdf.text(shopName, 105, 45, { align: "center" });
    pdf.addImage(qrUrl, "PNG", 45, 62, 120, 120);
    pdf.setFontSize(11);
    pdf.setTextColor(71, 85, 105);
    pdf.text(shopUrl, 105, 195, { align: "center" });
    pdf.setFontSize(14);
    pdf.setTextColor(15, 118, 110);
    pdf.text("امسح الكود واحجز دورك بسهولة", 105, 215, {
      align: "center",
    });
    pdf.save(`dorak-${shopId}-qr.pdf`);
    showSuccess("تم تحميل QR بصيغة PDF");
  };

  return (
    <div className="rounded-[2rem] border border-teal-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
          <QrCode className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-950">QR الخاص بمتجرك</h3>
          <p className="text-sm text-slate-500">
            شاركه مع العملاء أو اطبعه عند المدخل
          </p>
        </div>
      </div>

      <div className="rounded-[1.5rem] bg-teal-50 p-4">
        {qrUrl ? (
          <img
            src={qrUrl}
            alt="QR code"
            className="mx-auto h-56 w-56 rounded-3xl bg-white p-3"
          />
        ) : (
          <div className="h-56 rounded-3xl bg-white" />
        )}
      </div>

      <p className="mt-4 break-all rounded-2xl bg-slate-50 p-3 text-center text-xs font-semibold text-slate-500">
        {shopUrl}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button
          onClick={downloadPng}
          disabled={!qrUrl}
          className="rounded-full bg-teal-600 font-bold text-white hover:bg-teal-700"
        >
          <FileImage className="ml-2 h-4 w-4" />
          PNG
        </Button>
        <Button
          onClick={downloadPdf}
          disabled={!qrUrl}
          variant="outline"
          className="rounded-full border-teal-200 font-bold text-teal-700 hover:bg-teal-50"
        >
          <FileText className="ml-2 h-4 w-4" />
          PDF
        </Button>
      </div>

      <Button
        asChild
        variant="ghost"
        className="mt-3 w-full rounded-full font-bold text-slate-600 hover:bg-slate-50"
      >
        <a href={shopUrl} target="_blank" rel="noreferrer">
          <Download className="ml-2 h-4 w-4" />
          فتح صفحة العميل
        </a>
      </Button>
    </div>
  );
};

export default QrDownloadCard;