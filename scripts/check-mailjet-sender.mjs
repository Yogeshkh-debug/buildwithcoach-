const apiKey = process.env.MAILJET_API_KEY?.trim();
const secretKey = process.env.MAILJET_SECRET_KEY?.trim();

if (!apiKey || !secretKey) throw new Error("Mailjet credentials are not configured.");

const authorization = `Basic ${Buffer.from(`${apiKey}:${secretKey}`).toString("base64")}`;
const response = await fetch("https://api.mailjet.com/v3/REST/sender?Limit=100", {
  headers: { Authorization: authorization },
});
const payload = await response.json().catch(() => ({}));
if (!response.ok) throw new Error(`Mailjet sender lookup returned ${response.status}.`);

const senders = Array.isArray(payload.Data) ? payload.Data.map((sender) => ({
  email: sender.Email,
  status: sender.Status,
  createdAt: sender.CreatedAt ?? null,
})).filter((sender) => Boolean(sender.email)) : [];

console.log(JSON.stringify({ configuredSender: process.env.MAILJET_SENDER_EMAIL ?? null, senders }));
