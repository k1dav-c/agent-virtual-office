/**
 * Hook that manages tile-by-tile walking for non-working agents.
 *
 * Instead of sliding (CSS transition), agents walk one tile at a time:
 *   1. Pick a random destination nearby
 *   2. Compute a simple path (manhattan walk)
 *   3. Step through tiles one at a time (~200ms per step)
 *   4. Pause at destination, then pick a new one
 */
import { useCallback, useEffect, useRef, useState } from "react";

import { WALKABLE_TILES } from "../config/office-map";
import type { AgentSession, SeatPosition } from "../types/agent";

const STEP_MS = 200; // ms per tile step
const PAUSE_MIN = 2000; // min pause at destination
const PAUSE_MAX = 5000; // max pause at destination

type Dir = "up" | "down" | "left" | "right";

interface WalkerState {
  x: number;
  y: number;
  direction: Dir;
  isWalking: boolean;
  path: Array<{ x: number; y: number }>;
  pathIndex: number;
}

// Pre-compute walkable set for O(1) lookup
const walkableSet = new Set(WALKABLE_TILES.map((t) => `${t.x},${t.y}`));
function isWalkable(x: number, y: number): boolean {
  return walkableSet.has(`${x},${y}`);
}

/** Pick a random walkable tile within ~3-5 tiles. */
function pickNearbyTarget(cx: number, cy: number): { x: number; y: number } {
  const candidates = WALKABLE_TILES.filter((t) => {
    const d = Math.abs(t.x - cx) + Math.abs(t.y - cy);
    return d >= 2 && d <= 5;
  });
  if (candidates.length === 0) {
    return WALKABLE_TILES[Math.floor(Math.random() * WALKABLE_TILES.length)];
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/** Simple manhattan path: walk X first, then Y. Skip blocked tiles. */
function computePath(
  from: { x: number; y: number },
  to: { x: number; y: number },
): Array<{ x: number; y: number }> {
  const path: Array<{ x: number; y: number }> = [];
  let { x, y } = from;

  // Walk horizontally
  const dx = to.x > x ? 1 : -1;
  while (x !== to.x) {
    x += dx;
    if (isWalkable(x, y)) {
      path.push({ x, y });
    } else {
      break; // blocked, stop early
    }
  }

  // Walk vertically
  const dy = to.y > y ? 1 : -1;
  while (y !== to.y) {
    y += dy;
    if (isWalkable(x, y)) {
      path.push({ x, y });
    } else {
      break;
    }
  }

  return path;
}

/** Direction from one tile to the next. */
function stepDirection(
  from: { x: number; y: number },
  to: { x: number; y: number },
): Dir {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? "right" : "left";
  return dy > 0 ? "down" : "up";
}

export function useWandering(
  agents: AgentSession[],
  assignedSeats: Map<string, SeatPosition>,
): Map<string, SeatPosition & { isWalking: boolean }> {
  const walkersRef = useRef<Map<string, WalkerState>>(new Map());
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const [tick, setTick] = useState(0);

  const rerender = useCallback(() => setTick((t) => t + 1), []);

  // Initialize a walker at a random position
  const initWalker = useCallback((id: string): WalkerState => {
    const tile =
      WALKABLE_TILES[Math.floor(Math.random() * WALKABLE_TILES.length)];
    return {
      x: tile.x,
      y: tile.y,
      direction: "down",
      isWalking: false,
      path: [],
      pathIndex: 0,
    };
  }, []);

  // Start walking a specific agent along a path
  const startWalking = useCallback(
    (id: string) => {
      const walker = walkersRef.current.get(id);
      if (!walker) return;

      const target = pickNearbyTarget(walker.x, walker.y);
      const path = computePath({ x: walker.x, y: walker.y }, target);
      if (path.length === 0) {
        // No valid path, try again after pause
        const timer = setTimeout(() => startWalking(id), PAUSE_MIN);
        timersRef.current.set(id, timer);
        return;
      }

      walker.path = path;
      walker.pathIndex = 0;
      walker.isWalking = true;

      // Step through path tiles one at a time
      const stepThrough = () => {
        const w = walkersRef.current.get(id);
        if (!w || w.pathIndex >= w.path.length) {
          // Arrived at destination
          if (w) {
            w.isWalking = false;
            w.path = [];
            w.pathIndex = 0;
          }
          rerender();
          // Pause, then walk again
          const pause = PAUSE_MIN + Math.random() * (PAUSE_MAX - PAUSE_MIN);
          const timer = setTimeout(() => startWalking(id), pause);
          timersRef.current.set(id, timer);
          return;
        }

        const nextTile = w.path[w.pathIndex];
        w.direction = stepDirection({ x: w.x, y: w.y }, nextTile);
        w.x = nextTile.x;
        w.y = nextTile.y;
        w.pathIndex++;
        rerender();

        const timer = setTimeout(stepThrough, STEP_MS);
        timersRef.current.set(id, timer);
      };

      const timer = setTimeout(stepThrough, STEP_MS);
      timersRef.current.set(id, timer);
    },
    [rerender],
  );

  // Manage walker lifecycle
  useEffect(() => {
    const currentIds = new Set<string>();

    for (const agent of agents) {
      if (agent.status === "working") {
        // Working agents: clean up any walking state
        if (walkersRef.current.has(agent.id)) {
          walkersRef.current.delete(agent.id);
          const timer = timersRef.current.get(agent.id);
          if (timer) clearTimeout(timer);
          timersRef.current.delete(agent.id);
        }
        continue;
      }

      currentIds.add(agent.id);

      // Initialize new wanderers
      if (!walkersRef.current.has(agent.id)) {
        walkersRef.current.set(agent.id, initWalker(agent.id));
        // Start walking after a random initial delay
        const delay = Math.random() * 2000;
        const timer = setTimeout(() => startWalking(agent.id), delay);
        timersRef.current.set(agent.id, timer);
      }
    }

    // Clean up departed agents
    for (const id of walkersRef.current.keys()) {
      if (!currentIds.has(id)) {
        walkersRef.current.delete(id);
        const timer = timersRef.current.get(id);
        if (timer) clearTimeout(timer);
        timersRef.current.delete(id);
      }
    }
  }, [agents, initWalker, startWalking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      for (const timer of timersRef.current.values()) {
        clearTimeout(timer);
      }
    };
  }, []);

  // Build position map
  const positions = new Map<string, SeatPosition & { isWalking: boolean }>();
  for (const agent of agents) {
    if (agent.status === "working") {
      const seat = assignedSeats.get(agent.id);
      if (seat) positions.set(agent.id, { ...seat, isWalking: false });
    } else {
      const walker = walkersRef.current.get(agent.id);
      if (walker) {
        positions.set(agent.id, {
          x: walker.x,
          y: walker.y,
          direction: walker.direction,
          deskX: walker.x,
          deskY: walker.y,
          zone: "idle",
          isWalking: walker.isWalking,
        });
      }
    }
  }

  return positions;
}
