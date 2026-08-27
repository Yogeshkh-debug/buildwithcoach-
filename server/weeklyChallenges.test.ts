import { describe, expect, it } from "vitest";
import { buildWeeklyChallengeMessage } from "./mailjetDelivery";
import { getSundayChallengeWindow, selectWeeklyChallenge, weeklyChallenges } from "./weeklyChallenges";

describe("weekly challenge delivery", () => {
  it("opens the 6 PM Sunday sending window in India and the United States independently", () => {
    expect(getSundayChallengeWindow("Asia/Kolkata", new Date("2026-08-30T12:30:00.000Z"))).toBe("2026-08-30");
    expect(getSundayChallengeWindow("America/New_York", new Date("2026-08-30T22:15:00.000Z"))).toBe("2026-08-30");
    expect(getSundayChallengeWindow("Europe/London", new Date("2026-08-30T16:30:00.000Z"))).toBeNull();
  });

  it("does not select the same challenge for consecutive Sunday dates", () => {
    const thisWeek = selectWeeklyChallenge("2026-08-30");
    const nextWeek = selectWeeklyChallenge("2026-09-06");
    expect(weeklyChallenges).toContain(thisWeek);
    expect(nextWeek.key).not.toBe(thisWeek.key);
  });

  it("builds a clear challenge email with no private storage key", () => {
    const message = buildWeeklyChallengeMessage({
      recipientName: "Asha <builder>",
      challenge: weeklyChallenges[0]!,
      libraryUrl: "https://build.example/my-programs",
    });
    expect(message.subject).toContain("Walk Before Scroll");
    expect(message.html).toContain("Good week to build, Asha.");
    expect(message.html).not.toContain("<builder>");
    expect(message.html).toContain("Open My Programs");
    expect(message.html).not.toContain("storageKey");
  });
});
