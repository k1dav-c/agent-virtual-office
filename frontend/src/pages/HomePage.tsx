import { useNavigate } from "react-router-dom";

import PixelLayout from "@components/PixelLayout";
import { RoleSprite } from "@components/office/CharacterSprites";
import Button from "@components/ui/Button";
import { ROLE_CONFIGS } from "../config/agent-roles";
import type { AgentRole } from "../types/agent";

const MONO = "'Courier New', monospace";

const SHOWCASE_ROLES: AgentRole[] = [
  "Frontend Developer",
  "Backend Developer",
  "QA Engineer",
  "Code Reviewer",
  "Architect",
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <PixelLayout>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative flex flex-col items-center px-10 py-8 pt-10 text-center overflow-visible"
          style={{
            background: "rgba(30, 28, 36, 0.95)",
            border: "3px solid #4c566a",
            borderRadius: 6,
            boxShadow: "5px 5px 0 rgba(0,0,0,0.4)",
          }}
        >
          {/* Badge */}
          <div
            className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 px-5 py-1 text-[11px] font-bold tracking-widest text-white whitespace-nowrap"
            style={{
              background: "#5e81ac",
              border: "3px solid #4c566a",
              borderRadius: 3,
              fontFamily: MONO,
              boxShadow: "2px 2px 0 rgba(0,0,0,0.3)",
            }}
          >
            AGENT VIRTUAL OFFICE
          </div>

          {/* Character parade */}
          <div className="mt-4 mb-4 flex justify-center gap-4">
            {SHOWCASE_ROLES.map((role) => (
              <div key={role} className="flex flex-col items-center gap-1">
                <RoleSprite role={role} color={ROLE_CONFIGS[role].color} />
                <span
                  className="text-[8px] text-white/40"
                  style={{ fontFamily: MONO }}
                >
                  {ROLE_CONFIGS[role].emoji}
                </span>
              </div>
            ))}
          </div>

          <h1
            className="text-white text-xl font-bold mb-1"
            style={{ fontFamily: MONO }}
          >
            Welcome!
          </h1>
          <p
            className="text-white/50 text-sm mb-6"
            style={{ fontFamily: MONO }}
          >
            即時觀看你的 AI Agent 在辦公室工作
          </p>

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
        </div>
      </div>
    </PixelLayout>
  );
}
