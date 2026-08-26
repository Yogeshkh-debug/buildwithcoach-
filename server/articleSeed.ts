export type ArticleSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  visual?: { src: string; alt: string };
};

export type ArticleSeed = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  intro: string[];
  cover?: { src: string; alt: string };
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
    cover: { src: "/manus-storage/beginner-guide-cover-approved_3db11ff1.jpg", alt: "Beginner strength guide cover" },
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
    cover: { src: "/manus-storage/fat-loss-cover-approved_4c5a878c.jpg", alt: "Structured fat loss guide cover" },
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
    cover: { src: "/manus-storage/home-gym-cover-approved_6ae728e7.jpg", alt: "Home training compared with a gym strength setup" },
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
    cover: { src: "/manus-storage/protein-men-cover-approved_440d4900.jpg", alt: "Protein nutrition guide cover" },
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
    cover: { src: "/manus-storage/why-quitting-cover-approved_839f5953.jpg", alt: "Why you keep quitting guide cover" },
    sections: [
      { title: "Why Motivation Is Not Enough", paragraphs: ["Motivation disappears. That is normal. If your plan depends on motivation, it is already weak."] },
      { title: "Why People Quit", paragraphs: ["Quitting usually comes from a plan that cannot survive a normal life."], bullets: ["The plan is too extreme", "There is no structure", "There is no progress tracking", "One bad meal becomes a full restart"] },
      { title: "Build A Better System", paragraphs: ["A better system makes it easier to come back after an imperfect day."], bullets: ["Keep the plan simple", "Train a few times each week", "Eat enough protein", "Walk more", "Track progress weekly", "Accept imperfect days without quitting"] },
      { title: "Bad Week Rules", paragraphs: ["If you miss a workout, do not quit. If you overeat, do not destroy the next three days. Reset at the next meal, not next Monday."], bullets: ["Adjust instead of restarting", "Reset at the next meal", "Keep the next action small"] },
      { title: "Why This Brand Exists", paragraphs: ["Build With Coach exists because people should not have to feel ashamed of their body. The goal is to give men a better system so they can actually stay on track."] },
    ],
    cta: "Start with the Free 7-Day Fat Loss Starter.",
  },
  {
    slug: "warm-up-that-actually-helps",
    title: "Warm Up Before You Lift: 7 Minutes That Actually Helps",
    excerpt: "Get warm, practise the movement, then lift. Stop turning the warm-up into another workout.",
    category: "Workout prep",
    intro: ["A warm-up has one job: make your first working set feel like a continuation, not a surprise attack.", "You do not need twenty random drills and a phone timer. You need a little heat, the movement you are about to train, and a few lighter sets."],
    cover: { src: "/manus-storage/warmup-cover-approved_558d9d93.jpg", alt: "Seven-minute warm-up guide cover" },
    sections: [
      { title: "The Strict Coach Rule", paragraphs: ["Warm up for the workout you are about to do. Do not copy a circus routine because someone online had fancy bands.", "If you are squatting, prepare to squat. If you are pressing, prepare to press. Keep the goal obvious."] },
      { title: "The Simple 7-Minute Warm-Up", paragraphs: ["Use this before most beginner strength sessions. Keep the pace easy enough to breathe, but not so easy that nothing changes."], bullets: ["2 minutes brisk walking, cycling, or marching", "8 controlled bodyweight squats", "8 hip hinges with hands on thighs", "8 wall or incline push-ups", "10 band pull-aparts or slow arm circles", "2 to 3 lighter practice sets of your first exercise"] },
      { title: "Before Your First Working Set", paragraphs: ["Your first proper set should not be the first time you feel the movement today. Build up with lighter weight and cleaner reps.", "For a squat, press, row, or deadlift pattern, take two or three lighter sets before the weight that challenges you."] },
      { title: "Common Warm-Up Mistakes", paragraphs: ["Most people do too little preparation or turn preparation into a twenty-minute distraction. Both miss the point."], bullets: ["Starting your heaviest set cold", "Static stretching for ages instead of moving", "Doing hard cardio that steals energy from lifting", "Using so many drills that you arrive tired", "Skipping lighter practice sets because you are impatient"] },
      { title: "What Pain Is Telling You", paragraphs: ["Normal effort and normal muscle warmth are one thing. Sharp, worsening, or unusual pain is not a toughness test. Stop the movement and get qualified help if it does not settle."] },
    ],
    cta: "Warm up, train with purpose, then use the Free 7-Day Fat Loss Starter to make the rest of the session simple.",
  },
  {
    slug: "fix-common-training-mistakes",
    title: "5 Training Mistakes That Waste Your Workouts",
    excerpt: "More sweat is not better training. Fix these simple mistakes and make each rep count.",
    category: "Form fixes",
    intro: ["You do not need perfect genetics or a loud gym personality. You do need to stop wasting good effort on sloppy habits.", "Fix one thing at a time. Training gets better when your next rep has a purpose."],
    cover: { src: "/manus-storage/training-mistakes-cover-approved_13cad1bb.jpg", alt: "Training mistakes form-fix guide cover" },
    sections: [
      { title: "Mistake 1: Rushing Every Rep", paragraphs: ["Fast reps can hide weak positions. Slow the lowering phase just enough to control it, then use a steady, deliberate lift.", "If you cannot control the weight, it is controlling you."] },
      { title: "Mistake 2: Adding Weight Before You Earn It", paragraphs: ["More weight is only progress when your form survives it. First add clean reps. Then add a small amount of load.", "Your ego does not get credit for the rep. Your muscles do."] },
      { title: "Mistake 3: Changing Your Plan Every Week", paragraphs: ["A new exercise is not automatically a better exercise. Keep the core movements long enough to learn them and measure progress.", "Use the same main lifts for several weeks before deciding they do not work."] },
      { title: "Mistake 4: Training to Exhaustion Every Time", paragraphs: ["Leave one or two clean reps in reserve on most sets. You are building a repeatable week, not auditioning for a collapse montage.", "Hard training is useful. Destroying tomorrow’s session is not."] },
      { title: "Mistake 5: Ignoring the Basics", paragraphs: ["The boring pieces still win: warm up, use a load you can control, track the main lifts, eat enough protein, and sleep like it matters."], bullets: ["Warm up for the movement", "Use full, controlled range you can own", "Log reps and load", "Stop a set when form breaks down", "Repeat the plan next week"] },
    ],
    cta: "Fix the basics first, then use the Free 7-Day Fat Loss Starter to give those basics a plan.",
  },
  {
    slug: "creatine-safety-basics",
    title: "Is Creatine Bad for You? A Straight Answer",
    excerpt: "The practical safety facts, the myths, and the small group that should ask a clinician first.",
    category: "Nutrition & supplements",
    intro: ["Creatine gets blamed for almost everything: kidney problems, hair loss, bloating, and scale weight. Most of that fear comes from half-read claims instead of a clear look at what the evidence actually says.", "Here is the useful version: for most healthy adults, creatine monohydrate is one of the better-studied supplements. It is a small tool, not a personality, and it never replaces training, food, or sleep."],
    cover: { src: "/manus-storage/creatine-guide-cover-approved_cf02b947.jpg", alt: "Creatine guide cover" },
    sections: [
      { title: "The 60-Second Version", paragraphs: ["Creatine helps your muscles rapidly remake energy for short, hard efforts such as lifting, sprinting, and repeated high-intensity work. Your body already makes some, and food supplies a little more.", "A supplement simply raises the amount stored in muscle. Plain creatine monohydrate is the simple, commonly used option."] },
      { title: "Kidneys: What Actually Matters", paragraphs: ["In healthy adults using normal doses, current evidence does not show creatine monohydrate damaging kidney function. A blood marker called creatinine can rise because of normal creatine turnover, so that result needs context.", "If you have kidney disease, take medication that affects kidney function, or have been told to restrict supplements, do not guess. Ask your clinician first."] },
      { title: "Water Retention Is Not Bloating", paragraphs: ["Creatine draws water into muscle cells. That can move the scale slightly, but it is not fat gain and it is not the same as the soft, puffy bloating people imagine.", "A big loading dose can upset some stomachs. Skip the drama: use a sensible daily amount, take it with food if that feels better, and assess how you respond."] },
      { title: "Daily Use: 3–5 Grams", paragraphs: ["You do not need a loading phase and you do not need to cycle it. A consistent 3–5 grams of creatine monohydrate per day is a simple approach for most healthy adults.", "Pick a time you will remember. Daily consistency beats obsessing over a perfect clock time."], bullets: ["Choose plain creatine monohydrate", "Use 3–5 g daily", "Drink normally and eat normally", "Stop and get advice if you have an unusual reaction"] },
      { title: "How Much Creatine Do You Need Per Day?", paragraphs: ["For most healthy adults, the simple target is still 3–5 grams of plain creatine monohydrate every day. Bigger scoops do not create bigger results; they mostly create more chances for stomach upset.", "Use the amount that you can take consistently. If you are unsure because of a health condition, medication, or kidney history, ask a qualified clinician before adding any supplement."], bullets: ["Use 3–5 g daily", "Take it with water or a normal meal", "Keep the habit simple", "Ask for medical advice when you have a relevant health concern"] },
      { title: "Hair Loss and Reported Side Effects", paragraphs: ["Current evidence does not show that normal creatine use causes hair loss. A commonly repeated old study did not measure hair loss itself, and later evidence has not confirmed the claim.", "The effects worth watching are boring and usually manageable: stomach upset when people take too much at once, temporary water-weight change, or cramps when training and hydration are already poor."] },
      { title: "Final Verdict: Should You Take Creatine?", paragraphs: ["Creatine can support training. It cannot rescue a plan you do not follow. Nail your workouts, protein, calories, and sleep first. Then decide if this small tool is worth adding.", "If you are healthy, train consistently, and want a well-studied option that is simple to use, creatine monohydrate is a reasonable shortlist item. It is a helper, not the foundation."] },
    ],
    cta: "Get your training and food basics in place with the Free 7-Day Fat Loss Starter before you worry about supplements.",
  },
  {
    slug: "when-to-take-whey-protein",
    title: "When to Take Whey Protein for Useful Results",
    excerpt: "The best time is the time that helps you hit your daily protein target without making life harder.",
    category: "Nutrition & supplements",
    intro: ["People turn protein timing into a stress test. They carry a shaker around like a fire alarm, worried they will miss a magical post-workout window.", "The boring truth wins: total daily protein is the main job. Whey is simply a convenient way to fill a gap when food is not practical."],
    cover: { src: "/manus-storage/whey-guide-cover-approved_999e12f9.jpg", alt: "Whey protein guide cover" },
    sections: [
      { title: "What Whey Protein Is For", paragraphs: ["Whey is a fast, convenient protein source. It is not better than a solid meal just because it comes in a scoop.", "Use it when it helps you reach a useful daily target, especially when a meal is not available or your meals run low on protein."] },
      { title: "After Training: Useful, Not Magical", paragraphs: ["A shake after training is convenient, but you do not need to panic if you eat a protein-rich meal later. Get a normal protein serving within the next few hours and keep the full day on track.", "If you trained fasted or will not eat soon, whey after the session is a practical move. If you already had a protein-rich meal before lifting, the clock matters much less."] },
      { title: "Before Training", paragraphs: ["If it has been several hours since your last meal, a whey shake 45–60 minutes before training can be an easy way to arrive fueled. Keep it light enough that your stomach is not arguing with your squat session.", "A thick shake immediately before hard training is not toughness. It is an easy way to feel sick. Give yourself breathing room."] },
      { title: "Morning, Between Meals, and Rest Days", paragraphs: ["Whey works in the morning, between meals, and on rest days if it stops you from ending the day well below your protein target. On rest days, muscle repair is still happening.", "Before bed, a slower food-based protein source may keep you fuller. The bigger rule stays the same: use the option you can repeat."] },
      { title: "The Timing Hierarchy", paragraphs: ["Get the big picture right before you obsess over the minute on the clock. Protein timing is useful only after your daily target is close to handled."], bullets: ["Hit your total daily protein first", "Spread protein across three or four meals", "Use whey before or after training when it makes the day easier", "Use it to close a gap, not replace every meal"] },
      { title: "How Much Protein Do You Need Per Day?", paragraphs: ["For muscle growth, a useful everyday range for most adults who train is around 1.6–2.2 grams of protein per kilogram of bodyweight. The exact number does not need to become another thing you stress about; use it as a practical target and adjust your meals around it.", "Whey can make the target easier to reach, especially when a meal is not available. It does not need to replace food. Build your day around normal protein-rich meals, then use a shake to close the gap."], bullets: ["Aim for 1.6–2.2 g per kg of bodyweight", "Spread protein across three or four meals", "Use whey when it makes the day easier", "Keep real meals doing most of the work"] },
      { title: "Common Timing Mistakes", paragraphs: ["Do not use whey as an excuse to ignore real meals. Do not double-scoop because marketing made you nervous. And do not treat timing as more important than total intake."], bullets: ["Skipping protein on rest days", "Relying on shakes as your only real meal", "Drinking a heavy shake immediately before intense training", "Ignoring protein quality in the rest of your diet"] },
      { title: "The Strict Coach Rule", paragraphs: ["First build meals around protein. Use whey to close the gap, not to make the plan look more serious. If it helps you hit your target consistently, it is doing its job."] },
    ],
    cta: "Use the Free 7-Day Fat Loss Starter to set a realistic protein target and make every meal do some work.",
  },
];

export function serializeArticleBody(article: ArticleSeed) {
  return JSON.stringify({ intro: article.intro, cover: article.cover, sections: article.sections, cta: article.cta });
}
