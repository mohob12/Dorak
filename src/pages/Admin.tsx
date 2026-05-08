import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Crown, LogOut, Shield, Store, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

type ShopRow = {
  id: string;
  name: string;
  avg_service_minutes: number;
  owner_id: string | null;
  created_at: string;
};

type TicketRow = {
  id: string;
  shop_id: string;
  status: string;
};

type ProfileRow = {
  id: string;
  business_name: string | null;
  subscription_plan: string;
  subscription_status: string;
  trial_ends_at: string | null;
};

const ADMIN_EMAIL = "067mohammed.dz@gmail.com";

const Admin = () => {
  const navigate = useNavigate();
  const [isAllowed, setIsAllowed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shops, setShops] = useState<ShopRow[]>([]);
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);

  const waitingTickets = useMemo(
    () => tickets.filter((ticket) => ticket.status === "waiting"),
    [tickets],
  );

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session;

      if (!session) {
        navigate("/login");
        return;
      }

      if (session.user.email !== ADMIN_EMAIL) {
        showError("هذه الصفحة مخصصة للإدارة فقط");
        navigate("/dashboard");
        return;
      }

      setIsAllowed(true);

      const [shopsResult, ticketsResult, profilesResult] = await Promise.all([
        supabase
          .from("shops")
          .select("id,name,avg_service_minutes,owner_id,created_at")
          .order("created_at", { ascending: false }),
        supabase.from("tickets").select("id,shop_id,status"),
        supabase
          .from("profiles")
          .select(
            "id,business_name,subscription_plan,subscription_status,trial_ends_at",
          ),
      ]);

      if (shopsResult.error || ticketsResult.error || profilesResult.error) {
        showError("تعذر تحميل بيانات الإدارة");
      }

      setShops(shopsResult.data ?? []);
      setTickets(ticketsResult.data ?? []);
      setProfiles(profilesResult.data ?? []);
      setIsLoading(false);
    });
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-slate-950 px-4"
      >
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />
          <p className="font-black text-slate-700">جاري تحميل لوحة الإدارة...</p>
        </div>
      </main>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300 text-slate-950">
              <Shield className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-black">لوحة إدارة Dorak الخاصة</h1>
              <p className="text-sm text-white/60">رابط خاص بالمبرمج فقط</p>
            </div>
          </div>

          <Button
            onClick={signOut}
            className="rounded-full bg-white text-slate-950 hover:bg-slate-100"
          >
            <LogOut className="ml-2 h-4 w-4" />
            خروج
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <Link
          to="/dashboard"
          className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/15"
        >
          <ArrowRight className="h-4 w-4" />
          لوحة صاحب العمل
        </Link>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-5 text-slate-950">
            <Store className="mb-4 h-8 w-8 text-teal-700" />
            <p className="text-sm font-bold text-slate-500">عدد المتاجر</p>
            <p className="mt-2 text-4xl font-black">{shops.length}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-5 text-slate-950">
            <Ticket className="mb-4 h-8 w-8 text-teal-700" />
            <p className="text-sm font-bold text-slate-500">تذاكر الانتظار</p>
            <p className="mt-2 text-4xl font-black">{waitingTickets.length}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-5 text-slate-950">
            <Crown className="mb-4 h-8 w-8 text-amber-500" />
            <p className="text-sm font-bold text-slate-500">الحسابات</p>
            <p className="mt-2 text-4xl font-black">{profiles.length}</p>
          </div>
        </div>

        <div className="mt-5 rounded-[2rem] bg-white p-5 text-slate-950">
          <h2 className="mb-4 text-2xl font-black">المتاجر المسجلة</h2>
          <div className="space-y-3">
            {shops.map((shop) => {
              const profile = profiles.find(
                (item) => item.id === shop.owner_id,
              );
              const shopWaitingCount = waitingTickets.filter(
                (ticket) => ticket.shop_id === shop.id,
              ).length;

              return (
                <div
                  key={shop.id}
                  className="grid gap-3 rounded-[1.5rem] bg-slate-50 p-4 md:grid-cols-[1fr_auto_auto]"
                >
                  <div>
                    <p className="text-lg font-black">{shop.name}</p>
                    <p className="break-all text-sm font-semibold text-slate-500">
                      /shop/{shop.id}
                    </p>
                  </div>
                  <div className="rounded-full bg-teal-50 px-4 py-2 text-center text-sm font-black text-teal-700">
                    {shopWaitingCount} في الانتظار
                  </div>
                  <div className="rounded-full bg-amber-50 px-4 py-2 text-center text-sm font-black text-amber-700">
                    {profile?.subscription_plan ?? "trial"} ·{" "}
                    {profile?.subscription_status ?? "trialing"}
                  </div>
                </div>
              );
            })}

            {shops.length === 0 && (
              <div className="rounded-[1.5rem] bg-slate-50 p-8 text-center">
                <p className="font-black text-slate-600">لا توجد متاجر بعد</p>
              </div>
            )}
          </div>
        </div>

        <p className="mt-5 rounded-[1.5rem] border border-amber-300/30 bg-amber-300/10 p-4 text-sm font-bold leading-7 text-amber-100">
          الرابط الخاص بك: /dorak-admin-067 — ادخل بنفس بريدك
          067mohammed.dz@gmail.com وكلمة المرور التي اخترتها في Supabase Auth.
        </p>
      </div>
    </main>
  );
};

export default Admin;