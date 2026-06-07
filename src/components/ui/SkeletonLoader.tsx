import React from "react";

export const SkeletonLoader: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-white/[0.02] bg-white/[0.01] p-6 animate-pulse">
          <div className="h-6 bg-white/[0.05] rounded-lg mb-3 w-3/4"></div>
          <div className="h-4 bg-white/[0.05] rounded-lg mb-2 w-full"></div>
          <div className="h-4 bg-white/[0.05] rounded-lg w-5/6"></div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC = () => (
  <div className="rounded-2xl border border-white/[0.02] bg-white/[0.01] p-5 h-44 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 bg-white/[0.05] rounded-xl"></div>
      <div className="w-12 h-6 bg-white/[0.05] rounded-full"></div>
    </div>
    <div className="h-5 bg-white/[0.05] rounded-lg mb-3 w-2/3"></div>
    <div className="h-3 bg-white/[0.05] rounded-lg mb-2 w-full"></div>
    <div className="h-3 bg-white/[0.05] rounded-lg w-4/5"></div>
  </div>
);
