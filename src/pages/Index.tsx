import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, CheckCircle2, Lightbulb, RotateCcw, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";
import { MadeWithDyad } from "@/components/made-with-dyad";

type Puzzle = {
  question: string;
  hint: string;
  options: string[];
  answer: string;
};

const puzzles: Puzzle[] = [
  {
    question: "أنا أصفر وأحبني القرود، ما أنا؟",
    hint: "فكّر في فاكهة لذيذة.",
    options: ["تفاحة", "موز", "برتقال"],
    answer: "موز",
  },
  {
    question: "أملك أربع عجلات وأساعدك على السفر، ما أنا؟",
    hint: "وسيلة نقل",
    options: ["سيارة", "طائرة", "سفينة"],
    answer: "سيارة",
  },
  {
    question: "أضيء في السماء ليلًا، ما أنا؟",
    hint: "أظهر مع القمر في الليل.",
    options: ["الشمس", "النجمة", "الثلج"],
    answer: "النجمة",
  },
  {
    question: "ما الشيء الذي نرتديه في أقدامنا؟",
    hint: "نستخدمه للمشي والخروج.",
    options: ["قبعة", "حذاء", "قميص"],
    answer: "حذاء",
  },
  {
    question: "لدي صفحات كثيرة ونقرأني، ما أنا؟",
    hint: "تحبه الكتب.",
    options: ["كتاب", "كرسي", "باب"],
    answer: "كتاب",
  },
];

const Index = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const currentPuzzle = puzzles[currentIndex];

  const progress = useMemo(
    () => ((currentIndex + (completed ? 1 : 0)) / puzzles.length) * 100,
    [currentIndex, completed],
  );

  const handleAnswer = (option: string) => {
    if (selectedAnswer || completed) return;

    setSelectedAnswer(option);

    if (option === currentPuzzle.answer) {
      setScore((value) => value + 1);
      toast.success("أحسنت! إجابة رائعة ✨");
    } else {
      toast.error("لا بأس، جرّب مرة أخرى!");
    }

    window.setTimeout(() => {
      const nextIndex = currentIndex + 1;

      if (nextIndex >= puzzles.length) {
        setCompleted(true);
      } else {
        setCurrentIndex(nextIndex);
      }

      setSelectedAnswer(null);
    }, 900);
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setCompleted(false);
    toast.success("بدأنا من جديد! هيا نلعب 🎉");
  };

  return (
    <div className="min-h-screen bg-[#f6fbff] text-slate-800">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-80px] top-10 h-40 w-40 rounded-full bg-[#ffd8a8]/70 blur-3xl" />
        <div className="absolute right-[-60px] top-32 h-44 w-44 rounded-full bg-[#c7f9cc]/70 blur-3xl" />
        <div className="absolute bottom-16 left-1/4 h-52 w-52 rounded-full bg-[#d7e8ff]/80 blur-3xl" />
      </div>

      <main className="container mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="overflow-hidden rounded-[2rem] border-0 bg-white/90 shadow-[0_20px_60px_rgba(104,140,255,0.18)] backdrop-blur">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full bg-amber-100 text-amber-700 hover:bg-amber-100">
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  لعبة ألغاز للأطفال
                </Badge>
                <Badge variant="secondary" className="rounded-full">
                  <Star className="mr-1 h-3.5 w-3.5 text-yellow-500" />
                  ممتعة وسهلة
                </Badge>
              </div>

              <div className="mt-5 space-y-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                  هيا نحلّ الألغاز ونكسب النجوم!
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  اختر الإجابة الصحيحة، واحصل على نقاط، وتعلّم كلمات جديدة بطريقة مرحة ومليئة بالألوان.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-[#eef4ff] p-4">
                  <p className="text-sm font-medium text-slate-500">الدرجة</p>
                  <p className="mt-1 text-3xl font-bold text-[#4f6bed]">
                    {score}/{puzzles.length}
                  </p>
                </div>
                <div className="rounded-3xl bg-[#fff6e8] p-4">
                  <p className="text-sm font-medium text-slate-500">المستوى</p>
                  <p className="mt-1 text-3xl font-bold text-[#d9891f]">
                    {completed ? "مكتمل" : `#${currentIndex + 1}`}
                  </p>
                </div>
                <div className="rounded-3xl bg-[#e9fbef] p-4">
                  <p className="text-sm font-medium text-slate-500">النجوم</p>
                  <p className="mt-1 flex items-center gap-1 text-3xl font-bold text-[#2f9e44]">
                    <Award className="h-8 w-8" />
                    {score}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                  <span>التقدّم</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3 rounded-full bg-slate-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-0 bg-[#1f3a68] text-white shadow-[0_20px_60px_rgba(31,58,104,0.25)]">
            <CardContent className="flex h-full flex-col justify-between p-6 sm:p-8">
              <div>
                <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/90">
                  <Lightbulb className="mr-2 h-4 w-4 text-yellow-300" />
                  نصيحة
                </div>
                <p className="mt-4 text-2xl font-bold leading-9">
                  اقرأ اللغز جيدًا، ثم اختر الإجابة التي تبدو صحيحة.
                </p>
                <p className="mt-3 text-sm leading-6 text-white/75">
                  كل إجابة صحيحة تمنحك نجمة وتقرّبك من نهاية اللعبة.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-sm text-white/70">عدد الألغاز</p>
                  <p className="mt-1 text-2xl font-bold">{puzzles.length}</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-sm text-white/70">حالتك الآن</p>
                  <p className="mt-1 text-2xl font-bold">{completed ? "فائز!" : "تلعب الآن"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid flex-1 gap-6 lg:grid-cols-[1fr_0.55fr]">
          <Card className="rounded-[2rem] border-0 bg-white/95 shadow-[0_18px_50px_rgba(79,107,237,0.12)]">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-slate-900">
                {completed ? "أحسنت! أنهيت اللعبة" : `لغز ${currentIndex + 1}`}
              </CardTitle>
              <CardDescription className="text-base text-slate-500">
                {completed
                  ? "لقد انتهيت من كل الألغاز، يمكنك إعادة اللعب للحصول على نتيجة أفضل."
                  : currentPuzzle.question}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 p-6 pt-0 sm:p-8 sm:pt-0">
              {!completed ? (
                <>
                  <div className="rounded-[1.75rem] bg-[#f8fbff] p-5 text-slate-700">
                    <p className="text-sm font-medium uppercase tracking-wide text-slate-400">تلميح</p>
                    <p className="mt-2 text-lg font-semibold">{currentPuzzle.hint}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {currentPuzzle.options.map((option) => {
                      const isSelected = selectedAnswer === option;
                      const isCorrect = completed ? false : selectedAnswer === currentPuzzle.answer && option === currentPuzzle.answer;
                      const isWrong = selectedAnswer === option && option !== currentPuzzle.answer;

                      return (
                        <Button
                          key={option}
                          onClick={() => handleAnswer(option)}
                          disabled={!!selectedAnswer}
                          className={[
                            "h-auto rounded-[1.5rem] px-5 py-6 text-lg font-semibold shadow-sm transition-transform hover:scale-[1.02]",
                            option === "موز" && "bg-[#ffd166] text-slate-900 hover:bg-[#ffcc4d]",
                            option === "سيارة" && "bg-[#8ecae6] text-slate-900 hover:bg-[#77bddf]",
                            option === "النجمة" && "bg-[#ffafcc] text-slate-900 hover:bg-[#ff9cc2]",
                            option === "حذاء" && "bg-[#a8dadc] text-slate-900 hover:bg-[#93d1d4]",
                            option === "كتاب" && "bg-[#cdb4db] text-slate-900 hover:bg-[#c29fd6]",
                            isSelected && "ring-4 ring-offset-2 ring-offset-white",
                            isCorrect && "ring-4 ring-green-400",
                            isWrong && "ring-4 ring-red-300",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {isSelected && <CheckCircle2 className="mr-2 h-5 w-5" />}
                          {option}
                        </Button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="rounded-[1.75rem] bg-[#f0fff4] p-6 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#2f9e44] text-white">
                    <Award className="h-10 w-10" />
                  </div>
                  <h2 className="mt-4 text-3xl font-extrabold text-slate-900">رائع جدًا!</h2>
                  <p className="mt-2 text-lg text-slate-600">
                    حصلت على <span className="font-bold text-[#2f9e44]">{score}</span> نجوم من أصل{" "}
                    <span className="font-bold">{puzzles.length}</span>.
                  </p>
                  <Button
                    onClick={restartGame}
                    size="lg"
                    className="mt-6 rounded-full bg-[#4f6bed] px-8 hover:bg-[#3f5ad7]"
                  >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    العب مرة أخرى
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-0 bg-white/95 shadow-[0_18px_50px_rgba(79,107,237,0.12)]">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-900">قواعد بسيطة</CardTitle>
              <CardDescription className="text-slate-500">لعبة مناسبة للأطفال وتعمل على الهاتف والكمبيوتر</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-6 pt-0 sm:p-8 sm:pt-0">
              {[
                "اختر الإجابة الصحيحة من بين 3 خيارات.",
                "إذا كانت الإجابة صحيحة تحصل على نجمة.",
                "يمكنك إعادة اللعب في أي وقت.",
              ].map((item, index) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4f6bed] text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-slate-700">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <div className="mt-6">
          <MadeWithDyad />
        </div>
      </main>
    </div>
  );
};

export default Index;