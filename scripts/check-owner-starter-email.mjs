const apiKey = process.env.MAILJET_API_KEY?.trim();
const secretKey = process.env.MAILJET_SECRET_KEY?.trim();

if (!apiKey || !secretKey) throw new Error("Mailjet credentials are not configured.");

const authorization = `Basic ${Buffer.from(`${apiKey}:${secretKey}`).toString("base64")}`;
const url = new URL("https://api.mailjet.com/v3/REST/message");
url.searchParams.set("FromTS", new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString());
url.searchParams.set("FromType", "1");
url.searchParams.set("ShowContactAlt", "true");
url.searchParams.set("ShowSubject", "true");
url.searchParams.set("Limit", "100");

const response = await fetch(url, { headers: { Authorization: authorization } });
const payload = await response.json().catch(() => ({}));
if (!response.ok) throw new Error(`Mailjet message lookup returned ${response.status}.`);

const records = Array.isArray(payload.Data) ? payload.Data.map((message) => ({
  id: message.ID,
  uuid: message.UUID,
  recipient: message.ContactAlt,
  subject: message.Subject,
  status: message.Status,
  stateId: message.StateID ?? null,
  statePermanent: message.StatePermanent ?? null,
  arrivedAt: message.ArrivedAt ?? null,
  attemptCount: message.AttemptCount ?? null,
})).filter((message) => message.recipient === "shopurbancanvas@gmail.com") : [];

console.log(JSON.stringify({ records }));
