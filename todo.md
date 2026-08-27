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

- [x] Consolidate the community experience to one story-submission destination and replace the redundant Results-section form prompt with a useful companion action.
- [x] Remove the current two supplement card/header images until the user provides final image assets.
- [x] Add a premium Add to cart confirmation and a dedicated Cart route so users can review selected plans without scrolling to the header.
- [x] Replace the existing three PDF plans with Home Zero, Gym Build, Fuel Plan, and Zero to Growth using the requested subtitles.
- [x] Refine the creatine and whey guides with the user-supplied in-article reference material and use their internal supporting visuals only inside the guides.
- [x] Verify the updated cart flow, program catalog, story destination, and guide layouts on desktop and mobile.
- [x] Persist cart selections for the current browser session so the dedicated Cart route remains reliable after navigation or refresh.
- [x] Final verification passed: session-persistent cart route, premium add confirmation, PDF request popup, in-article visuals, TypeScript check, 10 unit tests, and production build.

- [x] Verify the refined cart route, add confirmation, PDF-request popup, and in-article supplement visuals through phone-width browser interactions.
- [x] Confirmed the phone-width program strip, responsive Add to cart control, direct Cart route, selected-plan popup flow, and in-article visual treatment without header imagery or video embeds.

- [x] Run a non-persistent phone-preview QA of the selected-cart route, delivery popup, and internal supplement visuals without creating customer data.
- [x] Avoid reapplying article seed updates on every public article request so guide pages remain responsive.
- [x] Phone preview confirmed a readable selected Home Zero cart, a selected-plan request popup, and inline-only creatine and whey visuals without header media, video embeds, clipping, or horizontal overflow.
- [x] Captured a genuine 375px browser-emulation cart route with Home Zero, its request action, and no horizontal overflow.
- [x] Captured a genuine 375px browser-emulation PDF-request popup with Home Zero listed and readable name, email, and Request my PDFs controls.
- [x] Final verification passed after the article-request cache adjustment: TypeScript check, 10 Vitest tests, and production build.

- [x] Replace the remaining supplement-guide reference-derived visuals with the newly supplied approved assets.
- [x] Add a “How much protein do you need per day?” section and supplied visual inside the whey guide.
- [x] Add a “How much creatine do you need per day?” section and supplied visual inside the creatine guide, followed by the supplied final-verdict visual.
- [x] Prepare exact-ratio 8K guide-only versions of the supplied visual assets without adding them to article cards or headers.
- [x] Refine the four-plan PDF strip with a framed scroll-snap presentation, navigation controls, and tactile touch/click zoom feedback inspired by the supplied motion reference.
- [x] Verify the guide assets and PDF strip interactions at desktop and phone widths, then run the type, test, and production-build checks.
- [x] Confirmed the inline creatine and whey assets decode at 7680px wide after entering the viewport; the PDF strip snaps horizontally, arrow navigation advances it, and touch feedback reaches a 1.035 scale before release.
- [x] Final verification passed: TypeScript check, 12 Vitest tests, and production build. The build retains only the existing non-blocking large-chunk warning.

- [x] Use the supplied first image as the uncropped start-screen hero visual.
- [x] Refine the mobile menu into the premium, two-column menu presentation indicated by the supplied reference image.
- [x] Add the supplied Zero to Growth, Gym Build, Home Zero, and Fuel Plan artwork as uncropped PDF cover images in their matching program cards.
- [x] Replace the unclear creatine guide visuals with the two newly supplied creatine graphics, placed only inside the relevant creatine sections.
- [x] Replace the protein-guide visual with the supplied protein graphic, placed only inside the relevant whey section.
- [x] Verify every supplied image uses an uncropped contain-fit treatment at desktop and phone widths, then run type, test, and production-build checks.
- [x] Phone emulation confirmed the premium two-column menu, no horizontal overflow, and `contain` fitting for the hero and all four supplied PDF covers.
- [x] Browser verification confirmed the supplied whey graphic decoded at 12288×6912, the first supplied creatine graphic at 6144×3456, the creatine verdict graphic at 1792×1344, and each rendered with `object-fit: contain`.
- [x] Final verification passed: TypeScript check, 12 Vitest tests, and production build. The build retains only the existing non-blocking large-chunk warning.

- [x] Replace the awkward white PDF-cover staging with a coordinated placeholder background that matches the supplied cover artwork without cropping it.
- [x] Ensure the Guides route opens at the top and provides a clear route back to the homepage.
- [x] Use the supplied home-vs-gym visual as that guide’s uncropped cover image.
- [x] Use the supplied form-fix visual for the Five Mistakes article and the supplied nutrition visual for the Protein for Men article.
- [x] Use the supplied creatine visual as the creatine guide cover and replace the whey in-article graphic with the supplied final protein visual.
- [x] Use the supplied habit-reset visual for the Why You Keep Quitting article.
- [x] Verify all mapped images have coordinated backgrounds, contain-fit presentation, usable guide navigation, and no mobile or desktop overflow; then run type, test, and production-build checks.
- [x] Browser checks confirmed the Guides route begins at scroll position zero, Back home returns to the top of the homepage, and all four PDF covers use the same blue stage color and `object-fit: contain`.
- [x] Desktop and phone screenshots confirmed the new guide-cover images, whey in-guide image, and compact article cards render completely without cropping or horizontal overflow.
- [x] Final verification passed: TypeScript check, 13 Vitest tests, and production build. The build retains only the existing non-blocking large-chunk warning.

- [x] Remove the misplaced whey artwork from the article body and use it only as the whey guide cover.
- [x] Apply one consistent source-preserving cover canvas so each supplied article visual is framed without cropping, stretching, or changing its original pixels.
- [x] Verify the article library and detail pages at desktop and phone widths, then run type, test, and production-build checks.
- [x] Phone and desktop checks confirmed the unaltered whey and creatine source art appears only in the 16:9 guide-cover canvas; article bodies contain no inline visual figures.
- [x] Final verification passed: TypeScript check, 13 Vitest tests, and production build. The build retains only the existing non-blocking large-chunk warning.

- [x] Remove the unassigned 16:9 image from the review mapping and keep it out of the website.
- [x] Apply the nine user-approved 16:9 images as the exact uncropped covers for their mapped guides.
- [x] Verify every approved cover appears complete at desktop and phone widths, then run type, test, and production-build checks.
- [x] Desktop and phone screenshots confirmed all nine approved images retain their original 16:9 composition with no cropping, stretching, or horizontal overflow.
- [x] Final verification passed: TypeScript check, 13 Vitest tests, and production build. The build retains only the existing non-blocking large-chunk warning.

- [x] Remove visible placeholder-style padding from article-card and guide-header image frames while preserving exact 16:9 source composition.
- [x] Verify all guide covers fill their 16:9 frames cleanly at desktop and phone widths without cropping, stretching, or edits; then run type, test, and production-build checks.
- [x] Desktop and phone guide-library checks confirmed all approved covers render edge to edge in 16:9 frames, with no decorative placeholder marks or visible padding.
- [x] Final verification passed: TypeScript check, 13 Vitest tests, and production build. The build retains only the existing non-blocking large-chunk warning.

- [x] Recheck guide detail-page header covers at desktop and phone widths after the edge-to-edge fit correction.
- [x] Confirmed the creatine and whey header covers decode at 2048×1152 and render as complete 16:9 frames without padding, cropping, stretching, or inline placeholder art.

- [x] Refine only the mobile menu into a premium grid presentation and add a Training Programs control that routes directly to the four-PDF program page.
- [x] Review and harden public upload validation, public input handling, and applicable browser response security controls without changing unrelated site behavior.
- [x] Add or update regression tests for the security-sensitive validation logic and the new menu route.
- [x] Verify the mobile menu, Training Programs navigation, upload rejection behavior, browser security headers, and desktop/mobile layouts; then run type, test, and production-build checks.
- [x] Genuine 375px phone emulation confirmed the premium menu, seven requested actions, direct `/programs` route, four visible PDF plans, and no horizontal overflow.
- [x] Security verification confirmed strict JPEG/PNG/WebP signatures and dimension limits, safe managed-storage keys, per-client capture throttling, reduced body limits, and production CSP/HSTS/anti-framing/no-sniff/referrer/permissions/cross-origin headers.
- [x] Final verification passed: TypeScript check, 16 Vitest tests, and production build. The build retains only the existing non-blocking large-chunk warning.

- [x] Remove the hero’s mismatched placeholder layer and use a single coordinated, source-preserving hero visual treatment.
- [x] Redesign only the Programs page with four premium PDF cards that display the existing approved Home Zero, Gym Build, Fuel Plan, and Zero to Growth covers.
- [x] Verify the hero and program covers at desktop and phone widths with no cropping, stretching, or background mismatch; then run type, test, and production-build checks.
- [x] Sampled the supplied hero edge color and used it for the unified frame; the original 2112×1104 artwork now preserves its native aspect ratio without a separate placeholder layer.
- [x] Desktop and 375px phone checks confirmed the four premium program cards display their matching approved covers completely, with no horizontal overflow.
- [x] Final verification passed: TypeScript check, 16 Vitest tests, and production build. The build retains only the existing non-blocking large-chunk warning.

- [x] Remove the standalone Programs page and route Training Programs directly to the existing homepage PDF-plan section.
- [x] Verify mobile Training Programs navigation closes the menu, scrolls to the four homepage PDF cards, and preserves all other pages; then run type, test, and production-build checks.
- [x] Genuine 375px phone emulation confirmed Training Programs stays on the homepage, closes the menu, lands at the start of the PDF section, exposes all four cards, and has no horizontal overflow.
- [x] Final verification passed: TypeScript check, 16 Vitest tests, and production build. The build retains only the existing non-blocking large-chunk warning.

- [x] Add a premium Common Mistakes board with pinned sticky-note cards and direct coach-style fixes, without changing existing homepage sections.
- [x] Verify the pinned-note board is readable and balanced at desktop and phone widths, then run type, test, and production-build checks.

- [x] Repair the Common Mistakes board guide link so it opens the existing mistakes article rather than the “That guide moved” page.
- [x] Verify the corrected guide link on phone layout and run regression checks.

- [x] Inspect the visible Made with Manus badge to determine whether it is site-owned code or a platform preview overlay.
- [x] Remove the badge only if it is site-owned; otherwise report the available platform-level control.

- [x] Confirm GitHub export availability and repository-name requirements for the requested Build With Coach repository.
- [x] Export the complete project source and configuration to the requested GitHub repository after confirming the target account and publish action.
- [x] Verify the repository contents and report the repository link.

- [x] Resolve the connected GitHub account permission required to create the confirmed public repository, then retry without exposing credentials.
- [x] Push the full project only after the user updates repository-creation access and confirm the resulting repository link.

- [x] Initiate the GitHub authorization flow so the user can approve repository-creation access directly.

- [x] Diagnose the reported GitHub authorization disconnection and restore a stable repository-creation approval path.

- [x] Audit the existing Buy popup, selected-plan request record, managed PDF references, and storage availability for automatic delivery.
- [x] Configure a secure transactional email provider and sender identity for customer PDF delivery.
- [x] Deliver only the PDF plans selected in the cart after a valid email request, while recording delivery status in the database.
- [x] Test success and failure paths for the buyer request, email delivery, storage links, and responsive frontend feedback.

- [x] Validate and upload the supplied Home Zero, Gym Build, Fuel Plan, and Zero to Growth PDFs to managed storage without placing them in the project source tree.
- [x] Map each stored PDF securely to its matching cart plan for automatic selected-plan delivery.

- [x] Add persistent per-plan delivery records and safe request states for pending, sent, and failed email delivery.
- [x] Do not integrate Brevo after its workspace setup failed; use the verified single Mailjet account without account rotation to bypass service limits.
- [x] Refine the Buy popup feedback so buyers see accurate selected-plan delivery status and never a false “sent” result.

- [x] Check the Brevo account flow directly and identify that its mobile account-switch page was not progressing.
- [x] Guide the owner through the unavoidable verified-sender and API-key approval steps, then activate automated selected-PDF delivery through Mailjet.

- [x] Select Mailjet as the simpler legitimate free-tier transactional email provider after the Brevo workspace setup failed.
- [x] Replace the Brevo-specific delivery adapter with the verified Mailjet provider.

- [x] Complete a final Mailjet setup check and confirm that its account flow and credentials are usable.
- [x] Do not activate the immediate-download fallback because Mailjet is available for automatic selected-PDF delivery.
- [x] Keep captured buyer emails available for the owner’s manual weekly-challenge outreach while separately using automated PDF delivery.

- [x] Do not retain the unavailable-provider immediate-download branch after Mailjet delivery was successfully verified.
- [x] Retain the buyer contact record for manual weekly-challenge outreach and send only the selected plan links through Mailjet.

- [x] Pause provider activation while the owner tested Mailjet manually, then finalize verified Mailjet delivery.

- [x] Guide the owner through Mailjet sender verification and secure API key retrieval for selected-PDF email delivery.
- [x] Replace the temporary direct-download fallback with Mailjet delivery after verified credentials are supplied.
- [x] Test the active Mailjet delivery path without exposing API credentials or sending unapproved customer messages.

- [x] Store the owner’s verified Mailjet API key, secret key, and sender address through secure project configuration.
- [x] Replace the direct-download fallback with automatic Mailjet delivery of only the buyer’s selected PDFs.

- [x] Diagnose the failed owner-approved Home Zero Mailjet test without logging secrets, correct the delivery error, and revalidate the buyer flow.

- [x] Add a light, truthful note for a Mailjet delivery-limit or provider failure without affecting successful PDF delivery.
- [x] Verify the new unavailable-delivery note and normal sent state at phone and desktop widths, then run regression checks.

- [x] Save every buyer request before delivery, classify Mailjet daily-limit responses separately, and show the friendly delay note only for that limit outcome.
- [x] Keep non-limit Mailjet failures separate from the daily-limit message and verify both buyer-facing states.
