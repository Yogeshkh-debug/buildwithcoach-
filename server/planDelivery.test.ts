import { describe, expect, it } from "vitest";
import { resolvePlanDeliveryItems } from "./planDelivery";

describe("resolvePlanDeliveryItems", () => {
  it("maps only the selected known plans to their managed storage keys", () => {
    expect(resolvePlanDeliveryItems(["Fuel Plan", "Home Zero"])).toEqual([
      {
        title: "Home Zero",
        storageKey: "HOME_ZERO__No_Equipment_Home_Workout_cbd61a9d.pdf",
        fileName: "Home-Zero-No-Equipment-Workout.pdf",
      },
      {
        title: "Fuel Plan",
        storageKey: "FUEL_PLAN__Simple_Diet__Nutrition_for_Home_and_Gym_7e024d47.pdf",
        fileName: "Fuel-Plan-Simple-Diet.pdf",
      },
    ]);
  });

  it("rejects an unknown plan instead of creating a delivery record", () => {
    expect(() => resolvePlanDeliveryItems(["Unknown plan"])).toThrow(
      "One or more selected plans are not available for delivery.",
    );
  });
});
