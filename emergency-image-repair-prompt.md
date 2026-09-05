# Emergency prompt: repair missing Build With Coach production images

You are repairing an existing React + Vite + Express fitness website named **Build With Coach**.

Live URL: `https://buildwithcoach.vercel.app`
GitHub repository: `Yogeshkh-debug/buildwithcoach-`
Supabase project ref: `pgsolmoepgolpvuwhcyb`

## User-visible problem

The live Vercel website first showed the hero image, PDF cover images, and article images as missing or blank. After the storage-path repair, a second content-integrity problem was reported: some artwork is assigned to the wrong article, some artwork appears twice where it should not, and some images are cropped or do not fit their frames correctly. The text and layout still load.

## Root cause

The frontend referenced image URLs such as:

`/manus-storage/start-hero-supplied_a4a8fc92.png`

`/manus-storage/home-zero-cover_3507cc08.jpg`

These paths depended on the Manus storage proxy. The site was moved to Vercel, but that proxy is not available in the Vercel deployment. Vercel therefore routed those image requests back to the SPA HTML response instead of returning image bytes. The browser tried to decode HTML as an image, so the images did not render.

The first failure was an asset-hosting/routing problem, not a CSS problem and not a problem with the original image files. The second failure is a content-mapping and presentation problem: image assignments must be checked against the article title and source contact sheet, duplicate use must be intentional, and each frame must preserve the source aspect ratio.

## Safe fix that must be applied

1. Do not put image files in the Vercel repository or frontend source as local filesystem paths.
2. Do not use `/manus-storage/...` for public website artwork.
3. Keep all sensitive PDFs private. Do not make the `program-pdfs` bucket public and do not replace secure buyer access with public PDF URLs.
4. In the existing Supabase project, create or reuse a separate public bucket named `site-images`. This bucket is only for non-sensitive hero, cover, and article artwork.
5. Upload the recovered user-supplied source images to `site-images` with stable semantic object keys.
6. Use Supabase public object URLs in the frontend and article seed data. The URL pattern is:

`https://pgsolmoepgolpvuwhcyb.supabase.co/storage/v1/object/public/site-images/<object-key>`

7. Never expose `SUPABASE_SERVICE_ROLE_KEY` in React, browser code, committed files, or public URLs. Use it only in a one-time server-side/admin upload script or the Supabase dashboard.
8. Use `object-fit: contain` and a frame whose aspect ratio matches the source artwork so no pixels are cropped, stretched, or altered. Do not use `cover` for supplied artwork.
9. Build an explicit one-to-one mapping table before editing. Match the visual subject and any text printed inside the image to the article title. Do not assign a creatine image to a whey article, a couch/junk-food image to a training article, or a program cover to an article unless the user explicitly requested it.
10. Check all article cards, article-detail covers, inline article visuals, hero, and program covers for duplicate `src` values. Duplicates are allowed only when the same image is intentionally used as a cover and an inline visual; otherwise each approved source should appear in its intended location once.
11. Verify the rendered image’s natural dimensions and compare them with its CSS frame at desktop and mobile widths. Fix the frame or fit rule, not the original pixels.

## Confirmed source-to-object mapping

| Purpose | Supplied source | Public object key |
|---|---|---|
| Homepage hero | `1000205561.png` | `site/hero/start-hero-supplied.png` |
| Home Zero PDF cover | `1000205563.jpg` | `site/programs/home-zero-cover.jpg` |
| Gym Build PDF cover | `1000205533.jpg` | `site/programs/gym-build-cover.jpg` |
| Fuel Plan PDF cover | `1000205562.jpg` | `site/programs/fuel-plan-cover.jpg` |
| Zero to Growth PDF cover | `1000205556.webp` | `site/programs/zero-to-growth-cover.webp` |
| Bodybuilding for Beginners cover | `1000205552.webp` | `site/articles/bodybuilding-for-beginners-cover.webp` |
| Fat Loss cover | `1000205544.png` | `site/articles/fat-loss-cover.png` |
| Home vs Gym cover | `1000205553.webp` | `site/articles/home-vs-gym-cover.webp` |
| Protein for Men cover | `1000205550.webp` | `site/articles/protein-for-men-cover.webp` |
| Why You Keep Quitting cover | `1000205601.jpg` | `site/articles/why-you-keep-quitting-unique.jpg` |
| Warm-up cover | `1000205607.jpg` | `site/articles/warmup-unique.jpg` |
| Training Mistakes cover | `1000205608.jpg` | `site/articles/training-mistakes-cover.jpg` |
| Creatine cover | `1000205537.jpg` | `site/articles/creatine-cover.jpg` |
| Whey Protein cover | `1000205538.jpg` | `site/articles/whey-protein-cover.jpg` |
| Creatine supporting visual | `1000205549.webp` | `site/articles/creatine-support.webp` |
| Protein supporting visual | `1000205550.webp` | `site/articles/protein-support.webp` |

## Files to inspect and update

- `client/src/pages/Home.tsx`: replace the hero image source.
- `client/src/lib/content.ts`: replace the four program cover sources.
- `server/articleSeed.ts`: replace every article cover source and any intended inline visual source.
- `client/src/pages/ContentPages.tsx`: confirm it consumes the article body cover source and does not introduce a second broken image path.
- `server/fitness.test.ts`: update cover expectations and add a regression test that every public cover URL starts with the Supabase `site-images` prefix and does not contain `/manus-storage/`.
- `todo.md`: record the repair and verification.

Do not change unrelated layout, copy, cart behavior, private PDF delivery, My Programs authentication, email sending, Supabase database tables, or Sunday challenge logic.

## Verification commands

Run:

```bash
pnpm exec tsc --noEmit
pnpm test -- --run
pnpm run build
```

Verify that every uploaded public object returns image bytes, not HTML:

```bash
curl -I "https://pgsolmoepgolpvuwhcyb.supabase.co/storage/v1/object/public/site-images/site/hero/start-hero-supplied.png"
curl -I "https://pgsolmoepgolpvuwhcyb.supabase.co/storage/v1/object/public/site-images/site/programs/home-zero-cover.jpg"
```

Expected results are HTTP 200 and image content types such as `image/png`, `image/jpeg`, or `image/webp`.

Open these live routes after deployment:

- `https://buildwithcoach.vercel.app/`
- `https://buildwithcoach.vercel.app/articles/creatine-safety-basics`
- `https://buildwithcoach.vercel.app/articles/when-to-take-whey-protein`

Confirm visually that the hero, four PDF covers, article cards, and article-detail covers render at desktop and mobile widths. Confirm that no console or network request attempts to load `/manus-storage/` for public artwork.

## Deployment

Commit the source changes, push them to the `main` branch of `Yogeshkh-debug/buildwithcoach-`, wait for the linked Vercel production deployment to reach `READY`, and verify the stable domain again. Do not deploy a separate replacement Vercel project. Do not rotate or print any existing secrets during this repair.

## Current known-good result

The first safe repair used Supabase `site-images` for public artwork and kept the `program-pdfs` bucket private. The corrected production build was created from GitHub commit `d3ecd09` and reached Vercel state `READY`, and the stable homepage and Creatine article route returned HTTP 200. However, the current reported mapping/fit defects still require a full visual audit before declaring the site final. Do not assume that HTTP 200 means the assignment or crop is correct.
