import { useState } from "react";

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

  return (
    <div
      className="absolute transition-all duration-700 ease-in-out"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 10,
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl pointer-events-none z-50">
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
          <p className="text-gray-500 mt-1">{timeSince()}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
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
          className="absolute -top-5 left-1/2 -translate-x-1/2 w-8 h-6 rounded-sm border-2 flex items-center justify-center"
          style={{
            backgroundColor: "#1a1a2e",
            borderColor: "#333",
          }}
        >
          <div
            className="w-5 h-3 rounded-sm"
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
        </div>
      </div>

      {/* Character — role-specific pixel sprite */}
      <div
        className="absolute -top-16 left-1/2 cursor-pointer"
        style={{
          transform: `translate(-50%, 0) scaleX(${position.direction === "left" ? -1 : 1})`,
          filter: "drop-shadow(1px 2px 0 rgba(0,0,0,0.25))",
        }}
      >
        <RoleSprite role={agent.role} color={roleConfig.color} flip={false} />

        {/* Status indicator */}
        <div
          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white ${
            agent.status === "working" ? "animate-pulse" : ""
          }`}
          style={{ backgroundColor: statusColor.bg }}
        />
      </div>

      {/* Role label */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
        <span
          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
          style={{
            backgroundColor: roleConfig.bgColor,
            color: roleConfig.color,
          }}
        >
          {roleConfig.emoji} {roleConfig.label}
        </span>
      </div>
    </div>
  );
}
