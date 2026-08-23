export type ArticleSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type ArticleSeed = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  intro: string[];
  sections: ArticleSection[];
  cta: string;
};

export const articleSeeds: ArticleSeed[] = [
  {
    slug: "bodybuilding-for-beginners",
    title: "Bodybuilding for Beginners: The Simple Truth",
    excerpt: "You don’t need a pro split. You need the basics, done consistently.",
    category: "Training basics",
    intro: [
      "If you think bodybuilding is only for giant guys who look like they sleep in a supplement store, relax.",
      "You do not need to become a comic-book character before you start training.",
    ],
    sections: [
      { title: "What Bodybuilding Really Is", paragraphs: ["Bodybuilding is just structured training plus nutrition. That’s it. Not magic. Not secret juice. Not ‘only eat rice at 3:17 PM’ nonsense.", "The real formula is simple: train with a plan, eat for your goal, and repeat it long enough for your body to actually change."] },
      { title: "Why Beginners Have an Advantage", paragraphs: ["Beginners get fast progress because the body responds quickly to basic training. This is often called newbie gains.", "You do not need advanced tricks. You need the basics."], bullets: ["Strength goes up faster", "Muscle growth can happen quickly", "Posture and confidence can improve"] },
      { title: "The 3 Foundations", paragraphs: ["Compound lifts: squat, press, row, and deadlift patterns move more muscle at once and give better results.", "Progressive overload means adding reps, weight, or control over time. Nutrition means enough protein, enough food, and enough consistency."], bullets: ["Train with good form", "Progress a little at a time", "Eat enough protein"] },
      { title: "Common Beginner Mistakes", paragraphs: ["The fastest way to stall is to make the plan more complicated than your life can support."], bullets: ["Copying advanced routines too early", "Changing plans every two weeks", "Obsessing over supplements instead of training", "Expecting visible change after three workouts"] },
      { title: "The Build With Coach Way", paragraphs: ["The goal here is simple: give men practical plans they can actually follow. No shame. No complicated fitness nonsense. No fake intensity."] },
    ],
    cta: "Want a starting point? Get the Free 7-Day Fat Loss Starter.",
  },
  {
    slug: "lose-fat-without-losing-your-mind",
    title: "How to Lose Fat Without Losing Your Mind",
    excerpt: "Fat loss is simple. Your brain makes it complicated.",
    category: "Fat loss",
    intro: ["Most fat loss plans are designed by people who think hunger is a personality trait: eat almost nothing, do insane cardio, suffer daily.", "That is why most people quit."],
    sections: [
      { title: "Why Most Fat Loss Plans Fail", paragraphs: ["That is not a fat loss problem. That is a bad plan problem."], bullets: ["They are too extreme", "They are too complicated", "They treat one bad day like a complete failure"] },
      { title: "What Fat Loss Actually Needs", paragraphs: ["Fat loss really needs only three things. Everything else is decoration."], bullets: ["A calorie deficit", "Enough protein", "Consistency over time"] },
      { title: "Simple Fat Loss Framework", paragraphs: ["You do not need to become a monk. You need a system."], bullets: ["Eat slightly less than maintenance", "Train three to four times a week", "Walk more", "Keep protein high", "Keep food simple most of the time"] },
      { title: "Handling Hunger and Cravings", paragraphs: ["Don’t keep junk food in front of your face all day like a test of willpower."], bullets: ["Eat more protein", "Add fiber", "Drink water", "Sleep enough"] },
      { title: "About Shame", paragraphs: ["If people made you feel ashamed of your body, that can stick for years. But this process is not about revenge. It is about changing your life so you do not feel small anymore."] },
    ],
    cta: "For a simple step-by-step start, grab the Free 7-Day Fat Loss Starter.",
  },
  {
    slug: "home-vs-gym-workouts",
    title: "Home vs Gym Workouts: Which Is Better for Fat Loss?",
    excerpt: "Spoiler: both work. Here’s how to choose.",
    category: "Training basics",
    intro: ["Some people act like the gym is a sacred temple. Others act like home workouts are the holy answer. Both sides are overconfident."],
    sections: [
      { title: "The Real Answer", paragraphs: ["Fat loss does not care where you train. Fat loss cares whether you stay consistent.", "You can lose fat at home. You can lose fat in a gym. You can also fail in both places if you keep quitting."] },
      { title: "Home Workouts", paragraphs: ["Home is a useful start when it makes showing up easier."], bullets: ["No travel time", "Easy to start", "Less intimidating", "Good for beginners", "Limited equipment", "Harder to progress long term"] },
      { title: "Gym Workouts", paragraphs: ["Gyms provide structure and equipment, but they can feel intimidating at first."], bullets: ["More equipment", "Easier to progress", "Better for long-term muscle building", "Travel time", "Some gyms feel like a loud metal playground"] },
      { title: "What You Should Choose", paragraphs: ["Choose the setting that makes consistency realistic."], bullets: ["Start at home if you feel nervous", "Choose gym for more serious muscle gain if you have access", "Start where you feel most consistent", "Use a hybrid approach if possible"] },
      { title: "Simple Weekly Setup", paragraphs: ["Both approaches work when paired with walking, simple progression, and a schedule you can repeat."], bullets: ["Home: 3 to 4 workouts and walking", "Gym: 3 to 4 workouts, walking, basic compound and machine work"] },
    ],
    cta: "Both future plans on this site will include home and gym options. Start with the Free 7-Day Fat Loss Starter.",
  },
  {
    slug: "protein-for-men",
    title: "Protein for Men: How Much You Actually Need",
    excerpt: "Stop overcomplicating it. Here’s the number that matters.",
    category: "Nutrition",
    intro: ["Protein gets treated like magic dust. It is not magic. It is just one of the most useful tools for building muscle, keeping muscle, and staying full."],
    sections: [
      { title: "Why Protein Matters", paragraphs: ["Protein supports recovery, muscle building, and staying full longer."], bullets: ["Muscle repair", "Muscle building", "Recovery", "Fat loss support", "Staying full longer"] },
      { title: "How Much You Need", paragraphs: ["A simple target for most men is 1.6 to 2.2 grams of protein per kilogram of bodyweight. If you weigh 80 kg, that is roughly 130 to 175 grams per day."] },
      { title: "Good Protein Sources", paragraphs: ["Keep the list simple and choose foods you can repeat."], bullets: ["Eggs", "Chicken", "Fish", "Milk and curd", "Paneer or tofu", "Lentils and beans", "Whey protein if needed"] },
      { title: "How To Hit Protein Without Losing Your Mind", paragraphs: ["Spread it across three to four meals and build each meal around a protein source. Do not panic if one day is slightly lower."], bullets: ["Use three to four meals", "Start each meal with a protein source", "Keep the bigger picture in mind"] },
      { title: "Common Mistakes", paragraphs: ["Protein is a useful tool, not a magic fix for a bad diet or a plan you do not follow."], bullets: ["Eating very little protein", "Relying only on supplements", "Making it too complicated"] },
    ],
    cta: "The Free 7-Day Fat Loss Starter includes a simple protein guide.",
  },
  {
    slug: "why-you-keep-quitting",
    title: "Why You Keep Quitting After 2 Weeks",
    excerpt: "It’s not motivation. It’s your system.",
    category: "Mindset",
    intro: ["The pattern is always the same: new plan, new excitement, new ‘this time I’m serious.’ Then two weeks later, one bad day destroys the whole thing.", "That is not a motivation problem. That is a system problem."],
    sections: [
      { title: "Why Motivation Is Not Enough", paragraphs: ["Motivation disappears. That is normal. If your plan depends on motivation, it is already weak."] },
      { title: "Why People Quit", paragraphs: ["Quitting usually comes from a plan that cannot survive a normal life."], bullets: ["The plan is too extreme", "There is no structure", "There is no progress tracking", "One bad meal becomes a full restart"] },
      { title: "Build A Better System", paragraphs: ["A better system makes it easier to come back after an imperfect day."], bullets: ["Keep the plan simple", "Train a few times each week", "Eat enough protein", "Walk more", "Track progress weekly", "Accept imperfect days without quitting"] },
      { title: "Bad Week Rules", paragraphs: ["If you miss a workout, do not quit. If you overeat, do not destroy the next three days. Reset at the next meal, not next Monday."], bullets: ["Adjust instead of restarting", "Reset at the next meal", "Keep the next action small"] },
      { title: "Why This Brand Exists", paragraphs: ["Build With Coach exists because people should not have to feel ashamed of their body. The goal is to give men a better system so they can actually stay on track."] },
    ],
    cta: "Start with the Free 7-Day Fat Loss Starter.",
  },
];

export function serializeArticleBody(article: ArticleSeed) {
  return JSON.stringify({ intro: article.intro, sections: article.sections, cta: article.cta });
}
