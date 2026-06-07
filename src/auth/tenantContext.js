import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * Tenant / Workspace Context
 * Manages active tenant states, registers workspaces, and isolates 
 * connected microapp data layers for each tenant cluster.
 */

const TenantContext = createContext();

const defaultTenants = [
  {
    id: "personal-nexus",
    name: "Personal Nexus",
    apiKey: "mak_7f8b9e2c1a5d3f6e4b9c2a8d5f1e3a7c",
    enabledApps: ["secondbrain", "financeplay", "projectcupid", "lifestack", "opsnexus", "deenify", "familyverse", "familytree"],
    description: "Sovereign cloud infrastructure workspace."
  },
  {
    id: "ecosystem-alpha",
    name: "Ecosystem Alpha Client",
    apiKey: "axm_5a964afe59e6bb741257ff492b063960",
    enabledApps: ["secondbrain", "financeplay", "lifestack"],
    description: "Isolated research node for client testing."
  }
];

export const TenantProvider = ({ children }) => {
  const [tenants, setTenants] = useState(() => {
    const saved = localStorage.getItem("nexus_tenants");
    return saved ? JSON.parse(saved) : defaultTenants;
  });

  const [activeTenantId, setActiveTenantId] = useState(() => {
    const saved = localStorage.getItem("nexus_active_tenant_id");
    return saved || defaultTenants[0].id;
  });

  useEffect(() => {
    localStorage.setItem("nexus_tenants", JSON.stringify(tenants));
    localStorage.setItem("nexus_active_tenant_id", activeTenantId);
  }, [tenants, activeTenantId]);

  const activeTenant = tenants.find((t) => t.id === activeTenantId) || tenants[0];

  const switchTenant = (id) => {
    if (tenants.some((t) => t.id === id)) {
      setActiveTenantId(id);
    }
  };

  const registerTenant = (name, description, enabledApps = []) => {
    const tenantId = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.floor(Math.random() * 1000);
    const mockApiKey = "mak_" + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

    const newTenant = {
      id: tenantId,
      name,
      apiKey: mockApiKey,
      enabledApps,
      description
    };

    setTenants((prev) => [...prev, newTenant]);
    return newTenant;
  };

  return (
    <TenantContext.Provider value={{ activeTenant, tenants, switchTenant, registerTenant }}>
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
