import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import PixelLayout from "@components/PixelLayout";
import { RoleSprite } from "@components/office/CharacterSprites";
import Button from "@components/ui/Button";
import { ROLE_CONFIGS } from "../config/agent-roles";
import type { AgentRole } from "../types/agent";

const MONO = "'Courier New', monospace";

/** Naive colour blend */
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

/**
 * Wandering pixel character with walking bob animation.
 * - Wanders between random waypoints via CSS keyframes.
 * - A separate "bob" animation simulates a 2-frame walk cycle (slight up/down + leg swap).
 */
/** Wandering pixel character — uses role-specific sprite */
function WanderingChar({ role, id }: { role: AgentRole; id: number }) {
  const anim = useMemo(() => {
    const seed = id * 137;
    const dur = 10 + (seed % 8); // 10-17s per wander cycle
    const pts = [3, 11, 17, 23, 31].map((p) => ({
      x: 5 + ((seed * p) % 80),
      y: 15 + ((seed * (p + 2)) % 65),
    }));
    return { dur, pts };
  }, [id]);

  const wanderKf = `
    @keyframes wander-${id} {
      0%   { left: ${anim.pts[0].x}%; top: ${anim.pts[0].y}%; }
      20%  { left: ${anim.pts[1].x}%; top: ${anim.pts[1].y}%; }
      40%  { left: ${anim.pts[2].x}%; top: ${anim.pts[2].y}%; }
      60%  { left: ${anim.pts[3].x}%; top: ${anim.pts[3].y}%; }
      80%  { left: ${anim.pts[4].x}%; top: ${anim.pts[4].y}%; }
      100% { left: ${anim.pts[0].x}%; top: ${anim.pts[0].y}%; }
    }
  `;

  const roleConfig = ROLE_CONFIGS[role] || ROLE_CONFIGS.Developer;

  return (
    <>
      <style>{wanderKf}</style>
      <div
        style={{
          position: "absolute",
          animation: `wander-${id} ${anim.dur}s linear infinite`,
          filter: "drop-shadow(1px 2px 0 rgba(0,0,0,0.25))",
        }}
      >
        <RoleSprite role={role} color={roleConfig.color} />
      </div>
    </>
  );
}

/** Roles shown as wandering characters on the home screen */
const WANDERING_ROLES: AgentRole[] = [
  "Frontend Developer",
  "Backend Developer",
  "QA Engineer",
  "Code Reviewer",
  "DevOps Engineer",
  "Technical Writer",
  "Debugger",
  "Architect",
  "Designer",
  "Data Engineer",
];

/* ── Floor decoration sprites ── */
const G = 3; // shared grid unit
const S: React.CSSProperties = {
  position: "absolute",
  imageRendering: "pixelated",
};

function WaterCooler({ x, y }: { x: number; y: number }) {
  return (
    <svg
      width={10 * G}
      height={18 * G}
      viewBox={`0 0 ${10 * G} ${18 * G}`}
      style={{ ...S, left: x, top: y }}
      shapeRendering="crispEdges"
    >
      {/* bottle */}
      <rect
        x={3 * G}
        y={0}
        width={4 * G}
        height={6 * G}
        fill="#88c0d0"
        opacity={0.7}
      />
      <rect x={3 * G} y={0} width={4 * G} height={1 * G} fill="#81a1c1" />
      {/* body */}
      <rect x={1 * G} y={6 * G} width={8 * G} height={8 * G} fill="#d8dee9" />
      <rect x={1 * G} y={6 * G} width={8 * G} height={1 * G} fill="#eceff4" />
      {/* tap */}
      <rect x={2 * G} y={9 * G} width={2 * G} height={1 * G} fill="#bf616a" />
      <rect x={6 * G} y={9 * G} width={2 * G} height={1 * G} fill="#5e81ac" />
      {/* drip tray */}
      <rect x={2 * G} y={12 * G} width={6 * G} height={1 * G} fill="#4c566a" />
      {/* legs */}
      <rect x={1 * G} y={14 * G} width={2 * G} height={4 * G} fill="#4c566a" />
      <rect x={7 * G} y={14 * G} width={2 * G} height={4 * G} fill="#4c566a" />
    </svg>
  );
}

function CoffeeMachine({ x, y }: { x: number; y: number }) {
  return (
    <svg
      width={12 * G}
      height={14 * G}
      viewBox={`0 0 ${12 * G} ${14 * G}`}
      style={{ ...S, left: x, top: y }}
      shapeRendering="crispEdges"
    >
      {/* body */}
      <rect x={0} y={2 * G} width={12 * G} height={10 * G} fill="#434c5e" />
      <rect x={0} y={2 * G} width={12 * G} height={1 * G} fill="#4c566a" />
      {/* top cap */}
      <rect x={2 * G} y={0} width={8 * G} height={2 * G} fill="#3b4252" />
      {/* screen */}
      <rect x={2 * G} y={4 * G} width={5 * G} height={3 * G} fill="#a3be8c">
        <animate
          attributeName="fill"
          values="#a3be8c;#88c0d0;#a3be8c"
          dur="4s"
          repeatCount="indefinite"
        />
      </rect>
      {/* dispenser */}
      <rect x={4 * G} y={8 * G} width={4 * G} height={3 * G} fill="#2e3440" />
      {/* cup */}
      <rect x={5 * G} y={10 * G} width={3 * G} height={2 * G} fill="#eceff4" />
      {/* base */}
      <rect x={0} y={12 * G} width={12 * G} height={2 * G} fill="#3b4252" />
      {/* steam */}
      <rect
        x={6 * G}
        y={8 * G}
        width={1 * G}
        height={1 * G}
        fill="#d8dee9"
        opacity={0.6}
      >
        <animate
          attributeName="opacity"
          values="0.2;0.7;0.2"
          dur="2s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  );
}

function VendingMachine({ x, y }: { x: number; y: number }) {
  return (
    <svg
      width={14 * G}
      height={22 * G}
      viewBox={`0 0 ${14 * G} ${22 * G}`}
      style={{ ...S, left: x, top: y }}
      shapeRendering="crispEdges"
    >
      {/* body */}
      <rect x={0} y={0} width={14 * G} height={22 * G} fill="#5e81ac" />
      <rect x={0} y={0} width={14 * G} height={1 * G} fill="#81a1c1" />
      {/* display window */}
      <rect x={2 * G} y={2 * G} width={10 * G} height={10 * G} fill="#2e3440" />
      {/* items rows */}
      {[0, 1, 2].map((row) => (
        <g key={row}>
          {[0, 1, 2].map((col) => (
            <rect
              key={col}
              x={(3 + col * 3) * G}
              y={(3 + row * 3) * G}
              width={2 * G}
              height={2 * G}
              fill={
                [
                  "#bf616a",
                  "#a3be8c",
                  "#ebcb8b",
                  "#b48ead",
                  "#88c0d0",
                  "#d08770",
                  "#bf616a",
                  "#a3be8c",
                  "#ebcb8b",
                ][row * 3 + col]
              }
            />
          ))}
        </g>
      ))}
      {/* slot */}
      <rect x={4 * G} y={14 * G} width={6 * G} height={3 * G} fill="#2e3440" />
      {/* coin slot */}
      <rect x={10 * G} y={14 * G} width={2 * G} height={1 * G} fill="#ebcb8b" />
      {/* pickup */}
      <rect x={3 * G} y={18 * G} width={8 * G} height={3 * G} fill="#3b4252" />
    </svg>
  );
}

function FloorRug({
  x,
  y,
  w,
  h,
  color,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}) {
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ ...S, left: x, top: y, opacity: 0.35 }}
      shapeRendering="crispEdges"
    >
      <rect x={0} y={0} width={w} height={h} fill={color} />
      <rect
        x={G}
        y={G}
        width={w - 2 * G}
        height={h - 2 * G}
        fill="none"
        stroke={mixColor(color, "#fff", 0.3)}
        strokeWidth={G}
      />
      {/* center diamond */}
      <rect
        x={w / 2 - 2 * G}
        y={h / 2 - 2 * G}
        width={4 * G}
        height={4 * G}
        fill={mixColor(color, "#fff", 0.2)}
        transform={`rotate(45 ${w / 2} ${h / 2})`}
      />
    </svg>
  );
}

function TrashCan({ x, y }: { x: number; y: number }) {
  return (
    <svg
      width={8 * G}
      height={10 * G}
      viewBox={`0 0 ${8 * G} ${10 * G}`}
      style={{ ...S, left: x, top: y }}
      shapeRendering="crispEdges"
    >
      {/* lid */}
      <rect x={0} y={0} width={8 * G} height={2 * G} fill="#6b7994" />
      <rect x={3 * G} y={0} width={2 * G} height={1 * G} fill="#8892a6" />
      {/* body */}
      <rect x={1 * G} y={2 * G} width={6 * G} height={8 * G} fill="#4c566a" />
      {/* stripes */}
      <rect x={2 * G} y={4 * G} width={4 * G} height={1 * G} fill="#434c5e" />
      <rect x={2 * G} y={7 * G} width={4 * G} height={1 * G} fill="#434c5e" />
    </svg>
  );
}

function Whiteboard({ x, y }: { x: number; y: number }) {
  return (
    <svg
      width={20 * G}
      height={18 * G}
      viewBox={`0 0 ${20 * G} ${18 * G}`}
      style={{ ...S, left: x, top: y }}
      shapeRendering="crispEdges"
    >
      {/* board */}
      <rect x={0} y={0} width={20 * G} height={14 * G} fill="#eceff4" />
      <rect
        x={0}
        y={0}
        width={20 * G}
        height={14 * G}
        fill="none"
        stroke="#b0b8c4"
        strokeWidth={2}
      />
      {/* content */}
      <line
        x1={3 * G}
        y1={3 * G}
        x2={14 * G}
        y2={3 * G}
        stroke="#88c0d0"
        strokeWidth={2}
      />
      <line
        x1={3 * G}
        y1={5 * G}
        x2={12 * G}
        y2={5 * G}
        stroke="#a3be8c"
        strokeWidth={2}
      />
      <line
        x1={3 * G}
        y1={7 * G}
        x2={16 * G}
        y2={7 * G}
        stroke="#bf616a"
        strokeWidth={2}
      />
      <line
        x1={3 * G}
        y1={9 * G}
        x2={10 * G}
        y2={9 * G}
        stroke="#ebcb8b"
        strokeWidth={2}
      />
      <rect
        x={15 * G}
        y={8 * G}
        width={3 * G}
        height={3 * G}
        fill="#5e81ac"
        opacity={0.5}
      />
      {/* stand */}
      <rect x={3 * G} y={14 * G} width={2 * G} height={4 * G} fill="#4c566a" />
      <rect x={15 * G} y={14 * G} width={2 * G} height={4 * G} fill="#4c566a" />
      {/* tray */}
      <rect x={2 * G} y={12 * G} width={6 * G} height={1 * G} fill="#d8dee9" />
      {/* marker */}
      <rect x={3 * G} y={11 * G} width={2 * G} height={1 * G} fill="#bf616a" />
    </svg>
  );
}

function Bookshelf({ x, y }: { x: number; y: number }) {
  return (
    <svg
      width={16 * G}
      height={20 * G}
      viewBox={`0 0 ${16 * G} ${20 * G}`}
      style={{ ...S, left: x, top: y }}
      shapeRendering="crispEdges"
    >
      {/* frame */}
      <rect x={0} y={0} width={16 * G} height={20 * G} fill="#a06830" />
      <rect x={0} y={0} width={16 * G} height={1 * G} fill="#bf8040" />
      {/* shelves */}
      {[0, 1, 2].map((row) => (
        <g key={row}>
          <rect
            x={G}
            y={(1 + row * 6) * G}
            width={14 * G}
            height={5 * G}
            fill="#8b6840"
          />
          {/* books */}
          <rect
            x={2 * G}
            y={(1 + row * 6) * G}
            width={2 * G}
            height={5 * G}
            fill={["#bf616a", "#5e81ac", "#a3be8c"][row]}
          />
          <rect
            x={4 * G}
            y={(2 + row * 6) * G}
            width={2 * G}
            height={4 * G}
            fill={["#ebcb8b", "#b48ead", "#88c0d0"][row]}
          />
          <rect
            x={6 * G}
            y={(1 + row * 6) * G}
            width={3 * G}
            height={5 * G}
            fill={["#d08770", "#bf616a", "#ebcb8b"][row]}
          />
          <rect
            x={10 * G}
            y={(2 + row * 6) * G}
            width={2 * G}
            height={4 * G}
            fill={["#b48ead", "#a3be8c", "#5e81ac"][row]}
          />
          <rect
            x={12 * G}
            y={(1 + row * 6) * G}
            width={2 * G}
            height={5 * G}
            fill={["#88c0d0", "#d08770", "#bf616a"][row]}
          />
          {/* shelf board */}
          <rect
            x={0}
            y={(6 + row * 6) * G}
            width={16 * G}
            height={1 * G}
            fill="#bf8040"
          />
        </g>
      ))}
    </svg>
  );
}

/* ── Pixel furniture for the diorama ── */
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
      <rect x={6 * G} y={0} width={12 * G} height={9 * G} fill="#434c5e" />
      <rect x={7 * G} y={1 * G} width={10 * G} height={7 * G} fill={screen} />
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
      <rect x={10 * G} y={9 * G} width={4 * G} height={2 * G} fill="#4c566a" />
      <rect x={8 * G} y={11 * G} width={8 * G} height={1 * G} fill="#4c566a" />
      <rect x={0} y={12 * G} width={24 * G} height={3 * G} fill="#bf8040" />
      <rect x={0} y={12 * G} width={24 * G} height={1 * G} fill="#d4924d" />
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
      <rect x={3 * G} y={0} width={4 * G} height={3 * G} fill="#4ade80" />
      <rect x={1 * G} y={2 * G} width={3 * G} height={3 * G} fill="#22c55e" />
      <rect x={6 * G} y={2 * G} width={3 * G} height={3 * G} fill="#22c55e" />
      <rect x={4 * G} y={3 * G} width={2 * G} height={4 * G} fill="#16a34a" />
      <rect x={4 * G} y={7 * G} width={2 * G} height={4 * G} fill="#65451f" />
      <rect x={2 * G} y={11 * G} width={6 * G} height={2 * G} fill="#b45309" />
      <rect x={3 * G} y={13 * G} width={4 * G} height={3 * G} fill="#92400e" />
    </svg>
  );
}

function PixelChair({ x, y, clr }: { x: number; y: number; clr: string }) {
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
      <rect x={0} y={0} width={8 * G} height={6 * G} fill={clr} />
      <rect
        x={0}
        y={6 * G}
        width={8 * G}
        height={2 * G}
        fill={mixColor(clr, "#000", 0.15)}
      />
      <rect x={0} y={8 * G} width={2 * G} height={4 * G} fill="#4c566a" />
      <rect x={6 * G} y={8 * G} width={2 * G} height={4 * G} fill="#4c566a" />
    </svg>
  );
}

const HomePage = () => {
  const navigate = useNavigate();

  /* Diorama data — same style as LoginPage */
  const dioDesks = [
    { x: 24, y: 20, screen: "#22c55e" },
    { x: 143, y: 14, screen: "#60a5fa" },
    { x: 268, y: 24, screen: "#22c55e" },
    { x: 383, y: 10, screen: "#facc15" },
    { x: 503, y: 20, screen: "#34d399" },
  ];
  const dioChairs = [
    { x: 48, y: 62, clr: "#6366f1" },
    { x: 167, y: 56, clr: "#6366f1" },
    { x: 292, y: 66, clr: "#6366f1" },
    { x: 407, y: 52, clr: "#6366f1" },
    { x: 527, y: 62, clr: "#6366f1" },
  ];
  const dioAgents: { role: AgentRole; x: number; y: number; flip: boolean }[] =
    [
      { role: "Frontend Developer", x: 56, y: 50, flip: false },
      { role: "Backend Developer", x: 175, y: 44, flip: true },
      { role: "QA Engineer", x: 300, y: 54, flip: false },
      { role: "Code Reviewer", x: 415, y: 40, flip: true },
      { role: "Architect", x: 535, y: 50, flip: false },
    ];

  return (
    <PixelLayout>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* ── Floor decorations ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Rugs */}
          <FloorRug x={60} y={80} w={100} h={70} color="#5e81ac" />
          <FloorRug x={700} y={300} w={120} h={80} color="#bf616a" />

          {/* Furniture scattered on the floor */}
          <WaterCooler x={40} y={180} />
          <CoffeeMachine x={120} y={350} />
          <VendingMachine x={750} y={100} />
          <Whiteboard x={680} y={220} />
          <Bookshelf x={50} y={320} />
          <TrashCan x={300} y={120} />
          <TrashCan x={600} y={380} />
          <PixelPlant x={200} y={100} />
          <PixelPlant x={500} y={80} />
          <PixelPlant x={720} y={380} />
          <PixelPlant x={150} y={250} />
        </div>

        {/* Wandering characters on the green floor */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {WANDERING_ROLES.map((role, i) => (
            <WanderingChar key={i} role={role} id={i} />
          ))}
        </div>

        {/* ── Title screen panel — same style as login page ── */}
        <div
          className="relative z-10 flex flex-col items-center px-10 py-8 text-center"
          style={{
            background: "#eceff4",
            border: "4px solid #4c566a",
            borderRadius: 6,
            boxShadow: "5px 5px 0 #2e3440",
          }}
        >
          {/* Badge — same as login page */}
          <div
            className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1 text-[11px] font-bold tracking-widest text-white whitespace-nowrap"
            style={{
              background: "#5e81ac",
              border: "3px solid #4c566a",
              borderRadius: 3,
              fontFamily: MONO,
              boxShadow: "2px 2px 0 #2e3440",
            }}
          >
            AGENT VIRTUAL OFFICE
          </div>

          {/* ── Office diorama ── */}
          <div
            className="relative overflow-hidden mt-4 mb-4"
            style={{
              width: 620,
              height: 160,
              background:
                "linear-gradient(180deg, #d8dee9 0%, #e5e9f0 50%, #c8b496 50%, #c0a882 100%)",
              border: "4px solid #4c566a",
              borderRadius: 4,
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              imageRendering: "pixelated",
            }}
          >
            <div
              className="absolute left-0 right-0"
              style={{ top: "50%", height: 4, background: "#8b6840" }}
            />

            <svg
              width={50}
              height={34}
              style={{ position: "absolute", left: 200, top: 8 }}
              shapeRendering="crispEdges"
            >
              <rect
                x={0}
                y={0}
                width={50}
                height={34}
                fill="#eceff4"
                stroke="#b0b8c4"
                strokeWidth={2}
              />
              <line
                x1={8}
                y1={10}
                x2={42}
                y2={10}
                stroke="#88c0d0"
                strokeWidth={2}
              />
              <line
                x1={8}
                y1={18}
                x2={36}
                y2={18}
                stroke="#a3be8c"
                strokeWidth={2}
              />
              <line
                x1={8}
                y1={26}
                x2={38}
                y2={26}
                stroke="#bf616a"
                strokeWidth={2}
              />
            </svg>

            <svg
              width={22}
              height={22}
              style={{ position: "absolute", left: 460, top: 6 }}
              shapeRendering="crispEdges"
            >
              <circle
                cx={11}
                cy={11}
                r={10}
                fill="#eceff4"
                stroke="#4c566a"
                strokeWidth={2}
              />
              <line
                x1={11}
                y1={11}
                x2={11}
                y2={4}
                stroke="#2e3440"
                strokeWidth={2}
              />
              <line
                x1={11}
                y1={11}
                x2={16}
                y2={9}
                stroke="#2e3440"
                strokeWidth={1.5}
              />
              <circle cx={11} cy={11} r={1.5} fill="#bf616a" />
            </svg>

            {dioDesks.map((d, i) => (
              <PixelDesk key={`d${i}`} {...d} />
            ))}
            {dioChairs.map((c, i) => (
              <PixelChair key={`c${i}`} {...c} />
            ))}
            {dioAgents.map((a, i) => (
              <div
                key={`a${i}`}
                style={{ position: "absolute", left: a.x, top: a.y }}
              >
                <RoleSprite
                  role={a.role}
                  color={ROLE_CONFIGS[a.role].color}
                  flip={a.flip}
                />
              </div>
            ))}

            <PixelPlant x={2} y={110} />
            <PixelPlant x={560} y={106} />
          </div>

          {/* Title text */}
          <h1
            className="text-[#2e3440] text-xl font-bold mb-1"
            style={{ fontFamily: MONO }}
          >
            Welcome!
          </h1>
          <p
            className="text-[#4c566a] text-sm mb-6"
            style={{ fontFamily: MONO }}
          >
            即時觀看你的 AI Agent 在辦公室工作
          </p>

          {/* Menu buttons */}
          <div className="flex flex-col gap-3 w-64">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate("/office")}
            >
              🖥️ 進入辦公室
            </Button>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => navigate("/dashboard")}
            >
              🔧 API Key 設定
            </Button>
          </div>

          {/* Mini character parade — role-specific sprites */}
          <div
            className="mt-6 flex justify-center gap-3 opacity-80"
            style={{ transform: "scale(0.4)", transformOrigin: "center" }}
          >
            {(
              [
                "Frontend Developer",
                "Backend Developer",
                "QA Engineer",
                "Code Reviewer",
                "Architect",
              ] as AgentRole[]
            ).map((role, i) => (
              <RoleSprite
                key={i}
                role={role}
                color={ROLE_CONFIGS[role].color}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <p
          className="relative z-10 mt-5 text-[#4a6a4a] text-xs tracking-wide"
          style={{
            fontFamily: MONO,
            textShadow: "1px 1px 0 rgba(255,255,255,0.3)",
          }}
        >
          Powered by Claude Code · v1.0
        </p>
      </div>
    </PixelLayout>
  );
};

export default HomePage;
