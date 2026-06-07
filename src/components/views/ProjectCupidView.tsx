import React from "react";
import { Icon } from "../ui/Icon";

interface DateMemory {
  title: string;
  rating: number;
  date: string;
}

interface ProjectCupidViewProps {
  dates: DateMemory[];
  setDates: React.Dispatch<React.SetStateAction<DateMemory[]>>;
  newDateTitle: string;
  setNewDateTitle: (val: string) => void;
  syncRating: number;
  setSyncRating: (val: number) => void;
  activeProfile: { id: string; role: string };
  publishEvent: (app: string, type: string, msg: string, payload?: any) => void;
  showNotification: (msg: string) => void;
}

export const ProjectCupidView: React.FC<ProjectCupidViewProps> = ({
  dates,
  setDates,
  newDateTitle,
  setNewDateTitle,
  syncRating,
  setSyncRating,
  activeProfile,
  publishEvent,
  showNotification,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDateTitle.trim()) return;

    const nextDate: DateMemory = {
      title: newDateTitle,
      rating: 5,
      date: new Date().toISOString().split("T")[0],
    };

    setDates((prev) => [nextDate, ...prev]);
    publishEvent("ProjectCupid", "milestone_add", `Added partnership milestone: ${newDateTitle}`);
    setNewDateTitle("");
    showNotification("Milestone memory committed!");
  };

  const isPartner = activeProfile.id === "razia-partner";

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
      
      {/* Central panel */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div>
          <span className="text-purple-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-1.5 block">Ecosystem Sync & Milestones</span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight font-display">Project Cupid</h2>
          <p className="text-xs text-slate-400">Track mutual milestones, plan joint dates, and model long-term connection goals.</p>
        </div>

        {/* PINNED WEDDING TIMELINE ACCENT WIDGET */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/20 via-slate-900/10 to-transparent border border-purple-500/20 p-5 rounded-2xl">
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
            <span className="text-[8px] font-bold text-purple-300">HIGH PRIORITY</span>
          </div>

          <div className="flex items-center gap-3.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400 border border-purple-500/20 shadow-md">
              <Icon name="Heart" size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">September 6th Wedding Countdown & Timeline</h3>
              <p className="text-[10px] text-slate-400">Cohesive milestones synchronized across system nodes.</p>
            </div>
          </div>

          {/* Quick wedding timeline list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-4 text-[11px]">
            <div className="p-3 rounded-xl bg-white/[0.01] border border-white/[0.03] space-y-1">
              <p className="font-extrabold text-white text-[10px] tracking-wide uppercase">Stage 1: Venue Lock</p>
              <p className="text-slate-400 text-[10px]">Caterer contracts & garden layouts reconciled.</p>
              <span className="inline-block text-[8px] font-bold text-green-400 uppercase bg-green-500/10 px-1.5 py-0.2 rounded mt-1">SUCCESS</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.01] border border-white/[0.03] space-y-1">
              <p className="font-extrabold text-white text-[10px] tracking-wide uppercase">Stage 2: Menu Select</p>
              <p className="text-slate-400 text-[10px]">Dial-a-Braai catering items cataloged.</p>
              <span className="inline-block text-[8px] font-bold text-green-400 uppercase bg-green-500/10 px-1.5 py-0.2 rounded mt-1">SUCCESS</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.01] border border-white/[0.03] space-y-1">
              <p className="font-extrabold text-white text-[10px] tracking-wide uppercase">Stage 3: Legal Sync</p>
              <p className="text-slate-400 text-[10px]">Registration forms, certificates index map.</p>
              <span className="inline-block text-[8px] font-bold text-purple-400 uppercase bg-purple-500/10 px-1.5 py-0.2 rounded mt-1">ON TARGET</span>
            </div>
          </div>
        </div>

        {/* LAW ASSIGNMENTS DOCUMENT SANDBOX WIDGET (Surfaces uniquely for Razia's profile but readable for colleagues) */}
        <div className="bg-white/[0.01] border border-white/[0.02] p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
              <Icon name="Briefcase" size={13} className="text-teal-400" />
              <span>Law Assignments Contract Sandbox</span>
            </h3>
            {isPartner && (
              <span className="text-[8.5px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 uppercase font-semibold">
                Razia Workspace
              </span>
            )}
          </div>
          
          <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
            Secure virtual drawer containing research outlines, legal drafts, and assignments indices sandbox.
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-900/60 border border-white/[0.03] rounded-xl hover:border-teal-500/20 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <Icon name="FileText" size={14} className="text-teal-400" />
                <div>
                  <p className="text-[11px] font-bold text-slate-200">Constitutional Law Research Draft.pdf</p>
                  <p className="text-[9px] text-slate-500 font-medium">Updated: 2 Hours Ago &middot; Size: 2.4 MB</p>
                </div>
              </div>
              <span className="text-[9px] text-teal-400 font-semibold bg-teal-400/5 px-2 py-0.5 rounded border border-teal-400/10">SECURE</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-900/60 border border-white/[0.03] rounded-xl hover:border-teal-500/20 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <Icon name="FileCode" size={14} className="text-teal-400" />
                <div>
                  <p className="text-[11px] font-bold text-slate-200">Contractual Agreement Annexures Index</p>
                  <p className="text-[9px] text-slate-500 font-medium">Updated: Yesterday &middot; Size: 18 KB</p>
                </div>
              </div>
              <span className="text-[9px] text-slate-500 font-semibold bg-white/5 px-2 py-0.5 rounded border border-white/5">ARCHIVED</span>
            </div>
          </div>
        </div>

        {/* Milestone memory post form */}
        <div className="bg-white/[0.01] border border-white/[0.02] p-5 rounded-2xl">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-3">Commit Partnership Memory Log</h3>
          <form onSubmit={handleSubmit} className="flex gap-2 text-xs">
            <input
              type="text"
              required
              value={newDateTitle}
              onChange={(e) => setNewDateTitle(e.target.value)}
              placeholder="e.g. Dinner date at Karoo Kitchen or laser tag session..."
              className="flex-1 bg-slate-900 border border-white/[0.05] rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/40"
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 text-white font-display font-medium px-5 rounded-xl cursor-pointer hover:scale-105 transition-all text-xs shrink-0"
            >
              Log Memory
            </button>
          </form>

          {/* Render historical memories */}
          <div className="mt-5 space-y-2 max-h-[160px] overflow-y-auto">
            {dates.map((d, index) => (
              <div key={index} className="bg-white/[0.01] border border-white/[0.02] p-3 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <p className="font-semibold text-white">{d.title}</p>
                  <p className="text-[9px] text-slate-500">Committed: {d.date}</p>
                </div>
                <div className="flex text-purple-400 font-mono text-[10px] items-center gap-1 bg-purple-500/5 px-2 py-0.5 rounded border border-purple-500/10">
                  <Icon name="Star" size={10} className="fill-purple-400" />
                  <span>Rating: {d.rating}/5</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right widgets panel */}
      <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/[0.02] flex flex-col justify-between">
        <div>
          <h3 className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">Ecosystem Calibrations</h3>
          
          <div className="p-5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center space-y-1">
            <p className="text-[10px] uppercase text-purple-400 font-medium">Sync Ratio Index</p>
            <p className="text-3xl font-black text-purple-300 font-display">{syncRating}%</p>
            {/* Standard range slider (pure HTML custom element, not broken) */}
            <div className="w-full flex items-center gap-2.5 pt-2">
              <input
                type="range"
                min="0"
                max="100"
                value={syncRating}
                onChange={(e) => setSyncRating(parseInt(e.target.value))}
                className="flex-1 accent-purple-500 cursor-pointer h-1 rounded bg-purple-950"
              />
              <span className="font-mono text-purple-400 font-bold text-[10px]">{syncRating}%</span>
            </div>
          </div>

          <div className="space-y-3 text-xs mt-6">
            <div className="flex justify-between border-b border-white/[0.03] pb-1.5 text-slate-400">
              <span>Primary Milestone</span>
              <span className="text-white font-semibold">Sept 6th Wedding</span>
            </div>
            <div className="flex justify-between border-b border-white/[0.03] pb-1.5 text-slate-400">
              <span>Daily Streak</span>
              <span className="text-white font-mono">14 Days</span>
            </div>
            <div className="flex justify-between border-b border-white/[0.03] pb-1.5 text-slate-400">
              <span>Anniversary Alert</span>
              <span className="text-cyan-400 font-semibold font-mono">Jul 12, 2026</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.03] text-[9.5px] text-slate-500">
          *Allows instant calibration adjustments. Dynamic contexts are evaluated on server-side daemon loops.
        </div>
      </div>
    </div>
  );
};
