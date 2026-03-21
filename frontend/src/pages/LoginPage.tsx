import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "@components/LoginButton";

/*
 * Gather Town–style pixel character (SVG, ~16×24 grid scaled up).
 * Each character is recognisable: hair, face, eyes, shirt, arms, pants, shoes.
 */
function GatherChar({
  hair,
  shirt,
  pants = "#3b4252",
  x,
  y,
  flip,
}: {
  hair: string;
  shirt: string;
  pants?: string;
  x: number;
  y: number;
  flip?: boolean;
}) {
  // 1 grid unit = 3px at final render (16×24 grid → 48×72 px)
  const G = 3;
  const rects: [number, number, number, number, string][] = [
    // ── hair ──
    [4, 0, 8, 2, hair],
    [3, 1, 1, 2, hair],
    [12, 1, 1, 2, hair],
    // ── head (skin) ──
    [4, 2, 8, 6, "#fdd9b5"],
    [3, 3, 1, 4, "#fdd9b5"],
    [12, 3, 1, 4, "#fdd9b5"],
    // ── eyes ──
    [5, 4, 2, 2, "#2e3440"],
    [9, 4, 2, 2, "#2e3440"],
    // ── mouth ──
    [7, 6, 2, 1, "#d08770"],
    // ── neck ──
    [6, 8, 4, 1, "#f0c8a0"],
    // ── shirt body ──
    [3, 9, 10, 6, shirt],
    // ── collar ──
    [5, 9, 6, 1, mixColor(shirt, "#fff", 0.3)],
    // ── left arm ──
    [1, 9, 2, 5, shirt],
    [1, 14, 2, 1, "#fdd9b5"],
    // ── right arm ──
    [13, 9, 2, 5, shirt],
    [13, 14, 2, 1, "#fdd9b5"],
    // ── pants ──
    [4, 15, 3, 4, pants],
    [9, 15, 3, 4, pants],
    // ── belt ──
    [4, 15, 8, 1, mixColor(pants, "#000", 0.2)],
    // ── shoes ──
    [3, 19, 4, 2, "#4c566a"],
    [9, 19, 4, 2, "#4c566a"],
    // ── shoe soles ──
    [3, 21, 4, 1, "#2e3440"],
    [9, 21, 4, 1, "#2e3440"],
  ];

  return (
    <svg
      width={16 * G}
      height={24 * G}
      viewBox={`0 0 ${16 * G} ${24 * G}`}
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: flip ? "scaleX(-1)" : undefined,
        imageRendering: "pixelated",
      }}
      shapeRendering="crispEdges"
    >
      {rects.map(([rx, ry, rw, rh, fill], i) => (
        <rect
          key={i}
          x={rx * G}
          y={ry * G}
          width={rw * G}
          height={rh * G}
          fill={fill}
        />
      ))}
    </svg>
  );
}

/** Naive colour blend for highlights / shadows */
function mixColor(base: string, mix: string, t: number): string {
  const p = (c: string) => {
    const n = parseInt(c.slice(1), 16);
    return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
  };
  const [r1, g1, b1] = p(base);
  const [r2, g2, b2] = p(mix);
  const c = (a: number, b: number) =>
    Math.round(a + (b - a) * t)
      .toString(16)
      .padStart(2, "0");
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`;
}

/* ── furniture components ── */
function PixelDesk({ x, y, screen }: { x: number; y: number; screen: string }) {
  const G = 3;
  return (
    <svg
      width={24 * G}
      height={20 * G}
      viewBox={`0 0 ${24 * G} ${20 * G}`}
      style={{
        position: "absolute",
        left: x,
        top: y,
        imageRendering: "pixelated",
      }}
      shapeRendering="crispEdges"
    >
      {/* monitor back */}
      <rect x={6 * G} y={0} width={12 * G} height={9 * G} fill="#434c5e" />
      {/* screen */}
      <rect
        x={7 * G}
        y={1 * G}
        width={10 * G}
        height={7 * G}
        fill={screen}
        rx={0}
      />
      {/* screen glow */}
      <rect
        x={7 * G}
        y={1 * G}
        width={10 * G}
        height={7 * G}
        fill={screen}
        opacity={0.15}
      >
        <animate
          attributeName="opacity"
          values="0.1;0.25;0.1"
          dur="3s"
          repeatCount="indefinite"
        />
      </rect>
      {/* stand */}
      <rect x={10 * G} y={9 * G} width={4 * G} height={2 * G} fill="#4c566a" />
      <rect x={8 * G} y={11 * G} width={8 * G} height={1 * G} fill="#4c566a" />
      {/* desk surface */}
      <rect x={0} y={12 * G} width={24 * G} height={3 * G} fill="#bf8040" />
      <rect x={0} y={12 * G} width={24 * G} height={1 * G} fill="#d4924d" />
      {/* desk legs */}
      <rect x={1 * G} y={15 * G} width={2 * G} height={5 * G} fill="#a06830" />
      <rect x={21 * G} y={15 * G} width={2 * G} height={5 * G} fill="#a06830" />
    </svg>
  );
}

function PixelPlant({ x, y }: { x: number; y: number }) {
  const G = 3;
  return (
    <svg
      width={10 * G}
      height={16 * G}
      viewBox={`0 0 ${10 * G} ${16 * G}`}
      style={{
        position: "absolute",
        left: x,
        top: y,
        imageRendering: "pixelated",
      }}
      shapeRendering="crispEdges"
    >
      {/* leaves */}
      <rect x={3 * G} y={0} width={4 * G} height={3 * G} fill="#4ade80" />
      <rect x={1 * G} y={2 * G} width={3 * G} height={3 * G} fill="#22c55e" />
      <rect x={6 * G} y={2 * G} width={3 * G} height={3 * G} fill="#22c55e" />
      <rect x={4 * G} y={3 * G} width={2 * G} height={4 * G} fill="#16a34a" />
      {/* stem */}
      <rect x={4 * G} y={7 * G} width={2 * G} height={4 * G} fill="#65451f" />
      {/* pot */}
      <rect x={2 * G} y={11 * G} width={6 * G} height={2 * G} fill="#b45309" />
      <rect x={3 * G} y={13 * G} width={4 * G} height={3 * G} fill="#92400e" />
    </svg>
  );
}

function PixelChair({ x, y, color }: { x: number; y: number; color: string }) {
  const G = 3;
  return (
    <svg
      width={8 * G}
      height={12 * G}
      viewBox={`0 0 ${8 * G} ${12 * G}`}
      style={{
        position: "absolute",
        left: x,
        top: y,
        imageRendering: "pixelated",
      }}
      shapeRendering="crispEdges"
    >
      {/* back */}
      <rect x={0} y={0} width={8 * G} height={6 * G} fill={color} />
      {/* seat */}
      <rect
        x={0}
        y={6 * G}
        width={8 * G}
        height={2 * G}
        fill={mixColor(color, "#000", 0.15)}
      />
      {/* legs */}
      <rect x={0} y={8 * G} width={2 * G} height={4 * G} fill="#4c566a" />
      <rect x={6 * G} y={8 * G} width={2 * G} height={4 * G} fill="#4c566a" />
    </svg>
  );
}

/* ── main login page ── */
const LoginPage = () => {
  const { isAuthenticated } = useAuth0();
  if (isAuthenticated) return null;

  const agents: {
    hair: string;
    shirt: string;
    x: number;
    y: number;
    flip?: boolean;
  }[] = [
    { hair: "#7c3aed", shirt: "#a855f7", x: 56, y: 50, flip: false },
    { hair: "#1e3a5f", shirt: "#3b82f6", x: 175, y: 44, flip: true },
    { hair: "#14532d", shirt: "#22c55e", x: 300, y: 54, flip: false },
    { hair: "#7c2d12", shirt: "#f97316", x: 415, y: 40, flip: true },
    { hair: "#164e63", shirt: "#06b6d4", x: 535, y: 50, flip: false },
    { hair: "#831843", shirt: "#ec4899", x: 118, y: 90, flip: true },
    { hair: "#713f12", shirt: "#eab308", x: 360, y: 95, flip: false },
  ];

  const desks: { x: number; y: number; screen: string }[] = [
    { x: 24, y: 20, screen: "#22c55e" },
    { x: 143, y: 14, screen: "#60a5fa" },
    { x: 268, y: 24, screen: "#22c55e" },
    { x: 383, y: 10, screen: "#facc15" },
    { x: 503, y: 20, screen: "#34d399" },
    { x: 86, y: 62, screen: "#f87171" },
    { x: 328, y: 66, screen: "#60a5fa" },
  ];

  const chairs: { x: number; y: number; color: string }[] = [
    { x: 48, y: 62, color: "#6366f1" },
    { x: 167, y: 56, color: "#6366f1" },
    { x: 292, y: 66, color: "#6366f1" },
    { x: 407, y: 52, color: "#6366f1" },
    { x: 527, y: 62, color: "#6366f1" },
    { x: 110, y: 104, color: "#6366f1" },
    { x: 352, y: 108, color: "#6366f1" },
  ];

  return (
    <div className="relative flex flex-col justify-center items-center h-screen overflow-hidden select-none">
      {/* ── Gather-style tiled floor ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#8ec58e",
          backgroundImage: `
            linear-gradient(45deg, #82b882 25%, transparent 25%),
            linear-gradient(-45deg, #82b882 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #82b882 75%),
            linear-gradient(-45deg, transparent 75%, #82b882 75%)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
          imageRendering: "pixelated",
        }}
      />
      <div className="absolute inset-0 bg-black/15" />

      {/* ── Pixel office diorama ── */}
      <div
        className="relative mb-8 overflow-hidden"
        style={{
          width: 620,
          height: 180,
          background:
            "linear-gradient(180deg, #d8dee9 0%, #e5e9f0 50%, #c8b496 50%, #c0a882 100%)",
          border: "4px solid #4c566a",
          borderRadius: 6,
          boxShadow: "0 6px 30px rgba(0,0,0,0.35)",
          imageRendering: "pixelated",
        }}
      >
        {/* Baseboard */}
        <div
          className="absolute left-0 right-0"
          style={{ top: "50%", height: 4, background: "#8b6840" }}
        />

        {/* Whiteboard */}
        <svg
          width={60}
          height={40}
          style={{ position: "absolute", left: 210, top: 8 }}
          shapeRendering="crispEdges"
        >
          <rect
            x={0}
            y={0}
            width={60}
            height={40}
            fill="#eceff4"
            stroke="#b0b8c4"
            strokeWidth={2}
          />
          <line
            x1={10}
            y1={12}
            x2={50}
            y2={12}
            stroke="#88c0d0"
            strokeWidth={2}
          />
          <line
            x1={10}
            y1={20}
            x2={40}
            y2={20}
            stroke="#a3be8c"
            strokeWidth={2}
          />
          <line
            x1={10}
            y1={28}
            x2={45}
            y2={28}
            stroke="#bf616a"
            strokeWidth={2}
          />
        </svg>

        {/* Wall clock */}
        <svg
          width={24}
          height={24}
          style={{ position: "absolute", left: 470, top: 6 }}
          shapeRendering="crispEdges"
        >
          <circle
            cx={12}
            cy={12}
            r={11}
            fill="#eceff4"
            stroke="#4c566a"
            strokeWidth={2}
          />
          <line
            x1={12}
            y1={12}
            x2={12}
            y2={5}
            stroke="#2e3440"
            strokeWidth={2}
          />
          <line
            x1={12}
            y1={12}
            x2={17}
            y2={10}
            stroke="#2e3440"
            strokeWidth={1.5}
          />
          <circle cx={12} cy={12} r={1.5} fill="#bf616a" />
        </svg>

        {/* Desks */}
        {desks.map((d, i) => (
          <PixelDesk key={`d${i}`} {...d} />
        ))}

        {/* Chairs */}
        {chairs.map((c, i) => (
          <PixelChair key={`c${i}`} {...c} />
        ))}

        {/* Characters */}
        {agents.map((a, i) => (
          <GatherChar key={`a${i}`} {...a} />
        ))}

        {/* Plants */}
        <PixelPlant x={2} y={124} />
        <PixelPlant x={250} y={130} />
        <PixelPlant x={580} y={120} />
      </div>

      {/* ── Login card ── */}
      <div
        className="relative z-10 px-10 py-8 text-center max-w-sm w-full"
        style={{
          background: "#eceff4",
          border: "4px solid #4c566a",
          borderRadius: 6,
          boxShadow: "5px 5px 0 #2e3440",
        }}
      >
        {/* Badge */}
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1 text-[11px] font-bold tracking-widest text-white whitespace-nowrap"
          style={{
            background: "#5e81ac",
            border: "3px solid #4c566a",
            borderRadius: 3,
            fontFamily: "'Courier New', monospace",
            boxShadow: "2px 2px 0 #2e3440",
          }}
        >
          AGENT VIRTUAL OFFICE
        </div>

        <div className="mt-4 mb-2">
          <span className="text-4xl">🏢</span>
        </div>

        <h1
          className="text-[#2e3440] mb-1 text-xl font-bold"
          style={{ fontFamily: "'Courier New', monospace" }}
        >
          Welcome!
        </h1>
        <p
          className="text-[#4c566a] mb-6 text-sm"
          style={{ fontFamily: "'Courier New', monospace" }}
        >
          即時觀看你的 AI Agent 在辦公室工作
        </p>

        <LoginButton variant="primary" size="lg" fullWidth>
          🚀 登入開始
        </LoginButton>

        {/* Mini character parade */}
        <div className="mt-6 flex justify-center gap-4 opacity-80">
          {["#a855f7", "#3b82f6", "#22c55e", "#f97316", "#06b6d4"].map(
            (c, i) => (
              <svg
                key={i}
                width={12}
                height={20}
                viewBox="0 0 12 20"
                shapeRendering="crispEdges"
                style={{ imageRendering: "pixelated" }}
              >
                {/* hair */}
                <rect
                  x={2}
                  y={0}
                  width={8}
                  height={3}
                  fill={mixColor(c, "#000", 0.3)}
                />
                {/* face */}
                <rect x={2} y={3} width={8} height={5} fill="#fdd9b5" />
                {/* eyes */}
                <rect x={3} y={5} width={2} height={1} fill="#2e3440" />
                <rect x={7} y={5} width={2} height={1} fill="#2e3440" />
                {/* body */}
                <rect x={1} y={8} width={10} height={6} fill={c} />
                {/* pants */}
                <rect x={2} y={14} width={3} height={4} fill="#3b4252" />
                <rect x={7} y={14} width={3} height={4} fill="#3b4252" />
                {/* shoes */}
                <rect x={2} y={18} width={3} height={2} fill="#4c566a" />
                <rect x={7} y={18} width={3} height={2} fill="#4c566a" />
              </svg>
            ),
          )}
        </div>
      </div>

      {/* Footer */}
      <p
        className="relative z-10 mt-5 text-white/70 text-xs tracking-wide"
        style={{ fontFamily: "'Courier New', monospace" }}
      >
        Powered by Claude Code &middot; Pixel Office v1.0
      </p>
    </div>
  );
};

export default LoginPage;
