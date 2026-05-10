import { supabase } from "@/integrations/supabase/client";

export type TicketStatus = "waiting" | "served";

export type Shop = {
  id: string;
  name: string;
  avg_service_minutes: number;
  created_at: string;
  owner_id: string | null;
};

export type Ticket = {
  id: string;
  shop_id: string;
  ticket_number: number | null;
  customer_name: string | null;
  status: TicketStatus;
  created_at: string;
  served_at: string | null;
};

export const DEFAULT_SHOP_ID = "dorak-demo";
export const DEFAULT_AVG_SERVICE_MINUTES = 4;

export function cleanShopId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatWaitTime(minutes: number) {
  if (minutes <= 0) {
    return "أقل من دقيقة";
  }

  if (minutes < 60) {
    return `${minutes} دقيقة`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} ساعة`;
  }

  return `${hours} ساعة و ${remainingMinutes} دقيقة`;
}

export async function ensureShop(shopId: string, ownerId?: string) {
  const normalizedShopId = cleanShopId(shopId) || DEFAULT_SHOP_ID;

  const { data: existingShop, error: selectError } = await supabase
    .from("shops")
    .select("*")
    .eq("id", normalizedShopId)
    .maybeSingle();

  if (selectError) {
    throw new Error(selectError.message);
  }

  if (existingShop) {
    const shop = existingShop as Shop;

    if (ownerId && shop.owner_id && shop.owner_id !== ownerId) {
      throw new Error("معرف هذا المتجر مرتبط بحساب صاحب عمل آخر.");
    }

    if (ownerId && !shop.owner_id) {
      const { data: claimedShop, error: updateError } = await supabase
        .from("shops")
        .update({ owner_id: ownerId })
        .eq("id", normalizedShopId)
        .select("*")
        .single();

      if (updateError) {
        throw new Error(updateError.message);
      }

      return claimedShop as Shop;
    }

    return shop;
  }

  const { data: newShop, error: insertError } = await supabase
    .from("shops")
    .insert({
      id: normalizedShopId,
      name: "متجر Dorak",
      avg_service_minutes: DEFAULT_AVG_SERVICE_MINUTES,
      owner_id: ownerId || null,
    })
    .select("*")
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }

  return newShop as Shop;
}

export async function getWaitingTickets(shopId: string) {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("shop_id", shopId)
    .eq("status", "waiting")
    .order("ticket_number", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as Ticket[];
}

export async function getTicket(ticketId: string) {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", ticketId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as Ticket | null;
}

async function getNextTicketNumber(shopId: string) {
  const { data, error } = await supabase
    .from("tickets")
    .select("ticket_number")
    .eq("shop_id", shopId)
    .order("ticket_number", { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(error.message);
  }

  const latestTicketNumber = data?.[0]?.ticket_number || 0;

  return latestTicketNumber + 1;
}

export async function createTicket(shopId: string, customerName: string) {
  const normalizedShopId = cleanShopId(shopId) || DEFAULT_SHOP_ID;
  const trimmedCustomerName = customerName.trim();

  if (!trimmedCustomerName) {
    throw new Error("يرجى إدخال الاسم أولاً");
  }

  await ensureShop(normalizedShopId);

  const nextTicketNumber = await getNextTicketNumber(normalizedShopId);

  const { data: insertedTickets, error: insertError } = await supabase
    .from("tickets")
    .insert({
      shop_id: normalizedShopId,
      ticket_number: nextTicketNumber,
      customer_name: trimmedCustomerName,
      status: "waiting",
    })
    .select("*");

  if (insertError || !insertedTickets?.length) {
    throw new Error(insertError?.message || "تعذر حجز الدور، حاول مرة أخرى.");
  }

  return insertedTickets[0] as Ticket;
}

export async function serveNextTicket(shopId: string) {
  const waitingTickets = await getWaitingTickets(shopId);
  const nextTicket = waitingTickets[0];

  if (!nextTicket) {
    return null;
  }

  const { data, error } = await supabase
    .from("tickets")
    .update({
      status: "served",
      served_at: new Date().toISOString(),
    })
    .eq("id", nextTicket.id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Ticket;
}