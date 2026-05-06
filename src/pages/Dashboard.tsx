import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import {
  Business,
  BusinessQueue,
  Ticket,
  callNextTicket,
  demoBusiness,
  fetchBusiness,
  fetchQueues,
  fetchTickets,
  getJoinUrl,
  getQrImageUrl,
  seedDemoShop,
  skipNextTicket,
  updateTicketStatus,
} from "@/lib/queue-db";
import { Bell, CheckCircle2, Copy, Database, RefreshCcw, Sparkles, Ticket as TicketIcon, Users } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [queues, setQueues] = useState<BusinessQueue[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const businessId = demoBusiness.id;

  const calledTickets = useMemo(
    () => tickets.filter((ticket) => ticket.status === "called").sort((a, b) => b.number - a.number),
    [tickets],
  );

  const waitingTickets = useMemo(
    () => tickets.filter((ticket) => ticket.status === "waiting"),
    [tickets],
  );

  const servedToday = useMemo(
    () => tickets.filter((ticket) => ticket.status === "done").length,
    [tickets],
  );

  const loadDashboard = async () => {
    if (!isSupabaseConfigured) return;

    const [businessData, queuesData, ticketsData] = await Promise.all([
      fetchBusiness(businessId),
      fetchQueues(businessId),
      fetchTickets(businessId),
    ]);

    setBusiness(businessData);
    setQueues(queuesData);
    setTickets(ticketsData);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel(`dashboard-${businessId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "tickets", filter: `business_id=eq.${businessId}` }, loadDashboard)
      .on("postgres_changes", { event: "*", schema: "public", table: "queues", filter: `business_id=eq.${businessId}` }, loadDashboard)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSeedDemo = async () => {
    await seedDemoShop();
    toast.success("تم إنشاء متجر تجريبي وصفوف جاهزة");
    loadDashboard();
  };

  const handleCallNext = async (queue: BusinessQueue) => {
    const ticket = await callNextTicket(queue, tickets);
    toast.success(ticket ? `تم استدعاء ${ticket.code}` : "تم تحديث رقم الصف");
    loadDashboard();
  };

  const handleSkip = async (queue: BusinessQueue) => {
    const ticket = await skipNextTicket(queue, tickets);
    toast.success(ticket ? `تم تخطي ${ticket.code}` : "لا توجد تذاكر في الانتظار");
    loadDashboard();
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("تم نسخ الرابط");
  };

  const handleDone = async (ticket: Ticket) => {
    await updateTicketStatus(ticket.id, "done");
    toast.success(`تم إنهاء ${ticket.code}`);
    loadDashboard();
  };

  if (!isSupabaseConfigured) {
    return (
      <div dir="rtl" className="flex min-h-screen items-center justify-center bg-[#f4f9ff] p-4">
        <Card className="w-full max-w-xl rounded-[2rem] border-0 bg-white/95 text-center shadow-[0_24px_80px_rgba(2,132,199,0.16)]">
          <CardHeader>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
              <Database className="h-7 w-7" />
            </div>
            <CardTitle className="text-3xl font-black text-slate-950">Supabase غير متصل بعد</CardTitle>
            <CardDescription className="text-base">
              أضف متغيرات VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY من إعدادات التكامل، ثم أعد تشغيل المعاينة.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!business) {
    return (
      <div dir="rtl" className="flex min-h-screen items-center justify-center bg-[#f4f9ff] p-4">
        <Card className="w-full max-w-xl rounded-[2rem] border-0 bg-white/95 text-center shadow-[0_24px_80px_rgba(2,132,199,0.16)]">
          <CardHeader>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
              <Sparkles className="h-7 w-7" />
            </div>
            <CardTitle className="text-3xl font-black text-slate-950">ابدأ بمتجر تجريبي</CardTitle>
            <CardDescription className="text-base">سيتم إنشاء بيانات أولية في Supabase لتجربة لوحة التحكم وصفحة QR.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSeedDemo} className="h-12 rounded-full bg-cyan-700 px-8 text-base font-bold hover:bg-cyan-800">
              إنشاء متجر وصفوف
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f4f9ff] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <main className="mx-auto flex max-w-7xl flex-col gap-6">
        <Card className="overflow-hidden rounded-[2.25rem] border-0 bg-white/95 shadow-[0_24px_80px_rgba(2,132,199,0.12)]">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <Badge className="rounded-full bg-cyan-100 text-cyan-800 hover:bg-cyan-100">
                  <Sparkles className="ml-1 h-3.5 w-3.5" />
                  لوحة إدارة الطوابير
                </Badge>
                <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">{business.name}</h1>
                <p className="mt-3 text-lg text-slate-600">{business.branch} · {business.category}</p>
              </div>
              <div className="rounded-[1.75rem] bg-cyan-700 p-5 text-white">
                <p className="text-sm text-cyan-100">رابط العميل العام</p>
                <p className="mt-2 max-w-xs truncate text-sm font-bold">{getJoinUrl(business.id)}</p>
                <Button
                  onClick={() => handleCopy(getJoinUrl(business.id))}
                  className="mt-4 rounded-full bg-white text-cyan-800 hover:bg-cyan-50"
                >
                  <Copy className="ml-2 h-4 w-4" />
                  نسخ الرابط
                </Button>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <Users className="h-6 w-6 text-cyan-700" />
                <p className="mt-3 text-sm text-slate-500">في الانتظار</p>
                <p className="text-3xl font-black text-slate-950">{waitingTickets.length}</p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <Bell className="h-6 w-6 text-amber-600" />
                <p className="mt-3 text-sm text-slate-500">قيد الخدمة</p>
                <p className="text-3xl font-black text-slate-950">{calledTickets.length}</p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                <p className="mt-3 text-sm text-slate-500">مكتمل</p>
                <p className="text-3xl font-black text-slate-950">{servedToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-[2rem] border-0 bg-white/95 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <CardHeader>
              <CardTitle className="text-2xl font-black">الصفوف النشطة</CardTitle>
              <CardDescription>استدعاء التالي أو تخطي أول تذكرة في الانتظار.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {queues.map((queue) => {
                const queueWaiting = tickets.filter((ticket) => ticket.queue_id === queue.id && ticket.status === "waiting");
                const joinUrl = getJoinUrl(business.id, queue.id);

                return (
                  <div key={queue.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-xl font-black text-slate-950">{queue.name}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          الحالي {queue.prefix}-{String(queue.current_number).padStart(3, "0")} · {queueWaiting.length} في الانتظار
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button onClick={() => handleCallNext(queue)} className="rounded-full bg-cyan-700 hover:bg-cyan-800">
                          <TicketIcon className="ml-2 h-4 w-4" />
                          استدعاء التالي
                        </Button>
                        <Button onClick={() => handleSkip(queue)} variant="outline" className="rounded-full">
                          تخطي
                        </Button>
                        <Button onClick={() => loadDashboard()} variant="secondary" className="rounded-full">
                          <RefreshCcw className="ml-2 h-4 w-4" />
                          تحديث
                        </Button>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid gap-4 sm:grid-cols-[150px_1fr]">
                      <div className="rounded-[1.25rem] bg-white p-3 text-center">
                        <img src={getQrImageUrl(joinUrl)} alt={`QR ${queue.name}`} className="mx-auto h-28 w-28 rounded-xl" />
                        <p className="mt-2 text-xs text-slate-500">QR للصف</p>
                      </div>
                      <div className="min-w-0 rounded-[1.25rem] bg-white p-4">
                        <p className="text-sm font-semibold text-slate-950">رابط الانضمام</p>
                        <p className="mt-2 truncate text-sm text-slate-500">{joinUrl}</p>
                        <Button onClick={() => handleCopy(joinUrl)} variant="secondary" className="mt-3 rounded-full">
                          <Copy className="ml-2 h-4 w-4" />
                          نسخ رابط الصف
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-0 bg-[#083344] text-white shadow-[0_18px_60px_rgba(8,51,68,0.24)]">
            <CardHeader>
              <CardTitle className="text-2xl font-black">التذاكر المستدعاة</CardTitle>
              <CardDescription className="text-cyan-100">إنهاء الخدمة ينقل التذكرة إلى مكتملة.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {calledTickets.length === 0 ? (
                <div className="rounded-[1.5rem] bg-white/10 p-4 text-cyan-50">لا توجد تذاكر قيد الخدمة الآن.</div>
              ) : (
                calledTickets.map((ticket) => (
                  <div key={ticket.id} className="rounded-[1.5rem] bg-white/10 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-2xl font-black">{ticket.code}</p>
                        <p className="mt-1 text-sm text-cyan-100">{ticket.customer_name} · {ticket.phone}</p>
                      </div>
                      <Button onClick={() => handleDone(ticket)} className="rounded-full bg-white text-cyan-800 hover:bg-cyan-50">
                        إنهاء
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[2rem] border-0 bg-white/95 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <CardHeader>
            <CardTitle className="text-2xl font-black">آخر التذاكر</CardTitle>
            <CardDescription>سجل مباشر من Supabase Realtime.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tickets.slice(0, 9).map((ticket) => (
              <div key={ticket.id} className="rounded-[1.5rem] bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xl font-black text-slate-950">{ticket.code}</p>
                    <p className="mt-1 text-sm text-slate-500">{ticket.customer_name}</p>
                  </div>
                  <Badge className="rounded-full bg-cyan-100 text-cyan-800 hover:bg-cyan-100">
                    {ticket.status === "waiting" ? "انتظار" : ticket.status === "called" ? "قيد الخدمة" : ticket.status === "done" ? "مكتمل" : "متخطى"}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;