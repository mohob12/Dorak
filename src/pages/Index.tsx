import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Bell, ChartBar, CheckCircle2, Clock3, Copy, LayoutGrid, Monitor, QrCode, RefreshCcw, Sparkles, Ticket, TrendingUp, Users, Volume2, Wifi, Zap } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

const stats = [
  { label: "مخدوم اليوم", value: "248", note: "+18% عن الأمس", icon: Users, tone: "bg-sky-100 text-sky-700" },
  { label: "متوسط الانتظار", value: "12 د", note: "أقل بـ 3 دقائق", icon: Clock3, tone: "bg-emerald-100 text-emerald-700" },
  { label: "الأفرع النشطة", value: "04", note: "متصل الآن", icon: LayoutGrid, tone: "bg-violet-100 text-violet-700" },
];

const queues = [
  { name: "طلبات الكافيه", now: "A-124", next: ["A-125", "A-126", "A-127"], waiting: 8, color: "bg-amber-100 text-amber-700" },
  { name: "الاستلام السريع", now: "B-038", next: ["B-039", "B-040", "B-041"], waiting: 4, color: "bg-sky-100 text-sky-700" },
  { name: "خدمة العملاء", now: "C-091", next: ["C-092", "C-093", "C-094"], waiting: 11, color: "bg-rose-100 text-rose-700" },
];

const activity = [
  { time: "10:12", text: "تم استدعاء التذكرة A-124 في فرع الرياض" },
  { time: "10:06", text: "انضم 7 عملاء عبر رمز QR" },
  { time: "09:58", text: "تم إرسال إشعار واتساب إلى العميل B-038" },
  { time: "09:44", text: "تغيير حالة التذكرة C-088 إلى مكتمل" },
];

const apiItems = [
  "POST /auth/login",
  "GET /branches/:id/queues",
  "POST /queues/:id/next",
  "POST /tickets/join",
  "POST /notifications/whatsapp",
];

const Index = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [sound, setSound] = useState(true);
  const [push, setPush] = useState(false);
  const progress = useMemo(() => 68, []);

  return (
    <div dir="rtl" className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] transition-colors">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute right-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="absolute left-[-5rem] top-40 h-64 w-64 rounded-full bg-violet-200/30 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 h-80 w-80 rounded-full bg-emerald-200/25 blur-3xl" />
        </div>

        <main className="container mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <Card className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 shadow-[0_24px_80px_rgba(59,130,246,0.12)] backdrop-blur dark:border-white/10 dark:bg-slate-950/70">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="rounded-full bg-sky-100 text-sky-700 hover:bg-sky-100">
                      <Sparkles className="ml-1 h-3.5 w-3.5" />
                      SaaS لإدارة الطوابير
                    </Badge>
                    <Badge variant="secondary" className="rounded-full">
                      <Wifi className="ml-1 h-3.5 w-3.5 text-emerald-500" />
                      متعدد الفروع
                    </Badge>
                  </div>
                  <div className="max-w-3xl space-y-3">
                    <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                      منصة عربية ذكية لتنظيم الطوابير
                    </h1>
                    <p className="text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                      لوحة تحكم احترافية لأصحاب الأعمال، شاشة عرض للمحل، وواجهة QR بسيطة للعملاء — كل ذلك مع دعم RTL، الوضع الليلي، والتنبيهات اللحظية.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-sm text-slate-500 dark:text-slate-400">الوضع الليلي</span>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-sm text-slate-500 dark:text-slate-400">الصوت</span>
                    <Switch checked={sound} onCheckedChange={setSound} />
                  </div>
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-sm text-slate-500 dark:text-slate-400">إشعارات فورية</span>
                    <Switch checked={push} onCheckedChange={setPush} />
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {stats.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-[1.5rem] bg-slate-50 p-4 dark:bg-white/5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                          <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{item.value}</p>
                        </div>
                        <div className={`rounded-2xl p-3 ${item.tone}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{item.note}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                  <span>نسبة الإشغال اليومي</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-3 rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="operations" className="space-y-6">
            <TabsList className="grid h-auto w-full grid-cols-4 rounded-[1.4rem] bg-slate-100 p-2 dark:bg-white/5">
              <TabsTrigger className="rounded-[1rem] py-3 data-[state=active]:bg-white data-[state=active]:text-slate-950 dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-white" value="operations">العمليات</TabsTrigger>
              <TabsTrigger className="rounded-[1rem] py-3 data-[state=active]:bg-white data-[state=active]:text-slate-950 dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-white" value="customer">العميل</TabsTrigger>
              <TabsTrigger className="rounded-[1rem] py-3 data-[state=active]:bg-white data-[state=active]:text-slate-950 dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-white" value="tv">شاشة العرض</TabsTrigger>
              <TabsTrigger className="rounded-[1rem] py-3 data-[state=active]:bg-white data-[state=active]:text-slate-950 dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-white" value="architecture">البنية</TabsTrigger>
            </TabsList>

            <TabsContent value="operations" className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Card className="rounded-[2rem] border-0 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:bg-slate-950/70">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">لوحة الموظف</CardTitle>
                  <CardDescription>استدعاء التالي، تخطي، وإعادة النداء بلمسة واحدة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {queues.map((queue) => (
                    <div key={queue.name} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className={`rounded-full ${queue.color}`}>{queue.waiting} في الانتظار</Badge>
                            <p className="text-lg font-bold text-slate-950 dark:text-white">{queue.name}</p>
                          </div>
                          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">الحالي: {queue.now}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="rounded-full bg-sky-600 hover:bg-sky-500"><CheckCircle2 className="ml-2 h-4 w-4" />استدعاء</Button>
                          <Button size="sm" variant="secondary" className="rounded-full"><RefreshCcw className="ml-2 h-4 w-4" />إعادة</Button>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {queue.next.map((ticket) => (
                          <Badge key={ticket} variant="outline" className="rounded-full bg-white dark:bg-slate-950">{ticket}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] border-0 bg-[#0f172a] text-white shadow-[0_18px_60px_rgba(15,23,42,0.2)]">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">إحصاءات مباشرة</CardTitle>
                  <CardDescription className="text-slate-300">عرض سريع لأهم مؤشرات الأداء</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-[1.5rem] bg-white/10 p-4">
                      <ChartBar className="h-6 w-6 text-sky-300" />
                      <p className="mt-3 text-sm text-slate-300">مخدوم اليوم</p>
                      <p className="mt-1 text-3xl font-black">248</p>
                    </div>
                    <div className="rounded-[1.5rem] bg-white/10 p-4">
                      <TrendingUp className="h-6 w-6 text-emerald-300" />
                      <p className="mt-3 text-sm text-slate-300">ذروة الساعة</p>
                      <p className="mt-1 text-3xl font-black">1:00 م</p>
                    </div>
                  </div>
                  <div className="rounded-[1.5rem] bg-white/10 p-4">
                    <p className="text-sm text-slate-300">إشعارات القناة</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span>واتساب</span>
                      <span className="font-bold text-emerald-300">مفعل</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span>SMS</span>
                      <span className="font-bold text-amber-300">اختياري</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customer" className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <Card className="rounded-[2rem] border-0 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:bg-slate-950/70">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">انضمام العميل عبر QR</CardTitle>
                  <CardDescription>لا يحتاج العميل إلى تسجيل دخول</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex aspect-square items-center justify-center rounded-[2rem] border-2 border-dashed border-sky-300 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/20">
                    <div className="text-center">
                      <QrCode className="mx-auto h-16 w-16 text-sky-600" />
                      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">QR لصالة الانتظار</p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.5rem] bg-slate-50 p-4 dark:bg-white/5">
                      <p className="text-sm text-slate-500 dark:text-slate-400">وقت الانتظار المتوقع</p>
                      <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">12 دقيقة</p>
                    </div>
                    <div className="rounded-[1.5rem] bg-slate-50 p-4 dark:bg-white/5">
                      <p className="text-sm text-slate-500 dark:text-slate-400">رقمي الآن</p>
                      <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">B-038</p>
                    </div>
                  </div>
                  <Button className="w-full rounded-full bg-sky-600 hover:bg-sky-500"><Ticket className="ml-2 h-4 w-4" />احصل على تذكرتك</Button>
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] border-0 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:bg-slate-950/70">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">الإشعارات الذكية</CardTitle>
                  <CardDescription>تنبيه عند اقتراب الدور عبر واتساب أو SMS</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-[1.5rem] bg-emerald-50 p-4 dark:bg-emerald-950/20">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300"><Bell className="h-5 w-5" />رسالة جاهزة</div>
                    <p className="mt-2 text-slate-700 dark:text-slate-300">"مرحبًا، حان دورك الآن. الرجاء التوجه إلى الكاونتر."</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-slate-50 p-4 dark:bg-white/5">
                    <p className="text-sm text-slate-500 dark:text-slate-400">تتبع الحالة</p>
                    <div className="mt-3 space-y-3">
                      {[
                        ["في الانتظار", 70],
                        ["قيد الخدمة", 18],
                        ["تم الانتهاء", 12],
                      ].map(([label, value]) => (
                        <div key={label as string}>
                          <div className="mb-1 flex items-center justify-between text-sm"><span>{label as string}</span><span>{value}%</span></div>
                          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-2 rounded-full bg-sky-500" style={{ width: `${value}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tv" className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Card className="rounded-[2rem] border-0 bg-slate-950 text-white shadow-[0_18px_60px_rgba(15,23,42,0.28)]">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">TV Mode</CardTitle>
                  <CardDescription className="text-slate-300">شاشة كاملة لعرض الأرقام الحالية والقادمة</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-[2rem] bg-white/5 p-6 text-center">
                    <p className="text-sm text-slate-400">الرقم الآن</p>
                    <p className="mt-3 text-7xl font-black tracking-tight text-sky-300">A-124</p>
                    <div className="mt-5 flex items-center justify-center gap-2 text-emerald-300"><Volume2 className="h-5 w-5" />تنبيه صوتي عند التغيير</div>
                  </div>
                  <div className="space-y-3">
                    {queues[0].next.map((ticket, index) => (
                      <div key={ticket} className="rounded-[1.5rem] bg-white/5 p-4">
                        <div className="flex items-center justify-between"><span className="text-slate-400">التالي #{index + 1}</span><span className="font-black text-white">{ticket}</span></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] border-0 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:bg-slate-950/70">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">الموارد التشغيلية</CardTitle>
                  <CardDescription>حالة الشبكة، تنبيه، واستقرار النظام</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-[1.5rem] bg-slate-50 p-4 dark:bg-white/5">
                    <span>اتصال الشبكة</span>
                    <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100">مستقر</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-[1.5rem] bg-slate-50 p-4 dark:bg-white/5">
                    <span>الصوت</span>
                    <Badge className="rounded-full bg-sky-100 text-sky-700 hover:bg-sky-100">{sound ? "مفعّل" : "متوقف"}</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-[1.5rem] bg-slate-50 p-4 dark:bg-white/5">
                    <span>الإشعارات</span>
                    <Badge className="rounded-full bg-violet-100 text-violet-700 hover:bg-violet-100">{push ? "جاهزة" : "غير مفعلة"}</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="architecture" className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <Card className="rounded-[2rem] border-0 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:bg-slate-950/70">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">البنية المقترحة</CardTitle>
                  <CardDescription>نظام بسيط، قابل للتوسع، وعملي للشركات الصغيرة والمتوسطة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  <div className="rounded-[1.5rem] bg-slate-50 p-4 dark:bg-white/5">
                    <p className="font-semibold text-slate-950 dark:text-white">Frontend</p>
                    <p>React SPA, RTL, Tailwind, shadcn/ui, PWA-ready</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-slate-50 p-4 dark:bg-white/5">
                    <p className="font-semibold text-slate-950 dark:text-white">Backend</p>
                    <p>Node.js + NestJS/Express, JWT auth, Socket.io realtime</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-slate-50 p-4 dark:bg-white/5">
                    <p className="font-semibold text-slate-950 dark:text-white">Database</p>
                    <p>PostgreSQL with multi-tenant isolation and branch support</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-slate-50 p-4 dark:bg-white/5">
                    <p className="font-semibold text-slate-950 dark:text-white">Hosting</p>
                    <p>Vercel for frontend, AWS/Supabase for backend and data</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] border-0 bg-[#0f172a] text-white shadow-[0_18px_60px_rgba(15,23,42,0.28)]">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">API وعمليات السايس</CardTitle>
                  <CardDescription className="text-slate-300">نقاط نهاية واضحة وخفيفة للبدء بسرعة</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[320px] pr-4">
                    <div className="space-y-3">
                      {apiItems.map((item) => (
                        <div key={item} className="flex items-center justify-between rounded-[1.25rem] bg-white/10 px-4 py-3">
                          <span>{item}</span>
                          <Copy className="h-4 w-4 text-slate-300" />
                        </div>
                      ))}
                    </div>
                    <Separator className="my-5 bg-white/10" />
                    <div className="space-y-3 text-sm text-slate-300">
                      <p>• خطط الاشتراك: Free / Basic / Pro</p>
                      <p>• التخصيص: شعار، ألوان، وفروع متعددة</p>
                      <p>• التحليلات: وقت الانتظار، الذروة، وعدد المخدومين</p>
                      <p>• النسخة الأولى: صفوف، شاشة TV، QR، ولوحة موظف</p>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Card className="rounded-[2rem] border-0 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:bg-slate-950/70">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">الحركة الأخيرة</CardTitle>
                <CardDescription>موجز حي للحالات والأحداث</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {activity.map((item) => (
                  <div key={item.time} className="flex items-start gap-3 rounded-[1.25rem] bg-slate-50 p-4 dark:bg-white/5">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-sky-600 text-white">{item.time.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-950 dark:text-white">{item.text}</p>
                        <span className="text-xs text-slate-400">{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-0 bg-white/85 shadow-[0_18px_60px_rgba(15,23,42,0.08)] dark:bg-slate-950/70">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">مخطط MVP</CardTitle>
                <CardDescription>خطة إطلاق مختصرة وعملية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <p>1) إعداد الهوية العربية وRTL والموضوع الداكن.</p>
                <p>2) بناء تسجيل الأعمال + الفروع + الاشتراكات.</p>
                <p>3) تنفيذ إدارة الطوابير واستدعاء التالي وإعادة النداء.</p>
                <p>4) صفحة العميل عبر QR مع وقت انتظار تقديري.</p>
                <p>5) شاشة TV مع تنبيه صوتي وتحديث لحظي.</p>
                <p>6) تحليلات أساسية + إشعارات واتساب/SMS.</p>
              </CardContent>
            </Card>
          </div>

          <MadeWithDyad />
        </main>
      </div>
    </div>
  );
};

export default Index;
