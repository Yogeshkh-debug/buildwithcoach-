export type ArticleSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
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

export const articleImages: Record<string, { src: string; alt: string }> = {
  "creatine-safety-basics": { src: "/manus-storage/creatine-feature_ccabd93e.jpg", alt: "Creatine supplement guide artwork" },
  "when-to-take-whey-protein": { src: "/manus-storage/whey-feature_9cddc5e2.jpg", alt: "Whey protein timing guide artwork" },
};
