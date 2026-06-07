import React, { createContext, useContext, useState, useEffect } from "react";

export interface TenantWorkspace {
  id: string;
  name: string;
  apiKey: string;
  enabledApps: string[]; // List of appIds enabled in this workspace
  description: string;
}

// Interfaces for tenant-isolated data structures
export interface IsolatedWorkspaceData {
  financeTransactions: Array<{ desc: string; amount: number; type: "income" | "expense" }>;
  cupidDates: Array<{ title: string; rating: number; date: string }>;
  cupidSyncRating: number;
  lifestackHabits: Array<{ id: string; text: string; done: boolean }>;
  notices: Array<{ id: string; author: string; color: string; text: string; date: string }>;
  dhikrCount: number;
  dhikrTarget: string;
  selectedAncestor: string;
}

interface TenantContextType {
  activeTenant: TenantWorkspace;
  tenants: TenantWorkspace[];
  switchTenant: (id: string) => void;
  registerTenant: (name: string, description: string, enabledApps: string[]) => TenantWorkspace;
  toggleApp: (tenantId: string, appId: string) => void;
  tenantData: Record<string, IsolatedWorkspaceData>;
  setTenantData: React.Dispatch<React.SetStateAction<Record<string, IsolatedWorkspaceData>>>;
}

const defaultTenants: TenantWorkspace[] = [
  {
    id: "personal-nexus",
    name: "Personal Nexus",
    apiKey: "mak_7f8b9e2c1a5d3f6e4b9c2a8d5f1e3a7c", // Pre-loaded matching system keys
    enabledApps: ["secondbrain", "financeplay", "projectcupid", "lifestack", "opsnexus", "smlysapploader", "deenify", "familyverse", "familytree"],
    description: "Sovereign cloud infrastructure workspace containing full operational suites."
  },
  {
    id: "ecosystem-alpha",
    name: "Ecosystem Alpha Client",
    apiKey: "axm_5a964afe59e6bb741257ff492b063960",
    enabledApps: ["secondbrain", "financeplay", "lifestack"],
    description: "Isolated research node for client testing, containing restricted productivity indices."
  },
  {
    id: "south-braai-corp",
    name: "Dial-A-Braai Holdings",
    apiKey: "601a699f41445939e101d9d642f3b0386602f225451d972611f972f284a40f6c",
    enabledApps: ["secondbrain", "financeplay", "familyverse"],
    description: "Corporate workspace focused on coordinating commercial wood-fired catering events."
  }
];

// Initial states for isolated data blocks
const createEmptyDataBlock = (): IsolatedWorkspaceData => ({
  financeTransactions: [
    { desc: "Pre-seed Capital Ingestion", amount: 15000, type: "income" },
    { desc: "Local sandbox memory allocate", amount: -210, type: "expense" }
  ],
  cupidDates: [
    { title: "Joint planning session", rating: 5, date: "2026-06-01" }
  ],
  cupidSyncRating: 90,
  lifestackHabits: [
    { id: "h1", text: "Hydrate & Meditate", done: true },
    { id: "h2", text: "Reconcile daily budget ledger", done: false }
  ],
  notices: [
    { id: "n1", author: "System Supervisor", color: "from-cyan-500/10 to-cyan-900/5", text: "Welcome to your new isolated workspace tenant context.", date: "2026-06-03" }
  ],
  dhikrCount: 0,
  dhikrTarget: "Alhamdulillah",
  selectedAncestor: "father"
});

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<TenantWorkspace[]>(() => {
    const saved = localStorage.getItem("nexus_tenants");
    return saved ? JSON.parse(saved) : defaultTenants;
  });

  const [activeTenantId, setActiveTenantId] = useState<string>(() => {
    const saved = localStorage.getItem("nexus_active_tenant_id");
    return saved || defaultTenants[0].id;
  });

  const [tenantData, setTenantData] = useState<Record<string, IsolatedWorkspaceData>>(() => {
    const saved = localStorage.getItem("nexus_tenant_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading isolated tenant data storage maps:", e);
      }
    }
    // Preseed default datas for initial tenants
    return {
      "personal-nexus": {
        financeTransactions: [
          { desc: "SaaS Sales Yield", amount: 4800, type: "income" },
          { desc: "Hardware Server Node Colocation", amount: -450, type: "expense" },
          { desc: "Gemini High-Density Keys API", amount: -120, type: "expense" },
        ],
        cupidDates: [
          { title: "Retro Laser Tag & Braai Date", rating: 5, date: "2026-05-28" },
          { title: "Coastal Sunset Picnic", rating: 4, date: "2026-05-15" },
          { title: "Cosmic Gaming Lounge", rating: 5, date: "2026-05-02" },
        ],
        cupidSyncRating: 96,
        lifestackHabits: [
          { id: "h1", text: "Cold Shower / Cold Plunge", done: true },
          { id: "h2", text: "Deep Focus 90m Blocks", done: false },
          { id: "h3", text: "Islamic Spiritual Dhikr Grid", done: true },
          { id: "h4", text: "Macro Diet Optimization", done: false },
          { id: "h5", text: "45m Weight Lifting Session", done: false },
        ],
        notices: [
          { id: "1", author: "Razia", color: "from-purple-500/10 to-purple-900/5", text: "Don't forget the weekly Dial-a-Braai family dinner this Saturday at 18:00!", date: "2026-06-03" },
          { id: "2", author: "Master", color: "from-cyan-500/10 to-cyan-900/5", text: "Deploying the core Database Bridge to harmonize FinancePlay and Familyverse storage models tonight.", date: "2026-06-02" },
        ],
        dhikrCount: 33,
        dhikrTarget: "SubhanAllah",
        selectedAncestor: "father"
      },
      "ecosystem-alpha": {
        ...createEmptyDataBlock(),
        financeTransactions: [
          { desc: "Alpha Beta Test Project Budget", amount: 8500, type: "income" },
          { desc: "Mock node bandwidth usage", amount: -85, type: "expense" }
        ]
      },
      "south-braai-corp": {
        ...createEmptyDataBlock(),
        notices: [
          { id: "1", author: "Dial-A-Braai", color: "from-amber-500/10 to-amber-900/5", text: "Supermax Feast menu scheduled for weekend update.", date: "2026-06-03" }
        ],
        financeTransactions: [
          { desc: "Braai Masterclass Ticket Proceeds", amount: 12000, type: "income" },
          { desc: "Kameeldoring wood raw procurement", amount: -4500, type: "expense" }
        ]
      }
    };
  });

  useEffect(() => {
    localStorage.setItem("nexus_tenants", JSON.stringify(tenants));
    localStorage.setItem("nexus_active_tenant_id", activeTenantId);
    localStorage.setItem("nexus_tenant_data", JSON.stringify(tenantData));
  }, [tenants, activeTenantId, tenantData]);

  const activeTenant = tenants.find((t) => t.id === activeTenantId) || tenants[0] || defaultTenants[0];

  const switchTenant = (id: string) => {
    if (tenants.some((t) => t.id === id)) {
      setActiveTenantId(id);
    }
  };

  const registerTenant = (name: string, description: string, enabledApps: string[]): TenantWorkspace => {
    // Generate standard UUID-like Tenant ID & API Key reference
    const tenantId = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Math.floor(Math.random() * 1000);
    const mockApiKey = "mak_" + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

    const nextTenant: TenantWorkspace = {
      id: tenantId,
      name,
      apiKey: mockApiKey,
      enabledApps,
      description
    };

    setTenants((prev) => [...prev, nextTenant]);
    setTenantData((prev) => ({
      ...prev,
      [tenantId]: createEmptyDataBlock()
    }));

    return nextTenant;
  };

  const toggleApp = (tenantId: string, appId: string) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id !== tenantId) return t;
        const index = t.enabledApps.indexOf(appId);
        const nextApps = [...t.enabledApps];
        if (index > -1) {
          nextApps.splice(index, 1);
        } else {
          nextApps.push(appId);
        }
        return { ...t, enabledApps: nextApps };
      })
    );
  };

  return (
    <TenantContext.Provider
      value={{
        activeTenant,
        tenants,
        switchTenant,
        registerTenant,
        toggleApp,
        tenantData,
        setTenantData
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};
