# Mailjet PDF Delivery Verification

## Completed checks

The Mailjet credentials were verified with the provider profile endpoint without sending a message. The application now maps only the cart-selected PDF plans to secure managed-storage keys, generates server-side signed download URLs for the recipient email, sends those links through Mailjet, and records the provider message ID or failure reason on the delivery request.

The existing homepage and empty-cart layouts were checked at a 375px phone viewport after the delivery code change. Both remained responsive and readable, with no layout regression. The full unit-test suite has 20 passing tests, including the non-sending credential check and selected-plan email-content test. A production build also passed; its existing large JavaScript chunk warning remains non-blocking.

## Owner-approved live delivery check

The owner approved one real test delivery to the verified sender address. The first attempt exposed a Mailjet payload error: `X-MJ-CustomID` cannot be placed in the generic `Headers` collection. The implementation was corrected to use Mailjet’s dedicated `CustomID` field. Mailjet sandbox validation then passed without delivery, followed by a successful live Home Zero delivery containing only that plan’s signed download link. The one-time live test was removed immediately afterward so later automated test runs cannot send additional email.
