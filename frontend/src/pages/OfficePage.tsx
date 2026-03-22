import { getCoderHost } from "@components/CoderHostSetting";
import PixelLayout from "@components/PixelLayout";
import VirtualOffice from "@components/office/VirtualOffice";
import { useEffect, useState } from "react";
import { ROLE_CONFIGS, STATUS_COLORS } from "../config/agent-roles";
import { useAgentSessions } from "../hooks/useAgentSessions";
import { useCompletionSound } from "../hooks/useCompletionSound";
import { useSessionNicknames } from "../hooks/useSessionNicknames";
import type { AgentRole } from "../types/agent";

function formatDuration(startedAt: string): string {
  const diff = Date.now() - new Date(startedAt).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return remainMins > 0 ? `${hrs}h ${remainMins}m` : `${hrs}h`;
}

export default function OfficePage() {
  const { sessions, loading, error } = useAgentSessions();
  const { soundEnabled, toggleSound } = useCompletionSound(sessions);
  const { getNickname, setNickname } = useSessionNicknames();
  const [panelOpen, setPanelOpen] = useState(false);
  const [highlightStatus, setHighlightStatus] = useState<string | null>(null);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [, setTick] = useState(0);

  // Re-render every 30s to update session durations
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const statusCounts = {
    working: sessions.filter((s) => s.status === "working").length,
    idle: sessions.filter((s) => s.status === "idle").length,
    complete: sessions.filter((s) => s.status === "complete").length,
    failure: sessions.filter((s) => s.status === "failure").length,
  };

  return (
    <PixelLayout>
      <div className="absolute inset-0 flex flex-col">
        {/* ═══ MAIN CONTENT: Full-screen map ═══ */}
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
            <VirtualOffice
              agents={sessions}
              highlightStatus={highlightStatus}
            />
          )}

          {/* ─── FLOATING USERS PANEL ─── */}
          {panelOpen && (
            <div
              className="absolute right-3 top-3 w-60 flex flex-col z-40 rounded-lg overflow-hidden"
              style={{
                background: "rgba(30, 28, 36, 0.9)",
                border: "2px solid #4c566a",
                backdropFilter: "blur(8px)",
                maxHeight: "calc(100% - 70px)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
              }}
            >
              {/* Panel header */}
              <div className="px-3 py-2 flex items-center justify-between">
                <span
                  className="text-[10px] font-bold text-white/60 tracking-wide"
                  style={{ fontFamily: "'Courier New', monospace" }}
                >
                  👥 Users ({sessions.length})
                </span>
                <button
                  onClick={() => setPanelOpen(false)}
                  className="text-white/30 hover:text-white/70 text-xs cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Status filter bar */}
              <div className="px-3 py-1.5 flex gap-2 flex-wrap" style={{ borderTop: "1px solid #4c566a44" }}>
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
                        backgroundColor: isActive
                          ? `${config.bg}22`
                          : "transparent",
                        border: isActive
                          ? `1px solid ${config.bg}66`
                          : "1px solid transparent",
                      }}
                      onClick={() =>
                        setHighlightStatus(isActive ? null : status)
                      }
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: config.bg }}
                      />
                      <span
                        className="text-[8px] text-white/40"
                        style={{ fontFamily: "'Courier New', monospace" }}
                      >
                        {config.label}
                      </span>
                      <span className="text-[8px] text-white/70 font-bold">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Agent list — grouped by session_id */}
              <div className="flex-1 overflow-auto px-2 py-1" style={{ borderTop: "1px solid #4c566a44" }}>
                {(() => {
                  const groups = new Map<string, typeof sessions>();
                  for (const agent of sessions) {
                    const key = agent.session_id || agent.id;
                    const group = groups.get(key) || [];
                    group.push(agent);
                    groups.set(key, group);
                  }

                  return Array.from(groups.entries()).map(
                    ([sessionId, groupAgents]) => (
                      <div key={sessionId} className="mb-1.5">
                        {/* Session group header */}
                        {groups.size > 1 && (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 mt-1 group/header">
                            {editingSession === sessionId ? (
                              <input
                                autoFocus
                                className="text-[8px] text-white/50 font-mono bg-white/10 border border-white/20 rounded px-1 py-0 outline-none w-24"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={() => {
                                  setNickname(sessionId, editValue);
                                  setEditingSession(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    setNickname(sessionId, editValue);
                                    setEditingSession(null);
                                  }
                                  if (e.key === "Escape") {
                                    setEditingSession(null);
                                  }
                                }}
                              />
                            ) : (
                              <span
                                className="text-[8px] text-white/25 font-mono truncate cursor-pointer hover:text-white/50 transition-colors"
                                title="Click to rename"
                                onClick={() => {
                                  setEditingSession(sessionId);
                                  setEditValue(
                                    getNickname(sessionId) ||
                                    groupAgents[0].workspace ||
                                    sessionId.slice(0, 8),
                                  );
                                }}
                              >
                                {getNickname(sessionId) ||
                                  groupAgents[0].workspace ||
                                  sessionId.slice(0, 8)}
                              </span>
                            )}
                            <span className="text-[7px] text-white/15">
                              ({groupAgents.length})
                            </span>
                            <div className="flex-1 border-t border-white/5" />
                          </div>
                        )}

                        {groupAgents.map((agent) => {
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
                              className="flex items-start gap-2 px-2 py-1 rounded hover:bg-white/5 transition-colors"
                            >
                              <div
                                className={`w-1.5 h-1.5 mt-1 rounded-full flex-shrink-0 ${agent.status === "working"
                                    ? "animate-pulse"
                                    : ""
                                  }`}
                                style={{ backgroundColor: status.bg }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                  <span className="text-[9px]">
                                    {config.emoji}
                                  </span>
                                  <span
                                    className="text-[9px] font-semibold truncate"
                                    style={{ color: config.color }}
                                  >
                                    {config.label}
                                  </span>
                                  <span className="text-[8px] text-white/25 ml-auto flex-shrink-0">
                                    ⏱ {formatDuration(agent.started_at)}
                                  </span>
                                </div>
                                {agent.summary && (
                                  <p className="text-[8px] text-white/35 leading-snug mt-0.5 line-clamp-2">
                                    {agent.summary}
                                  </p>
                                )}
                                <div className="flex gap-2 mt-0.5">
                                  {agent.link && (
                                    <a
                                      href={agent.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[8px] text-blue-400/70 hover:text-blue-400 hover:underline"
                                    >
                                      link
                                    </a>
                                  )}
                                  {wsUrl && (
                                    <a
                                      href={wsUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[8px] text-green-400/70 hover:text-green-400 hover:underline"
                                    >
                                      workspace
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ),
                  );
                })()}

                {sessions.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-[9px] text-white/30">
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

          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-semibold cursor-pointer transition-all ${soundEnabled
                ? "bg-green-500/20 text-green-300 border border-green-500/40"
                : "bg-white/5 text-white/30 border border-white/10 hover:bg-white/10 hover:text-white/50"
              }`}
            title={soundEnabled ? "Sound on — click to mute" : "Sound off — click to unmute"}
          >
            {soundEnabled ? "🔔" : "🔕"}
          </button>

          {/* Toggle sidebar */}
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-semibold cursor-pointer transition-all ${panelOpen
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
