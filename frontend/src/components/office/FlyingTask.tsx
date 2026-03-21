import { useEffect } from "react";

interface Props {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  type: "task" | "complete";
  onComplete: () => void;
}

const DURATION_MS = 2200;

export default function FlyingTask({
  fromX,
  fromY,
  toX,
  toY,
  type,
  onComplete,
}: Props) {
  useEffect(() => {
    const timer = setTimeout(onComplete, DURATION_MS + 400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const midX = (fromX + toX) / 2;
  const midY = Math.min(fromY, toY) - 15;

  const color = type === "task" ? "#5e81ac" : "#a3be8c";
  const glowColor =
    type === "task" ? "rgba(94,129,172,0.6)" : "rgba(163,190,140,0.6)";

  const cssVars = {
    ["--from-x" as string]: `${fromX}%`,
    ["--from-y" as string]: `${fromY}%`,
    ["--mid-x" as string]: `${midX}%`,
    ["--mid-y" as string]: `${midY}%`,
    ["--to-x" as string]: `${toX}%`,
    ["--to-y" as string]: `${toY}%`,
  } as React.CSSProperties;

  return (
    <>
      {/* Main flying element */}
      <div className="flying-task" style={{ ...cssVars, zIndex: 15 }}>
        <svg
          width="14"
          height="10"
          viewBox="0 0 14 10"
          style={{ shapeRendering: "crispEdges", imageRendering: "pixelated" }}
        >
          {type === "task" ? (
            <>
              {/* Envelope shape */}
              <rect x="0" y="2" width="14" height="8" fill={color} />
              <rect x="1" y="3" width="12" height="6" fill="#eceff4" />
              <polygon points="0,2 7,6 14,2" fill={color} />
              <rect x="5" y="0" width="4" height="3" fill={color} opacity="0.6" />
            </>
          ) : (
            <>
              {/* Checkmark badge */}
              <rect x="1" y="0" width="12" height="10" rx="1" fill={color} />
              <polyline
                points="3,5 6,8 11,2"
                fill="none"
                stroke="#eceff4"
                strokeWidth="2"
              />
            </>
          )}
        </svg>
      </div>

      {/* Particle trail */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flying-task flying-task-particle"
          style={{
            ...cssVars,
            zIndex: 14,
          }}
        >
          <div
            style={{
              width: 4 - i * 0.5,
              height: 4 - i * 0.5,
              borderRadius: "50%",
              backgroundColor: glowColor,
              boxShadow: `0 0 ${4 - i}px ${glowColor}`,
              opacity: 0.8 - i * 0.15,
            }}
          />
        </div>
      ))}

      {/* Impact flash at destination */}
      <div
        className="flying-task-impact"
        style={{
          left: `${toX}%`,
          top: `${toY}%`,
          width: 40,
          height: 40,
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          borderRadius: "50%",
          zIndex: 14,
        }}
      />
    </>
  );
}
