
import React, { useState, useEffect, useRef } from 'react';
import { GameStats, NBackConfig, MathProblem } from '../types';
import { generateProblem } from '../utils/mathGenerator';
import Numpad from './Numpad';
import { Brain, Check, X, ArrowDown, Lock } from 'lucide-react';

interface GameProps {
  config: NBackConfig;
  onEnd: (stats: GameStats) => void;
}

type Phase = 'memorize' | 'playing' | 'cooldown';

const Game: React.FC<GameProps> = ({ config, onEnd }) => {
  // --- Game State ---
  const [phase, setPhase] = useState<Phase>('memorize');
  const [queue, setQueue] = useState<MathProblem[]>([]);
  const [newProblem, setNewProblem] = useState<MathProblem | null>(null);

  // Counters
  const [generatedCount, setGeneratedCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  
  // Animation / Feedback State
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [revealedAnswer, setRevealedAnswer] = useState<{problem: MathProblem, input: number} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [slideAnim, setSlideAnim] = useState(false);

  // Stats
  const [stats, setStats] = useState<GameStats>({
    correct: 0,
    total: 0,
    maxCombo: 0,
    avgTimeMs: 0,
    level: config.n,
    history: []
  });
  const [currentCombo, setCurrentCombo] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());

  // --- Initialization ---
  useEffect(() => {
    const p1 = generateProblem();
    setNewProblem(p1);
    setPhase('memorize');
    setStartTime(Date.now());
    setSlideAnim(true);
  }, [config.n]); // Reset when N changes

  // Clear animation flag after render
  useEffect(() => {
    if (slideAnim) {
        const t = setTimeout(() => setSlideAnim(false), 300);
        return () => clearTimeout(t);
    }
  }, [slideAnim]);

  // --- Handlers ---

  const handleMemorizeNext = () => {
    if (isProcessing || !newProblem) return;
    setIsProcessing(true);

    const nextQueue = [...queue, newProblem];
    setQueue(nextQueue);
    const nextGenCount = generatedCount + 1;
    setGeneratedCount(nextGenCount);

    setTimeout(() => {
        setIsProcessing(false);
        if (nextGenCount < config.n) {
            setNewProblem(generateProblem());
            setSlideAnim(true);
        } else {
            setPhase('playing');
            setNewProblem(generateProblem());
            setSlideAnim(true);
            setStartTime(Date.now());
        }
    }, 150);
  };

  const handleInput = (num: number) => {
    if (isProcessing || queue.length === 0) return;
    
    const target = queue[0];
    const isCorrect = num === target.answer;
    const now = Date.now();
    const timeTaken = now - startTime;

    setIsProcessing(true);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setRevealedAnswer({ problem: target, input: num });

    // Update Stats
    setStats(prev => {
        const newCorrect = isCorrect ? prev.correct + 1 : prev.correct;
        const newCombo = isCorrect ? currentCombo + 1 : 0;
        setCurrentCombo(newCombo);
        return {
            ...prev,
            correct: newCorrect,
            total: prev.total + 1,
            maxCombo: Math.max(prev.maxCombo, newCombo),
            avgTimeMs: (prev.avgTimeMs * prev.total + timeTaken) / (prev.total + 1),
            history: [...prev.history, { problem: target, userAnswer: num, isCorrect, timeMs: timeTaken }]
        };
    });

    // Determine Next State
    setTimeout(() => {
        const nextQueue = queue.slice(1);
        const nextCompleted = completedCount + 1;
        setCompletedCount(nextCompleted);
        
        if (phase === 'playing' && newProblem) {
            nextQueue.push(newProblem);
            const nextGen = generatedCount + 1;
            setGeneratedCount(nextGen);

            if (nextGen >= config.problemCount) {
                setPhase('cooldown');
                setNewProblem(null);
            } else {
                setNewProblem(generateProblem());
                setSlideAnim(true);
            }
        } else if (phase === 'cooldown') {
            if (nextQueue.length === 0) {
                onEnd(stats);
                return; 
            }
        }

        setQueue(nextQueue);
        setFeedback(null);
        setRevealedAnswer(null);
        setIsProcessing(false);
        setStartTime(Date.now());
    }, 800);
  };

  const totalSteps = config.problemCount + config.n;
  const stepsLeft = totalSteps - completedCount;

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto w-full bg-gray-900 overflow-hidden relative">
      
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-800 z-10 h-16 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-devil-600 text-white font-bold px-2 py-0.5 rounded text-sm">
            第 {config.n} 关
          </div>
          <span className="font-mono font-bold text-gray-200">{config.n}步记忆</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-sm font-bold text-gray-400">
          <span>剩余: <span className="text-white text-lg">{stepsLeft}</span></span>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative flex flex-col items-center p-4 gap-2 min-h-0">
        
        {/* --- TOP SCREEN: NEW PROBLEM --- */}
        <div className="w-full flex-1 flex flex-col justify-end pb-4">
          <div className="text-center mb-2 h-6">
             {phase === 'memorize' && (
               <span className="text-xs uppercase tracking-widest text-devil-400 font-bold bg-devil-900/30 px-2 py-1 rounded animate-pulse">
                 记忆阶段
               </span>
             )}
          </div>
          
          <div className={`
             bg-gray-800 border-2 border-gray-700 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden transition-all duration-300
             ${phase === 'cooldown' ? 'opacity-20 scale-95 h-20' : 'h-32 opacity-100'}
          `}>
             <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,transparent_25%,#fff_25%,#fff_50%,transparent_50%,transparent_75%,#fff_75%,#fff_100%)] bg-[length:20px_20px]"></div>
             
             {newProblem && (
                 <div key={newProblem.id} className={`text-5xl font-mono font-bold text-white relative z-10 ${slideAnim ? 'animate-slide-in' : ''}`}>
                   {newProblem.expression}
                 </div>
             )}
             {!newProblem && phase === 'cooldown' && (
                 <div className="text-gray-600 font-mono text-xl">---</div>
             )}
          </div>
        </div>

        {/* --- MIDDLE: CONVEYOR INDICATOR --- */}
        <div className="h-12 flex flex-col items-center justify-center relative w-full shrink-0">
           <ArrowDown className={`text-gray-600 transition-all duration-300 ${isProcessing ? 'translate-y-2 text-devil-500' : ''}`} size={24} />
           <div className="flex gap-1 mt-1 justify-center w-full px-8">
                {/* Visualizing the "Queue" depth */}
                {queue.map((_, i) => (
                    <div 
                        key={i} 
                        className={`
                            h-1.5 rounded-full transition-all duration-300
                            ${i === 0 ? 'w-8 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'w-4 bg-gray-700'}
                        `}
                    />
                ))}
                {queue.length === 0 && <div className="w-4 h-1.5 bg-gray-800 rounded-full"/>}
           </div>
        </div>

        {/* --- BOTTOM SCREEN: ANSWER AREA --- */}
        <div className="w-full flex-1 flex flex-col justify-start pt-2 relative">
          <div className="text-center mb-2 h-6">
             {phase !== 'memorize' && (
               <span className="text-xs uppercase tracking-widest text-blue-400 font-bold bg-blue-900/20 px-2 py-1 rounded">
                 回答阶段
               </span>
             )}
          </div>

          <div className={`
             bg-gray-100 border-4 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-200 relative overflow-hidden
             ${phase === 'memorize' ? 'opacity-40 border-gray-600 grayscale bg-gray-300' : 'opacity-100'}
             ${feedback === 'correct' ? 'border-green-500 bg-green-50' : ''}
             ${feedback === 'wrong' ? 'border-red-500 bg-red-50' : 'border-gray-300'}
             h-32
          `}>
             {phase === 'memorize' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10">
                    <Lock className="text-gray-500" size={32} />
                </div>
             )}
          
             <div className="flex items-center gap-2 sm:gap-4 text-4xl sm:text-5xl font-mono font-bold text-gray-800 relative z-0">
               {revealedAnswer ? (
                  <>
                    <span className="text-gray-500 text-3xl sm:text-4xl">{revealedAnswer.problem.expression}</span>
                    <span className="text-gray-400">=</span>
                    <span className={feedback === 'correct' ? 'text-green-600 scale-110' : 'text-red-600 scale-110'}>
                       {revealedAnswer.input}
                    </span>
                  </>
               ) : (
                  <>
                    <span className="text-gray-400">?</span>
                    <span className="text-gray-400 text-3xl">+</span>
                    <span className="text-gray-400">?</span>
                    <span className="text-gray-400">=</span>
                    <div className="w-14 h-14 border-b-4 border-gray-400 flex items-center justify-center bg-gray-200/50 rounded animate-pulse">
                    </div>
                  </>
               )}
             </div>

             {/* Overlays */}
             {feedback === 'correct' && (
               <div className="absolute inset-0 flex items-center justify-center z-20 animate-bounce">
                 <Check className="w-20 h-20 text-green-500 drop-shadow-lg" strokeWidth={5} />
               </div>
             )}
             {feedback === 'wrong' && (
               <div className="absolute inset-0 flex items-center justify-center z-20 animate-pulse">
                 <X className="w-20 h-20 text-red-500 drop-shadow-lg" strokeWidth={5} />
               </div>
             )}
          </div>
        </div>

      </div>

      {/* --- INPUT AREA --- */}
      <div className="bg-gray-800 p-3 pb-6 rounded-t-3xl shadow-[0_-4px_30px_rgba(0,0,0,0.5)] z-30 border-t border-gray-700 shrink-0">
        {phase === 'memorize' ? (
           <button
             onClick={handleMemorizeNext}
             disabled={isProcessing}
             className="w-full h-28 sm:h-36 bg-devil-600 hover:bg-devil-500 active:bg-devil-700 text-white rounded-xl shadow-[0_6px_0_rgb(127,29,29)] active:shadow-none active:translate-y-1.5 transition-all flex flex-col items-center justify-center gap-2 border-2 border-devil-400"
           >
             <span className="text-2xl font-black uppercase tracking-widest">记忆</span>
             <span className="text-sm font-normal opacity-90 font-mono bg-black/20 px-3 py-1 rounded-full">点击隐藏</span>
           </button>
        ) : (
           <Numpad onPress={handleInput} disabled={isProcessing} />
        )}
      </div>
    </div>
  );
};

export default Game;
