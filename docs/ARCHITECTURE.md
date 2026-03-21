# 架構設計文檔

完整的系統架構說明，包含設計決策、通信協議和數據流程。

## 📚 目錄

- [系統架構概覽](#系統架構概覽)
- [技術棧詳解](#技術棧詳解)
- [各層職責說明](#各層職責說明)
- [通信協議](#通信協議)
- [數據流程](#數據流程)
- [設計決策與權衡](#設計決策與權衡)
- [擴展性考量](#擴展性考量)
- [安全架構](#安全架構)

## 🏗️ 系統架構概覽

### 高層架構圖

```
┌───────────────────────────────────────────────────────────────────┐
│                          客戶端層                                  │
│                       (Client Layer)                              │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │         Web Browser / Mobile App                         │    │
│  │   React 19 + TypeScript + Tailwind CSS + Auth0         │    │
│  │   Port: 5173 (Dev) / CDN (Production)                  │    │
│  └─────────────────┬───────────────────────────────────────┘    │
│                    │                                             │
│                    │ HTTPS / WebSocket                           │
│                    │                                             │
└────────────────────┼─────────────────────────────────────────────┘
                     │
┌────────────────────┼─────────────────────────────────────────────┐
│                    │           API Gateway 層                     │
│                    │        (API Gateway Layer)                   │
├────────────────────┴─────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐    ┌──────────────────────┐           │
│  │   REST API           │    │   GraphQL API        │           │
│  │   FastAPI            │    │   Hasura             │           │
│  │   Port: 8000         │    │   Port: 8080         │           │
│  └──────────┬───────────┘    └──────────┬───────────┘           │
│             │                            │                       │
│             │ RabbitMQ                   │ PostgreSQL            │
│             ▼                            ▼                       │
│  ┌──────────────────────┐    ┌──────────────────────┐           │
│  │   Message Queue      │    │   Database           │           │
│  │   RabbitMQ           │    │   PostgreSQL 15      │           │
│  │   Port: 5672         │    │   Port: 5432         │           │
│  └──────────┬───────────┘    └──────────────────────┘           │
│             │                                                    │
│             ▼                                                    │
│  ┌──────────────────────┐                                       │
│  │   Background Workers │                                       │
│  │   Python Consumers   │                                       │
│  └──────────────────────┘                                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 詳細組件架構

```
                         ┌─────────────────┐
                         │  React Frontend │
                         └────────┬────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
              ┌─────▼────┐  ┌────▼─────┐  ┌───▼────┐
              │ Auth0    │  │ REST API │  │ GraphQL│
              │ (JWT)    │  │ FastAPI  │  │ Hasura │
              └──────────┘  └────┬─────┘  └───┬────┘
                                 │            │
                    ┌────────────┼────────────┘
                    │            │
              ┌─────▼────┐  ┌───▼────────┐
              │ RabbitMQ │  │ PostgreSQL │
              └─────┬────┘  └────────────┘
                    │
              ┌─────▼────────┐
              │   Consumer   │
              │   Workers    │
              └──────────────┘
```

## 🛠️ 技術棧詳解

### 前端技術棧

| 技術 | 版本 | 用途 | 選擇理由 |
|------|------|------|---------|
| React | 19.1 | UI 框架 | 最新版本，更好的效能和開發體驗 |
| TypeScript | 5.5 | 型別系統 | 編譯時型別檢查，減少執行時錯誤 |
| Vite | 5.3 | 建置工具 | 極快的 HMR，現代化的開發體驗 |
| Tailwind CSS | 4.1 | CSS 框架 | Utility-First，快速開發 |
| Auth0 React SDK | 2.4 | 身份驗證 | 企業級安全，開箱即用 |
| GraphQL Request | 7.2 | GraphQL 客戶端 | 輕量級，易於使用 |
| React Router | 6.25 | 路由管理 | 聲明式路由，TypeScript 支援 |

### 後端技術棧

| 技術 | 版本 | 用途 | 選擇理由 |
|------|------|------|---------|
| FastAPI | 0.118 | Web 框架 | 高效能，自動 API 文檔，異步支援 |
| Python | 3.11 | 程式語言 | 現代語法，優秀的生態系統 |
| Pydantic | 2.12 | 資料驗證 | 型別安全，自動驗證 |
| aio-pika | 9.5 | RabbitMQ 客戶端 | 異步支援，穩定可靠 |
| GQL | 4.0 | GraphQL 客戶端 | 完整的 Python GraphQL 實現 |
| Loguru | 0.7 | 日誌系統 | 簡潔 API，彩色輸出 |

### 基礎設施

| 技術 | 版本 | 用途 | 選擇理由 |
|------|------|------|---------|
| PostgreSQL | 15 | 資料庫 | 成熟穩定，豐富的功能 |
| Hasura | Latest | GraphQL 引擎 | 自動生成 API，即時訂閱 |
| RabbitMQ | 3 | 訊息佇列 | 成熟的訊息中介軟體 |
| Docker | Latest | 容器化 | 一致的開發/生產環境 |

## 📋 各層職責說明

### 1. 前端層 (Frontend Layer)

**職責**：
- 使用者介面渲染
- 使用者互動處理
- 客戶端路由管理
- 狀態管理
- Auth0 身份驗證
- API 請求與錯誤處理

**技術決策**：
- **為什麼選擇 React 19？**
  - 最新的併發特性
  - 更好的效能（自動批次處理）
  - 改進的 Suspense 支援

- **為什麼選擇 Vite？**
  - 開發模式下極快的冷啟動
  - 即時模組替換 (HMR)
  - 優化的生產建置

- **為什麼選擇 Tailwind CSS？**
  - 快速開發，無需切換到 CSS 文件
  - 內建響應式設計
  - 生產建置時自動移除未使用的樣式

### 2. API Gateway 層

#### 2.1 REST API (FastAPI)

**職責**：
- 處理 HTTP 請求
- JWT 認證與授權
- 業務邏輯協調
- 發布 RabbitMQ 事件
- 資料驗證

**設計模式**：
```python
# 三層架構
Router (路由層)
    ↓
Service (業務邏輯層)
    ↓
Data Access (資料存取層 - Hasura)
```

**為什麼選擇 FastAPI？**
- 原生異步支援（async/await）
- 自動生成 OpenAPI 文檔
- Pydantic 整合（型別安全）
- 高效能（與 Node.js 相當）

#### 2.2 GraphQL API (Hasura)

**職責**：
- 提供 GraphQL 查詢介面
- 資料庫直接映射
- 即時訂閱 (Subscriptions)
- 細粒度權限控制

**為什麼選擇 Hasura？**
- 零代碼生成 GraphQL API
- 內建權限系統
- WebSocket 支援（即時資料）
- 與 PostgreSQL 完美整合

### 3. 訊息佇列層 (Message Queue)

**職責**：
- 異步任務排程
- 解耦服務
- 可靠的訊息傳遞
- 負載平衡

**為什麼選擇 RabbitMQ？**
- 成熟穩定，被廣泛採用
- 支援多種訊息模式
- 持久化支援
- 優秀的管理介面

### 4. 資料持久層 (Data Persistence)

**職責**：
- 資料持久化
- ACID 事務保證
- 複雜查詢支援
- 資料完整性約束

**為什麼選擇 PostgreSQL？**
- 開源且功能豐富
- 優秀的 JSON 支援
- 強大的索引系統
- 成熟的複製和高可用方案

### 5. 背景 Worker 層

**職責**：
- 處理長時間執行的任務
- 消費 RabbitMQ 訊息
- 執行定時任務
- 與外部服務整合

## 🔗 通信協議

### 1. HTTP/HTTPS

**用途**：前端 ↔ REST API

**協議**：
- 請求方法：GET, POST, PUT, DELETE
- 內容類型：`application/json`
- 認證：`Authorization: Bearer <jwt>`

**範例**：
```http
POST /api/users HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### 2. GraphQL over HTTP/WebSocket

**用途**：前端 ↔ Hasura

**協議**：
- HTTP POST (查詢/變異)
- WebSocket (訂閱)

**查詢範例**：
```graphql
query GetUsers($limit: Int!) {
  users(limit: $limit, order_by: {created_at: desc}) {
    id
    name
    email
  }
}
```

**訂閱範例**：
```graphql
subscription OnNewMessage {
  messages(order_by: {created_at: desc}, limit: 1) {
    id
    content
    user_id
  }
}
```

### 3. AMQP (Advanced Message Queuing Protocol)

**用途**：FastAPI ↔ RabbitMQ ↔ Workers

**訊息格式**：
```json
{
  "topic": "auth.user.created",
  "data": {
    "user_id": "123",
    "email": "user@example.com",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

**發布-訂閱模式**：
```
Publisher (FastAPI)
    ↓ (publish)
Exchange (RabbitMQ)
    ↓ (route by topic)
Queue
    ↓ (consume)
Consumer (Worker)
```

### 4. PostgreSQL 協議

**用途**：Hasura ↔ PostgreSQL, Workers ↔ PostgreSQL

**連線池管理**：
- 最小連線數：5
- 最大連線數：20
- 連線超時：30 秒

## 📊 數據流程

### 1. 使用者註冊流程

```
┌──────┐   1. Register    ┌────────┐
│ User │ ───────────────> │ Auth0  │
└──────┘                  └───┬────┘
                              │
                              │ 2. JWT Token
                              ▼
                          ┌────────┐
                          │Frontend│
                          └───┬────┘
                              │
                  3. POST /api/auth/jwt_claim
                              │
                              ▼
                          ┌─────────┐
                          │ FastAPI │
                          └────┬────┘
                               │
                   4. Insert user data
                               │
                               ▼
                          ┌─────────┐
                          │ Hasura  │
                          └────┬────┘
                               │
                          ┌────▼─────┐
                          │PostgreSQL│
                          └──────────┘
                               │
                   5. Publish event
                               │
                               ▼
                          ┌─────────┐
                          │RabbitMQ │
                          └────┬────┘
                               │
                   6. Consume event
                               │
                               ▼
                          ┌─────────┐
                          │ Worker  │  7. Send welcome email
                          └─────────┘
```

### 2. 資料查詢流程（GraphQL）

```
┌──────────┐   1. Query    ┌─────────┐
│ Frontend │ ────────────> │ Hasura  │
└──────────┘               └────┬────┘
                                │
                     2. Execute SQL
                                │
                                ▼
                           ┌──────────┐
                           │PostgreSQL│
                           └────┬─────┘
                                │
                       3. Return data
                                │
                                ▼
                           ┌─────────┐
                           │ Hasura  │
                           └────┬────┘
                                │
                     4. Format response
                                │
                                ▼
                           ┌──────────┐
                           │ Frontend │
                           └──────────┘
```

### 3. 異步任務處理流程

```
┌──────────┐  1. API Request  ┌─────────┐
│ Frontend │ ──────────────> │ FastAPI │
└──────────┘                 └────┬────┘
                                  │
                   2. Publish event
                                  │
                                  ▼
                             ┌─────────┐
                             │RabbitMQ │
                             └────┬────┘
        3. Return 202 Accepted    │
        ◄─────────────────────────┘
                                  │
                   4. Consume event
                                  │
                                  ▼
                             ┌─────────┐
                             │ Worker  │
                             └────┬────┘
                                  │
                   5. Process task
                                  │
                                  ▼
                             ┌─────────┐
                             │ Hasura  │
                             └────┬────┘
                                  │
                     6. Update status
                                  │
                                  ▼
                             ┌──────────┐
                             │PostgreSQL│
                             └──────────┘
```

## 🎯 設計決策與權衡

### 1. 為什麼同時使用 REST 和 GraphQL？

**決策**：混合使用 REST（FastAPI）和 GraphQL（Hasura）

**理由**：
- **REST 用於**：
  - 複雜的業務邏輯
  - 需要背景處理的操作
  - 與外部服務整合

- **GraphQL 用於**：
  - 資料查詢和讀取
  - 即時更新（訂閱）
  - 前端靈活的資料需求

**權衡**：
- ✅ 優點：各取所長，靈活性高
- ❌ 缺點：學習曲線較陡，需維護兩套 API

### 2. 為什麼使用 RabbitMQ 而非其他訊息佇列？

**決策**：選擇 RabbitMQ

**替代方案**：
- Redis Pub/Sub
- Apache Kafka
- AWS SQS

**理由**：
- 成熟穩定，社群支援好
- 支援多種訊息模式
- 優秀的管理介面
- 適合中小規模應用

**權衡**：
- ✅ 優點：功能豐富，易於使用
- ❌ 缺點：不如 Kafka 適合大規模流處理

### 3. 模組化架構設計

**決策**：採用模組化單體架構

**為什麼不選擇微服務？**
- 當前規模不需要微服務的複雜性
- 單體應用部署和維護更簡單
- 模組化設計保留了未來拆分的可能性

**模組化單體的優勢**：
- ✅ 簡單的部署
- ✅ 更少的網路開銷
- ✅ 更容易的本地開發
- ✅ 保留未來遷移到微服務的選項

### 4. Auth0 vs 自建身份驗證

**決策**：使用 Auth0

**理由**：
- 企業級安全標準
- 豐富的功能（MFA, SSO, 社交登入）
- 減少安全漏洞風險
- 節省開發時間

**權衡**：
- ✅ 優點：安全、可靠、功能豐富
- ❌ 缺點：成本（大量使用者時）、供應商鎖定

## 🚀 擴展性考量

### 水平擴展

#### 1. 後端 API 擴展

```
          ┌───────────────┐
          │ Load Balancer │
          └───────┬───────┘
                  │
      ┌───────────┼───────────┐
      │           │           │
┌─────▼────┐ ┌───▼─────┐ ┌──▼──────┐
│Backend #1│ │Backend #2│ │Backend #3│
└──────────┘ └──────────┘ └─────────┘
```

**無狀態設計**：
- 所有狀態存儲在資料庫或快取中
- JWT Token 包含所有必要資訊
- 可以輕鬆添加更多實例

#### 2. Worker 擴展

```
┌─────────┐
│RabbitMQ │
└────┬────┘
     │
     ├──────┬──────┬──────┐
     │      │      │      │
┌────▼──┐ ┌▼────┐ ┌▼───┐ ┌▼────┐
│Worker1│ │Work2│ │Wor3│ │Work4│
└───────┘ └─────┘ └────┘ └─────┘
```

**自動擴展**：
- 根據佇列長度自動調整 Worker 數量
- Kubernetes HPA (Horizontal Pod Autoscaler)

### 垂直擴展

- **資料庫**：增加 CPU/記憶體
- **快取層**：Redis/Memcached
- **CDN**：靜態資源加速

### 資料庫擴展策略

#### 1. 讀寫分離

```
┌──────────────┐
│Primary (Write)│
└───────┬──────┘
        │ Replication
    ┌───┴───┬───────┐
    │       │       │
┌───▼──┐ ┌──▼──┐ ┌─▼───┐
│Read#1│ │Read2│ │Read3│
└──────┘ └─────┘ └─────┘
```

#### 2. 資料庫分片

- 按使用者 ID 分片
- 按地理位置分片
- 功能性分片（不同表到不同資料庫）

## 🔒 安全架構

### 1. 認證與授權

**多層認證**：
```
┌───────────┐
│   User    │
└─────┬─────┘
      │
      │ 1. Login
      ▼
┌───────────┐
│   Auth0   │  2. Issue JWT
└─────┬─────┘
      │
      ▼
┌───────────┐
│  Frontend │  3. Include JWT in requests
└─────┬─────┘
      │
      ▼
┌───────────┐
│  FastAPI  │  4. Verify JWT
└─────┬─────┘
      │
      ▼
┌───────────┐
│  Hasura   │  5. Check permissions
└───────────┘
```

### 2. 資料加密

- **傳輸加密**：HTTPS/TLS 1.3
- **靜態加密**：資料庫加密
- **密碼處理**：由 Auth0 管理（bcrypt）

### 3. 安全最佳實踐

- ✅ JWT Token 短期有效（15分鐘）
- ✅ Refresh Token 輪換
- ✅ CORS 限制
- ✅ Rate Limiting
- ✅ Input Validation（Pydantic）
- ✅ SQL Injection 防護（Hasura）
- ✅ XSS 防護（React 自動轉義）

## 📚 相關文檔

- [後端開發指南](../backend/README.md)
- [前端開發指南](../frontend/README.md)
- [API 文檔](API.md)
- [部署指南](DEPLOYMENT.md)
- [故障排除](TROUBLESHOOTING.md)

---

**希望這份架構文檔能幫助您理解系統設計！🏗️**
