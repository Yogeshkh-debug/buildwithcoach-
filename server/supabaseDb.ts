import { getSupabaseAdmin } from "./supabase";
import type { PlanDeliveryItem } from "./planDelivery";

export function isSupabaseDatabaseConfigured() {
  return Boolean(getSupabaseAdmin());
}

function clientOrThrow() {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("Supabase database is not configured.");
  return client;
}

export async function createSupabaseFreePlanSignup(input: {
  name: string;
  email: string;
  weeklyChallengeOptIn?: boolean;
  timeZone?: string;
}) {
  const { data, error } = await clientOrThrow().rpc("create_free_plan_signup", {
    p_name: input.name,
    p_email: input.email.trim().toLowerCase(),
    p_weekly_challenge_opt_in: input.weeklyChallengeOptIn === true,
    p_time_zone: input.timeZone ?? "UTC",
  });
  if (error) throw new Error("Could not save the free-plan request in Supabase.");
  return { success: true, persisted: true, freePlanSignupId: data === null ? null : Number(data) };
}

export async function createSupabaseCartRequest(input: {
  name: string;
  email: string;
  deliveryItems: PlanDeliveryItem[];
  weeklyChallengeOptIn?: boolean;
  timeZone?: string;
}) {
  const { data, error } = await clientOrThrow().rpc("create_cart_request", {
    p_name: input.name,
    p_email: input.email.trim().toLowerCase(),
    p_items: input.deliveryItems.map((item) => ({ title: item.title, storageKey: item.storageKey })),
    p_weekly_challenge_opt_in: input.weeklyChallengeOptIn === true,
    p_time_zone: input.timeZone ?? "UTC",
  });
  if (error || data === null) throw new Error("Could not save the PDF request in Supabase.");
  return {
    success: true,
    persisted: true,
    deliveryStatus: "pending_provider_setup" as const,
    deliveryRequestId: Number(data),
    planNames: input.deliveryItems.map((item) => item.title),
  };
}

export async function addSupabaseNewsletterSubscriber(input: { name?: string; email: string; source: string }) {
  const client = clientOrThrow();
  const email = input.email.trim().toLowerCase();
  const existing = await client.from("email_subscribers").select("id").eq("email", email).limit(1).maybeSingle();
  if (existing.error) throw new Error("Could not check the subscriber record.");
  const payload = { name: input.name || null, email, consent: true, source: input.source };
  const result = existing.data
    ? await client.from("email_subscribers").update(payload).eq("id", existing.data.id)
    : await client.from("email_subscribers").insert(payload);
  if (result.error) throw new Error("Could not save the subscriber.");
  return { success: true, persisted: true };
}

export async function addSupabaseContactMessage(input: { name: string; email: string; message: string }) {
  const { error } = await clientOrThrow().from("contact_messages").insert({ ...input, email: input.email.trim().toLowerCase() });
  if (error) throw new Error("Could not save the contact message.");
  return { success: true, persisted: true };
}

export async function addSupabaseStorySubmission(input: { name: string; email: string; story: string; photoData: string; photoName: string; photoMime: "image/jpeg" | "image/png" | "image/webp"; consent: true }) {
  const match = input.photoData.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match || match[1] !== input.photoMime) throw new Error("Upload a valid JPG, PNG, or WebP photo.");
  const bytes = Buffer.from(match[2], "base64");
  if (bytes.length > 2 * 1024 * 1024) throw new Error("Photo is too large.");
  const key = `community-stories/${crypto.randomUUID()}.${input.photoMime === "image/jpeg" ? "jpg" : input.photoMime.split("/")[1]}`;
  const client = clientOrThrow();
  const uploaded = await client.storage.from("community-stories").upload(key, bytes, { contentType: input.photoMime, upsert: false });
  if (uploaded.error) throw new Error("Could not store the story photo.");
  const { error } = await client.from("story_submissions").insert({ name: input.name, email: input.email.trim().toLowerCase(), story: input.story, photo_key: key, photo_url: key, photo_name: input.photoName, photo_mime: input.photoMime, consent: true, status: "pending_review" });
  if (error) throw new Error("Could not save the story submission.");
  return { success: true, persisted: true };
}
