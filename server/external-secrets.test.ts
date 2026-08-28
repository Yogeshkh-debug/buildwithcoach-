import { describe, expect, it } from "vitest";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
function requireEnv(name: string, value: string | undefined) {
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

describe("external service credentials", () => {
  it("accepts the Supabase server credentials", async () => {
    const url = requireEnv("SUPABASE_URL", supabaseUrl).replace(/\/$/, "");
    const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY", supabaseServiceRoleKey);
    const response = await fetch(`${url}/rest/v1/`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });
    expect(response.ok).toBe(true);
  }, 15000);

});
