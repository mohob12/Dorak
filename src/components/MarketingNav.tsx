import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const MarketingNav = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-teal-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-600 text-lg font-black text-white shadow-lg shadow-teal-200">
            د
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-slate-950">دورك</p>
            <p className="text-xs font-semibold text-teal-700">
              إدارة الطوابير الذكية
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden rounded-full px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-teal-50 hover:text-teal-700 sm:inline-flex"
          >
            دخول أصحاب العمل
          </Link>
          <Button
            asChild
            className="rounded-full bg-teal-600 px-5 font-bold text-white shadow-lg shadow-teal-100 hover:bg-teal-700"
          >
            <Link to="/login">
              ابدأ الآن
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MarketingNav;