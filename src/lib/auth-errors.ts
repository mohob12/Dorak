export function getAuthErrorMessage(error: unknown) {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes("invalid login credentials")) {
      return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
    }

    if (message.includes("email not confirmed")) {
      return "يرجى تأكيد البريد الإلكتروني أولاً.";
    }

    if (message.includes("user already registered")) {
      return "هذا الحساب مسجل بالفعل.";
    }

    return error.message;
  }

  return "حدث خطأ غير متوقع. حاول مرة أخرى.";
}