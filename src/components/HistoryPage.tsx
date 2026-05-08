import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Trophy, Zap, CheckCircle2, ChevronRight, ChevronDown, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { getHistory, clearHistory } from "../lib/historyStore";
import { WorkoutRecord } from "../types";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<WorkoutRecord[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const totalVolumeInHistory = history.map(r => r.totalVolume);
  const maxVolume = totalVolumeInHistory.length > 0 ? Math.max(...totalVolumeInHistory) : 0;

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    setShowResetConfirm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-5 max-w-md mx-auto min-h-screen relative"
    >
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-8 w-full max-w-xs flex flex-col gap-6"
            >
              <div className="space-y-2 text-center">
                <RotateCcw className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-black text-white">운동 기록 초기화</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  운동 기록을 전부 초기화 하시겠습니까?<br/>이 작업은 되돌릴 수 없습니다.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
                >
                  아니오
                </button>
                <button
                  onClick={handleClearHistory}
                  className="flex-1 py-4 rounded-2xl bg-accent text-black font-black hover:brightness-110 transition-all"
                >
                  예
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex items-center justify-between mb-8">
        <button onClick={() => navigate("/")} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-black tracking-tight text-white">운동 기록</h1>
        <div className="w-10" />
      </header>

      {/* Summary Chips */}
      <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar mb-4 items-center">
        <div className="flex-shrink-0 bg-accent/10 text-accent px-4 py-2 rounded-full border border-accent/20 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span className="text-[10px] font-black tracking-widest uppercase">누적 {history.length}회 완료</span>
        </div>
        {history.length > 0 && (
          <>
            <div className="flex-shrink-0 bg-white/5 text-white/40 px-4 py-2 rounded-full border border-white/5 flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-[10px] font-black tracking-widest uppercase">최고 볼륨 {maxVolume.toLocaleString()}kg</span>
            </div>
            <button 
              onClick={() => setShowResetConfirm(true)}
              className="flex-shrink-0 bg-red-500/10 text-red-500/60 px-4 py-2 rounded-full border border-red-500/20 flex items-center gap-2 hover:bg-red-500/20 transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black tracking-widest uppercase">초기화</span>
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col gap-6 relative pb-20">
        {history.length === 0 ? (
          <div className="text-center py-20 opacity-20">
            <Calendar className="w-14 h-14 mx-auto mb-6 opacity-10" />
            <p className="text-sm font-medium">아직 운동 기록이 없습니다.</p>
          </div>
        ) : (
          <>
            {/* Timeline Line */}
            <div className="absolute left-[11px] top-2 bottom-8 w-px bg-white/[0.05]" />

            {history.map((record, i) => {
              const isExpanded = expandedId === record.id;
              
              return (
                <div key={record.id} className="relative pl-10 flex flex-col gap-2">
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 top-1.5 w-[22px] h-[22px] rounded-full ring-[6px] ring-bg z-10 flex items-center justify-center ${i === 0 ? 'bg-accent shadow-[0_0_15px_rgba(212,255,0,0.4)]' : 'bg-surface border border-white/10'}`}>
                    {i === 0 && <div className="w-2 h-2 bg-black rounded-full" />}
                  </div>
                  
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">{record.date}</span>
                  
                  <div 
                    onClick={() => setExpandedId(isExpanded ? null : record.id)}
                    className={`glass-card group transition-all duration-300 cursor-pointer overflow-hidden ${isExpanded ? 'border-accent/20 bg-accent/[0.02]' : 'bg-white/[0.01] border-white/[0.03] hover:border-accent/10'}`}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-xl font-black text-white">
                            {record.routineName}
                          </h3>
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">Status: Completed ✅</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-mono font-black text-white/40">{record.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest text-accent/40 mb-1">총 볼륨 (Volume)</span>
                          <span className="text-lg font-mono font-black text-accent">{record.totalVolume.toLocaleString()}kg</span>
                        </div>
                        <div className="flex-1 h-px bg-white/[0.03]" />
                        <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-accent/20 text-accent' : ''}`}>
                          <ChevronDown className="w-4 h-4 text-white/40" />
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/[0.03] bg-black/20"
                        >
                          <div className="p-6 space-y-6">
                            {record.exercises.map((ex, exIdx) => (
                              <div key={exIdx} className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-1 h-3 bg-accent/40 rounded-full" />
                                  <h4 className="text-sm font-black text-white/80">{ex.name}</h4>
                                  <span className="text-[10px] font-mono text-white/20 ml-auto">
                                    Total {ex.sets.reduce((acc, s) => acc + (s.weight * s.reps), 0).toLocaleString()}kg
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 gap-1.5 ml-3">
                                  {ex.sets.map((set, setIdx) => (
                                    <div key={setIdx} className="flex items-center justify-between text-[10px] font-mono py-1 border-b border-white/[0.02] last:border-0">
                                      <span className="text-white/20">SET {setIdx + 1}</span>
                                      <div className="flex gap-4">
                                        <span className="text-white/60">{set.weight}kg</span>
                                        <span className="text-accent/60">{set.reps}회</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </motion.div>
  );
}
