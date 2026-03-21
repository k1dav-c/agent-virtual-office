import type { OfficeScene } from "../types/agent";

export const OFFICE_SCENES: OfficeScene[] = [
  {
    level: 1,
    name: "Garage",
    nameZh: "車庫創業",
    minAgents: 0,
    maxAgents: 3,
    description:
      "A humble garage startup — folding tables, whiteboards, and pizza boxes",
    bgColor: "#2d2d2d",
    floorColor: "#4a4a4a",
    wallColor: "#3d3d3d",
    accentColor: "#ff9f43",
    deskPositions: [
      { x: 18, y: 58, direction: "right" },
      { x: 50, y: 58, direction: "left" },
      { x: 82, y: 58, direction: "right" },
    ],
    decorations: ["whiteboard", "pizza-box", "lamp"],
  },
  {
    level: 2,
    name: "Co-working",
    nameZh: "共享空間",
    minAgents: 4,
    maxAgents: 6,
    description: "A cozy co-working café with long tables and coffee machines",
    bgColor: "#f5e6d3",
    floorColor: "#d4a574",
    wallColor: "#e8d5c4",
    accentColor: "#6c5ce7",
    deskPositions: [
      { x: 12, y: 45, direction: "right" },
      { x: 38, y: 45, direction: "left" },
      { x: 64, y: 45, direction: "right" },
      { x: 12, y: 75, direction: "right" },
      { x: 38, y: 75, direction: "left" },
      { x: 64, y: 75, direction: "right" },
    ],
    decorations: ["coffee-machine", "plant", "bookshelf"],
  },
  {
    level: 3,
    name: "Startup",
    nameZh: "新創辦公室",
    minAgents: 7,
    maxAgents: 10,
    description:
      "An open-plan startup office with meeting rooms and a snack bar",
    bgColor: "#f0f4f8",
    floorColor: "#c8d6e5",
    wallColor: "#dfe6ed",
    accentColor: "#00b894",
    deskPositions: [
      { x: 10, y: 38, direction: "right" },
      { x: 30, y: 38, direction: "left" },
      { x: 50, y: 38, direction: "right" },
      { x: 70, y: 38, direction: "left" },
      { x: 90, y: 38, direction: "right" },
      { x: 10, y: 68, direction: "right" },
      { x: 30, y: 68, direction: "left" },
      { x: 50, y: 68, direction: "right" },
      { x: 70, y: 68, direction: "left" },
      { x: 90, y: 68, direction: "right" },
    ],
    decorations: ["meeting-room", "snack-bar", "tv-screen", "plant"],
  },
  {
    level: 4,
    name: "Corporate",
    nameZh: "企業辦公室",
    minAgents: 11,
    maxAgents: 15,
    description: "A professional corporate office with dedicated departments",
    bgColor: "#eef2f7",
    floorColor: "#b8c5d4",
    wallColor: "#d5dde8",
    accentColor: "#0984e3",
    deskPositions: [
      { x: 10, y: 30, direction: "right" },
      { x: 30, y: 30, direction: "left" },
      { x: 50, y: 30, direction: "right" },
      { x: 70, y: 30, direction: "left" },
      { x: 90, y: 30, direction: "right" },
      { x: 10, y: 52, direction: "right" },
      { x: 30, y: 52, direction: "left" },
      { x: 50, y: 52, direction: "right" },
      { x: 70, y: 52, direction: "left" },
      { x: 90, y: 52, direction: "right" },
      { x: 10, y: 74, direction: "right" },
      { x: 30, y: 74, direction: "left" },
      { x: 50, y: 74, direction: "right" },
      { x: 70, y: 74, direction: "left" },
      { x: 90, y: 74, direction: "right" },
    ],
    decorations: ["reception", "meeting-room", "water-cooler", "printer"],
  },
  {
    level: 5,
    name: "Tech Campus",
    nameZh: "科技園區",
    minAgents: 16,
    maxAgents: 20,
    description: "A sprawling tech campus with gardens and multiple buildings",
    bgColor: "#e8f5e9",
    floorColor: "#a5d6a7",
    wallColor: "#c8e6c9",
    accentColor: "#e17055",
    deskPositions: Array.from({ length: 20 }, (_, i) => ({
      x: 10 + (i % 5) * 20,
      y: 28 + Math.floor(i / 5) * 18,
      direction: (i % 2 === 0 ? "right" : "left") as "left" | "right",
    })),
    decorations: ["garden", "gym", "cafeteria", "fountain"],
  },
  {
    level: 6,
    name: "HQ of the Future",
    nameZh: "未來總部",
    minAgents: 21,
    maxAgents: Infinity,
    description:
      "A sci-fi headquarters with holographic displays and sky bridges",
    bgColor: "#0a0a2e",
    floorColor: "#1a1a4e",
    wallColor: "#12123e",
    accentColor: "#00fff5",
    deskPositions: Array.from({ length: 30 }, (_, i) => ({
      x: 8 + (i % 6) * 17,
      y: 22 + Math.floor(i / 6) * 16,
      direction: (i % 2 === 0 ? "right" : "left") as "left" | "right",
    })),
    decorations: ["hologram", "sky-bridge", "neon-lights", "robot"],
  },
];

export function getSceneForAgentCount(count: number): OfficeScene {
  for (const scene of OFFICE_SCENES) {
    if (count >= scene.minAgents && count <= scene.maxAgents) {
      return scene;
    }
  }
  return OFFICE_SCENES[OFFICE_SCENES.length - 1];
}

/**
 * Count agents by unique (session_id, role) pairs.
 * This means: multiple sessions = multiple agents,
 * and having diverse roles can increase the effective count.
 */
export function getEffectiveAgentCount(
  agents: { session_id: string; role: string }[],
): number {
  const unique = new Set(agents.map((a) => `${a.session_id}::${a.role}`));
  return unique.size;
}
