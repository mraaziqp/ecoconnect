import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "./ui/Icon";
import { UserProfile, EventLog } from "../types";
import { useTenant } from "../context/TenantContext";
import { AISpotlight } from "./AISpotlight";

interface AppShellProps {
  children: React.ReactNode;
  activeProfile: UserProfile;
  profiles: UserProfile[];
  switchProfile: (profileId: string) => void;
  activeAppId: string | null;
  launchApp: (appId: string | null) => void;
  currentTab: "dashboard" | "vault" | "logs";
  setCurrentTab: (tab: "dashboard" | "vault" | "logs") => void;
  logs: EventLog[];
  clearLogs: () => void;
  showNotification: (msg: string) => void;

  // Secondbrain Chat Integration
  chatInput: string;
  setChatInput: (input: string) => void;
  chatHistory: Array<{ role: "user" | "secondbrain"; content: string }>;
  chatLoading: boolean;
  handleChatSendMessage: (e: React.FormEvent) => void;

  // Search Integration
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  searchLoading: boolean;
  searchRecommendations: any[];
  searchSummary: string;
  setSearchRecommendations: (recs: any[]) => void;
  setSearchSummary: (summary: string) => void;

  // Stats
  systemCpu: number;
  systemRam: number;

  // Settings callback
  onSettingsClick?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeProfile,
  profiles,
  switchProfile,
  activeAppId,
  launchApp,
  currentTab,
  setCurrentTab,
  logs,
  clearLogs,
  showNotification,

  chatInput,
  setChatInput,
  chatHistory,
  chatLoading,
  handleChatSendMessage,

  searchQuery,
  setSearchQuery,
  handleSearchSubmit,
  searchLoading,
  searchRecommendations,
  searchSummary,
  setSearchRecommendations,
  setSearchSummary,

  systemCpu,
  systemRam,
  onSettingsClick,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [aiSpotlightOpen, setAiSpotlightOpen] = useState(false);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const { activeTenant, tenants, switchTenant, registerTenant } = useTenant();
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState("");
  const [newEnabledApps, setNewEnabledApps] = useState<string[]>(["secondbrain", "financeplay", "lifestack", "opsnexus"]);

  // Close elements on click outside + keyboard shortcuts
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (spotlightRef.current && !spotlightRef.current.contains(event.target as Node)) {
        setSpotlightOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (workspaceRef.current && !workspaceRef.current.contains(event.target as Node)) {
        setWorkspaceDropdownOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      // Cmd+K or Ctrl+K to open AI Spotlight
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setAiSpotlightOpen(true);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Format active profile role for standard enterprise presentation
  const getEnterpriseRoleLabel = (role: string) => {
    switch (role) {
      case "Developer":
        return "Administrator System";
      case "Partner":
        return "Partner Associate";
      case "Family Member":
        return "Family Resident";
      default:
        return "Ecosystem Client";
    }
  };

  const getActiveAppMetadata = () => {
    if (!activeAppId) return { name: "Desktop Nexus", activeSchema: "NEURAL_OVERLAYS_IDLE" };
    switch (activeAppId) {
      case "secondbrain":
        return { name: "Secondbrain Core", activeSchema: "ORCHESTRATOR_INDEX_LOADED" };
      case "financeplay":
        return { name: "FinancePlay Hub", activeSchema: "FINANCIAL_TELEMETRY_MAPPED" };
      case "projectcupid":
        return { name: "Project Cupid", activeSchema: "RELATIONAL_TIMELINES_ACTIVE" };
      case "lifestack":
        return { name: "Lifestack Tracker", activeSchema: "BIOSTATUS_LOGS_LOADED" };
      case "opsnexus":
        return { name: "OpsNexus Terminal", activeSchema: "NODE_TELEMETRY_STREAMING" };
      case "smlysapploader":
        return { name: "SMLYS Daemon Loader", activeSchema: "COMPILER_CHANNELS_ENGAGED" };
      case "deenify":
        return { name: "Deenify Core", activeSchema: "ALMANAC_CALCULATIONS_ACTIVE" };
      case "familyverse":
        return { name: "Familyverse Board", activeSchema: "MESSAGE_REGISTRY_SYNCED" };
      case "familytree":
        return { name: "Familytree Map", activeSchema: "ANCESTRAL_GRAPH_TRAVERSED" };
      case "hustlestudio":
        return { name: "Hustle Sandbox", activeSchema: "SANDBOX_MOCK_CHANNELS" };
      default:
        return { name: "Dynamic Microapp", activeSchema: "GENCODE_SUBPROCESS" };
    }
  };

  const activeAppMeta = getActiveAppMetadata();

  return (
    <div className="relative min-h-screen bg-[#0D0D12] text-slate-100 font-sans flex overflow-hidden">

      {/* AI-Powered Spotlight Search */}
      <AISpotlight
        isOpen={aiSpotlightOpen}
        onClose={() => setAiSpotlightOpen(false)}
        onSelect={(appId) => {
          launchApp(appId);
          showNotification(`${appId} initialized via Secondbrain search`);
        }}
      />

      {/* Subtle Background Mesh Orbs for High Contrast Muted Baseline */}
      <div className="absolute top-[-15%] left-[-15%] w-[600px] h-[600px] bg-cyan-950/15 rounded-full blur-[160px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[600px] h-[600px] bg-purple-950/15 rounded-full blur-[160px] pointer-events-none z-0"></div>

      {/* Persistent Left Sidebar: Streamlined and Sophisticated */}
      <aside className="w-64 bg-slate-950/45 border-r border-white/[0.02] backdrop-blur-3xl z-30 flex flex-col justify-between shrink-0 hidden md:flex">
        
        {/* Core Suite Branding */}
        <div className="p-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => launchApp(null)}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center p-1 shadow-md shadow-cyan-500/10">
              <Icon name="Activity" size={14} className="text-white" />
            </div>
            <div>
              <h2 className="text-xs uppercase font-black font-display tracking-[0.2em] text-white">
                NEXUS<span className="text-cyan-400">HUB</span>
              </h2>
              <p className="text-[8.5px] font-mono text-slate-500 tracking-wider">ENTERPRISE OS // V2.0</p>
            </div>
          </div>

          {/* Active Workspace / Tenant Selector */}
          <div className="mt-6 relative" ref={workspaceRef}>
            <p className="text-[8px] font-sans text-slate-500 uppercase tracking-widest mb-1.5 px-1">Active node cluster</p>
            <button
              onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
              className="w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl bg-cyan-950/5 hover:bg-cyan-950/15 border border-cyan-500/10 hover:border-cyan-500/30 text-left transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[11px] font-extrabold text-cyan-300 truncate">{activeTenant.name}</span>
              </div>
              <Icon name="ChevronDown" size={12} className="text-cyan-400 shrink-0" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {workspaceDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ cubicBezier: [0.25, 1, 0.5, 1], duration: 0.2 }}
                  className="absolute left-0 right-0 mt-1.5 p-2 rounded-xl bg-slate-950 border border-cyan-500/10 shadow-2xl z-50 space-y-1"
                >
                  <p className="text-[8px] font-sans text-slate-500 uppercase tracking-wider px-2 py-1">Nodes Directory ID</p>
                  {tenants.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        switchTenant(t.id);
                        showNotification(`Calibrated Workspace to ${t.name}`);
                        setWorkspaceDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                        activeTenant.id === t.id
                          ? "bg-cyan-500/5 text-cyan-300"
                          : "hover:bg-white/[0.02] text-slate-400 hover:text-white"
                      }`}
                    >
                      <span className="text-[11px] font-bold truncate">{t.name}</span>
                      {activeTenant.id === t.id && <div className="w-1 h-1 rounded-full bg-cyan-400" />}
                    </button>
                  ))}
                  <div className="h-[1px] bg-white/[0.04] my-1" />
                  <button
                    onClick={() => {
                      setOnboardingOpen(true);
                      setWorkspaceDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-[10.5px] font-bold text-purple-400 hover:bg-purple-500/5 transition-colors cursor-pointer"
                  >
                    <Icon name="Plus" size={12} />
                    <span>Onboard New Tenant...</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Items (Sleek minimalist layout) */}
          <nav className="mt-8 space-y-1.5">
            <button
              onClick={() => {
                launchApp(null);
                setCurrentTab("dashboard");
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold select-none transition-all duration-300 ${
                !activeAppId && currentTab === "dashboard"
                  ? "bg-white/[0.03] text-cyan-400 border border-white/[0.04]"
                  : "text-slate-400 hover:text-slate-100 border border-transparent"
              }`}
            >
              <Icon name="LayoutGrid" size={15} />
              <span>Ecosystem Station</span>
            </button>

            <button
              onClick={() => {
                launchApp(null);
                setCurrentTab("vault");
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold select-none transition-all duration-300 ${
                !activeAppId && currentTab === "vault"
                  ? "bg-white/[0.03] text-cyan-400 border border-white/[0.04]"
                  : "text-slate-400 hover:text-slate-100 border border-transparent"
              }`}
            >
              <Icon name="Key" size={15} />
              <span>Credentials Vault</span>
            </button>

            {/* Strictly render background telemetry logs for Master profile */}
            {activeProfile.role === "Developer" && (
              <button
                onClick={() => {
                  launchApp(null);
                  setCurrentTab("logs");
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold select-none transition-all duration-300 ${
                  !activeAppId && currentTab === "logs"
                    ? "bg-white/[0.03] text-cyan-400 border border-white/[0.04]"
                    : "text-slate-400 hover:text-slate-100 border border-transparent"
                }`}
              >
                <Icon name="Activity" size={15} />
                <span>Telemetry Ledger</span>
              </button>
            )}
          </nav>
        </div>

        {/* System Monitoring Metrics - Minimal, Non-mono */}
        <div className="p-6 border-t border-white/[0.02]">
          <div className="space-y-4 mb-6">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-sans">
                <span>SYSTEM CORE LOAD</span>
                <span className="text-cyan-400 font-semibold">{systemCpu}%</span>
              </div>
              <div className="w-full h-[3px] bg-white/[0.02] rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-1000"
                  style={{ width: `${systemCpu}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-sans">
                <span>BUFFER RAM ALLOC</span>
                <span className="text-purple-400 font-semibold">{systemRam}%</span>
              </div>
              <div className="w-full h-[3px] bg-white/[0.02] rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all duration-1000"
                  style={{ width: `${systemRam}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Elegant Account Layer Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.03] text-left transition-all duration-300 cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-lg ${activeProfile.avatar} flex items-center justify-center font-bold text-white text-xs`}>
                {activeProfile.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-slate-200 truncate">{activeProfile.name}</p>
                <p className="text-[9px] text-slate-500 font-medium truncate">{getEnterpriseRoleLabel(activeProfile.role)}</p>
              </div>
              <Icon name="ChevronUp" size={14} className="text-slate-500" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {profileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ cubicBezier: [0.25, 1, 0.5, 1], duration: 0.2 }}
                  className="absolute bottom-16 left-0 right-0 p-2 rounded-2xl bg-slate-950 border border-white/[0.04] shadow-2xl z-50 space-y-1"
                >
                  <p className="text-[9px] font-sans text-slate-500 uppercase tracking-wider px-3 py-1.5">Switch profile context</p>
                  {profiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        switchProfile(p.id);
                        showNotification(`Calibrated interface for ${p.name}`);
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-colors ${
                        activeProfile.id === p.id
                          ? "bg-white/[0.04] text-white"
                          : "hover:bg-white/[0.02] text-slate-400 hover:text-white"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-md ${p.avatar} flex items-center justify-center font-bold text-[10px] text-white`}>
                        {p.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold leading-tight truncate">{p.name}</p>
                        <p className="text-[8.5px] text-slate-500 truncate">{getEnterpriseRoleLabel(p.role)}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>

      {/* Main Panel Frame */}
      <main className="flex-1 flex flex-col z-10 overflow-hidden relative">
        
        {/* Sleek suspended topbar */}
        <header className="h-16 flex items-center justify-between px-6 lg:px-8 bg-slate-950/30 backdrop-blur-md border-b border-white/[0.01] z-20">
          
          {/* Path tracker or back arrow */}
          <div className="flex items-center gap-4">
            {activeAppId ? (
              <button
                onClick={() => launchApp(null)}
                className="flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors bg-white/[0.02] border border-white/[0.04] rounded-full px-4 py-1.5 hover:bg-white/[0.05] cursor-pointer"
              >
                <Icon name="ArrowLeft" size={12} />
                <span>Exit Desk App</span>
              </button>
            ) : (
              <div className="flex items-center gap-3 font-sans">
                <span className="text-[9px] tracking-widest px-2 py-0.5 rounded bg-white/[0.02] border border-white/[0.04] text-cyan-400 uppercase font-semibold">
                  SYSTEM TIME
                </span>
                {/* Standard clock typography (non-mono Inter) */}
                <span className="text-xs font-semibold text-slate-300">
                  {new Date().toISOString().split("T")[0]} &middot; 13:17 UTC
                </span>
              </div>
            )}
          </div>

          {/* FLOATING SPOTLIGHT SECONDBRAIN COMMAND PILOT TRIGGER (Center aligned) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center z-40">
            <div
              onClick={() => setAiSpotlightOpen(true)}
              style={{
                background: "rgba(15, 15, 23, 0.4)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderColor: "rgba(255, 255, 255, 0.02)"
              }}
              className="h-10 px-4 rounded-full border flex items-center gap-3 hover:border-cyan-500/30 shadow-md shadow-black/40 cursor-pointer transition-all duration-300 select-none group"
            >
              {/* RESTING NEON PURPLE ORB INDICATOR */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-2.5 h-2.5 rounded-full bg-purple-500/50 blur-[3px] animate-ping" />
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_10px_#a855f7]" />
              </div>

              <div className="text-[11px] text-slate-400 tracking-wide font-sans flex items-center gap-1.5">
                <span>AI Search Apps</span>
                <span className="text-[9px] text-slate-600 font-sans border border-white/[0.05] px-1 py-0.5 rounded leading-none">
                  ⌘K
                </span>
              </div>

              <Icon name="Search" size={13} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Settings Button */}
            {onSettingsClick && (
              <button
                onClick={onSettingsClick}
                className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.03] hover:border-white/[0.08] text-slate-400 hover:text-white transition-all"
                title="Settings"
              >
                <Icon name="Settings" size={16} />
              </button>
            )}

            {/* Quick stats on mobile / profile switcher */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-center font-bold text-white text-xs cursor-pointer"
              >
                {activeProfile.name.charAt(0)}
              </button>
            </div>
          </div>
        </header>

        {/* Active Workspace Viewport */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 z-10">
          {children}
        </div>
      </main>

      {/* DETAILED CHAT TERMINAL SLIDE-OUT PANEL (Spotlight overlay version) */}
      <AnimatePresence>
        {spotlightOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4 font-sans"
          >
            <motion.div
              ref={spotlightRef}
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              transition={{ cubicBezier: [0.25, 1, 0.5, 1], duration: 0.35 }}
              style={{
                background: "rgba(10, 10, 15, 0.85)",
                backdropFilter: "blur(24px)",
                borderColor: "rgba(255, 255, 255, 0.04)"
              }}
              className="w-full max-w-2xl rounded-2xl border flex flex-col max-h-[80vh] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* Header inside Spotlight */}
              <div className="p-3 border-b border-white/[0.03] flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
                  <span className="text-[10px] uppercase font-sans font-semibold text-purple-400 tracking-wider">
                    Secondbrain Intelligence Console
                  </span>
                  <span className="text-[8.5px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-mono tracking-wider">
                    {activeAppMeta.activeSchema}
                  </span>
                </div>
                <button
                  onClick={() => setSpotlightOpen(false)}
                  className="p-1 rounded bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Icon name="X" size={14} />
                </button>
              </div>

              {/* Chat Stream View */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[45vh] scrollbar">
                {chatHistory.map((chat, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border leading-relaxed text-xs leading-normal ${
                      chat.role === "user"
                        ? "bg-cyan-500/5 border-cyan-500/10 text-cyan-200 ml-12 text-right"
                        : "bg-purple-900/10 border-purple-500/10 text-purple-100 mr-12"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5 opacity-40 text-[9px] font-sans justify-start">
                      <span>{chat.role === "user" ? ":: CLIENT_PARAMETER_PROMPT" : ":: COGNITIVE_PIPELINE"}</span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed inline-block text-left">{chat.content}</p>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex items-center gap-2.5 bg-purple-950/10 border border-purple-500/15 p-4 rounded-xl mr-12 anim-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
                    <span className="text-[10px] text-purple-300 font-medium">Synthesizing corporate parameters...</span>
                  </div>
                )}
              </div>

              {/* Suggestion prompt chips helper */}
              <div className="px-5 py-2.5 border-t border-white/[0.02] flex gap-2 overflow-x-auto bg-white/[0.01]">
                <button
                  onClick={() => setChatInput("Check active servers state")}
                  className="text-[9px] font-sans font-medium whitespace-nowrap bg-white/[0.03] border border-white/[0.05] hover:border-purple-400/40 px-2.5 py-1 rounded-full text-slate-400 hover:text-purple-300 transition-colors"
                >
                  Check Servers
                </button>
                <button
                  onClick={() => setChatInput("Simulate budget event forecast")}
                  className="text-[9px] font-sans font-medium whitespace-nowrap bg-white/[0.03] border border-white/[0.05] hover:border-purple-400/40 px-2.5 py-1 rounded-full text-slate-400 hover:text-purple-300 transition-colors"
                >
                  Budget Event
                </button>
                <button
                  onClick={() => setChatInput("Are Razia's credentials verified?")}
                  className="text-[9px] font-sans font-medium whitespace-nowrap bg-white/[0.03] border border-white/[0.05] hover:border-purple-400/40 px-2.5 py-1 rounded-full text-slate-400 hover:text-purple-300 transition-colors"
                >
                  Razia Status
                </button>
              </div>

              {/* Direct Console Command input bar */}
              <form onSubmit={handleChatSendMessage} className="p-4 border-t border-white/[0.03] bg-black/40 flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Inquire cognitive nervous system... Ask anything."
                  className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-2.5 text-xs text-purple-100 placeholder-purple-900/60 focus:outline-none focus:border-purple-400/50"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105 active:scale-95 transition-all text-xs flex items-center justify-center cursor-pointer shadow-lg shadow-purple-500/10"
                >
                  <Icon name="Send" size={13} />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ONBOARDING REGISTRATION MODAL */}
      <AnimatePresence>
        {onboardingOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-md rounded-2xl border border-purple-500/20 bg-slate-950 p-6 shadow-[0_0_50px_rgba(168,85,247,0.15)] space-y-4"
            >
              <div>
                <span className="text-[9px] text-purple-400 font-bold uppercase tracking-widest block">SAAS HANDSHAKE PROTOCOL</span>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Onboard Tenant Workspace</h3>
                <p className="text-xs text-slate-400">Register a new client node and enable specific microapps for their workspace environment.</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newWorkspaceName.trim()) return;
                  const nt = registerTenant(newWorkspaceName, newWorkspaceDesc, newEnabledApps);
                  showNotification(`Provisioned cluster ${nt.name}`);
                  setOnboardingOpen(false);
                  setNewWorkspaceName("");
                  setNewWorkspaceDesc("");
                  switchTenant(nt.id);
                }}
                className="space-y-4 text-xs"
              >
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block font-sans">Workspace Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Enterprise Core Lab"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    className="w-full bg-slate-100/5 border border-white/[0.05] rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block font-sans">Description</label>
                  <input
                    type="text"
                    placeholder="e.g., Regional sales dashboard logs"
                    value={newWorkspaceDesc}
                    onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                    className="w-full bg-slate-100/5 border border-white/[0.05] rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/40"
                  />
                </div>

                <div className="space-y-2 border-t border-white/[0.02] pt-3">
                  <label className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                    Select Enabled Microapps
                  </label>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "secondbrain", name: "Secondbrain AI" },
                      { id: "financeplay", name: "FinancePlay Hub" },
                      { id: "projectcupid", name: "Project Cupid" },
                      { id: "lifestack", name: "Lifestack Habits" },
                      { id: "deenify", name: "Deenify Compass" },
                      { id: "familyverse", name: "Familyverse Board" },
                      { id: "familytree", name: "Familytree Map" }
                    ].map((app) => {
                      const isChecked = newEnabledApps.includes(app.id);
                      return (
                        <button
                          type="button"
                          key={app.id}
                          onClick={() => {
                            if (isChecked) {
                              setNewEnabledApps(prev => prev.filter(x => x !== app.id));
                            } else {
                              setNewEnabledApps(prev => [...prev, app.id]);
                            }
                          }}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                            isChecked
                              ? "bg-purple-500/10 border-purple-500/30 text-purple-200"
                              : "bg-white/[0.01] border-white/[0.03] text-slate-400 grayscale-50 hover:grayscale-0 hover:border-white/[0.1]"
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded border select-none flex items-center justify-center overflow-hidden transition-all text-[8px] font-bold ${
                            isChecked ? "bg-purple-500 border-purple-400 text-slate-950" : "border-slate-600"
                          }`}>
                            {isChecked && "✓"}
                          </div>
                          <span className="text-[10px] font-bold leading-none">{app.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setOnboardingOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] text-slate-300 font-bold uppercase text-[9px] tracking-wider transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white font-display font-bold uppercase text-[9px] tracking-wider hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-lg shadow-purple-500/10"
                  >
                    Assemble Cluster
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
