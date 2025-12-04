
import React, { useState } from 'react';
import Game from './components/Game';
import Results from './components/Results';
import { GameState, GameStats, NBackConfig, SessionStats } from './types';
import { Brain, Play, Trophy, ArrowUpCircle } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    maxLevel: 1,
    totalCorrect: 0,
    totalProblems: 0,
    levelStats: []
  });

  // Constants
  const PASS_ACCURACY = 65; // Percentage needed to advance
  const PROBLEMS_PER_LEVEL = 15;

  const startGame = () => {
    setCurrentLevel(1);
    setSessionStats({
      maxLevel: 1,
      totalCorrect: 0,
      totalProblems: 0,
      levelStats: []
    });
    setGameState('playing');
  };
  
  const handleLevelEnd = (stats: GameStats) => {
    const accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
    
    // Update session stats
    const updatedSession: SessionStats = {
        maxLevel: currentLevel,
        totalCorrect: sessionStats.totalCorrect + stats.correct,
        totalProblems: sessionStats.totalProblems + stats.total,
        levelStats: [...sessionStats.levelStats, stats]
    };
    setSessionStats(updatedSession);

    if (accuracy >= PASS_ACCURACY) {
        // SUCCESS: Advance to next level
        setGameState('transition');
        setTimeout(() => {
            setCurrentLevel(prev => prev + 1);
            setGameState('playing');
        }, 2500);
    } else {
        // FAILURE: Game Over
        setGameState('results');
    }
  };

  const config: NBackConfig = {
    n: currentLevel,
    problemCount: PROBLEMS_PER_LEVEL
  };

  return (
    <div className="fixed inset-0 bg-neutral-900 text-gray-100 font-sans bg-grid-pattern overflow-hidden">

      {gameState === 'menu' && (
        <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6 max-w-md mx-auto w-full animate-fade-in">
          <div className="mb-12 text-center relative">
            <div className="absolute inset-0 bg-devil-500 blur-[60px] opacity-20 rounded-full"></div>
            <div className="relative">
              <Brain size={80} className="mx-auto text-devil-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
              <h1 className="text-5xl font-black tracking-tighter text-white mb-2 italic">
                恶魔<span className="text-devil-500">计算</span>
              </h1>
              <div className="text-gray-400 font-mono text-sm uppercase tracking-widest border-t border-gray-700 pt-2 inline-block">
                无尽挑战
              </div>
            </div>
          </div>

          <div className="w-full space-y-6 bg-gray-800/80 backdrop-blur-md p-8 rounded-3xl border border-gray-700 shadow-2xl">
            <div className="space-y-4">
               <div className="flex items-start gap-4">
                  <div className="bg-devil-900/50 p-2 rounded-lg text-devil-400 font-bold font-mono">01</div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    记住答案。它们将被隐藏。
                  </p>
               </div>
               <div className="flex items-start gap-4">
                  <div className="bg-devil-900/50 p-2 rounded-lg text-devil-400 font-bold font-mono">02</div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    输入 <span className="text-white font-bold">N 步之前</span>的答案。
                  </p>
               </div>
               <div className="flex items-start gap-4">
                  <div className="bg-devil-900/50 p-2 rounded-lg text-devil-400 font-bold font-mono">03</div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    达到 <span className="text-green-400 font-bold">{PASS_ACCURACY}%</span> 的准确率以进入下一关。
                  </p>
               </div>
            </div>

            <button
              onClick={startGame}
              className="w-full py-5 bg-white text-black rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-devil-500 hover:text-white transition-all active:scale-95 shadow-[0_10px_20px_rgba(0,0,0,0.3)] mt-8"
            >
              <Play size={24} fill="currentColor" />
              开始训练
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <Game config={config} onEnd={handleLevelEnd} />
      )}

      {gameState === 'transition' && (
        <div className="fixed inset-0 bg-devil-900/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center animate-fade-in p-4 sm:p-6 text-center">
            <ArrowUpCircle size={64} className="text-white mb-6 animate-bounce" />
            <h2 className="text-4xl font-black text-white italic mb-2">关卡通过！</h2>
            <p className="text-devil-200 text-lg mb-8">准确率达标。升级中...</p>

            <div className="flex items-center gap-4 text-2xl font-mono font-bold">
                <span className="opacity-50">{currentLevel}步记忆</span>
                <span className="text-white">→</span>
                <span className="text-green-400 scale-125 transform transition-transform">{currentLevel + 1}步记忆</span>
            </div>
        </div>
      )}

      {gameState === 'results' && (
        <Results 
          session={sessionStats}
          onRetry={startGame} 
          onHome={() => setGameState('menu')} 
        />
      )}

    </div>
  );
};

export default App;
