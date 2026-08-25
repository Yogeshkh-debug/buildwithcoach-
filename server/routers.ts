import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import {
  addContactMessage,
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
    newsletter: publicProcedure.input(z.object({ name: z.string().trim().max(160).optional(), email: emailSchema, source: z.string().max(80) })).mutation(({ input }) => addNewsletterSubscriber(input)),
    freePlan: publicProcedure.input(z.object({ name: nameSchema, email: emailSchema })).mutation(({ input }) => addFreePlanSignup(input)),
    waitlist: publicProcedure.input(z.object({ name: z.string().trim().max(160).optional(), email: emailSchema })).mutation(({ input }) => addWaitlistRequest(input)),
    contact: publicProcedure.input(z.object({ name: nameSchema, email: emailSchema, message: z.string().trim().min(10, "Write at least 10 characters.").max(3000) })).mutation(({ input }) => addContactMessage(input)),
    story: publicProcedure.input(z.object({
      name: nameSchema,
      email: emailSchema,
      story: z.string().trim().min(50, "Share at least 50 characters so we understand your story.").max(3000),
      photoData: z.string().max(3_000_000),
      photoName: z.string().trim().min(1).max(260),
      photoMime: z.enum(["image/jpeg", "image/png", "image/webp"]),
      consent: z.literal(true, { error: "You need to confirm publication consent before submitting." }),
    })).mutation(({ input }) => addStorySubmission(input)),
  }),
});

export type AppRouter = typeof appRouter;
