import React from "react";
import { Icon } from "../ui/Icon";
import { EmptyState } from "../ui/EmptyState";

interface Transaction {
  desc: string;
  amount: number;
  type: "income" | "expense";
}

interface FinancePlayViewProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  newDesc: string;
  setNewDesc: (val: string) => void;
  newAmount: string;
  setNewAmount: (val: string) => void;
  newType: "income" | "expense";
  setNewType: (val: "income" | "expense") => void;
  publishEvent: (app: string, type: string, msg: string, payload?: any) => void;
  showNotification: (msg: string) => void;
}

export const FinancePlayView: React.FC<FinancePlayViewProps> = ({
  transactions,
  setTransactions,
  newDesc,
  setNewDesc,
  newAmount,
  setNewAmount,
  newType,
  setNewType,
  publishEvent,
  showNotification,
}) => {
  const yieldTotal = transactions.reduce((sum, current) => sum + current.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim() || !newAmount) return;
    
    const amt = parseFloat(newAmount);
    const finalAmount = newType === "expense" ? -Math.abs(amt) : Math.abs(amt);
    
    const nextTx: Transaction = {
      desc: newDesc,
      amount: finalAmount,
      type: newType,
    };

    setTransactions((prev) => [...prev, nextTx]);
    publishEvent("FinancePlay", "budget_update", `Injected ledger event: ${newDesc}`, nextTx);
    
    setNewDesc("");
    setNewAmount("");
    showNotification("Financial matrix updated!");
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div>
          <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-1.5 block">Budget Modeling Stream</span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight font-display">Financial Ledger</h2>
          <p className="text-xs text-slate-400">Model revenue yield, allocate capital collocations, and project buffer thresholds.</p>
        </div>

        {/* Form */}
        <div className="bg-white/[0.01] border border-white/[0.02] p-5 rounded-2xl">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Commit Transaction</h3>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-xs text-slate-300">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-wider block">Description</label>
              <input
                type="text"
                required
                placeholder="e.g. Server hosting colocation"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-slate-900 border border-white/[0.05] rounded-xl px-4 py-2.5 text-white placeholder-slate-650 focus:outline-none focus:border-cyan-500/40"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-wider block">Amount</label>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-full bg-slate-900 border border-white/[0.05] rounded-xl px-4 py-2.5 text-white placeholder-slate-650 focus:outline-none focus:border-cyan-500/40"
              />
            </div>

            <button
              type="submit"
              className="w-full h-[40px] bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold uppercase text-[10px] tracking-wider rounded-xl hover:scale-[1.02] active:scale-95 transition-all text-center cursor-pointer shadow-md shadow-cyan-500/10"
            >
              Commit Entry
            </button>
          </form>

          <div className="flex gap-4 mt-4 justify-start">
            <label className="flex items-center gap-2 text-[10px] text-slate-400 cursor-pointer">
              <input
                type="radio"
                name="tx_type"
                checked={newType === "expense"}
                onChange={() => setNewType("expense")}
                className="accent-cyan-500"
              />
              <span>Expense Allocation</span>
            </label>
            <label className="flex items-center gap-2 text-[10px] text-slate-400 cursor-pointer">
              <input
                type="radio"
                name="tx_type"
                checked={newType === "income"}
                onChange={() => setNewType("income")}
                className="accent-cyan-500"
              />
              <span>Yield Capture (Income)</span>
            </label>
          </div>
        </div>

        {/* Ledger Stream */}
        <div className="bg-white/[0.01] border border-white/[0.02] p-5 rounded-2xl flex-1 flex flex-col">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Active Ledger History</h3>
          {transactions.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon="TrendingUp"
                title="No Transactions Yet"
                description="Start tracking your finances by adding your first transaction above."
              />
            </div>
          ) : (
            <div className="space-y-2.5 overflow-y-auto max-h-[280px]">
              {transactions.map((tx, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-white/[0.01] border border-white/[0.02] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.amount > 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                      <Icon name={tx.amount > 0 ? "TrendingUp" : "TrendingDown"} size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{tx.desc}</p>
                      <p className="text-[9px] text-slate-500 uppercase">{tx.type === "income" ? "Yield Capture" : "Asset Expense"}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold font-mono ${tx.amount > 0 ? "text-green-400" : "text-red-400"}`}>
                    {tx.amount > 0 ? "+" : ""}${tx.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Balance Indicator Widget */}
      <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/[0.02] flex flex-col justify-between">
        <div className="space-y-6">
          <h3 className="text-[10px] text-slate-500 uppercase tracking-widest">Finance telemetry Summary</h3>
          
          <div className="p-5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center space-y-1 shadow-inner">
            <p className="text-[10px] uppercase tracking-wider text-cyan-400">Estimated Core Yield</p>
            <p className={`text-3xl font-black font-display ${yieldTotal >= 0 ? "text-cyan-300" : "text-red-400"}`}>
              ${yieldTotal.toLocaleString()}
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-white/[0.03] pb-1.5 text-slate-400">
              <span>Account Integrity</span>
              <span className="text-green-400 font-semibold uppercase text-[10px]">AUTHORIZED</span>
            </div>
            <div className="flex justify-between border-b border-white/[0.03] pb-1.5 text-slate-400">
              <span>Ledger Records</span>
              <span className="text-white font-semibold">{transactions.length} entries</span>
            </div>
            <div className="flex justify-between border-b border-white/[0.03] pb-1.5 text-slate-400">
              <span>Simulation Target</span>
              <span className="text-cyan-400 font-semibold">$100,000 / Mo</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.03] text-[10px] text-slate-500">
          *Synchronized securely under local encryption. Raw keys are never stored client-side.
        </div>
      </div>
    </div>
  );
};
