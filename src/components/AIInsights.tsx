import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Icon } from "./ui/Icon";

interface InsightItem {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionClick?: () => void;
}

interface AIInsightsProps {
  activeProfile: string;
  activeApp?: string;
  recentEvents?: Array<{ message: string; appSource: string }>;
}

export const AIInsights: React.FC<AIInsightsProps> = ({
  activeProfile,
  activeApp,
  recentEvents,
}) => {
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate AI-powered insights based on current context
    const generateInsights = async () => {
      setLoading(true);
      try {
        // Simulate real-time insight generation
        // In production, this would call an AI endpoint

        const defaultInsights: InsightItem[] = [
          {
            icon: "TrendingUp",
            title: "FinancePlay Monitor",
            description: `Track your financial metrics. Your ${
              activeProfile === "Master Developer"
                ? "Developer"
                : activeProfile
            } profile hasn't logged any transactions this week.`,
          },
          {
            icon: "Heart",
            title: "Relationship Sync",
            description:
              "Project Cupid suggests scheduling a checkpoint. Last milestone was 5 days ago.",
          },
          {
            icon: "CheckSquare",
            title: "Habit Optimization",
            description:
              "Lifestack detected a 3-day gap in your morning routine. Resume tracking to maintain streaks.",
          },
        ];

        // Add event-based insights
        if (recentEvents && recentEvents.length > 0) {
          const lastEvent = recentEvents[recentEvents.length - 1];
          defaultInsights.push({
            icon: "Activity",
            title: `${lastEvent.appSource} Activity`,
            description: `Recent: ${lastEvent.message}`,
          });
        }

        setInsights(defaultInsights);
      } catch (error) {
        console.error("Error generating insights:", error);
      } finally {
        setLoading(false);
      }
    };

    generateInsights();
  }, [activeProfile, activeApp, recentEvents]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 bg-white/[0.01] border border-white/[0.02] rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {insights.map((insight, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="p-4 rounded-xl border border-cyan-500/10 bg-gradient-to-r from-cyan-500/5 to-transparent hover:border-cyan-500/20 transition-all cursor-pointer group"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-cyan-500/20 transition-all">
              <Icon
                name={insight.icon as any}
                size={16}
                className="text-cyan-400"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white mb-1">
                {insight.title}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {insight.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Secondbrain Status Footer */}
      <div className="text-[10px] text-slate-600 text-center pt-2 border-t border-white/[0.02]">
        Insights powered by Secondbrain AI • Real-time analysis
      </div>
    </div>
  );
};
