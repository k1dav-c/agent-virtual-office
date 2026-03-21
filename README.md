# Agent Virtual Office

一個像素風格的虛擬辦公室，讓你即時觀看 AI Agent 在辦公室裡工作。Agent 透過 MCP 回報狀態，前端以 Gather Town 風格呈現每位 Agent 的工作動態。

## 運作流程

```
使用者登入 (Auth0)
    ↓
產生 API Key → 設定 Coder Host
    ↓
將 MCP 設定貼入 Claude Code
    ↓
Agent 透過 MCP 回報 status / workspace
    ↓
前端即時顯示像素角色在辦公室工作
```

## 畫面

| 頁面         | 說明                                                           |
| ------------ | -------------------------------------------------------------- |
| `/login`     | 像素風登入畫面，綠色方格地板 + 等距辦公室場景                  |
| `/`          | 首頁，走動的像素角色 + 辦公室裝飾 + 功能說明                   |
| `/dashboard` | 設定頁：Coder Host、API Key 管理、MCP 設定片段                 |
| `/office`    | 全螢幕虛擬辦公室，即時顯示 Agent 狀態，側邊欄含 workspace 連結 |

## 技術架構

```
Frontend (React 19 + TypeScript + Vite + Tailwind CSS)
  ├── Auth0 登入
  ├── Hasura GraphQL Subscriptions (即時 Agent 狀態)
  └── 像素風 SVG 角色 + CSS 動畫
        │
        │ WebSocket / HTTP
        ▼
Hasura GraphQL Engine ─── PostgreSQL
        ▲
        │ GraphQL Mutation
        │
Backend (FastAPI)
  ├── /mcp/* ── MCP Server (Streamable HTTP)
  │              └── report_status tool (summary, state, link, workspace)
  └── /api/auth/* ── Auth0 JWT 驗證

※ API Key 的產生、列表、撤銷、刪除皆由前端直接透過
   Hasura GraphQL 完成 (Web Crypto API 產生 + SHA-256 雜湊)
```

## 快速開始

### 環境需求

- Docker + Dev Containers (建議用 VS Code 或 Coder)
- Auth0 帳號 (身分驗證)

### 環境變數

**前端 (`frontend/.env`)**

```env
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=your-api-audience
VITE_HASURA_GRAPHQL_URL=http://localhost:8080/v1/graphql
VITE_HASURA_WS_URL=ws://localhost:8080/v1/graphql
```

**後端 (`backend/.env`)**

```env
HASURA_GRAPHQL_URL=http://hasura:8080/v1/graphql
HASURA_ADMIN_SECRET=your-hasura-admin-secret
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672/
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_AUDIENCE=your-api-audience
```

### 啟動

用 VS Code / Coder 開啟專案，選擇 **Reopen in Container**，所有服務會自動啟動。

- 前端：http://localhost:5173
- 後端 API：http://localhost:8000
- Hasura Console：http://localhost:8080

## 專案結構

```
backend/
  ├── main.py                 # FastAPI + MCP Server 掛載
  ├── modules/
  │   ├── auth/               # Auth0 JWT 驗證
  │   ├── api_keys/           # API Key 驗證 (MCP 連線時比對 hash)
  │   └── mcp/                # MCP Server (report_status tool)
  └── core/                   # 設定、日誌、GraphQL client

frontend/
  ├── src/
  │   ├── pages/
  │   │   ├── LoginPage.tsx   # 像素風登入
  │   │   ├── HomePage.tsx    # 首頁 (走動角色 + 辦公室場景)
  │   │   ├── DashboardPage.tsx # 設定頁 (Coder Host / API Key / MCP)
  │   │   └── OfficePage.tsx  # 虛擬辦公室 (即時 Agent 狀態)
  │   ├── components/
  │   │   ├── office/         # 虛擬辦公室場景元件
  │   │   ├── PixelLayout.tsx # 共用像素風版面 (綠色地板)
  │   │   ├── ApiKeyManager.tsx
  │   │   ├── CoderHostSetting.tsx
  │   │   └── McpConfigSnippet.tsx
  │   ├── hooks/
  │   │   └── useAgentSessions.ts  # GraphQL subscription
  │   ├── config/
  │   │   ├── agent-roles.ts  # Agent 角色定義 + 顏色
  │   │   └── office-scenes.ts
  │   └── types/
  │       └── agent.ts        # AgentSession 型別

hasura/
  ├── migrations/             # DB schema (agent_sessions, api_keys, session_logs)
  └── metadata/               # 權限、關聯設定
```

## Agent 整合

### 1. 在 Dashboard 頁面管理 API Key

API Key 的產生、列表、撤銷、刪除全部在前端完成，不經過後端：

- **產生**：Web Crypto API 產生隨機 key，SHA-256 雜湊後存入 Hasura
- **列表 / 撤銷 / 刪除**：前端直接呼叫 Hasura GraphQL mutation
- 原始 key 只在產生時顯示一次，後端僅儲存 hash

### 2. 設定 Coder Host URL（如使用 Coder workspace）

### 3. 將 MCP 設定加入 Claude Code

Dashboard 頁面會產生完整的 MCP config snippet，直接貼入 `~/.claude.json` 即可。

Agent 呼叫 `report_status` tool 時，傳入：

| 參數        | 說明                                                 |
| ----------- | ---------------------------------------------------- |
| `summary`   | 目前工作摘要 (≤160 字)                               |
| `state`     | `working` / `complete` / `idle` / `failure`          |
| `link`      | 相關連結 (PR、Issue 等)                              |
| `workspace` | Coder workspace 識別碼 (e.g. `owner/workspace-name`) |
| `api_key`   | 你的 API Key                                         |

### 4. 前往 Office 頁面觀看 Agent 工作

## 資料庫

| Table            | 說明                                                |
| ---------------- | --------------------------------------------------- |
| `agent_sessions` | Agent 狀態 (role, status, summary, link, workspace) |
| `api_keys`       | 使用者 API Key                                      |
| `session_logs`   | Agent 活動紀錄                                      |

## 授權

[MIT](LICENSE)
