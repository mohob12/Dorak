import { BellRing } from "lucide-react";

type QueueNoticeProps = {
  show: boolean;
  title: string;
  message: string;
};

const QueueNotice = ({ show, title, message }: QueueNoticeProps) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 top-6 z-50 mx-auto max-w-md rounded-[2rem] border-4 border-amber-300 bg-white p-5 text-center shadow-2xl shadow-amber-200 animate-in fade-in slide-in-from-top-4">
      <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-amber-300 text-slate-950">
        <BellRing className="h-8 w-8 animate-pulse" />
      </div>
      <h3 className="text-2xl font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-base font-bold leading-7 text-slate-700">
        {message}
      </p>
    </div>
  );
};

export default QueueNotice;