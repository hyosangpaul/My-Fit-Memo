import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Edit2, Play, Trophy } from "lucide-react";
import { Routine } from "../types";
import { getRoutines } from "../lib/routineStore";

export default function RoutineViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [routine, setRoutine] = useState<Routine | null>(null);

  useEffect(() => {
    if (id) {
      const found = getRoutines().find((r) => r.id === id);
      if (found) setRoutine(found);
    }
  }, [id]);

  if (!routine) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="p-5 max-w-md mx-auto pb-32"
    >
      <header className="flex items-center justify-between mb-8 relative z-50">
        <button 
          onClick={() => navigate("/routine")} 
          className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          aria-label="뒤로 가기"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-black tracking-tight text-white">{routine.name}</h1>
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mt-1">
            업데이트: {new Date(routine.updatedAt).toLocaleDateString("ko-KR")}
          </p>
        </div>
        <button 
          onClick={() => navigate(`/routine/${id}/edit`)} 
          className="p-2 hover:bg-white/10 rounded-full text-white/20"
        >
          <Edit2 className="w-5 h-5" />
        </button>
      </header>

      <div className="space-y-4">
        {routine.exercises.map((ex) => (
          <div key={ex.id} className="glass-card p-6 overflow-hidden relative border-white/5 bg-white/[0.01]">
            <h3 className="text-lg font-black mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-accent rounded-full" />
              {ex.name}
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {ex.sets.map((set, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/[0.03] px-4 py-3.5 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-white/20 w-8">#{idx + 1}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-mono font-black text-white/80">{set.weight}</span>
                      <span className="text-[10px] text-white/30 font-bold uppercase">kg</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-mono font-black text-accent">{set.reps}</span>
                    <span className="text-[10px] text-accent/60 font-bold tracking-tighter uppercase">reps</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {routine.exercises.length === 0 && (
          <div className="text-center py-20 opacity-20 italic">설정된 운동이 없습니다.</div>
        )}
      </div>

      {/* Floating Start Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-5">
        <button 
          onClick={() => navigate(`/session/${id}`)}
          className="btn-primary w-full shadow-2xl shadow-accent/20 py-5 text-lg font-black uppercase tracking-tight flex items-center justify-center gap-2"
        >
          <span>운동 시작하기</span>
          <Play className="w-5 h-5 fill-current" />
        </button>
      </div>
    </motion.div>
  );
}
