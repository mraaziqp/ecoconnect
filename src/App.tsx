import React, { useState, useEffect } from "react";
import { GlobalStateProvider, useGlobalState } from "./context/GlobalStateContext";
import { EventBusProvider, useEventBus } from "./context/EventBusContext";
import { TenantProvider, useTenant } from "./context/TenantContext";
import { appsRegistry } from "./registry";
import { Icon } from "./components/ui/Icon";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Onboarding } from "./components/Onboarding";
import { SettingsPanel } from "./components/SettingsPanel";

// Import modular layouts and components
import { AppShell } from "./components/AppShell";
import { GlassCard } from "./components/GlassCard";

// Import modular view components
import { FinancePlayView } from "./components/views/FinancePlayView";
import { ProjectCupidView } from "./components/views/ProjectCupidView";
import { UtilityApps } from "./components/views/UtilityApps";
import { FamilyApps } from "./components/views/FamilyApps";
import { HustleStudioView } from "./components/views/HustleStudioView";
import { LifestackView } from "./components/views/LifestackView";
import { SecondbrainView } from "./components/views/SecondbrainView";
import { ApiVaultView } from "./components/views/ApiVaultView";
import { KeyManagerVault } from "./components/views/KeyManagerVault";

function NexusHubShell() {
  const {
    activeProfile,
    profiles,
    switchProfile,
    activeAppId,
    launchApp,
    vaultKeys,
    addVaultKey,
    deleteVaultKey,
    updateVaultKey,
  } = useGlobalState();

  const { activeTenant, tenants, switchTenant, tenantData, setTenantData } = useTenant();

  const { logs, publishEvent, clearLogs } = useEventBus();

  // Professional UI States
  const [showOnboarding, setShowOnboarding] = useState(() => {
    const seen = localStorage.getItem("nexus_onboarding_seen");
    return !seen;
  });
  const [showSettings, setShowSettings] = useState(false);

  // Navigation tabs: 'dashboard', 'vault', 'logs'
  const [currentTab, setCurrentTab] = useState<"dashboard" | "vault" | "logs">("dashboard");

  // Secondbrain AI Chat States
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "secondbrain"; content: string }>>([
    {
      role: "secondbrain",
      content: "Neural channels active, Colleague. Secondbrain AI is ready to orchestrate your operational matrices. What challenges are we solving today?",
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Global Search / Command Bar States (Spotlight)
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRecommendations, setSearchRecommendations] = useState<any[]>([]);
  const [searchSummary, setSearchSummary] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  // Stats simulation
  const [systemCpu, setSystemCpu] = useState(24);
  const [systemRam, setSystemRam] = useState(48);

  // App-specific internal demo simulation states
  // 1. FinancePlay budget ledger
  const [financeTransactions, setFinanceTransactions] = useState<Array<{ desc: string; amount: number; type: "income" | "expense" }>>([]);
  const [newTransactionDesc, setNewTransactionDesc] = useState("");
  const [newTransactionAmount, setNewTransactionAmount] = useState("");
  const [newTransactionType, setNewTransactionType] = useState<"income" | "expense">("expense");

  // 2. Project Cupid memory logs
  const [cupidDates, setCupidDates] = useState<Array<{ title: string; rating: number; date: string }>>([]);
  const [newDateTitle, setNewDateTitle] = useState("");
  const [cupidSyncRating, setCupidSyncRating] = useState(96);

  // 3. Lifestack checklists
  const [lifestackHabits, setLifestackHabits] = useState<Array<{ id: string; text: string; done: boolean }>>([]);

  // 4. OpsNexus cloud indicators
  const [opsNodes, setOpsNodes] = useState([
    { id: "n1", name: "secondbrain-daemon-core", status: "online", load: 12, port: 3000 },
    { id: "n2", name: "financeplay-sqlite-replica", status: "online", load: 8, port: 8081 },
    { id: "n3", name: "deenify-prayer-times-cron", status: "online", load: 2, port: 9000 },
    { id: "n4", name: "smlys-compiler-sandbox", status: "idle", load: 1, port: 5173 },
  ]);

  // 5. Deenify prayer widgets
  const [dhikrCount, setDhikrCount] = useState(0);
  const [dhikrTarget, setDhikrTarget] = useState("SubhanAllah");
  const prayerTimes = {
    Fajr: "05:12",
    Dhuhr: "12:35",
    Asr: "15:48",
    Maghrib: "18:22",
    Isha: "19:55",
  };

  // 6. Familyverse notices board
  const [notices, setNotices] = useState<Array<{ id: string; author: string; color: string; text: string; date: string }>>([]);
  const [newNoticeText, setNewNoticeText] = useState("");

  // 7. Familytree state details
  const [selectedAncestor, setSelectedAncestor] = useState<string>("father");

  // 8. Hustle projects status states
  const [dialABraaiPlatters] = useState([
    { id: "p1", name: "Kameeldoring Classic Braai Platter", price: 340, stock: "Available" },
    { id: "p2", name: "Steakhouse Flame Karoo Ribs Pack", price: 520, stock: "Available" },
    { id: "p3", name: "Supermax Deluxe Feast Tray", price: 850, stock: "Pre-order" },
  ]);

  // SOUND / CHIME RECALIBRATION SIMULATOR
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  // MULTI-TENANT ISOLATION DATA HYDRATION FLOW
  useEffect(() => {
    const data = tenantData[activeTenant.id];
    if (data) {
      setFinanceTransactions(data.financeTransactions || []);
      setCupidDates(data.cupidDates || []);
      setCupidSyncRating(data.cupidSyncRating ?? 90);
      setLifestackHabits(data.lifestackHabits || []);
      setNotices(data.notices || []);
      setDhikrCount(data.dhikrCount ?? 0);
      setDhikrTarget(data.dhikrTarget || "SubhanAllah");
      setSelectedAncestor(data.selectedAncestor || "father");
    }
  }, [activeTenant.id]);

  // Synchronize state changes back to tenant data maps
  useEffect(() => {
    // Only update if database array actually loaded to prevent overwriting on first tick
    if (activeTenant.id) {
      setTenantData((prev) => ({
        ...prev,
        [activeTenant.id]: {
          financeTransactions,
          cupidDates,
          cupidSyncRating,
          lifestackHabits,
          notices,
          dhikrCount,
          dhikrTarget,
          selectedAncestor
        }
      }));
    }
  }, [financeTransactions, cupidDates, cupidSyncRating, lifestackHabits, notices, dhikrCount, dhikrTarget, selectedAncestor, activeTenant.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemCpu((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(5, Math.min(95, prev + delta));
      });
      setSystemRam((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(40, Math.min(85, prev + delta));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const showNotification = (msg: string) => {
    setActiveNotification(msg);
    setTimeout(() => setActiveNotification(null), 4000);
  };

  // Search logic handler
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    publishEvent("Secondbrain", "search_query", `Initiative Command Search index: "${searchQuery}"`);

    try {
      const response = await fetch("/api/secondbrain/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, apps: appsRegistry }),
      });
      const data = await response.json();
      setSearchRecommendations(data.recommendations || []);
      setSearchSummary(data.aiSummary || "");

      if (data.recommendations && data.recommendations.length > 0) {
        showNotification(`Cognitive target identified: ${data.recommendations[0].appId}`);
      }
    } catch (err) {
      console.error(err);
      publishEvent("Secondbrain", "search_error", "Dynamic index handshake timeout.");
    } finally {
      setSearchLoading(false);
    }
  };

  // Ask Secondbrain AI
  const handleChatSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput;
    setChatInput("");
    setChatHistory((prev) => [...prev, { role: "user", content: userMsg }]);
    setChatLoading(true);

    publishEvent("User", "assistant_chat_sent", `Ecosystem request: "${userMsg.substring(0, 40)}"`);

    try {
      const contextPayload = {
        activeProfile,
        activeAppId,
        recentLogs: logs.slice(0, 4),
      };

      const response = await fetch("/api/secondbrain/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatHistory, { role: "user", content: userMsg }].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          context: contextPayload,
        }),
      });

      const data = await response.json();
      setChatHistory((prev) => [...prev, { role: "secondbrain", content: data.text }]);
      publishEvent("Secondbrain", "assistant_chat_received", `Neural parameters computed successfully.`);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "secondbrain",
          content: "❌ **Handshake Aborted:** Critical operational nodes recovering. Please re-submit parameters.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Filtering modules strictly based on active profile scopes and tenant enabledApps list
  const filteredApps = appsRegistry.filter((app) => {
    const isAllowedCat = activeProfile.allowedCategories.includes(app.category);
    const passesDevReq = !app.developerOnly || activeProfile.role === "Developer";
    const isEnabledInTenant = activeTenant.enabledApps.includes(app.id);
    return isAllowedCat && passesDevReq && isEnabledInTenant;
  });

  const isPartner = activeProfile.id === "razia-partner";

  return (
    <>
      <Onboarding
        isOpen={showOnboarding}
        onComplete={() => {
          localStorage.setItem("nexus_onboarding_seen", "true");
          setShowOnboarding(false);
        }}
      />
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />

      <AppShell
        activeProfile={activeProfile}
        profiles={profiles}
        switchProfile={switchProfile}
        activeAppId={activeAppId}
        launchApp={launchApp}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        logs={logs}
        clearLogs={clearLogs}
        showNotification={showNotification}
        chatInput={chatInput}
        setChatInput={setChatInput}
        chatHistory={chatHistory}
        chatLoading={chatLoading}
        handleChatSendMessage={handleChatSendMessage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearchSubmit={handleSearchSubmit}
        searchLoading={searchLoading}
        searchRecommendations={searchRecommendations}
        searchSummary={searchSummary}
        setSearchRecommendations={setSearchRecommendations}
        setSearchSummary={setSearchSummary}
        systemCpu={systemCpu}
        systemRam={systemRam}
        onSettingsClick={() => setShowSettings(true)}
      >
      {/* Absolute System Banner Notification */}
      {activeNotification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-slate-950/90 border border-cyan-500/30 backdrop-blur-3xl px-5 py-3 rounded-full shadow-2xl animate-bounce">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-2.5 h-2.5 rounded-full bg-cyan-400/50 blur-[3px] animate-ping" />
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          </div>
          <p className="text-[11px] font-sans font-semibold text-cyan-300">{activeNotification}</p>
        </div>
      )}

      {/* RENDER VIEW SCHEDULISTS */}
      {activeAppId ? (
        <div className="flex flex-col h-full">
          {activeAppId === "secondbrain" && (
            <SecondbrainView
              publishEvent={publishEvent}
              showNotification={showNotification}
              clearLogs={clearLogs}
              setSpotlightOpen={(val) => {
                // Focus spotlight from Secondbrain dashboard view
                const tr = document.querySelector('[class*="group border-b"]') as HTMLElement;
                if (tr) tr.click();
              }}
            />
          )}

          {activeAppId === "financeplay" && (
            <FinancePlayView
              transactions={financeTransactions}
              setTransactions={setFinanceTransactions}
              newDesc={newTransactionDesc}
              setNewDesc={setNewTransactionDesc}
              newAmount={newTransactionAmount}
              setNewAmount={setNewTransactionAmount}
              newType={newTransactionType}
              setNewType={setNewTransactionType}
              publishEvent={publishEvent}
              showNotification={showNotification}
            />
          )}

          {activeAppId === "projectcupid" && (
            <ProjectCupidView
              dates={cupidDates}
              setDates={setCupidDates}
              newDateTitle={newDateTitle}
              setNewDateTitle={setNewDateTitle}
              syncRating={cupidSyncRating}
              setSyncRating={setCupidSyncRating}
              activeProfile={activeProfile}
              publishEvent={publishEvent}
              showNotification={showNotification}
            />
          )}

          {activeAppId === "lifestack" && (
            <LifestackView
              habits={lifestackHabits}
              setHabits={setLifestackHabits}
              publishEvent={publishEvent}
              showNotification={showNotification}
            />
          )}

          {(activeAppId === "opsnexus" || activeAppId === "smlysapploader") && (
            <UtilityApps
              appId={activeAppId}
              opsNodes={opsNodes}
              setOpsNodes={setOpsNodes}
              vaultKeysCount={vaultKeys.length}
              publishEvent={publishEvent}
              showNotification={showNotification}
            />
          )}

          {(activeAppId === "deenify" || activeAppId === "familyverse" || activeAppId === "familytree") && (
            <FamilyApps
              appId={activeAppId}
              dhikrCount={dhikrCount}
              setDhikrCount={setDhikrCount}
              dhikrTarget={dhikrTarget}
              setDhikrTarget={setDhikrTarget}
              prayerTimes={prayerTimes}
              notices={notices}
              setNotices={setNotices}
              newNoticeText={newNoticeText}
              setNewNoticeText={setNewNoticeText}
              selectedAncestor={selectedAncestor}
              setSelectedAncestor={setSelectedAncestor}
              activeProfileName={activeProfile.name}
              activeProfileId={activeProfile.id}
              publishEvent={publishEvent}
              showNotification={showNotification}
            />
          )}

          {activeAppId === "hustlestudio" && (
            <HustleStudioView
              platters={dialABraaiPlatters}
              showNotification={showNotification}
            />
          )}
        </div>
      ) : currentTab === "vault" ? (
        <div className="flex flex-col gap-8">
          <div className="border-b border-white/[0.02] pb-2">
            <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-1 block">Administrative Secrets Warehouse</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight font-display">Credentials Secure Vault</h2>
            <p className="text-xs text-slate-400 font-sans">Ingest sensitive ecosystem client secrets, spawn workspace-level multi-tenant AI tokens, and calibrate granular RBAC routes.</p>
          </div>
          
          <KeyManagerVault />
          
          <div className="border-t border-white/[0.04] pt-8">
            <ApiVaultView
              vaultKeys={vaultKeys}
              newKeyName={newTransactionDesc} // reuse temporary input fields elegantly
              setNewKeyName={setNewTransactionDesc}
              newKeyValue={newTransactionAmount}
              setNewKeyValue={setNewTransactionAmount}
              addVaultKey={addVaultKey}
              deleteVaultKey={deleteVaultKey}
              showNotification={showNotification}
            />
          </div>
        </div>
      ) : currentTab === "logs" ? (
        // STATE 3: LOGS LEDGER TERMINAL
        <div className="flex-1 flex flex-col gap-6 font-sans">
          <div className="border-b border-white/[0.02] pb-4 flex justify-between items-end">
            <div>
              <span className="text-purple-400 text-[10px] font-bold uppercase tracking-[0.25em] mb-1 block">Central Event Bus Router</span>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight font-display">Telemetry Ledger Stream</h2>
              <p className="text-xs text-slate-400">View real-time event signatures, database registrations, and inter-app telemetry routing.</p>
            </div>
            <button
              onClick={() => {
                clearLogs();
                showNotification("Telemetry logs swept.");
              }}
              className="bg-white/[0.02] border border-white/[0.05] hover:border-red-500/20 px-4 py-2 text-xs font-semibold rounded-xl text-slate-300 hover:text-white cursor-pointer transition-colors"
            >
              Clear Records
            </button>
          </div>

          <div className="p-6 bg-[#09090D] border border-white/[0.02] rounded-2xl flex-1 flex flex-col gap-4 font-mono select-text">
            <div className="flex justify-between items-center text-[10px] text-slate-500 border-b border-white/[0.01] pb-2">
              <span>Channel Matrix: Online &middot; Port 3000</span>
              <span>Active Listeners: Lifestack, Cupid, OpsNexus</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3.5 max-h-[500px]">
              {logs.map((log) => (
                <div key={log.id} className="text-xs flex flex-col gap-1 leading-normal border-b border-white/[0.01] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span className="text-[9px] uppercase tracking-wider font-bold bg-purple-500/10 border border-purple-500/10 text-purple-300 px-2 py-0.5 rounded">
                      {log.appSource}
                    </span>
                    <span className="text-cyan-400 text-[10px]">{log.eventType}</span>
                  </div>
                  <p className="text-slate-300 pl-3 border-l border-white/[0.05] italic">"{log.message}"</p>
                </div>
              ))}
              {logs.length === 0 && (
                <p className="text-slate-500 text-center py-12 italic">Ledger empty. Recompile nodes or trigger application logs to compile events feed.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        // STATE 4: THE PRIMARY WORKSPACE DASHBOARD (App Grid)
        <div className="flex-1 flex flex-col gap-8 font-sans">
          
          {/* RAZIA'S SPOUSE SPOTLIGHT ACCENT - PERSONALIZED PARTNER EXPERIENCE */}
          {isPartner && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl border border-purple-500/10 bg-gradient-to-br from-purple-950/15 via-[#0D0D12] to-transparent shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 flex items-center gap-1">
                <Icon name="Activity" size={12} className="text-purple-400 animate-pulse" />
                <span className="text-[8.5px] font-sans font-bold text-slate-500 tracking-wider">MAPPED COLLABORATIVE CALIBRATION</span>
              </div>

              <div className="md:col-span-1 space-y-2">
                <span className="text-purple-400 text-[9px] font-bold uppercase tracking-widest block">PERSONALIZED PRESETS</span>
                <h2 className="text-xl font-black text-white font-display uppercase tracking-tight">Razia Partner Deck</h2>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Your customized portal highlights wedding countdown metrics, contract sandbox drafts, leaving operational nodes hidden.
                </p>
              </div>

              {/* Quick links */}
              <div className="p-4 bg-white/[0.01] border border-white/[0.02] rounded-xl hover:border-purple-400/40 cursor-pointer transition-all flex flex-col justify-between" onClick={() => launchApp("projectcupid")}>
                <div className="flex justify-between items-start">
                  <span className="text-[9.5px] font-extrabold uppercase text-slate-400">Wedding Milestones</span>
                  <Icon name="Heart" size={13} className="text-purple-400" />
                </div>
                <div className="mt-3">
                  <p className="text-xs font-bold text-white uppercase">Pin: September 6th Timeline</p>
                  <p className="text-[10px] text-slate-500 mt-1">Countdown active on Project Cupid</p>
                </div>
              </div>

              <div className="p-4 bg-white/[0.01] border border-white/[0.02] rounded-xl hover:border-cyan-400/40 cursor-pointer transition-all flex flex-col justify-between" onClick={() => launchApp("projectcupid")}>
                <div className="flex justify-between items-start">
                  <span className="text-[9.5px] font-extrabold uppercase text-slate-400">Law Assignments Study Drawer</span>
                  <Icon name="Briefcase" size={13} className="text-cyan-450" />
                </div>
                <div className="mt-3">
                  <p className="text-xs font-bold text-white uppercase">Constitutional Law Sandbox</p>
                  <p className="text-[10px] text-slate-500 mt-1">2 files available to preview</p>
                </div>
              </div>
            </div>
          )}

          {/* Productivity Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold text-slate-500 flex items-center gap-2 px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
              <span>Productivity & Lifestyle Nodes</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApps
                .filter((app) => app.category === "productivity" || app.category === "core")
                .map((app) => (
                  <GlassCard
                    key={app.id}
                    app={app}
                    onClick={() => {
                      launchApp(app.id);
                      showNotification(`${app.name} context map calibrated successfully.`);
                    }}
                  />
                ))}
            </div>
          </div>

          {/* Community Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold text-slate-500 flex items-center gap-2 px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]"></span>
              <span>Community & Family Directories</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApps
                .filter((app) => app.category === "community")
                .map((app) => (
                  <GlassCard
                    key={app.id}
                    app={app}
                    onClick={() => {
                      launchApp(app.id);
                      showNotification(`Lineage directories loaded for ${app.name}`);
                    }}
                  />
                ))}
            </div>
          </div>

          {/* Sandbox Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold text-slate-500 flex items-center gap-2 px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"></span>
              <span>Sandbox & Hustle Workspace</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                onClick={() => {
                  launchApp("hustlestudio");
                  showNotification("Custom website requests sandbox active.");
                }}
                style={{
                  background: "rgba(13, 13, 18, 0.45)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  borderColor: "rgba(255, 255, 255, 0.02)"
                }}
                className="group p-5 rounded-2xl border flex flex-col justify-between h-44 hover:shadow-amber-500/10 hover:border-amber-500/30 transition-all cursor-pointer hover:scale-[1.01]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                      <Icon name="Activity" size={20} />
                    </div>
                    <span className="text-[9px] px-2.5 py-0.5 rounded-full font-sans font-semibold tracking-wider uppercase border bg-amber-500/10 text-amber-300 border-amber-500/20">
                      SANDBOX
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-100 font-display">Hustle Showcase Console</h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    Access catering order books for Dial-a-Braai, hardware repairs staging, and custom code canvases.
                  </p>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/[0.03]">
                  <span className="text-[9px] text-slate-500 font-mono">SANDBOX // DIAL_A_BRAAI</span>
                  <Icon name="ArrowRight" size={14} className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </div>

          {/* SYSTEM DAEMONS SECTION - EXCLUSIVELY AVAILABLE FOR MASTER DEVELOPER PROFILE */}
          {activeProfile.role === "Developer" && (
            <div className="flex flex-col gap-4">
              <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold text-slate-500 flex items-center gap-2 px-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]"></span>
                <span>Administrative Node Monitors & Daemons (System Limit)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApps
                  .filter((app) => app.category === "utility")
                  .map((app) => (
                    <GlassCard
                      key={app.id}
                      app={app}
                      onClick={() => {
                        launchApp(app.id);
                        showNotification(`${app.name} server monitors connected.`);
                      }}
                    />
                  ))}
              </div>
            </div>
          )}

        </div>
      )}
    </AppShell>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <GlobalStateProvider>
        <EventBusProvider>
          <TenantProvider>
            <NexusHubShell />
          </TenantProvider>
        </EventBusProvider>
      </GlobalStateProvider>
    </ErrorBoundary>
  );
}
