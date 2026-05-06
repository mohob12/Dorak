"use client";

import { CheckCircle2 } from "lucide-react";
import {
  SUBSCRIPTION_PLANS,
  type SubscriptionPlanId,
} from "@/lib/subscription-plans";

type SubscriptionPlansProps = {
  selectedPlan: SubscriptionPlanId;
  onSelectPlan: (plan: SubscriptionPlanId) => void;
};

export function SubscriptionPlans({
  selectedPlan,
  onSelectPlan,
}: SubscriptionPlansProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {SUBSCRIPTION_PLANS.map((plan) => {
        const isSelected = selectedPlan === plan.id;

        return (
          <button
            key={plan.id}
            type="button"
            onClick={() => onSelectPlan(plan.id)}
            className={`rounded-[1.7rem] border p-5 text-right transition ${
              isSelected
                ? "border-teal-500 bg-teal-50 shadow-lg shadow-teal-900/10"
                : "border-slate-100 bg-white hover:border-teal-200"
            }`}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
                {plan.badge}
              </span>
              {isSelected ? (
                <CheckCircle2 className="h-6 w-6 text-teal-700" />
              ) : null}
            </div>

            <h3 className="text-xl font-black text-slate-950">{plan.name}</h3>
            <p className="mt-2 text-2xl font-black text-teal-800">
              {plan.price}
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              {plan.description}
            </p>

            <ul className="mt-4 space-y-2">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm font-bold text-slate-600"
                >
                  <CheckCircle2 className="h-4 w-4 text-teal-700" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </button>
        );
      })}
    </div>
  );
}