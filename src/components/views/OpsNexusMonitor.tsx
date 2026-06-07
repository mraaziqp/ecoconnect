import React from "react";
import { Icon } from "../ui/Icon";

interface ServerNode {
  id: string;
  name: string;
  status: "online" | "idle" | "offline";
  load: number;
  port: number;
  uptime?: number;
  lastHeartbeat?: string;
}

interface MonitorProps {
  nodes: ServerNode[];
}

export const OpsNexusMonitor: React.FC<MonitorProps> = ({ nodes }) => {
  const onlineNodes = nodes.filter((n) => n.status === "online").length;
  const avgLoad = nodes.reduce((sum, n) => sum + n.load, 0) / Math.max(nodes.length, 1);
  const healthScore = Math.round(
    (onlineNodes / nodes.length) * 100
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500/10 border-green-500/20 text-green-400";
      case "idle":
        return "bg-blue-500/10 border-blue-500/20 text-blue-400";
      case "offline":
        return "bg-red-500/10 border-red-500/20 text-red-400";
      default:
        return "bg-slate-500/10 border-slate-500/20 text-slate-400";
    }
  };

  const getLoadColor = (load: number) => {
    if (load > 70) return "text-red-400";
    if (load > 50) return "text-orange-400";
    return "text-green-400";
  };

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <p className="text-[10px] text-green-400 uppercase tracking-wider font-bold mb-2">
            Online Nodes
          </p>
          <p className="text-3xl font-black text-green-300">
            {onlineNodes}/{nodes.length}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <p className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold mb-2">
            Avg System Load
          </p>
          <p className="text-3xl font-black text-cyan-300">{Math.round(avgLoad)}%</p>
        </div>

        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <p className="text-[10px] text-blue-400 uppercase tracking-wider font-bold mb-2">
            Health Score
          </p>
          <p className="text-3xl font-black text-blue-300">{healthScore}%</p>
        </div>
      </div>

      {/* System Status Gauge */}
      <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.02]">
        <p className="text-xs font-bold text-slate-300 mb-3">Overall System Status</p>
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-white">
              {healthScore >= 90
                ? "Optimal"
                : healthScore >= 70
                  ? "Healthy"
                  : healthScore >= 50
                    ? "Degraded"
                    : "Critical"}
            </span>
            <span className="text-[10px] text-slate-500">{healthScore}%</span>
          </div>
          <div className="w-full h-3 bg-white/[0.05] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                healthScore >= 90
                  ? "bg-green-500"
                  : healthScore >= 70
                    ? "bg-cyan-500"
                    : healthScore >= 50
                      ? "bg-orange-500"
                      : "bg-red-500"
              }`}
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>

        {healthScore < 70 && (
          <p className="text-[10px] text-orange-400 mt-2">
            ⚠️ System degradation detected - investigate offline nodes
          </p>
        )}
      </div>

      {/* Active Nodes */}
      <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.02]">
        <p className="text-xs font-bold text-slate-300 mb-3">Node Cluster Status</p>
        <div className="space-y-2">
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`p-3 rounded-lg border flex items-center justify-between ${getStatusColor(
                node.status
              )}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  node.status === "online"
                    ? "bg-green-400 animate-pulse"
                    : "bg-slate-500"
                }`} />
                <div>
                  <p className="text-sm font-semibold">{node.name}</p>
                  <p className="text-[10px] opacity-70">:{node.port}</p>
                </div>
              </div>

              <div className="text-right">
                <p className={`text-xs font-bold ${getLoadColor(node.load)}`}>
                  {node.load}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.02]">
        <p className="text-xs font-bold text-slate-300 mb-3">Performance Insights</p>
        <div className="space-y-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <Icon name="Zap" size={14} className="text-yellow-400" />
            <span>
              {avgLoad > 70
                ? "High system load - consider load balancing"
                : "Optimal resource allocation"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Server" size={14} className="text-cyan-400" />
            <span>{onlineNodes} active nodes serving requests</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="AlertCircle" size={14} className="text-orange-400" />
            <span>
              {nodes.filter((n) => n.status === "offline").length} node
              {nodes.filter((n) => n.status === "offline").length !== 1 ? "s" : ""}{" "}
              offline
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
