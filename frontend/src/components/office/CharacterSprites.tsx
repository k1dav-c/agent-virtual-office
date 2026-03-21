/**
 * Role-specific SVG pixel character sprites.
 *
 * Each agent role maps to a unique animal / creature rendered on a 16×24
 * grid at G = 3 px per cell (48 × 72 px).  The sprites share the same
 * bounding box so they can be swapped in anywhere a character is shown.
 */
import type { AgentRole } from "../../types/agent";

const G = 3; // grid unit

/** Simple colour blender */
function mix(base: string, target: string, t: number): string {
  const p = (c: string) => {
    const n = parseInt(c.slice(1), 16);
    return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
  };
  const [r1, g1, b1] = p(base);
  const [r2, g2, b2] = p(target);
  const h = (a: number, b: number) =>
    Math.round(a + (b - a) * t)
      .toString(16)
      .padStart(2, "0");
  return `#${h(r1, r2)}${h(g1, g2)}${h(b1, b2)}`;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

type R = [number, number, number, number, string]; // x,y,w,h,fill  (in grid units)

function rects(rs: R[]) {
  return rs.map(([x, y, w, h, f], i) => (
    <rect key={i} x={x * G} y={y * G} width={w * G} height={h * G} fill={f} />
  ));
}

/* ------------------------------------------------------------------ */
/*  Sprite definitions                                                */
/* ------------------------------------------------------------------ */

/** 🐱 Cat — Frontend Developer */
function Cat({ color }: { color: string }) {
  const fur = color;
  const dark = mix(color, "#000", 0.3);
  const belly = mix(color, "#fff", 0.35);
  return (
    <>
      {rects([
        // ears (triangular)
        [4, 0, 2, 2, dark],
        [10, 0, 2, 2, dark],
        [4, 1, 1, 1, "#ffb5c5"], // inner ear pink
        [11, 1, 1, 1, "#ffb5c5"],
        // head
        [4, 2, 8, 6, fur],
        [3, 3, 1, 4, fur],
        [12, 3, 1, 4, fur],
        // eyes
        [5, 4, 2, 2, "#2e3440"],
        [9, 4, 2, 2, "#2e3440"],
        [6, 4, 1, 1, "#88c0d0"], // pupil highlight
        [10, 4, 1, 1, "#88c0d0"],
        // nose + whisker dot
        [7, 6, 2, 1, "#d08770"],
        // neck
        [6, 8, 4, 1, fur],
        // body
        [3, 9, 10, 6, fur],
        [5, 9, 6, 1, belly],
        [5, 10, 6, 4, belly],
        // arms
        [1, 9, 2, 5, fur],
        [1, 14, 2, 1, fur],
        [13, 9, 2, 5, fur],
        [13, 14, 2, 1, fur],
        // belt
        [4, 15, 8, 1, "#3b4252"],
        // legs
        [4, 16, 3, 4, "#3b4252"],
        [9, 16, 3, 4, "#3b4252"],
        // shoes
        [3, 20, 4, 2, "#4c566a"],
        [9, 20, 4, 2, "#4c566a"],
        // tail (sticks out right)
        [13, 12, 2, 1, fur],
        [14, 11, 2, 1, fur],
        [15, 10, 1, 1, dark],
      ])}
    </>
  );
}

/** 🐻 Bear — Backend Developer */
function Bear({ color }: { color: string }) {
  const fur = "#8B6914";
  const dark = mix(fur, "#000", 0.3);
  const snout = "#d4a555";
  return (
    <>
      {rects([
        // round ears
        [3, 0, 3, 2, fur],
        [10, 0, 3, 2, fur],
        [4, 0, 1, 1, dark], // inner ear
        [11, 0, 1, 1, dark],
        // head
        [4, 2, 8, 6, fur],
        [3, 3, 1, 4, fur],
        [12, 3, 1, 4, fur],
        // snout
        [6, 5, 4, 3, snout],
        // eyes
        [5, 4, 2, 2, "#2e3440"],
        [9, 4, 2, 2, "#2e3440"],
        // nose
        [7, 5, 2, 1, "#2e3440"],
        // neck
        [6, 8, 4, 1, fur],
        // shirt
        [3, 9, 10, 6, color],
        [5, 9, 6, 1, mix(color, "#fff", 0.3)],
        // arms (fur-coloured paws)
        [1, 9, 2, 5, color],
        [1, 14, 2, 1, fur],
        [13, 9, 2, 5, color],
        [13, 14, 2, 1, fur],
        // belt
        [4, 15, 8, 1, "#3b4252"],
        // pants
        [4, 16, 3, 4, "#3b4252"],
        [9, 16, 3, 4, "#3b4252"],
        // shoes
        [3, 20, 4, 2, "#4c566a"],
        [9, 20, 4, 2, "#4c566a"],
      ])}
    </>
  );
}

/** 🦉 Owl — QA Engineer */
function Owl({ color }: { color: string }) {
  const body = "#7c6f64";
  const dark = mix(body, "#000", 0.3);
  const belly = "#d4c4b0";
  return (
    <>
      {rects([
        // ear tufts
        [3, 0, 2, 2, dark],
        [11, 0, 2, 2, dark],
        // head
        [4, 2, 8, 6, body],
        [3, 3, 1, 4, body],
        [12, 3, 1, 4, body],
        // big round eyes (owl feature)
        [4, 3, 3, 3, "#ffeedd"],
        [9, 3, 3, 3, "#ffeedd"],
        [5, 4, 2, 2, "#2e3440"],
        [10, 4, 2, 2, "#2e3440"],
        [5, 4, 1, 1, "#f0c040"], // golden iris
        [10, 4, 1, 1, "#f0c040"],
        // beak
        [7, 6, 2, 1, "#e8a030"],
        [7, 7, 2, 1, "#d09020"],
        // neck
        [6, 8, 4, 1, body],
        // shirt
        [3, 9, 10, 6, color],
        [5, 10, 6, 4, belly],
        // wings (arms)
        [1, 9, 2, 5, body],
        [1, 14, 2, 1, dark],
        [13, 9, 2, 5, body],
        [13, 14, 2, 1, dark],
        // belt
        [4, 15, 8, 1, "#3b4252"],
        // legs
        [4, 16, 3, 4, "#3b4252"],
        [9, 16, 3, 4, "#3b4252"],
        // talons
        [3, 20, 4, 2, "#e8a030"],
        [9, 20, 4, 2, "#e8a030"],
      ])}
    </>
  );
}

/** 🦊 Fox — Code Reviewer */
function Fox({ color }: { color: string }) {
  const fur = "#d65d0e";
  const dark = mix(fur, "#000", 0.3);
  const white = "#fdf4e3";
  return (
    <>
      {rects([
        // pointy ears
        [3, 0, 2, 3, fur],
        [11, 0, 2, 3, fur],
        [4, 1, 1, 1, white], // inner ear
        [11, 1, 1, 1, white],
        // head
        [4, 2, 8, 6, fur],
        [3, 3, 1, 4, fur],
        [12, 3, 1, 4, fur],
        // white muzzle
        [6, 5, 4, 3, white],
        // eyes (sly)
        [5, 4, 2, 1, "#2e3440"],
        [9, 4, 2, 1, "#2e3440"],
        [5, 3, 2, 1, "#2e3440"], // brow emphasis
        [9, 3, 2, 1, "#2e3440"],
        // nose
        [7, 5, 2, 1, "#2e3440"],
        // neck
        [6, 8, 4, 1, fur],
        // shirt
        [3, 9, 10, 6, color],
        [5, 9, 6, 1, mix(color, "#fff", 0.3)],
        // arms
        [1, 9, 2, 5, color],
        [1, 14, 2, 1, fur],
        [13, 9, 2, 5, color],
        [13, 14, 2, 1, fur],
        // belt
        [4, 15, 8, 1, "#3b4252"],
        // pants
        [4, 16, 3, 4, "#3b4252"],
        [9, 16, 3, 4, "#3b4252"],
        // shoes
        [3, 20, 4, 2, "#4c566a"],
        [9, 20, 4, 2, "#4c566a"],
        // tail
        [13, 13, 2, 1, fur],
        [14, 12, 2, 1, fur],
        [15, 11, 1, 1, white],
      ])}
    </>
  );
}

/** 🤖 Robot — DevOps Engineer */
function Robot({ color }: { color: string }) {
  const metal = "#a0b0c0";
  const dark = "#607080";
  return (
    <>
      {rects([
        // antenna
        [7, 0, 2, 1, dark],
        [7, 0, 1, 1, "#ef4444"], // red light
        // head (boxy)
        [4, 1, 8, 7, metal],
        [3, 2, 1, 5, dark],
        [12, 2, 1, 5, dark],
        // visor / eyes
        [5, 3, 6, 2, "#1a1a2e"],
        [5, 3, 2, 2, "#4ade80"], // left LED
        [9, 3, 2, 2, "#4ade80"], // right LED
        // mouth grill
        [6, 6, 4, 1, dark],
        // neck
        [6, 8, 4, 1, dark],
        // body (shirt = chassis)
        [3, 9, 10, 6, color],
        [5, 10, 6, 2, mix(color, "#fff", 0.2)],
        // chest panel
        [6, 11, 4, 2, dark],
        [7, 11, 1, 1, "#ef4444"], // indicator
        [8, 11, 1, 1, "#4ade80"],
        // arms (metal)
        [1, 9, 2, 5, metal],
        [1, 14, 2, 1, dark],
        [13, 9, 2, 5, metal],
        [13, 14, 2, 1, dark],
        // belt
        [4, 15, 8, 1, "#3b4252"],
        // legs
        [4, 16, 3, 4, "#3b4252"],
        [9, 16, 3, 4, "#3b4252"],
        // boots
        [3, 20, 4, 2, dark],
        [9, 20, 4, 2, dark],
      ])}
    </>
  );
}

/** 🐰 Rabbit — Technical Writer */
function Rabbit({ color }: { color: string }) {
  const fur = "#f5f0eb";
  const inner = "#ffb5c5";
  const dark = "#ccc0b5";
  return (
    <>
      {rects([
        // long ears
        [4, 0, 2, 4, fur],
        [5, 0, 1, 3, inner],
        [10, 0, 2, 4, fur],
        [11, 0, 1, 3, inner],
        // head
        [4, 3, 8, 5, fur],
        [3, 4, 1, 3, fur],
        [12, 4, 1, 3, fur],
        // eyes
        [5, 5, 2, 2, "#bf616a"],
        [9, 5, 2, 2, "#bf616a"],
        [6, 5, 1, 1, "#fff"],
        [10, 5, 1, 1, "#fff"],
        // nose + teeth
        [7, 6, 2, 1, inner],
        [7, 7, 1, 1, "#fff"],
        [8, 7, 1, 1, "#fff"],
        // neck
        [6, 8, 4, 1, fur],
        // shirt
        [3, 9, 10, 6, color],
        [5, 9, 6, 1, mix(color, "#fff", 0.3)],
        // arms
        [1, 9, 2, 5, color],
        [1, 14, 2, 1, fur],
        [13, 9, 2, 5, color],
        [13, 14, 2, 1, fur],
        // belt
        [4, 15, 8, 1, "#3b4252"],
        // pants
        [4, 16, 3, 4, "#3b4252"],
        [9, 16, 3, 4, "#3b4252"],
        // shoes
        [3, 20, 4, 2, dark],
        [9, 20, 4, 2, dark],
      ])}
    </>
  );
}

/** 🐛 Beetle — Debugger */
function Beetle({ color }: { color: string }) {
  const shell = "#b8320a";
  const dark = "#6b1d06";
  return (
    <>
      {rects([
        // antennae
        [4, 0, 1, 2, "#2e3440"],
        [11, 0, 1, 2, "#2e3440"],
        [3, 0, 1, 1, "#2e3440"],
        [12, 0, 1, 1, "#2e3440"],
        // head (dark)
        [4, 2, 8, 4, "#2e3440"],
        [3, 3, 1, 2, "#2e3440"],
        [12, 3, 1, 2, "#2e3440"],
        // eyes (big, compound)
        [5, 3, 2, 2, "#4ade80"],
        [9, 3, 2, 2, "#4ade80"],
        // mouth
        [7, 5, 2, 1, "#556"],
        // neck
        [6, 6, 4, 1, "#2e3440"],
        // shell / back (serves as shirt area)
        [3, 7, 10, 8, shell],
        // shell centre line
        [7, 7, 2, 8, dark],
        // shell dots
        [4, 9, 2, 2, "#2e3440"],
        [10, 9, 2, 2, "#2e3440"],
        [5, 12, 2, 1, "#2e3440"],
        [9, 12, 2, 1, "#2e3440"],
        // arms (6 legs feel — extra small nubs)
        [1, 8, 2, 4, "#2e3440"],
        [1, 12, 2, 1, "#2e3440"],
        [13, 8, 2, 4, "#2e3440"],
        [13, 12, 2, 1, "#2e3440"],
        // belt
        [4, 15, 8, 1, "#3b4252"],
        // legs
        [4, 16, 3, 4, "#3b4252"],
        [9, 16, 3, 4, "#3b4252"],
        // shoes
        [3, 20, 4, 2, "#2e3440"],
        [9, 20, 4, 2, "#2e3440"],
      ])}
    </>
  );
}

/** 🦅 Eagle — Architect */
function Eagle({ color }: { color: string }) {
  const feather = "#4a3728";
  const white = "#fdf4e3";
  const dark = mix(feather, "#000", 0.3);
  return (
    <>
      {rects([
        // crest
        [5, 0, 6, 1, white],
        [4, 1, 8, 1, white],
        // head
        [4, 2, 8, 6, white],
        [3, 3, 1, 4, white],
        [12, 3, 1, 4, white],
        // fierce eyes
        [5, 4, 2, 1, "#2e3440"],
        [9, 4, 2, 1, "#2e3440"],
        [5, 3, 2, 1, "#eab308"], // brow
        [9, 3, 2, 1, "#eab308"],
        // beak
        [7, 5, 2, 2, "#e8a030"],
        [7, 7, 3, 1, "#d09020"], // hooked beak
        // neck
        [6, 8, 4, 1, feather],
        // body
        [3, 9, 10, 6, color],
        [5, 9, 6, 1, mix(color, "#fff", 0.3)],
        // wings
        [1, 9, 2, 5, feather],
        [0, 10, 1, 3, dark],
        [1, 14, 2, 1, dark],
        [13, 9, 2, 5, feather],
        [15, 10, 1, 3, dark],
        [13, 14, 2, 1, dark],
        // belt
        [4, 15, 8, 1, "#3b4252"],
        // legs
        [4, 16, 3, 4, "#3b4252"],
        [9, 16, 3, 4, "#3b4252"],
        // talons
        [3, 20, 4, 2, "#e8a030"],
        [9, 20, 4, 2, "#e8a030"],
      ])}
    </>
  );
}

/** 🦄 Unicorn — Designer */
function Unicorn({ color }: { color: string }) {
  const body = "#f0e6ff";
  const mane = "#d946ef";
  const dark = mix(body, "#000", 0.15);
  return (
    <>
      {rects([
        // horn
        [7, 0, 2, 1, "#fbbf24"],
        [7, 1, 2, 1, "#fcd34d"],
        // mane
        [3, 2, 2, 3, mane],
        [12, 2, 1, 4, mane],
        // head
        [4, 2, 8, 6, body],
        [3, 4, 1, 3, body],
        [12, 3, 1, 4, body],
        // eyes (sparkly)
        [5, 4, 2, 2, "#7c3aed"],
        [9, 4, 2, 2, "#7c3aed"],
        [6, 4, 1, 1, "#fff"],
        [10, 4, 1, 1, "#fff"],
        // nose
        [7, 6, 2, 1, "#e5b8d0"],
        // neck
        [6, 8, 4, 1, body],
        // shirt
        [3, 9, 10, 6, color],
        [5, 9, 6, 1, mix(color, "#fff", 0.3)],
        // arms
        [1, 9, 2, 5, color],
        [1, 14, 2, 1, body],
        [13, 9, 2, 5, color],
        [13, 14, 2, 1, body],
        // belt
        [4, 15, 8, 1, "#3b4252"],
        // pants (rainbow tint)
        [4, 16, 3, 4, "#6d28d9"],
        [9, 16, 3, 4, "#6d28d9"],
        // shoes
        [3, 20, 4, 2, dark],
        [9, 20, 4, 2, dark],
        // tail
        [13, 13, 2, 1, mane],
        [14, 12, 2, 1, "#a855f7"],
        [15, 11, 1, 1, "#ec4899"],
      ])}
    </>
  );
}

/** 🐙 Octopus — Data Engineer */
function Octopus({ color }: { color: string }) {
  const body = "#14b8a6";
  const dark = mix(body, "#000", 0.3);
  const spots = mix(body, "#fff", 0.3);
  return (
    <>
      {rects([
        // rounded dome head
        [5, 0, 6, 2, body],
        [4, 1, 8, 1, body],
        [4, 2, 8, 6, body],
        [3, 3, 1, 4, body],
        [12, 3, 1, 4, body],
        // spots on dome
        [5, 1, 2, 1, spots],
        [9, 2, 2, 1, spots],
        // big eyes
        [5, 4, 2, 2, "#fff"],
        [9, 4, 2, 2, "#fff"],
        [5, 4, 1, 1, "#2e3440"],
        [9, 4, 1, 1, "#2e3440"],
        // mouth (happy)
        [7, 6, 2, 1, "#0d9488"],
        // neck
        [6, 8, 4, 1, body],
        // shirt
        [3, 9, 10, 6, color],
        [5, 9, 6, 1, mix(color, "#fff", 0.3)],
        // tentacle arms (wavy)
        [1, 9, 2, 4, body],
        [0, 13, 2, 2, body],
        [1, 14, 1, 1, spots],
        [13, 9, 2, 4, body],
        [14, 13, 2, 2, body],
        [14, 14, 1, 1, spots],
        // belt
        [4, 15, 8, 1, "#3b4252"],
        // "legs" (tentacles in pants)
        [4, 16, 3, 4, "#3b4252"],
        [9, 16, 3, 4, "#3b4252"],
        // shoes (suckers peek out)
        [3, 20, 4, 2, dark],
        [9, 20, 4, 2, dark],
      ])}
    </>
  );
}

/** 🐶 Dog — Developer (generic) */
function Dog({ color }: { color: string }) {
  const fur = "#c4956a";
  const dark = mix(fur, "#000", 0.3);
  const snout = "#f0d9b5";
  return (
    <>
      {rects([
        // floppy ears
        [3, 1, 2, 4, dark],
        [11, 1, 2, 4, dark],
        // head
        [4, 2, 8, 6, fur],
        [3, 3, 1, 2, fur],
        [12, 3, 1, 2, fur],
        // snout
        [6, 5, 4, 3, snout],
        // eyes (friendly)
        [5, 4, 2, 2, "#2e3440"],
        [9, 4, 2, 2, "#2e3440"],
        [6, 4, 1, 1, "#fff"],
        [10, 4, 1, 1, "#fff"],
        // nose
        [7, 5, 2, 1, "#2e3440"],
        // tongue
        [8, 7, 1, 1, "#ef9a9a"],
        // neck
        [6, 8, 4, 1, fur],
        // shirt
        [3, 9, 10, 6, color],
        [5, 9, 6, 1, mix(color, "#fff", 0.3)],
        // arms
        [1, 9, 2, 5, color],
        [1, 14, 2, 1, fur],
        [13, 9, 2, 5, color],
        [13, 14, 2, 1, fur],
        // belt
        [4, 15, 8, 1, "#3b4252"],
        // pants
        [4, 16, 3, 4, "#3b4252"],
        [9, 16, 3, 4, "#3b4252"],
        // shoes
        [3, 20, 4, 2, "#4c566a"],
        [9, 20, 4, 2, "#4c566a"],
        // wagging tail
        [13, 12, 2, 1, fur],
        [14, 11, 2, 1, fur],
        [15, 10, 1, 1, dark],
      ])}
    </>
  );
}

/** 🐧 Penguin — Architect (alt: used for "Designer" if you'd prefer swap) */
/* Keeping the ROLE→Sprite mapping configurable below */

/* ------------------------------------------------------------------ */
/*  Role → Sprite mapping                                             */
/* ------------------------------------------------------------------ */

export type CharacterType =
  | "cat"
  | "bear"
  | "owl"
  | "fox"
  | "robot"
  | "rabbit"
  | "beetle"
  | "eagle"
  | "unicorn"
  | "octopus"
  | "dog";

export const ROLE_CHARACTER: Record<AgentRole, CharacterType> = {
  "Frontend Developer": "cat",
  "Backend Developer": "bear",
  "QA Engineer": "owl",
  "Code Reviewer": "fox",
  "DevOps Engineer": "robot",
  "Technical Writer": "rabbit",
  Debugger: "beetle",
  Architect: "eagle",
  Designer: "unicorn",
  "Data Engineer": "octopus",
  Developer: "dog",
};

const SPRITES: Record<CharacterType, React.FC<{ color: string }>> = {
  cat: Cat,
  bear: Bear,
  owl: Owl,
  fox: Fox,
  robot: Robot,
  rabbit: Rabbit,
  beetle: Beetle,
  eagle: Eagle,
  unicorn: Unicorn,
  octopus: Octopus,
  dog: Dog,
};

/* ------------------------------------------------------------------ */
/*  Public components                                                 */
/* ------------------------------------------------------------------ */

/**
 * Static pixel character for a given role.
 * Renders at 48×72 px (16×24 grid × G=3).
 */
export function RoleSprite({
  role,
  color,
  flip,
}: {
  role: AgentRole;
  color: string;
  flip?: boolean;
}) {
  const type = ROLE_CHARACTER[role] || "dog";
  const Sprite = SPRITES[type];
  return (
    <svg
      width={16 * G}
      height={24 * G}
      viewBox={`0 0 ${16 * G} ${24 * G}`}
      shapeRendering="crispEdges"
      style={{
        imageRendering: "pixelated",
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    >
      <Sprite color={color} />
    </svg>
  );
}

/**
 * Walking-animated sprite for wandering on the floor.
 * Used on HomePage. Provides the same 2-frame leg toggle + body bob.
 */
export function WalkingRoleSprite({
  role,
  color,
}: {
  role: AgentRole;
  color: string;
}) {
  const type = ROLE_CHARACTER[role] || "dog";
  const Sprite = SPRITES[type];
  return (
    <svg
      width={16 * G}
      height={24 * G}
      viewBox={`0 0 ${16 * G} ${24 * G}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      <Sprite color={color} />
      {/* Body bob */}
      <animateTransform
        attributeName="transform"
        type="translate"
        values={`0,0; 0,${-G}; 0,0; 0,${-G}`}
        dur="0.4s"
        repeatCount="indefinite"
      />
    </svg>
  );
}

/** All character types for iteration (e.g. HomePage parade) */
export const ALL_CHARACTER_TYPES = Object.keys(SPRITES) as CharacterType[];
export const ALL_ROLES = Object.keys(ROLE_CHARACTER) as AgentRole[];
