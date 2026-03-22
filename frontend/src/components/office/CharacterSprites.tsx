/**
 * PNG spritesheet-based character sprites.
 *
 * Uses RPGCharacterSprites32x32.png — a CC0 spritesheet with 20 characters,
 * each having 4 directions (down, left, right, up) × 3 frames (stand, walk1, walk2).
 *
 * Spritesheet layout (384×672, 32px per frame):
 *   - 4 character columns (each 96px = 3 frames wide)
 *   - 5 character rows (each 128px = 4 directions tall)
 *   - Direction order per character: down, left, right, up
 *   - Frame order per direction: stand, walk1, walk2
 */
import { useEffect, useState } from "react";

import type { AgentRole } from "../../types/agent";

type Direction = "up" | "down" | "left" | "right";

const SPRITESHEET = "/assets/characters/RPGCharacterSprites32x32.png";
const FRAME_SIZE = 32;
const FRAMES_PER_DIR = 3; // stand, walk1, walk2
const DIRS_PER_CHAR = 4; // down, left, right, up
const CHARS_PER_ROW = 4; // 4 characters across the sheet

/** Direction → row offset within a character block */
const DIR_ROW: Record<Direction, number> = {
  down: 0,
  left: 1,
  right: 2,
  up: 3,
};

/**
 * Map each agent role to a unique character index (0-19) in the spritesheet.
 * Characters are numbered left-to-right, top-to-bottom.
 */
const ROLE_CHAR_INDEX: Record<AgentRole, number> = {
  "Frontend Developer": 0,
  "Backend Developer": 1,
  "QA Engineer": 2,
  "Code Reviewer": 3,
  "DevOps Engineer": 4,
  "Technical Writer": 5,
  Debugger: 6,
  Architect: 7,
  Designer: 8,
  "Data Engineer": 9,
  Developer: 10,
};

/** Get the background-position for a specific character, direction, and frame. */
function getSpritePosition(
  charIndex: number,
  direction: Direction,
  frame: number,
): { x: number; y: number } {
  const charCol = charIndex % CHARS_PER_ROW;
  const charRow = Math.floor(charIndex / CHARS_PER_ROW);
  const dirRow = DIR_ROW[direction];

  const x = (charCol * FRAMES_PER_DIR + frame) * FRAME_SIZE;
  const y = (charRow * DIRS_PER_CHAR + dirRow) * FRAME_SIZE;

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
  const charIndex = ROLE_CHAR_INDEX[role] ?? ROLE_CHAR_INDEX.Developer;
  const shouldAnimate = isWorking || animate;

  // Animate walking (cycle frames 0→1→0→2)
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (!shouldAnimate) {
      setFrame(0);
      return;
    }
    const walkFrames = [0, 1, 0, 2];
    let idx = 0;
    // Wandering = slower walk, working = faster
    const speed = isWorking ? 250 : 400;
    const interval = setInterval(() => {
      idx = (idx + 1) % walkFrames.length;
      setFrame(walkFrames[idx]);
    }, speed);
    return () => clearInterval(interval);
  }, [shouldAnimate, isWorking]);

  const pos = getSpritePosition(charIndex, direction, frame);

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
  const charIndex = ROLE_CHAR_INDEX[role] ?? ROLE_CHAR_INDEX.Developer;
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const walkFrames = [0, 1, 0, 2];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % walkFrames.length;
      setFrame(walkFrames[idx]);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const pos = getSpritePosition(charIndex, "down", frame);

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
