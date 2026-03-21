export type AgentStatus = "working" | "complete" | "idle" | "failure";

export type AgentRole =
  | "Frontend Developer"
  | "Backend Developer"
  | "QA Engineer"
  | "Code Reviewer"
  | "DevOps Engineer"
  | "Technical Writer"
  | "Debugger"
  | "Architect"
  | "Designer"
  | "Data Engineer"
  | "Developer";

export interface AgentSession {
  id: string;
  session_id: string;
  role: AgentRole;
  status: AgentStatus;
  summary: string | null;
  link: string | null;
  workspace: string | null;
  started_at: string;
  last_heartbeat_at: string;
}

export interface ApiKeyItem {
  id: string;
  key_prefix: string;
  name: string;
  created_at: string;
  last_used_at: string | null;
  is_active: boolean;
}

export interface DeskPosition {
  x: number;
  y: number;
  direction: "left" | "right";
}

export interface OfficeScene {
  level: number;
  name: string;
  nameZh: string;
  minAgents: number;
  maxAgents: number;
  description: string;
  bgColor: string;
  floorColor: string;
  wallColor: string;
  accentColor: string;
  deskPositions: DeskPosition[];
  decorations: string[];
}
