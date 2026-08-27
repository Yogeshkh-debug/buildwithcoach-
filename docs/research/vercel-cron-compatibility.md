# Vercel Cron Compatibility Review

Official Vercel documentation was reviewed on 2026-08-27.

## Findings

Vercel Cron invokes the production deployment with an HTTP `GET` request, uses a five-field UTC cron expression, and can authenticate requests with `Authorization: Bearer <CRON_SECRET>`. Vercel advises idempotent processing because scheduled delivery can be delayed, missed, or duplicated.

The existing Build With Coach scheduled handler currently uses the project’s built-in scheduler semantics: a six-field UTC expression, `POST`, and a platform-specific authenticated scheduled identity. It is therefore not directly Vercel-compatible.

On Vercel Hobby, Cron can run only once per day and may be delayed by up to an hour. That cannot reliably send each opted-in buyer a message at Sunday 6:00 PM in their own local time zone. A Vercel Pro cron can run at a minute-level interval and could support the current 15-minute, timezone-aware reconciler after an Express-to-Vercel serverless migration and a protected `GET` endpoint are completed.

## Sources

- https://vercel.com/docs/cron-jobs
- https://vercel.com/docs/cron-jobs/manage-cron-jobs
- https://vercel.com/docs/cron-jobs/usage-and-pricing
