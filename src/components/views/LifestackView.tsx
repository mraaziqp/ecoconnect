import React from "react";
import { Icon } from "../ui/Icon";

interface Habit {
  id: string;
  text: string;
  done: boolean;
}

interface LifestackViewProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  publishEvent: (app: string, type: string, msg: string, payload?: any) => void;
  showNotification: (msg: string) => void;
}

export const LifestackView: React.FC<LifestackViewProps> = ({
  habits,
  setHabits,
  publishEvent,
  showNotification,
}) => {
  const toggleHabit = (id: string, text: string, currentDone: boolean) => {
    const updated = habits.map((h) =>
      h.id === id ? { ...h, done: !h.done } : h
    );
    setHabits(updated);
    publishEvent("Lifestack", "habit_toggle", `Toggled routine checklist event: ${text}`, { text, state: !currentDone });
    showNotification("Bio-routine metrics recompiled!");
  };

  const doneCount = habits.filter((h) => h.done).length;
  const percentage = Math.round((doneCount / habits.length) * 100);

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div>
          <span className="text-purple-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-1.5 block">Bio-feedback & Core Routines compiles</span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight font-display">Lifestack</h2>
          <p className="text-xs text-slate-400">Manage stacked high-efficiency routines, bio-metric checks, and daily focus thresholds.</p>
        </div>

        {/* Habits list */}
        <div className="space-y-2.5">
          {habits.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleHabit(item.id, item.text, item.done)}
              className="bg-white/[0.01] border border-white/[0.02] hover:bg-white/[0.02] hover:border-purple-500/20 p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors border ${
                  item.done 
                    ? "bg-purple-500 border-purple-500 text-slate-950" 
                    : "border-white/20 bg-transparent"
                }`}>
                  {item.done && <Icon name="Check" size={12} className="stroke-[3]" />}
                </div>
                <span className={`text-xs font-semibold select-none ${item.done ? "line-through text-slate-500" : "text-white"}`}>
                  {item.text}
                </span>
              </div>
              <Icon name="Layers" size={13} className={item.done ? "text-purple-500/40" : "text-slate-600"} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/[0.02] flex flex-col justify-between">
        <div className="space-y-6">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Completeness Summary</h3>
          
          <div className="flex flex-col items-center justify-center p-6 bg-slate-950 border border-white/[0.02] rounded-xl text-center space-y-2">
            <span className="text-3xl font-black text-purple-300 font-display">{percentage}%</span>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Metrics Achieved</p>
          </div>

          <div className="space-y-2 text-center text-xs text-slate-400">
            <p className="italic leading-relaxed text-[11px]">
              "Feed active daily routine items fully to satisfy downstream productivity monitors."
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.03] text-[9.5px] text-slate-500">
          *Habit matrices are handled securely within sandbox containers. Telemetry logged perpetually.
        </div>
      </div>
    </div>
  );
};
