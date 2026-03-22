import { useMemo } from "react";

import { OFFICE_MAP, assignSeats } from "../../config/office-map";
import { useWandering } from "../../hooks/useWandering";
import type { AgentSession } from "../../types/agent";
import AgentCharacter from "./AgentCharacter";
import FlyingTask from "./FlyingTask";
import PixelClock from "./PixelClock";
import TileMap from "./TileMap";

function ZoneSign({
  x,
  y,
  tileSize,
  label,
  emoji,
}: {
  x: number;
  y: number;
  tileSize: number;
  label: string;
  emoji: string;
}) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x * tileSize,
        top: y * tileSize,
        zIndex: 5,
        width: 64,
        height: 48,
      }}
    >
      {/* Signboard PNG background */}
      <img
        src="/assets/tiles/signboard.png"
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: 64,
          height: 48,
          imageRendering: "pixelated",
        }}
      />
      {/* Text on the sign face */}
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{
          left: 8,
          top: 6,
          width: 48,
          height: 18,
        }}
      >
        <span
          style={{
            fontSize: 7,
            fontWeight: 800,
            color: "#5a3d1a",
            fontFamily: "'Courier New', monospace",
            whiteSpace: "nowrap",
            letterSpacing: "0.5px",
            lineHeight: 1,
            textShadow: "0 0.5px 0 rgba(210,180,130,0.6)",
          }}
        >
          {emoji} {label}
        </span>
      </div>
    </div>
  );
}

interface FlyingTaskData {
  id: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  type: "task" | "complete";
}

interface Props {
  agents: AgentSession[];
  flyingTasks?: FlyingTaskData[];
  onFlyingTaskComplete?: (id: string) => void;
  highlightStatus?: string | null;
}

export default function SceneRenderer({
  agents,
  flyingTasks,
  onFlyingTaskComplete,
  highlightStatus,
}: Props) {
  const deskSeats = useMemo(
    () => assignSeats(agents.filter((a) => a.status === "working")),
    [agents],
  );

  const positions = useWandering(agents, deskSeats);

  const tileSize = OFFICE_MAP.tileSize;
  const mapW = OFFICE_MAP.width * tileSize;
  const mapH = OFFICE_MAP.height * tileSize;

  return (
    <TileMap map={OFFICE_MAP}>
      {/* Wall clock */}
      <PixelClock x={12} y={0} tileSize={tileSize} />

      {/* Zone signboards */}
      <ZoneSign x={1} y={1} tileSize={tileSize} emoji="💻" label="Work Area" />
      <ZoneSign x={15} y={0} tileSize={tileSize} emoji="🆘" label="Meeting" />
      <ZoneSign
        x={15}
        y={9}
        tileSize={tileSize}
        emoji="☕"
        label="Break Room"
      />
      <ZoneSign x={9} y={3} tileSize={tileSize} emoji="🚶" label="Hallway" />

      {/* Agents */}
      {agents.map((agent) => {
        const pos = positions.get(agent.id);
        if (!pos) return null;
        return (
          <AgentCharacter
            key={agent.id}
            agent={agent}
            seat={pos}
            tileSize={tileSize}
            isWandering={agent.status !== "working"}
            isWalking={pos.isWalking}
            highlighted={highlightStatus === agent.status}
          />
        );
      })}

      {/* Flying task animations */}
      {flyingTasks?.map((task) => (
        <FlyingTask
          key={task.id}
          fromX={((task.fromX * tileSize) / mapW) * 100}
          fromY={((task.fromY * tileSize) / mapH) * 100}
          toX={((task.toX * tileSize) / mapW) * 100}
          toY={((task.toY * tileSize) / mapH) * 100}
          type={task.type}
          onComplete={() => onFlyingTaskComplete?.(task.id)}
        />
      ))}

      {/* Empty state */}
      {agents.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center p-6 rounded-xl backdrop-blur-sm bg-black/30">
            <p className="text-4xl mb-3">🏢</p>
            <p className="text-lg font-bold text-white">Office is empty</p>
            <p className="text-sm text-gray-300 mt-1">
              Start a Claude Code session to see agents appear
            </p>
          </div>
        </div>
      )}
    </TileMap>
  );
}
