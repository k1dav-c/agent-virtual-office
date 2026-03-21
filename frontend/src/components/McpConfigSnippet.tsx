import Button from "@components/ui/Button";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const MONO = "'Courier New', monospace";

export default function McpConfigSnippet() {
  const [copied, setCopied] = useState(false);

  const config = JSON.stringify(
    {
      mcpServers: {
        "virtual-office": {
          type: "streamable-http",
          url: `${API_URL}/mcp/mcp?api_key=<YOUR_API_KEY>`,
        },
      },
    },
    null,
    2,
  );

  const systemPrompt = `Use the virtual-office MCP tool \`report_status\` to report your working status.
- Report a summary of what you're doing, your state (working/complete/idle/failure), and optionally a link and workspace name.
- Always include the \`workspace\` parameter with your Coder workspace identifier (e.g. "owner/workspace-name").
- Report status after receiving each new user message.
- Report "complete" when you finish a task.`;

  const copyConfig = () => {
    navigator.clipboard.writeText(config);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4" style={{ fontFamily: MONO }}>
      {/* MCP config */}
      <div>
        <p className="text-[11px] text-[#8892a6] mb-2">
          📎 加到你的{" "}
          <code
            className="px-1 py-0.5 text-[9px]"
            style={{
              background: "#2e3440",
              color: "#a3be8c",
              borderRadius: 2,
              border: "1px solid #4c566a",
            }}
          >
            .claude/settings.json
          </code>
          ：
        </p>
        <div className="relative">
          <pre
            className="p-4 text-[11px] overflow-x-auto"
            style={{
              background: "#2e3440",
              color: "#a3be8c",
              border: "3px solid #4c566a",
              borderRadius: 2,
              boxShadow: "4px 4px 0 rgba(0,0,0,0.4)",
            }}
          >
            {config}
          </pre>
          <div className="absolute top-2 right-2">
            <Button
              variant={copied ? "secondary" : "primary"}
              size="sm"
              onClick={copyConfig}
            >
              {copied ? "✓ OK" : "📋 Copy"}
            </Button>
          </div>
        </div>
      </div>

      {/* System prompt */}
      <div>
        <p className="text-[11px] text-[#8892a6] mb-2">
          📝 加到你的{" "}
          <code
            className="px-1 py-0.5 text-[9px]"
            style={{
              background: "#2e3440",
              color: "#a3be8c",
              borderRadius: 2,
              border: "1px solid #4c566a",
            }}
          >
            CLAUDE.md
          </code>
          ：
        </p>
        <pre
          className="p-4 text-[11px] overflow-x-auto whitespace-pre-wrap"
          style={{
            background: "rgba(59, 66, 82, 0.6)",
            color: "#d8dee9",
            border: "3px solid #4c566a",
            borderRadius: 2,
            boxShadow: "4px 4px 0 rgba(0,0,0,0.4)",
          }}
        >
          {systemPrompt}
        </pre>
      </div>

      <p className="text-[10px] text-[#6b7994]">
        💡 將{" "}
        <code className="font-bold text-[#bf616a]">&lt;YOUR_API_KEY&gt;</code>{" "}
        替換為你的 API Key（avo_ 開頭）。
      </p>
    </div>
  );
}
