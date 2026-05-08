import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ChevronRight, Timer, Coffee, RotateCcw, PartyPopper } from "lucide-react";
import { Routine, Exercise, SetInfo, WorkoutRecord } from "../types";
import { getRoutines } from "../lib/routineStore";
import { saveWorkout } from "../lib/historyStore";

export default function WorkoutSession() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [currentSetIdx, setCurrentSetIdx] = useState(0);
  
  const [isResting, setIsResting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  const [sessionTime, setSessionTime] = useState(0);
  const [restTime, setRestTime] = useState(120); // Default 120s rest

  const sessionInterval = useRef<any>(null);
  const restInterval = useRef<any>(null);

  useEffect(() => {
    if (id) {
      const found = getRoutines().find(r => r.id === id);
      if (found) setRoutine(found);
      else navigate("/");
    }
  }, [id]);

  // Session Clock
  useEffect(() => {
    sessionInterval.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => { if (sessionInterval.current) clearInterval(sessionInterval.current); };
  }, []);

  // Rest Clock
  useEffect(() => {
    if (isResting) {
      restInterval.current = setInterval(() => {
        setRestTime(prev => {
          if (prev <= 1) {
            handleCompleteRest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (restInterval.current) clearInterval(restInterval.current);
    }
    return () => { if (restInterval.current) clearInterval(restInterval.current); };
  }, [isResting]);

  const handleCompleteSet = () => {
    if (!routine) return;
    
    const currentEx = routine.exercises[currentExIdx];
    const isLastSetOfEx = currentSetIdx === currentEx.sets.length - 1;
    const isLastEx = currentExIdx === routine.exercises.length - 1;

    if (isLastSetOfEx && isLastEx) {
      // All exercises finished
      setIsFinished(true);
      if (sessionInterval.current) clearInterval(sessionInterval.current);

      // Save to history
      const totalVolume = routine.exercises.reduce((acc, ex) => {
        return acc + ex.sets.reduce((setAcc, set) => setAcc + (set.weight * set.reps), 0);
      }, 0);

      const record: WorkoutRecord = {
        id: Date.now().toString(),
        routineId: routine.id,
        routineName: routine.name,
        date: new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' }),
        time: formatTime(sessionTime),
        totalVolume,
        exercises: routine.exercises
      };
      
      saveWorkout(record);

      setTimeout(() => {
        navigate("/history");
      }, 3500);
    } else {
      setIsResting(true);
      setRestTime(60); // Reset rest timer to 60s
    }
  };

  const handleCompleteRest = () => {
    setIsResting(false);
    if (!routine) return;

    const currentEx = routine.exercises[currentExIdx];
    if (currentSetIdx < currentEx.sets.length - 1) {
      // Next Set
      setCurrentSetIdx(currentSetIdx + 1);
    } else {
      // Next Exercise or Finish
      if (currentExIdx < routine.exercises.length - 1) {
        setCurrentExIdx(currentExIdx + 1);
        setCurrentSetIdx(0);
      } else {
        // Finish Session
        navigate("/history");
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!routine) return null;

  const currentEx = routine.exercises[currentExIdx];
  const currentSet = currentEx?.sets[currentSetIdx];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-bg p-5 flex flex-col max-w-md mx-auto relative"
    >
      <AnimatePresence>
        {showExitConfirm && (
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
                <h3 className="text-xl font-black text-white">운동 중단</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  운동을 중단하시겠습니까?<br/>지금까지의 기록은 저장되지 않습니다.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
                >
                  계속하기
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 py-4 rounded-2xl bg-accent text-black font-black hover:brightness-110 transition-all"
                >
                  중단하기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex items-center justify-between mb-8">
        <button onClick={() => setShowExitConfirm(true)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/60">
            {isResting ? "휴식 중" : "세트 진행 중"}
          </span>
          <h1 className="text-lg font-black tracking-tight">{routine.name}</h1>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">전체 시간</span>
           <span className="font-mono font-bold text-sm tabular-nums text-white">{formatTime(sessionTime)}</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center gap-16 py-12">
        <AnimatePresence mode="wait">
          {isFinished ? (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-8"
            >
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-32 h-32 bg-accent rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(212,255,0,0.4)]"
              >
                <PartyPopper className="w-16 h-16 text-black" />
              </motion.div>
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-black tracking-tighter text-white">운동 완료!</h2>
                <p className="text-white/40 font-bold uppercase tracking-widest text-xs">수고하셨습니다. 기록을 저장 중입니다...</p>
              </div>
            </motion.div>
          ) : !isResting ? (
            <motion.div 
              key="work"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -10 }}
              className="w-full space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-black tracking-tighter text-white leading-tight">{currentEx.name}</h2>
                <div className="flex items-center justify-center gap-3">
                  <div className="bg-white/5 h-px flex-1 max-w-[40px]" />
                  <span className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-black text-accent uppercase tracking-[0.2em] border border-accent/20 shadow-lg shadow-accent/5">
                    {currentSetIdx + 1} / {currentEx.sets.length} SET
                  </span>
                  <div className="bg-white/5 h-px flex-1 max-w-[40px]" />
                </div>
              </div>

              {/* Weight & Reps */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-10 flex flex-col items-center gap-3 border-white/[0.03] bg-white/[0.01]">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">WEIGHT</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-6xl font-mono font-black tracking-tighter text-white">{currentSet.weight}</span>
                    <span className="text-sm font-black text-white/10 uppercase">kg</span>
                  </div>
                </div>
                <div className="glass-card p-10 flex flex-col items-center gap-3 border-accent/10 bg-accent/5">
                  <span className="text-[10px] font-black text-accent/40 uppercase tracking-[0.2em]">REPS</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-6xl font-mono font-black tracking-tighter text-accent">{currentSet.reps}</span>
                    <span className="text-sm font-black text-accent/20 uppercase">회</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="rest"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -10 }}
              className="flex flex-col items-center gap-10"
            >
              <div className="relative w-72 h-72 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-white/[0.02] rounded-full" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-t-4 border-accent rounded-full shadow-[0_0_20px_rgba(212,255,0,0.2)]" 
                />
                <div className="flex flex-col items-center gap-3">
                  <span className="text-8xl font-mono font-black tracking-tighter text-accent tabular-nums relative">
                    {restTime}
                    <span className="absolute -top-6 -right-6">
                      <Coffee className="w-8 h-8 text-white/10" />
                    </span>
                  </span>
                  <span className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase">휴식 중...</span>
                </div>
              </div>
              <div className="text-center w-full px-10 py-6 glass-card border-accent/20 bg-accent/5">
                <p className="text-[10px] text-accent/60 mb-2 font-black uppercase tracking-[0.2em]">NEXT MOVE</p>
                <p className="text-2xl font-black text-white tracking-tight">
                  {currentSetIdx < currentEx.sets.length - 1 
                    ? `${currentEx.name} ${currentSetIdx + 2}세트` 
                    : `${routine.exercises[currentExIdx + 1]?.name || '운동 종료'}`}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Overlay */}
      {!isFinished && (
        <footer className="mt-auto space-y-4 pb-6">
          {!isResting ? (
            <div className="flex gap-4">
              <button 
                onClick={handleCompleteSet}
                className="btn-primary flex-1 h-16 text-lg tracking-tight uppercase font-black shadow-xl shadow-accent/20 flex items-center justify-center gap-2"
              >
                <span>세트 완료</span>
                <CheckCircle2 className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <button 
                onClick={() => setRestTime(prev => prev + 15)}
                className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-white/40 group"
              >
                <RotateCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
              </button>
              <button 
                onClick={handleCompleteRest}
                className="flex-1 h-16 text-lg tracking-tight uppercase font-black bg-white text-black rounded-2xl hover:bg-white/90 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>휴식 건너뛰기</span>
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </footer>
      )}
    </motion.div>
  );
}
