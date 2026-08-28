import {
  claimWeeklyChallengeDelivery,
  isWeeklyChallengeScheduleActive,
  listWeeklyChallengeRecipients,
  markWeeklyChallengeFailed,
  markWeeklyChallengeSent,
} from "./db";
import { sendWeeklyChallengeEmail } from "./mailjetDelivery";

export type WeeklyChallenge = {
  key: string;
  title: string;
  intro: string;
  tasks: string[];
  coachNote: string;
};

export const weeklyChallenges: readonly WeeklyChallenge[] = [
  { key: "walk-before-scroll", title: "Walk Before Scroll", intro: "Win the first decision of your day before the feed wins it for you.", tasks: ["Walk for 20 minutes before social media.", "Do 10 bodyweight squats after the walk.", "Repeat this on three days this week."], coachNote: "Simple work counts. Your legs do not need a motivational speech." },
  { key: "protein-anchor", title: "Protein Anchor", intro: "Make one food habit easy enough to repeat, not impressive enough to post.", tasks: ["Choose one protein source for breakfast.", "Eat that breakfast on five days this week.", "Write down the choice each day."], coachNote: "Boring food that you repeat beats a perfect plan you forget." },
  { key: "push-pull-pair", title: "Push + Pull Pair", intro: "Give your upper body a clean, simple training signal this week.", tasks: ["Do 3 sets of push-ups or presses twice this week.", "Do 3 sets of rows or band rows twice this week.", "Leave 1–3 good reps in the tank."], coachNote: "Use a variation you can control. Form first, ego later." },
  { key: "sleep-shutdown", title: "Sleep Shutdown", intro: "Recovery is training that happens when you stop behaving like your phone is an emergency.", tasks: ["Set one bedtime alarm.", "Put the phone away 20 minutes before bed on four nights.", "Get up at roughly the same time the next morning."], coachNote: "You do not need a perfect night. You need a better repeatable one." },
  { key: "lower-body-basics", title: "Legs Do the Work", intro: "Train the big muscles with movements you can actually repeat.", tasks: ["Do 3 sets of squats, split squats, or leg press twice this week.", "Do 2 sets of a hip-hinge movement twice this week.", "Take 60–120 seconds of rest between hard sets."], coachNote: "Pick the safest option you have. Controlled reps are not boring—they work." },
  { key: "plate-build", title: "Build a Better Plate", intro: "No detox. No weird rules. Just make two meals easier to manage.", tasks: ["Add a palm-sized protein source to two meals per day.", "Add one fruit or vegetable to those meals.", "Drink water with both meals."], coachNote: "You are not fixing your life in one meal. You are practicing a useful default." },
  { key: "training-appointment", title: "Book the Reps", intro: "Stop waiting to feel motivated. Put two sessions on the calendar first.", tasks: ["Choose two 30–45 minute training times.", "Treat them like appointments.", "If one is missed, move it within 48 hours instead of quitting the week."], coachNote: "A moved session is still a session. Drama is optional." },
  { key: "carry-your-weight", title: "Carry Your Weight", intro: "Build simple trunk strength and grip without turning it into circus training.", tasks: ["Do 3 loaded carries, suitcase carries, or farmer walks twice this week.", "Walk with tall posture and slow steps.", "Stop if form breaks down."], coachNote: "If you have no weights, carry a loaded backpack safely." },
  { key: "two-litres-first", title: "Water Has a Job", intro: "Hydration will not replace training, but being under-hydrated makes simple habits harder.", tasks: ["Fill one bottle in the morning.", "Finish it before lunch.", "Refill it once on five days this week."], coachNote: "Coffee can stay. Water still has to show up." },
  { key: "rep-quality", title: "Better Reps", intro: "This week, remove rushed reps from one exercise.", tasks: ["Choose one lift or bodyweight movement.", "Use a controlled lowering phase for every rep.", "Record the reps, not just the weight."], coachNote: "More control gives you more information. Use it." },
  { key: "kitchen-reset", title: "Kitchen Reset", intro: "Make your next meal easier before hunger makes the decision for you.", tasks: ["Prepare one protein option in advance.", "Prepare one easy fruit or vegetable option.", "Use both on three days this week."], coachNote: "Preparation is not glamorous. It is still powerful." },
  { key: "show-up-streak", title: "The Three-Day Streak", intro: "Build proof that you can start without making it complicated.", tasks: ["Move for at least 15 minutes on three consecutive days.", "One day can be an easy walk.", "Write one sentence after each day: what made it easier?"], coachNote: "The goal is not suffering. The goal is showing up again tomorrow." },
] as const;

function partsForTimeZone(timeZone: string, now: Date) {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(now);
    return Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  } catch {
    return null;
  }
}

export function getSundayChallengeWindow(timeZone: string, now = new Date()) {
  const parts = partsForTimeZone(timeZone, now);
  if (!parts || parts.weekday !== "Sun" || parts.hour !== "18") return null;
  const minute = Number(parts.minute);
  if (!Number.isInteger(minute) || minute < 0 || minute >= 30) return null;
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function selectWeeklyChallenge(weekKey: string) {
  const [year, month, day] = weekKey.split("-").map(Number);
  const sundayIndex = Math.floor(Date.UTC(year, (month ?? 1) - 1, day ?? 1) / (7 * 24 * 60 * 60 * 1000));
  return weeklyChallenges[Math.abs(sundayIndex) % weeklyChallenges.length]!;
}

export async function processWeeklyChallenges(input: { now?: Date; publicBaseUrl: string; taskUid: string; globalSunday?: boolean }) {
  if (!input.globalSunday && !await isWeeklyChallengeScheduleActive(input.taskUid)) return { ok: true, skipped: "inactive_schedule", sent: 0, failed: 0 } as const;
  const now = input.now ?? new Date();
  const recipients = await listWeeklyChallengeRecipients();
  let sent = 0;
  let failed = 0;
  let skipped = 0;

  const utcWeekKey = input.globalSunday && now.getUTCDay() === 0
    ? `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`
    : null;
  if (input.globalSunday && !utcWeekKey) return { ok: true, sent: 0, failed: 0, skipped: recipients.length } as const;

  for (const recipient of recipients) {
    const weekKey = utcWeekKey ?? getSundayChallengeWindow(recipient.timeZone, now);
    if (!weekKey) { skipped += 1; continue; }
    const challenge = selectWeeklyChallenge(weekKey);
    const deliveryId = await claimWeeklyChallengeDelivery({ subscriberId: recipient.id, weekKey, challengeKey: challenge.key });
    if (!deliveryId) { skipped += 1; continue; }
    const result = await sendWeeklyChallengeEmail({
      requestId: deliveryId,
      recipientName: recipient.name || "Builder",
      recipientEmail: recipient.email,
      challenge,
      libraryUrl: new URL("/my-programs", input.publicBaseUrl).toString(),
    });
    if (result.status === "sent") {
      await markWeeklyChallengeSent({ deliveryId, subscriberId: recipient.id, weekKey, providerMessageId: result.providerMessageId });
      sent += 1;
    } else {
      await markWeeklyChallengeFailed(deliveryId, result.errorMessage);
      failed += 1;
    }
  }
  return { ok: true, sent, failed, skipped } as const;
}
