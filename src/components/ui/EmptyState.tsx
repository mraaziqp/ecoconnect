import React from "react";
import { Icon } from "./Icon";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl border border-white/[0.02] bg-gradient-to-b from-white/[0.01] to-transparent">
      <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/5">
        <Icon name={icon as any} size={32} className="text-cyan-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2 text-center">{title}</h3>
      <p className="text-sm text-slate-400 text-center max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-300 hover:text-cyan-200 font-semibold text-sm transition-all hover:shadow-lg hover:shadow-cyan-500/10"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
