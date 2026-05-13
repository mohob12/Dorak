"use client";

import { MapPin } from "lucide-react";

type CustomerNearbyButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  sent?: boolean;
};

export function CustomerNearbyButton({
  onClick,
  disabled = false,
  sent = false,
}: CustomerNearbyButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || sent}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-black transition ${
        sent
          ? "bg-emerald-100 text-emerald-800"
          : "bg-teal-700 text-white hover:bg-teal-800"
      } disabled:cursor-not-allowed disabled:opacity-70`}
    >
      <MapPin className="h-4 w-4" />
      {sent ? "تم إرسال أنا قريب" : "أنا قريب"}
    </button>
  );
}