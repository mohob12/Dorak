export type QueueStatus = "waiting" | "called" | "done" | "skipped";

export type BusinessQueue = {
  id: string;
  businessId: string;
  name: string;
  prefix: string;
  averageServiceMinutes: number;
  currentNumber: number;
  nextNumber: number;
  color: string;
};

export type Ticket = {
  id: string;
  businessId: string;
  queueId: string;
  number: number;
  code: string;
  customerName: string;
  phone: string;
  status: QueueStatus;
  createdAt: string;
  calledAt?: string;
  notifiedAt?: string;
};

export type Business = {
  id: string;
  name: string;
  category: string;
  branch: string;
  ownerName: string;
  plan: "Free" | "Basic" | "Pro";
  brandColor: string;
};

export const demoBusiness: Business = {
  id: "demo-cafe",
  name: "كافيه النخبة",
  category: "مطعم ومقهى",
  branch: "فرع الرياض - التحلية",
  ownerName: "سارة أحمد",
  plan: "Pro",
  brandColor: "#0284c7",
};

export const demoQueues: BusinessQueue[] = [
  {
    id: "orders",
    businessId: demoBusiness.id,
    name: "طلبات جديدة",
    prefix: "A",
    averageServiceMinutes: 6,
    currentNumber: 102,
    nextNumber: 106,
    color: "sky",
  },
  {
    id: "pickup",
    businessId: demoBusiness.id,
    name: "استلام الطلبات",
    prefix: "B",
    averageServiceMinutes: 4,
    currentNumber: 42,
    nextNumber: 45,
    color: "emerald",
  },
  {
    id: "tables",
    businessId: demoBusiness.id,
    name: "انتظار الطاولات",
    prefix: "C",
    averageServiceMinutes: 10,
    currentNumber: 18,
    nextNumber: 21,
    color: "violet",
  },
];

export const demoTickets: Ticket[] = [
  {
    id: "ticket-a103",
    businessId: demoBusiness.id,
    queueId: "orders",
    number: 103,
    code: "A-103",
    customerName: "محمد علي",
    phone: "0501234567",
    status: "waiting",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "ticket-a104",
    businessId: demoBusiness.id,
    queueId: "orders",
    number: 104,
    code: "A-104",
    customerName: "نورة خالد",
    phone: "0559876543",
    status: "waiting",
    createdAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
  },
  {
    id: "ticket-b043",
    businessId: demoBusiness.id,
    queueId: "pickup",
    number: 43,
    code: "B-043",
    customerName: "سلمان",
    phone: "0533334444",
    status: "waiting",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
];

export const getJoinUrl = (businessId: string, queueId: string) => {
  const origin = typeof window === "undefined" ? "https://queue.sa" : window.location.origin;
  return `${origin}/join/${businessId}/${queueId}`;
};

export const makeTicketCode = (prefix: string, number: number) => `${prefix}-${String(number).padStart(3, "0")}`;

export const getWaitingTickets = (tickets: Ticket[], queueId: string) =>
  tickets
    .filter((ticket) => ticket.queueId === queueId && ticket.status === "waiting")
    .sort((a, b) => a.number - b.number);

export const estimateWaitMinutes = (tickets: Ticket[], queue: BusinessQueue, ticketNumber?: number) => {
  const waitingBefore = getWaitingTickets(tickets, queue.id).filter((ticket) =>
    ticketNumber ? ticket.number < ticketNumber : true,
  ).length;
  return Math.max(waitingBefore, 0) * queue.averageServiceMinutes;
};

export const downloadTextFile = (fileName: string, content: string) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
