import ApiKeyManager from "@components/ApiKeyManager";
import CoderHostSetting from "@components/CoderHostSetting";
import McpConfigSnippet from "@components/McpConfigSnippet";
import PixelLayout from "@components/PixelLayout";
import Button from "@components/ui/Button";
import { useNavigate } from "react-router-dom";

const MONO = "'Courier New', monospace";

/** Game-style panel — translucent dark with pixel border, over green floor */
const PANEL = {
  background: "rgba(46, 52, 64, 0.88)",
  border: "3px solid #4c566a",
  borderRadius: 2,
  boxShadow: "4px 4px 0 rgba(0,0,0,0.35)",
} as const;

export default function DashboardPage() {
  const navigate = useNavigate();
  return (
    <PixelLayout>
      {/* Green floor shows through from PixelLayout */}
      <div
        className="absolute inset-0 flex flex-col"
        style={{ fontFamily: MONO }}
      >
        {/* Slight darkening so panels are readable over the green */}
        <div className="absolute inset-0 bg-black/15" />

        {/* Content */}
        <div className="relative z-10 flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto px-6 py-6 space-y-5">
            {/* Page title */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">⚙️</span>
              <div>
                <h2
                  className="text-lg font-bold text-[#eceff4] tracking-wider"
                  style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.5)" }}
                >
                  CONFIG
                </h2>
                <p
                  className="text-[#d8dee9] text-[10px] tracking-wide"
                  style={{ textShadow: "1px 1px 0 rgba(0,0,0,0.4)" }}
                >
                  管理 API Key、Coder Host 與 Claude Code MCP 設定
                </p>
              </div>
            </div>

            {/* Step 1 — Coder Host */}
            <div style={PANEL} className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="px-2 py-0.5 text-[9px] font-bold tracking-widest text-[#a3be8c]"
                  style={{
                    background: "#3b4252",
                    border: "2px solid #4c566a",
                    borderRadius: 1,
                  }}
                >
                  STEP 1
                </span>
                <h3 className="text-sm font-bold text-[#d8dee9] tracking-wide">
                  🌐 設定 Coder Host
                </h3>
              </div>
              <CoderHostSetting />
            </div>

            {/* Step 2 — API Keys */}
            <div style={PANEL} className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="px-2 py-0.5 text-[9px] font-bold tracking-widest text-[#a3be8c]"
                  style={{
                    background: "#3b4252",
                    border: "2px solid #4c566a",
                    borderRadius: 1,
                  }}
                >
                  STEP 2
                </span>
                <h3 className="text-sm font-bold text-[#d8dee9] tracking-wide">
                  📋 取得 API Key
                </h3>
              </div>
              <ApiKeyManager />
            </div>

            {/* Step 3 — MCP Config */}
            <div style={PANEL} className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="px-2 py-0.5 text-[9px] font-bold tracking-widest text-[#a3be8c]"
                  style={{
                    background: "#3b4252",
                    border: "2px solid #4c566a",
                    borderRadius: 1,
                  }}
                >
                  STEP 3
                </span>
                <h3 className="text-sm font-bold text-[#d8dee9] tracking-wide">
                  🔧 設定 Claude Code
                </h3>
              </div>
              <McpConfigSnippet />
            </div>

            {/* Go to office */}
            <div className="flex justify-center pt-2 pb-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/office")}
              >
                🏢 前往辦公室
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PixelLayout>
  );
}
