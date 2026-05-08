import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Dumbbell } from "lucide-react";
import { Routine } from "../types";
import { getRoutines } from "../lib/routineStore";

export default function RoutineSelectionPage() {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    setRoutines(getRoutines());
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-5 max-w-md mx-auto"
    >
      <header className="flex items-center gap-4 mb-8 relative z-50">
        <button 
          onClick={() => navigate("/")} 
          className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          aria-label="뒤로 가기"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-black tracking-tight text-white">수행할 루틴 선택</h1>
      </header>

      <div className="space-y-3">
        {routines.map((routine) => (
          <motion.div
            key={routine.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/session/${routine.id}`)}
            className="glass-card p-5 flex items-center justify-between cursor-pointer border-white/5 hover:border-accent/30 group bg-white/[0.01] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-2xl text-white/20 group-hover:text-accent group-hover:bg-accent/5 transition-all">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black group-hover:text-white transition-colors">{routine.name}</span>
                <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.15em]">{routine.exercises.length} 종목 구성</span>
              </div>
            </div>
            <div className="bg-accent/10 p-2 rounded-full text-accent opacity-30 group-hover:opacity-100 transition-opacity">
              <Play className="w-5 h-5 fill-current" />
            </div>
          </motion.div>
        ))}

        {routines.length === 0 && (
          <div className="text-center py-20 bg-white/[0.01] rounded-3xl border border-dashed border-white/5">
            <p className="text-sm opacity-20 italic mb-6">등록된 루틴이 없습니다.</p>
            <button 
              onClick={() => navigate("/routine/new/edit")}
              className="px-6 py-4 bg-white/5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
              새 루틴 만들러 가기
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
