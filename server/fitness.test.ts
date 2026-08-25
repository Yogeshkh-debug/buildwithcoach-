import { describe, expect, it } from "vitest";
import { calculateCalorieTarget, calculateProteinTarget } from "../shared/fitness";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("fitness calculations", () => {
  it("calculates a conservative fat-loss calorie target", () => {
    const result = calculateCalorieTarget({ age: 30, weightKg: 80, heightCm: 180, activity: 1.55, goal: "fat_loss" });
    expect(result.maintenance).toBe(2759);
    expect(result.target).toBe(2359);
  });

  it("returns a weight-based protein range", () => {
    const result = calculateProteinTarget(80, "muscle_gain");
    expect(result).toMatchObject({ target: 160, lower: 128, upper: 176 });
  });

  it("rejects implausible calculator inputs", () => {
    expect(() => calculateProteinTarget(20, "maintain")).toThrow("body weight");
  });
});

describe("public article procedures", () => {
  it("exposes the seeded article list", async () => {
    const ctx = { user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] } as TrpcContext;
    const caller = appRouter.createCaller(ctx);
    const articles = await caller.articles.list();
    expect(articles).toHaveLength(7);
    expect(articles[0]).toHaveProperty("slug");
  });
});

describe("public capture validation", () => {
  const ctx = { user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] } as TrpcContext;

  it("rejects malformed newsletter requests before persistence", async () => {
    const caller = appRouter.createCaller(ctx);
    await expect(caller.captures.newsletter({ email: "not-an-email", source: "footer" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects incomplete free-plan requests before persistence", async () => {
    const caller = appRouter.createCaller(ctx);
    await expect(caller.captures.freePlan({ name: "A", email: "not-an-email" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects malformed waitlist and contact requests before persistence", async () => {
    const caller = appRouter.createCaller(ctx);
    await expect(caller.captures.waitlist({ email: "wrong" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.captures.contact({ name: "A", email: "wrong", message: "Short" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("requires a substantial story, safe photo type, and explicit publishing consent", async () => {
    const caller = appRouter.createCaller(ctx);
    await expect(caller.captures.story({ name: "Coach", email: "coach@example.com", story: "Too short", photoData: "not-a-photo", photoName: "story.gif", photoMime: "image/png", consent: false })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
