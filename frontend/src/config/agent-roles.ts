import type { AgentRole } from "../types/agent";

export interface RoleConfig {
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  accessory: string;
}

export const ROLE_CONFIGS: Record<AgentRole, RoleConfig> = {
  "Frontend Developer": {
    label: "Frontend",
    emoji: "🎨",
    color: "#a855f7",
    bgColor: "#f3e8ff",
    accessory: "headphones",
  },
  "Backend Developer": {
    label: "Backend",
    emoji: "⚙️",
    color: "#3b82f6",
    bgColor: "#dbeafe",
    accessory: "glasses",
  },
  "QA Engineer": {
    label: "QA",
    emoji: "🔍",
    color: "#22c55e",
    bgColor: "#dcfce7",
    accessory: "magnifier",
  },
  "Code Reviewer": {
    label: "Reviewer",
    emoji: "📝",
    color: "#f97316",
    bgColor: "#ffedd5",
    accessory: "red-pen",
  },
  "DevOps Engineer": {
    label: "DevOps",
    emoji: "🚀",
    color: "#eab308",
    bgColor: "#fef9c3",
    accessory: "hard-hat",
  },
  "Technical Writer": {
    label: "Writer",
    emoji: "📖",
    color: "#ec4899",
    bgColor: "#fce7f3",
    accessory: "book",
  },
  Debugger: {
    label: "Debugger",
    emoji: "🐛",
    color: "#ef4444",
    bgColor: "#fee2e2",
    accessory: "magnifier",
  },
  Architect: {
    label: "Architect",
    emoji: "🏗️",
    color: "#06b6d4",
    bgColor: "#cffafe",
    accessory: "blueprint",
  },
  Designer: {
    label: "Designer",
    emoji: "✨",
    color: "#d946ef",
    bgColor: "#fae8ff",
    accessory: "palette",
  },
  "Data Engineer": {
    label: "Data",
    emoji: "📊",
    color: "#14b8a6",
    bgColor: "#ccfbf1",
    accessory: "chart",
  },
  Developer: {
    label: "Dev",
    emoji: "💻",
    color: "#6b7280",
    bgColor: "#f3f4f6",
    accessory: "laptop",
  },
};

export const STATUS_COLORS: Record<
  string,
  { bg: string; pulse: string; label: string }
> = {
  working: { bg: "#22c55e", pulse: "#4ade80", label: "Working" },
  idle: { bg: "#3b82f6", pulse: "#60a5fa", label: "Idle" },
  complete: { bg: "#9ca3af", pulse: "#d1d5db", label: "Complete" },
  failure: { bg: "#ef4444", pulse: "#f87171", label: "Needs Help" },
};
