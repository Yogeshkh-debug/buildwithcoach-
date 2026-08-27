import { storageGetSignedUrl } from "./storage";

export type MailjetDeliveryPlan = {
  title: string;
  storageKey: string;
};

type MailjetDeliveryInput = {
  requestId: number;
  recipientName: string;
  recipientEmail: string;
  plans: MailjetDeliveryPlan[];
  sandbox?: boolean;
};

const MAILJET_SEND_ENDPOINT = "https://api.mailjet.com/v3.1/send";
const RESEND_SEND_ENDPOINT = "https://api.resend.com/emails";

export function isMailjetSendingLimit(statusCode: number, errorMessage: string) {
  return statusCode === 429 || /(?:daily|hourly|sending|send)[\s\S]{0,40}(?:limit|quota)|(?:limit|quota)[\s\S]{0,40}(?:daily|hourly|sending|send)|too many requests/i.test(errorMessage);
}

export function isMailjetTechnicalFailure(statusCode: number) {
  return statusCode >= 500 && statusCode <= 599;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

export function buildMailjetPdfMessage(input: {
  recipientName: string;
  plans: Array<{ title: string; url: string }>;
}) {
  const firstName = escapeHtml(input.recipientName.trim().split(/\s+/)[0] || "there");
  const planList = input.plans.map((plan) => {
    const title = escapeHtml(plan.title);
    const url = escapeHtml(plan.url);
    return `<li style="margin:0 0 12px"><strong>${title}</strong><br /><a href="${url}">Download ${title}</a></li>`;
  }).join("");

  return {
    subject: `Your Build With Coach PDF${input.plans.length === 1 ? "" : "s"}`,
    html: `<!doctype html><html><body style="margin:0;background:#f6f5f1;color:#0c0e0c;font-family:Arial,sans-serif"><main style="max-width:620px;margin:0 auto;padding:32px"><p style="font-size:12px;letter-spacing:1.8px;font-weight:700">BUILD WITH COACH</p><h1 style="font-size:32px;line-height:1.05;margin:24px 0 16px">Your plan${input.plans.length === 1 ? " is" : "s are"} ready.</h1><p>Good choice, ${firstName}. Download only the PDF${input.plans.length === 1 ? " you selected" : "s you selected"} below.</p><ul style="padding-left:20px">${planList}</ul><p style="margin-top:28px">Keep it simple. Start the first session. Repeat it.</p><hr style="border:0;border-top:1px solid #a9b8ba;margin:28px 0" /><p style="font-size:12px;color:#4e5555">These secure download links are provided for your personal plan delivery.</p></main></body></html>`,
    text: `Build With Coach\n\nYour selected PDF${input.plans.length === 1 ? " is" : "s are"} ready:\n\n${input.plans.map((plan) => `${plan.title}: ${plan.url}`).join("\n")}\n\nKeep it simple. Start the first session. Repeat it.`,
  };
}

type DeliveryMessage = ReturnType<typeof buildMailjetPdfMessage>;

type MailjetAttempt =
  | { status: "sent"; providerMessageId: string }
  | { status: "validated" }
  | { status: "limit_reached"; errorMessage: string }
  | { status: "failed"; errorMessage: string; fallbackEligible: boolean };

async function sendMailjetMessage(input: {
  requestId: number;
  recipientName: string;
  recipientEmail: string;
  message: DeliveryMessage;
  sandbox?: boolean;
}): Promise<MailjetAttempt> {
  const apiKey = process.env.MAILJET_API_KEY?.trim();
  const secretKey = process.env.MAILJET_SECRET_KEY?.trim();
  const senderEmail = process.env.MAILJET_SENDER_EMAIL?.trim();

  if (!apiKey || !secretKey || !senderEmail) {
    return { status: "failed", errorMessage: "Mailjet delivery is not configured.", fallbackEligible: false };
  }

  try {
    const authorization = `Basic ${Buffer.from(`${apiKey}:${secretKey}`).toString("base64")}`;
    const response = await fetch(MAILJET_SEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(input.sandbox ? { SandboxMode: true } : {}),
        Messages: [{
          From: { Email: senderEmail, Name: "Build With Coach" },
          To: [{ Email: input.recipientEmail, Name: input.recipientName }],
          Subject: input.message.subject,
          HTMLPart: input.message.html,
          TextPart: input.message.text,
          CustomID: `pdf-delivery-${input.requestId}`,
        }],
      }),
    });

    const payload = await response.json().catch(() => ({})) as {
      Messages?: Array<{
        Status?: string;
        To?: Array<{ MessageUUID?: string; MessageID?: number }>;
        Errors?: Array<{ ErrorMessage?: string }>;
      }>;
    };
    const sentMessage = payload.Messages?.[0];
    const messageId = sentMessage?.To?.[0]?.MessageUUID ?? (sentMessage?.To?.[0]?.MessageID ? String(sentMessage.To[0].MessageID) : undefined);
    if (!response.ok || sentMessage?.Status !== "success") {
      const errorMessage = sentMessage?.Errors?.[0]?.ErrorMessage || `Mailjet returned ${response.status}.`;
      if (isMailjetSendingLimit(response.status, errorMessage)) return { status: "limit_reached", errorMessage };
      return { status: "failed", errorMessage, fallbackEligible: isMailjetTechnicalFailure(response.status) };
    }
    if (input.sandbox) return { status: "validated" };
    if (!messageId) return { status: "failed", errorMessage: "Mailjet accepted the request but did not return a message ID.", fallbackEligible: false };

    return { status: "sent", providerMessageId: messageId };
  } catch (error) {
    // A connection failure has an unknown Mailjet outcome. Do not risk duplicate buyer emails.
    return { status: "failed", errorMessage: error instanceof Error ? error.message : "Selected PDFs could not be sent.", fallbackEligible: false };
  }
}

async function sendResendMessage(input: {
  requestId: number;
  recipientEmail: string;
  message: DeliveryMessage;
}): Promise<{ status: "sent"; providerMessageId: string } | { status: "failed"; errorMessage: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const senderEmail = process.env.RESEND_SENDER_EMAIL?.trim();
  if (!apiKey || !senderEmail) {
    return { status: "failed", errorMessage: "Mailjet had a technical problem, but the Resend backup is not configured." };
  }

  try {
    const response = await fetch(RESEND_SEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `pdf-delivery-resend-${input.requestId}`,
      },
      body: JSON.stringify({
        from: `Build With Coach <${senderEmail}>`,
        to: [input.recipientEmail],
        subject: input.message.subject,
        html: input.message.html,
        text: input.message.text,
      }),
    });
    const payload = await response.json().catch(() => ({})) as { id?: string; message?: string; name?: string };
    if (!response.ok || !payload.id) {
      const detail = payload.message || payload.name || `Resend returned ${response.status}.`;
      return { status: "failed", errorMessage: `Mailjet had a technical problem. Resend backup failed: ${detail}` };
    }
    return { status: "sent", providerMessageId: `resend:${payload.id}` };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Selected PDFs could not be sent.";
    return { status: "failed", errorMessage: `Mailjet had a technical problem. Resend backup failed: ${detail}` };
  }
}

export async function sendMailjetPdfDelivery(input: MailjetDeliveryInput): Promise<
  | { status: "sent"; providerMessageId: string }
  | { status: "validated" }
  | { status: "limit_reached"; errorMessage: string }
  | { status: "failed"; errorMessage: string }
> {
  try {
    const plans = await Promise.all(input.plans.map(async (plan) => ({
      title: plan.title,
      url: await storageGetSignedUrl(plan.storageKey),
    })));
    const message = buildMailjetPdfMessage({ recipientName: input.recipientName, plans });
    const mailjetResult = await sendMailjetMessage({
      requestId: input.requestId,
      recipientName: input.recipientName,
      recipientEmail: input.recipientEmail,
      message,
      sandbox: input.sandbox,
    });
    if (mailjetResult.status !== "failed" || !mailjetResult.fallbackEligible || input.sandbox) {
      return mailjetResult;
    }
    return sendResendMessage({
      requestId: input.requestId,
      recipientEmail: input.recipientEmail,
      message,
    });
  } catch (error) {
    return { status: "failed", errorMessage: error instanceof Error ? error.message : "Selected PDFs could not be sent." };
  }
}
