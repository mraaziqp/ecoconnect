import React, { useState } from "react";
import { Icon } from "../ui/Icon";
import { useTenant } from "../../context/TenantContext";

export interface GeneratedKey {
  id: string;
  name: string;
  key: string;
  createdBy: string;
  createdAt: string;
  status: "active" | "revoked";
  permissions: {
    secondbrain: "none" | "read" | "full";
    financeplay: "none" | "read" | "full";
    projectcupid: "none" | "read" | "full";
    lifestack: "none" | "read" | "full";
    opsnexus: "none" | "read" | "full";
  };
}

const MASTER_ECOSYSTEM_KEYS = [
  { name: "SECOND_BRAIN_MASTER", display: "Secondbrain Overseer Key", key: "5d50b3e58d586060470a26e56a8f973b22334ed0fe85d6b6c1105b3e3cf997d8", service: "Secondbrain Core", status: "Active" },
  { name: "NEXUS_API_KEY", display: "Nexus Node Client", key: "601a699f41445939e101d9d642f3b0386602f225451d972611f972f284a40f6c", service: "Nexus Host", status: "Active" },
  { name: "AWEHCHAT_KEY", display: "AwehChat Token", key: "a7f2e9c4d1b8f3a6e5c2d9f1a4b7e0c3", service: "Awehchat Client", status: "Active" },
  { name: "CONSOLIDATED_HUB_KEY", display: "Consolidated Master Key", key: "mak_7f8b9e2c1a5d3f6e4b9c2a8d5f1e3a7c", service: "Consolidated Hub", status: "Active" },
  { name: "AXION_KEY", display: "Axion Processor", key: "axm_5a964afe59e6bb741257ff492b063960", service: "Axion Micro-Node", status: "Active" },
  { name: "FINANCEPLAY_KEY", display: "FinancePlay Ledger Sync", key: "SB-8f3d4e6a2c9b7f1e5d3a8c2b6f9e1d4a7c3b5f2e8d9a6c1b4e7f3d8a2c5b", service: "FinancePlay Daemon", status: "Active" },
];

export const KeyManagerVault: React.FC = () => {
  const { activeTenant } = useTenant();
  const [keys, setKeys] = useState<GeneratedKey[]>(() => {
    const saved = localStorage.getItem(`nexus_generated_keys_${activeTenant.id}`);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "gk-1",
        name: "Telemetry Pipeline Token",
        key: "mak_sb_82c1e403d65b9ea429a1bcf9c77e110",
        createdBy: "Master Developer",
        createdAt: "2026-06-01",
        status: "active",
        permissions: {
          secondbrain: "full",
          financeplay: "read",
          projectcupid: "none",
          lifestack: "none",
          opsnexus: "read"
        }
      }
    ];
  });

  const saveKeys = (newKeys: GeneratedKey[]) => {
    setKeys(newKeys);
    localStorage.setItem(`nexus_generated_keys_${activeTenant.id}`, JSON.stringify(newKeys));
  };

  const [keyName, setKeyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Custom permissions sliders / toggles configuration
  const [perms, setPerms] = useState<GeneratedKey["permissions"]>({
    secondbrain: "full",
    financeplay: "read",
    projectcupid: "none",
    lifestack: "read",
    opsnexus: "none"
  });

  const [activeTab, setActiveTab] = useState<"tenant-vault" | "master-ecosystem">("tenant-vault");
  const [pingTarget, setPingTarget] = useState<string | null>(null);
  const [pingResult, setPingResult] = useState<string | null>(null);

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    // Build random crypto-like token
    const randomBytes = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const token = `mak_sb_${randomBytes}`;

    const newKey: GeneratedKey = {
      id: "gk_" + Math.random().toString(36).substr(2, 9),
      name: keyName.trim(),
      key: token,
      createdBy: "Master Developer",
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
      permissions: { ...perms }
    };

    saveKeys([...keys, newKey]);
    setKeyName("");
    
    // Toggle notification event in parent window
    window.dispatchEvent(
      new CustomEvent("vault-event", {
        detail: { action: "addedKey", keyName: newKey.name }
      })
    );
  };

  const handleRevokeKey = (id: string) => {
    const next = keys.map((k) => (k.id === id ? { ...k, status: "revoked" as const } : k));
    saveKeys(next);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTestGatewayPing = async (keyName: string, keyValue: string) => {
    setPingTarget(keyName);
    setPingResult(null);
    setLoading(true);

    try {
      // Direct call to our custom Express API router simulating Secondbrain gateway response checks
      const response = await fetch("/api/gateway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: keyValue,
          targetService: keyName.replace("_KEY", "").toLowerCase(),
          payload: { query: "Simulate service handshakes" }
        })
      });
      const data = await response.json();
      if (response.ok) {
        setPingResult(`STATUS: ${data.status} // ROUTING LOG: ${data.routingLog}`);
      } else {
        setPingResult(`ERROR: ${data.error || "Request blocked by Gateway firewall config."}`);
      }
    } catch (e: any) {
      setPingResult(`COGNITIVE OFFLINE HANDSHAKE: Valid key cataloged but external dev routing bypassed.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Tab Switcher */}
      <div className="flex border-b border-white/[0.03] pb-1 gap-4">
        <button
          onClick={() => setActiveTab("tenant-vault")}
          className={`pb-3 text-xs uppercase tracking-wider font-semibold border-b ${
            activeTab === "tenant-vault"
              ? "border-cyan-400 text-cyan-400"
              : "border-transparent text-slate-500 hover:text-slate-300"
          } transition-all cursor-pointer`}
        >
          Tenant AI Tokens Manager
        </button>
        <button
          onClick={() => setActiveTab("master-ecosystem")}
          className={`pb-3 text-xs uppercase tracking-wider font-semibold border-b ${
            activeTab === "master-ecosystem"
              ? "border-purple-400 text-purple-400"
              : "border-transparent text-slate-500 hover:text-slate-300"
          } transition-all cursor-pointer`}
        >
          Ecosystem Master Keys Catalog
        </button>
      </div>

      {activeTab === "tenant-vault" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Key Generator Form */}
          <div className="lg:col-span-5 bg-white/[0.01] border border-white/[0.02] p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 rounded bg-cyan-400/15 flex items-center justify-center">
                  <Icon name="Key" size={12} className="text-cyan-400" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Generate Agent Token</h3>
              </div>
              
              <form onSubmit={handleGenerateKey} className="space-y-4 text-xs text-slate-300">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Token Label descriptor</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Awehchat Relational Index"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    className="w-full bg-slate-900 border border-white/[0.05] rounded-xl px-4 py-2.5 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500/40"
                  />
                </div>

                <div className="space-y-3.5 border-t border-white/[0.03] pt-4">
                  <label className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                    Granular AI Agent Permissions (RBAC Toggles)
                  </label>
                  
                  {/* Permissions rows with toggle interfaces */}
                  {Object.keys(perms).map((appKey) => {
                    const currentVal = perms[appKey as keyof GeneratedKey["permissions"]];
                    return (
                      <div key={appKey} className="flex items-center justify-between gap-4 bg-slate-950/20 px-3 py-2 rounded-xl border border-white/[0.01]">
                        <span className="text-xs font-bold text-slate-300 capitalize">{appKey}</span>
                        <div className="flex gap-1.5 bg-slate-900 p-0.5 rounded-lg border border-white/[0.03]">
                          {(["none", "read", "full"] as const).map((level) => (
                            <button
                              type="button"
                              key={level}
                              onClick={() => setPerms(prev => ({ ...prev, [appKey]: level }))}
                              className={`px-2 py-1 rounded text-[9.5px] uppercase font-bold transition-all ${
                                currentVal === level
                                  ? level === "none"
                                    ? "bg-red-500/10 text-red-400"
                                    : level === "read"
                                    ? "bg-amber-500/10 text-amber-400"
                                    : "bg-cyan-500/10 text-cyan-400"
                                  : "text-slate-500 hover:text-slate-300"
                              }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl text-slate-950 font-display font-bold uppercase text-[9.5px] tracking-wider hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-md shadow-cyan-500/10"
                >
                  Generate Workspace Token
                </button>
              </form>
            </div>
          </div>

          {/* Tokens Log & Status Checker */}
          <div className="lg:col-span-7 bg-white/[0.01] border border-white/[0.02] p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-200 tracking-wider mb-4">Workspace Active Tokens</h3>
              <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1">
                {keys.map((k) => (
                  <div key={k.id} className="bg-slate-950/40 border border-white/[0.02] p-4 rounded-xl space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-200">{k.name}</p>
                          <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded ${
                            k.status === "active" ? "bg-cyan-400/10 text-cyan-400" : "bg-red-500/10 text-red-400"
                          }`}>
                            {k.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[9.5px] text-slate-500 font-medium font-mono uppercase mt-0.5">
                          CREATED: {k.createdAt} &middot; BY {k.createdBy}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopy(k.key, k.id)}
                          className="p-1 px-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer text-[10px]"
                        >
                          {copiedId === k.id ? "Copied!" : "Copy"}
                        </button>
                        {k.status === "active" && (
                          <button
                            onClick={() => handleRevokeKey(k.id)}
                            className="p-1 px-1.5 rounded-lg bg-red-500/10 text-red-450 hover:bg-red-500/20 transition-all text-[10px] text-red-400 cursor-pointer"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="bg-black/20 p-2 rounded-lg border border-white/[0.02] font-mono text-[10.5px]">
                      <span className="text-slate-500 mr-2">Token:</span>
                      <span className="text-cyan-300 font-semibold">{k.key.substring(0, 18)}••••••••••••••••••••</span>
                    </div>

                    {/* Permissions Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[8px] text-slate-500 uppercase tracking-wider font-semibold mr-1">RBAC scopes:</span>
                      {Object.entries(k.permissions).map(([app, scope]) => (
                        <span
                          key={app}
                          className={`text-[8.5px] font-bold px-2 py-0.5 rounded inline-block border ${
                            scope === "none"
                              ? "bg-white/[0.01] border-white/[0.03] text-slate-500"
                              : scope === "read"
                              ? "bg-amber-500/[0.04] border-amber-500/15 text-amber-400"
                              : "bg-cyan-500/[0.04] border-cyan-500/15 text-cyan-400"
                          } capitalize`}
                        >
                          {app}: {scope}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Ecosystem Catalog */
        <div className="bg-white/[0.01] border border-white/[0.02] p-5 rounded-2xl space-y-4">
          <div>
            <span className="text-purple-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-1 block">Cross-System API Keys Broker</span>
            <h3 className="text-sm font-black text-white uppercase tracking-tight">Enterprise Backbone Credentials</h3>
            <p className="text-xs text-slate-400">
              The overarching Secondbrain architecture links these persistent backend master tokens to validate and synchronize communication across the primary applets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MASTER_ECOSYSTEM_KEYS.map((k) => (
              <div key={k.name} className="bg-slate-950/40 border border-white/[0.02] p-4.5 rounded-xl flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{k.display}</h4>
                    <p className="text-[9px] text-slate-500 font-mono tracking-wider mt-0.5">{k.name} // {k.service}</p>
                  </div>
                  <span className="text-[9px] text-purple-400 font-bold bg-purple-400/5 px-2 py-0.5 rounded border border-purple-400/10">
                    MASTER TOKEN
                  </span>
                </div>

                <div className="bg-black/25 p-2 rounded-lg border border-white/[0.03] font-mono text-[10.5px] flex items-center justify-between">
                  <span className="text-[#a855f7] truncate select-all">{k.key}</span>
                  <button
                    onClick={() => handleCopy(k.key, k.name)}
                    className="p-1 text-[9.5px] font-sans font-bold text-slate-400 hover:text-white ml-2 shrink-0 cursor-pointer"
                  >
                    {copiedId === k.name ? "Copied" : "Copy"}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-white/[0.02] pt-2">
                  <button
                    onClick={() => handleTestGatewayPing(k.name, k.key)}
                    className="text-[9px] font-sans font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 flex items-center gap-1.5 bg-purple-500/5 px-2.5 py-1 rounded-lg border border-purple-500/10 cursor-pointer"
                  >
                    <Icon name="Activity" size={10} />
                    <span>Ping Secondbrain Router Check</span>
                  </button>
                </div>

                {pingTarget === k.name && pingResult && (
                  <div className="mt-1.5 p-2 bg-slate-900 border border-purple-900/40 text-[9.5px] font-mono rounded text-slate-300 leading-relaxed break-all">
                    {pingResult}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
