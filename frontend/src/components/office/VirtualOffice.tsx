import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  OFFICE_SCENES,
  getEffectiveAgentCount,
  getSceneForAgentCount,
} from "../../config/office-scenes";
import type { AgentRole, AgentSession, OfficeScene } from "../../types/agent";
import SceneRenderer from "./SceneRenderer";
import SceneTransition from "./SceneTransition";

interface FlyingTaskData {
  id: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  type: "task" | "complete";
}

const MONO = "'Courier New', monospace";

const MOCK_ROLES: AgentRole[] = [
  "Frontend Developer",
  "Backend Developer",
  "QA Engineer",
  "DevOps Engineer",
  "Architect",
  "Designer",
  "Code Reviewer",
  "Technical Writer",
  "Debugger",
  "Data Engineer",
  "Developer",
];

const MOCK_STATUSES: AgentSession["status"][] = [
  "working",
  "working",
  "working",
  "idle",
  "complete",
  "failure",
];

function generateMockAgents(scene: OfficeScene): AgentSession[] {
  const count = Math.min(
    scene.deskPositions.length,
    scene.maxAgents === Infinity ? scene.deskPositions.length : scene.maxAgents,
  );
  const now = new Date().toISOString();
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-${scene.level}-${i}`,
    session_id: `mock-session-${i}`,
    role: MOCK_ROLES[i % MOCK_ROLES.length],
    status: MOCK_STATUSES[i % MOCK_STATUSES.length],
    summary: `Mock agent ${i + 1} preview`,
    link: null,
    workspace: null,
    started_at: now,
    last_heartbeat_at: now,
  }));
}

interface Props {
  agents: AgentSession[];
}

export default function VirtualOffice({ agents }: Props) {
  const [previewLevel, setPreviewLevel] = useState<number | null>(null);
  const [flyingTasks, setFlyingTasks] = useState<FlyingTaskData[]>([]);
  const prevStatusRef = useRef<Map<string, AgentSession["status"]>>(new Map());

  const effectiveCount = useMemo(
    () => getEffectiveAgentCount(agents),
    [agents],
  );
  const liveScene = useMemo(
    () => getSceneForAgentCount(effectiveCount),
    [effectiveCount],
  );

  const previewScene = previewLevel
    ? (OFFICE_SCENES.find((s) => s.level === previewLevel) ?? null)
    : null;

  const previewAgents = useMemo(
    () => (previewScene ? generateMockAgents(previewScene) : []),
    [previewScene],
  );

  const isPreview = previewScene !== null;

  // Track agent status changes and trigger flying task animations
  useEffect(() => {
    const currentScene = isPreview ? previewScene : liveScene;
    if (!currentScene) return;
    const currentAgents = isPreview ? previewAgents : agents;

    const newFlying: FlyingTaskData[] = [];

    currentAgents.forEach((agent, index) => {
      const prevStatus = prevStatusRef.current.get(agent.id);
      const pos =
        currentScene.deskPositions[index % currentScene.deskPositions.length];
      if (!pos) return;

      // Skip initial load (no previous status recorded)
      if (prevStatus === undefined) {
        prevStatusRef.current.set(agent.id, agent.status);
        return;
      }

      // Agent started working — fly a task from a random other agent
      if (agent.status === "working" && prevStatus !== "working") {
        const others = currentAgents.filter((_, i) => i !== index);
        if (others.length > 0) {
          const source = others[Math.floor(Math.random() * others.length)];
          const srcIdx = currentAgents.indexOf(source);
          const srcPos =
            currentScene.deskPositions[
              srcIdx % currentScene.deskPositions.length
            ];
          if (srcPos) {
            newFlying.push({
              id: `${agent.id}-${Date.now()}-${Math.random()}`,
              fromX: srcPos.x,
              fromY: srcPos.y,
              toX: pos.x,
              toY: pos.y,
              type: "task",
            });
          }
        }
      }

      // Agent completed — fly a completion packet to a random neighbor
      if (agent.status === "complete" && prevStatus === "working") {
        const others = currentAgents.filter((_, i) => i !== index);
        if (others.length > 0) {
          const target = others[Math.floor(Math.random() * others.length)];
          const tgtIdx = currentAgents.indexOf(target);
          const tgtPos =
            currentScene.deskPositions[
              tgtIdx % currentScene.deskPositions.length
            ];
          if (tgtPos) {
            newFlying.push({
              id: `${agent.id}-${Date.now()}-${Math.random()}`,
              fromX: pos.x,
              fromY: pos.y,
              toX: tgtPos.x,
              toY: tgtPos.y,
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
  }, [agents, liveScene, isPreview, previewScene, previewAgents]);

  const removeFlyingTask = useCallback((id: string) => {
    setFlyingTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Full-screen office scene */}
      <div className="flex-1 relative">
        {isPreview ? (
          <SceneRenderer
            scene={previewScene}
            agents={previewAgents}
            flyingTasks={flyingTasks}
            onFlyingTaskComplete={removeFlyingTask}
          />
        ) : (
          <SceneTransition
            scene={liveScene}
            agents={agents}
            flyingTasks={flyingTasks}
            onFlyingTaskComplete={removeFlyingTask}
          />
        )}

        {/* Preview badge */}
        {isPreview && (
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-1.5"
            style={{
              background: "rgba(46, 52, 64, 0.9)",
              border: "2px solid #ebcb8b",
              borderRadius: 2,
              fontFamily: MONO,
            }}
          >
            <span className="text-[11px] font-bold text-[#ebcb8b] tracking-wider">
              PREVIEW — Lv.{previewScene.level} {previewScene.nameZh}
            </span>
            <span className="text-[10px] text-[#8892a6]">
              {previewScene.description}
            </span>
            <button
              onClick={() => setPreviewLevel(null)}
              className="ml-2 text-[10px] font-bold text-[#bf616a] hover:text-[#d08770] cursor-pointer"
            >
              ✕ CLOSE
            </button>
          </div>
        )}
      </div>

      {/* Scene level indicator — game HUD style */}
      <div
        className="flex-shrink-0 flex items-center justify-center gap-1 py-1.5 px-4"
        style={{
          background: "rgba(46, 52, 64, 0.8)",
          borderTop: "3px solid #4c566a",
          fontFamily: MONO,
        }}
      >
        {OFFICE_SCENES.map((s) => {
          const isLive = s.level === liveScene.level;
          const isPreviewing = previewLevel === s.level;
          return (
            <button
              key={s.level}
              onClick={() => setPreviewLevel(isPreviewing ? null : s.level)}
              className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold transition-all cursor-pointer"
              style={{
                background: isPreviewing
                  ? "#ebcb8b"
                  : isLive && !isPreview
                    ? "#5e81ac"
                    : "transparent",
                color: isPreviewing
                  ? "#2e3440"
                  : isLive && !isPreview
                    ? "#eceff4"
                    : "#6b7994",
                border: isPreviewing
                  ? "2px solid #d08770"
                  : isLive && !isPreview
                    ? "2px solid #4c566a"
                    : "2px solid transparent",
                borderRadius: 1,
              }}
              title={`${s.name} — ${s.description}`}
            >
              <span>Lv.{s.level}</span>
              <span className="hidden sm:inline">{s.nameZh}</span>
              {isLive && !isPreview && (
                <span className="text-[8px] ml-0.5 opacity-60">●</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
