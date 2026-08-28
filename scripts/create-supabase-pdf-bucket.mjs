const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Supabase credentials are not configured");

const response = await fetch(`${url.replace(/\/$/, "")}/storage/v1/bucket`, {
  method: "POST",
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    id: "program-pdfs",
    name: "program-pdfs",
    public: false,
    file_size_limit: 10 * 1024 * 1024,
    allowed_mime_types: ["application/pdf"],
  }),
});

const body = await response.json().catch(() => ({}));
if (!response.ok && !(response.status === 409 && /already exists/i.test(JSON.stringify(body)))) {
  throw new Error(`Supabase Storage bucket request failed with HTTP ${response.status}`);
}
console.log(response.status === 409 ? "program-pdfs bucket already exists" : "program-pdfs bucket created");
