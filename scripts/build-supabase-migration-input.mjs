import { readFileSync, writeFileSync } from "node:fs";

const query = readFileSync("/home/ubuntu/build-with-coach/docs/migrations/supabase_primary_schema.sql", "utf8");
writeFileSync(
  "/tmp/supabase_primary_schema_input.json",
  JSON.stringify({
    project_id: "pgsolmoepgolpvuwhcyb",
    name: "build_with_coach_primary_schema",
    query,
  }),
);
