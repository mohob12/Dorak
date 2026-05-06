import { supabase, requireSupabaseConfig } from "@/integrations/supabase/client";

export type QueueStatus = "waiting" | "called" | "done" | "skipped";

export type Business = {
  id: string;
  name: string;
  category: string;
  branch: string;
  owner_name: string;
  plan: "Free" | "Basic" | "Pro";
  brand_color: string;
};

export type BusinessQueue = {
  id: string;
  business_id: string;
  name: string;
  prefix: string;
  average_service_minutes: number;
  current_number: number;
  next_number: number;
  color: string;
};

export type Ticket = {
  id: string;
  business_id: string;
  queue_id: string;
  number: number;
  code: string;
  customer_name: string;
  phone: string;
  status: QueueStatus;
  created_at: string;
  called_at: string | null;
  notified_at: string | null;
};

export const demoBusiness: Business = {
  id: "demo-cafe",
  name: "كافيه النخبة",
  category: "مطعم ومقهى",
  branch: "فرع الرياض - التحلية",
  owner_name: "سارة أحمد",
  plan: "Pro",
  brand_color: "#0284c7",
};

export const demoQueues: BusinessQueue[] = [
  {
    id: "orders",
    business_id: demoBusiness.id,
    name: "طلبات جديدة",
    prefix: "A",
    average_service_minutes: 6,
    current_number: 102,
    next_number: 106,
    color: "sky",
  },
  {
    id: "pickup",
    business_id: demoBusiness.id,
    name: "استلام الطلبات",
    prefix: "B",
    average_service_minutes: 4,
    current_number: 42,
    next_number: 45,
    color: "emerald",
  },
  {
    id: "tables",
    business_id: demoBusiness.id,
    name: "انتظار الطاولات",
    prefix: "C",
    average_service_minutes: 10,
    current_number: 18,
    next_number: 21,
    color: "violet",
  },
];

export const makeTicketCode = (prefix: string, number: number) =>
  `${prefix}-${String(number).padStart(3, "0")}`;

export const getJoinUrl = (businessId: string, queueId?: string) => {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return `${origin}/shop/${businessId}${queueId ? `?queue=${queueId}` : ""}`;
};

export const getQrImageUrl = (url: string) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=14&data=${encodeURIComponent(url)}`;

export const fetchBusiness = async (businessId: string) => {
  requireSupabaseConfig();

  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", businessId)
    .maybeSingle();

  if (error) throw error;
  return data as Business | null;
};

export const fetchQueues = async (businessId: string) => {
  requireSupabaseConfig();

  const { data, error } = await supabase
    .from("queues")
    .select("*")
    .eq("business_id", businessId)
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as BusinessQueue[];
};

export const fetchTickets = async (businessId: string) => {
  requireSupabaseConfig();

  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Ticket[];
};

export const seedDemoShop = async () => {
  requireSupabaseConfig();

  const { error: businessError } = await supabase.from("businesses").upsert(demoBusiness);
  if (businessError) throw businessError;

  const { error: queuesError } = await supabase.from("queues").upsert(demoQueues);
  if (queuesError) throw queuesError;
};

export const joinQueue = async (
  business: Business,
  queue: BusinessQueue,
  customerName: string,
  phone: string,
) => {
  requireSupabaseConfig();

  const number = Math.max(queue.next_number, queue.current_number + 1);
  const ticket = {
    business_id: business.id,
    queue_id: queue.id,
    number,
    code: makeTicketCode(queue.prefix, number),
    customer_name: customerName,
    phone,
    status: "waiting" as QueueStatus,
  };

  const { data, error } = await supabase.from("tickets").insert(ticket).select("*").single();
  if (error) throw error;

  const { error: queueError } = await supabase
    .from("queues")
    .update({ next_number: number + 1 })
    .eq("id", queue.id);

  if (queueError) throw queueError;
  return data as Ticket;
};

export const callNextTicket = async (queue: BusinessQueue, tickets: Ticket[]) => {
  requireSupabaseConfig();

  const nextTicket = tickets
    .filter((ticket) => ticket.queue_id === queue.id && ticket.status === "waiting")
    .sort((a, b) => a.number - b.number)[0];

  if (!nextTicket) {
    const { error } = await supabase
      .from("queues")
      .update({ current_number: queue.current_number + 1 })
      .eq("id", queue.id);

    if (error) throw error;
    return null;
  }

  const { data, error } = await supabase
    .from("tickets")
    .update({ status: "called", called_at: new Date().toISOString(), notified_at: new Date().toISOString() })
    .eq("id", nextTicket.id)
    .select("*")
    .single();

  if (error) throw error;

  const { error: queueError } = await supabase
    .from("queues")
    .update({ current_number: nextTicket.number })
    .eq("id", queue.id);

  if (queueError) throw queueError;
  return data as Ticket;
};

export const updateTicketStatus = async (ticketId: string, status: QueueStatus) => {
  requireSupabaseConfig();

  const { error } = await supabase.from("tickets").update({ status }).eq("id", ticketId);
  if (error) throw error;
};

export const skipNextTicket = async (queue: BusinessQueue, tickets: Ticket[]) => {
  requireSupabaseConfig();

  const nextTicket = tickets
    .filter((ticket) => ticket.queue_id === queue.id && ticket.status === "waiting")
    .sort((a, b) => a.number - b.number)[0];

  if (!nextTicket) return null;

  const { data, error } = await supabase
    .from("tickets")
    .update({ status: "skipped" })
    .eq("id", nextTicket.id)
    .select("*")
    .single();

  if (error) throw error;
  return data as Ticket;
};