# Live article image audit

The live article library currently renders nine article cards with these public image sources:

| Article | Current source | Initial audit result |
|---|---|---|
| Bodybuilding for Beginners | `bodybuilding-for-beginners-cover.webp` | Displays a training/meal figure; needs confirmation against the user’s approved image numbering. |
| How to Lose Fat Without Losing Your Mind | `fat-loss-cover.png` | Displays an inactive figure with food; semantically plausible, but must be checked against the approved source mapping. |
| Home vs Gym Workouts | `home-vs-gym-cover.webp` | Displays home-vs-gym comparison artwork; semantically correct. |
| Protein for Men | `protein-for-men-cover.webp` | Displays a “How much protein do you need per day?” graphic; semantically correct. |
| Why You Keep Quitting | `why-you-keep-quitting-cover.jpg` | Displays a couch/junk-food visual; semantically plausible, but must be checked against the approved source mapping. |
| Warm Up Before You Lift | `warmup-cover.webp` | Displays the current warm-up artwork; needs source-fit verification. |
| 5 Training Mistakes | `training-mistakes-cover.jpg` | Displays red-X/green-check form artwork; semantically correct. |
| Is Creatine Bad for You? | `creatine-cover.jpg` | Displays the “Hair Loss?” creatine graphic; semantically correct. |
| When to Take Whey Protein | `whey-protein-cover.jpg` | Displays the “You’re Taking Whey Wrong” graphic; semantically correct. |

The browser audit confirms the site is not using article images that fail to load. The remaining reported defects are content-integrity and presentation defects: exact approved image numbering must be reconciled, unintended duplicate sources must be detected across cover and inline visual locations, and each cover frame must use source-preserving contain-fit sizing on desktop and mobile.
