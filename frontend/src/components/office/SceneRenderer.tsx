import type { AgentSession, OfficeScene } from "../../types/agent";
import AgentCharacter from "./AgentCharacter";
import {
  Bookshelf,
  CoffeeMachine,
  DeskLamp,
  Fountain,
  GarageDoor,
  HologramDisplay,
  MeetingRoom,
  NeonSign,
  PizzaBox,
  Plant,
  Poster,
  Printer,
  RobotAssistant,
  Shelf,
  SnackBar,
  WallTV,
  WaterCooler,
  Whiteboard,
} from "./PixelDecorations";

interface Props {
  scene: OfficeScene;
  agents: AgentSession[];
}

export default function SceneRenderer({ scene, agents }: Props) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border-2"
      style={{
        backgroundColor: scene.bgColor,
        borderColor: scene.accentColor + "40",
        aspectRatio: "16/9",
        imageRendering: "auto",
      }}
    >
      {/* Wall */}
      <div
        className="absolute inset-x-0 top-0 h-[35%]"
        style={{ backgroundColor: scene.wallColor }}
      >
        {/* Wall decorations */}
        {scene.level >= 3 && (
          <div className="absolute top-4 left-8 w-16 h-10 rounded border-2 border-gray-400/30 bg-gray-200/20" />
        )}
        {scene.level >= 4 && (
          <div className="absolute top-4 right-8 w-20 h-12 rounded border-2 border-gray-400/30 bg-gray-200/20" />
        )}

        {/* Level-specific wall details */}
        {scene.level === 1 && (
          <>
            {/* Garage door */}
            <div className="absolute bottom-0 left-[5%]">
              <GarageDoor />
            </div>
            {/* Poster on wall */}
            <div className="absolute top-[10%] right-[8%]">
              <Poster accent={scene.accentColor} />
            </div>
          </>
        )}
        {scene.level === 2 && (
          <>
            {/* Bookshelf on wall */}
            <div className="absolute bottom-0 right-[5%]">
              <Bookshelf />
            </div>
          </>
        )}
        {scene.level === 5 && (
          <div className="absolute top-[10%] left-[40%]">
            <WallTV accent={scene.accentColor} />
          </div>
        )}
        {scene.level === 6 && (
          <>
            {/* Neon strips */}
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5 animate-pulse"
              style={{ backgroundColor: scene.accentColor, opacity: 0.6 }}
            />
            <div
              className="absolute top-0 left-0 right-0 h-0.5 animate-pulse"
              style={{ backgroundColor: scene.accentColor, opacity: 0.3 }}
            />
            {/* Neon sign */}
            <div className="absolute top-[15%] right-[10%]">
              <NeonSign accent={scene.accentColor} />
            </div>
          </>
        )}
      </div>

      {/* Floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-[65%]"
        style={{ backgroundColor: scene.floorColor }}
      >
        {/* Garage floor — shelf */}
        {scene.level === 1 && (
          <div className="absolute top-[5%] right-[5%]">
            <Shelf />
          </div>
        )}
        {/* Floor pattern */}
        {scene.level >= 3 && (
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 48px,
                rgba(0,0,0,0.1) 48px,
                rgba(0,0,0,0.1) 50px
              )`,
            }}
          />
        )}
      </div>

      {/* Scene label */}
      <div className="absolute top-3 left-4 z-20">
        <div
          className="px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm"
          style={{
            backgroundColor: scene.accentColor + "20",
            color: scene.level === 6 ? scene.accentColor : scene.accentColor,
            border: `1px solid ${scene.accentColor}40`,
          }}
        >
          Lv.{scene.level} {scene.nameZh}
        </div>
      </div>

      {/* Agent count */}
      <div className="absolute top-3 right-4 z-20">
        <div
          className="px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(0,0,0,0.3)",
            color: "#fff",
          }}
        >
          {agents.length} agent{agents.length !== 1 ? "s" : ""} online
        </div>
      </div>

      {/* Decorative elements based on scene — pixel art SVGs */}
      {scene.decorations.includes("plant") && (
        <div className="absolute bottom-[12%] right-[4%] z-5">
          <Plant />
        </div>
      )}
      {scene.decorations.includes("coffee-machine") && (
        <div className="absolute bottom-[12%] right-[14%] z-5">
          <CoffeeMachine />
        </div>
      )}
      {scene.decorations.includes("whiteboard") && (
        <div className="absolute top-[5%] right-[20%] z-5">
          <Whiteboard />
        </div>
      )}
      {scene.decorations.includes("pizza-box") && (
        <div className="absolute bottom-[8%] left-[4%] z-5">
          <PizzaBox />
        </div>
      )}
      {scene.decorations.includes("lamp") && (
        <div className="absolute bottom-[15%] right-[10%] z-5">
          <DeskLamp accent={scene.accentColor} />
        </div>
      )}
      {scene.decorations.includes("snack-bar") && (
        <div className="absolute bottom-[8%] right-[5%] z-5">
          <SnackBar />
        </div>
      )}
      {scene.decorations.includes("tv-screen") && (
        <div className="absolute top-[5%] left-[15%] z-5">
          <WallTV accent={scene.accentColor} />
        </div>
      )}
      {scene.decorations.includes("meeting-room") && (
        <div className="absolute bottom-[10%] left-[78%] z-5 opacity-50">
          <MeetingRoom />
        </div>
      )}
      {scene.decorations.includes("water-cooler") && (
        <div className="absolute bottom-[12%] right-[8%] z-5">
          <WaterCooler />
        </div>
      )}
      {scene.decorations.includes("printer") && (
        <div className="absolute bottom-[8%] left-[70%] z-5">
          <Printer />
        </div>
      )}
      {scene.decorations.includes("garden") && (
        <div className="absolute bottom-[5%] right-[3%] z-5">
          <Plant />
        </div>
      )}
      {scene.decorations.includes("fountain") && (
        <div className="absolute bottom-[6%] left-[45%] z-5">
          <Fountain />
        </div>
      )}
      {scene.decorations.includes("hologram") && (
        <div
          className="absolute top-[20%] left-1/2 -translate-x-1/2 z-5"
          style={{ filter: `drop-shadow(0 0 8px ${scene.accentColor})` }}
        >
          <HologramDisplay accent={scene.accentColor} />
        </div>
      )}
      {scene.decorations.includes("neon-lights") && (
        <div className="absolute top-[8%] left-[10%] z-5">
          <NeonSign accent={scene.accentColor} />
        </div>
      )}
      {scene.decorations.includes("robot") && (
        <div className="absolute bottom-[6%] left-[3%] z-5">
          <RobotAssistant />
        </div>
      )}

      {/* Agents at desks */}
      {agents.map((agent, index) => {
        const pos = scene.deskPositions[index % scene.deskPositions.length];
        if (!pos) return null;
        return <AgentCharacter key={agent.id} agent={agent} position={pos} />;
      })}

      {/* Empty state */}
      {agents.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center p-6 rounded-xl backdrop-blur-sm bg-black/20">
            <p className="text-4xl mb-3">🏢</p>
            <p
              className="text-lg font-bold"
              style={{ color: scene.accentColor }}
            >
              Office is empty
            </p>
            <p
              className="text-sm opacity-70 mt-1"
              style={{ color: scene.accentColor }}
            >
              Start a Claude Code session to see agents appear
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
