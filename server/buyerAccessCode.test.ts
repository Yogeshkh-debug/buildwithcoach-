import { describe, expect, it } from "vitest";
import { selectRedeemableBuyerAccessCode } from "./db";

describe("selectRedeemableBuyerAccessCode", () => {
  it("accepts an earlier valid code when a newer unused code exists for the same buyer", () => {
    const now = Date.now();
    const earlierValid = { codeHash: "earlier", usedAt: null, expiresAt: new Date(now + 60_000), attempts: 0 };
    const newerValid = { codeHash: "newer", usedAt: null, expiresAt: new Date(now + 60_000), attempts: 0 };
    expect(selectRedeemableBuyerAccessCode([newerValid, earlierValid], "earlier", now)).toBe(earlierValid);
  });

  it("rejects expired, used, and attempt-limited codes", () => {
    const now = Date.now();
    const candidates = [
      { codeHash: "code", usedAt: new Date(now - 100), expiresAt: new Date(now + 60_000), attempts: 0 },
      { codeHash: "code", usedAt: null, expiresAt: new Date(now - 1), attempts: 0 },
      { codeHash: "code", usedAt: null, expiresAt: new Date(now + 60_000), attempts: 5 },
    ];
    expect(selectRedeemableBuyerAccessCode(candidates, "code", now)).toBeNull();
  });
});
