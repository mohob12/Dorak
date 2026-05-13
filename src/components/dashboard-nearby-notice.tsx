"use client";

import { MapPin, Ticket } from "lucide-react";

type DashboardNearbyNoticeProps = {
  customerName: string;
  ticketNumber: number | null;
};

export function DashboardNearbyNotice({
  customerName,
  ticketNumber,
}: DashboardNearbyNoticeProps) {
  return (
    <div className="pointer-events-none fixed right-4 top-6 z-50 w-[calc(100vw-2rem)] max-w-sm animate-in slide-in-from-right-8 fade-in duration-500">
      <div className="overflow-hidden rounded-[1.8rem] border border-[#24348f]/20 bg-white shadow-2xl shadow-[#24348f]/15">
        <div className="bg-[#24348f] px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white/75">تنبيه جديد من الزبون</p>
              <p className="text-lg font-black">أنا قريب</p>
            </div>
          </div>
        </div>

        <div className="bg-[#fff8e8] px-5 py-4 text-slate-950">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">اسم الزبون</p>
              <p className="mt-1 text-xl font-black">{customerName}</p>
            </div>

            <div className="rounded-2xl bg-amber-400 px-4 py-3 text-center text-slate-950 shadow-sm">
              <Ticket className="mx-auto mb-1 h-4 w-4" />
              <p className="text-xs font-bold">رقم</p>
              <p className="text-lg font-black">{ticketNumber ?? "—"}</p>
            </div>
          </div>

          <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#24348f] ring-1 ring-[#24348f]/10">
            الزبون قريب من المحل وهو قادم لدوره الآن.
          </p>
        </div>
      </div>
    </div>
  );
}