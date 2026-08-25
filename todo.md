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
