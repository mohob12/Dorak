import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Bell, Clock, PartyPopper, Ticket, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import QueueNotice from "@/components/QueueNotice";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";

type ShopRow = {
  id: string;
  name: string;
  avg_service_minutes: number;
};

type TicketRow = {
  id: string;
  ticket_number: number;
  status: string;
  created_at: string;
};

const Shop = () => {
  const { id } = useParams();
  const audioContextRef = useRef<AudioContext | null>(null);
  const [shop, setShop] = useState<ShopRow | null>(null);
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [myTicketId, setMyTicketId] = useState(
    () => localStorage.getItem(`dorak-ticket-${id}`) ?? "",
  );
  const [notice, setNotice] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  const waitingTickets = useMemo(
    () =>
      tickets
        .filter((ticket) => ticket.status === "waiting")
        .sort((a, b) => a.ticket_number - b.ticket_number),
    [tickets],
  );

  const myTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === myTicketId) ?? null,
    [tickets, myTicketId],
  );

  const peopleBefore = useMemo(() => {
    if (!myTicket) {
      return 0;
    }

    const index = waitingTickets.findIndex((ticket) => ticket.id === myTicket.id);
    return index > -1 ? index : 0;
  }, [myTicket, waitingTickets]);

  const estimatedWait = shop ? peopleBefore * shop.avg_service_minutes : 0;

  const playAlert = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    const context = audioContextRef.current ?? new AudioContextClass();
    audioContextRef.current = context;

    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, context.currentTime);
    oscillator.frequency.setValueAtTime(660, context.currentTime + 0.18);
    gain.gain.setValueAtTime(0.2, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.7);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.7);

    if ("vibrate" in navigator) {
      navigator.vibrate([250, 120, 250]);
    }
  };

  const fetchShop = async () => {
    if (!id) {
      return;
    }

    const { data, error } = await supabase
      .from("shops")
      .select("id,name,avg_service_minutes")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      showError("لم يتم العثور على المتجر");
      setIsLoading(false);
      return;
    }

    setShop(data);
  };

  const fetchTickets = async () => {
    if (!id) {
      return;
    }

    const { data, error } = await supabase
      .from("tickets")
      .select("id,ticket_number,status,created_at")
      .eq("shop_id", id)
      .in("status", ["waiting", "served"])
      .order("ticket_number", { ascending: true });

    if (error) {
      showError("تعذر تحديث الطابور");
      return;
    }

    setTickets(data ?? []);
  };

  useEffect(() => {
    Promise.all([fetchShop(), fetchTickets()]).finally(() =>
      setIsLoading(false),
    );
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }

    const channel = supabase
      .channel(`shop-queue-${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tickets",
          filter: `shop_id=eq.${id}`,
        },
        () => {
          fetchTickets();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  useEffect(() => {
    if (!myTicket) {
      return;
    }

    if (myTicket.status === "served") {
      setNotice(true);
      playAlert();
      showSuccess("حان دورك الآن!");
      localStorage.removeItem(`dorak-ticket-${id}`);

      const timeout = window.setTimeout(() => {
        setNotice(false);
        setMyTicketId("");
      }, 9000);

      return () => window.clearTimeout(timeout);
    }

    if (peopleBefore === 0 && myTicket.status === "waiting") {
      setNotice(true);
      playAlert();

      const timeout = window.setTimeout(() => setNotice(false), 6000);
      return () => window.clearTimeout(timeout);
    }
  }, [myTicket?.status, peopleBefore]);

  const bookTicket = async () => {
    if (!id || !shop) {
      showError("المتجر غير متاح حاليًا");
      return;
    }

    setIsBooking(true);

    const { data, error } = await supabase.rpc("book_ticket", {
      p_shop_id: id,
    });

    setIsBooking(false);

    if (error || !data) {
      showError("تعذر حجز الدور، حاول مرة أخرى");
      return;
    }

    const bookedTicket = data as TicketRow;

    localStorage.setItem(`dorak-ticket-${id}`, bookedTicket.id);
    setMyTicketId(bookedTicket.id);
    showSuccess(`تم حجز دورك رقم ${bookedTicket.ticket_number}`);
    await fetchTickets();
  };

  if (isLoading) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-teal-50 px-4"
      >
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />
          <p className="font-black text-slate-700">جاري تحميل صفحة الحجز...</p>
        </div>
      </main>
    );
  }

  if (!shop) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-teal-50 px-4"
      >
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-black">المتجر غير موجود</h1>
          <p className="mt-3 text-slate-600">تأكد من رابط QR وحاول مجددًا.</p>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-teal-50 px-4 py-6 text-slate-950"
    >
      <QueueNotice
        show={notice}
        title={myTicket?.status === "served" ? "حان دورك الآن!" : "اقترب دورك"}
        message={
          myTicket?.status === "served"
            ? "توجه إلى مقدم الخدمة، شكرًا لانتظارك."
            : "أنت التالي في الطابور، يرجى الاستعداد."
        }
      />

      <div className="mx-auto max-w-md">
        <div className="mb-5 rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl">
          <p className="text-sm font-bold text-teal-200">مرحبًا بك في</p>
          <h1 className="mt-2 text-3xl font-black">{shop.name}</h1>
          <p className="mt-4 leading-7 text-white/75">
            احجز دورك رقميًا وتابع مكانك في الطابور بدون ازدحام أو قلق.
          </p>
        </div>

        {myTicket && myTicket.status === "waiting" ? (
          <div className="rounded-[2.5rem] bg-white p-6 text-center shadow-xl shadow-teal-100">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-300 text-slate-950">
              <Ticket className="h-10 w-10" />
            </div>
            <p className="text-sm font-black text-teal-700">رقم دورك</p>
            <h2 className="mt-2 text-7xl font-black tracking-tight">
              {myTicket.ticket_number}
            </h2>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-[1.5rem] bg-teal-50 p-4">
                <Users className="mx-auto mb-2 h-6 w-6 text-teal-700" />
                <p className="text-xs font-bold text-slate-500">قبلك</p>
                <p className="text-3xl font-black">{peopleBefore}</p>
              </div>
              <div className="rounded-[1.5rem] bg-teal-50 p-4">
                <Clock className="mx-auto mb-2 h-6 w-6 text-teal-700" />
                <p className="text-xs font-bold text-slate-500">
                  الانتظار المتوقع
                </p>
                <p className="text-3xl font-black">{estimatedWait} د</p>
              </div>
            </div>

            <div className="mt-5 rounded-[1.5rem] bg-slate-50 p-4">
              <Bell className="mx-auto mb-2 h-6 w-6 text-amber-500" />
              <p className="text-sm font-bold leading-7 text-slate-600">
                أبقِ هذه الصفحة مفتوحة. سنعرض إشعارًا كبيرًا مع صوت واهتزاز عند
                اقتراب دورك.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-[2.5rem] bg-white p-6 text-center shadow-xl shadow-teal-100">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-teal-600 text-white">
              <PartyPopper className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-black">احجز دورك الآن</h2>
            <p className="mt-3 leading-8 text-slate-600">
              بضغطة واحدة تحصل على رقمك وتتابع الطابور مباشرة من هاتفك.
            </p>

            <Button
              onClick={bookTicket}
              disabled={isBooking}
              size="lg"
              className="mt-6 h-14 w-full rounded-full bg-teal-600 text-lg font-black text-white shadow-lg shadow-teal-100 hover:bg-teal-700"
            >
              {isBooking ? "جاري الحجز..." : "احجز دوري"}
            </Button>
          </div>
        )}

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
            <p className="text-xs font-bold text-slate-500">المنتظرون</p>
            <p className="mt-1 text-2xl font-black">{waitingTickets.length}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
            <p className="text-xs font-bold text-slate-500">القادم</p>
            <p className="mt-1 text-2xl font-black">
              {waitingTickets[0]?.ticket_number ?? "-"}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
            <p className="text-xs font-bold text-slate-500">متوسط</p>
            <p className="mt-1 text-2xl font-black">
              {shop.avg_service_minutes} د
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Shop;