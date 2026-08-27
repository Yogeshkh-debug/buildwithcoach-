import { TRPCError } from "@trpc/server";
import { describe, expect, it } from "vitest";
import { getFriendlyDeliveryReason, ownerDeliveryRecordsToCsv, type OwnerDeliveryRecord } from "./db";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createNonOwnerContext(): TrpcContext {
  return {
    user: {
      id: 77,
      openId: "regular-user",
      name: "Regular User",
      email: "regular@example.com",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("owner delivery management", () => {
  it("rejects delivery records for a non-owner before any delivery data is returned", async () => {
    const caller = appRouter.createCaller(createNonOwnerContext());
    await expect(caller.delivery.list()).rejects.toMatchObject<Partial<TRPCError>>({ code: "FORBIDDEN" });
  });

  it("creates clear friendly reasons and a correctly escaped buyer-email export", () => {
    expect(getFriendlyDeliveryReason("failed", "Daily sending limit reached")).toContain("📬");
    expect(getFriendlyDeliveryReason("failed", "Sender address missing")).toContain("🛠️");

    const record: OwnerDeliveryRecord = {
      id: 12,
      name: "Sam \"Coach\"",
      email: "sam@example.com",
      status: "failed",
      providerMessageId: null,
      errorMessage: "Daily sending limit reached",
      sentAt: null,
      createdAt: new Date("2026-08-27T00:00:00.000Z"),
      updatedAt: new Date("2026-08-27T00:00:00.000Z"),
      planNames: ["Home Zero", "Fuel Plan"],
      delayReason: getFriendlyDeliveryReason("failed", "Daily sending limit reached"),
    };
    const csv = ownerDeliveryRecordsToCsv([record]);
    expect(csv).toContain("request_id,name,email");
    expect(csv).toContain('"Sam ""Coach"""');
    expect(csv).toContain("Home Zero | Fuel Plan");
  });
});
