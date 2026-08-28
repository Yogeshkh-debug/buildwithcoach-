import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./storage", () => ({
  storageGetSignedUrl: vi.fn(async () => "https://signed.example/home-zero"),
}));

vi.mock("./supabase", () => ({
  isSupabaseConfigured: false,
  downloadPrivateProgramPdf: vi.fn(),
}));

import { isMailjetTechnicalFailure, sendMailjetPdfDelivery } from "./mailjetDelivery";

const originalFetch = global.fetch;
const originalMailjetKey = process.env.MAILJET_API_KEY;
const originalMailjetSecret = process.env.MAILJET_SECRET_KEY;
const originalMailjetSender = process.env.MAILJET_SENDER_EMAIL;
const originalResendKey = process.env.RESEND_API_KEY;
const originalResendSender = process.env.RESEND_SENDER_EMAIL;

function response(status: number, payload: unknown, bytes?: Uint8Array) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
    arrayBuffer: async () => (bytes ?? new TextEncoder().encode("%PDF-1.7 test")).buffer,
  } as Response;
}

describe("Mailjet technical-failure Resend backup", () => {
  beforeEach(() => {
    process.env.MAILJET_API_KEY = "mailjet-key";
    process.env.MAILJET_SECRET_KEY = "mailjet-secret";
    process.env.MAILJET_SENDER_EMAIL = "coach@mailjet.example";
    process.env.RESEND_API_KEY = "resend-key";
    process.env.RESEND_SENDER_EMAIL = "coach@resend.example";
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.MAILJET_API_KEY = originalMailjetKey;
    process.env.MAILJET_SECRET_KEY = originalMailjetSecret;
    process.env.MAILJET_SENDER_EMAIL = originalMailjetSender;
    process.env.RESEND_API_KEY = originalResendKey;
    process.env.RESEND_SENDER_EMAIL = originalResendSender;
  });

  it("uses Resend after a Mailjet 5xx technical failure and carries only the selected PDF attachment", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(200, {}, new TextEncoder().encode("%PDF-1.7 selected plan")))
      .mockResolvedValueOnce(response(503, { Messages: [{ Status: "error", Errors: [{ ErrorMessage: "Service unavailable" }] }] }))
      .mockResolvedValueOnce(response(200, { id: "resend-message-id" }));
    global.fetch = fetchMock as typeof fetch;

    const result = await sendMailjetPdfDelivery({
      requestId: 42,
      recipientName: "Jordan",
      recipientEmail: "jordan@example.com",
      plans: [{ title: "Home Zero", storageKey: "pdfs/home-zero.pdf", fileName: "Home-Zero.pdf" }],
    });

    expect(result).toEqual({ status: "sent", providerMessageId: "resend:resend-message-id" });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[2]?.[0]).toBe("https://api.resend.com/emails");
    expect(fetchMock.mock.calls[2]?.[1]).toMatchObject({
      headers: expect.objectContaining({
        Authorization: "Bearer resend-key",
        "Idempotency-Key": "pdf-delivery-resend-42",
      }),
    });
    expect(fetchMock.mock.calls[2]?.[1]?.body).toContain("Home Zero");
    expect(fetchMock.mock.calls[2]?.[1]?.body).toContain("Home-Zero.pdf");
    expect(fetchMock.mock.calls[2]?.[1]?.body).toContain("Build With Coach <coach@resend.example>");
    expect(fetchMock.mock.calls[2]?.[1]?.body).not.toContain("Fuel Plan");
  });

  it("does not use Resend after a Mailjet sending-limit response", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(200, {}, new TextEncoder().encode("%PDF-1.7 selected plan")))
      .mockResolvedValueOnce(response(429, { Messages: [{ Status: "error", Errors: [{ ErrorMessage: "Daily sending limit reached" }] }] }));
    global.fetch = fetchMock as typeof fetch;

    const result = await sendMailjetPdfDelivery({
      requestId: 43,
      recipientName: "Jordan",
      recipientEmail: "jordan@example.com",
      plans: [{ title: "Home Zero", storageKey: "pdfs/home-zero.pdf", fileName: "Home-Zero.pdf" }],
    });

    expect(result).toEqual({ status: "limit_reached", errorMessage: "Daily sending limit reached" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("identifies only Mailjet 5xx responses as eligible technical failures", () => {
    expect(isMailjetTechnicalFailure(503)).toBe(true);
    expect(isMailjetTechnicalFailure(400)).toBe(false);
    expect(isMailjetTechnicalFailure(429)).toBe(false);
  });
});
