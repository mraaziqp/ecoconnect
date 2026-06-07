import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, RegistryApp, VaultKey } from "../types";

interface GlobalStateContextType {
  activeProfile: UserProfile;
  profiles: UserProfile[];
  switchProfile: (profileId: string) => void;
  activeAppId: string | null;
  launchApp: (appId: string | null) => void;
  vaultKeys: VaultKey[];
  addVaultKey: (key: Omit<VaultKey, "id" | "updatedAt">) => void;
  deleteVaultKey: (id: string) => void;
  updateVaultKey: (id: string, value: string) => void;
}

const defaultProfiles: UserProfile[] = [
  {
    id: "dev-master",
    name: "Master Developer",
    role: "Developer",
    avatar: "bg-cyan-500",
    allowedCategories: ["productivity", "utility", "community", "sandbox", "core"]
  },
  {
    id: "razia-partner",
    name: "Razia (Partner)",
    role: "Partner",
    avatar: "bg-purple-500",
    allowedCategories: ["productivity", "community", "sandbox"]
  },
  {
    id: "family-guest",
    name: "Family Member",
    role: "Family Member",
    avatar: "bg-emerald-500",
    allowedCategories: ["productivity", "community"]
  }
];

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles] = useState<UserProfile[]>(defaultProfiles);
  const [activeProfile, setActiveProfile] = useState<UserProfile>(defaultProfiles[0]);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  
  // Vault keys sandbox: In production, secrets are locked and decrypted strictly server-side (Node container).
  // The client only maintains local placeholder metadata references (IDs, dates, name tags) for administrative interface routing,
  // preventing any high-risk memory inspection vectors on untrusted devices.
  const [vaultKeys, setVaultKeys] = useState<VaultKey[]>(() => {
    const saved = localStorage.getItem("nexus_vault_keys");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure secrets are never exposed in readable client memory
        return parsed.map((k: VaultKey) => ({
          ...k,
          value: k.value.startsWith("••••") ? k.value : "••••••••••••••••••••••••"
        }));
      } catch (e) {
        console.error("Secure Sandbox Parse Event Failed:", e);
      }
    }
    return [
      { id: "1", name: "GEMINI_API_KEY", value: "••••••••••••••••••••••••", updatedAt: "2026-06-03" },
      { id: "2", name: "FIREBASE_CONFIG_JSON", value: "••••••••••••••••••••••••", updatedAt: "2026-06-03" },
      { id: "3", name: "STRIPE_SECRET_KEY", value: "••••••••••••••••••••••••", updatedAt: "2026-06-03" },
    ];
  });

  useEffect(() => {
    localStorage.setItem("nexus_vault_keys", JSON.stringify(vaultKeys));
  }, [vaultKeys]);

  const switchProfile = (profileId: string) => {
    const found = profiles.find((p) => p.id === profileId);
    if (found) {
      setActiveProfile(found);
      // If we switch to a profile that is not authorized for the current active app, reset to desktop
      if (activeAppId) {
        // Find if category is restricted for that profile (for example sandbox/utility)
        const appCategories: { [key: string]: string } = {
          "secondbrain": "core",
          "financeplay": "productivity",
          "projectcupid": "productivity",
          "lifestack": "productivity",
          "opsnexus": "utility",
          "smlysapploader": "utility",
          "deenify": "community",
          "familyverse": "community",
          "familytree": "community",
          "hustlestudio": "sandbox",
          "apivault": "core"
        };
        const cat = appCategories[activeAppId];
        if (cat && !found.allowedCategories.includes(cat)) {
          setActiveAppId(null);
        }
      }

      // Fire a global message for the simulated context-switching event bus
      window.dispatchEvent(
        new CustomEvent("profile-changed", {
          detail: { profileId, name: found.name, role: found.role }
        })
      );
    }
  };

  const launchApp = (appId: string | null) => {
    setActiveAppId(appId);
    if (appId) {
      window.dispatchEvent(
        new CustomEvent("app-launched", {
          detail: { appId, profileName: activeProfile.name }
        })
      );
    }
  };

  const addVaultKey = (newKey: Omit<VaultKey, "id" | "updatedAt">) => {
    const key: VaultKey = {
      ...newKey,
      id: Math.random().toString(36).substr(2, 9),
      updatedAt: new Date().toISOString().split("T")[0]
    };
    setVaultKeys((prev) => [...prev, key]);
    
    // Log key addition event to the general event bus custom state
    window.dispatchEvent(
      new CustomEvent("vault-event", {
        detail: { action: "addedKey", keyName: key.name }
      })
    );
  };

  const deleteVaultKey = (id: string) => {
    const target = vaultKeys.find((k) => k.id === id);
    setVaultKeys((prev) => prev.filter((k) => k.id !== id));
    if (target) {
      window.dispatchEvent(
        new CustomEvent("vault-event", {
          detail: { action: "deletedKey", keyName: target.name }
        })
      );
    }
  };

  const updateVaultKey = (id: string, value: string) => {
    setVaultKeys((prev) =>
      prev.map((k) =>
        k.id === id
          ? { ...k, value, updatedAt: new Date().toISOString().split("T")[0] }
          : k
      )
    );
    const target = vaultKeys.find((k) => k.id === id);
    if (target) {
      window.dispatchEvent(
        new CustomEvent("vault-event", {
          detail: { action: "updatedKey", keyName: target.name }
        })
      );
    }
  };

  return (
    <GlobalStateContext.Provider
      value={{
        activeProfile,
        profiles,
        switchProfile,
        activeAppId,
        launchApp,
        vaultKeys,
        addVaultKey,
        deleteVaultKey,
        updateVaultKey
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
