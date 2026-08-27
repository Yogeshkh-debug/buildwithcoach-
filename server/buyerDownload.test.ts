import { describe, expect, it } from "vitest";
import { getPrivatePdfHeaders } from "./buyerDownload";

describe("getPrivatePdfHeaders", () => {
  it("uses safe PDF headers and prevents filename header injection", () => {
    const headers = getPrivatePdfHeaders("Home Zero\r\nX-Bad: value.pdf", 456);
    expect(headers).toMatchObject({
      "Content-Type": "application/pdf",
      "Content-Length": "456",
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    });
    expect(headers["Content-Disposition"]).toBe('inline; filename="Home_Zero__X-Bad__value.pdf"');
    expect(headers["Content-Disposition"]).not.toContain("\r");
  });
});
