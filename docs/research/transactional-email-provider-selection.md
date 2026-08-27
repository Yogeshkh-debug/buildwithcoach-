# Transactional Email Provider Selection

## Decision

Brevo was the initial provider choice, but its newly created account did not provision a working workspace and repeatedly showed an unusable account-switch screen. The fallback provider is **Mailjet**, subject to the owner completing its signup and sender validation. The application will not rotate accounts or providers to circumvent plan limits.

## Verified provider facts

Brevo states that its Email API free tier allows **300 emails per day** with no credit card. Its API supports transactional email over HTTPS and accepts an API key in the `api-key` header. Before sending, Brevo requires an API key and a registered sender email/domain. The delivery endpoint is `POST https://api.brevo.com/v3/smtp/email`; successful requests return a message ID suitable for delivery tracking. [Brevo Email API](https://www.brevo.com/features/email-api/) [Brevo transactional email docs](https://developers.brevo.com/docs/send-a-transactional-email)

Resend also has a free tier, but the official pricing page limits it to 3,000 emails per month and 100 emails per day. Its Node.js documentation requires an API key and verified domain for production sender addresses. [Resend pricing](https://resend.com/pricing) [Resend Node.js docs](https://resend.com/docs/send-with-nodejs)

Mailjet’s official free plan states that it includes 6,000 emails per month with a maximum of 200 emails per day and does not require a credit card. Its Send API requires a validated and active sender, accepts a public/private API-key pair using HTTP basic authentication, and reports a unique message ID when delivery is accepted. [Mailjet pricing](https://www.mailjet.com/pricing/) [Mailjet Send API v3.1](https://dev.mailjet.com/email/guides/send-api-v31/)

## Delivery design implication

The server will save every cart request before attempting email delivery. If the configured provider is unavailable or rejects a send, the request remains in a failed or pending state rather than showing a false sent confirmation. The buyer email should contain expiring, server-generated links for only the selected PDF plans rather than public PDF attachments or permanent public URLs.
