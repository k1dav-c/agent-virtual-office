import { useCallback, useEffect, useRef, useState } from "react";

import { OFFICE_MAP, assignSeats } from "../../config/office-map";
import type { AgentSession } from "../../types/agent";
import SceneRenderer from "./SceneRenderer";

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
  highlightStatus?: string | null;
}

export default function VirtualOffice({ agents, highlightStatus }: Props) {
  const [flyingTasks, setFlyingTasks] = useState<FlyingTaskData[]>([]);
  const prevStatusRef = useRef<Map<string, AgentSession["status"]>>(new Map());

  // Track agent status changes and trigger flying task animations
  useEffect(() => {
    const seatMap = assignSeats(agents);
    const newFlying: FlyingTaskData[] = [];

    agents.forEach((agent) => {
      const prevStatus = prevStatusRef.current.get(agent.id);
      const seat = seatMap.get(agent.id);
      if (!seat) return;

      // Skip initial load
      if (prevStatus === undefined) {
        prevStatusRef.current.set(agent.id, agent.status);
        return;
      }

      // Agent started working — fly a task from a random other agent
      if (agent.status === "working" && prevStatus !== "working") {
        const others = agents.filter((a) => a.id !== agent.id);
        if (others.length > 0) {
          const source = others[Math.floor(Math.random() * others.length)];
          const srcSeat = seatMap.get(source.id);
          if (srcSeat) {
            newFlying.push({
              id: `${agent.id}-${Date.now()}-${Math.random()}`,
              fromX: srcSeat.x,
              fromY: srcSeat.y,
              toX: seat.x,
              toY: seat.y,
              type: "task",
            });
          }
        }
      }

      // Agent completed — fly a completion packet to a random neighbor
      if (agent.status === "complete" && prevStatus === "working") {
        const others = agents.filter((a) => a.id !== agent.id);
        if (others.length > 0) {
          const target = others[Math.floor(Math.random() * others.length)];
          const tgtSeat = seatMap.get(target.id);
          if (tgtSeat) {
            newFlying.push({
              id: `${agent.id}-${Date.now()}-${Math.random()}`,
              fromX: seat.x,
              fromY: seat.y,
              toX: tgtSeat.x,
              toY: tgtSeat.y,
              type: "complete",
            });
          }
        }
      }

      prevStatusRef.current.set(agent.id, agent.status);
    });

    if (newFlying.length > 0) {
      setFlyingTasks((prev) => [...prev, ...newFlying]);
    }
  }, [agents]);

  const removeFlyingTask = useCallback((id: string) => {
    setFlyingTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Count overflow agents
  const overflow = Math.max(0, agents.length - OFFICE_MAP.seats.length);

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Full-screen office */}
      <div className="flex-1 relative">
        <SceneRenderer
          agents={agents}
          flyingTasks={flyingTasks}
          onFlyingTaskComplete={removeFlyingTask}
          highlightStatus={highlightStatus}
        />

        {/* Overflow indicator */}
        {overflow > 0 && (
          <div
            className="absolute bottom-3 left-3 z-20 px-3 py-1.5 text-[10px] font-bold"
            style={{
              background: "rgba(46, 52, 64, 0.9)",
              color: "#ebcb8b",
              border: "2px solid #4c566a",
              borderRadius: 2,
              fontFamily: "'Courier New', monospace",
            }}
          >
            +{overflow} agent{overflow > 1 ? "s" : ""} in queue
          </div>
        )}
      </div>
    </div>
  );
}
