import { describe, expect, it } from "vitest";
import { createBuyerSession, verifyBuyerSession } from "./buyerSession";

describe("buyer library session", () => {
  it("signs and verifies a buyer email without exposing it in a public URL", async () => {
    const token = await createBuyerSession("BUILDER@example.com");
    await expect(verifyBuyerSession(token)).resolves.toBe("builder@example.com");
    await expect(verifyBuyerSession(`${token}tampered`)).resolves.toBeNull();
  });
});
