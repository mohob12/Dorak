import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import {
  Business,
  BusinessQueue,
  Ticket,
  fetchBusiness,
  fetchQueues,
  fetchTickets,
  joinQueue,
} from "@/lib/queue-db";
import { CheckCircle2, Clock3, QrCode, Sparkles, Ticket as TicketIcon, Users } from "lucide-react";
import { toast } from "sonner";

const ShopQueue = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [business, setBusiness] = useState<Business | null>(null);
  const [queues, setQueues] = useState<BusinessQueue[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedQueueId, setSelectedQueueId] = useState(searchParams.get("queue") ?? "");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [issuedTicket, setIssuedTicket] = useState<Ticket | null>(null);

  const selectedQueue = useMemo(
    () => queues.find((queue) => queue.id === selectedQueueId) ?? queues[0],
    [queues, selectedQueueId],
  );

  const waitingCount = useMemo(
    () =>
      selectedQueue
        ? tickets.filter((ticket) => ticket.queue_id === selectedQueue.id && ticket.status === "waiting").length
        : 0,
    [selectedQueue, tickets],
  );

  const estimatedMinutes = selectedQueue ? Math.max(waitingCount, 1) * selectedQueue.average_service_minutes : 0;

  const loadShop = async () => {
    if (!id) return;

    const [businessData, queuesData, ticketsData] = await Promise.all([
      fetchBusiness(id),
      fetchQueues(id),
      fetchTickets(id),
    ]);

    setBusiness(businessData);
    setQueues(queuesData);
    setTickets(ticketsData);

    if (!selectedQueueId && queuesData[0]) {
      setSelectedQueueId(queuesData[0].id);
    }
  };

  useEffect(() => {
    loadShop();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`shop-${id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "tickets", filter: `business_id=eq.${id}` }, loadShop)
      .on("postgres_changes", { event: "*", schema: "public", table: "queues", filter: `business_id=eq.${id}` }, loadShop)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleJoinQueue = async () => {
    if (!business || !selectedQueue) return;

    if (!customerName.trim() || !phone.trim()) {
      toast.error("يرجى إدخال الاسم ورقم الجوال");
      return;
    }

    const ticket = await joinQueue(business, selectedQueue, customerName.trim(), phone.trim());
    setIssuedTicket(ticket);
    setCustomerName("");
    setPhone("");
    toast.success(`تم إصدار تذكرتك ${ticket.code}`);
    loadShop();
  };

  if (!business) {
    return (
      <div dir="rtl" className="flex min-h-screen items-center justify-center bg-[#f3f8ff] p-4">
        <Card className="w-full max-w-md rounded-[2rem] border-0 bg-white/90 text-center shadow-[0_24px_80px_rgba(2,132,199,0.16)]">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-slate-950">لم يتم العثور على المتجر</CardTitle>
            <CardDescription>افتح لوحة التحكم وأنشئ متجرًا تجريبيًا أولًا.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f3f8ff] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <main className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="overflow-hidden rounded-[2.25rem] border-0 bg-[#083344] text-white shadow-[0_28px_90px_rgba(8,51,68,0.22)]">
          <CardContent className="p-6 sm:p-8">
            <Badge className="rounded-full bg-white/15 text-white hover:bg-white/15">
              <Sparkles className="ml-1 h-3.5 w-3.5" />
              انضم بدون تسجيل دخول
            </Badge>
            <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">{business.name}</h1>
            <p className="mt-3 text-lg leading-8 text-cyan-50">{business.branch}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.5rem] bg-white/10 p-4">
                <Users className="h-6 w-6 text-cyan-200" />
                <p className="mt-3 text-sm text-cyan-100">المنتظرون</p>
                <p className="text-3xl font-black">{waitingCount}</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/10 p-4">
                <Clock3 className="h-6 w-6 text-cyan-200" />
                <p className="mt-3 text-sm text-cyan-100">الانتظار المتوقع</p>
                <p className="text-3xl font-black">{estimatedMinutes} د</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/10 p-4">
                <QrCode className="h-6 w-6 text-cyan-200" />
                <p className="mt-3 text-sm text-cyan-100">عدد الصفوف</p>
                <p className="text-3xl font-black">{queues.length}</p>
              </div>
            </div>

            {issuedTicket && (
              <div className="mt-6 rounded-[2rem] bg-white p-5 text-center text-slate-950">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                <p className="mt-3 text-lg font-bold">تم حجز دورك بنجاح</p>
                <p className="mt-2 text-5xl font-black text-cyan-700">{issuedTicket.code}</p>
                <p className="mt-2 text-sm text-slate-500">احتفظ بهذه الصفحة لمتابعة حالة دورك.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[2.25rem] border-0 bg-white/95 shadow-[0_24px_80px_rgba(2,132,199,0.14)]">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-slate-950">احصل على تذكرتك</CardTitle>
            <CardDescription>اختر الصف المناسب وأدخل بياناتك ليظهر رقمك مباشرة.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              {queues.map((queue) => (
                <button
                  key={queue.id}
                  type="button"
                  onClick={() => setSelectedQueueId(queue.id)}
                  className={`rounded-[1.5rem] border p-4 text-right transition ${
                    selectedQueue?.id === queue.id
                      ? "border-cyan-500 bg-cyan-50 text-cyan-900 shadow-sm"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <p className="font-bold">{queue.name}</p>
                  <p className="mt-1 text-sm opacity-75">الحالي {queue.prefix}-{String(queue.current_number).padStart(3, "0")}</p>
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customer-name">الاسم</Label>
                <Input
                  id="customer-name"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="مثال: أحمد"
                  className="h-12 rounded-2xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-phone">رقم الجوال</Label>
                <Input
                  id="customer-phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="05xxxxxxxx"
                  className="h-12 rounded-2xl"
                />
              </div>
            </div>

            <Button onClick={handleJoinQueue} className="h-12 w-full rounded-full bg-cyan-700 text-base font-bold hover:bg-cyan-800">
              <TicketIcon className="ml-2 h-5 w-5" />
              انضم إلى الصف
            </Button>

            <div className="rounded-[1.75rem] bg-slate-50 p-4">
              <p className="font-bold text-slate-950">الأرقام التي يتم خدمتها الآن</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {queues.map((queue) => (
                  <Badge key={queue.id} className="rounded-full bg-cyan-100 px-3 py-1 text-cyan-800 hover:bg-cyan-100">
                    {queue.name}: {queue.prefix}-{String(queue.current_number).padStart(3, "0")}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ShopQueue;