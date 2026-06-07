import React from "react";
import { Icon } from "../ui/Icon";

interface Milestone {
  title: string;
  rating: number;
  date: string;
}

interface MetricsProps {
  dates: Milestone[];
  syncRating: number;
}

export const ProjectCupidMetrics: React.FC<MetricsProps> = ({
  dates,
  syncRating,
}) => {
  const avgRating =
    dates.length > 0
      ? Math.round(dates.reduce((sum, d) => sum + d.rating, 0) / dates.length)
      : 0;

  const trendUp = dates.length >= 2 && dates[dates.length - 1].rating >= dates[dates.length - 2].rating;
  const daysSinceLastDate =
    dates.length > 0
      ? Math.floor(
          (Date.now() - new Date(dates[dates.length - 1].date).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const getConnectionQuality = (rating: number): string => {
    if (rating >= 95) return "Transcendent";
    if (rating >= 85) return "Deeply Connected";
    if (rating >= 70) return "Strong Bond";
    if (rating >= 50) return "Solid Foundation";
    return "Needs Attention";
  };

  return (
    <div className="space-y-6">
      {/* Relationship Vitals */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <p className="text-[10px] text-purple-400 uppercase tracking-wider font-bold mb-2">
            Current Sync Rating
          </p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-black text-purple-300">{syncRating}%</p>
            <Icon
              name="Heart"
              size={24}
              className="text-purple-400 mb-1 animate-pulse"
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20">
          <p className="text-[10px] text-pink-400 uppercase tracking-wider font-bold mb-2">
            Average Milestone Rating
          </p>
          <p className="text-3xl font-black text-pink-300">{avgRating}</p>
          <p className="text-[9px] text-pink-400 mt-1">
            {dates.length} milestone{dates.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Connection Quality Gauge */}
      <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.02]">
        <p className="text-xs font-bold text-slate-300 mb-3">Connection Quality</p>
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-white">
              {getConnectionQuality(syncRating)}
            </span>
            <span className="text-[10px] text-slate-500">{syncRating}/100</span>
          </div>
          <div className="w-full h-3 bg-white/[0.05] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                syncRating >= 90
                  ? "bg-gradient-to-r from-pink-500 to-purple-500"
                  : syncRating >= 70
                    ? "bg-cyan-500"
                    : "bg-orange-500"
              }`}
              style={{ width: `${syncRating}%` }}
            />
          </div>
        </div>

        {syncRating < 70 && (
          <p className="text-[10px] text-orange-400 mt-2">
            💡 Suggest a meaningful date or conversation to strengthen your connection
          </p>
        )}
        {syncRating >= 90 && (
          <p className="text-[10px] text-pink-400 mt-2">
            ✨ Your connection is thriving! Keep nurturing this bond
          </p>
        )}
      </div>

      {/* Trend Analysis */}
      {dates.length > 0 && (
        <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.02]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-300">Trend</p>
            {trendUp ? (
              <div className="flex items-center gap-1 text-green-400">
                <Icon name="TrendingUp" size={14} />
                <span className="text-[10px] font-bold">Improving</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-orange-400">
                <Icon name="TrendingDown" size={14} />
                <span className="text-[10px] font-bold">Declining</span>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-400">
            {daysSinceLastDate === 0
              ? "📅 Last milestone was today - wonderful timing!"
              : daysSinceLastDate === 1
                ? "📅 Last milestone was yesterday"
                : `📅 ${daysSinceLastDate} days since last milestone`}
          </p>

          {daysSinceLastDate > 14 && (
            <p className="text-[10px] text-amber-400 mt-2">
              ⏰ Consider planning a new milestone soon to maintain momentum
            </p>
          )}
        </div>
      )}

      {/* Recent Milestones Preview */}
      {dates.length > 0 && (
        <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.02]">
          <p className="text-xs font-bold text-slate-300 mb-3">Recent Milestones</p>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {dates.slice(-3).map((date, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded bg-white/[0.02]">
                <div>
                  <p className="text-sm font-semibold text-slate-200">{date.title}</p>
                  <p className="text-[9px] text-slate-500">{date.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-pink-400">{date.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
