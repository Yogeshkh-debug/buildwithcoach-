import { describe, expect, it } from "vitest";
import { storageGetSignedUrl } from "./storage";

describe("managed PDF storage", () => {
  it("creates a signed Home Zero download URL without sending an email", async () => {
    const url = await storageGetSignedUrl("HOME_ZERO__No_Equipment_Home_Workout_cbd61a9d.pdf");
    expect(url).toMatch(/^https:\/\//);
  }, 15_000);
});
