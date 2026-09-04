# Production image repair findings

The live Vercel site currently renders the expected `/manus-storage/...` paths as the Vercel SPA HTML rather than image bytes. This explains the missing hero, program covers, and article covers: the Manus storage proxy is not available in the Vercel deployment.

The recovered user-supplied source assets have been visually matched as follows:

- Hero: `1000205561.png` (two training figures, 2112x1104).
- Home Zero cover: `1000205563.jpg`.
- Gym Build cover: `1000205533.jpg`.
- Fuel Plan cover: `1000205562.jpg`.
- Zero to Growth cover: `1000205556.webp`.
- Bodybuilding for Beginners cover: `1000205552.webp` (training figure with dumbbell and meal).
- Fat Loss cover: `1000205544.png` (fat-loss visual with food and inactive figure).
- Home vs Gym cover: `1000205553.webp`.
- Protein for Men cover: `1000205550.webp` (How much protein do you need per day?).
- Why You Keep Quitting cover: `1000205602.jpg` (inactive figure on couch with junk food).
- Warm-up cover: `1000205555.webp` (training figures preparing/moving).
- Training Mistakes cover: `1000205608.jpg` (red X / green check form comparison).
- Creatine cover: `1000205537.jpg` (Hair Loss? creatine visual).
- Whey Protein cover: `1000205538.jpg` (You're Taking Whey Wrong visual).
- Supporting creatine visual: `1000205549.webp`.
- Supporting protein visual: `1000205550.webp`.

The intended repair is to upload these public, non-sensitive website images to a public Supabase Storage bucket, use stable Supabase public object URLs in the frontend and article seed data, and keep the private `program-pdfs` bucket unchanged for buyer PDFs.
