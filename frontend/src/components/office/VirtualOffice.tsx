import { useMemo } from "react";

import {
  OFFICE_SCENES,
  getSceneForAgentCount,
} from "../../config/office-scenes";
import type { AgentSession } from "../../types/agent";
import SceneTransition from "./SceneTransition";

const MONO = "'Courier New', monospace";

interface Props {
  agents: AgentSession[];
}

export default function VirtualOffice({ agents }: Props) {
  const scene = useMemo(
    () => getSceneForAgentCount(agents.length),
    [agents.length],
  );

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Full-screen office scene */}
      <div className="flex-1 relative">
        <SceneTransition scene={scene} agents={agents} />
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
          const active = s.level === scene.level;
          return (
            <div
              key={s.level}
              className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold transition-all"
              style={{
                background: active ? "#5e81ac" : "transparent",
                color: active ? "#eceff4" : "#6b7994",
                border: active ? "2px solid #4c566a" : "2px solid transparent",
                borderRadius: 1,
              }}
            >
              <span>Lv.{s.level}</span>
              <span className="hidden sm:inline">{s.nameZh}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
