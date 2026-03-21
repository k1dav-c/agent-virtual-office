import { useEffect, useRef, useState } from "react";

import type { AgentSession, OfficeScene } from "../../types/agent";
import SceneRenderer from "./SceneRenderer";

interface Props {
  scene: OfficeScene;
  agents: AgentSession[];
}

export default function SceneTransition({ scene, agents }: Props) {
  const [currentScene, setCurrentScene] = useState(scene);
  const [transitioning, setTransitioning] = useState(false);
  const prevLevelRef = useRef(scene.level);

  useEffect(() => {
    if (scene.level !== prevLevelRef.current) {
      setTransitioning(true);
      const timer = setTimeout(() => {
        setCurrentScene(scene);
        setTransitioning(false);
        prevLevelRef.current = scene.level;
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setCurrentScene(scene);
    }
  }, [scene]);

  return (
    <div className="relative">
      {/* Level up notification */}
      {transitioning && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="animate-bounce bg-black/80 text-white px-8 py-4 rounded-2xl text-center">
            <p className="text-2xl font-bold">
              {scene.level > prevLevelRef.current
                ? "⬆️ Level Up!"
                : "⬇️ Downsized"}
            </p>
            <p className="text-lg mt-1">
              Lv.{scene.level} {scene.nameZh}
            </p>
          </div>
        </div>
      )}

      <div
        className={`transition-opacity duration-500 ${
          transitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <SceneRenderer scene={currentScene} agents={agents} />
      </div>
    </div>
  );
}
