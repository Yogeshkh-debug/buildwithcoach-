import { createHash, randomInt } from "node:crypto";
import { getSupabaseAdmin } from "./supabase";
import { ENV } from "./_core/env";
import { freeStarterDeliveryItem } from "./planDelivery";

function clientOrThrow() {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("Supabase database is not configured.");
  return client;
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const hashCode = (email: string, code: string) => createHash("sha256").update(`${normalizeEmail(email)}:${code}:${ENV.cookieSecret}`).digest("hex");

export async function createSupabaseBuyerAccessCode(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const code = String(randomInt(100_000, 1_000_000));
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  const { error } = await clientOrThrow().from("buyer_access_codes").insert({ email: normalizedEmail, code_hash: hashCode(normalizedEmail, code), expires_at: expiresAt });
  if (error) throw new Error("Could not create a buyer access code.");
  return { code, expiresAt: new Date(expiresAt) };
}

export async function redeemSupabaseBuyerAccessCode(input: { email: string; code: string }) {
  const { data, error } = await clientOrThrow().rpc("redeem_buyer_access_code", {
    p_email: normalizeEmail(input.email),
    p_code_hash: hashCode(input.email, input.code),
  });
  if (error) throw new Error("Could not verify the buyer access code.");
  return data === true;
}

export async function listSupabaseBuyerPrograms(email: string) {
  const client = clientOrThrow();
  const normalizedEmail = normalizeEmail(email);
  const [{ data: requests, error: requestError }, { data: starters, error: starterError }] = await Promise.all([
    client.from("pdf_delivery_requests").select("id").eq("email", normalizedEmail),
    client.from("free_plan_signups").select("id").eq("email", normalizedEmail).limit(1),
  ]);
  if (requestError || starterError) throw new Error("Could not load buyer programs.");
  const requestIds = (requests ?? []).map((request) => request.id);
  const { data: items, error: itemError } = requestIds.length
    ? await client.from("pdf_delivery_items").select("plan_name,storage_key").in("request_id", requestIds)
    : { data: [], error: null };
  if (itemError) throw new Error("Could not load buyer programs.");
  const programs: Array<{ title: string; fileName: string; storageKey: string; type: "starter" | "program" }> = (items ?? []).map((item) => ({
    title: item.plan_name,
    fileName: `${String(item.plan_name).replaceAll(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}.pdf`,
    storageKey: item.storage_key,
    type: "program" as const,
  }));
  if ((starters ?? []).length) programs.unshift({ ...freeStarterDeliveryItem, type: "starter" });
  return Array.from(new Map(programs.map((program) => [program.title, program])).values());
}

export async function getSupabaseBuyerProgram(email: string, title: string) {
  const programs = await listSupabaseBuyerPrograms(email);
  return programs.find((program) => program.title === title) ?? null;
}

export async function listSupabaseWeeklyRecipients() {
  const { data, error } = await clientOrThrow().from("email_subscribers").select("id,name,email,time_zone").eq("is_pdf_buyer", true).eq("weekly_challenge_opt_in", true).eq("consent", true).is("unsubscribed_at", null);
  if (error) throw new Error("Could not load weekly challenge recipients.");
  return (data ?? []).map((row) => ({ id: row.id, name: row.name, email: row.email, timeZone: row.time_zone }));
}

export async function claimSupabaseWeeklyChallengeDelivery(input: { subscriberId: number; weekKey: string; challengeKey: string }) {
  const { data, error } = await clientOrThrow().from("weekly_challenge_deliveries").insert({ subscriber_id: input.subscriberId, week_key: input.weekKey, challenge_key: input.challengeKey, status: "pending" }).select("id").single();
  if (error) return null;
  return data?.id ?? null;
}

export async function markSupabaseWeeklyChallengeSent(input: { deliveryId: number; subscriberId: number; weekKey: string; providerMessageId: string }) {
  const client = clientOrThrow();
  const { error } = await client.from("weekly_challenge_deliveries").update({ status: "sent", provider_message_id: input.providerMessageId, error_message: null, sent_at: new Date().toISOString() }).eq("id", input.deliveryId);
  if (error) return false;
  await client.from("email_subscribers").update({ last_weekly_challenge_week: input.weekKey }).eq("id", input.subscriberId);
  return true;
}

export async function markSupabaseWeeklyChallengeFailed(deliveryId: number, errorMessage: string) {
  const { error } = await clientOrThrow().from("weekly_challenge_deliveries").update({ status: "failed", error_message: errorMessage.slice(0, 4000) }).eq("id", deliveryId);
  return !error;
}

export async function getSupabasePdfDeliveryPayload(requestId: number) {
  const client = clientOrThrow();
  const [{ data: request, error: requestError }, { data: items, error: itemError }] = await Promise.all([
    client.from("pdf_delivery_requests").select("*").eq("id", requestId).limit(1).maybeSingle(),
    client.from("pdf_delivery_items").select("*").eq("request_id", requestId),
  ]);
  if (requestError || itemError || !request) return null;
  return { request, items: items ?? [] };
}

export async function markSupabasePdfDeliverySent(requestId: number, providerMessageId: string) {
  const { error } = await clientOrThrow().from("pdf_delivery_requests").update({ status: "sent", provider_message_id: providerMessageId, error_message: null, sent_at: new Date().toISOString() }).eq("id", requestId);
  return !error;
}

export async function markSupabasePdfDeliveryFailed(requestId: number, errorMessage: string) {
  const { error } = await clientOrThrow().from("pdf_delivery_requests").update({ status: "failed", error_message: errorMessage.slice(0, 4000) }).eq("id", requestId);
  return !error;
}

export async function listSupabaseOwnerDeliveryRecords() {
  const client = clientOrThrow();
  const [{ data: requests, error: requestError }, { data: items, error: itemError }] = await Promise.all([
    client.from("pdf_delivery_requests").select("*").order("updated_at", { ascending: false }),
    client.from("pdf_delivery_items").select("request_id,plan_name"),
  ]);
  if (requestError || itemError) throw new Error("Could not load delivery records.");
  const names = new Map<number, string[]>();
  for (const item of items ?? []) names.set(item.request_id, [...(names.get(item.request_id) ?? []), item.plan_name]);
  return (requests ?? []).map((request) => ({
    id: request.id,
    name: request.name,
    email: request.email,
    status: request.status,
    providerMessageId: request.provider_message_id,
    errorMessage: request.error_message,
    sentAt: request.sent_at ? new Date(request.sent_at) : null,
    createdAt: new Date(request.created_at),
    updatedAt: new Date(request.updated_at),
    planNames: names.get(request.id) ?? [],
    delayReason: request.status === "sent" ? "✅ Sent — the selected PDF attachments were accepted for delivery." : request.status === "pending_provider_setup" ? "⏳ Delivery is waiting for its email setup." : "🛠️ Email machine wobble — review the saved error and resend when ready.",
  }));
}

export async function getSupabaseBuyerChallengePreferences(email: string) {
  const { data, error } = await clientOrThrow().from("email_subscribers").select("weekly_challenge_opt_in,time_zone").eq("email", normalizeEmail(email)).eq("is_pdf_buyer", true).limit(1).maybeSingle();
  if (error) throw new Error("Could not load challenge preferences.");
  return { weeklyChallengeOptIn: data?.weekly_challenge_opt_in === true, timeZone: data?.time_zone ?? "UTC" };
}

export async function updateSupabaseBuyerChallengePreferences(input: { email: string; weeklyChallengeOptIn: boolean; timeZone: string }) {
  const { error } = await clientOrThrow().from("email_subscribers").update({ weekly_challenge_opt_in: input.weeklyChallengeOptIn, consent: input.weeklyChallengeOptIn, time_zone: input.timeZone, unsubscribed_at: input.weeklyChallengeOptIn ? null : new Date().toISOString() }).eq("email", normalizeEmail(input.email)).eq("is_pdf_buyer", true);
  return !error;
}
