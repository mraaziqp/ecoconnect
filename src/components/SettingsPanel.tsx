import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "./ui/Icon";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [notifications, setNotifications] = useState(true);
  const [autoUpdates, setAutoUpdates] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      <motion.div
        initial={{ x: 384 }}
        animate={{ x: isOpen ? 0 : 384 }}
        transition={{ type: "spring", damping: 20 }}
        className="fixed right-0 top-0 h-screen w-96 bg-slate-950 border-l border-white/[0.02] backdrop-blur-xl z-40 overflow-y-auto"
      >
        <div className="p-6 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-display">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] text-slate-400 hover:text-white transition-all"
            >
              <Icon name="X" size={18} />
            </button>
          </div>

          {/* Theme Settings */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-widest font-bold text-slate-500 block">
              Theme
            </label>
            <div className="space-y-2">
              {(["dark", "light"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    theme === t
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                      : "bg-white/[0.01] border-white/[0.05] hover:border-white/[0.1] text-slate-400"
                  }`}
                >
                  <Icon name={t === "dark" ? "Moon" : "Sun"} size={16} />
                  <span className="text-sm font-semibold capitalize">{t} Mode</span>
                  {theme === t && <Icon name="Check" size={14} className="ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-widest font-bold text-slate-500 block">
              Notifications
            </label>
            <button
              onClick={() => setNotifications(!notifications)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/[0.05] hover:border-white/[0.1] text-slate-300 hover:text-white transition-all"
            >
              <span className="text-sm font-semibold">System Notifications</span>
              <div
                className={`w-10 h-6 rounded-full border transition-all ${
                  notifications
                    ? "bg-cyan-500/20 border-cyan-500/30"
                    : "bg-white/[0.02] border-white/[0.05]"
                }`}
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-cyan-400 m-0.5"
                  animate={{ x: notifications ? 16 : 0 }}
                />
              </div>
            </button>
          </div>

          {/* Auto Updates */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-widest font-bold text-slate-500 block">
              Updates
            </label>
            <button
              onClick={() => setAutoUpdates(!autoUpdates)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/[0.05] hover:border-white/[0.1] text-slate-300 hover:text-white transition-all"
            >
              <span className="text-sm font-semibold">Auto Update Apps</span>
              <div
                className={`w-10 h-6 rounded-full border transition-all ${
                  autoUpdates
                    ? "bg-purple-500/20 border-purple-500/30"
                    : "bg-white/[0.02] border-white/[0.05]"
                }`}
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-purple-400 m-0.5"
                  animate={{ x: autoUpdates ? 16 : 0 }}
                />
              </div>
            </button>
          </div>

          {/* About */}
          <div className="pt-6 border-t border-white/[0.02]">
            <p className="text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-400">Nexus Hub</span> v2.0.0
            </p>
            <p className="text-[10px] text-slate-600 leading-relaxed">
              Enterprise OS & Ecosystem Orchestrator. All rights reserved. © 2026
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
