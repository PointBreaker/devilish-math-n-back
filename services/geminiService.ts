import { GameStats, NBackConfig } from "../types";

// Helper to pick random message
const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const getDrDevilAnalysis = async (stats: GameStats, config: NBackConfig): Promise<string> => {
  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  
  // Simulate a brief "thinking" delay for effect
  await new Promise(resolve => setTimeout(resolve, 600));

  if (accuracy >= 95) {
      return pick([
          "Devilishly good! Your neurons are firing on all cylinders!",
          "Perfection! You are operating at peak human efficiency.",
          "Outstanding! Even I am slightly impressed by that performance.",
          "Your focus is razor sharp. Keep it up!"
      ]);
  }
  
  if (accuracy >= 80) {
      return pick([
          "Not bad. You're starting to sweat, aren't you?",
          "Solid work. You're getting there, but don't get cocky.",
          "Acceptable. But true genius requires absolute consistency.",
          "Good, but I know you can go faster."
      ]);
  }

  if (accuracy >= 65) {
      return pick([
          "You scraped by. Focus harder next time!",
          "Barely acceptable. Do not let your mind wander.",
          "You survived, but your brain is still sluggish.",
          "Sloppy! You need to tighten up your mental queue."
      ]);
  }

  return pick([
      "Pathetic! My calculator watch has more processing power.",
      "Are you even trying? Your focus is drifting all over the place!",
      "Terrible! Your working memory is as leaky as a sieve.",
      "Disappointing. Perhaps we should switch to 1+1?"
  ]);
};