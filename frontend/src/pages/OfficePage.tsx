import { getCoderHost } from "@components/CoderHostSetting";
import PixelLayout from "@components/PixelLayout";
import VirtualOffice from "@components/office/VirtualOffice";
import { useState } from "react";
import { ROLE_CONFIGS, STATUS_COLORS } from "../config/agent-roles";
import { useAgentSessions } from "../hooks/useAgentSessions";
import type { AgentRole } from "../types/agent";

const MONO = "'Courier New', monospace";

export default function OfficePage() {
  const { sessions, loading, error } = useAgentSessions();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const roleGroups = sessions.reduce(
    (acc, s) => {
      const role = s.role as AgentRole;
      if (!acc[role]) acc[role] = [];
      acc[role].push(s);
      return acc;
    },
    {} as Record<string, typeof sessions>,
  );

  return (
    <PixelLayout>
      <div className="absolute inset-0 flex" style={{ fontFamily: MONO }}>
        {/* ── Full-screen office world ── */}
        <div className="flex-1 relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div
                  className="w-10 h-10 mx-auto mb-3 animate-spin"
                  style={{
                    border: "3px solid #4c566a",
                    borderTop: "3px solid #5e81ac",
                    borderRadius: 2,
                  }}
                />
                <p
                  className="text-xs text-[#2e3440] tracking-wider font-bold"
                  style={{ textShadow: "1px 1px 0 rgba(255,255,255,0.3)" }}
                >
                  LOADING OFFICE...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="text-center p-6"
                style={{
                  border: "3px solid #bf616a",
                  borderRadius: 2,
                  background: "rgba(191,97,106,0.1)",
                }}
              >
                <p className="text-xs text-[#bf616a] font-bold tracking-wider">
                  ⚠️ CONNECTION FAILED
                </p>
                <p className="text-[10px] text-[#6b7994] mt-2">
                  {error.message}
                </p>
              </div>
            </div>
          ) : (
            <VirtualOffice agents={sessions} />
          )}
        </div>

        {/* ── Game HUD sidebar ── */}
        {sidebarOpen && (
          <div
            className="w-72 flex-shrink-0 flex flex-col overflow-hidden"
            style={{
              background: "rgba(46, 52, 64, 0.92)",
              borderLeft: "4px solid #4c566a",
            }}
          >
            {/* Sidebar header */}
            <div
              className="flex items-center justify-between px-4 py-2 flex-shrink-0"
              style={{ borderBottom: "3px solid #4c566a" }}
            >
              <span className="text-[11px] font-bold text-[#d8dee9] tracking-wider">
                📊 STATUS
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-[10px] text-[#6b7994] font-bold cursor-pointer hover:text-[#bf616a] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Status counters */}
            <div
              className="px-4 py-3 flex-shrink-0"
              style={{ borderBottom: "3px solid #4c566a" }}
            >
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(STATUS_COLORS).map(([status, config]) => {
                  const count = sessions.filter(
                    (s) => s.status === status,
                  ).length;
                  return (
                    <div
                      key={status}
                      className="flex items-center gap-2 text-[10px]"
                    >
                      <div
                        className="w-2.5 h-2.5 flex-shrink-0"
                        style={{
                          backgroundColor: config.bg,
                          border: "1px solid #4c566a",
                          borderRadius: 1,
                        }}
                      />
                      <span className="text-[#8892a6]">
                        {config.label}:{" "}
                        <strong className="text-[#d8dee9]">{count}</strong>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Agent list */}
            <div className="flex-1 overflow-auto px-4 py-3">
              <h3 className="font-bold text-[11px] text-[#d8dee9] mb-3 tracking-wider">
                👥 AGENTS ({sessions.length})
              </h3>

              {sessions.length === 0 ? (
                <p className="text-[10px] text-[#6b7994]">No agents online</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(roleGroups).map(([role, agents]) => {
                    const config =
                      ROLE_CONFIGS[role as AgentRole] || ROLE_CONFIGS.Developer;
                    return (
                      <div key={role}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-xs">{config.emoji}</span>
                          <span
                            className="text-[10px] font-bold"
                            style={{ color: config.color }}
                          >
                            {config.label}
                          </span>
                          <span className="text-[10px] text-[#6b7994]">
                            ({agents.length})
                          </span>
                        </div>
                        {agents.map((agent) => (
                          <div
                            key={agent.id}
                            className="ml-5 py-1 flex items-start gap-2"
                          >
                            <div
                              className={`w-2 h-2 mt-0.5 flex-shrink-0 ${
                                agent.status === "working"
                                  ? "animate-pulse"
                                  : ""
                              }`}
                              style={{
                                backgroundColor:
                                  STATUS_COLORS[agent.status]?.bg || "#999",
                                border: "1px solid #4c566a",
                                borderRadius: 1,
                              }}
                            />
                            <div>
                              <p className="text-[10px] text-[#d8dee9] leading-snug">
                                {agent.summary || "No status"}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                {agent.link && (
                                  <a
                                    href={agent.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[9px] text-[#5e81ac] hover:underline"
                                  >
                                    🔗 link
                                  </a>
                                )}
                                {agent.workspace && getCoderHost() && (
                                  <a
                                    href={`${getCoderHost()}/@me/${agent.workspace}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[9px] text-[#88c0d0] hover:underline"
                                  >
                                    💻 workspace
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Toggle sidebar button (when closed) */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-2 right-2 z-20 px-3 py-1.5 text-[10px] font-bold text-[#d8dee9] cursor-pointer transition-colors"
            style={{
              background: "rgba(46, 52, 64, 0.85)",
              border: "3px solid #4c566a",
              borderRadius: 2,
              fontFamily: MONO,
              boxShadow: "3px 3px 0 rgba(0,0,0,0.4)",
            }}
          >
            📊 STATUS
          </button>
        )}
      </div>
    </PixelLayout>
  );
}
