import React from "react";
import { Icon } from "../ui/Icon";
import { VaultKey } from "../../types";

interface ApiVaultViewProps {
  vaultKeys: VaultKey[];
  newKeyName: string;
  setNewKeyName: (val: string) => void;
  newKeyValue: string;
  setNewKeyValue: (val: string) => void;
  addVaultKey: (key: { name: string; value: string }) => void;
  deleteVaultKey: (id: string) => void;
  showNotification: (msg: string) => void;
}

export const ApiVaultView: React.FC<ApiVaultViewProps> = ({
  vaultKeys,
  newKeyName,
  setNewKeyName,
  newKeyValue,
  setNewKeyValue,
  addVaultKey,
  deleteVaultKey,
  showNotification,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim() || !newKeyValue.trim()) return;
    
    addVaultKey({ name: newKeyName, value: newKeyValue });
    setNewKeyName("");
    setNewKeyValue("");
    showNotification("Credential variable locked and cataloged.");
  };

  return (
    <div className="flex-1 flex flex-col gap-6 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Addition Form */}
        <div className="bg-white/[0.01] border border-white/[0.02] p-5 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Inject Cluster Secret Variable</h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-350">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Key name (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MONGO_DB_URI"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value.toUpperCase())}
                  className="w-full bg-slate-900 border border-white/[0.05] rounded-xl px-4 py-2.5 text-white placeholder-slate-705 focus:outline-none focus:border-cyan-500/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Secret Password (Masked)</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••••••"
                  value={newKeyValue}
                  onChange={(e) => setNewKeyValue(e.target.value)}
                  className="w-full bg-slate-900 border border-white/[0.05] rounded-xl px-4 py-2.5 text-white placeholder-slate-705 focus:outline-none focus:border-cyan-500/40"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl text-slate-950 font-display font-bold uppercase text-[9.5px] tracking-wider hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-md shadow-cyan-500/10 mt-2"
              >
                Assemble & Commit Secret
              </button>
            </form>
          </div>
        </div>

        {/* List of keys */}
        <div className="lg:col-span-2 bg-white/[0.01] border border-white/[0.02] p-5 rounded-2xl flex flex-col">
          <h3 className="text-xs font-bold uppercase text-slate-200 tracking-wider mb-4">Secured pipeline registry</h3>
          <div className="space-y-2.5 overflow-y-auto max-h-[300px]">
            {vaultKeys.map((k) => (
              <div key={k.id} className="bg-slate-950/40 border border-white/[0.02] p-4 rounded-xl flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate">{k.name}</p>
                  <p className="text-[9px] text-slate-500 font-medium font-mono uppercase">UPDATED // {k.updatedAt}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-xs">
                  <span className="text-[9px] text-cyan-400 font-semibold bg-cyan-400/5 px-2.5 py-1 rounded border border-cyan-400/10">
                    AES-256 PIPELINE
                  </span>
                  <button
                    onClick={() => {
                      deleteVaultKey(k.id);
                      showNotification("Secret entry deleted.");
                    }}
                    className="p-1 px-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/25 transition-colors cursor-pointer"
                    title="Delete secret"
                  >
                    <Icon name="Trash" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
