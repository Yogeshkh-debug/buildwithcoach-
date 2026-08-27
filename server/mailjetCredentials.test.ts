import { describe, expect, it } from "vitest";

const mailjetApiKey = process.env.MAILJET_API_KEY;
const mailjetSecretKey = process.env.MAILJET_SECRET_KEY;

describe("Mailjet credentials", () => {
  it("authenticates with Mailjet without sending an email", async () => {
    expect(mailjetApiKey).toBeTruthy();
    expect(mailjetSecretKey).toBeTruthy();

    const authorization = `Basic ${Buffer.from(`${mailjetApiKey}:${mailjetSecretKey}`).toString("base64")}`;
    const response = await fetch("https://api.mailjet.com/v3/REST/myprofile", {
      headers: { Authorization: authorization },
    });

    expect(response.ok).toBe(true);
  }, 15_000);
});
