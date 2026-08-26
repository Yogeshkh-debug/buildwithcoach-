# Common Mistakes Board Verification

The homepage now includes a **Common Mistakes Wall** immediately after the existing Start Here cards and before the free-plan section. The board uses five individually rotated sticky-note cards with visible pin marks, direct coach-style fixes, and a link to the existing full mistakes guide.

Desktop verification at 1280px confirmed a balanced board composition, clear heading hierarchy, distinct note colors, visible pins, and readable dark- and light-note text. Phone verification at 375px confirmed the board changes to a vertical sticky-note stack with no clipped text or horizontal overflow, while preserving the premium pin-board treatment.

The verification suite also passed: `pnpm check`, `pnpm test` with 16 tests, and `pnpm build`. The existing non-blocking Vite large-chunk warning remains unchanged.
