import { GameStats, NBackConfig } from "../types";

// Helper to pick random message
const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const getDrDevilAnalysis = async (stats: GameStats, config: NBackConfig): Promise<string> => {
  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  // Simulate a brief "thinking" delay for effect
  await new Promise(resolve => setTimeout(resolve, 600));

  if (accuracy >= 95) {
      return pick([
          "恶魔般的好表现！你的神经元正在全速运转！",
          "完美！你正处在人类效率的巅峰状态。",
          "卓越！连我都有点被你的表现打动了。",
          "你的专注力如刀锋般锐利。继续保持！"
      ]);
  }

  if (accuracy >= 80) {
      return pick([
          "不错嘛。你开始流汗了，对吧？",
          "扎实的表现。你正在进步，但别骄傲自满。",
          "可以接受。但真正的天才需要绝对的一致性。",
          "很好，但我知道你可以更快。"
      ]);
  }

  if (accuracy >= 65) {
      return pick([
          "你勉强通过。下次更专注一点！",
          "勉强可以接受。不要让你的思绪飘散。",
          "你活下来了，但你的大脑仍然迟钝。",
          "马虎！你需要收紧你的思维队列。"
      ]);
  }

  return pick([
      "可悲！我的计算器手表都比你有计算能力。",
      "你到底有没有在尝试？你的注意力到处乱飘！",
          "糟糕！你的工作记忆像个漏水的筛子。",
          "令人失望。也许我们应该换成1+1？"
  ]);
};