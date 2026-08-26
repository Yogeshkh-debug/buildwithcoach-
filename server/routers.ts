import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicCaptureProcedure, publicProcedure, router } from "./_core/trpc";
import {
  addContactMessage,
  addCartRequest,
  addFreePlanSignup,
  addNewsletterSubscriber,
  addStorySubmission,
  addWaitlistRequest,
  getPublishedArticle,
  listFutureProducts,
  listPublishedArticles,
} from "./db";

const emailSchema = z.string().trim().email("Enter a valid email address.").max(320);
const nameSchema = z.string().trim().min(2, "Enter at least 2 characters.").max(160);
const storyPhotoNameSchema = z.string().trim().min(1).max(120).regex(/^[A-Za-z0-9][A-Za-z0-9._-]*\.(?:jpg|jpeg|png|webp)$/i, "Use a simple JPG, PNG, or WebP filename.");

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
  captures: router({
    newsletter: publicCaptureProcedure.input(z.object({ name: z.string().trim().max(160).optional(), email: emailSchema, source: z.string().trim().min(2).max(80) })).mutation(({ input }) => addNewsletterSubscriber(input)),
    freePlan: publicCaptureProcedure.input(z.object({ name: nameSchema, email: emailSchema })).mutation(({ input }) => addFreePlanSignup(input)),
    cartRequest: publicCaptureProcedure.input(z.object({ name: nameSchema, email: emailSchema, planNames: z.array(z.string().trim().min(2).max(160)).min(1).max(8) })).mutation(({ input }) => addCartRequest(input)),
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
