/**
 * Single office map layout for the WorkAdventure-style virtual office.
 * 24 columns × 16 rows, 32px per tile.
 *
 * Zones:
 *   - WORK (left side):    Desk clusters — agents go here when "working"
 *   - MEETING (top-right): Table + whiteboard — agents go here when "failure" (need help)
 *   - BREAK (bottom-right): Coffee, couch, snacks — agents go here when "complete"
 *   - IDLE (center/hallway): Wandering spots — agents go here when "idle"
 *
 * Agents move between zones when their status changes.
 */
import type {
  AgentSession,
  AgentStatus,
  SeatPosition,
  SeatZone,
  TileMapData,
} from "../types/agent";

// Tile IDs (matches tiles.ts)
const WF = 1; // wood floor
const WT = 5; // wall top
const WL = 6; // wall left
const WR = 7; // wall right
const WB = 8; // wall bottom
const CTL = 9; // corner TL
const CTR = 10; // corner TR
const CBL = 11; // corner BL
const CBR = 12; // corner BR
const MN = 16; // monitor on desk
const PL = 17; // plant
const BS = 18; // bookshelf
const WH = 19; // whiteboard
const CF = 20; // coffee machine
const RG = 21; // rug
const MT = 23; // meeting table
const CH = 24; // couch
const WC = 25; // water cooler
const LM = 26; // lamp
const SR = 27; // server rack
const CK = 28; // wall clock
const VM = 29; // vending/snack machine
const TB = 30; // trash can
const PR = 31; // printer
const CR = 32; // carpet (warm)
const WN = 33; // window
const FL = 34; // potted flower
const WA = 35; // wall art / picture frame

// 24×16 floor layer
const floorData: number[] = [
  // Row 0: top wall
  CTL,
  WT,
  WT,
  WT,
  WT,
  WT,
  WT,
  WT,
  WT,
  WT,
  WT,
  WT,
  WT,
  WT,
  WT,
  WT,
  WT,
  WT,
  WT,
  WT,
  WT,
  WT,
  WT,
  CTR,
  // Row 1
  WL,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WR,
  // Row 2
  WL,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WR,
  // Row 3
  WL,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WR,
  // Row 4
  WL,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WR,
  // Row 5
  WL,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WR,
  // Row 6
  WL,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WR,
  // Row 7
  WL,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WR,
  // Row 8
  WL,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WR,
  // Row 9
  WL,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WR,
  // Row 10
  WL,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WR,
  // Row 11
  WL,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WR,
  // Row 12
  WL,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WR,
  // Row 13
  WL,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WR,
  // Row 14
  WL,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WF,
  WR,
  // Row 15: bottom wall
  CBL,
  WB,
  WB,
  WB,
  WB,
  WB,
  WB,
  WB,
  WB,
  WB,
  WB,
  WB,
  WB,
  WB,
  WB,
  WB,
  WB,
  WB,
  WB,
  WB,
  WB,
  WB,
  WB,
  CBR,
];

// Furniture layer
const furnitureData: number[] = (() => {
  const d = new Array(24 * 16).fill(0);
  const set = (x: number, y: number, t: number) => {
    d[y * 24 + x] = t;
  };

  // === WORK ZONE (left side) — 6 desk clusters with monitors ===
  set(2, 2, MN);
  set(3, 2, MN);
  set(6, 2, MN);
  set(7, 2, MN);
  set(2, 5, MN);
  set(3, 5, MN);
  set(6, 5, MN);
  set(7, 5, MN);
  set(2, 8, MN);
  set(3, 8, MN);
  set(6, 8, MN);
  set(7, 8, MN);

  // Work zone extras
  set(4, 2, LM); // desk lamp between clusters
  set(4, 5, TB); // trash can
  set(8, 4, PR); // printer
  set(4, 8, LM); // another desk lamp
  set(8, 7, TB); // trash can

  // === MEETING ZONE (top-right) — table + whiteboards ===
  set(16, 2, MT);
  set(17, 2, MT);
  set(18, 2, MT);
  set(16, 3, MT);
  set(17, 3, MT);
  set(18, 3, MT);
  set(15, 1, WH);
  set(19, 1, WH);
  set(21, 1, CK); // clock on wall
  set(21, 4, FL); // flower near meeting room

  // === BREAK ZONE (bottom-right) — coffee, couch, snacks ===
  set(17, 10, CF); // coffee machine
  set(19, 10, WC); // water cooler
  set(16, 10, VM); // vending machine
  set(16, 12, CH); // couch left
  set(17, 12, CH); // couch right
  set(20, 12, CH); // second couch
  set(21, 12, CH);
  set(22, 10, PL); // plants
  set(22, 13, PL);
  set(15, 14, FL); // flower
  set(22, 14, FL); // flower

  // Break zone carpet
  set(17, 11, CR);
  set(18, 11, CR);
  set(19, 11, CR);
  set(17, 13, CR);
  set(18, 13, CR);
  set(19, 13, CR);

  // === HALLWAY / CORRIDOR decorations ===
  set(11, 14, RG);
  set(12, 14, RG);
  set(11, 13, RG);
  set(12, 13, RG);

  // === WALL DECORATIONS (top wall) ===
  set(1, 1, SR); // server rack
  set(4, 1, WN); // window
  set(6, 1, WN); // window
  set(8, 1, WA); // picture frame
  set(10, 1, BS); // bookshelf
  set(12, 1, BS); // bookshelf
  set(14, 1, CK); // clock
  set(22, 1, PL); // corner plant

  // === SIDE DECORATIONS ===
  set(1, 4, PL); // hallway plant
  set(1, 7, FL); // flower
  set(1, 10, PL); // hallway plant
  set(1, 13, FL); // flower
  set(10, 7, PL); // corridor plant
  set(10, 11, FL); // flower

  // Bottom wall decorations
  set(4, 14, RG); // rug near entrance
  set(5, 14, RG);
  set(8, 14, PL); // plants along bottom

  return d;
})();

// ─── Zone-typed seats ─────────────────────────────────────────────

/** WORK seats — at desks with monitors. Agents sit here when "working". */
const workSeats: SeatPosition[] = [
  // Cluster 1
  { x: 2, y: 3, direction: "up", deskX: 2, deskY: 2, zone: "work" },
  { x: 3, y: 3, direction: "up", deskX: 3, deskY: 2, zone: "work" },
  // Cluster 2
  { x: 6, y: 3, direction: "up", deskX: 6, deskY: 2, zone: "work" },
  { x: 7, y: 3, direction: "up", deskX: 7, deskY: 2, zone: "work" },
  // Cluster 3
  { x: 2, y: 6, direction: "up", deskX: 2, deskY: 5, zone: "work" },
  { x: 3, y: 6, direction: "up", deskX: 3, deskY: 5, zone: "work" },
  // Cluster 4
  { x: 6, y: 6, direction: "up", deskX: 6, deskY: 5, zone: "work" },
  { x: 7, y: 6, direction: "up", deskX: 7, deskY: 5, zone: "work" },
  // Cluster 5
  { x: 2, y: 9, direction: "up", deskX: 2, deskY: 8, zone: "work" },
  { x: 3, y: 9, direction: "up", deskX: 3, deskY: 8, zone: "work" },
  // Cluster 6
  { x: 6, y: 9, direction: "up", deskX: 6, deskY: 8, zone: "work" },
  { x: 7, y: 9, direction: "up", deskX: 7, deskY: 8, zone: "work" },
];

/** BREAK seats — near coffee machine and couch. Agents come here when "complete". */
const breakSeats: SeatPosition[] = [
  // Near coffee machine — chatting
  { x: 17, y: 11, direction: "down", deskX: 17, deskY: 10, zone: "break" },
  { x: 18, y: 11, direction: "down", deskX: 17, deskY: 10, zone: "break" },
  { x: 19, y: 11, direction: "down", deskX: 19, deskY: 10, zone: "break" },
  // On/near couch
  { x: 16, y: 13, direction: "up", deskX: 16, deskY: 12, zone: "break" },
  { x: 17, y: 13, direction: "up", deskX: 17, deskY: 12, zone: "break" },
  { x: 20, y: 13, direction: "up", deskX: 20, deskY: 12, zone: "break" },
  { x: 21, y: 13, direction: "up", deskX: 21, deskY: 12, zone: "break" },
  // Standing near water cooler
  { x: 20, y: 10, direction: "left", deskX: 19, deskY: 10, zone: "break" },
  // Extra standing spots
  { x: 18, y: 13, direction: "down", deskX: 18, deskY: 12, zone: "break" },
  { x: 22, y: 11, direction: "left", deskX: 22, deskY: 10, zone: "break" },
  { x: 15, y: 11, direction: "right", deskX: 16, deskY: 12, zone: "break" },
  { x: 15, y: 13, direction: "right", deskX: 16, deskY: 12, zone: "break" },
];

/** MEETING seats — around meeting table. Agents come here when "failure" (need help). */
const meetingSeats: SeatPosition[] = [
  { x: 15, y: 2, direction: "right", deskX: 16, deskY: 2, zone: "meeting" },
  { x: 15, y: 3, direction: "right", deskX: 16, deskY: 3, zone: "meeting" },
  { x: 20, y: 2, direction: "left", deskX: 18, deskY: 2, zone: "meeting" },
  { x: 20, y: 3, direction: "left", deskX: 18, deskY: 3, zone: "meeting" },
  { x: 16, y: 4, direction: "up", deskX: 16, deskY: 3, zone: "meeting" },
  { x: 17, y: 4, direction: "up", deskX: 17, deskY: 3, zone: "meeting" },
  { x: 18, y: 4, direction: "up", deskX: 18, deskY: 3, zone: "meeting" },
  { x: 16, y: 1, direction: "down", deskX: 16, deskY: 2, zone: "meeting" },
];

/** IDLE seats — wandering in the corridor / entrance. Agents hang here when "idle". */
const idleSeats: SeatPosition[] = [
  { x: 10, y: 4, direction: "down", deskX: 10, deskY: 4, zone: "idle" },
  { x: 11, y: 6, direction: "right", deskX: 11, deskY: 6, zone: "idle" },
  { x: 12, y: 8, direction: "down", deskX: 12, deskY: 8, zone: "idle" },
  { x: 10, y: 10, direction: "right", deskX: 10, deskY: 10, zone: "idle" },
  { x: 11, y: 12, direction: "down", deskX: 11, deskY: 12, zone: "idle" },
  { x: 12, y: 12, direction: "left", deskX: 12, deskY: 12, zone: "idle" },
  { x: 13, y: 7, direction: "down", deskX: 13, deskY: 7, zone: "idle" },
  { x: 14, y: 10, direction: "left", deskX: 14, deskY: 10, zone: "idle" },
  { x: 10, y: 13, direction: "right", deskX: 10, deskY: 13, zone: "idle" },
  { x: 13, y: 13, direction: "down", deskX: 13, deskY: 13, zone: "idle" },
  { x: 9, y: 6, direction: "down", deskX: 9, deskY: 6, zone: "idle" },
  { x: 9, y: 9, direction: "right", deskX: 9, deskY: 9, zone: "idle" },
];

/** All seats combined (used by TileMapData). */
const allSeats: SeatPosition[] = [
  ...workSeats,
  ...breakSeats,
  ...meetingSeats,
  ...idleSeats,
];

export const OFFICE_MAP: TileMapData = {
  width: 24,
  height: 16,
  tileSize: 32,
  layers: [
    { name: "floor", data: floorData, depth: 0 },
    { name: "furniture", data: furnitureData, depth: 1 },
  ],
  seats: allSeats,
};

// ─── Zone-to-seat lookup ──────────────────────────────────────────

const seatsByZone: Record<SeatZone, SeatPosition[]> = {
  work: workSeats,
  break: breakSeats,
  meeting: meetingSeats,
  idle: idleSeats,
};

/** Which zone an agent should be in based on their status. */
const STATUS_TO_ZONE: Record<AgentStatus, SeatZone> = {
  working: "work",
  complete: "break",
  failure: "meeting",
  idle: "idle",
};

/**
 * Assign agents to zone-appropriate seats based on their status.
 *
 * - working  → work zone (at desk)
 * - complete → break zone (snack bar / couch)
 * - failure  → meeting zone (asking for help)
 * - idle     → idle zone (corridor / wandering)
 *
 * Each agent gets a stable seat within their zone (based on a hash of
 * their ID so they don't randomly shuffle every render).
 * If a zone is full, agents overflow into the idle zone.
 */
/**
 * Compute walkable tile positions (floor tiles with no furniture, not walls).
 * Used for wandering agents.
 */
export const WALKABLE_TILES: Array<{ x: number; y: number }> = (() => {
  const tiles: Array<{ x: number; y: number }> = [];
  const width = 24;
  const height = 16;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const floor = floorData[idx];
      const furniture = furnitureData[idx];
      // Walkable = wood floor + no furniture
      if (floor === WF && furniture === 0) {
        tiles.push({ x, y });
      }
    }
  }
  return tiles;
})();

export function assignSeats(agents: AgentSession[]): Map<string, SeatPosition> {
  const result = new Map<string, SeatPosition>();

  // Track which seats are taken per zone
  const taken: Record<SeatZone, Set<number>> = {
    work: new Set(),
    break: new Set(),
    meeting: new Set(),
    idle: new Set(),
  };

  // Simple stable hash for consistent seat assignment
  const hashId = (id: string): number => {
    let h = 0;
    for (let i = 0; i < id.length; i++) {
      h = ((h << 5) - h + id.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  };

  for (const agent of agents) {
    const zone = STATUS_TO_ZONE[agent.status] || "idle";
    const zoneSeats = seatsByZone[zone];
    const hash = hashId(agent.id);

    // Try to find an available seat in the target zone
    let assigned = false;
    for (let attempt = 0; attempt < zoneSeats.length; attempt++) {
      const idx = (hash + attempt) % zoneSeats.length;
      if (!taken[zone].has(idx)) {
        taken[zone].add(idx);
        result.set(agent.id, zoneSeats[idx]);
        assigned = true;
        break;
      }
    }

    // Overflow: put in idle zone
    if (!assigned) {
      const fallbackSeats = seatsByZone.idle;
      for (let attempt = 0; attempt < fallbackSeats.length; attempt++) {
        const idx = (hash + attempt) % fallbackSeats.length;
        if (!taken.idle.has(idx)) {
          taken.idle.add(idx);
          result.set(agent.id, fallbackSeats[idx]);
          assigned = true;
          break;
        }
      }
    }

    // Last resort: just pick any free seat from all zones
    if (!assigned) {
      for (const z of ["work", "break", "meeting", "idle"] as SeatZone[]) {
        const seats = seatsByZone[z];
        for (let i = 0; i < seats.length; i++) {
          if (!taken[z].has(i)) {
            taken[z].add(i);
            result.set(agent.id, seats[i]);
            assigned = true;
            break;
          }
        }
        if (assigned) break;
      }
    }
  }

  return result;
}
