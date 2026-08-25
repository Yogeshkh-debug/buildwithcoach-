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
- [x] Save a completion checkpoint and provide the website project version to the user.

## Verification notes

- [x] Verified the individual Protein for Men article route renders the complete seeded guide, inline free-plan call to action, and footer after its tRPC query resolves.
- [x] Verified the header search button opens an accessible dialog with a focused text field and close control.
- [x] Verified the primary homepage, tools, free-plan, programs, contact, article hub, and individual article routes at desktop, tablet, and phone widths.
- [x] Final verification passed: TypeScript check, 8 Vitest tests, and production build all completed successfully.

- [x] Refine the consent-safe success-story area to invite future, permission-based member stories without inventing testimonials or results.
- [x] Add Vitest coverage for invalid newsletter, free-plan, waitlist, and contact capture inputs through the public tRPC procedures.

- [x] Add a large Build With Coach 💪 footer signature at the final page edge, inspired by the supplied reference.
- [x] Verify the footer signature at desktop and phone widths and confirm the TypeScript check passes.

- [x] Prevent the newsletter popup from reopening continuously after it has been shown or dismissed.
- [x] Resize the final Build With Coach 💪 footer signature so all words remain visible on mobile screens.
- [x] Verified the mobile contact-page footer signature is fully visible and the TypeScript check passes.

- [x] Add simple strict-coach warm-up guidance and common-mistake fixes to the workout content.
- [x] Update the community story invitation to say “Share your story — we’ll stick it” while retaining the permission-first policy.
- [x] Ensure every guide route scrolls to its header when opened so readers begin at the top.
- [x] Verified the new warm-up guide opens with no prior scroll position, and the guide library exposes both new strict-coach guides.

- [x] Add a community story form with a text area, photo upload, and required publication-consent checkbox.
- [x] Persist submitted stories and photo metadata securely for review without publishing them automatically.
- [x] Validate the community form and verify its mobile and desktop presentation.
- [x] Verified the mobile community form layout and passed 9 unit tests plus the production build.

- [x] Verify the community story form at desktop width and correct any spacing or overflow issues.
- [x] Confirmed on the desktop homepage that the name, email, story, photo chooser, consent checkbox, and submit control are all present and reachable without overflow.

- [x] Replace the existing dark homepage fitness figures with the user-supplied fitness image.
- [x] Refine the email popup copy to invite subscriptions for useful weekly challenges and consistent progress.
- [x] Verify the updated hero image and popup copy at desktop and mobile widths.
- [x] Verified the managed hero image, the weekly-challenges popup message, TypeScript check, and production build.

- [x] Verify the revised weekly-challenges popup content at desktop and mobile widths for clean fit and readability.

- [x] Add an immediate, accessible animated Thank You state after a successful popup free-plan email submission.
- [x] Verify the popup thank-you state at desktop and mobile widths.
- [x] Verified the success-state code path, TypeScript check, 9 unit tests, and production build.

- [x] Visually verify the animated popup Thank You confirmation at desktop and mobile widths without persisting test signup data.

- [x] Capture browser-inspectable desktop and mobile QA evidence for the popup Thank You confirmation without saving a test signup.
- [x] Confirmed the desktop popup exposes the Thank You message and return control in-browser; mobile screenshot QA confirmed readable, unclipped presentation.

- [x] Prevent the homepage proof text from clipping at mobile width.
- [x] Remove the duplicate “Share your story — we’ll stick it” prompt while keeping the community submission form.
- [x] Replace the click-only program carousel behavior with a smooth, touch-friendly scrolling PDF-style program strip.
- [x] Add only the requested creatine and whey-protein articles, with no video embeds and reserved image placeholders for later user-supplied assets.
- [x] Verify the updated layout, scrolling program strip, and new article routes on desktop and mobile.
- [x] Stabilize the guide-list test timeout during database-backed article seeding.
- [x] Final verification passed: desktop/mobile layout checks, no-video supplement routes, TypeScript check, 9 unit tests, and production build.

- [x] Exercise the scrolling PDF-style program strip at desktop and mobile widths and verify smooth, unclipped interaction.
- [x] Verify a new supplement guide at mobile width without any video embed before final sign-off.
- [x] Confirmed desktop next-control scrolling, mobile program-strip framing, mobile proof-row visibility, and the no-video supplement-guide route behavior.

- [x] Fix the Results section’s Open the Story Form control so it reliably scrolls to the community submission form.
- [x] Replace the header bag icon with a premium cart control and cart tray.
- [x] Change every program action to Add to cart and show the email capture popup after a user selects Buy from the cart.
- [x] Add the approved creatine and whey source images to the respective article cards and guides without video embeds.
- [x] Verify the story button, cart-to-email flow, article visuals, and responsive layout.
- [x] Repair the cart drawer opener so an added plan can always be reviewed and purchased.
- [x] Final verification passed: cart request handoff, story-form focus, managed article images, TypeScript check, 10 unit tests, and production build.

- [x] Verify the premium cart, cart-to-email popup, and supplement-guide images at a phone viewport without clipping or overflow.
- [x] Confirmed the phone layout retains the premium cart header, readable PDF Add to cart controls, and unclipped supplement-card media treatment.
