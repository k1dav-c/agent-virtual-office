/**
 * PNG spritesheet-based character sprites.
 *
 * Uses RPGCharacterSprites32x32.png — a CC0 spritesheet (384×672, 32px per frame).
 *
 * Layout: each ROW is one character (21 characters total).
 *   - Cols  0-3: front-facing (down) × 4 frames
 *   - Cols  4-7: back-facing  (up)   × 4 frames
 *   - Cols 8-11: side-facing  (right) × 4 frames
 *   - Left-facing = side-facing flipped horizontally via CSS
 *
 * Frame order per direction: right-step, stand, left-step, stand
 */
import { useEffect, useState } from "react";

import type { AgentRole } from "../../types/agent";

type Direction = "up" | "down" | "left" | "right";

const SPRITESHEET = "/assets/characters/RPGCharacterSprites32x32.png";
const FRAME_SIZE = 32;
const FRAMES_PER_DIR = 4; // 4 animation frames per direction

/** Direction → column group offset (which set of 4 cols to use). */
const DIR_COL_GROUP: Record<Direction, number> = {
  down: 0, // cols 0-3
  up: 1, // cols 4-7
  right: 2, // cols 8-11
  left: 2, // cols 8-11 (CSS-flipped)
};

/**
 * Map each agent role to a spritesheet row index (0-20).
 * Row 0 appears to be a skeleton/placeholder, so we start roles from row 1.
 */
const ROLE_CHAR_ROW: Record<AgentRole, number> = {
  "Frontend Developer": 1,
  "Backend Developer": 2,
  "QA Engineer": 3,
  "Code Reviewer": 4,
  "DevOps Engineer": 5,
  "Technical Writer": 6,
  Debugger: 7,
  Architect: 8,
  Designer: 9,
  "Data Engineer": 10,
  Developer: 11,
};

/** Get the background-position for a specific character row, direction, and frame. */
function getSpritePosition(
  charRow: number,
  direction: Direction,
  frame: number,
): { x: number; y: number } {
  const colGroup = DIR_COL_GROUP[direction];
  const x = (colGroup * FRAMES_PER_DIR + frame) * FRAME_SIZE;
  const y = charRow * FRAME_SIZE;

  return { x: -x, y: -y };
}

interface WokaSpriteProps {
  role: AgentRole;
  color: string;
  direction?: Direction;
  isWorking?: boolean;
  /** Animate walk cycle even when not working (e.g. wandering agents). */
  animate?: boolean;
}

/**
 * Character sprite rendered from PNG spritesheet — 32×32.
 */
export function WokaSprite({
  role,
  color,
  direction = "down",
  isWorking = false,
  animate = false,
}: WokaSpriteProps) {
  const charRow = ROLE_CHAR_ROW[role] ?? ROLE_CHAR_ROW.Developer;
  const shouldAnimate = isWorking || animate;
  const flipH = direction === "left";

  // Animate walking (cycle through 4 frames)
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (!shouldAnimate) {
      setFrame(0);
      return;
    }
    const walkFrames = [0, 1, 2, 3];
    let idx = 0;
    // Wandering = slower walk, working = faster
    const speed = isWorking ? 250 : 400;
    const interval = setInterval(() => {
      idx = (idx + 1) % walkFrames.length;
      setFrame(walkFrames[idx]);
    }, speed);
    return () => clearInterval(interval);
  }, [shouldAnimate, isWorking]);

  const pos = getSpritePosition(charRow, direction, frame);

  return (
    <div
      style={{ width: FRAME_SIZE, height: FRAME_SIZE, position: "relative" }}
    >
      {/* Working glow */}
      {isWorking && (
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            backgroundColor: color,
            opacity: 0.15,
          }}
        />
      )}
      <div
        style={{
          width: FRAME_SIZE,
          height: FRAME_SIZE,
          backgroundImage: `url(${SPRITESHEET})`,
          backgroundPosition: `${pos.x}px ${pos.y}px`,
          backgroundSize: `${384}px ${672}px`,
          imageRendering: "pixelated",
          transform: flipH ? "scaleX(-1)" : undefined,
        }}
      />
    </div>
  );
}

/**
 * Walking-animated character for the homepage parade.
 */
export function WalkingWokaSprite({
  role,
  color,
}: {
  role: AgentRole;
  color: string;
}) {
  const charRow = ROLE_CHAR_ROW[role] ?? ROLE_CHAR_ROW.Developer;
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const walkFrames = [0, 1, 2, 3];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % walkFrames.length;
      setFrame(walkFrames[idx]);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const pos = getSpritePosition(charRow, "down", frame);

  return (
    <div
      style={{
        width: FRAME_SIZE,
        height: FRAME_SIZE,
        position: "relative",
      }}
    >
      <div
        style={{
          width: FRAME_SIZE,
          height: FRAME_SIZE,
          backgroundImage: `url(${SPRITESHEET})`,
          backgroundPosition: `${pos.x}px ${pos.y}px`,
          backgroundSize: `${384}px ${672}px`,
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}

// Re-export role character mapping for external use
export const ROLE_CHARACTER: Record<AgentRole, string> = {
  "Frontend Developer": "sprite",
  "Backend Developer": "sprite",
  "QA Engineer": "sprite",
  "Code Reviewer": "sprite",
  "DevOps Engineer": "sprite",
  "Technical Writer": "sprite",
  Debugger: "sprite",
  Architect: "sprite",
  Designer: "sprite",
  "Data Engineer": "sprite",
  Developer: "sprite",
};

export const ALL_ROLES = Object.keys(ROLE_CHARACTER) as AgentRole[];

/**
 * Backward-compatible alias for HomePage usage.
 */
export function RoleSprite({
  role,
  color,
  flip: _flip,
}: {
  role: AgentRole;
  color: string;
  flip?: boolean;
}) {
  return <WokaSprite role={role} color={color} direction="down" />;
}
