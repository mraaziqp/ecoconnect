import React from "react";
import { Icon } from "../ui/Icon";

interface Platter {
  id: string;
  name: string;
  price: number;
  stock: string;
}

interface HustleStudioViewProps {
  platters: Platter[];
  showNotification: (msg: string) => void;
}

export const HustleStudioView: React.FC<HustleStudioViewProps> = ({ platters, showNotification }) => {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div>
          <span className="text-amber-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-1.5 block">Hardware Diagnoses & Free Projects Desk</span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight font-display">Hustle Studio</h2>
          <p className="text-xs text-slate-400">Review menu platters order books, manage local computer hardware fixes, and request custom web forge projects.</p>
        </div>

        <div className="space-y-4">
          {/* Dial-a-Braai */}
          <div className="bg-white/[0.01] p-5 border border-white/[0.02] rounded-2xl">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400 shadow-sm">
                <Icon name="Flame" size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-orange-400 uppercase tracking-widest leading-tight">Dial-a-Braai Catering Menu Hub</p>
                <p className="text-[10px] text-slate-500 font-medium">Bespoke wood-fired Karoo meats order pipeline.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
              {platters.map((item) => (
                <div
                  key={item.id}
                  onClick={() => showNotification(`Added ${item.name} order to system dispatch pipeline.`)}
                  className="bg-white/[0.01] border border-white/[0.02] hover:border-orange-500/30 p-4 rounded-xl space-y-2 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <p className="font-extrabold text-white text-[11px] leading-snug">{item.name}</p>
                  <p className="text-[10px] text-orange-400 font-mono font-bold leading-none">R {item.price}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-bold leading-none ${
                      item.stock === "Available" ? "bg-green-500/10 text-green-400 border border-green-500/10" : "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                    }`}>
                      {item.stock}
                    </span>
                    <Icon name="Plus" size={10} className="text-slate-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.01] border border-white/[0.02] p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
              <Icon name="Server" size={13} className="text-cyan-400" />
              <span>Diagnostic Hardware Repairs Desk & Web Forge</span>
            </h3>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Hardware diagnostic logging, repair ticket assignments, and custom web forge templates layout staging area.
            </p>
            <div className="pt-2">
              <button
                onClick={() => showNotification("Hardware Repair Database logs scanned successfully.")}
                className="bg-white/[0.02] border border-white/[0.04] text-xs hover:border-cyan-400 text-slate-300 hover:text-white px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Scan Repair Tickets
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Side tracker */}
      <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/[0.02] flex flex-col justify-between">
        <div>
          <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4">Sandbox Metrics</h3>
          <div className="p-4 bg-slate-950 border border-white/[0.02] rounded-xl space-y-2.5 text-xs text-slate-400">
            <div className="flex justify-between border-b border-white/[0.02] pb-1.5">
              <span>Catering Target</span>
              <span className="text-white font-medium">Pre-orders active</span>
            </div>
            <div className="flex justify-between border-b border-white/[0.02] pb-1.5">
              <span>Active Fix Tickets</span>
              <span className="text-white font-medium">3 Pending</span>
            </div>
            <div className="flex justify-between">
              <span>Web Forge Staging</span>
              <span className="text-amber-400 font-bold uppercase text-[10px]">STAGING_ACTIVE</span>
            </div>
          </div>
        </div>
        <div className="pt-4 border-t border-white/[0.03] text-[9.5px] text-slate-500">
          *Hustle projects represent external clients logs synced locally. Secure sandboxing checked perpetually.
        </div>
      </div>
    </div>
  );
};
