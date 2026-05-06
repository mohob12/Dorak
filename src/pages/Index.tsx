import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { CheckCircle2, Heart, Medal, MousePointerClick, Puzzle, RefreshCcw, Sparkles, Star, Trophy } from "lucide-react";
import { toast } from "sonner";

type PuzzlePiece = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  slotColor: string;
};

type Stage = {
  title: string;
  subtitle: string;
  difficulty: string;
  pieces: PuzzlePiece[];
};

const stages: Stage[] = [
  {
    title: "مرحلة الحيوانات الصغيرة",
    subtitle: "ضع كل حيوان في بيته الصحيح",
    difficulty: "سهل جدًا",
    pieces: [
      { id: "cat", label: "قطة", emoji: "🐱", color: "bg-amber-200 text-amber-900", slotColor: "border-amber-300 bg-amber-50" },
      { id: "dog", label: "كلب", emoji: "🐶", color: "bg-sky-200 text-sky-900", slotColor: "border-sky-300 bg-sky-50" },
      { id: "rabbit", label: "أرنب", emoji: "🐰", color: "bg-pink-200 text-pink-900", slotColor: "border-pink-300 bg-pink-50" },
    ],
  },
  {
    title: "مرحلة الفواكه",
    subtitle: "طابق الفاكهة مع ظلها",
    difficulty: "سهل",
    pieces: [
      { id: "apple", label: "تفاحة", emoji: "🍎", color: "bg-red-200 text-red-900", slotColor: "border-red-300 bg-red-50" },
      { id: "banana", label: "موز", emoji: "🍌", color: "bg-yellow-200 text-yellow-900", slotColor: "border-yellow-300 bg-yellow-50" },
      { id: "grape", label: "عنب", emoji: "🍇", color: "bg-violet-200 text-violet-900", slotColor: "border-violet-300 bg-violet-50" },
      { id: "orange", label: "برتقال", emoji: "🍊", color: "bg-orange-200 text-orange-900", slotColor: "border-orange-300 bg-orange-50" },
    ],
  },
  {
    title: "مرحلة وسائل النقل",
    subtitle: "المركبات تبحث عن مواقفها",
    difficulty: "متوسط",
    pieces: [
      { id: "car", label: "سيارة", emoji: "🚗", color: "bg-blue-200 text-blue-900", slotColor: "border-blue-300 bg-blue-50" },
      { id: "bus", label: "حافلة", emoji: "🚌", color: "bg-yellow-200 text-yellow-900", slotColor: "border-yellow-300 bg-yellow-50" },
      { id: "train", label: "قطار", emoji: "🚆", color: "bg-emerald-200 text-emerald-900", slotColor: "border-emerald-300 bg-emerald-50" },
      { id: "rocket", label: "صاروخ", emoji: "🚀", color: "bg-indigo-200 text-indigo-900", slotColor: "border-indigo-300 bg-indigo-50" },
      { id: "boat", label: "قارب", emoji: "⛵", color: "bg-cyan-200 text-cyan-900", slotColor: "border-cyan-300 bg-cyan-50" },
    ],
  },
  {
    title: "مرحلة الفضاء",
    subtitle: "رتب أصدقاء الفضاء في أماكنهم",
    difficulty: "متوسط+",
    pieces: [
      { id: "star", label: "نجمة", emoji: "⭐", color: "bg-yellow-200 text-yellow-900", slotColor: "border-yellow-300 bg-yellow-50" },
      { id: "planet", label: "كوكب", emoji: "🪐", color: "bg-purple-200 text-purple-900", slotColor: "border-purple-300 bg-purple-50" },
      { id: "moon", label: "قمر", emoji: "🌙", color: "bg-slate-200 text-slate-900", slotColor: "border-slate-300 bg-slate-50" },
      { id: "alien", label: "كائن", emoji: "👽", color: "bg-lime-200 text-lime-900", slotColor: "border-lime-300 bg-lime-50" },
      { id: "satellite", label: "قمر صناعي", emoji: "🛰️", color: "bg-sky-200 text-sky-900", slotColor: "border-sky-300 bg-sky-50" },
      { id: "comet", label: "مذنب", emoji: "☄️", color: "bg-orange-200 text-orange-900", slotColor: "border-orange-300 bg-orange-50" },
    ],
  },
  {
    title: "مرحلة البحر",
    subtitle: "الكائنات البحرية عادت للمحيط",
    difficulty: "صعب",
    pieces: [
      { id: "fish", label: "سمكة", emoji: "🐟", color: "bg-cyan-200 text-cyan-900", slotColor: "border-cyan-300 bg-cyan-50" },
      { id: "whale", label: "حوت", emoji: "🐳", color: "bg-blue-200 text-blue-900", slotColor: "border-blue-300 bg-blue-50" },
      { id: "octopus", label: "أخطبوط", emoji: "🐙", color: "bg-fuchsia-200 text-fuchsia-900", slotColor: "border-fuchsia-300 bg-fuchsia-50" },
      { id: "crab", label: "سلطعون", emoji: "🦀", color: "bg-red-200 text-red-900", slotColor: "border-red-300 bg-red-50" },
      { id: "dolphin", label: "دلفين", emoji: "🐬", color: "bg-sky-200 text-sky-900", slotColor: "border-sky-300 bg-sky-50" },
      { id: "shell", label: "صدفة", emoji: "🐚", color: "bg-rose-200 text-rose-900", slotColor: "border-rose-300 bg-rose-50" },
    ],
  },
  {
    title: "مرحلة الحديقة الكبيرة",
    subtitle: "تحدٍ أخير بقطع أكثر وتشابه أكبر",
    difficulty: "الأصعب",
    pieces: [
      { id: "flower", label: "زهرة", emoji: "🌸", color: "bg-pink-200 text-pink-900", slotColor: "border-pink-300 bg-pink-50" },
      { id: "tree", label: "شجرة", emoji: "🌳", color: "bg-green-200 text-green-900", slotColor: "border-green-300 bg-green-50" },
      { id: "bee", label: "نحلة", emoji: "🐝", color: "bg-yellow-200 text-yellow-900", slotColor: "border-yellow-300 bg-yellow-50" },
      { id: "butterfly", label: "فراشة", emoji: "🦋", color: "bg-indigo-200 text-indigo-900", slotColor: "border-indigo-300 bg-indigo-50" },
      { id: "ladybug", label: "دعسوقة", emoji: "🐞", color: "bg-red-200 text-red-900", slotColor: "border-red-300 bg-red-50" },
      { id: "sun", label: "شمس", emoji: "☀️", color: "bg-orange-200 text-orange-900", slotColor: "border-orange-300 bg-orange-50" },
      { id: "snail", label: "حلزون", emoji: "🐌", color: "bg-amber-200 text-amber-900", slotColor: "border-amber-300 bg-amber-50" },
    ],
  },
];

const praiseMessages = ["رائع!", "أحسنت!", "ذكي جدًا!", "اختيار ممتاز!", "بطل التركيب!"];

const shuffle = (items: string[]) => [...items].sort(() => Math.random() - 0.5);

const Index = () => {
  const [stageIndex, setStageIndex] = useState(0);
  const [tray, setTray] = useState<string[]>([]);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [celebrating, setCelebrating] = useState(false);

  const stage = stages[stageIndex];
  const completedCount = Object.keys(placements).length;
  const isStageComplete = completedCount === stage.pieces.length;
  const isGameComplete = isStageComplete && stageIndex === stages.length - 1;

  const stageProgress = useMemo(() => Math.round((completedCount / stage.pieces.length) * 100), [completedCount, stage.pieces.length]);
  const totalProgress = useMemo(
    () => Math.round(((stageIndex + completedCount / stage.pieces.length) / stages.length) * 100),
    [completedCount, stage.pieces.length, stageIndex],
  );

  useEffect(() => {
    setTray(shuffle(stage.pieces.map((piece) => piece.id)));
    setPlacements({});
    setSelectedPieceId(null);
    setCelebrating(false);
  }, [stageIndex, stage.pieces]);

  const getPiece = (pieceId: string) => stage.pieces.find((piece) => piece.id === pieceId);

  const placePiece = (slotId: string, pieceId: string) => {
    const piece = getPiece(pieceId);
    if (!piece || placements[slotId]) return;

    if (slotId !== pieceId) {
      setMistakes((current) => current + 1);
      setSelectedPieceId(null);
      toast.error("جرّب مرة أخرى، أنت قريب جدًا! 🌟");
      return;
    }

    const nextPlacements = { ...placements, [slotId]: pieceId };
    setPlacements(nextPlacements);
    setTray((current) => current.filter((id) => id !== pieceId));
    setSelectedPieceId(null);
    toast.success(praiseMessages[Math.floor(Math.random() * praiseMessages.length)]);

    if (Object.keys(nextPlacements).length === stage.pieces.length) {
      setCelebrating(true);
      toast.success(stageIndex === stages.length - 1 ? "أنهيت كل المراحل يا بطل! 🏆" : "اكتملت المرحلة! انتقل للتحدي التالي 🎉");
    }
  };

  const handleSlotClick = (slotId: string) => {
    if (selectedPieceId) placePiece(slotId, selectedPieceId);
  };

  const handleReturnPiece = (slotId: string) => {
    const pieceId = placements[slotId];
    if (!pieceId) return;

    setPlacements((current) => {
      const next = { ...current };
      delete next[slotId];
      return next;
    });
    setTray((current) => shuffle([...current, pieceId]));
    setCelebrating(false);
  };

  const goToNextStage = () => {
    if (!isStageComplete) return;
    setStageIndex((current) => Math.min(current + 1, stages.length - 1));
  };

  const resetStage = () => {
    setTray(shuffle(stage.pieces.map((piece) => piece.id)));
    setPlacements({});
    setSelectedPieceId(null);
    setCelebrating(false);
    toast("تمت إعادة المرحلة");
  };

  const resetGame = () => {
    setStageIndex(0);
    setMistakes(0);
    setTray(shuffle(stages[0].pieces.map((piece) => piece.id)));
    setPlacements({});
    setSelectedPieceId(null);
    setCelebrating(false);
    toast.success("لنبدأ مغامرة جديدة!");
  };

  return (
    <div dir="rtl" className="min-h-screen overflow-hidden bg-[#fff8e8] text-slate-800">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute right-[-5rem] top-[-5rem] h-64 w-64 rounded-full bg-[#ffd166]/60 blur-3xl" />
        <div className="absolute left-[-4rem] top-40 h-72 w-72 rounded-full bg-[#8ecae6]/55 blur-3xl" />
        <div className="absolute bottom-[-6rem] right-1/3 h-80 w-80 rounded-full bg-[#b8f2c2]/70 blur-3xl" />
      </div>

      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <Card className="overflow-hidden rounded-[2rem] border-4 border-white bg-[#fffdf5]/95 shadow-[0_24px_70px_rgba(240,128,128,0.18)]">
            <CardContent className="p-5 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="rounded-full bg-[#4f46e5] px-4 py-2 text-white hover:bg-[#4f46e5]">
                      <Puzzle className="ml-1.5 h-4 w-4" />
                      لعبة تركيب للأطفال
                    </Badge>
                    <Badge className="rounded-full bg-[#ffe3a3] px-4 py-2 text-[#7a4d00] hover:bg-[#ffe3a3]">
                      <Star className="ml-1.5 h-4 w-4 fill-[#f59e0b] text-[#f59e0b]" />
                      {stages.length} مراحل
                    </Badge>
                  </div>

                  <div className="max-w-3xl space-y-3">
                    <h1 className="text-4xl font-black leading-tight tracking-tight text-[#273469] sm:text-6xl">
                      ركّبها صح يا بطل!
                    </h1>
                    <p className="text-base font-medium leading-8 text-slate-600 sm:text-lg">
                      اسحب القطعة الملونة إلى مكانها الصحيح، أو اضغط على القطعة ثم اضغط على مكانها. المراحل تبدأ سهلة وتصبح أصعب خطوة بخطوة.
                    </p>
                  </div>
                </div>

                <div className="rounded-[2rem] bg-[#e7f7ff] p-4 text-center shadow-inner">
                  <div className="text-7xl sm:text-8xl">🧩</div>
                  <p className="mt-2 text-sm font-bold text-[#2563eb]">تعلم وتركيز ومرح</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-4 border-white bg-[#273469] text-white shadow-[0_18px_50px_rgba(39,52,105,0.25)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-black">
                <Trophy className="h-6 w-6 text-[#ffd166]" />
                لوحة التقدم
              </CardTitle>
              <CardDescription className="text-indigo-100">تابع إنجاز الطفل خلال اللعب</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-3xl bg-white/12 p-3">
                  <p className="text-2xl font-black">{stageIndex + 1}</p>
                  <p className="text-xs text-indigo-100">المرحلة</p>
                </div>
                <div className="rounded-3xl bg-white/12 p-3">
                  <p className="text-2xl font-black">{completedCount}/{stage.pieces.length}</p>
                  <p className="text-xs text-indigo-100">قطع صحيحة</p>
                </div>
                <div className="rounded-3xl bg-white/12 p-3">
                  <p className="text-2xl font-black">{mistakes}</p>
                  <p className="text-xs text-indigo-100">محاولات</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-indigo-100">
                  <span>تقدم المرحلة</span>
                  <span>{stageProgress}%</span>
                </div>
                <Progress value={stageProgress} className="h-3 rounded-full bg-white/20" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-indigo-100">
                  <span>تقدم اللعبة كلها</span>
                  <span>{totalProgress}%</span>
                </div>
                <Progress value={totalProgress} className="h-3 rounded-full bg-white/20" />
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid flex-1 gap-5 lg:grid-cols-[1fr_410px]">
          <Card className="rounded-[2rem] border-4 border-white bg-[#fffdf5]/95 shadow-[0_22px_65px_rgba(17,24,39,0.09)]">
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-2xl font-black text-[#273469] sm:text-3xl">{stage.title}</CardTitle>
                  <CardDescription className="mt-2 text-base font-medium text-slate-600">{stage.subtitle}</CardDescription>
                </div>
                <Badge className="rounded-full bg-[#06d6a0] px-4 py-2 text-[#073b4c] hover:bg-[#06d6a0]">{stage.difficulty}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {stage.pieces.map((slot) => {
                  const placedPiece = placements[slot.id] ? getPiece(placements[slot.id]) : null;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => (placedPiece ? handleReturnPiece(slot.id) : handleSlotClick(slot.id))}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();
                        const pieceId = event.dataTransfer.getData("text/puzzle-piece");
                        if (pieceId) placePiece(slot.id, pieceId);
                      }}
                      className={cn(
                        "group min-h-36 rounded-[2rem] border-4 border-dashed p-4 text-center transition duration-200",
                        "focus:outline-none focus:ring-4 focus:ring-[#ffd166]/70",
                        placedPiece ? "border-solid bg-white shadow-[0_12px_28px_rgba(34,197,94,0.16)]" : slot.slotColor,
                        selectedPieceId && !placedPiece && "scale-[1.02] ring-4 ring-[#4f46e5]/20",
                      )}
                    >
                      {placedPiece ? (
                        <div className="flex h-full flex-col items-center justify-center gap-2">
                          <div className={cn("flex h-20 w-20 items-center justify-center rounded-[1.6rem] text-5xl shadow-sm", placedPiece.color)}>
                            {placedPiece.emoji}
                          </div>
                          <div className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">
                            <CheckCircle2 className="h-4 w-4" />
                            صحيح
                          </div>
                          <p className="text-xs font-semibold text-slate-500">اضغط لإرجاع القطعة</p>
                        </div>
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 opacity-80">
                          <div className="text-5xl grayscale">{slot.emoji}</div>
                          <p className="text-lg font-black text-slate-700">مكان {slot.label}</p>
                          <p className="text-xs font-bold text-slate-500">اسحب هنا</p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <Separator className="bg-slate-200" />

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.6rem] bg-[#f1f7ff] p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#2563eb]">
                  <MousePointerClick className="h-5 w-5" />
                  {selectedPieceId ? `اختر مكان: ${getPiece(selectedPieceId)?.label}` : "اختر قطعة أو اسحبها إلى مكانها"}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={resetStage} className="rounded-full bg-white px-5 font-bold text-[#273469] hover:bg-white/80">
                    <RefreshCcw className="ml-2 h-4 w-4" />
                    إعادة المرحلة
                  </Button>
                  {isGameComplete ? (
                    <Button onClick={resetGame} className="rounded-full bg-[#ef476f] px-5 font-bold text-white hover:bg-[#d83d62]">
                      لعبة جديدة
                    </Button>
                  ) : (
                    <Button
                      onClick={goToNextStage}
                      disabled={!isStageComplete}
                      className="rounded-full bg-[#4f46e5] px-5 font-bold text-white hover:bg-[#4338ca] disabled:bg-slate-300 disabled:text-slate-500"
                    >
                      المرحلة التالية
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <aside className="space-y-5">
            <Card className="rounded-[2rem] border-4 border-white bg-[#fffdf5]/95 shadow-[0_18px_50px_rgba(17,24,39,0.08)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-black text-[#273469]">
                  <Sparkles className="h-6 w-6 text-[#ef476f]" />
                  صندوق القطع
                </CardTitle>
                <CardDescription className="font-medium text-slate-600">القطع المتبقية للتركيب</CardDescription>
              </CardHeader>
              <CardContent>
                {tray.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {tray.map((pieceId) => {
                      const piece = getPiece(pieceId);
                      if (!piece) return null;

                      return (
                        <button
                          key={piece.id}
                          type="button"
                          draggable
                          onDragStart={(event) => event.dataTransfer.setData("text/puzzle-piece", piece.id)}
                          onClick={() => setSelectedPieceId((current) => (current === piece.id ? null : piece.id))}
                          className={cn(
                            "rounded-[1.6rem] p-4 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#ffd166]/70",
                            piece.color,
                            selectedPieceId === piece.id && "-translate-y-1 ring-4 ring-[#4f46e5]",
                          )}
                        >
                          <div className="text-5xl">{piece.emoji}</div>
                          <p className="mt-2 text-base font-black">{piece.label}</p>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-[1.6rem] bg-emerald-50 p-6 text-center text-emerald-800">
                    <Medal className="mx-auto h-10 w-10" />
                    <p className="mt-2 text-lg font-black">كل القطع في أماكنها!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className={cn("rounded-[2rem] border-4 border-white text-center shadow-[0_18px_50px_rgba(17,24,39,0.08)]", celebrating ? "bg-[#06d6a0] text-[#073b4c]" : "bg-[#ffe8ef] text-[#8a1234]")}> 
              <CardContent className="p-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/80">
                  {isGameComplete ? <Trophy className="h-9 w-9 text-[#f59e0b]" /> : <Heart className="h-9 w-9 fill-current" />}
                </div>
                <h2 className="mt-4 text-2xl font-black">
                  {isGameComplete ? "مبروك يا بطل!" : isStageComplete ? "أنهيت المرحلة!" : "نصيحة صغيرة"}
                </h2>
                <p className="mt-2 text-sm font-bold leading-6">
                  {isGameComplete
                    ? "لقد أكملت كل المراحل من الأسهل إلى الأصعب. أنت نجم التركيب!"
                    : isStageComplete
                      ? "اضغط على المرحلة التالية لتحدٍ جديد وأكثر متعة."
                      : "لو لم تنجح القطعة من أول مرة، جرّب مكانًا آخر وتذكر شكلها ولونها."}
                </p>
              </CardContent>
            </Card>
          </aside>
        </section>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Index;
