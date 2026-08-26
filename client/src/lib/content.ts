export type ArticleSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  visual?: { src: string; alt: string };
};

export type ArticleContent = {
  intro: string[];
  sections: ArticleSection[];
  cta: string;
};

export type PublicArticle = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
};

export function parseArticleBody(body: string): ArticleContent {
  try {
    const parsed = JSON.parse(body) as ArticleContent;
    if (Array.isArray(parsed.intro) && Array.isArray(parsed.sections) && typeof parsed.cta === "string") return parsed;
  } catch {
    // The fallback keeps the page readable if legacy body content is imported later.
  }
  return { intro: [body], sections: [], cta: "Get the Free 7-Day Fat Loss Starter." };
}

export const articleVisuals: Record<string, string> = {
  "bodybuilding-for-beginners": "visual-swoop",
  "lose-fat-without-losing-your-mind": "visual-grid",
  "home-vs-gym-workouts": "visual-orbit",
  "protein-for-men": "visual-fuel",
  "why-you-keep-quitting": "visual-ladder",
  "creatine-safety-basics": "visual-creatine-placeholder",
  "when-to-take-whey-protein": "visual-whey-placeholder",
};

export type ProgramPlan = { tag: string; title: string; subtitle: string; price: string; accent: string; note: string; cover: string };

export const programCatalog: ProgramPlan[] = [
  { tag: "NO EQUIPMENT", title: "Home Zero", subtitle: "No equipment. No excuse to stay stuck.", price: "Free", accent: "starter", note: "No-equipment PDF · direct delivery", cover: "/manus-storage/home-zero-cover_3507cc08.jpg" },
  { tag: "WITH EQUIPMENT", title: "Gym Build", subtitle: "With equipment. Built for steady strength.", price: "Free", accent: "home", note: "Gym PDF · direct delivery", cover: "/manus-storage/gym-build-cover_c4d6d783.jpg" },
  { tag: "SIMPLE DIET", title: "Fuel Plan", subtitle: "Simple diet. Meals that do their job.", price: "Free", accent: "fuel", note: "Nutrition PDF · direct delivery", cover: "/manus-storage/fuel-plan-cover_0c76d6ee.jpg" },
  { tag: "FULL TRANSFORMATION", title: "Zero to Growth", subtitle: "Full transformation. One repeatable system.", price: "Free", accent: "muscle", note: "Transformation PDF · direct delivery", cover: "/manus-storage/zero-to-growth-cover_5de6d0af.webp" },
];
