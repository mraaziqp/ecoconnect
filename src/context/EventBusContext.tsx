import React, { createContext, useContext, useState, useEffect } from "react";
import { EventLog } from "../types";

interface EventBusContextType {
  logs: EventLog[];
  publishEvent: (appSource: string, eventType: string, message: string, payload?: any) => void;
  clearLogs: () => void;
}

const EventBusContext = createContext<EventBusContextType | undefined>(undefined);

export const EventBusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<EventLog[]>(() => {
    return [
      {
        id: "init-01",
        timestamp: new Date().toISOString(),
        appSource: "Secondbrain",
        eventType: "system_booted",
        message: "Nexus Hub core services initialized on port 3000.",
        payload: { event_bus: "enabled", gateway_state: "listening" }
      },
      {
        id: "init-02",
        timestamp: new Date(Date.now() - 5000).toISOString(),
        appSource: "OpsNexus",
        eventType: "service_online",
        message: "Network core, proxy servers, and API relays are running healthy.",
        payload: { latency: "4ms", load: "0.12%" }
      },
      {
        id: "init-03",
        timestamp: new Date(Date.now() - 2000).toISOString(),
        appSource: "SMLYSAPPLOADER",
        eventType: "loader_ready",
        message: "Ecosystem packages loaded fully. Registry synchronized with 9 apps.",
        payload: { appsLoaded: 9 }
      }
    ];
  });

  const publishEvent = (appSource: string, eventType: string, message: string, payload: any = {}) => {
    const newLog: EventLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      appSource,
      eventType,
      message,
      payload
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 50)); // Store last 50 events
  };

  const clearLogs = () => {
    setLogs([]);
  };

  // Setup listeners for generic browser events representing profile switches or launcher triggers
  useEffect(() => {
    const handleProfileChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      publishEvent(
        "Secondbrain",
        "profile_switched",
        `Context switched to ${customEvent.detail.name} (Role: ${customEvent.detail.role})`,
        customEvent.detail
      );
    };

    const handleAppLaunch = (e: Event) => {
      const customEvent = e as CustomEvent;
      publishEvent(
        "SMLYSAPPLOADER",
        "app_launched",
        `Run trigger executed for '${customEvent.detail.appId}' by user '${customEvent.detail.profileName}'`,
        customEvent.detail
      );
    };

    const handleVaultEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      publishEvent(
        "Secondbrain",
        "vault_modified",
        `Secure credential action: ${customEvent.detail.action} for variable: ${customEvent.detail.keyName}`,
        customEvent.detail
      );
    };

    window.addEventListener("profile-changed", handleProfileChange);
    window.addEventListener("app-launched", handleAppLaunch);
    window.addEventListener("vault-event", handleVaultEvent);

    return () => {
      window.removeEventListener("profile-changed", handleProfileChange);
      window.removeEventListener("app-launched", handleAppLaunch);
      window.removeEventListener("vault-event", handleVaultEvent);
    };
  }, []);

  return (
    <EventBusContext.Provider value={{ logs, publishEvent, clearLogs }}>
      {children}
    </EventBusContext.Provider>
  );
};

export const useEventBus = () => {
  const context = useContext(EventBusContext);
  if (!context) {
    throw new Error("useEventBus must be used within an EventBusProvider");
  }
  return context;
};
