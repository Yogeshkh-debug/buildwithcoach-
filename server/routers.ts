import { z } from "zod";
import { parse as parseCookie } from "cookie";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicCaptureProcedure, publicProcedure, router } from "./_core/trpc";
import {
  addContactMessage,
  addCartRequest,
  addFreePlanSignup,
  addNewsletterSubscriber,
  addStorySubmission,
  addWaitlistRequest,
  getPdfDeliveryPayload,
  createBuyerAccessCode,
  getBuyerProgram,
  getBuyerChallengePreferences,
  getActiveWeeklyChallengeSchedule,
  listBuyerPrograms,
  listOwnerDeliveryRecords,
  getPublishedArticle,
  listFutureProducts,
  listPublishedArticles,
  markPdfDeliveryFailed,
  markPdfDeliverySent,
  ownerDeliveryRecordsToCsv,
  redeemBuyerAccessCode,
  saveWeeklyChallengeSchedule,
  updateBuyerChallengePreferences,
} from "./db";
import { sendBuyerAccessCodeEmail, sendMailjetPdfDelivery } from "./mailjetDelivery";
import { createBuyerSession, verifyBuyerSession } from "./buyerSession";
import { createHeartbeatJob } from "./_core/heartbeat";
import { freeStarterDeliveryItem, resolvePlanDeliveryItems } from "./planDelivery";

const emailSchema = z.string().trim().email("Enter a valid email address.").max(320);
const nameSchema = z.string().trim().min(2, "Enter at least 2 characters.").max(160);
const storyPhotoNameSchema = z.string().trim().min(1).max(120).regex(/^[A-Za-z0-9][A-Za-z0-9._-]*\.(?:jpg|jpeg|png|webp)$/i, "Use a simple JPG, PNG, or WebP filename.");
const timeZoneSchema = z.string().trim().min(1).max(64).regex(/^[A-Za-z_]+(?:\/[A-Za-z_+-]+)+$/, "Choose a valid time zone.");
const BUYER_SESSION_COOKIE = "bwc_buyer_session";

async function getBuyerEmailFromRequest(cookieHeader: string | undefined) {
  const token = parseCookie(cookieHeader ?? "")[BUYER_SESSION_COOKIE];
  return token ? verifyBuyerSession(token) : null;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  articles: router({
    list: publicProcedure.query(() => listPublishedArticles()),
    bySlug: publicProcedure.input(z.object({ slug: z.string().min(1).max(160) })).query(({ input }) => getPublishedArticle(input.slug)),
  }),
  products: router({
    list: publicProcedure.query(() => listFutureProducts()),
  }),
  delivery: router({
    list: adminProcedure.query(() => listOwnerDeliveryRecords()),
    exportBuyerEmails: adminProcedure.query(async () => {
      const records = await listOwnerDeliveryRecords();
      return {
        fileName: `build-with-coach-pdf-buyers-${new Date().toISOString().slice(0, 10)}.csv`,
        csv: ownerDeliveryRecordsToCsv(records),
      };
    }),
    resend: adminProcedure.input(z.object({ requestId: z.number().int().positive() })).mutation(async ({ input }) => {
      const payload = await getPdfDeliveryPayload(input.requestId);
      if (!payload) return { status: "failed" as const, message: "This saved delivery request was not found." };
      if (payload.request.status === "sent") return { status: "already_sent" as const, message: "This request has already been sent." };

      const accessCode = await createBuyerAccessCode(payload.request.email);
      if (!accessCode) return { status: "failed" as const, message: "Could not prepare a secure program access code." };
      const result = await sendMailjetPdfDelivery({
        requestId: input.requestId,
        recipientName: payload.request.name,
        recipientEmail: payload.request.email,
        plans: resolvePlanDeliveryItems(payload.items.map((item) => item.planName)),
        accessCode: accessCode.code,
      });
      if (result.status === "sent") {
        await markPdfDeliverySent(input.requestId, result.providerMessageId);
        return { status: "sent" as const, message: "Secure My Programs access code sent successfully." };
      }
      if (result.status === "limit_reached" || result.status === "failed") {
        await markPdfDeliveryFailed(input.requestId, result.errorMessage);
        return { status: result.status, message: result.errorMessage };
      }
      return { status: "failed" as const, message: "The email provider returned an unexpected access-code state." };
    }),
  }),
  buyerAccess: router({
    requestCode: publicCaptureProcedure.input(z.object({ email: emailSchema })).mutation(async ({ input }) => {
      const programs = await listBuyerPrograms(input.email);
      const accessCode = await createBuyerAccessCode(input.email);
      if (!accessCode) return { status: "failed" as const };
      const result = await sendBuyerAccessCodeEmail({
        requestId: Date.now(),
        recipientName: "Coach",
        recipientEmail: input.email,
        code: accessCode.code,
        programNames: programs.length ? programs.map((program) => program.title) : ["Build With Coach library check"],
      });
      return { status: result.status };
    }),
    verifyCode: publicCaptureProcedure.input(z.object({ email: emailSchema, code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code.") })).mutation(async ({ input, ctx }) => {
      const accepted = await redeemBuyerAccessCode(input);
      if (!accepted) return { status: "invalid" as const };
      const token = await createBuyerSession(input.email);
      ctx.res.cookie(BUYER_SESSION_COOKIE, token, { ...getSessionCookieOptions(ctx.req), maxAge: 30 * 24 * 60 * 60 * 1000 });
      return { status: "verified" as const };
    }),
    programs: publicProcedure.query(async ({ ctx }) => {
      const email = await getBuyerEmailFromRequest(ctx.req.headers.cookie);
      if (!email) return { status: "unauthorized" as const, programs: [] };
      const [programs, preferences] = await Promise.all([listBuyerPrograms(email), getBuyerChallengePreferences(email)]);
      return { status: "authorized" as const, programs, preferences };
    }),
    openProgram: publicProcedure.input(z.object({ title: z.string().trim().min(2).max(160) })).mutation(async ({ input, ctx }) => {
      const email = await getBuyerEmailFromRequest(ctx.req.headers.cookie);
      if (!email) return { status: "unauthorized" as const };
      const program = await getBuyerProgram(email, input.title);
      if (!program) return { status: "not_found" as const };
      return { status: "authorized" as const, url: `/api/buyer-program/download/${encodeURIComponent(program.title)}`, fileName: program.fileName };
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(BUYER_SESSION_COOKIE, { ...getSessionCookieOptions(ctx.req), maxAge: -1 });
      return { success: true } as const;
    }),
    updateChallengePreferences: publicProcedure.input(z.object({ weeklyChallengeOptIn: z.boolean(), timeZone: timeZoneSchema })).mutation(async ({ input, ctx }) => {
      const email = await getBuyerEmailFromRequest(ctx.req.headers.cookie);
      if (!email) return { status: "unauthorized" as const };
      await updateBuyerChallengePreferences({ email, ...input });
      return { status: "updated" as const };
    }),
  }),
  weeklyChallenge: router({
    status: adminProcedure.query(async () => ({ schedule: await getActiveWeeklyChallengeSchedule() })),
    activate: adminProcedure.mutation(async ({ ctx }) => {
      if (process.env.NODE_ENV !== "production") {
        return { status: "publish_required" as const };
      }
      const existing = await getActiveWeeklyChallengeSchedule();
      if (existing) return { status: "active" as const, nextStep: "already_active" as const };
      const cookies = parseCookie(ctx.req.headers.cookie ?? "");
      const bearer = ctx.req.headers.authorization?.startsWith("Bearer ") ? ctx.req.headers.authorization.slice(7) : "";
      const task = await createHeartbeatJob({
        name: "build-with-coach-weekly-challenge-delivery",
        cron: "0 */15 * * * *",
        path: "/api/scheduled/weekly-challenge",
        method: "POST",
        description: "Checks opted-in PDF buyers every 15 minutes and sends one varied Sunday challenge at 6:00 PM in each buyer's local time zone.",
      }, cookies[COOKIE_NAME] ?? bearer);
      await saveWeeklyChallengeSchedule(task.taskUid);
      return { status: "active" as const, nextStep: "created" as const, nextExecutionAt: task.nextExecutionAt ?? null };
    }),
  }),
  captures: router({
    newsletter: publicCaptureProcedure.input(z.object({ name: z.string().trim().max(160).optional(), email: emailSchema, source: z.string().trim().min(2).max(80) })).mutation(({ input }) => addNewsletterSubscriber(input)),
    freePlan: publicCaptureProcedure.input(z.object({ name: nameSchema, email: emailSchema })).mutation(async ({ input }) => {
      const created = await addFreePlanSignup(input);
      if (!created.freePlanSignupId) return { ...created, deliveryStatus: "failed" as const };
      const accessCode = await createBuyerAccessCode(input.email);
      if (!accessCode) return { ...created, deliveryStatus: "failed" as const };
      const result = await sendMailjetPdfDelivery({
        requestId: created.freePlanSignupId,
        recipientName: input.name,
        recipientEmail: input.email,
        plans: [freeStarterDeliveryItem],
        accessCode: accessCode.code,
      });
      return { ...created, deliveryStatus: result.status };
    }),
    cartRequest: publicCaptureProcedure.input(z.object({ name: nameSchema, email: emailSchema, planNames: z.array(z.string().trim().min(2).max(160)).min(1).max(4), weeklyChallengeOptIn: z.boolean(), timeZone: timeZoneSchema })).mutation(async ({ input }) => {
      const created = await addCartRequest(input);
      if (!created.deliveryRequestId) return created;

      const payload = await getPdfDeliveryPayload(created.deliveryRequestId);
      if (!payload) return { ...created, deliveryStatus: "failed" as const };

      const accessCode = await createBuyerAccessCode(input.email);
      if (!accessCode) return { ...created, deliveryStatus: "failed" as const };
      const result = await sendMailjetPdfDelivery({
        requestId: created.deliveryRequestId,
        recipientName: payload.request.name,
        recipientEmail: payload.request.email,
        plans: resolvePlanDeliveryItems(payload.items.map((item) => item.planName)),
        accessCode: accessCode.code,
      });
      if (result.status === "sent") await markPdfDeliverySent(created.deliveryRequestId, result.providerMessageId);
      if (result.status === "limit_reached") await markPdfDeliveryFailed(created.deliveryRequestId, result.errorMessage);
      if (result.status === "failed") await markPdfDeliveryFailed(created.deliveryRequestId, result.errorMessage);
      return { ...created, deliveryStatus: result.status };
    }),
    waitlist: publicCaptureProcedure.input(z.object({ name: z.string().trim().max(160).optional(), email: emailSchema })).mutation(({ input }) => addWaitlistRequest(input)),
    contact: publicCaptureProcedure.input(z.object({ name: nameSchema, email: emailSchema, message: z.string().trim().min(10, "Write at least 10 characters.").max(3000) })).mutation(({ input }) => addContactMessage(input)),
    story: publicCaptureProcedure.input(z.object({
      name: nameSchema,
      email: emailSchema,
      story: z.string().trim().min(50, "Share at least 50 characters so we understand your story.").max(3000),
      photoData: z.string().max(2_800_000),
      photoName: storyPhotoNameSchema,
      photoMime: z.enum(["image/jpeg", "image/png", "image/webp"]),
      consent: z.literal(true, { error: "You need to confirm publication consent before submitting." }),
    })).mutation(({ input }) => addStorySubmission(input)),
  }),
});

export type AppRouter = typeof appRouter;
