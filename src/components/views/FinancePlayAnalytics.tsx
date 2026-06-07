import React from "react";
import { Icon } from "../ui/Icon";

interface Transaction {
  desc: string;
  amount: number;
  type: "income" | "expense";
  date?: string;
}

interface AnalyticsProps {
  transactions: Transaction[];
}

export const FinancePlayAnalytics: React.FC<AnalyticsProps> = ({
  transactions,
}) => {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const net = income - expenses;
  const expensePercentage =
    income > 0 ? Math.round((expenses / income) * 100) : 0;

  const topExpenses = transactions
    .filter((t) => t.type === "expense")
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <p className="text-[10px] text-green-400 uppercase tracking-wider font-bold mb-2">
            Total Income
          </p>
          <p className="text-2xl font-black text-green-300">
            ${income.toLocaleString()}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-[10px] text-red-400 uppercase tracking-wider font-bold mb-2">
            Total Expenses
          </p>
          <p className="text-2xl font-black text-red-300">
            ${expenses.toLocaleString()}
          </p>
        </div>

        <div
          className={`p-4 rounded-xl border ${
            net >= 0
              ? "bg-cyan-500/10 border-cyan-500/20"
              : "bg-orange-500/10 border-orange-500/20"
          }`}
        >
          <p
            className={`text-[10px] uppercase tracking-wider font-bold mb-2 ${
              net >= 0 ? "text-cyan-400" : "text-orange-400"
            }`}
          >
            Net Balance
          </p>
          <p
            className={`text-2xl font-black ${
              net >= 0 ? "text-cyan-300" : "text-orange-300"
            }`}
          >
            ${net.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Expense Ratio */}
      <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.02]">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-slate-300">Expense Ratio</p>
          <p className="text-sm font-black text-cyan-400">{expensePercentage}%</p>
        </div>
        <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              expensePercentage > 80
                ? "bg-red-500"
                : expensePercentage > 60
                  ? "bg-orange-500"
                  : "bg-green-500"
            }`}
            style={{ width: `${Math.min(expensePercentage, 100)}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-500 mt-2">
          {expensePercentage > 80
            ? "⚠️ High expense ratio - consider budget optimization"
            : expensePercentage > 60
              ? "Moderate spending - room for optimization"
              : "✅ Healthy spending patterns"}
        </p>
      </div>

      {/* Top Expenses */}
      {topExpenses.length > 0 && (
        <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.02]">
          <p className="text-xs font-bold text-slate-300 mb-3">
            Top 3 Expense Categories
          </p>
          <div className="space-y-2">
            {topExpenses.map((exp, idx) => (
              <div key={idx} className="flex justify-between items-center p-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-sm text-slate-400">{exp.desc}</span>
                </div>
                <span className="text-sm font-bold text-red-400">
                  ${Math.abs(exp.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial Health Score */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border border-cyan-500/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold mb-1">
              Financial Health Score
            </p>
            <p className="text-xs text-slate-300">
              {net > 0 && expenses / income < 0.5
                ? "Excellent - Keep maintaining strong habits!"
                : net > 0
                  ? "Good - Monitor your spending patterns"
                  : "Caution - Consider increasing income or reducing expenses"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-cyan-400">
              {net > 0 && expenses / income < 0.5
                ? "A"
                : net > 0
                  ? "B"
                  : "C"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
