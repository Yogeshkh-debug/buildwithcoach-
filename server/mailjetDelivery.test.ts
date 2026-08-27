import { describe, expect, it } from "vitest";
import { buildMailjetPdfMessage, isMailjetSendingLimit } from "./mailjetDelivery";

describe("buildMailjetPdfMessage", () => {
  it("includes only the selected attachment filename and escapes buyer content", () => {
    const message = buildMailjetPdfMessage({
      recipientName: "Jordan <Test>",
      plans: [{ title: "Home Zero", fileName: "Home-Zero.pdf" }],
      accessCode: "123456",
    });

    expect(message.subject).toBe("Your Build With Coach PDF is attached");
    expect(message.html).toContain("Home Zero");
    expect(message.html).toContain("Home-Zero.pdf");
    expect(message.html).toContain("123456");
    expect(message.html).not.toContain("Fuel Plan");
    expect(message.html).toContain("Jordan");
    expect(message.html).not.toContain("<Test>");
  });

  it("recognizes sending-limit responses without confusing them with other delivery errors", () => {
    expect(isMailjetSendingLimit(429, "Too many requests")).toBe(true);
    expect(isMailjetSendingLimit(400, "Daily sending limit reached")).toBe(true);
    expect(isMailjetSendingLimit(400, "The sender address is not verified")).toBe(false);
  });
});
