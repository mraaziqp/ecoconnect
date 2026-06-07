import React from "react";
import { motion } from "motion/react";
import { Icon } from "./ui/Icon";
import { RegistryApp } from "../types";

interface GlassCardProps {
  app: RegistryApp;
  onClick: () => void;
  featured?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ app, onClick, featured = false }) => {
  // Select color themes strictly representing the brand category
  const themeColors = {
    core: {
      accent: "text-purple-400",
      glow: "hover:shadow-purple-500/10 hover:border-purple-500/30",
      bg: "bg-purple-500/10",
      badge: "bg-purple-500/10 text-purple-300 border-purple-500/20"
    },
    productivity: {
      accent: "text-cyan-400",
      glow: "hover:shadow-cyan-500/10 hover:border-cyan-500/30",
      bg: "bg-cyan-500/10",
      badge: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
    },
    utility: {
      accent: "text-purple-400",
      glow: "hover:shadow-purple-500/10 hover:border-purple-500/30",
      bg: "bg-purple-500/10",
      badge: "bg-purple-500/10 text-purple-300 border-purple-500/20"
    },
    community: {
      accent: "text-teal-400",
      glow: "hover:shadow-teal-500/10 hover:border-teal-500/30",
      bg: "bg-teal-500/10",
      badge: "bg-teal-500/10 text-teal-300 border-teal-500/20"
    },
    sandbox: {
      accent: "text-amber-400",
      glow: "hover:shadow-amber-500/10 hover:border-amber-500/30",
      bg: "bg-amber-500/10",
      badge: "bg-amber-500/10 text-amber-300 border-amber-500/20"
    }
  };

  const currentTheme = themeColors[app.category] || themeColors.productivity;

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{
        background: "rgba(13, 13, 18, 0.45)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderColor: "rgba(255, 255, 255, 0.02)"
      }}
      className={`group relative overflow-hidden rounded-2xl p-5 border flex flex-col justify-between h-44 shadow-sm hover:shadow-lg transition-shadow cursor-pointer ${currentTheme.glow}`}
    >
      {/* Absolute overlay glow on active hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl ${currentTheme.bg} flex items-center justify-center transition-colors duration-300`}>
            <Icon name={app.logo} size={20} className={`${currentTheme.accent} transition-transform duration-300 group-hover:scale-110`} />
          </div>
          <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-sans font-semibold tracking-wider uppercase border ${currentTheme.badge}`}>
            {app.id === "secondbrain" ? "Neural Core" : app.status}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-slate-100 font-display tracking-wide mb-1 leading-snug">
          {app.name}
        </h3>
        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
          {app.shortDesc}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/[0.03] mt-2">
        <span className="text-[9px] text-slate-500 font-mono tracking-wider">
          LAUNCH_INDEX // {app.launchCount}
        </span>
        <div className={`opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 ${currentTheme.accent}`}>
          <Icon name="ArrowRight" size={14} />
        </div>
      </div>
    </motion.div>
  );
};
