# Build With Coach — Owner Operating Report

**Prepared:** 27 August 2026  
**Current verified version:** The checkpoint delivered with this report contains the buyer inbox-guidance update.  
**Purpose:** Explain how the website delivers PDFs, protects buyer access, handles email failures, and prepares weekly challenges.

## 1. What buyers experience

The website now delivers the actual full PDF files as **email attachments**. Buyers do not receive a temporary PDF link as the main delivery method. A buyer adds one or more programs to Cart, chooses **Request my PDFs**, enters their name and email, and submits the popup. The request and selected plans are stored first. The buyer then sees an immediate **Preparing your PDF** screen instead of a blank wait while the email provider is working.

If delivery succeeds, the buyer is told that their full PDF is attached and is reminded to check **Inbox, Spam, Promotions, and All Mail** if it is not visible. This exact reminder is now present in the Buy PDF popup.

| Buyer action | Website response |
|---|---|
| Requests the free starter | Sends the full **7-Day Fat Loss Starter** PDF attachment. |
| Requests programs from the cart | Sends only the programs selected in that cart as full PDF attachments. |
| Cannot find the email | Sees the Inbox, Spam, Promotions, and All Mail reminder. |
| Loses the email attachment | Can use My Programs as a private backup. |

## 2. PDF catalog and file delivery

Five PDFs are stored privately in managed storage and are not placed in the public project files. The attachment audit confirmed that the individual PDFs are within the documented transactional-email attachment constraints for this workflow.

| PDF | Delivery method |
|---|---|
| 7-Day Fat Loss Starter | Free signup email attachment and My Programs backup. |
| Home Zero | Cart-selected email attachment and My Programs backup. |
| Gym Build | Cart-selected email attachment and My Programs backup. |
| Fuel Plan | Cart-selected email attachment and My Programs backup. |
| Zero to Growth | Cart-selected email attachment and My Programs backup. |

The server validates every requested plan against its private catalog. A buyer cannot request an arbitrary storage key or download a plan that was not assigned to their email.

## 3. Email sender and reliability

Customer-facing emails use the sender identity:

> **Build With Coach <buildwithcoach@gmail.com>**

The Mailjet sender was initially inactive. It is now active, and a real owner-approved 7-Day Fat Loss Starter attachment email was sent and received at `shopurbancanvas@gmail.com`. The email subject is **Your Build With Coach PDF is attached**.

Mailjet is the primary transactional sender. Resend is a backup only for an eligible Mailjet technical server failure. The system does not move to another provider when Mailjet reports a sending quota, account limit, validation issue, or unknown send outcome. That boundary avoids duplicate delivery and avoids bypassing a provider limit.

| Provider result | Buyer message | Owner action |
|---|---|---|
| Mailjet or eligible Resend delivery succeeds | Full selected PDF attachments are sent. | Review the sent record if needed. |
| Mailjet daily limit is reached | “Sorry for the delay 😅 The free email plan hit today’s ceiling.” | Use the owner desk to resend later. |
| Another provider failure occurs | “Sorry for the delay 🛠️ The email machine had a wobble.” | Review the saved reason and resend when ready. |

Every delivery request is saved before the email attempt. This means a provider problem does not erase the buyer’s name, email, or selected plans.

## 4. My Programs: private backup access

**My Programs** is part of the Build With Coach website at `/my-programs`. It is not another website and does not need Supabase or a separate customer database account.

The buyer enters the same email used at checkout and receives a 6-digit code. The code lasts 15 minutes and can be used once. A buyer may receive more than one recent code; the corrected flow accepts any still-valid, unused code for that same email, so a later delivery email does not wrongly block an earlier recent code.

After a correct code is entered, the browser receives a private 30-day buyer session. The library shows only the programs assigned to that email. When the buyer chooses **Open PDF**, the website checks that private session, validates ownership, and streams the PDF through a protected same-site route. This replaced the browser-facing storage URL that previously showed **AccessDenied**.

The private stream uses `private, no-store` response caching and does not reveal a permanent public PDF URL. The attachment remains the simple primary copy; My Programs is the protected recovery option.

## 5. Owner delivery desk

Sign in as the project owner and open:

> `/owner/deliveries`

The desk is protected from non-owner users. It lets you review buyer delivery records, names, emails, selected plans, the friendly reason shown to buyers, and the raw saved provider reason. You can resend a non-sent request and export buyer email data as CSV for manual outreach.

| Owner task | Where to do it |
|---|---|
| Review email requests | `/owner/deliveries` |
| See selected PDFs | Each private delivery record |
| Resend a waiting/failed request | The record’s resend control |
| Export buyer email records | The private CSV export control |
| Manage weekly automation | The weekly challenge card in the owner desk after publication |

## 6. Weekly Sunday challenges

The weekly challenge system is built but is **not active until you publish the latest checkpoint and activate it from the owner desk**. It is designed as follows:

1. A PDF buyer can tick **“Yes, send me Sunday weekly challenges”** at checkout.
2. Only buyers who tick the box are eligible. Buying a PDF alone does not automatically add a person to weekly marketing email.
3. The buyer’s browser time zone is saved at checkout. They can later change the time zone or turn off weekly challenges in My Programs.
4. The system checks the eligible list every 15 minutes.
5. On Sunday at **6:00 PM in the buyer’s saved local time zone**, it sends one challenge from a varied library.
6. A durable per-buyer, per-week record prevents a second send in the same weekly window.
7. The next challenge rotates so the immediately previous challenge is not repeated for the same buyer.

The initial library contains 12 simple training and nutrition challenges. The system uses the same Mailjet-primary, technical-failure-only Resend backup boundary as PDF delivery.

### Required activation step

After publishing, sign in as owner, open `/owner/deliveries`, and use the weekly challenge activation card. The owner control is intentionally unavailable in development mode. It requires the published site so scheduled calls are authenticated and reachable.

## 7. Security controls in place

The site has practical layered protections, but no website can honestly claim that it is impossible to attack. The current controls include:

| Area | Protection |
|---|---|
| Buyer delivery data | Requests are stored server-side before sending; owner views are admin-only. |
| Provider keys | Mailjet and Resend keys are secure environment settings, never returned to the browser or committed to code. |
| PDFs | Private managed storage, server-only plan mapping, buyer entitlement checks, and protected same-site download streaming. |
| Buyer access codes | Hashed codes, 15-minute expiry, one-time use, five-attempt cap, and no email-enumeration response. |
| Public forms | Input validation, throttling, request-size limits, and safe error handling. |
| Story uploads | Strict permitted image formats, signature checks, size/dimension limits, and managed storage validation. |
| Browser responses | CSP, anti-framing, no-sniff, referrer, permissions, and HTTPS-related security controls. |

## 8. Verified tests and checks

The current buyer-delivery work was tested with real and automated checks.

| Check | Result |
|---|---|
| Real active-sender email test | Full starter PDF attachment was received at the owner-approved test inbox. |
| Private My Programs download | Authorized request returned a valid PDF with private no-store headers. |
| Buyer access-code regression | Valid earlier recent code, expired code, used code, and attempt-limited code behavior covered. |
| Mailjet/Resend fallback | Primary success, eligible technical fallback, attachment payload, and limit non-fallback covered. |
| Full automated suite | 35 Vitest tests passed. |
| TypeScript | Passed. |
| Production build | Passed. |

The build still reports the existing Vite large-chunk warning. It is non-blocking, but future optimization can split large JavaScript chunks for faster first loads.

## 9. What you should do next

1. Review the popup reminder and My Programs page in the latest preview.
2. Publish the latest checkpoint when you are satisfied.
3. Sign in as owner and open `/owner/deliveries`.
4. Activate the Sunday challenge card if you want the 6:00 PM local-time automation to begin.
5. Keep `buildwithcoach@gmail.com` active in Mailjet. The other sender can remain as a private backup; it is not shown to customers.

## 10. Current status summary

| Feature | Status |
|---|---|
| Website and mobile layout | Ready. |
| Selected full-PDF email attachments | Working and owner-tested. |
| Customer sender name | Working as Build With Coach. |
| My Programs private backup | Working with corrected code handling and protected PDF route. |
| Owner delivery desk | Working and owner-only. |
| Buyer email-location reminder | Added to the Buy PDF popup. |
| Weekly challenge automation | Built and awaiting publication plus owner activation. |
| Vercel migration | Not recommended without moving the private database and PDF storage; current hosting keeps the full workflow together. |
