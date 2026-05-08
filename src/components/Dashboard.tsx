import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { History, Play, ClipboardList, ChevronRight } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "start",
      title: "운동 시작",
      description: "지금 바로 한계를 돌파하세요",
      icon: <Play className="w-6 h-6 fill-current" />,
      path: "/select-routine",
      color: "bg-accent/20 text-accent border-accent/30",
    },
    {
      id: "history",
      title: "운동 기록",
      description: "당신의 땀방울이 기록된 타임라인",
      icon: <History className="w-6 h-6" />,
      path: "/history",
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    },
    {
      id: "routine",
      title: "나의 루틴",
      description: "효율적인 운동을 위한 커스텀 세팅",
      icon: <ClipboardList className="w-6 h-6" />,
      path: "/routine",
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-5 max-w-md mx-auto pt-16 pb-24 min-h-screen flex flex-col justify-center"
    >
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black italic tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          Fit<span className="text-accent">-</span>Memo
        </h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-4">Simple Workout Tracker</p>
      </div>

      <div className="flex flex-col gap-4">
        {menuItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(item.path)}
            className={`cursor-pointer glass-card border-white/[0.05] p-6 flex flex-col gap-4 relative overflow-hidden group transition-all duration-300 ${item.color}`}
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center ring-1 ring-white/10 group-hover:scale-110 group-hover:bg-accent/10 group-hover:text-accent transition-all duration-500">
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-white group-hover:translate-x-1 transition-transform">{item.title}</h3>
                <p className="text-white/40 text-xs mt-1 leading-tight">{item.description}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all">
                <ChevronRight className="w-4 h-4 text-white/40" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
