import { supabase } from "@/integrations/supabase/client";
import {
  getTrialEndsAt,
  type SubscriptionPlanId,
} from "@/lib/subscription-plans";

export type OwnerProfile = {
  id: string;
  business_name: string | null;
  shop_id: string;
  subscription_plan: SubscriptionPlanId;
  subscription_status: "trialing" | "active";
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function ensureOwnerProfile(
  userId: string,
  email: string | undefined,
  selectedPlan: SubscriptionPlanId = "trial"
) {
  const { data: existingProfile, error: selectError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (selectError) {
    throw new Error(selectError.message);
  }

  if (existingProfile) {
    return existingProfile as OwnerProfile;
  }

  const isMonthly = selectedPlan === "monthly";

  const { data: newProfile, error: insertError } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      business_name: email?.split("@")[0] || "متجري",
      shop_id: `shop-${userId.slice(0, 8)}`,
      subscription_plan: selectedPlan,
      subscription_status: isMonthly ? "active" : "trialing",
      trial_ends_at: isMonthly ? null : getTrialEndsAt(),
    })
    .select("*")
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }

  return newProfile as OwnerProfile;
}

export async function updateOwnerPlan(
  userId: string,
  selectedPlan: SubscriptionPlanId
) {
  const isMonthly = selectedPlan === "monthly";

  const { data, error } = await supabase
    .from("profiles")
    .update({
      subscription_plan: selectedPlan,
      subscription_status: isMonthly ? "active" : "trialing",
      trial_ends_at: isMonthly ? null : getTrialEndsAt(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as OwnerProfile;
}

export async function updateOwnerShopId(userId: string, shopId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      shop_id: shopId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as OwnerProfile;
}