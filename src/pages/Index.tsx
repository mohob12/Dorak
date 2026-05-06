import { ArrowRight, CheckCircle2, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MadeWithDyad } from "@/components/made-with-dyad";

const highlights = [
  "واجهة متجاوبة من البداية",
  "مبنية بـ React و Tailwind",
  "جاهزة لتطوير المزايا القادمة",
];

const features = [
  {
    icon: Sparkles,
    title: "تصميم أنيق",
    description: "ألوان واضحة، مساحات مريحة، ولمسات حديثة تجعل الواجهة تبدو احترافية.",
  },
  {
    icon: Wand2,
    title: "مكونات منظمة",
    description: "اعتماد على مكونات قابلة لإعادة الاستخدام مع بنية بسيطة وسهلة التوسّع.",
  },
  {
    icon: CheckCircle2,
    title: "جاهزية للتطوير",
    description: "هيكل نظيف يساعدك على إضافة صفحات ومزايا جديدة بدون تعقيد.",
  },
];

const Index = () => {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.12),_transparent_28%)]" />
        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-8 text-center lg:text-left">
              <Badge className="rounded-full bg-blue-100 px-4 py-1 text-blue-700 hover:bg-blue-100">
                Ready to build
              </Badge>

              <div className="space-y-4">
                <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  بداية نظيفة وجذابة لمشروعك القادم
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  هذه الواجهة الأساسية مصممة لتكون جميلة وواضحة ومتجاوبة، مع
                  بنية مريحة تساعدك على تطوير التطبيق بسرعة.
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                <Button className="rounded-full px-6 py-6 text-base shadow-sm">
                  ابدأ الآن
                  <ArrowRight className="mr-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full px-6 py-6 text-base"
                >
                  استكشف البنية
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <Card className="overflow-hidden rounded-3xl border-slate-200 bg-white/90 shadow-xl backdrop-blur">
              <CardContent className="space-y-6 p-6 sm:p-8">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-600">لوحة سريعة</p>
                  <h2 className="text-2xl font-semibold text-slate-950">
                    كل ما تحتاجه للبدء
                  </h2>
                </div>

                <div className="grid gap-4">
                  {features.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={feature.title}
                        className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-1 text-left">
                          <h3 className="font-semibold text-slate-900">
                            {feature.title}
                          </h3>
                          <p className="text-sm leading-6 text-slate-600">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-2xl bg-slate-900 p-5 text-white">
                  <p className="text-sm text-slate-300">الحالة الحالية</p>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-semibold">جاهز</p>
                      <p className="mt-1 text-sm text-slate-300">
                        الصفحة الرئيسية أصبحت فعّالة وواضحة.
                      </p>
                    </div>
                    <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-300">
                      Live
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <MadeWithDyad />
    </main>
  );
};

export default Index;