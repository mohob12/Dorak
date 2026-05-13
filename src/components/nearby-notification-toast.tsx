"use client";

import { MapPin, Sparkles } from "lucide-react";

type NearbyNotificationToastProps = {
  customerName: string;
  ticketNumber: number | null;
};

export function NearbyNotificationToast({
  customerName,
  ticketNumber,
}: NearbyNotificationToastProps) {
  return (
    <div
      dir="rtl"
      className="w-full max-w-sm overflow-hidden rounded-[1.8rem] border border-teal-100 bg-white p-4 shadow-2xl shadow-teal-900/15"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <MapPin className="h-6 w-6" />
        </div>

        <div className="flex-1">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-800">
            <Sparkles className="h-3.5 w-3.5" />
            إشعار جديد
          </div>

          <p className="text-base font-black text-slate-950">
            {customerName || "زبون"} — رقم {ticketNumber ?? "—"}
          </p>
          <p className="mt-1 text-sm font-bold text-slate-600">
            أنا قريب
          </p>
        </div>
      </div>
    </div>
  );
}