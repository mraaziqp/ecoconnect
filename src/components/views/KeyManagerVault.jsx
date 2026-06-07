import React, { useState } from "react";

/**
 * KeyManagerVault Component (JSX Template Version)
 * Central Vault allowing users to generate and revoke tokens, mapping
 * specific granular permission scopes (RBAC) to system utilities.
 */
export const KeyManagerVault = ({ activeTenant, showNotification }) => {
  const [keys, setKeys] = useState(() => {
    return [
      {
        id: "gk-1",
        name: "Telemetry Pipeline Token",
        key: "mak_sb_82c1e403d65b9ea429a1bcf9c77e110",
        createdBy: "Administrator",
        status: "active",
        permissions: { secondbrain: "full", financeplay: "read" }
      }
    ];
  });

  const [keyName, setKeyName] = useState("");
  const [perms, setPerms] = useState({
    secondbrain: "full",
    financeplay: "read",
    projectcupid: "none"
  });

  const generateKey = (e) => {
    e.preventDefault();
    if (!keyName) return;

    const token = "mak_sb_" + Math.random().toString(36).substr(2, 10);
    const newKey = {
      id: Math.random().toString(),
      name: keyName,
      key: token,
      createdBy: "Administrator",
      status: "active",
      permissions: { ...perms }
    };

    setKeys([...keys, newKey]);
    setKeyName("");
    if (showNotification) showNotification(`Generated token ${newKey.name}`);
  };

  return (
    <div style={{ padding: "20px", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.02)", borderRadius: "12px" }}>
      <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#FFF", marginBottom: "10px" }}>AI Credentials Manager</h3>
      <form onSubmit={generateKey} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          placeholder="Token Label"
          value={keyName}
          onChange={(e) => setKeyName(e.target.value)}
          style={{ background: "#000", border: "1px solid #333", color: "#fff", padding: "8px", borderRadius: "8px" }}
        />
        <button type="submit" style={{ background: "#06b6d4", color: "#000", padding: "8px", borderRadius: "8px", fontWeight: "bold" }}>
          Generate Secure Key
        </button>
      </form>
    </div>
  );
};
