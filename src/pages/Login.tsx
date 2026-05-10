import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { AuthApiError } from "@supabase/supabase-js";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";

const getArabicAuthError = (message: string) => {
  if (message.includes("Invalid login credentials")) {
    return "بيانات الدخول غير صحيحة";
  }

  if (message.includes("User already registered")) {
    return "هذا البريد الإلكتروني مسجل بالفعل";
  }

  if (message.includes("Email rate limit exceeded")) {
    return "تم تجاوز عدد المحاولات المسموح، حاول لاحقًا";
  }

  if (message.includes("Password should be at least")) {
    return "كلمة المرور يجب أن تكون أطول";
  }

  if (message.includes("Signup is disabled")) {
    return "إنشاء الحسابات متوقف حاليًا من إعدادات Supabase";
  }

  return "حدثت مشكلة أثناء تسجيل الدخول أو إنشاء الحساب";
};

const Login = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setAuthError("");
        showSuccess("تم تسجيل الدخول بنجاح");
        navigate("/dashboard");
      }

      if (event === "SIGNED_OUT") {
        setAuthError("");
      }
    });

    supabase.auth.getSession().then(({ data: sessionData, error }) => {
      if (error) {
        setAuthError(getArabicAuthError(error.message));
      }

      if (sessionData.session) {
        navigate("/dashboard");
        return;
      }

      setIsCheckingSession(false);
    });

    return () => data.subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const handler = (event: PromiseRejectionEvent) => {
      const reason = event.reason;

      if (reason instanceof AuthApiError) {
        const message = getArabicAuthError(reason.message);
        setAuthError(message);
        showError(message);
      }
    };

    window.addEventListener("unhandledrejection", handler);

    return () => {
      window.removeEventListener("unhandledrejection", handler);
    };
  }, []);

  if (isCheckingSession) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-teal-50 px-4 py-8 text-slate-950"
      >
        <div className="mx-auto max-w-md">
          <div className="rounded-[2rem] border border-teal-100 bg-white p-8 text-center shadow-xl shadow-teal-100/60">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />
            <p className="font-black text-slate-700">جاري فحص الجلسة...</p>
          </div>
        </div>
      </main>
    );
  }

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

          {authError && (
            <div className="mb-5 rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-center text-sm font-bold leading-7 text-red-700">
              {authError}
            </div>
          )}

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
                  anchor: {
                    color: "#0f766e",
                    fontWeight: "800",
                  },
                  message: {
                    color: "#b91c1c",
                    fontWeight: "700",
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