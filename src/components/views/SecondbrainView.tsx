import React from "react";
import { Icon } from "../ui/Icon";

interface SecondbrainViewProps {
  publishEvent: (app: string, type: string, msg: string, payload?: any) => void;
  showNotification: (msg: string) => void;
  clearLogs: () => void;
  setSpotlightOpen: (val: boolean) => void;
}

export const SecondbrainView: React.FC<SecondbrainViewProps> = ({
  publishEvent,
  showNotification,
  clearLogs,
  setSpotlightOpen,
}) => {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div>
          <span className="text-purple-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-1.5 block">Central Cognitive Nervous System</span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight font-display">Secondbrain Core</h2>
          <p className="text-xs text-slate-400">Manage virtual event streams, direct encrypted database handshakes, and route secure credential variables.</p>
        </div>

        {/* Console display */}
        <div className="bg-white/[0.01] p-5 border border-white/[0.02] rounded-2xl flex-1 flex flex-col justify-between">
          <div className="space-y-4 text-xs text-slate-400">
            <p className="text-purple-400 uppercase tracking-widest font-extrabold text-[10px]">:: System Orchestration Loop active // v3.12</p>
            <p className="font-medium text-slate-400">:: All local database configurations verified.</p>
            <div className="h-[1.5px] bg-white/[0.03]" />
            <div className="space-y-3 leading-relaxed">
              <p>
                <span className="text-cyan-400 font-bold uppercase text-[10px]">Lifestack core</span> routing routines checkpoints to reconcile with central metrics.
              </p>
              <p>
                <span className="text-purple-400 font-bold uppercase text-[10px]">FinancePlay hub</span> publishing telemetry events matching cloud endpoints.
              </p>
            </div>
          </div>
        </div>

        {/* Immediate triggers */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <button
            onClick={() => {
              publishEvent("Secondbrain", "db_rebuild", "Triggered simulated database orchestration handshake complete.");
              showNotification("Databases aligned successfully!");
            }}
            className="bg-purple-950/20 hover:bg-purple-500/10 border border-purple-500/20 hover:border-purple-400 rounded-xl px-4 py-3 font-semibold text-purple-300 cursor-pointer transition-all"
          >
            Sync Database
          </button>
          <button
            onClick={() => {
              publishEvent("Secondbrain", "re_route_dns", "Diverted administrative credentials calls safely behind cloud VPC nodes.");
              showNotification("Keys routed securely!");
            }}
            className="bg-cyan-950/20 hover:bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-400 rounded-xl px-4 py-3 font-semibold text-cyan-300 cursor-pointer transition-all"
          >
            Secure Key Route
          </button>
          <button
            onClick={() => {
              publishEvent("Secondbrain", "clear_event_bus", "Dispatched manual clean action to event tracer logger.");
              clearLogs();
              showNotification("Bus logs swept!");
            }}
            className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-slate-600 rounded-xl px-4 py-3 font-semibold text-slate-300 cursor-pointer transition-all"
          >
            Sweeps Logs
          </button>
        </div>
      </div>

      <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/[0.02] flex flex-col justify-between">
        <div>
          <h4 className="text-[10px] text-slate-500 uppercase tracking-widest mb-4 font-bold">Operational Logs</h4>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>SMLYS Compiler Allocation</span>
                <span className="text-cyan-400">12%</span>
              </div>
              <div className="w-full h-1 bg-white/[0.02] rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400" style={{ width: "12%" }}></div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>OpsNexus Core load</span>
                <span className="text-purple-400">88%</span>
              </div>
              <div className="w-full h-1 bg-white/[0.02] rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: "88%" }}></div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setSpotlightOpen(true)}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-purple-500/10 uppercase font-display cursor-pointer"
        >
          Open Cognitive Input
        </button>
      </div>
    </div>
  );
};
