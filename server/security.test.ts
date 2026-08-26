import { describe, expect, it, beforeEach } from "vitest";
import { assertSafeStoryImage, consumeCaptureQuota, isSafeStorageKey, resetCaptureQuotasForTests } from "./security";

function pngHeader(width: number, height: number) {
  const bytes = Buffer.alloc(24);
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(bytes, 0);
  bytes.writeUInt32BE(13, 8);
  bytes.write("IHDR", 12, "ascii");
  bytes.writeUInt32BE(width, 16);
  bytes.writeUInt32BE(height, 20);
  return bytes;
}

describe("security hardening", () => {
  beforeEach(() => resetCaptureQuotasForTests());

  it("accepts only image bytes whose signature and claimed PNG dimensions agree", () => {
    expect(assertSafeStoryImage(pngHeader(1920, 1080), "image/png")).toEqual({ width: 1920, height: 1080 });
    expect(() => assertSafeStoryImage(Buffer.from("not-an-image"), "image/png")).toThrow("valid JPG, PNG, or WebP");
    expect(() => assertSafeStoryImage(pngHeader(5000, 1080), "image/png")).toThrow("4096");
  });

  it("accepts only normalized managed-storage keys", () => {
    expect(isSafeStorageKey("community-stories/secure_123.jpg")).toBe(true);
    expect(isSafeStorageKey("../private-key")).toBe(false);
    expect(isSafeStorageKey("community-stories/<script>.jpg")).toBe(false);
  });

  it("throttles repeated public capture attempts per client window", () => {
    for (let count = 0; count < 12; count += 1) expect(consumeCaptureQuota("client-test", 1_000)).toBe(true);
    expect(consumeCaptureQuota("client-test", 1_000)).toBe(false);
    expect(consumeCaptureQuota("client-test", 1_000 + 10 * 60 * 1000)).toBe(true);
  });
});
