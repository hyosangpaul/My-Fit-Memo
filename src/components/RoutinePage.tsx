import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, ChevronRight, MoreVertical, Copy, Edit2, Trash2, Dumbbell } from "lucide-react";
import { Routine } from "../types";
import { getRoutines, addRoutine, deleteRoutine } from "../lib/routineStore";

export default function RoutinePage() {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    setRoutines(getRoutines());
  }, []);

  const handleCopy = (routine: Routine) => {
    const newRoutine: Routine = {
      ...routine,
      id: crypto.randomUUID(),
      name: `${routine.name} (복사본)`,
      updatedAt: Date.now(),
    };
    addRoutine(newRoutine);
    setRoutines(getRoutines());
    setActiveMenu(null);
  };

  const handleDelete = () => {
    if (deleteTargetId) {
      deleteRoutine(deleteTargetId);
      setRoutines(getRoutines());
      setDeleteTargetId(null);
      setActiveMenu(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-5 max-w-md mx-auto pb-32 relative"
    >
      <AnimatePresence>
        {deleteTargetId && (
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
                <Trash2 className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-black text-white">루틴 삭제</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  이 루틴을 삭제하시겠습니까?<br/>삭제된 루틴은 복구할 수 없습니다.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTargetId(null)}
                  className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-black hover:brightness-110 transition-all"
                >
                  삭제
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex items-center justify-between mb-8 relative z-50">
        <button 
          onClick={() => navigate("/")} 
          className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          aria-label="뒤로 가기"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-black tracking-tight text-white">나의 루틴</h1>
        <button 
          onClick={() => navigate("/routine/new/edit")}
          className="p-2 bg-accent text-black rounded-xl hover:scale-110 active:scale-95 transition-transform shadow-lg shadow-accent/20"
        >
          <Plus className="w-6 h-6" />
        </button>
      </header>

      <div className="flex flex-col gap-4">
        {routines.length === 0 ? (
          <div className="text-center py-20 opacity-20">
            <Dumbbell className="w-14 h-14 mx-auto mb-6 opacity-10" />
            <p className="text-sm font-medium">등록된 루틴이 없습니다.<br/>'+' 버튼을 눌러 추가하세요.</p>
          </div>
        ) : (
          routines.map((routine) => (
            <div key={routine.id} className="relative">
              <div 
                onClick={() => navigate(`/routine/${routine.id}`)}
                className="glass-card p-6 flex items-center justify-between group hover:border-accent/10 transition-all cursor-pointer bg-white/[0.01]"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-black group-hover:text-accent transition-colors">{routine.name}</h3>
                  <div className="flex items-center gap-3 text-[10px] font-black text-white/20 uppercase tracking-widest whitespace-nowrap">
                    <span className="bg-white/5 px-2.5 py-1 rounded-lg text-white/40">{routine.exercises.length} 종목</span>
                    <span>{new Date(routine.updatedAt).toLocaleDateString("ko-KR")}</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === routine.id ? null : routine.id);
                  }}
                  className="p-3 hover:bg-white/5 rounded-2xl transition-colors z-10"
                >
                  <MoreVertical className="w-5 h-5 text-white/20" />
                </button>
              </div>

              {/* Float Menu */}
              <AnimatePresence>
                {activeMenu === routine.id && (
                  <>
                    <div 
                      className="fixed inset-0 z-20" 
                      onClick={() => setActiveMenu(null)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      className="absolute right-12 top-6 bg-surface border border-white/10 p-2 rounded-xl shadow-2xl z-30 min-w-[120px]"
                    >
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleCopy(routine); }}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg text-sm text-white/80"
                      >
                        <Copy className="w-4 h-4" /> 복사
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/routine/${routine.id}/edit`); }}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg text-sm text-white/80"
                      >
                        <Edit2 className="w-4 h-4" /> 수정
                      </button>
                      <div className="my-1 border-t border-white/5" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); setDeleteTargetId(routine.id); }}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-500/10 rounded-lg text-sm text-red-400"
                      >
                        <Trash2 className="w-4 h-4" /> 삭제
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      {routines.length > 0 && (
        <div 
          onClick={() => navigate("/routine/new/edit")}
          className="mt-12 p-8 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center gap-4 hover:border-accent/20 cursor-pointer group transition-colors"
        >
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/20 group-hover:text-accent group-hover:bg-accent/5 transition-all">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white/60">새 루틴 추가하기</h4>
            <p className="text-sm text-white/30">자신에게 맞는 운동 조합을 만드세요</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
