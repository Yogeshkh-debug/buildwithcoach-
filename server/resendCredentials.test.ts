import { describe, expect, it } from "vitest";

const RESEND_DOMAINS_ENDPOINT = "https://api.resend.com/domains";

describe("Resend backup credentials", () => {
  it("authenticates with Resend without sending an email", async () => {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    const senderEmail = process.env.RESEND_SENDER_EMAIL?.trim();

    expect(apiKey, "RESEND_API_KEY must be configured through secure project settings").toBeTruthy();
    expect(senderEmail, "RESEND_SENDER_EMAIL must be configured through secure project settings").toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

    const response = await fetch(RESEND_DOMAINS_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    const responseText = await response.text();
    const isSendOnlyKey = response.status === 401 && responseText.includes("restricted_api_key");

    expect(
      response.ok || isSendOnlyKey,
      `Resend authentication failed with HTTP ${response.status}: ${responseText.slice(0, 240)}`,
    ).toBe(true);
  }, 15_000);
});
