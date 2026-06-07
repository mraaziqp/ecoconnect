import React from "react";
import { Icon } from "../ui/Icon";

interface Node {
  id: string;
  name: string;
  status: string;
  load: number;
  port: number;
}

interface UtilityAppsProps {
  appId: "opsnexus" | "smlysapploader";
  opsNodes: Node[];
  setOpsNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  vaultKeysCount: number;
  publishEvent: (app: string, type: string, msg: string, payload?: any) => void;
  showNotification: (msg: string) => void;
}

export const UtilityApps: React.FC<UtilityAppsProps> = ({
  appId,
  opsNodes,
  setOpsNodes,
  vaultKeysCount,
  publishEvent,
  showNotification,
}) => {
  if (appId === "opsnexus") {
    return (
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-xs">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div>
            <span className="text-purple-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-1.5 block">Docker Node & Daemon Core Monitoring</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight font-display">OpsNexus Terminal</h2>
            <p className="text-xs text-slate-400">Track containerized nodes, manage pipeline status, and inspect virtual port mappings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opsNodes.map((node) => (
              <div key={node.id} className="bg-white/[0.01] border border-white/[0.03] p-4 rounded-xl flex flex-col justify-between h-36">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-200 text-xs truncate max-w-[70%]">{node.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wider leading-none border uppercase ${
                      node.status === "online" 
                        ? "bg-green-500/10 text-green-400 border-green-500/20" 
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {node.status}
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-500 font-mono">VIRTUAL PORT: {node.port}</p>
                </div>

                <div className="space-y-1.5 mt-2">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>CPU / Memory allocation</span>
                    <span className="text-purple-400 font-semibold">{node.load}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/[0.02] rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${node.load}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Console */}
          <div className="bg-white/[0.01] border border-white/[0.02] p-4 rounded-xl space-y-3">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Node Management Console</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  publishEvent("OpsNexus", "sandbox_reboot", "cold reboot trigger dispatched to local operational node matrix.");
                  showNotification("Cold rebooting node core...");
                }}
                className="bg-red-500/15 border border-red-500/35 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-[9px] cursor-pointer transition-colors"
              >
                Reboot Node Clusters
              </button>
              <button
                onClick={() => {
                  publishEvent("OpsNexus", "garbage_collection", "dispatched systemic storage garbage collection instruction.");
                  showNotification("Storage Heap GC initialized.");
                }}
                className="bg-cyan-500/15 border border-cyan-500/35 hover:bg-cyan-500/30 text-cyan-400 px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-[9px] cursor-pointer transition-colors"
              >
                Flush System Heap
              </button>
            </div>
          </div>
        </div>

        {/* Right metrics panel */}
        <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/[0.02] flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Metrics Ledger Summary</h3>
            <div className="p-4 rounded-xl bg-slate-950 border border-white/[0.02] space-y-3">
              <div className="flex justify-between items-center border-b border-white/[0.02] pb-1.5 leading-none">
                <span className="text-slate-500">Secure DB Keys Locked</span>
                <span className="text-slate-100 font-semibold">{vaultKeysCount} elements</span>
              </div>
              <div className="flex justify-between items-center leading-none">
                <span className="text-slate-500">Node Proxy Latency</span>
                <span className="text-green-400 font-bold">4.8 MS</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.03] text-[9.5px] text-slate-500 leading-relaxed">
            *Systems operations dashboard resides behind server-side container proxies. Access limits verified continuously.
          </div>
        </div>
      </div>
    );
  }

  // SMLYSAPPLOADER APP COMPILER MODULE
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-xs">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div>
          <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-1.5 block">Docker Suite Pack Indexer</span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight font-display">SMLYS Application Loader</h2>
          <p className="text-xs text-slate-400">Pack, archive, and boot containerized app bundles. Recompile virtual registries dynamically.</p>
        </div>

        <div className="bg-white/[0.01] border border-white/[0.02] p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
            <p className="text-slate-100 font-bold uppercase text-[10px] tracking-wider">Sync compilation stream: active</p>
          </div>
          <p className="text-slate-400 tracking-wide leading-relaxed text-[11px]">
            The compiler daemon securely fetches local package bundles, reviews checksum validation parameters, extracts asset layouts, injects active credentials references, and restarts express endpoints.
          </p>
          <div className="h-[1px] bg-white/[0.03]" />
          <div>
            <button
              onClick={() => {
                publishEvent("SMLYSAPPLOADER", "pack_compiled", "dispatched recompilation pipeline event to virtual server loops.");
                showNotification("Recompiling registration bundles...");
              }}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-display px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition-all duration-300 shadow-md shadow-cyan-500/10 cursor-pointer"
            >
              Recompile Registration Core
            </button>
          </div>
        </div>
      </div>

      {/* Package tracker */}
      <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/[0.02] flex flex-col justify-between">
        <div>
          <h3 className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">Pack Registry Digests</h3>
          <div className="space-y-3 font-mono text-[9px] text-slate-500">
            <div className="p-2.5 rounded bg-white/[0.01] border border-white/[0.02] text-slate-400 flex justify-between">
              <span>express-v4.21.2.tgz</span>
              <span className="text-green-400">SYNCED</span>
            </div>
            <div className="p-2.5 rounded bg-white/[0.01] border border-white/[0.02] text-slate-400 flex justify-between">
              <span>@google/genai-v2.4.tgz</span>
              <span className="text-green-400">SYNCED</span>
            </div>
            <div className="p-2.5 rounded bg-white/[0.01] border border-white/[0.02] text-slate-400 flex justify-between">
              <span>lucide-react-v0.546.tgz</span>
              <span className="text-green-400">SYNCED</span>
            </div>
            <div className="p-2.5 rounded bg-white/[0.01] border border-white/[0.02] text-slate-400 flex justify-between">
              <span>local-sqlite-engine-replica</span>
              <span className="text-green-400">SYNCED</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.03] text-[9.5px] text-slate-500">
          *Packs are assembled inside sandboxed container scopes. Key access metrics are evaluated dynamically.
        </div>
      </div>
    </div>
  );
};
