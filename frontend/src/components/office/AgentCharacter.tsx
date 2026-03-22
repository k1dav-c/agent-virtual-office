import { useState } from "react";

import { getCoderHost } from "@components/CoderHostSetting";
import { ROLE_CONFIGS, STATUS_COLORS } from "../../config/agent-roles";
import type { AgentSession, SeatPosition } from "../../types/agent";
import { WokaSprite } from "./CharacterSprites";
import SpeechBubble from "./SpeechBubble";

interface Props {
  agent: AgentSession;
  seat: SeatPosition;
  tileSize: number;
  isWandering?: boolean;
  isWalking?: boolean;
  highlighted?: boolean;
}

export default function AgentCharacter({
  agent,
  seat,
  tileSize,
  isWandering,
  isWalking,
  highlighted,
}: Props) {
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

  const showBubble =
    agent.status === "working" ||
    agent.status === "failure" ||
    agent.status === "complete";

  return (
    <div
      className="absolute"
      style={{
        left: seat.x * tileSize,
        top: seat.y * tileSize,
        width: tileSize,
        height: tileSize,
        zIndex: seat.y + 10,
        // Smooth per-tile step (short transition for 1-tile moves)
        transition: "left 180ms linear, top 180ms linear",
      }}
    >
      {/* Speech bubble */}
      {agent.summary && (
        <SpeechBubble text={agent.summary} visible={showBubble} />
      )}

      {/* Highlight frame */}
      {highlighted && (
        <div
          className="absolute animate-pulse pointer-events-none"
          style={{
            inset: -3,
            border: `2px solid ${statusColor.bg}`,
            borderRadius: 4,
            boxShadow: `0 0 6px ${statusColor.bg}, 0 0 12px ${statusColor.bg}44`,
            zIndex: 1,
          }}
        />
      )}

      {/* Character */}
      <div
        className="relative"
        style={{
          cursor: workspaceUrl ? "pointer" : "default",
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleClick}
      >
        <WokaSprite
          role={agent.role}
          color={roleConfig.color}
          direction={seat.direction}
          isWorking={agent.status === "working"}
          animate={!!isWalking}
        />

        {/* Status dot */}
        <div
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
          style={{
            backgroundColor: statusColor.bg,
            boxShadow:
              agent.status === "working"
                ? `0 0 4px ${statusColor.bg}, 0 0 8px ${statusColor.bg}`
                : `0 0 2px ${statusColor.bg}`,
          }}
        />

        {/* Name label (WorkAdventure style — simple white text above) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 text-center whitespace-nowrap pointer-events-none"
          style={{ bottom: tileSize + 2 }}
        >
          <span
            className="text-[8px] font-bold px-1 rounded"
            style={{
              color: "#fff",
              textShadow: "0 1px 3px rgba(0,0,0,0.8), 0 0 1px rgba(0,0,0,0.5)",
              display: "inline-block",
            }}
          >
            {roleConfig.label}
          </span>
        </div>
      </div>

      {/* Tooltip on hover */}
      {showTooltip && (
        <div
          className="absolute w-52 p-3 bg-gray-900/95 text-white text-xs rounded-lg shadow-xl pointer-events-none border border-gray-700/50"
          style={{
            bottom: tileSize + 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
          }}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <span>{roleConfig.emoji}</span>
            <span className="font-bold">{roleConfig.label}</span>
            <span
              className="ml-auto w-2 h-2 rounded-full"
              style={{ backgroundColor: statusColor.bg }}
            />
            <span className="text-gray-400 text-[10px]">
              {statusColor.label}
            </span>
          </div>
          {agent.summary && (
            <p className="text-gray-300 leading-snug mt-1 text-[10px]">
              {agent.summary}
            </p>
          )}
          {agent.workspace && (
            <p className="text-blue-400 mt-1 truncate text-[10px]">
              💻 {agent.workspace}
            </p>
          )}
          <p className="text-gray-500 mt-1 text-[10px]">{timeSince()}</p>
          {workspaceUrl && (
            <p className="text-gray-500 text-[9px] mt-0.5">
              Click to open workspace
            </p>
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}
