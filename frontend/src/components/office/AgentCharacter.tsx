import { useState } from "react";

import { getCoderHost } from "@components/CoderHostSetting";
import { ROLE_CONFIGS, STATUS_COLORS } from "../../config/agent-roles";
import type { AgentSession, DeskPosition } from "../../types/agent";
import { RoleSprite } from "./CharacterSprites";

interface Props {
  agent: AgentSession;
  position: DeskPosition;
}

export default function AgentCharacter({ agent, position }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);
  const roleConfig = ROLE_CONFIGS[agent.role] || ROLE_CONFIGS.Developer;
  const statusColor = STATUS_COLORS[agent.status] || STATUS_COLORS.idle;

  const timeSince = () => {
    const diff = Date.now() - new Date(agent.last_heartbeat_at).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  const coderHost = getCoderHost();
  const workspaceUrl =
    agent.workspace && coderHost ? `${coderHost}/@me/${agent.workspace}` : null;

  const handleClick = () => {
    if (workspaceUrl) {
      window.open(workspaceUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className="absolute transition-all duration-700 ease-in-out"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 10,
      }}
    >
      {/* Invisible hit area covering sprite + desk + label */}
      <div
        className="absolute inset-0"
        style={{
          top: -72,
          bottom: -20,
          left: -10,
          right: -10,
          cursor: workspaceUrl ? "pointer" : "default",
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleClick}
      />

      {/* Tooltip — align based on horizontal position to avoid clipping */}
      {showTooltip && (
        <div
          className="absolute bottom-full mb-14 w-48 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl pointer-events-none z-50"
          style={{
            ...(position.x < 20
              ? { left: -10 }
              : position.x > 80
                ? { right: -10 }
                : { left: "50%", transform: "translateX(-50%)" }),
          }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span>{roleConfig.emoji}</span>
            <span className="font-bold">{roleConfig.label}</span>
            <span
              className="ml-auto w-2 h-2 rounded-full"
              style={{ backgroundColor: statusColor.bg }}
            />
            <span className="text-gray-400">{statusColor.label}</span>
          </div>
          {agent.summary && (
            <p className="text-gray-300 leading-snug mt-1">{agent.summary}</p>
          )}
          {agent.workspace && (
            <p className="text-blue-400 mt-1 truncate">💻 {agent.workspace}</p>
          )}
          <p className="text-gray-500 mt-1">{timeSince()}</p>
          {workspaceUrl && (
            <p className="text-gray-500 text-[9px] mt-0.5">
              Click to open workspace
            </p>
          )}
          {/* Arrow — follows tooltip alignment */}
          <div
            className="absolute top-full border-4 border-transparent border-t-gray-900"
            style={{
              ...(position.x < 20
                ? { left: 20 }
                : position.x > 80
                  ? { right: 20 }
                  : { left: "50%", transform: "translateX(-50%)" }),
            }}
          />
        </div>
      )}

      {/* Neon glow aura for working agents */}
      {agent.status === "working" && (
        <div
          className="absolute agent-neon-glow pointer-events-none"
          style={{
            width: 90,
            height: 90,
            left: "50%",
            top: -32,
            background: `radial-gradient(circle, ${roleConfig.color}35 0%, ${roleConfig.color}10 45%, transparent 70%)`,
            borderRadius: "50%",
            zIndex: -1,
          }}
        />
      )}

      {/* Desk */}
      <div
        className="w-14 h-8 rounded-sm relative"
        style={{
          backgroundColor: "#8B7355",
          boxShadow: "0 2px 0 #6B5535",
          imageRendering: "pixelated",
        }}
      >
        {/* Monitor on desk */}
        <div
          className={`absolute -top-5 left-1/2 -translate-x-1/2 w-8 h-6 rounded-sm border-2 flex items-center justify-center overflow-hidden ${
            agent.status === "working" ? "monitor-neon-glow" : ""
          }`}
          style={{
            backgroundColor: "#1a1a2e",
            borderColor: "#333",
          }}
        >
          <div
            className={`w-5 h-3 rounded-sm ${agent.status === "working" ? "agent-working-monitor" : ""}`}
            style={{
              backgroundColor:
                agent.status === "working"
                  ? "#4ade80"
                  : agent.status === "failure"
                    ? "#f87171"
                    : "#60a5fa",
              opacity: 0.7,
            }}
          />
          {/* Scanline effect when working */}
          {agent.status === "working" && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(transparent 40%, rgba(74, 222, 128, 0.15) 50%, transparent 60%)",
                animation: "monitor-scanline 1.5s linear infinite",
              }}
            />
          )}
        </div>
      </div>

      {/* Character — role-specific pixel sprite */}
      <div
        className={`absolute -top-16 left-1/2 ${agent.status === "working" ? "agent-working-sprite" : ""}`}
        style={{
          ["--sprite-scale-x" as string]:
            position.direction === "left" ? -1 : 1,
          transform: `translate(-50%, 0) scaleX(${position.direction === "left" ? -1 : 1})`,
          filter: "drop-shadow(1px 2px 0 rgba(0,0,0,0.25))",
          pointerEvents: "none",
        }}
      >
        <RoleSprite role={agent.role} color={roleConfig.color} flip={false} />

        {/* Status indicator */}
        <div
          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white ${
            agent.status === "working" ? "status-glow-pulse" : ""
          }`}
          style={{
            backgroundColor: statusColor.bg,
            ["--glow-color" as string]: statusColor.bg,
            ...(agent.status === "working"
              ? { boxShadow: `0 0 6px ${statusColor.bg}, 0 0 12px ${statusColor.bg}` }
              : {}),
          }}
        />
      </div>

      {/* Role label */}
      <div
        className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-center whitespace-nowrap"
        style={{ pointerEvents: "none" }}
      >
        <span
          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
          style={{
            backgroundColor: roleConfig.bgColor,
            color: roleConfig.color,
            ...(agent.status === "working"
              ? { textShadow: `0 0 4px ${roleConfig.color}, 0 0 8px ${roleConfig.color}80` }
              : {}),
          }}
        >
          {roleConfig.emoji} {roleConfig.label}
        </span>
      </div>
    </div>
  );
}
