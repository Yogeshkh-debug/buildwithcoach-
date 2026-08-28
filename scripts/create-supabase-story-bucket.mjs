const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Supabase credentials are not configured");
const response = await fetch(`${url.replace(/\/$/, "")}/storage/v1/bucket`, {
  method: "POST",
  headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
  body: JSON.stringify({ id: "community-stories", name: "community-stories", public: false, file_size_limit: 2 * 1024 * 1024, allowed_mime_types: ["image/jpeg", "image/png", "image/webp"] }),
});
if (!response.ok && response.status !== 409) throw new Error(`Supabase story bucket request failed with HTTP ${response.status}`);
console.log(response.status === 409 ? "community-stories bucket already exists" : "community-stories bucket created");
