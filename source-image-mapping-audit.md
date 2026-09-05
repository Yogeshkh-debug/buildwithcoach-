# Original source image mapping audit

The retained user upload contact sheet shows the current public bucket contains two duplicate visual pairs caused by selecting the wrong source files:

1. `1000205544.png` and `1000205602.jpg` are the same couch/junk-food fat-loss visual. The current public objects `fat-loss-cover.png` and `why-you-keep-quitting-cover.jpg` therefore render the same image twice.
2. `1000205555.webp` and `1000205608.jpg` are the same red-X/green-check form visual. The current public objects `warmup-cover.webp` and `training-mistakes-cover.jpg` therefore render the same image twice.

The original upload sheet also contains unique alternatives:

- `1000205601.jpg` is a unique standing figure with a dumbbell and book/phone-style object; it is a better distinct visual for the mindset/quitting guide than the duplicate couch visual.
- `1000205607.jpg` is a unique movement/form visual; it is a better distinct visual for the warm-up guide than the duplicate red-X/green-check form visual.
- `1000205609.jpg` and `1000205610.jpg` are unique movement visuals that can be reserved for future form/training content if needed.

The current public bucket must be extended with the selected unique source files and the article seed mappings must be updated. Existing private PDF storage must remain unchanged. All article and program image frames must use source-preserving `contain` behavior with no crop or stretch.
