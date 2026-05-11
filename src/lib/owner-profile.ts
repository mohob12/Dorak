import { supabase } from "@/integrations/supabase/client";
import { cleanShopId } from "@/lib/queue";
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

const makeDefaultShopId = (
  userId: string,
  businessName?: string,
  email?: string
) => {
  const preferredName = businessName?.trim() || email?.split("@")[0] || "متجري";
  const normalizedName = cleanShopId(preferredName);

  if (normalizedName) {
    return normalizedName;
  }

  return `shop-${userId.slice(0, 8)}`;
};

export async function ensureOwnerProfile(
  userId: string,
  email: string | undefined,
  selectedPlan: SubscriptionPlanId = "trial",
  businessName?: string
) {
  const { data: existingProfile, error: selectError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (selectError) {
    throw new Error(selectError.message);
  }

  const profileBusinessName =
    businessName?.trim() || email?.split("@")[0] || "متجري";

  if (existingProfile) {
    const profile = existingProfile as OwnerProfile;
    const { error: shopError } = await supabase.from("shops").upsert({
      id: profile.shop_id,
      name: profile.business_name || profileBusinessName,
      avg_service_minutes: 4,
      owner_id: userId,
    });

    if (shopError) {
      throw new Error(shopError.message);
    }

    return profile;
  }

  const isMonthly = selectedPlan === "monthly";
  const shopId = makeDefaultShopId(userId, profileBusinessName, email);

  const { data: existingShop } = await supabase
    .from("shops")
    .select("id")
    .eq("id", shopId)
    .maybeSingle();

  const finalShopId = existingShop ? `${shopId}-${userId.slice(0, 6)}` : shopId;

  const { data: newProfile, error: insertError } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      business_name: profileBusinessName,
      shop_id: finalShopId,
      subscription_plan: selectedPlan,
      subscription_status: isMonthly ? "active" : "trialing",
      trial_ends_at: isMonthly ? null : getTrialEndsAt(),
    })
    .select("*")
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }

  const { error: shopError } = await supabase.from("shops").upsert({
    id: finalShopId,
    name: profileBusinessName,
    avg_service_minutes: 4,
    owner_id: userId,
  });

  if (shopError) {
    throw new Error(shopError.message);
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
  const normalizedShopId = cleanShopId(shopId);

  if (!normalizedShopId) {
    throw new Error("معرف المتجر غير صحيح.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      shop_id: normalizedShopId,
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