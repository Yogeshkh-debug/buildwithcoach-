# Build With Coach: Vercel Free Handoff

This project is a **full-stack** fitness website. The design can be deployed to Vercel, but the checkout, secure My Programs library, buyer records, and email delivery also depend on a server, a database, and private PDF storage.

## Global Sunday challenge automation

The selected Vercel free-plan schedule is one global run every Sunday at `12:00 UTC` (`0 12 * * 0` in Vercel’s five-field cron format). It sends one rotating challenge to every PDF buyer who explicitly selected weekly challenges.

This is a global send window, not an exact 6:00 PM message in every country. Vercel Hobby cron invocations may occur within the configured hour, so delivery may be delayed by up to an hour. The database delivery record has a unique buyer-and-week key, which prevents duplicate messages if the job is invoked more than once.

## Services needed for a functional Vercel migration

| Capability | Current project service | Vercel migration requirement |
|---|---|---|
| Buyer records and program access | Managed project MySQL/TiDB database | A database reachable from Vercel. Confirm the existing `DATABASE_URL` is externally reachable, or create a separate hosted database and migrate the schema/data. |
| Private PDFs | Managed project storage | A private object-storage service that Vercel can access, then re-upload the five PDFs and update their server-only storage mappings. |
| Email | Mailjet primary and Resend technical backup | Add the existing Mailjet, Resend, and verified sender values to Vercel Project Settings. Never put them in GitHub. |
| Buyer sessions | Server-side signed cookie | Create a new production `JWT_SECRET` in Vercel Project Settings. |
| Owner delivery desk | Current site owner authentication | Replace or reconfigure the project-specific owner authentication so the Vercel deployment can recognize the owner securely. |
| Sunday trigger | Global weekly schedule | Add `vercel.json` with the Sunday cron and set a strong Vercel-only `CRON_SECRET` for authorization. |

## What will not work by only uploading GitHub files

The public visual pages may render, but without a database and private file storage the site cannot safely save buyers, show My Programs, or protect PDF access. The current managed project database and storage credentials are not committed to the repository and must not be copied into source code.

## Environment values to add in Vercel

Add these only in **Vercel Project Settings → Environment Variables**, usually for Production and Preview as appropriate. Do not commit a `.env` file.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Connection string for the chosen Vercel-reachable database. |
| `JWT_SECRET` | Newly generated secret for secure buyer access sessions. |
| `MAILJET_API_KEY` | Mailjet transactional email key. |
| `MAILJET_SECRET_KEY` | Mailjet transactional email secret. |
| `MAILJET_SENDER_EMAIL` | Mailjet-verified sender address. |
| `RESEND_API_KEY` | Resend backup email key. |
| `RESEND_SENDER_EMAIL` | Resend-verified sender address. |
| `CRON_SECRET` | A new random secret used only by Vercel’s Sunday cron request. |
| Storage-provider variables | The private bucket credentials and region/endpoint required by the selected storage provider. |

## Required decision before a functional Vercel launch

Choose a database and private PDF storage service that Vercel can access. A Vercel free deployment alone does not include durable database records or private PDF storage. After those services are available, the server can be migrated to Vercel’s Express function model, the PDFs can be moved, and the protected global-Sunday cron can be added.

## Official references

- Vercel Cron Jobs: https://vercel.com/docs/cron-jobs
- Vercel Cron management and `CRON_SECRET`: https://vercel.com/docs/cron-jobs/manage-cron-jobs
- Vercel Hobby cron limitations: https://vercel.com/docs/cron-jobs/usage-and-pricing
- Vercel Express deployments: https://vercel.com/docs/frameworks/backend/express
- Vercel environment variables: https://vercel.com/docs/environment-variables
