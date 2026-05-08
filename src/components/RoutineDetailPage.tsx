import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Plus, Save, Trash2, X, ChevronDown, ChevronUp, Dumbbell } from "lucide-react";
import { Routine, Exercise, SetInfo } from "../types";
import { getRoutines, updateRoutine, addRoutine } from "../lib/routineStore";

export default function RoutineDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [routine, setRoutine] = useState<Routine>({
    id: isNew ? crypto.randomUUID() : "",
    name: "",
    exercises: [],
    updatedAt: Date.now(),
  });

  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [editingSet, setEditingSet] = useState<{ exId: string; setIdx: number; weight: number; reps: number } | null>(null);
  const [showExerciseAlert, setShowExerciseAlert] = useState(false);
  const [newExName, setNewExName] = useState("");
  const [newExWeight, setNewExWeight] = useState(20);
  const [newExSets, setNewExSets] = useState(3);

  useEffect(() => {
    if (!isNew && id) {
      const found = getRoutines().find((r) => r.id === id);
      if (found) setRoutine(found);
    }
  }, [id, isNew]);

  const handleSave = () => {
    const finalName = routine.name.trim() || "제목 없음";
    const finalRoutine = { ...routine, name: finalName };

    if (finalRoutine.exercises.length === 0) {
      setShowExerciseAlert(true);
      return;
    }

    if (isNew) {
      addRoutine(finalRoutine);
      navigate("/routine");
    } else {
      updateRoutine(finalRoutine);
      navigate(`/routine/${finalRoutine.id}`);
    }
  };

  const addExercise = () => {
    if (!newExName.trim()) return;

    // 적용: 세트마다 5kg씩 자동 증량
    const sets: SetInfo[] = Array.from({ length: newExSets }, (_, i) => ({
      weight: newExWeight + i * 5,
      reps: 10,
    }));

    const newExercise: Exercise = {
      id: crypto.randomUUID(),
      name: newExName,
      sets,
    };

    setRoutine({
      ...routine,
      exercises: [...routine.exercises, newExercise],
    });
    setNewExName("");
    setIsAddingExercise(false);
  };

  const saveEditedSet = () => {
    if (!editingSet) return;
    setRoutine({
      ...routine,
      exercises: routine.exercises.map((ex) =>
        ex.id === editingSet.exId
          ? {
              ...ex,
              sets: ex.sets.map((s, i) =>
                i === editingSet.setIdx ? { weight: editingSet.weight, reps: editingSet.reps } : s
              ),
            }
          : ex
      ),
    });
    setEditingSet(null);
  };

  const deleteExercise = (exId: string) => {
    setRoutine({
      ...routine,
      exercises: routine.exercises.filter((ex) => ex.id !== exId),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-5 max-w-md mx-auto pb-32 relative"
    >
      {/* Alert Modal */}
      <AnimatePresence>
        {showExerciseAlert && (
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
                <Dumbbell className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-black text-white">종목 누락</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  수행 종목을 생성해주세요.<br/>최소 한 개의 운동이 필요합니다.
                </p>
              </div>
              <button
                onClick={() => setShowExerciseAlert(false)}
                className="w-full py-4 rounded-2xl bg-accent text-black font-black hover:brightness-110 transition-all"
              >
                확인
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex items-center justify-between mb-8 relative z-50">
        <button 
          onClick={() => navigate("/routine")} 
          className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          aria-label="뒤로 가기"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-black tracking-tight text-white">{isNew ? "신규 루틴" : "루틴 수정"}</h1>
        <button onClick={handleSave} className="p-1 px-3 bg-accent/10 text-accent rounded-full hover:bg-accent/20 transition-colors flex items-center gap-1.5 border border-accent/20">
          <Save className="w-4 h-4" />
          <span className="text-xs font-bold">저장</span>
        </button>
      </header>

      <div className="space-y-8">
        {/* Routine Name Input */}
        <div className="flex flex-col gap-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">루틴 이름</label>
          <input
            type="text"
            value={routine.name}
            onChange={(e) => setRoutine({ ...routine, name: e.target.value })}
            placeholder="하체 운동 루틴"
            className="w-full bg-white/[0.02] border border-white/[0.05] shadow-inner rounded-3xl p-6 text-2xl font-black focus:border-accent/40 focus:bg-white/[0.04] outline-none transition-all placeholder:text-white/5"
          />
        </div>

        {/* Exercises List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">수행 종목 ({routine.exercises.length})</h2>
          </div>

          <div className="flex flex-col gap-4">
            {routine.exercises.map((ex) => (
              <div key={ex.id} className="glass-card p-6 border-white/[0.03] bg-white/[0.01]">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-accent rounded-full" />
                    <h3 className="text-xl font-black text-white">{ex.name}</h3>
                  </div>
                  <button onClick={() => deleteExercise(ex.id)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-2xl text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {ex.sets.map((set, idx) => (
                    <motion.div 
                      key={idx} 
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setEditingSet({ exId: ex.id, setIdx: idx, ...set })}
                      className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl cursor-pointer hover:bg-white/[0.08] transition-all border border-transparent hover:border-white/5 group"
                    >
                      <span className="text-[10px] font-black text-white/20 w-8 group-hover:text-accent/60 transition-colors">SET {idx + 1}</span>
                      <div className="flex-1 flex items-baseline gap-1.5">
                        <span className="text-2xl font-mono font-black">{set.weight}</span>
                        <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">kg</span>
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-mono font-black text-accent">{set.reps}</span>
                        <span className="text-[10px] text-accent/40 font-bold tracking-widest uppercase">reps</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsAddingExercise(true)}
          className="w-full py-8 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center gap-3 text-white/20 hover:text-accent hover:border-accent/20 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-accent/10 transition-all">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">새 운동 종목 추가</span>
        </button>
      </div>

      {/* Edit Set Modal */}
      <AnimatePresence>
        {editingSet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingSet(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-surface p-8 rounded-[2.5rem] border border-white/10 space-y-8 shadow-2xl"
            >
              <div className="text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Set Info</span>
                <h3 className="text-2xl font-black mt-2 text-white">{editingSet.setIdx + 1}번 세트 수정</h3>
              </div>

              <div className="space-y-10">
                {/* Weight Control */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/30 text-center block uppercase tracking-[0.2em]">무게 (kg)</label>
                  <div className="flex items-center justify-between gap-4">
                    <button 
                      onClick={() => setEditingSet({...editingSet, weight: Math.max(0, editingSet.weight - 5)})}
                      className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-xl font-black hover:bg-white/10 active:scale-90 transition-all text-white/40"
                    >
                      -5
                    </button>
                    <div className="flex-1 text-center">
                      <span className="text-6xl font-mono font-black tracking-tighter text-white">{editingSet.weight}</span>
                    </div>
                    <button 
                      onClick={() => setEditingSet({...editingSet, weight: editingSet.weight + 5})}
                      className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-xl font-black hover:bg-accent/20 active:scale-90 transition-all text-accent"
                    >
                      +5
                    </button>
                  </div>
                </div>

                {/* Reps Control */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/30 text-center block uppercase tracking-[0.2em]">반복 횟수 (Reps)</label>
                  <div className="flex items-center justify-between gap-4">
                    <button 
                      onClick={() => setEditingSet({...editingSet, reps: Math.max(1, editingSet.reps - 1)})}
                      className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-xl font-black hover:bg-white/10 active:scale-90 transition-all text-white/40"
                    >
                      -1
                    </button>
                    <div className="flex-1 text-center">
                      <span className="text-6xl font-mono font-black tracking-tighter text-accent">{editingSet.reps}</span>
                    </div>
                    <button 
                      onClick={() => setEditingSet({...editingSet, reps: editingSet.reps + 1})}
                      className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-xl font-black hover:bg-accent/20 active:scale-90 transition-all text-accent"
                    >
                      +1
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setEditingSet(null)} className="flex-1 py-5 text-sm font-black text-white/30 uppercase tracking-widest">취소</button>
                  <button onClick={saveEditedSet} className="btn-primary flex-1 py-5 text-sm shadow-xl shadow-accent/20">수정 완료</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Exercise Modal */}
      <AnimatePresence>
        {isAddingExercise && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingExercise(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-md bg-surface p-8 rounded-t-[3rem] border-t border-white/10 space-y-8 shadow-2xl pb-12"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-white">운동 종목 추가</h3>
                <button onClick={() => setIsAddingExercise(false)} className="p-2 bg-white/5 rounded-full">
                  <X className="w-5 h-5 text-white/40" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">운동 이름</label>
                  <input
                    type="text"
                    value={newExName}
                    onChange={(e) => setNewExName(e.target.value)}
                    placeholder="예: 스쿼트, 벤치프레스"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 font-bold outline-none focus:border-accent/40 placeholder:text-white/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">시작 무게 (kg)</label>
                    <input
                      type="number"
                      value={newExWeight}
                      onChange={(e) => setNewExWeight(Number(e.target.value))}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 font-mono font-black outline-none focus:border-accent"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">세트 수</label>
                    <input
                      type="number"
                      value={newExSets}
                      onChange={(e) => setNewExSets(Number(e.target.value))}
                      min="1"
                      max="10"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 font-mono font-black outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="p-4 bg-accent/10 rounded-2xl border border-accent/20">
                  <p className="text-[10px] text-accent font-bold leading-relaxed">* 등록 시 세트마다 5kg씩 자동 증량되어 설정됩니다.</p>
                </div>

                <button onClick={addExercise} className="btn-primary w-full py-5 text-lg shadow-xl shadow-accent/20">
                  리스트에 추가
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>

  );
}
