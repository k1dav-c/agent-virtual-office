import { getCoderHost } from "@components/CoderHostSetting";
import PixelLayout from "@components/PixelLayout";
import VirtualOffice from "@components/office/VirtualOffice";
import { useState } from "react";
import { ROLE_CONFIGS, STATUS_COLORS } from "../config/agent-roles";
import { useAgentSessions } from "../hooks/useAgentSessions";
import type { AgentRole } from "../types/agent";

export default function OfficePage() {
  const { sessions, loading, error } = useAgentSessions();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [highlightStatus, setHighlightStatus] = useState<string | null>(null);

  const statusCounts = {
    working: sessions.filter((s) => s.status === "working").length,
    idle: sessions.filter((s) => s.status === "idle").length,
    complete: sessions.filter((s) => s.status === "complete").length,
    failure: sessions.filter((s) => s.status === "failure").length,
  };

  return (
    <PixelLayout>
      <div className="absolute inset-0 flex flex-col">
        {/* ═══ MAIN CONTENT: Map + Sidebar ═══ */}
        <div className="flex-1 flex overflow-hidden">
          {/* ─── MAP AREA (left, takes remaining space) ─── */}
          <div className="flex-1 relative overflow-hidden">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-3 border-2 border-white/20 border-t-blue-400 rounded-full animate-spin" />
                  <p className="text-xs text-white/60">Loading office...</p>
                </div>
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
                  <p className="text-xs text-red-400 font-bold">
                    Connection failed
                  </p>
                  <p className="text-[10px] text-red-300/60 mt-1">
                    {error.message}
                  </p>
                </div>
              </div>
            ) : (
              <VirtualOffice agents={sessions} highlightStatus={highlightStatus} />
            )}
          </div>

          {/* ─── SIDEBAR (right, fixed width) ─── */}
          {sidebarOpen && (
            <div
              className="w-64 flex-shrink-0 flex flex-col z-30"
              style={{
                background: "rgba(30, 28, 36, 0.95)",
                borderLeft: "3px solid #4c566a",
              }}
            >
              {/* Sidebar header */}
              <div className="px-4 py-2 flex items-center justify-end">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-white/40 hover:text-white/80 text-sm cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>
              <hr className="border-0 mx-3" style={{ borderTop: "2px solid #4c566a" }} />

              {/* Status summary bar */}
              <div className="px-4 py-2 flex gap-3">
                {Object.entries(statusCounts).map(([status, count]) => {
                  if (count === 0) return null;
                  const config =
                    STATUS_COLORS[status as keyof typeof STATUS_COLORS];
                  const isActive = highlightStatus === status;
                  return (
                    <button
                      key={status}
                      className="flex items-center gap-1 cursor-pointer rounded px-1 transition-colors"
                      style={{
                        backgroundColor: isActive ? `${config.bg}22` : "transparent",
                        border: isActive ? `1px solid ${config.bg}66` : "1px solid transparent",
                      }}
                      onClick={() => setHighlightStatus(isActive ? null : status)}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: config.bg }}
                      />
                      <span
                        className="text-[9px] text-white/40"
                        style={{ fontFamily: "'Courier New', monospace" }}
                      >
                        {config.label}
                      </span>
                      <span className="text-[9px] text-white/70 font-bold">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Agent list */}
              <div className="flex-1 overflow-auto px-2 py-1">
                {sessions.map((agent) => {
                  const config =
                    ROLE_CONFIGS[agent.role as AgentRole] ||
                    ROLE_CONFIGS.Developer;
                  const status =
                    STATUS_COLORS[agent.status] || STATUS_COLORS.idle;
                  const coderHost = getCoderHost();
                  const wsUrl =
                    agent.workspace && coderHost
                      ? `${coderHost}/@me/${agent.workspace}`
                      : null;

                  return (
                    <div
                      key={agent.id}
                      className="flex items-start gap-2 px-2 py-1.5 rounded hover:bg-white/5 transition-colors group"
                    >
                      {/* Status dot */}
                      <div
                        className={`w-2 h-2 mt-1 rounded-full flex-shrink-0 ${
                          agent.status === "working" ? "animate-pulse" : ""
                        }`}
                        style={{ backgroundColor: status.bg }}
                      />

                      <div className="flex-1 min-w-0">
                        {/* Role name */}
                        <div className="flex items-center gap-1">
                          <span className="text-[10px]">{config.emoji}</span>
                          <span
                            className="text-[10px] font-semibold truncate"
                            style={{ color: config.color }}
                          >
                            {config.label}
                          </span>
                        </div>

                        {/* Summary */}
                        {agent.summary && (
                          <p className="text-[9px] text-white/40 leading-snug mt-0.5 line-clamp-2">
                            {agent.summary}
                          </p>
                        )}

                        {/* Links */}
                        <div className="flex gap-2 mt-0.5">
                          {agent.link && (
                            <a
                              href={agent.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[9px] text-blue-400/70 hover:text-blue-400 hover:underline"
                            >
                              link
                            </a>
                          )}
                          {wsUrl && (
                            <a
                              href={wsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[9px] text-green-400/70 hover:text-green-400 hover:underline"
                            >
                              workspace
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {sessions.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-[10px] text-white/30">
                      No agents online
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ═══ BOTTOM ACTION BAR ═══ */}
        <div
          className="h-12 flex-shrink-0 flex items-center px-4 gap-3 z-30"
          style={{
            background: "rgba(0,0,0,0.9)",
            borderTop: "3px solid #4c566a",
          }}
        >
          {/* Logo / Title */}
          <div className="flex items-center gap-2">
            <span className="text-sm">🏢</span>
            <span className="text-[11px] font-bold text-white/80 tracking-wide">
              Agent Virtual Office
            </span>
          </div>

          <div className="flex-1" />

          {/* Status indicators */}
          <div className="flex items-center gap-4">
            {Object.entries(statusCounts).map(([status, count]) => {
              const config =
                STATUS_COLORS[status as keyof typeof STATUS_COLORS];
              return (
                <div key={status} className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: config.bg }}
                  />
                  <span className="text-[10px] text-white/50">
                    {config.label}
                  </span>
                  <span className="text-[10px] text-white/80 font-bold">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="w-px h-6 bg-white/10 mx-2" />

          {/* Toggle sidebar */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-semibold cursor-pointer transition-all ${
              sidebarOpen
                ? "bg-blue-500/30 text-blue-300 border border-blue-500/50"
                : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/70"
            }`}
          >
            👥 Users
          </button>
        </div>
      </div>
    </PixelLayout>
  );
}
