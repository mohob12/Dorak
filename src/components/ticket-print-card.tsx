"use client";

import { Clock3, Printer, QrCode, UsersRound } from "lucide-react";
import { formatWaitTime, type Ticket } from "@/lib/queue";

type TicketPrintCardProps = {
  shopId: string;
  ticket: Ticket;
  peopleAhead: number;
  avgServiceMinutes: number;
};

export function TicketPrintCard({
  shopId,
  ticket,
  peopleAhead,
  avgServiceMinutes,
}: TicketPrintCardProps) {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const waitingUrl = `${origin}/shop/${shopId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=16&data=${encodeURIComponent(
    waitingUrl
  )}`;
  const estimatedWait = formatWaitTime(peopleAhead * avgServiceMinutes);

  const printTicket = () => {
    const printWindow = window.open("", "_blank", "width=720,height=900");

    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8" />
          <title>طباعة تذكرة ${ticket.ticket_number ?? ""}</title>
          <style>
            body {
              margin: 0;
              padding: 24px;
              font-family: Tajawal, Arial, sans-serif;
              background: #f8fafc;
              color: #0f172a;
            }
            .ticket {
              max-width: 420px;
              margin: 0 auto;
              background: white;
              border: 2px solid #ccfbf1;
              border-radius: 28px;
              padding: 24px;
              box-shadow: 0 10px 30px rgba(15, 118, 110, 0.08);
            }
            .brand {
              text-align: center;
              color: #0f766e;
              font-weight: 800;
              font-size: 24px;
            }
            .number {
              margin-top: 16px;
              text-align: center;
              background: #fef3c7;
              color: #78350f;
              border-radius: 24px;
              padding: 18px;
            }
            .number small {
              display: block;
              font-size: 14px;
              margin-bottom: 8px;
            }
            .number strong {
              font-size: 48px;
              line-height: 1;
            }
            .grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 12px;
              margin-top: 18px;
            }
            .item {
              background: #f8fafc;
              border-radius: 18px;
              padding: 14px 16px;
            }
            .label {
              font-size: 13px;
              color: #64748b;
              font-weight: 700;
              margin-bottom: 6px;
            }
            .value {
              font-size: 20px;
              font-weight: 800;
            }
            .qr-wrap {
              margin-top: 18px;
              text-align: center;
              background: #f0fdfa;
              border-radius: 24px;
              padding: 18px;
            }
            .qr-wrap img {
              width: 180px;
              height: 180px;
              border-radius: 18px;
              background: white;
              padding: 8px;
            }
            .url {
              margin-top: 12px;
              font-size: 12px;
              color: #0f766e;
              word-break: break-all;
              font-weight: 700;
            }
            .footer {
              margin-top: 18px;
              text-align: center;
              font-size: 13px;
              color: #475569;
              line-height: 1.8;
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="brand">Dorak | دورك</div>

            <div class="number">
              <small>رقم التذكرة</small>
              <strong>${ticket.ticket_number ?? "—"}</strong>
            </div>

            <div class="grid">
              <div class="item">
                <div class="label">اسم الزبون</div>
                <div class="value">${ticket.customer_name || "بدون اسم"}</div>
              </div>

              <div class="item">
                <div class="label">عدد الأشخاص قبله</div>
                <div class="value">${peopleAhead}</div>
              </div>

              <div class="item">
                <div class="label">الوقت المتوقع</div>
                <div class="value">${estimatedWait}</div>
              </div>
            </div>

            <div class="qr-wrap">
              <div style="font-weight:800; margin-bottom:12px; color:#0f766e;">
                QR لصفحة الانتظار
              </div>
              <img src="${qrUrl}" alt="QR Code" />
              <div class="url">${waitingUrl}</div>
            </div>

            <div class="footer">
              امسح رمز QR للدخول مباشرة إلى صفحة الانتظار ومتابعة حالة الدور.
            </div>
          </div>

          <script>
            window.onload = function () {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <button
      type="button"
      onClick={printTicket}
      className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-teal-800 ring-1 ring-teal-100 transition hover:bg-teal-50"
    >
      <Printer className="h-4 w-4" />
      طباعة التذكرة
      <span className="hidden items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 sm:inline-flex">
        <UsersRound className="h-3.5 w-3.5" />
        {peopleAhead}
      </span>
      <span className="hidden items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 lg:inline-flex">
        <Clock3 className="h-3.5 w-3.5" />
        {estimatedWait}
      </span>
      <span className="hidden items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700 xl:inline-flex">
        <QrCode className="h-3.5 w-3.5" />
        QR
      </span>
    </button>
  );
}