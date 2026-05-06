import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const ADMIN_EMAIL = "067mohammed.dz@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("[admin-overview] Request received");

  const authHeader = req.headers.get("Authorization");

  if (!authHeader) {
    console.warn("[admin-overview] Missing authorization header");
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const token = authHeader.replace("Bearer ", "");
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

  const authClient = createClient(supabaseUrl, anonKey);
  const { data: userData, error: userError } = await authClient.auth.getUser(
    token
  );

  if (userError || userData.user?.email !== ADMIN_EMAIL) {
    console.warn("[admin-overview] Forbidden admin request", {
      email: userData.user?.email,
      error: userError?.message,
    });

    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const serviceClient = createClient(supabaseUrl, serviceRoleKey);

  const [profilesResult, shopsResult, ticketsResult] = await Promise.all([
    serviceClient
      .from("profiles")
      .select(
        "id,business_name,shop_id,subscription_plan,subscription_status,trial_ends_at,created_at"
      )
      .order("created_at", { ascending: false })
      .limit(100),
    serviceClient
      .from("shops")
      .select("id,name,avg_service_minutes,owner_id,created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    serviceClient
      .from("tickets")
      .select("id,shop_id,ticket_number,status,created_at,served_at")
      .order("created_at", { ascending: false })
      .limit(150),
  ]);

  if (profilesResult.error || shopsResult.error || ticketsResult.error) {
    console.error("[admin-overview] Failed to load admin data", {
      profilesError: profilesResult.error?.message,
      shopsError: shopsResult.error?.message,
      ticketsError: ticketsResult.error?.message,
    });

    return new Response(
      JSON.stringify({ error: "Failed to load admin data" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const profiles = profilesResult.data || [];
  const shops = shopsResult.data || [];
  const tickets = ticketsResult.data || [];
  const waitingTickets = tickets.filter((ticket) => ticket.status === "waiting");
  const servedTickets = tickets.filter((ticket) => ticket.status === "served");
  const trialProfiles = profiles.filter(
    (profile) => profile.subscription_plan === "trial"
  );
  const monthlyProfiles = profiles.filter(
    (profile) => profile.subscription_plan === "monthly"
  );

  console.log("[admin-overview] Admin data loaded", {
    profiles: profiles.length,
    shops: shops.length,
    tickets: tickets.length,
  });

  return new Response(
    JSON.stringify({
      stats: {
        owners: profiles.length,
        shops: shops.length,
        tickets: tickets.length,
        waitingTickets: waitingTickets.length,
        servedTickets: servedTickets.length,
        trialOwners: trialProfiles.length,
        monthlyOwners: monthlyProfiles.length,
      },
      profiles,
      shops,
      tickets,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
});