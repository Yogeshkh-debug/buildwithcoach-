import { readFile } from "node:fs/promises";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) throw new Error("Supabase credentials are not configured");

const files = [
  ["/home/ubuntu/upload/HOME_ZERO__No_Equipment_Home_Workout.pdf", "plans/home-zero.pdf"],
  ["/home/ubuntu/upload/Gym_Build__Build_With_Coach.pdf", "plans/gym-build.pdf"],
  ["/home/ubuntu/upload/FUEL_PLAN__Simple_Diet__Nutrition_for_Home_and_Gym.pdf", "plans/fuel-plan.pdf"],
  ["/home/ubuntu/upload/ZERO_TO_GROWTH__Full_Transformation_Roadmap.pdf", "plans/zero-to-growth.pdf"],
  ["/home/ubuntu/webdev-static-assets/Build-With-Coach-7-Day-Fat-Loss-Starter.pdf", "plans/7-day-fat-loss-starter.pdf"],
];

const baseUrl = supabaseUrl.replace(/\/$/, "");
for (const [filePath, objectPath] of files) {
  const bytes = await readFile(filePath);
  if (bytes.subarray(0, 5).toString() !== "%PDF-") throw new Error(`Invalid PDF: ${filePath}`);
  const response = await fetch(`${baseUrl}/storage/v1/object/program-pdfs/${objectPath}`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/pdf",
      "x-upsert": "true",
    },
    body: bytes,
  });
  if (!response.ok) throw new Error(`Upload failed for ${objectPath}: HTTP ${response.status}`);
  console.log(`uploaded ${objectPath} (${bytes.length} bytes)`);
}
