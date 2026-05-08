import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  LogOut,
  Store,
  Ticket,
  Users,
  WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QrDownloadCard from "@/components/QrDownloadCard";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";

type Shop = {
  id: string;
  name: string;
  avg_service_minutes: number;
  owner_id: string | null;
};

type TicketRow = {
  id: string;
  ticket_number: number;
  status: string;
  created_at: string;
};

const makeShopId = () =>
  `shop-${Math.random().toString(36).slice(2, 8)}${Date.now()
    .toString(36)
    .slice(-4)}`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [shop, setShop] = useState<Shop | null>(null);
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [businessName, setBusinessName] = useState("");
  const [avgMinutes, setAvgMinutes] = useState(4);
  const [isLoading, setIsLoading] = useState(true);

  const waitingTickets = useMemo(
    () =>
      tickets
        .filter((ticket) => ticket.status === "waiting")
        .sort((a, b) => a.ticket_number - b.ticket_number),
    [tickets],
  );

  const fetchTickets = async (shopId: string) => {
    const { data, error } = await supabase
      .from("tickets")
      .select("id,ticket_number,status,created_at")
      .eq("shop_id", shopId)
      .eq("status", "waiting")
      .order("ticket_number", { ascending: true });

    if (error) {
      showError("تعذر تحميل الطابور");
      return;
    }

    setTickets(data ?? []);
  };

  const ensureShop = async (ownerId: string, email?: string) => {
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("shop_id,business_name")
      .eq("id", ownerId)
      .maybeSingle();

    if (existingProfile?.shop_id) {
      const { data: existingShop, error: shopError } = await supabase
        .from("shops")
        .select("id,name,avg_service_minutes,owner_id")
        .eq("id", existingProfile.shop_id)
        .maybeSingle();

      if (shopError) {
        showError("تعذر تحميل بيانات المتجر");
        return;
      }

      if (existingShop) {
        setShop(existingShop);
        setBusinessName(existingShop.name);
        setAvgMinutes(existingShop.avg_service_minutes);
        await fetchTickets(existingShop.id);
        return;
      }
    }

    const newShopId = makeShopId();
    const fallbackName = email ? `متجر ${email.split("@")[0]}` : "متجر Dorak";

    const { data: newShop, error: shopCreateError } = await supabase
      .from("shops")
      .insert({
        id: newShopId,
        name: fallbackName,
        avg_service_minutes: 4,
        owner_id: ownerId,
      })
      .select("id,name,avg_service_minutes,owner_id")
      .single();

    if (shopCreateError) {
      showError("تعذر إنشاء المتجر");
      return;
    }

    await supabase.from("profiles").upsert({
      id: ownerId,
      shop_id: newShopId,
      business_name: fallbackName,
      subscription_plan: "trial",
      subscription_status: "trialing",
      trial_ends_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    });

    setShop(newShop);
    setBusinessName(newShop.name);
    setAvgMinutes(newShop.avg_service_minutes);
    await fetchTickets(newShop.id);
    showSuccess("تم إنشاء متجرك وتجربتك المجانية");
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;

      if (!session) {
        navigate("/login");
        return;
      }

      setUserId(session.user.id);
      ensureShop(session.user.id, session.user.email).finally(() =>
        setIsLoading(false),
      );
    });
  }, [navigate]);

  useEffect(() => {
    if (!shop) {
      return;
    }

    const channel = supabase
      .channel(`dashboard-queue-${shop.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tickets",
          filter: `shop_id=eq.${shop.id}`,
        },
        () => {
          fetchTickets(shop.id);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [shop]);

  const updateShop = async () => {
    if (!shop || !businessName.trim()) {
      showError("اكتب اسم المتجر أولًا");
      return;
    }

    const cleanMinutes = Math.max(1, Number(avgMinutes) || 4);

    const { data, error } = await supabase
      .from("shops")
      .update({
        name: businessName.trim(),
        avg_service_minutes: cleanMinutes,
      })
      .eq("id", shop.id)
      .select("id,name,avg_service_minutes,owner_id")
      .single();

    if (error) {
      showError("تعذر حفظ بيانات المتجر");
      return;
    }

    await supabase
      .from("profiles")
      .update({
        business_name: businessName.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    setShop(data);
    setAvgMinutes(data.avg_service_minutes);
    showSuccess("تم حفظ بيانات المتجر");
  };

  const callNext = async () => {
    if (!shop || waitingTickets.length === 0) {
      showError("لا يوجد عملاء في الانتظار");
      return;
    }

    const firstTicket = waitingTickets[0];

    const { error } = await supabase
      .from("tickets")
      .update({
        status: "served",
        served_at: new Date().toISOString(),
      })
      .eq("id", firstTicket.id);

    if (error) {
      showError("تعذر تمرير الدور");
      return;
    }

    showSuccess(`تم استدعاء الدور رقم ${firstTicket.ticket_number}`);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-teal-50 px-4"
      >
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />
          <p className="font-black text-slate-700">جاري تجهيز لوحة التحكم...</p>
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
          <h1 className="text-2xl font-black">تعذر فتح لوحة التحكم</h1>
          <Button asChild className="mt-5 rounded-full bg-teal-600">
            <Link to="/login">إعادة المحاولة</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-teal-50 text-slate-950">
      <header className="border-b border-teal-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-xl font-black text-white">
              د
            </div>
            <div>
              <h1 className="text-xl font-black">لوحة تحكم Dorak</h1>
              <p className="text-sm font-bold text-slate-500">{shop.name}</p>
            </div>
          </div>

          <Button
            onClick={signOut}
            variant="outline"
            className="rounded-full border-teal-200 font-bold text-teal-700 hover:bg-teal-50"
          >
            <LogOut className="ml-2 h-4 w-4" />
            خروج
          </Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[2rem] bg-white p-5 shadow-sm">
              <Users className="mb-4 h-7 w-7 text-teal-700" />
              <p className="text-sm font-bold text-slate-500">في الانتظار</p>
              <p className="mt-2 text-4xl font-black">{waitingTickets.length}</p>
            </div>
            <div className="rounded-[2rem] bg-white p-5 shadow-sm">
              <Ticket className="mb-4 h-7 w-7 text-teal-700" />
              <p className="text-sm font-bold text-slate-500">الدور القادم</p>
              <p className="mt-2 text-4xl font-black">
                {waitingTickets[0]?.ticket_number ?? "-"}
              </p>
            </div>
            <div className="rounded-[2rem] bg-white p-5 shadow-sm">
              <Clock className="mb-4 h-7 w-7 text-teal-700" />
              <p className="text-sm font-bold text-slate-500">متوسط الخدمة</p>
              <p className="mt-2 text-4xl font-black">
                {shop.avg_service_minutes} د
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <Store className="h-6 w-6 text-teal-700" />
              <h2 className="text-xl font-black">بيانات المتجر</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_150px_auto]">
              <Input
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                placeholder="اسم المتجر"
                className="h-12 rounded-2xl border-teal-100 font-bold"
              />
              <Input
                value={avgMinutes}
                onChange={(event) => setAvgMinutes(Number(event.target.value))}
                type="number"
                min={1}
                placeholder="دقائق الخدمة"
                className="h-12 rounded-2xl border-teal-100 font-bold"
              />
              <Button
                onClick={updateShop}
                className="h-12 rounded-2xl bg-teal-600 px-6 font-black text-white hover:bg-teal-700"
              >
                حفظ
              </Button>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-black">قائمة الانتظار</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  اضغط التالي عند الانتهاء من خدمة أول عميل.
                </p>
              </div>

              <Button
                onClick={callNext}
                className="rounded-full bg-amber-300 px-8 font-black text-slate-950 hover:bg-amber-200"
              >
                التالي
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-3">
              {waitingTickets.length === 0 ? (
                <div className="rounded-[2rem] bg-slate-50 p-8 text-center">
                  <WandSparkles className="mx-auto mb-3 h-10 w-10 text-teal-700" />
                  <p className="text-lg font-black">لا يوجد عملاء الآن</p>
                  <p className="mt-2 text-sm text-slate-500">
                    شارك QR الخاص بمتجرك ليستطيع العملاء حجز أدوارهم.
                  </p>
                </div>
              ) : (
                waitingTickets.map((ticket, index) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between rounded-[1.5rem] bg-teal-50 p-4"
                  >
                    <div>
                      <p className="text-sm font-bold text-teal-700">
                        {index === 0 ? "الدور القادم" : `قبله ${index} عميل`}
                      </p>
                      <p className="text-2xl font-black">
                        رقم {ticket.ticket_number}
                      </p>
                    </div>
                    <div className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-600">
                      ينتظر
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <aside>
          <QrDownloadCard shopId={shop.id} shopName={shop.name} />
        </aside>
      </div>
    </main>
  );
};

export default Dashboard;