export type PlanDeliveryItem = {
  title: "Home Zero" | "Gym Build" | "Fuel Plan" | "Zero to Growth";
  storageKey: string;
  fileName: string;
};

const planDeliveryCatalog: readonly PlanDeliveryItem[] = [
  {
    title: "Home Zero",
    storageKey: "HOME_ZERO__No_Equipment_Home_Workout_cbd61a9d.pdf",
    fileName: "Home-Zero-No-Equipment-Workout.pdf",
  },
  {
    title: "Gym Build",
    storageKey: "Gym_Build__Build_With_Coach_8f1ff4a5.pdf",
    fileName: "Gym-Build-Training-Plan.pdf",
  },
  {
    title: "Fuel Plan",
    storageKey: "FUEL_PLAN__Simple_Diet__Nutrition_for_Home_and_Gym_7e024d47.pdf",
    fileName: "Fuel-Plan-Simple-Diet.pdf",
  },
  {
    title: "Zero to Growth",
    storageKey: "ZERO_TO_GROWTH__Full_Transformation_Roadmap_a8f7b30c.pdf",
    fileName: "Zero-to-Growth-Transformation-Roadmap.pdf",
  },
] as const;

export const freeStarterDeliveryItem = {
  title: "7-Day Fat Loss Starter",
  storageKey: "Build-With-Coach-7-Day-Fat-Loss-Starter_3545bdae.pdf",
  fileName: "Build-With-Coach-7-Day-Fat-Loss-Starter.pdf",
} as const;

export function resolvePlanDeliveryItems(planNames: string[]): PlanDeliveryItem[] {
  const requested = new Set(planNames);
  const resolved = planDeliveryCatalog.filter((plan) => requested.has(plan.title));

  if (resolved.length !== requested.size) {
    throw new Error("One or more selected plans are not available for delivery.");
  }

  return resolved.map((plan) => ({ ...plan }));
}
