
import React, { useEffect, useState } from 'react';
import { SessionStats, GameStats } from '../types';
import { getDrDevilAnalysis } from '../services/geminiService';
import { RefreshCw, Home, BrainCircuit, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

interface ResultsProps {
  session: SessionStats;
  onRetry: () => void;
  onHome: () => void;
}

const Results: React.FC<ResultsProps> = ({ session, onRetry, onHome }) => {
  const [analysis, setAnalysis] = useState<string>("正在分析神经模式...");
  
  // Calculate aggregate stats
  const overallAccuracy = session.totalProblems > 0 
    ? Math.round((session.totalCorrect / session.totalProblems) * 100) 
    : 0;

  // Last played level stats (the one user failed on)
  const lastLevelStats = session.levelStats[session.levelStats.length - 1];

  useEffect(() => {
    // Only fetch AI analysis if we have stats
    if (lastLevelStats) {
       getDrDevilAnalysis(lastLevelStats, { n: session.maxLevel, problemCount: 0 }).then(setAnalysis);
    }
  }, [session]);

  // Chart Data: Accuracy per level
  const chartData = session.levelStats.map((stat, index) => ({
    level: `${stat.level}-Back`,
    accuracy: Math.round((stat.correct / stat.total) * 100),
    passed: Math.round((stat.correct / stat.total) * 100) >= 65
  }));

  return (
    <div className="fixed inset-0 bg-gray-900 overflow-hidden">
      <div className="flex flex-col h-full w-full max-w-md mx-auto p-3 sm:p-6 animate-fade-in text-white overflow-y-auto">

      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-4xl font-black text-white italic tracking-tighter mb-1">游戏结束</h2>
        <div className="text-devil-500 font-mono font-bold text-lg uppercase">本次游戏报告</div>
      </div>

      {/* Main Score Card */}
      <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700 shadow-xl mb-4 sm:mb-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp size={100} />
         </div>
         <div className="relative z-10">
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">最高关卡</div>
            <div className="text-4xl sm:text-6xl font-black text-white mb-3 sm:mb-4">
              第 {session.maxLevel} 关<span className="text-xl sm:text-2xl text-devil-500">步记忆</span>
            </div>

            <div className="flex gap-4 sm:gap-8">
               <div>
                  <div className="text-gray-500 text-xs uppercase">总体准确率</div>
                  <div className={`text-2xl font-bold ${overallAccuracy >= 65 ? 'text-green-400' : 'text-red-400'}`}>
                    {overallAccuracy}%
                  </div>
               </div>
               <div>
                  <div className="text-gray-500 text-xs uppercase">答对题数</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {session.totalCorrect} <span className="text-sm text-gray-500">/ {session.totalProblems}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Progression Chart */}
      <div className="h-40 sm:h-48 w-full mb-4 sm:mb-6 bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700/50">
        <div className="text-xs text-gray-400 mb-2 uppercase font-bold flex items-center gap-2">
            <TrendingUp size={14} /> 关卡进度（准确率 %）
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
             <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
             <XAxis dataKey="level" tick={{fill: '#9ca3af', fontSize: 10}} axisLine={false} tickLine={false} />
             <YAxis hide domain={[0, 100]} />
             <Tooltip 
                contentStyle={{ backgroundColor: '#111827', borderColor: '#ef4444', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                cursor={{fill: '#374151', opacity: 0.4}}
             />
             <Bar dataKey="accuracy" radius={[4, 4, 0, 0]} barSize={30}>
               {chartData.map((entry, index) => (
                 <Cell key={`cell-${index}`} fill={entry.passed ? '#22c55e' : '#ef4444'} />
               ))}
             </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Analysis Card */}
      <div className="bg-devil-950/80 border border-devil-800 p-3 sm:p-5 rounded-xl mb-4 sm:mb-8 relative">
         <div className="flex items-center gap-2 text-devil-500 font-bold text-xs mb-2">
            <BrainCircuit size={14} />
            恶魔博士的评价
         </div>
         <p className="text-gray-200 italic text-sm leading-relaxed">
           "{analysis}"
         </p>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-auto">
        <button
          onClick={onHome}
          className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold text-gray-300 flex items-center justify-center gap-2 transition-colors"
        >
          <Home size={20} />
          菜单
        </button>
        <button
          onClick={onRetry}
          className="flex-1 py-4 bg-white hover:bg-gray-200 text-black rounded-xl font-black flex items-center justify-center gap-2 shadow-lg shadow-devil-900/20 transition-colors"
        >
          <RefreshCw size={20} />
          重试
        </button>
      </div>
      </div>
    </div>
  );
};

export default Results;
