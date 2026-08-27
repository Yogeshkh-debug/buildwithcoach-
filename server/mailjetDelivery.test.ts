import { describe, expect, it } from "vitest";
import { buildMailjetPdfMessage } from "./mailjetDelivery";

describe("buildMailjetPdfMessage", () => {
  it("includes only the selected secure plan links and escapes buyer content", () => {
    const message = buildMailjetPdfMessage({
      recipientName: "Jordan <Test>",
      plans: [{ title: "Home Zero", url: "https://signed.example/home-zero" }],
    });

    expect(message.subject).toBe("Your Build With Coach PDF");
    expect(message.html).toContain("Home Zero");
    expect(message.html).toContain("https://signed.example/home-zero");
    expect(message.html).not.toContain("Fuel Plan");
    expect(message.html).toContain("Jordan");
    expect(message.html).not.toContain("<Test>");
  });
});
