export type CalorieInput = {
  age: number;
  weightKg: number;
  heightCm: number;
  activity: number;
  goal: "fat_loss" | "maintain" | "muscle_gain";
};

export function calculateCalorieTarget(input: CalorieInput) {
  if (input.age < 16 || input.age > 90 || input.weightKg < 35 || input.weightKg > 300 || input.heightCm < 130 || input.heightCm > 230) {
    throw new Error("Enter realistic age, height, and weight values to calculate a target.");
  }
  const bmr = 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age + 5;
  const maintenance = Math.round(bmr * input.activity);
  const adjustment = input.goal === "fat_loss" ? -400 : input.goal === "muscle_gain" ? 250 : 0;
  return { maintenance, target: Math.max(1200, maintenance + adjustment), adjustment };
}

export function calculateProteinTarget(weightKg: number, goal: "fat_loss" | "maintain" | "muscle_gain") {
  if (weightKg < 35 || weightKg > 300) throw new Error("Enter a body weight between 35 kg and 300 kg.");
  const multiplier = goal === "muscle_gain" ? 2.0 : goal === "fat_loss" ? 1.9 : 1.7;
  const target = Math.round(weightKg * multiplier);
  return { target, lower: Math.round(weightKg * 1.6), upper: Math.round(weightKg * 2.2), multiplier };
}
