import { and, desc, eq, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { createHash, randomInt } from "node:crypto";
import {
  articles,
  buyerAccessCodes,
  contactMessages,
  downloads,
  emailSubscribers,
  freePlanSignups,
  futureProducts,
  InsertUser,
  pdfDeliveryItems,
  pdfDeliveryRequests,
  storySubmissions,
  users,
  weeklyChallengeDeliveries,
  weeklyChallengeSchedules,
} from "../drizzle/schema";
import { articleSeeds, serializeArticleBody } from "./articleSeed";
import { ENV } from "./_core/env";
import { storagePut } from "./storage";
import { assertSafeStoryImage } from "./security";
import { freeStarterDeliveryItem, resolvePlanDeliveryItems } from "./planDelivery";

let _db: ReturnType<typeof drizzle> | null = null;
let articleSeedPromise: Promise<void> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  (["name", "email", "loginMethod"] as const).forEach((field) => {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  });
  values.lastSignedIn = user.lastSignedIn ?? new Date();
  updateSet.lastSignedIn = values.lastSignedIn;
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

async function seedArticlesIfNeeded(db: NonNullable<Awaited<ReturnType<typeof getDb>>>) {
  const existing = await db.select({ slug: articles.slug }).from(articles);
  const existingSlugs = new Set(existing.map((article) => article.slug));
  const missingSeeds = articleSeeds.filter((article) => !existingSlugs.has(article.slug));
  if (missingSeeds.length) await db.insert(articles).values(missingSeeds.map((article) => ({ slug: article.slug, title: article.title, excerpt: article.excerpt, body: serializeArticleBody(article), category: article.category, published: 1 })));
  for (const article of articleSeeds.filter((entry) => existingSlugs.has(entry.slug))) {
    await db.update(articles).set({ title: article.title, excerpt: article.excerpt, body: serializeArticleBody(article), category: article.category, published: 1 }).where(eq(articles.slug, article.slug));
  }
}

async function ensureArticlesSeeded(db: NonNullable<Awaited<ReturnType<typeof getDb>>>) {
  if (!articleSeedPromise) {
    articleSeedPromise = seedArticlesIfNeeded(db).catch((error) => {
      articleSeedPromise = null;
      throw error;
    });
  }
  await articleSeedPromise;
}

async function seedProductsIfNeeded(db: NonNullable<Awaited<ReturnType<typeof getDb>>>) {
  const existing = await db.select({ id: futureProducts.id }).from(futureProducts).limit(1);
  if (existing.length > 0) return;
  await db.insert(futureProducts).values([
    { title: "8-Week Home Fat Loss Challenge", description: "A structured future PDF plan with home and gym options.", price: "Coming soon", status: "coming_soon" },
    { title: "12-Week Beginner Muscle Plan", description: "A clear progressive plan for building strength and muscle.", price: "Coming soon", status: "coming_soon" },
  ]);
}

export async function listPublishedArticles() {
  const db = await getDb();
  if (!db) return articleSeeds.map((article, index) => ({ id: index + 1, ...article, body: serializeArticleBody(article), published: 1 }));
  await ensureArticlesSeeded(db);
  return db.select().from(articles).where(eq(articles.published, 1)).orderBy(desc(articles.createdAt));
}

export async function getPublishedArticle(slug: string) {
  const db = await getDb();
  if (!db) {
    const article = articleSeeds.find((entry) => entry.slug === slug);
    return article ? { id: articleSeeds.indexOf(article) + 1, ...article, body: serializeArticleBody(article), published: 1 } : undefined;
  }
  await ensureArticlesSeeded(db);
  const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  return result[0];
}

export async function listFutureProducts() {
  const db = await getDb();
  if (!db) return [
    { id: 1, title: "8-Week Home Fat Loss Challenge", description: "A structured future PDF plan with home and gym options.", price: "Coming soon", status: "coming_soon" },
    { id: 2, title: "12-Week Beginner Muscle Plan", description: "A clear progressive plan for building strength and muscle.", price: "Coming soon", status: "coming_soon" },
  ];
  await seedProductsIfNeeded(db);
  return db.select().from(futureProducts).orderBy(desc(futureProducts.createdAt));
}

export async function addNewsletterSubscriber(input: { name?: string; email: string; source: string }) {
  const db = await getDb();
  if (!db) return { success: true, persisted: false };
  await db.insert(emailSubscribers).values({ name: input.name || null, email: input.email, consent: 1, source: input.source }).onDuplicateKeyUpdate({ set: { name: input.name || null, source: input.source, consent: 1 } });
  return { success: true, persisted: true };
}

export async function addFreePlanSignup(input: { name: string; email: string }) {
  const db = await getDb();
  if (!db) return { success: true, persisted: false, freePlanSignupId: null };
  const result = await db.insert(freePlanSignups).values({ name: input.name, email: input.email, planName: "7-Day Fat Loss Starter", status: "requested" });
  await db.insert(downloads).values({ email: input.email, resourceName: "7-Day Fat Loss Starter", status: "pending_delivery" });
  await addNewsletterSubscriber({ name: input.name, email: input.email, source: "free_plan" });
  return { success: true, persisted: true, freePlanSignupId: Number(result[0].insertId) };
}

export async function addCartRequest(input: { name: string; email: string; planNames: string[]; weeklyChallengeOptIn?: boolean; timeZone?: string }) {
  const deliveryItems = resolvePlanDeliveryItems(input.planNames);
  const weeklyChallengeOptIn = input.weeklyChallengeOptIn === true;
  const timeZone = input.timeZone ?? "UTC";
  const db = await getDb();
  if (!db) {
    return {
      success: true,
      persisted: false,
      deliveryStatus: "pending_provider_setup" as const,
      deliveryRequestId: null,
      planNames: deliveryItems.map((item) => item.title),
    };
  }

  const deliveryRequestId = await db.transaction(async (tx) => {
    const result = await tx.insert(pdfDeliveryRequests).values({
      name: input.name,
      email: input.email,
      status: "pending_provider_setup",
    });
    const requestId = Number(result[0].insertId);

    await tx.insert(pdfDeliveryItems).values(deliveryItems.map((item) => ({
      requestId,
      planName: item.title,
      storageKey: item.storageKey,
    })));

    await tx.insert(downloads).values(deliveryItems.map((item) => ({
      email: input.email,
      resourceName: item.title,
      status: "pending_delivery",
    })));

    return requestId;
  });

  await db.insert(emailSubscribers).values({
    name: input.name,
    email: input.email,
    consent: weeklyChallengeOptIn ? 1 : 0,
    source: "cart_pdf_request",
    isPdfBuyer: 1,
    weeklyChallengeOptIn: weeklyChallengeOptIn ? 1 : 0,
    timeZone,
  }).onDuplicateKeyUpdate({
    set: {
      name: input.name,
      source: "cart_pdf_request",
      isPdfBuyer: 1,
      weeklyChallengeOptIn: weeklyChallengeOptIn ? 1 : 0,
      consent: weeklyChallengeOptIn ? 1 : 0,
      timeZone,
    },
  });
  return {
    success: true,
    persisted: true,
    deliveryStatus: "pending_provider_setup" as const,
    deliveryRequestId,
    planNames: deliveryItems.map((item) => item.title),
  };
}

function normalizeBuyerEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashBuyerAccessCode(email: string, code: string) {
  return createHash("sha256").update(`${normalizeBuyerEmail(email)}:${code}:${ENV.cookieSecret}`).digest("hex");
}

export async function createBuyerAccessCode(email: string) {
  const db = await getDb();
  if (!db) return null;
  const normalizedEmail = normalizeBuyerEmail(email);
  const code = String(randomInt(100_000, 1_000_000));
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await db.insert(buyerAccessCodes).values({
    email: normalizedEmail,
    codeHash: hashBuyerAccessCode(normalizedEmail, code),
    expiresAt,
  });
  return { code, expiresAt };
}

type BuyerAccessCodeCandidate = {
  codeHash: string;
  usedAt: Date | null;
  expiresAt: Date;
  attempts: number;
};

export function selectRedeemableBuyerAccessCode<T extends BuyerAccessCodeCandidate>(records: T[], expectedCodeHash: string, now = Date.now()) {
  return records.find((record) => (
    !record.usedAt
    && record.expiresAt.getTime() >= now
    && record.attempts < 5
    && record.codeHash === expectedCodeHash
  )) ?? null;
}

export async function redeemBuyerAccessCode(input: { email: string; code: string }) {
  const db = await getDb();
  if (!db) return false;
  const normalizedEmail = normalizeBuyerEmail(input.email);
  const records = await db.select().from(buyerAccessCodes)
    .where(eq(buyerAccessCodes.email, normalizedEmail))
    .orderBy(desc(buyerAccessCodes.createdAt))
    .limit(12);
  const expectedCodeHash = hashBuyerAccessCode(normalizedEmail, input.code);
  const record = selectRedeemableBuyerAccessCode(records, expectedCodeHash);
  if (!record) {
    const latestAttemptableRecord = records.find((candidate) => !candidate.usedAt && candidate.expiresAt.getTime() >= Date.now() && candidate.attempts < 5);
    if (latestAttemptableRecord) await db.update(buyerAccessCodes).set({ attempts: latestAttemptableRecord.attempts + 1 }).where(eq(buyerAccessCodes.id, latestAttemptableRecord.id));
    return false;
  }
  const updated = await db.update(buyerAccessCodes).set({ usedAt: new Date() })
    .where(and(eq(buyerAccessCodes.id, record.id), isNull(buyerAccessCodes.usedAt)));
  return Number(updated[0].affectedRows) === 1;
}

export type BuyerProgram = {
  title: string;
  fileName: string;
  storageKey: string;
  type: "starter" | "program";
};

export async function listBuyerPrograms(email: string): Promise<BuyerProgram[]> {
  const db = await getDb();
  if (!db) return [];
  const normalizedEmail = normalizeBuyerEmail(email);
  const [requests, starterSignups] = await Promise.all([
    db.select({ id: pdfDeliveryRequests.id }).from(pdfDeliveryRequests).where(eq(pdfDeliveryRequests.email, normalizedEmail)),
    db.select({ id: freePlanSignups.id }).from(freePlanSignups).where(eq(freePlanSignups.email, normalizedEmail)).limit(1),
  ]);
  const requestIds = new Set(requests.map((request) => request.id));
  const items = requestIds.size ? await db.select().from(pdfDeliveryItems) : [];
  const programs: BuyerProgram[] = items
    .filter((item) => requestIds.has(item.requestId))
    .map((item) => ({
      title: item.planName,
      fileName: `${item.planName.replaceAll(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}.pdf`,
      storageKey: item.storageKey,
      type: "program" as const,
    }));
  if (starterSignups.length) programs.unshift({ ...freeStarterDeliveryItem, type: "starter" });
  return Array.from(new Map(programs.map((program) => [program.title, program])).values());
}

export async function getBuyerProgram(email: string, title: string): Promise<BuyerProgram | null> {
  const programs = await listBuyerPrograms(email);
  return programs.find((program) => program.title === title) ?? null;
}

export type WeeklyChallengeRecipient = {
  id: number;
  name: string | null;
  email: string;
  timeZone: string;
};

export async function listWeeklyChallengeRecipients(): Promise<WeeklyChallengeRecipient[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: emailSubscribers.id,
    name: emailSubscribers.name,
    email: emailSubscribers.email,
    timeZone: emailSubscribers.timeZone,
  }).from(emailSubscribers).where(and(
    eq(emailSubscribers.isPdfBuyer, 1),
    eq(emailSubscribers.weeklyChallengeOptIn, 1),
    eq(emailSubscribers.consent, 1),
    isNull(emailSubscribers.unsubscribedAt),
  ));
}

export async function claimWeeklyChallengeDelivery(input: { subscriberId: number; weekKey: string; challengeKey: string }) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.insert(weeklyChallengeDeliveries).values({
      subscriberId: input.subscriberId,
      weekKey: input.weekKey,
      challengeKey: input.challengeKey,
      status: "pending",
    });
    return Number(result[0].insertId);
  } catch {
    // The (subscriber, week) unique constraint makes repeated cron runs idempotent.
    return null;
  }
}

export async function markWeeklyChallengeSent(input: { deliveryId: number; subscriberId: number; weekKey: string; providerMessageId: string }) {
  const db = await getDb();
  if (!db) return false;
  await db.update(weeklyChallengeDeliveries).set({
    status: "sent",
    providerMessageId: input.providerMessageId,
    errorMessage: null,
    sentAt: new Date(),
  }).where(eq(weeklyChallengeDeliveries.id, input.deliveryId));
  await db.update(emailSubscribers).set({ lastWeeklyChallengeWeek: input.weekKey }).where(eq(emailSubscribers.id, input.subscriberId));
  return true;
}

export async function markWeeklyChallengeFailed(deliveryId: number, errorMessage: string) {
  const db = await getDb();
  if (!db) return false;
  await db.update(weeklyChallengeDeliveries).set({
    status: "failed",
    errorMessage: errorMessage.slice(0, 4_000),
  }).where(eq(weeklyChallengeDeliveries.id, deliveryId));
  return true;
}

export async function isWeeklyChallengeScheduleActive(taskUid: string) {
  const db = await getDb();
  if (!db) return false;
  const records = await db.select({ id: weeklyChallengeSchedules.id }).from(weeklyChallengeSchedules)
    .where(and(eq(weeklyChallengeSchedules.scheduleCronTaskUid, taskUid), eq(weeklyChallengeSchedules.enabled, 1)))
    .limit(1);
  return Boolean(records[0]);
}

export async function getBuyerChallengePreferences(email: string) {
  const db = await getDb();
  if (!db) return { weeklyChallengeOptIn: false, timeZone: "UTC" };
  const records = await db.select({
    weeklyChallengeOptIn: emailSubscribers.weeklyChallengeOptIn,
    timeZone: emailSubscribers.timeZone,
  }).from(emailSubscribers).where(and(
    eq(emailSubscribers.email, normalizeBuyerEmail(email)),
    eq(emailSubscribers.isPdfBuyer, 1),
  )).limit(1);
  const record = records[0];
  return { weeklyChallengeOptIn: record?.weeklyChallengeOptIn === 1, timeZone: record?.timeZone ?? "UTC" };
}

export async function updateBuyerChallengePreferences(input: { email: string; weeklyChallengeOptIn: boolean; timeZone: string }) {
  const db = await getDb();
  if (!db) return false;
  await db.update(emailSubscribers).set({
    weeklyChallengeOptIn: input.weeklyChallengeOptIn ? 1 : 0,
    consent: input.weeklyChallengeOptIn ? 1 : 0,
    timeZone: input.timeZone,
    unsubscribedAt: input.weeklyChallengeOptIn ? null : new Date(),
  }).where(and(eq(emailSubscribers.email, normalizeBuyerEmail(input.email)), eq(emailSubscribers.isPdfBuyer, 1)));
  return true;
}

export async function getActiveWeeklyChallengeSchedule() {
  const db = await getDb();
  if (!db) return null;
  const records = await db.select().from(weeklyChallengeSchedules)
    .where(eq(weeklyChallengeSchedules.enabled, 1))
    .orderBy(desc(weeklyChallengeSchedules.updatedAt))
    .limit(1);
  return records[0] ?? null;
}

export async function saveWeeklyChallengeSchedule(taskUid: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available for weekly challenge scheduling.");
  await db.insert(weeklyChallengeSchedules).values({ scheduleCronTaskUid: taskUid, enabled: 1 })
    .onDuplicateKeyUpdate({ set: { enabled: 1 } });
}

export async function getPdfDeliveryPayload(requestId: number) {
  const db = await getDb();
  if (!db) return null;

  const request = await db.select().from(pdfDeliveryRequests).where(eq(pdfDeliveryRequests.id, requestId)).limit(1);
  if (!request[0]) return null;

  const items = await db.select().from(pdfDeliveryItems).where(eq(pdfDeliveryItems.requestId, requestId));
  return { request: request[0], items };
}

export async function markPdfDeliverySent(requestId: number, providerMessageId: string) {
  const db = await getDb();
  if (!db) return false;
  await db.update(pdfDeliveryRequests).set({
    status: "sent",
    providerMessageId,
    errorMessage: null,
    sentAt: new Date(),
  }).where(eq(pdfDeliveryRequests.id, requestId));
  return true;
}

export async function markPdfDeliveryFailed(requestId: number, errorMessage: string) {
  const db = await getDb();
  if (!db) return false;
  await db.update(pdfDeliveryRequests).set({
    status: "failed",
    errorMessage: errorMessage.slice(0, 4_000),
  }).where(eq(pdfDeliveryRequests.id, requestId));
  return true;
}

export type OwnerDeliveryRecord = {
  id: number;
  name: string;
  email: string;
  status: string;
  providerMessageId: string | null;
  errorMessage: string | null;
  sentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  planNames: string[];
  delayReason: string;
};

export function getFriendlyDeliveryReason(status: string, errorMessage: string | null) {
  if (status === "sent") return "✅ Sent — the selected PDF attachments were accepted for delivery.";
  if (errorMessage && /(?:daily|hourly|sending|send)[\s\S]{0,40}(?:limit|quota)|(?:limit|quota)[\s\S]{0,40}(?:daily|hourly|sending|send)|too many requests/i.test(errorMessage)) {
    return "📬 Free email limit reached — the request is saved and ready for a manual resend.";
  }
  if (status === "pending_provider_setup") return "⏳ Delivery is waiting for its email setup.";
  return "🛠️ Email machine wobble — review the saved error and resend when ready.";
}

export async function listOwnerDeliveryRecords(): Promise<OwnerDeliveryRecord[]> {
  const db = await getDb();
  if (!db) return [];
  const [requests, items] = await Promise.all([
    db.select().from(pdfDeliveryRequests).orderBy(desc(pdfDeliveryRequests.updatedAt)),
    db.select().from(pdfDeliveryItems),
  ]);
  const planNamesByRequest = new Map<number, string[]>();
  for (const item of items) {
    const planNames = planNamesByRequest.get(item.requestId) ?? [];
    planNames.push(item.planName);
    planNamesByRequest.set(item.requestId, planNames);
  }
  return requests.map((request) => ({
    ...request,
    planNames: planNamesByRequest.get(request.id) ?? [],
    delayReason: getFriendlyDeliveryReason(request.status, request.errorMessage),
  }));
}

export function ownerDeliveryRecordsToCsv(records: OwnerDeliveryRecord[]) {
  const escapeCsv = (value: string | number | null | Date) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const rows = records.map((record) => [
    record.id,
    record.name,
    record.email,
    record.planNames.join(" | "),
    record.status,
    record.delayReason,
    record.createdAt.toISOString(),
    record.sentAt?.toISOString() ?? null,
  ].map(escapeCsv).join(","));
  return ["request_id,name,email,selected_plans,status,reason,requested_at,sent_at", ...rows].join("\n");
}

export async function addWaitlistRequest(input: { name?: string; email: string }) {
  return addNewsletterSubscriber({ ...input, source: "paid_plan_waitlist" });
}

export async function addContactMessage(input: { name: string; email: string; message: string }) {
  const db = await getDb();
  if (!db) return { success: true, persisted: false };
  await db.insert(contactMessages).values(input);
  return { success: true, persisted: true };
}

export async function addStorySubmission(input: { name: string; email: string; story: string; photoData: string; photoName: string; photoMime: "image/jpeg" | "image/png" | "image/webp"; consent: true }) {
  const db = await getDb();
  if (!db) return { success: true, persisted: false };

  const dataMatch = input.photoData.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!dataMatch || dataMatch[1] !== input.photoMime) throw new Error("Upload a valid JPG, PNG, or WebP photo.");
  const bytes = Buffer.from(dataMatch[2], "base64");
  assertSafeStoryImage(bytes, input.photoMime);

  const extension = input.photoMime === "image/jpeg" ? "jpg" : input.photoMime.split("/")[1];
  const uploaded = await storagePut(`community-stories/${crypto.randomUUID()}.${extension}`, bytes, input.photoMime);
  await db.insert(storySubmissions).values({
    name: input.name,
    email: input.email,
    story: input.story,
    photoKey: uploaded.key,
    photoUrl: uploaded.url,
    photoName: input.photoName,
    photoMime: input.photoMime,
    consent: 1,
    status: "pending_review",
  });
  return { success: true, persisted: true };
}
