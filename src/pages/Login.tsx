import { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/dashboard");
      }
    });

    supabase.auth.getSession().then(({ data: sessionData }) => {
      if (sessionData.session) {
        navigate("/dashboard");
      }
    });

    return () => data.subscription.unsubscribe();
  }, [navigate]);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-teal-50 px-4 py-8 text-slate-950"
    >
      <div className="mx-auto max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-teal-700 shadow-sm hover:bg-teal-50"
        >
          <ArrowRight className="h-4 w-4" />
          العودة للرئيسية
        </Link>

        <div className="rounded-[2rem] border border-teal-100 bg-white p-6 shadow-xl shadow-teal-100/60">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-teal-600 text-white">
              <LockKeyhole className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-black">دخول أصحاب العمل</h1>
            <p className="mt-3 leading-7 text-slate-600">
              أنشئ حسابك وابدأ تجربة Dorak المجانية لمدة 3 أيام.
            </p>
          </div>

          <div className="auth-rtl">
            <Auth
              supabaseClient={supabase}
              providers={[]}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: "#0f766e",
                      brandAccent: "#0d9488",
                    },
                    radii: {
                      borderRadiusButton: "999px",
                      inputBorderRadius: "18px",
                    },
                  },
                },
                style: {
                  button: {
                    fontWeight: "800",
                    padding: "12px 16px",
                  },
                  input: {
                    padding: "13px 14px",
                    fontWeight: "600",
                  },
                  label: {
                    fontWeight: "800",
                    color: "#334155",
                  },
                },
              }}
              localization={{
                variables: {
                  sign_in: {
                    email_label: "البريد الإلكتروني",
                    password_label: "كلمة المرور",
                    button_label: "تسجيل الدخول",
                    loading_button_label: "جاري الدخول...",
                    social_provider_text: "الدخول بواسطة {{provider}}",
                    link_text: "لديك حساب؟ سجّل الدخول",
                  },
                  sign_up: {
                    email_label: "البريد الإلكتروني",
                    password_label: "كلمة المرور",
                    button_label: "إنشاء حساب",
                    loading_button_label: "جاري إنشاء الحساب...",
                    social_provider_text: "التسجيل بواسطة {{provider}}",
                    link_text: "ليس لديك حساب؟ أنشئ حسابًا",
                  },
                  forgotten_password: {
                    email_label: "البريد الإلكتروني",
                    button_label: "إرسال رابط الاسترجاع",
                    loading_button_label: "جاري الإرسال...",
                    link_text: "نسيت كلمة المرور؟",
                  },
                },
              }}
              theme="light"
            />
          </div>

          <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-center text-sm font-bold leading-7 text-amber-800">
            بعد التسجيل ستنتقل إلى لوحة تحكمك لإنشاء متجر QR وإدارة الطابور.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;