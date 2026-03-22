import { useEffect, useState } from "react";

/**
 * Pixel-art wall clock that shows the current time.
 * Uses a PNG clock face with CSS-drawn hour/minute hands.
 */
export default function PixelClock({
  x,
  y,
  tileSize,
}: {
  x: number;
  y: number;
  tileSize: number;
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const hourAngle = hours * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  // Clock center offset within the 48×48 PNG
  const clockSize = 48;
  const cx = clockSize / 2;
  const cy = clockSize / 2 - 2;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x * tileSize - 8,
        top: y * tileSize + 2,
        width: clockSize,
        height: clockSize,
        zIndex: 6,
      }}
    >
      {/* Clock face PNG */}
      <img
        src="/assets/tiles/wall-clock.png"
        alt=""
        draggable={false}
        style={{
          width: clockSize,
          height: clockSize,
          imageRendering: "pixelated",
        }}
      />

      {/* Clock hands via SVG overlay */}
      <svg
        width={clockSize}
        height={clockSize}
        viewBox={`0 0 ${clockSize} ${clockSize}`}
        className="absolute inset-0"
        style={{ imageRendering: "auto" }}
      >
        {/* Hour hand */}
        <line
          x1={cx}
          y1={cy}
          x2={cx + Math.sin((hourAngle * Math.PI) / 180) * 10}
          y2={cy - Math.cos((hourAngle * Math.PI) / 180) * 10}
          stroke="#3a3028"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {/* Minute hand */}
        <line
          x1={cx}
          y1={cy}
          x2={cx + Math.sin((minuteAngle * Math.PI) / 180) * 14}
          y2={cy - Math.cos((minuteAngle * Math.PI) / 180) * 14}
          stroke="#3a3028"
          strokeWidth={1.8}
          strokeLinecap="round"
        />
        {/* Second hand */}
        <line
          x1={cx}
          y1={cy}
          x2={cx + Math.sin((secondAngle * Math.PI) / 180) * 15}
          y2={cy - Math.cos((secondAngle * Math.PI) / 180) * 15}
          stroke="#b03030"
          strokeWidth={0.8}
          strokeLinecap="round"
        />
        {/* Center cap */}
        <circle cx={cx} cy={cy} r={1.5} fill="#3a3028" />
      </svg>

      {/* Digital time below clock */}
      <div
        className="absolute flex justify-center"
        style={{
          left: 0,
          bottom: -2,
          width: clockSize,
        }}
      >
        <span
          style={{
            fontSize: 7,
            fontWeight: 700,
            color: "#e8e0d0",
            fontFamily: "'Courier New', monospace",
            backgroundColor: "rgba(40,35,30,0.75)",
            padding: "0px 3px",
            borderRadius: 2,
            letterSpacing: "0.5px",
          }}
        >
          {String(now.getHours()).padStart(2, "0")}:
          {String(minutes).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
