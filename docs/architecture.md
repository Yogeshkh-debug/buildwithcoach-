# Build With Coach Architecture

The public experience uses a React client with Wouter for routing and a tRPC server for read and capture actions. The shared `fitness.ts` module provides deterministic, tested calorie and protein calculations so that the UI and tests use the same rule set.

| Area | Design choice | Purpose |
| --- | --- | --- |
| Content | Seeded `articles` table plus a server fallback | Makes the five supplied articles available in development even before a database connection is provisioned. |
| Capture forms | `email_subscribers`, `free_plan_signups`, and `contact_messages` tables | Persists each type of user request independently while keeping newsletter sources visible. |
| Future commerce | `future_products` and `downloads` tables | Supports a coming-soon program area without pretending to process payments. |
| Access | Built-in OAuth with public login/signup routes | Preserves a clear path to a future personalized dashboard. |
| Interactions | Client state with accessible semantic controls | Enables keyboard use, validation feedback, menus, carousel controls, modal popup, and smooth anchors. |

The visual design adapts the approved Captain Workout reference through its restrained monochrome palette, pale steel-blue feature panels, black linework, angular/organic transitions, marquees, editorial cards, and compact utility navigation. Build With Coach branding, copy, and original inline illustrative shapes replace the reference site’s distinctive branding and assets.

