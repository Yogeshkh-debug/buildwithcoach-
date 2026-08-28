import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && serviceRoleKey);

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin() {
  if (!supabaseUrl || !serviceRoleKey) return null;
  if (!adminClient) {
    adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return adminClient;
}

const legacyProgramKeyMap: Record<string, string> = {
  "HOME_ZERO__No_Equipment_Home_Workout_cbd61a9d.pdf": "plans/home-zero.pdf",
  "Gym_Build__Build_With_Coach_8f1ff4a5.pdf": "plans/gym-build.pdf",
  "FUEL_PLAN__Simple_Diet__Nutrition_for_Home_and_Gym_7e024d47.pdf": "plans/fuel-plan.pdf",
  "ZERO_TO_GROWTH__Full_Transformation_Roadmap_a8f7b30c.pdf": "plans/zero-to-growth.pdf",
  "Build-With-Coach-7-Day-Fat-Loss-Starter_3545bdae.pdf": "plans/7-day-fat-loss-starter.pdf",
};

export async function downloadPrivateProgramPdf(storageKey: string) {
  const client = getSupabaseAdmin();
  if (!client) return null;
  const objectKey = legacyProgramKeyMap[storageKey] ?? storageKey;
  const { data, error } = await client.storage.from("program-pdfs").download(objectKey);
  if (error || !data) throw new Error(`Could not load private program PDF: ${storageKey}`);
  const bytes = Buffer.from(await data.arrayBuffer());
  if (bytes.subarray(0, 5).toString("ascii") !== "%PDF-") {
    throw new Error("The private program object is not a valid PDF.");
  }
  return bytes;
}
