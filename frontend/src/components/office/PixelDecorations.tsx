/**
 * Pixel-art SVG decorations for office scenes.
 *
 * Each decoration is a small SVG rendered on a grid (G = 3px per cell)
 * to match the character sprite aesthetic.
 */

const G = 3;

type R = [number, number, number, number, string];

function rects(rs: R[]) {
  return rs.map(([x, y, w, h, f], i) => (
    <rect key={i} x={x * G} y={y * G} width={w * G} height={h * G} fill={f} />
  ));
}

/* ------------------------------------------------------------------ */
/*  Lv1 — Garage                                                      */
/* ------------------------------------------------------------------ */

/** Garage rolling door on the wall */
export function GarageDoor() {
  return (
    <svg
      width={40 * G}
      height={20 * G}
      viewBox={`0 0 ${40 * G} ${20 * G}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      {rects([
        // frame
        [0, 0, 40, 1, "#555"],
        [0, 0, 1, 20, "#555"],
        [39, 0, 1, 20, "#555"],
        // door panels (horizontal slats)
        [1, 1, 38, 3, "#6b6b6b"],
        [1, 4, 38, 1, "#555"],
        [1, 5, 38, 3, "#737373"],
        [1, 8, 38, 1, "#555"],
        [1, 9, 38, 3, "#6b6b6b"],
        [1, 12, 38, 1, "#555"],
        [1, 13, 38, 3, "#737373"],
        [1, 16, 38, 1, "#555"],
        [1, 17, 38, 3, "#6b6b6b"],
        // handle
        [18, 14, 4, 1, "#888"],
      ])}
    </svg>
  );
}

/** Metal shelf with items */
export function Shelf() {
  return (
    <svg
      width={16 * G}
      height={20 * G}
      viewBox={`0 0 ${16 * G} ${20 * G}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      {rects([
        // frame
        [0, 0, 1, 20, "#777"],
        [15, 0, 1, 20, "#777"],
        // shelf boards
        [0, 5, 16, 1, "#888"],
        [0, 11, 16, 1, "#888"],
        [0, 17, 16, 1, "#888"],
        // items on top shelf — box
        [2, 2, 4, 3, "#d4a574"],
        [3, 2, 2, 1, "#c49464"],
        // items on top shelf — can
        [8, 3, 2, 2, "#4ade80"],
        [11, 3, 2, 2, "#60a5fa"],
        // items on middle shelf — books
        [2, 7, 2, 4, "#ef4444"],
        [4, 8, 2, 3, "#3b82f6"],
        [6, 7, 2, 4, "#f59e0b"],
        [9, 8, 3, 3, "#8b5cf6"],
        // items on bottom shelf — toolbox
        [2, 13, 5, 4, "#dc2626"],
        [3, 13, 3, 1, "#888"],
        // wrench
        [10, 14, 3, 1, "#aaa"],
        [10, 13, 1, 2, "#aaa"],
      ])}
    </svg>
  );
}

/** Poster / motivational sign on the wall */
export function Poster({ accent = "#ff9f43" }: { accent?: string }) {
  return (
    <svg
      width={10 * G}
      height={12 * G}
      viewBox={`0 0 ${10 * G} ${12 * G}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      {rects([
        // frame
        [0, 0, 10, 12, "#f5f0eb"],
        [0, 0, 10, 1, "#ccc"],
        [0, 0, 1, 12, "#ccc"],
        [9, 0, 1, 12, "#bbb"],
        [0, 11, 10, 1, "#bbb"],
        // content — star / logo
        [4, 3, 2, 2, accent],
        [3, 4, 4, 1, accent],
        [4, 5, 2, 1, accent],
        // text lines
        [2, 7, 6, 1, "#999"],
        [3, 9, 4, 1, "#bbb"],
      ])}
    </svg>
  );
}

/** Pixel pizza box (open) */
export function PizzaBox() {
  return (
    <svg
      width={10 * G}
      height={6 * G}
      viewBox={`0 0 ${10 * G} ${6 * G}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      {rects([
        // box bottom
        [0, 2, 10, 4, "#e8d5c4"],
        [0, 2, 10, 1, "#d4a574"],
        // lid (tilted back)
        [0, 0, 10, 2, "#f0e0d0"],
        [1, 0, 8, 1, "#d4a574"],
        // pizza slice inside
        [2, 3, 3, 2, "#f59e0b"],
        [3, 3, 1, 1, "#ef4444"],
        [5, 4, 2, 1, "#f59e0b"],
        [6, 3, 2, 2, "#f59e0b"],
        [7, 3, 1, 1, "#22c55e"],
      ])}
    </svg>
  );
}

/** Desk lamp */
export function DeskLamp({ accent = "#ff9f43" }: { accent?: string }) {
  return (
    <svg
      width={8 * G}
      height={12 * G}
      viewBox={`0 0 ${8 * G} ${12 * G}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      {rects([
        // base
        [2, 10, 4, 2, "#555"],
        [3, 10, 2, 1, "#666"],
        // stem
        [3, 5, 2, 5, "#666"],
        // arm
        [3, 4, 4, 1, "#666"],
        // shade
        [4, 1, 4, 3, "#333"],
        [5, 1, 2, 1, "#444"],
      ])}
      {/* Glow */}
      <circle cx={6 * G} cy={3.5 * G} r={2 * G} fill={accent} opacity={0.15}>
        <animate
          attributeName="opacity"
          values="0.1;0.2;0.1"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

/** Whiteboard with scribbles */
export function Whiteboard() {
  return (
    <svg
      width={18 * G}
      height={12 * G}
      viewBox={`0 0 ${18 * G} ${12 * G}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      {rects([
        // board
        [0, 0, 18, 12, "#f8f8f8"],
        // frame
        [0, 0, 18, 1, "#aaa"],
        [0, 0, 1, 12, "#aaa"],
        [17, 0, 1, 12, "#999"],
        [0, 11, 18, 1, "#999"],
        // tray
        [2, 11, 14, 1, "#bbb"],
        // scribbles — lines
        [2, 2, 7, 1, "#3b82f6"],
        [2, 4, 5, 1, "#ef4444"],
        [8, 4, 4, 1, "#ef4444"],
        [2, 6, 8, 1, "#22c55e"],
        // box diagram
        [12, 2, 4, 3, "transparent"],
        [12, 2, 4, 1, "#8b5cf6"],
        [12, 2, 1, 3, "#8b5cf6"],
        [15, 2, 1, 3, "#8b5cf6"],
        [12, 4, 4, 1, "#8b5cf6"],
        // arrow
        [13, 5, 1, 2, "#8b5cf6"],
        [12, 7, 3, 1, "#8b5cf6"],
        // sticky notes
        [2, 8, 3, 2, "#fbbf24"],
        [6, 8, 3, 2, "#a78bfa"],
        [10, 8, 3, 2, "#34d399"],
      ])}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Lv2 — Co-working                                                   */
/* ------------------------------------------------------------------ */

/** Coffee machine */
export function CoffeeMachine() {
  return (
    <svg
      width={8 * G}
      height={14 * G}
      viewBox={`0 0 ${8 * G} ${14 * G}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      {rects([
        // body
        [1, 2, 6, 10, "#4a4a4a"],
        [0, 12, 8, 2, "#555"],
        // top
        [1, 0, 6, 2, "#555"],
        [2, 0, 4, 1, "#666"],
        // display
        [2, 3, 4, 2, "#1a1a2e"],
      ])}
      {/* Screen glow */}
      <rect
        x={2 * G}
        y={3 * G}
        width={4 * G}
        height={2 * G}
        fill="#4ade80"
        opacity={0.6}
      >
        <animate
          attributeName="fill"
          values="#4ade80;#60a5fa;#4ade80"
          dur="3s"
          repeatCount="indefinite"
        />
      </rect>
      {rects([
        // buttons
        [2, 6, 1, 1, "#ef4444"],
        [4, 6, 1, 1, "#22c55e"],
        [6, 6, 1, 1, "#60a5fa"],
        // nozzle
        [3, 8, 2, 1, "#333"],
        [3, 9, 1, 1, "#333"],
        // cup
        [2, 10, 4, 2, "#f5f0eb"],
        [2, 10, 4, 1, "#ddd"],
      ])}
      {/* Steam */}
      <rect x={3 * G} y={8 * G} width={G} height={G} fill="#fff" opacity={0.3}>
        <animate
          attributeName="opacity"
          values="0;0.4;0"
          dur="2s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  );
}

/** Potted plant */
export function Plant() {
  return (
    <svg
      width={10 * G}
      height={14 * G}
      viewBox={`0 0 ${10 * G} ${14 * G}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      {rects([
        // pot
        [2, 9, 6, 5, "#c0652a"],
        [3, 9, 4, 1, "#d4783e"],
        [3, 13, 4, 1, "#a0522d"],
        // soil
        [3, 8, 4, 1, "#5a3a1a"],
        // stem
        [4, 4, 2, 4, "#22c55e"],
        // leaves
        [2, 2, 3, 3, "#4ade80"],
        [5, 1, 3, 3, "#22c55e"],
        [1, 4, 2, 2, "#4ade80"],
        [7, 3, 2, 2, "#22c55e"],
        [3, 0, 2, 2, "#34d399"],
        [6, 0, 2, 2, "#22c55e"],
      ])}
    </svg>
  );
}

/** Bookshelf */
export function Bookshelf() {
  return (
    <svg
      width={14 * G}
      height={18 * G}
      viewBox={`0 0 ${14 * G} ${18 * G}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      {rects([
        // frame
        [0, 0, 1, 18, "#8B6914"],
        [13, 0, 1, 18, "#8B6914"],
        [0, 0, 14, 1, "#8B6914"],
        [0, 17, 14, 1, "#8B6914"],
        // shelves
        [0, 6, 14, 1, "#a07828"],
        [0, 12, 14, 1, "#a07828"],
        // top row — tall books
        [2, 1, 2, 5, "#ef4444"],
        [4, 2, 2, 4, "#3b82f6"],
        [6, 1, 1, 5, "#f59e0b"],
        [7, 1, 2, 5, "#8b5cf6"],
        [9, 2, 2, 4, "#14b8a6"],
        [11, 1, 1, 5, "#ec4899"],
        // middle row — mixed
        [2, 7, 2, 5, "#f97316"],
        [4, 8, 1, 4, "#6366f1"],
        [5, 7, 2, 5, "#10b981"],
        [8, 8, 3, 4, "#e879f9"],
        [11, 7, 1, 5, "#f43f5e"],
        // bottom row
        [2, 13, 3, 4, "#fbbf24"],
        [6, 14, 2, 3, "#7c3aed"],
        [9, 13, 3, 4, "#0ea5e9"],
      ])}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Lv3+ — Startup / Corporate                                        */
/* ------------------------------------------------------------------ */

/** TV / Monitor screen on wall */
export function WallTV({ accent = "#00b894" }: { accent?: string }) {
  return (
    <svg
      width={16 * G}
      height={10 * G}
      viewBox={`0 0 ${16 * G} ${10 * G}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      {rects([
        // bezel
        [0, 0, 16, 10, "#222"],
        [0, 0, 16, 1, "#333"],
        // screen
        [1, 1, 14, 8, "#1a1a2e"],
      ])}
      {/* Chart lines on screen */}
      <polyline
        points={`${2 * G},${7 * G} ${5 * G},${4 * G} ${8 * G},${5 * G} ${11 * G},${2 * G} ${14 * G},${3 * G}`}
        fill="none"
        stroke={accent}
        strokeWidth={G}
        opacity={0.8}
      >
        <animate
          attributeName="opacity"
          values="0.6;1;0.6"
          dur="2s"
          repeatCount="indefinite"
        />
      </polyline>
      {rects([
        // stand
        [7, 9, 2, 1, "#444"],
      ])}
    </svg>
  );
}

/** Water cooler */
export function WaterCooler() {
  return (
    <svg
      width={6 * G}
      height={14 * G}
      viewBox={`0 0 ${6 * G} ${14 * G}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      {rects([
        // bottle
        [1, 0, 4, 1, "#bfdbfe"],
        [2, 0, 2, 1, "#93c5fd"],
        [1, 1, 4, 4, "#bfdbfe"],
        [2, 1, 2, 3, "#93c5fd"],
        // body
        [0, 5, 6, 7, "#e5e7eb"],
        [1, 5, 4, 1, "#d1d5db"],
        // tap
        [1, 8, 1, 1, "#60a5fa"],
        [4, 8, 1, 1, "#ef4444"],
        // drip tray
        [1, 12, 4, 1, "#9ca3af"],
        // legs
        [0, 12, 1, 2, "#6b7280"],
        [5, 12, 1, 2, "#6b7280"],
      ])}
    </svg>
  );
}

/** Printer */
export function Printer() {
  return (
    <svg
      width={10 * G}
      height={8 * G}
      viewBox={`0 0 ${10 * G} ${8 * G}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      {rects([
        // body
        [0, 2, 10, 4, "#e5e7eb"],
        [1, 2, 8, 1, "#d1d5db"],
        // paper tray top
        [2, 0, 6, 2, "#fff"],
        [3, 0, 4, 1, "#f3f4f6"],
        // output slot
        [2, 6, 6, 1, "#333"],
        // paper coming out
        [3, 6, 4, 2, "#fff"],
        [4, 7, 2, 1, "#ddd"],
        // buttons
        [8, 3, 1, 1, "#22c55e"],
        [8, 4, 1, 1, "#6b7280"],
      ])}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Lv5+ — Tech Campus                                                 */
/* ------------------------------------------------------------------ */

/** Fountain */
export function Fountain() {
  return (
    <svg
      width={14 * G}
      height={10 * G}
      viewBox={`0 0 ${14 * G} ${10 * G}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      {rects([
        // basin
        [0, 6, 14, 4, "#9ca3af"],
        [1, 6, 12, 1, "#d1d5db"],
        // water
        [1, 7, 12, 2, "#60a5fa"],
        [2, 7, 10, 1, "#93c5fd"],
        // pedestal
        [6, 3, 2, 3, "#9ca3af"],
        // spout
        [6, 2, 2, 1, "#d1d5db"],
      ])}
      {/* Water drops */}
      <rect
        x={5 * G}
        y={3 * G}
        width={G}
        height={G}
        fill="#93c5fd"
        opacity={0.6}
      >
        <animate
          attributeName="opacity"
          values="0;0.8;0"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </rect>
      <rect
        x={8 * G}
        y={3 * G}
        width={G}
        height={G}
        fill="#93c5fd"
        opacity={0.3}
      >
        <animate
          attributeName="opacity"
          values="0;0.8;0"
          dur="1.5s"
          begin="0.5s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Lv6 — HQ of the Future                                            */
/* ------------------------------------------------------------------ */

/** Holographic display */
export function HologramDisplay({ accent = "#00fff5" }: { accent?: string }) {
  return (
    <svg
      width={12 * G}
      height={14 * G}
      viewBox={`0 0 ${12 * G} ${14 * G}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      {rects([
        // base
        [3, 12, 6, 2, "#333"],
        [4, 12, 4, 1, "#444"],
        // pedestal
        [5, 10, 2, 2, "#444"],
      ])}
      {/* Hologram projection */}
      <rect
        x={1 * G}
        y={1 * G}
        width={10 * G}
        height={9 * G}
        fill={accent}
        opacity={0.08}
      >
        <animate
          attributeName="opacity"
          values="0.05;0.12;0.05"
          dur="2s"
          repeatCount="indefinite"
        />
      </rect>
      {/* Hologram content — rotating cube wireframe */}
      <rect
        x={3 * G}
        y={2 * G}
        width={6 * G}
        height={6 * G}
        fill="none"
        stroke={accent}
        strokeWidth={1}
        opacity={0.6}
      >
        <animate
          attributeName="opacity"
          values="0.4;0.8;0.4"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </rect>
      <rect
        x={4 * G}
        y={3 * G}
        width={4 * G}
        height={4 * G}
        fill="none"
        stroke={accent}
        strokeWidth={1}
        opacity={0.4}
      >
        <animate
          attributeName="opacity"
          values="0.2;0.6;0.2"
          dur="1.5s"
          begin="0.3s"
          repeatCount="indefinite"
        />
      </rect>
      {/* Scan lines */}
      {[2, 4, 6, 8].map((y) => (
        <rect
          key={y}
          x={2 * G}
          y={y * G}
          width={8 * G}
          height={1}
          fill={accent}
          opacity={0.15}
        />
      ))}
    </svg>
  );
}

/** Neon sign */
export function NeonSign({ accent = "#00fff5" }: { accent?: string }) {
  return (
    <svg
      width={14 * G}
      height={6 * G}
      viewBox={`0 0 ${14 * G} ${6 * G}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      {/* "CODE" text */}
      {rects([
        // C
        [1, 1, 1, 4, accent],
        [1, 1, 2, 1, accent],
        [1, 4, 2, 1, accent],
        // O
        [4, 1, 1, 4, accent],
        [4, 1, 2, 1, accent],
        [5, 1, 1, 4, accent],
        [4, 4, 2, 1, accent],
        // D
        [7, 1, 1, 4, accent],
        [7, 1, 2, 1, accent],
        [8, 1, 1, 4, accent],
        [7, 4, 2, 1, accent],
        // E
        [10, 1, 1, 4, accent],
        [10, 1, 2, 1, accent],
        [10, 2, 2, 1, accent],
        [10, 4, 2, 1, accent],
      ])}
      {/* Glow */}
      <rect
        x={0}
        y={0}
        width={14 * G}
        height={6 * G}
        fill={accent}
        opacity={0.05}
      >
        <animate
          attributeName="opacity"
          values="0.03;0.08;0.03"
          dur="2s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  );
}

/** Small robot assistant */
export function RobotAssistant() {
  return (
    <svg
      width={8 * G}
      height={10 * G}
      viewBox={`0 0 ${8 * G} ${10 * G}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      {rects([
        // antenna
        [3, 0, 2, 1, "#888"],
        [4, 0, 1, 1, "#ef4444"],
        // head
        [1, 1, 6, 4, "#d1d5db"],
        [0, 2, 1, 2, "#9ca3af"],
        [7, 2, 1, 2, "#9ca3af"],
        // eyes
        [2, 2, 2, 2, "#1a1a2e"],
        [5, 2, 2, 2, "#1a1a2e"],
      ])}
      {/* LED eyes */}
      <rect
        x={2 * G}
        y={2 * G}
        width={2 * G}
        height={2 * G}
        fill="#4ade80"
        opacity={0.7}
      >
        <animate
          attributeName="fill"
          values="#4ade80;#60a5fa;#4ade80"
          dur="3s"
          repeatCount="indefinite"
        />
      </rect>
      <rect
        x={5 * G}
        y={2 * G}
        width={2 * G}
        height={2 * G}
        fill="#4ade80"
        opacity={0.7}
      >
        <animate
          attributeName="fill"
          values="#4ade80;#60a5fa;#4ade80"
          dur="3s"
          repeatCount="indefinite"
        />
      </rect>
      {rects([
        // body
        [1, 5, 6, 3, "#e5e7eb"],
        [2, 5, 4, 1, "#d1d5db"],
        // chest light
        [3, 6, 2, 1, "#ef4444"],
        // arms
        [0, 5, 1, 2, "#9ca3af"],
        [7, 5, 1, 2, "#9ca3af"],
        // wheels
        [1, 8, 2, 2, "#555"],
        [5, 8, 2, 2, "#555"],
      ])}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared / Multi-level                                               */
/* ------------------------------------------------------------------ */

/** Snack bar counter */
export function SnackBar() {
  return (
    <svg
      width={16 * G}
      height={8 * G}
      viewBox={`0 0 ${16 * G} ${8 * G}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      {rects([
        // counter
        [0, 3, 16, 5, "#8B6914"],
        [0, 3, 16, 1, "#a07828"],
        // items on top
        [1, 1, 2, 2, "#ef4444"], // apple
        [4, 1, 3, 2, "#fbbf24"], // chips bag
        [8, 0, 2, 3, "#8b5cf6"], // drink can
        [11, 1, 3, 2, "#22c55e"], // snack box
      ])}
    </svg>
  );
}

/** Meeting room glass partition */
export function MeetingRoom() {
  return (
    <svg
      width={20 * G}
      height={16 * G}
      viewBox={`0 0 ${20 * G} ${16 * G}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      {rects([
        // glass walls
        [0, 0, 1, 16, "#bfdbfe"],
        [19, 0, 1, 16, "#bfdbfe"],
        [0, 0, 20, 1, "#bfdbfe"],
        // glass fill (transparent effect)
        [1, 1, 18, 15, "#dbeafe"],
        // table
        [4, 7, 12, 3, "#8B6914"],
        [5, 7, 10, 1, "#a07828"],
        // chairs (top)
        [5, 5, 3, 2, "#6b7280"],
        [12, 5, 3, 2, "#6b7280"],
        // chairs (bottom)
        [5, 10, 3, 2, "#6b7280"],
        [12, 10, 3, 2, "#6b7280"],
        // door frame
        [8, 14, 4, 2, "#9ca3af"],
      ])}
    </svg>
  );
}
