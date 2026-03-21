# 全端開發樣板 (Full-Stack Development Template)

這是一個**現代化、企業級的全端開發樣板**，整合了 React 19、FastAPI、Hasura GraphQL、RabbitMQ 等技術，提供完整的身分驗證、非同步工作處理、即時資料更新功能，讓您快速啟動新專案。

## ✨ 為什麼選擇這個樣板？

- 🚀 **快速啟動**：完整的 Dev Container 設定檔，一鍵啟動開發環境
- 🔐 **企業級身分驗證**：整合 Auth0，支援 JWT、權限管理
- ⚡ **高效能架構**：FastAPI + RabbitMQ 非同步處理 + Hasura GraphQL
- 🎨 **現代化前端**：React 19 + TypeScript + Tailwind CSS + Vite
- 📦 **模組化設計**：清晰的模組結構，易於擴充
- 🐳 **完整容器化**：Docker + Docker Compose，開發/正式環境一致

## 🏗️ 系統架構

```
┌─────────────────────────────────────────────────────────────┐
│                         前端層 (Frontend)                    │
│   React 19 + TypeScript + Vite + Auth0 + Tailwind CSS      │
│                    連接埠: 5173                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/WebSocket
                     │
┌────────────────────┴────────────────────────────────────────┐
│                    API 層 (Backend)                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │   FastAPI 伺服器 (main.py)                           │   │
│  │   - 處理 HTTP 請求                                    │   │
│  │   - JWT 驗證                                         │   │
│  │   - 發布 RabbitMQ 訊息                               │   │
│  │   連接埠: 8000                                        │   │
│  └──────────────┬──────────────────────────────────────┘   │
│                 │                                           │
│  ┌──────────────┴──────────────────────────────────────┐   │
│  │   背景 Worker (consumer_worker.py)                   │   │
│  │   - 消費 RabbitMQ 訊息                               │   │
│  │   - 執行非同步工作                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────┬────────────────┬───────────────────────────────┘
              │                │
              │                │
    ┌─────────┴────────┐  ┌───┴──────────────┐
    │   Hasura GraphQL │  │   RabbitMQ       │
    │   - 即時 API      │  │   - 訊息佇列      │
    │   - Subscriptions│  │   - 非同步通訊     │
    │   連接埠: 8080    │  │   連接埠: 5672    │
    └─────────┬────────┘  └──────────────────┘
              │
    ┌─────────┴────────┐
    │   PostgreSQL     │
    │   - 主資料庫      │
    │   連接埠: 5432    │
    └──────────────────┘
```

## 🛠️ 技術堆疊 (Technology Stack)

### 前端 (Frontend)

- [React 19.2](https://react.dev/) - 最新的使用者介面函式庫
- [TypeScript 5.9](https://www.typescriptlang.org/) - 型別安全的 JavaScript
- [Vite 5.4](https://vitejs.dev/) - 高效能的前端建置工具
- [Tailwind CSS 4.1](https://tailwindcss.com/) - Utility-First CSS 框架
- [Auth0 React SDK 2.12](https://auth0.com/) - 身分驗證與授權服務
- [GraphQL Request 7.4](https://github.com/jasonkuhrt/graphql-request) - GraphQL 用戶端
- [React Router 6.30](https://reactrouter.com/) - 路由管理

### 後端 (Backend)

- [Python 3.11](https://www.python.org/) - 主要後端程式語言
- [FastAPI 0.118](https://fastapi.tiangolo.com/) - 高效能的 API 框架
- [aio-pika 9.5](https://aio-pika.readthedocs.io/) - 非同步 RabbitMQ 用戶端
- [GQL 4.0](https://gql.readthedocs.io/) - Python GraphQL 用戶端
- [Pydantic 2.12](https://docs.pydantic.dev/) - 資料驗證與設定管理
- [Loguru 0.7](https://loguru.readthedocs.io/) - 現代化日誌系統

### 資料庫與 API (Database & API)

- [PostgreSQL](https://www.postgresql.org/) - 強大的開源關聯式資料庫
- [Hasura](https://hasura.io/) - 即時 GraphQL 引擎，自動從資料庫產生 API
- [RabbitMQ](https://www.rabbitmq.com/) - 成熟可靠的訊息佇列

### 容器化與開發環境 (Containerization & Dev Environment)

- [Docker](https://www.docker.com/) - 應用程式容器化平台
- [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers) - 在 Docker 容器中進行開發

## ✨ 主要功能

- 🔐 **使用者身分驗證**：透過 Auth0 進行安全登入與使用者管理
- 👤 **角色權限控制**：支援一般使用者和管理員角色
- 📊 **管理員儀表板**：提供管理員專用的操作介面
- ⚡ **非同步工作處理**：使用 RabbitMQ 和背景 Worker 處理耗時的後端工作
- 🔄 **即時資料更新**：藉由 Hasura GraphQL Subscriptions，前端可以即時反映資料庫的變更
- 📦 **模組化架構**：清晰的模組結構，易於新增功能

## 🚀 快速開始 (Quick Start)

### 先決條件

- [Docker Desktop](https://www.docker.com/get-started) (包含 Docker Compose)
- [VS Code](https://code.visualstudio.com/) + [Dev Containers 擴充功能](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) (建議)

### 步驟 1：複製專案

```bash
git clone <your-repo-url>
cd <your-repo-url>
```

### 步驟 2：環境變數設定

1. 複製前端環境變數檔案：

   ```bash
   cp frontend/.env.example frontend/.env
   ```

2. 複製後端環境變數檔案：

   ```bash
   cp backend/.env.example backend/.env
   ```

3. 編輯環境變數檔案，填入必要的設定值：

   **前端 (`frontend/.env`)**：

   ```env
   VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
   VITE_AUTH0_CLIENT_ID=your-auth0-client-id
   VITE_AUTH0_AUDIENCE=your-api-audience
   VITE_HASURA_GRAPHQL_URL=http://localhost:8080/v1/graphql
   VITE_HASURA_WS_URL=ws://localhost:8080/v1/graphql
   ```

   **後端 (`backend/.env`)**：

   ```env
   HASURA_GRAPHQL_URL=http://hasura:8080/v1/graphql
   HASURA_ADMIN_SECRET=your-hasura-admin-secret
   RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672/
   AUTH0_DOMAIN=your-auth0-domain.auth0.com
   AUTH0_AUDIENCE=your-api-audience
   ```

### 步驟 3：啟動開發環境

#### 方法 A：使用 VS Code Dev Containers (建議)

1. 在 VS Code 中開啟專案
2. 點選右下角的 "Reopen in Container" 提示
3. 等待容器建置完成（首次啟動約需 5-10 分鐘）
4. 所有服務會自動啟動

#### 方法 B：使用 Docker Compose

```bash
docker-compose -f .devcontainer/docker-compose.yml up --build -d
```

### 步驟 4：存取應用程式

- **前端應用**：http://localhost:5173
- **後端 API**：http://localhost:8000
- **API 文件**：http://localhost:8000/docs
- **Hasura Console**：http://localhost:8080 (密碼：在 `.env` 中設定)
- **RabbitMQ Management**：http://localhost:15672 (guest/guest)

## 📁 專案結構

```
.
├── backend/                 # Python 後端服務
│   ├── main.py              # FastAPI 伺服器進入點
│   ├── consumer_worker.py   # RabbitMQ 背景 Worker 進入點
│   ├── core/                # 核心共用模組
│   │   ├── config.py        # 設定檔管理
│   │   ├── logger.py        # 日誌系統
│   │   ├── context.py       # 應用程式上下文
│   │   ├── rabbitmq.py      # RabbitMQ 用戶端
│   │   ├── hasura_client.py # Hasura GraphQL 用戶端
│   │   └── dependencies.py  # FastAPI 相依性注入
│   ├── modules/             # 業務邏輯模組
│   │   └── auth/            # 身分驗證模組
│   │       ├── router.py    # API 路由
│   │       ├── schemas.py   # 資料模型
│   │       ├── services.py  # 業務邏輯
│   │       └── consumer.py  # 事件消費者
│   └── requirements.txt     # Python 相依套件
│
├── frontend/                # React 前端應用
│   ├── src/
│   │   ├── pages/           # 頁面元件
│   │   ├── components/      # 可重用元件
│   │   ├── config/          # 設定檔
│   │   ├── App.tsx          # 主應用程式
│   │   └── index.tsx        # 進入點
│   ├── package.json         # Node.js 相依套件
│   └── vite.config.ts       # Vite 設定檔
│
├── hasura/                  # Hasura GraphQL 設定
│   ├── metadata/            # 資料庫 Metadata
│   ├── migrations/          # 資料庫遷移
│   └── seeds/               # 種子資料
│
├── .devcontainer/           # Dev Container 設定檔
│   ├── docker-compose.yml   # 服務編排
│   └── devcontainer.json    # VS Code 設定檔
│
├── docs/                    # 詳細文件
│   ├── API.md               # API 文件
│   ├── TROUBLESHOOTING.md   # 疑難排解
│   ├── DEPLOYMENT.md        # 部署指南
│   └── ARCHITECTURE.md      # 架構設計
│
├── CONTRIBUTING.md          # 貢獻指南
└── README.md                # 本文件
```

## 🛠️ 開發指南

### 新增後端模組

1. **建立模組目錄結構**：

   ```bash
   mkdir -p backend/modules/my_module
   cd backend/modules/my_module
   touch __init__.py router.py schemas.py services.py
   ```

2. **定義資料模型** (`schemas.py`)：

   ```python
   from pydantic import BaseModel

   class MyRequest(BaseModel):
       field1: str
       field2: int

   class MyResponse(BaseModel):
       success: bool
       data: dict
   ```

3. **實作業務邏輯** (`services.py`)：

   ```python
   from core.context import AppContext

   class MyService:
       @staticmethod
       async def process(data, ctx: AppContext):
           # 業務邏輯實作
           return {"result": "success"}
   ```

4. **定義 API 路由** (`router.py`)：

   ```python
   from fastapi import APIRouter, Depends
   from core.dependencies import get_context
   from .schemas import MyRequest, MyResponse
   from .services import MyService

   router = APIRouter()

   @router.post("/action", response_model=MyResponse)
   async def my_action(
       request: MyRequest,
       ctx: AppContext = Depends(get_context)
   ):
       result = await MyService.process(request, ctx)
       return MyResponse(success=True, data=result)
   ```

5. **註冊模組** (`__init__.py`)：

   ```python
   from .router import router
   ```

6. **在主應用中載入** (`main.py`)：

   ```python
   from modules.my_module import router as my_module_router

   app.include_router(
       my_module_router,
       prefix="/api/my_module",
       tags=["My Module"]
   )
   ```

📚 **詳細指南**：請參閱 [backend/modules/README.md](backend/modules/README.md)

### 新增前端頁面

1. **建立頁面檔案**：

   ```tsx
   // frontend/src/pages/MyPage.tsx
   import { FC } from "react";

   const MyPage: FC = () => {
     return (
       <div className="container mx-auto p-4">
         <h1 className="text-2xl font-bold">My Page</h1>
       </div>
     );
   };

   export default MyPage;
   ```

2. **在 App.tsx 中新增路由**：

   ```tsx
   import MyPage from "./pages/MyPage";

   // 在 <Routes> 中新增
   <Route path="/my-page" element={<MyPage />} />;
   ```

📚 **詳細指南**：請參閱 [frontend/README.md](frontend/README.md)

### 發送非同步事件

在任何需要觸發背景工作的地方：

```python
# 在 router 或 service 中
await ctx.rabbitmq_producer.publish(
    topic="my_module.action.completed",
    data={
        "user_id": "12345",
        "action": "some_action",
        "timestamp": "2024-01-01T00:00:00Z"
    }
)
```

### 消費非同步事件

在 `modules/my_module/consumer.py` 中：

```python
from core.logger import logger
from core.consumer import register_consumer

@register_consumer("my_module.action.completed")
async def handle_action_completed(data: dict, ctx):
    """處理 action.completed 事件"""
    logger.info(f"Processing action: {data}")

    # 執行業務邏輯
    user_id = data.get("user_id")
    # ... 處理工作

    logger.info(f"Action completed for user {user_id}")
```

然後在 `consumer_worker.py` 中註冊：

```python
from modules.my_module.consumer import handle_action_completed
# Worker 會自動載入所有註冊的消費者
```

## 📚 文件導覽

- **[前端開發指南](frontend/README.md)** - React 應用開發、Auth0 整合、路由設定
- **[後端開發指南](backend/README.md)** - FastAPI 開發、模組系統、RabbitMQ、Hasura
- **[模組開發指南](backend/modules/README.md)** - 詳細的模組建立步驟
- **[API 文件](docs/API.md)** - 完整的 API 端點說明
- **[架構設計](docs/ARCHITECTURE.md)** - 系統架構詳解
- **[部署指南](docs/DEPLOYMENT.md)** - 開發與正式環境部署
- **[疑難排解](docs/TROUBLESHOOTING.md)** - 常見問題解決方案
- **[貢獻指南](CONTRIBUTING.md)** - 如何為專案貢獻程式碼

## 🧪 測試

### 後端測試

```bash
# 進入後端容器
docker exec -it <backend-container-id> bash

# 執行測試
pytest tests/
```

### 前端測試

```bash
# 進入前端目錄
cd frontend

# 執行測試
npm test
```

## 📦 建置與部署

### 前端建置

```bash
cd frontend
npm run build
# 建置產物在 frontend/dist/
```

### 後端 Docker 映像檔

```bash
cd backend
docker build -t my-app-backend:latest .
```

📚 **詳細指南**：請參閱 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## 🐛 疑難排解

### 常見問題

**Q: Auth0 連線失敗？**

- 檢查 `frontend/.env` 中的 Auth0 設定檔是否正確
- 確認 Auth0 應用程式的 Callback URLs 包含 `http://localhost:5173`

**Q: RabbitMQ 連線錯誤？**

- 確認 RabbitMQ 容器正在執行：`docker ps | grep rabbitmq`
- 檢查 `backend/.env` 中的 `RABBITMQ_URL` 是否正確

**Q: Hasura 無法連線？**

- 造訪 http://localhost:8080 確認 Hasura 正在執行
- 檢查 `HASURA_ADMIN_SECRET` 是否一致

📚 **完整疑難排解指南**：請參閱 [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

## 🤝 貢獻

歡迎任何形式的貢獻！請參閱 [CONTRIBUTING.md](CONTRIBUTING.md) 瞭解：

- 開發工作流程
- 程式碼風格規範
- 提交訊息規範
- Pull Request 流程

## 📝 開發藍圖

- [ ] 新增單元測試和整合測試
- [ ] 實作 CI/CD 管線
- [ ] 新增更多身分驗證方法
- [ ] 實作 WebSocket 即時通訊
- [ ] 新增監控和日誌聚合
- [ ] 正式環境部署文件

## 📄 授權條款

本專案採用 [MIT](LICENSE) 授權。

---

## 🙋 需要協助？

- 📖 查看 [文件目錄](docs/)
- 🐛 提交 [Issue](https://github.com/your-repo/issues)
- 💬 加入討論區
- 📧 聯絡維護者

---

**Happy Coding! 🚀**
