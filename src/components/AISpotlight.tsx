import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "./ui/Icon";

export interface SpotlightResult {
  appId: string;
  appName: string;
  relevanceScore: number;
  reason: string;
}

interface AISpotlightProps {
  isOpen: boolean;
  onSelect: (appId: string) => void;
  onClose: () => void;
}

export const AISpotlight: React.FC<AISpotlightProps> = ({
  isOpen,
  onSelect,
  onClose,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpotlightResult[]>([]);
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Handle search with Secondbrain AI
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setAiSummary("");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/secondbrain/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await response.json();
      setResults(data.recommendations || []);
      setAiSummary(data.aiSummary || "");
    } catch (error) {
      console.error("Spotlight search error:", error);
      setResults([]);
      setAiSummary("Secondbrain search unavailable");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        handleSearch(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      onSelect(results[selectedIndex].appId);
      onClose();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-start justify-center pt-20 px-4 font-sans"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-950 via-[#0D0D12] to-slate-950 shadow-2xl overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-6 border-b border-white/[0.02]">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Search" size={18} className="text-cyan-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Query Secondbrain AI... (e.g., 'How do I track my finances?')"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none text-lg"
                />
                {loading && (
                  <div className="w-5 h-5 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
                )}
              </div>
              {query && (
                <p className="text-xs text-slate-500 italic">
                  Secondbrain analyzing query intent...
                </p>
              )}
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {loading && query ? (
                <div className="p-6 text-center">
                  <div className="inline-block w-8 h-8 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin mb-3" />
                  <p className="text-sm text-slate-400">Neural synthesis in progress...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="p-4 space-y-2">
                  {results.map((result, idx) => (
                    <motion.button
                      key={result.appId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => {
                        onSelect(result.appId);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        selectedIndex === idx
                          ? "bg-cyan-500/10 border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                          : "bg-white/[0.01] border border-white/[0.05] hover:border-cyan-500/20"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-white text-sm">
                          {result.appName}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                            {result.relevanceScore}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400">{result.reason}</p>
                    </motion.button>
                  ))}
                </div>
              ) : query ? (
                <div className="p-6 text-center">
                  <Icon
                    name="Lightbulb"
                    size={32}
                    className="text-slate-600 mx-auto mb-3"
                  />
                  <p className="text-sm text-slate-400">
                    No apps matched your query. Try a broader search term.
                  </p>
                </div>
              ) : (
                <div className="p-6 space-y-4 text-slate-400 text-sm">
                  <p>
                    <span className="text-cyan-400 font-semibold">Secondbrain Spotlight</span> uses
                    AI to intelligently route your requests to the right app.
                  </p>
                  <p className="text-xs">
                    ⌘K or Ctrl+K to open • ↑↓ to navigate • Enter to select • Esc to close
                  </p>
                </div>
              )}
            </div>

            {/* AI Summary */}
            {aiSummary && (
              <div className="p-4 border-t border-white/[0.02] bg-white/[0.01]">
                <p className="text-xs text-slate-400 italic">
                  <span className="text-cyan-400 font-semibold">Secondbrain:</span> {aiSummary}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
