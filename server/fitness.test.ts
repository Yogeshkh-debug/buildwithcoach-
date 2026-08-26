import { describe, expect, it } from "vitest";
import { calculateCalorieTarget, calculateProteinTarget } from "../shared/fitness";
import { programCatalog } from "../client/src/lib/content";
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

  it("keeps each PDF plan mapped to its matching supplied cover", () => {
    expect(programCatalog.map(({ title, cover }) => ({ title, cover }))).toEqual([
      { title: "Home Zero", cover: expect.stringContaining("home-zero-cover") },
      { title: "Gym Build", cover: expect.stringContaining("gym-build-cover") },
      { title: "Fuel Plan", cover: expect.stringContaining("fuel-plan-cover") },
      { title: "Zero to Growth", cover: expect.stringContaining("zero-to-growth-cover") },
    ]);
  });
});

describe("public article procedures", () => {
  it("exposes the seeded article list", async () => {
    const ctx = { user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] } as TrpcContext;
    const caller = appRouter.createCaller(ctx);
    const articles = await caller.articles.list();
    expect(articles).toHaveLength(9);
    expect(articles[0]).toHaveProperty("slug");
  }, 10_000);

  it("includes the requested supplement amount sections and supplied in-guide visuals", async () => {
    const ctx = { user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] } as TrpcContext;
    const caller = appRouter.createCaller(ctx);
    const creatine = await caller.articles.bySlug({ slug: "creatine-safety-basics" });
    const whey = await caller.articles.bySlug({ slug: "when-to-take-whey-protein" });
    const creatineSections = JSON.parse(creatine!.body).sections as Array<{ title: string; visual?: { src: string } }>;
    const wheySections = JSON.parse(whey!.body).sections as Array<{ title: string; visual?: { src: string } }>;

    expect(creatineSections).toEqual(expect.arrayContaining([
      expect.objectContaining({ title: "How Much Creatine Do You Need Per Day?", visual: expect.objectContaining({ src: expect.stringContaining("creatine-daily-supplied") }) }),
      expect.objectContaining({ title: "Final Verdict: Should You Take Creatine?", visual: expect.objectContaining({ src: expect.stringContaining("creatine-verdict-supplied") }) }),
    ]));
    expect(wheySections).toEqual(expect.arrayContaining([
      expect.objectContaining({ title: "How Much Protein Do You Need Per Day?", visual: expect.objectContaining({ src: expect.stringContaining("whey-protein-supplied") }) }),
    ]));
  }, 10_000);
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

  it("rejects cart PDF requests without a valid email and selected plan", async () => {
    const caller = appRouter.createCaller(ctx);
    await expect(caller.captures.cartRequest({ name: "A", email: "not-an-email", planNames: [] })).rejects.toMatchObject({ code: "BAD_REQUEST" });
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
