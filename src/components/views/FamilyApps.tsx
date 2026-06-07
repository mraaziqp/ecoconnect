import React from "react";
import { Icon } from "../ui/Icon";

interface Notice {
  id: string;
  author: string;
  color: string;
  text: string;
  date: string;
}

interface FamilyAppsProps {
  appId: "deenify" | "familyverse" | "familytree";
  dhikrCount: number;
  setDhikrCount: React.Dispatch<React.SetStateAction<number>>;
  dhikrTarget: string;
  setDhikrTarget: (val: string) => void;
  prayerTimes: Record<string, string>;
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
  newNoticeText: string;
  setNewNoticeText: (val: string) => void;
  selectedAncestor: string;
  setSelectedAncestor: (val: string) => void;
  activeProfileName: string;
  activeProfileId: string;
  publishEvent: (app: string, type: string, msg: string, payload?: any) => void;
  showNotification: (msg: string) => void;
}

export const FamilyApps: React.FC<FamilyAppsProps> = ({
  appId,
  dhikrCount,
  setDhikrCount,
  dhikrTarget,
  setDhikrTarget,
  prayerTimes,
  notices,
  setNotices,
  newNoticeText,
  setNewNoticeText,
  selectedAncestor,
  setSelectedAncestor,
  activeProfileName,
  activeProfileId,
  publishEvent,
  showNotification,
}) => {
  if (appId === "deenify") {
    return (
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div>
            <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-1.5 block">Spiritual Compass & Almanac</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight font-display">Deenify</h2>
            <p className="text-xs text-slate-400">Calculate local prayer times coordinate metrics, advance Dhikr counts, and track community logs.</p>
          </div>

          <div className="bg-white/[0.01] border border-white/[0.02] py-8 px-6 rounded-2xl flex flex-col items-center justify-center gap-6 text-center">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Select Active Target affirmation</span>
            <div className="flex flex-wrap gap-2 justify-center text-xs">
              {["SubhanAllah", "Alhamdulillah", "AllahuAkbar"].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setDhikrTarget(t);
                    setDhikrCount(0);
                    showNotification(`Affirmation set to ${t}`);
                  }}
                  className={`px-3.5 py-1.5 rounded-full font-bold uppercase text-[9px] tracking-wider transition-colors border cursor-pointer ${
                    dhikrTarget === t 
                      ? "bg-cyan-500/10 border-cyan-400 text-cyan-300" 
                      : "bg-white/[0.01] border-white/[0.03] text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Render Large Number using standard non-mono typography */}
            <div className="text-5xl lg:text-7xl font-sans font-black text-cyan-350 py-4 select-none leading-none tracking-tight">
              {dhikrCount}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  const nextCount = dhikrCount + 1;
                  setDhikrCount(nextCount);
                  if (nextCount === 33 || nextCount === 100) {
                    publishEvent("Deenify", "dhikr_completed", `Completed a dynamic cycle: ${dhikrTarget} (Count: ${nextCount})`);
                    showNotification(`Completed cycle for: ${dhikrTarget}!`);
                  }
                }}
                className="bg-gradient-to-r from-cyan-400 to-teal-500 text-slate-950 font-bold font-display px-8 py-3 rounded-xl uppercase text-[10px] tracking-wider hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-cyan-400/20 cursor-pointer"
              >
                Increment Counter
              </button>
              <button
                onClick={() => {
                  setDhikrCount(0);
                  showNotification("Affirmation count reset.");
                }}
                className="bg-white/[0.02] border border-white/[0.04] text-[10px] tracking-wider uppercase font-bold text-slate-400 hover:text-white px-5 rounded-xl cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Prayer times schedule widget */}
        <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/[0.02] flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Calculation Schedule</h3>
            <div className="space-y-2.5 text-xs">
              {Object.entries(prayerTimes).map(([name, time]) => (
                <div key={name} className="flex justify-between items-center border-b border-white/[0.02] pb-2">
                  <span className="text-slate-400 font-medium">{name}</span>
                  <span className="text-cyan-400 font-bold">{time}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-white/[0.03] text-[9.5px] text-slate-500 leading-relaxed">
            *Prayer schedules computed using standard high-latitude formulas. Calibrates with central coordinates automatically.
          </div>
        </div>
      </div>
    );
  }

  if (appId === "familyverse") {
    return (
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div>
            <span className="text-purple-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-1.5 block">Bulletin Noticeboard & Event Sync</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight font-display">Familyverse</h2>
            <p className="text-xs text-slate-400">Attach sticky notices, coordinate upcoming family events, and synchronize secure calendars.</p>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newNoticeText.trim()) return;
              const post = {
                id: Math.random().toString(),
                author: activeProfileName,
                color: activeProfileId === "dev-master" ? "from-cyan-500/10 to-cyan-900/5" : "from-purple-500/10 to-purple-900/5",
                text: newNoticeText,
                date: new Date().toISOString().split("T")[0],
              };
              setNotices((prev) => [post, ...prev]);
              publishEvent("Familyverse", "notice_board_posted", `Stickie bulletin uploaded by ${activeProfileName}`, { text: newNoticeText });
              setNewNoticeText("");
              showNotification("Notice dispatched!");
            }}
            className="bg-white/[0.01] border border-white/[0.02] p-4 rounded-xl flex gap-3 text-xs"
          >
            <input
              type="text"
              required
              value={newNoticeText}
              onChange={(e) => setNewNoticeText(e.target.value)}
              placeholder="Post a secure sticky message on the whiteboard..."
              className="flex-1 bg-slate-900 border border-white/[0.05] rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold font-display px-5 rounded-xl uppercase text-[10px] tracking-wider transition-colors cursor-pointer shrink-0"
            >
              Pin Post
            </button>
          </form>

          {/* Whiteboard notices list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notices.map((post) => (
              <div key={post.id} className={`bg-gradient-to-br ${post.color} border border-white/[0.03] p-5 rounded-2xl flex flex-col justify-between min-h-[120px] shadow-sm`}>
                <p className="text-xs text-slate-200 leading-relaxed italic">"{post.text}"</p>
                <div className="flex justify-between items-center text-[9px] text-slate-500 pt-3 border-t border-white/[0.02] mt-4 font-sans font-medium">
                  <span className="font-extrabold text-white uppercase">{post.author}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar notifications */}
        <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/[0.02] flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Upcoming Events</h3>
            <div className="space-y-3 leading-tight text-xs text-slate-400">
              <div className="bg-white/[0.01] p-3.5 rounded-xl border border-white/[0.02]">
                <p className="font-bold text-slate-200 text-xs mb-1">Weekend Braai Masterclass</p>
                <p className="text-[10px] text-slate-500">Saturday at 18:00 &bull; Dial-a-Braai deck</p>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-white/[0.03] text-[9.5px] text-slate-500">
            *Family events are synced under encrypted data matrices. Backups occur daily.
          </div>
        </div>
      </div>
    );
  }

  // FAMILYTREE: ANCESTRAL LINAGE TRAVERSAL
  const getNarrativeBySelected = (id: string) => {
    switch (id) {
      case "grand_father":
        return {
          title: "Ebrahim's Narrative Line",
          text: "Rooted in vibrant coastal traditions, pioneering trade routes, transport grids, and local merchant networks in South Africa."
        };
      case "father":
        return {
          title: "Sulaiman's Directive Guidelines",
          text: "Pioneered mechanical system operations, high-precision tuning, and spiritual compass metrics, passing down standard engineering persistency."
        };
      case "mother":
        return {
          title: "Safiyya's Heritage Chronicles",
          text: "Maintained rich ancestral journals, documenting family botany records, culinary compass catalogs, and spiritual Dhikr grids."
        };
      default:
        return { title: "Heritage Archive", text: "Select a node on the ancestral chart map." };
    }
  };

  const currentNarrative = getNarrativeBySelected(selectedAncestor);

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div>
          <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-1.5 block">Heritage Directory Chart Node Map</span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight font-display">Familytree Ancestres</h2>
          <p className="text-xs text-slate-400">Traverse traditional ancestral roots, explore lineage narratives, and link heritage nodes.</p>
        </div>

        {/* Tree Render */}
        <div className="bg-white/[0.01] border border-white/[0.02] px-6 py-10 rounded-2xl flex flex-col items-center gap-6 relative min-h-[300px] justify-center">
          
          {/* Grandfather */}
          <div
            onClick={() => {
              setSelectedAncestor("grand_father");
              showNotification("Paternal lineage loaded.");
            }}
            className={`px-5 py-3 rounded-2xl border text-center transition-all cursor-pointer ${
              selectedAncestor === "grand_father" 
                ? "bg-cyan-500/10 border-cyan-400 text-cyan-300" 
                : "bg-white/[0.01] border-white/[0.03] text-slate-400 hover:border-slate-700 hover:text-white"
            }`}
          >
            <p className="font-extrabold text-xs">Ebrahim (Grandfather)</p>
            <p className="text-[8.5px] text-slate-500 font-mono mt-0.5">PATERNAL INDEX ORIGIN</p>
          </div>

          <div className="w-[1.5px] h-8 bg-white/[0.04]" />

          {/* Parents row */}
          <div className="flex flex-wrap gap-8 justify-center items-center">
            <div
              onClick={() => {
                setSelectedAncestor("father");
                showNotification("Father lineage synced.");
              }}
              className={`px-5 py-3 rounded-2xl border text-center transition-all cursor-pointer ${
                selectedAncestor === "father" 
                  ? "bg-cyan-500/10 border-cyan-400 text-cyan-300" 
                  : "bg-white/[0.01] border-white/[0.03] text-slate-400 hover:border-slate-700 hover:text-white"
              }`}
            >
              <p className="font-extrabold text-xs flex items-center gap-1.5 justify-center">
                <span>Sulaiman (Father)</span>
              </p>
              <p className="text-[8.5px] text-slate-500 font-mono mt-0.5">DIRECT CONNECTOR PATH</p>
            </div>

            <div
              onClick={() => {
                setSelectedAncestor("mother");
                showNotification("Maternal lineage synced.");
              }}
              className={`px-5 py-3 rounded-2xl border text-center transition-all cursor-pointer ${
                selectedAncestor === "mother" 
                  ? "bg-cyan-500/10 border-cyan-400 text-cyan-300" 
                  : "bg-white/[0.01] border-white/[0.03] text-slate-400 hover:border-slate-700 hover:text-white"
              }`}
            >
              <p className="font-extrabold text-xs">Safiyya (Mother)</p>
              <p className="text-[8.5px] text-slate-500 font-mono mt-0.5">MATERNAL BRANCH PATH</p>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative block */}
      <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/[0.02] flex flex-col justify-between">
        <div className="space-y-4">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Selected Biography Chronicle</h3>
          
          <div className="p-5 border border-white/[0.02] bg-slate-950 rounded-xl space-y-2">
            <p className="font-bold text-slate-200 text-xs uppercase tracking-wide">{currentNarrative.title}</p>
            <p className="text-slate-400 leading-relaxed text-[11px] font-sans">
              {currentNarrative.text}
            </p>
          </div>
        </div>
        <div className="pt-4 border-t border-white/[0.03] text-[9.5px] text-slate-500 font-sans leading-relaxed">
          *Biography logs are retrieved using verified family accounts directory. Core records cataloged securely.
        </div>
      </div>
    </div>
  );
};
