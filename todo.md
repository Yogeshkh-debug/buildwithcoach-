# Project TODO

- [x] Document Captain Workout-inspired visual tokens, page topology, and accessible interaction patterns.
- [x] Define the fitness content schema for articles, subscribers, plan signups, product placeholders, downloads, and contact messages.
- [x] Add and apply a database migration for the requested website data.
- [x] Seed the five supplied fitness articles with slugs, excerpts, categories, and full scripts.
- [x] Add typed tRPC procedures for articles, newsletter subscriptions, free-plan signups, waitlist requests, contact messages, and download placeholders.
- [x] Build a responsive public header with centered Build With Coach wordmark, navigation, search overlay, mobile menu, account control, and cart-style plan tray.
- [x] Build the asymmetric homepage hero with 7-Day Fat Loss Starter CTA, marquee, Start Here guidance, program preview, articles, nutrition, workouts, community, FAQ, a consent-safe future success-story area, and newsletter capture.
- [x] Build the article hub and five individual article routes with repeated free-plan calls to action.
- [x] Implement calorie and protein calculators with accessible validation and instant results.
- [x] Implement validated free-plan, popup, newsletter, waitlist, and contact forms with database persistence and feedback states.
- [x] Implement login, sign-up, and dashboard placeholder routes with clear access flows and future-content states.
- [x] Implement functional program carousel, FAQ accordions, email-popup behavior, smooth anchors, footer links, and keyboard/focus states.
- [x] Add unit tests covering core calculations, validation, and public tRPC procedures.
- [x] Run typecheck, test suite, production build, and desktop/tablet/mobile visual QA; fix any defects found.
- [ ] Save a completion checkpoint and provide the website project version to the user.

## Verification notes

- [x] Verified the individual Protein for Men article route renders the complete seeded guide, inline free-plan call to action, and footer after its tRPC query resolves.
- [x] Verified the header search button opens an accessible dialog with a focused text field and close control.
- [x] Verified the primary homepage, tools, free-plan, programs, contact, article hub, and individual article routes at desktop, tablet, and phone widths.
- [x] Final verification passed: TypeScript check, 8 Vitest tests, and production build all completed successfully.

- [x] Refine the consent-safe success-story area to invite future, permission-based member stories without inventing testimonials or results.
- [x] Add Vitest coverage for invalid newsletter, free-plan, waitlist, and contact capture inputs through the public tRPC procedures.
