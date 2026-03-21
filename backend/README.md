# Backend - FastAPI Application

這是一個使用 **FastAPI** 構建的高效能後端應用程式，整合了 Auth0 身分驗證、Hasura GraphQL、RabbitMQ 訊息佇列等企業級技術。

## 📚 目錄

- [技術堆疊](#技術堆疊)
- [目錄結構](#目錄結構)
- [快速開始](#快速開始)
- [環境變數](#環境變數)
- [核心模組說明](#核心模組說明)
- [模組開發指南](#模組開發指南)
- [API 詳細文件](#api-詳細文件)
- [RabbitMQ 事件系統](#rabbitmq-事件系統)
- [Hasura 整合](#hasura-整合)
- [背景 Worker 說明](#背景-worker-說明)
- [測試指南](#測試指南)
- [部署指南](#部署指南)
- [疑難排解](#疑難排解)

## 🛠️ 技術堆疊

- **[FastAPI 0.118](https://fastapi.tiangolo.com/)** - 高效能的 Python Web 框架
- **[Uvicorn 0.37](https://www.uvicorn.org/)** - 非同步 ASGI 伺服器
- **[aio-pika 9.5](https://aio-pika.readthedocs.io/)** - 非同步 RabbitMQ 用戶端
- **[GQL 4.0](https://gql.readthedocs.io/)** - Python GraphQL 用戶端
- **[Pydantic 2.12](https://docs.pydantic.dev/)** - 資料驗證與序列化
- **[Loguru 0.7](https://loguru.readthedocs.io/)** - 現代化日誌系統
- **[python-dotenv 1.0](https://pypi.org/project/python-dotenv/)** - 環境變數管理

## 📁 目錄結構

```
backend/
├── main.py                    # FastAPI 應用主程式
├── consumer_worker.py         # RabbitMQ 背景 Worker
├── requirements.txt           # Python 相依套件
├── .env.example               # 環境變數範例
│
├── core/                      # 核心共用模組
│   ├── __init__.py
│   ├── config.py              # 設定檔管理（讀取環境變數）
│   ├── logger.py              # 日誌設定檔（Loguru）
│   ├── context.py             # 應用程式上下文（相依注入）
│   ├── rabbitmq.py            # RabbitMQ 連線與發布者
│   ├── hasura_client.py       # Hasura GraphQL 用戶端
│   ├── dependencies.py        # FastAPI 相依注入函式
│   └── consumer.py            # RabbitMQ 消費者基礎類別
│
└── modules/                   # 業務邏輯模組
    └── auth/                  # 身分驗證模組
        ├── __init__.py        # 模組初始化
        ├── router.py          # API 路由定義
        ├── schemas.py         # Pydantic 資料模型
        ├── services.py        # 業務邏輯實現
        └── consumer.py        # 事件消費者
```

## 🚀 快速開始

### 先決條件

- Python 3.11+
- PostgreSQL（透過 Hasura）
- RabbitMQ
- Hasura GraphQL Engine

（或使用專案提供的 Docker Compose 設定檔）

### 步驟 1：環境變數設定檔

```bash
cd backend
cp .env.example .env
```

編輯 `.env` 檔案：

```env
# Hasura 設定檔
HASURA_GRAPHQL_URL=http://localhost:8080/v1/graphql
HASURA_ADMIN_SECRET=your-hasura-admin-secret

# RabbitMQ 設定檔
RABBITMQ_URL=amqp://guest:guest@localhost:5672/

# Auth0 設定檔 (可選，用於 JWT 驗證)
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=your-api-audience

# Application 設定檔
LOG_LEVEL=INFO
```

### 步驟 2：安裝相依套件

```bash
# 使用 pip
pip install -r requirements.txt

# 或使用 uv (更快)
pip install uv
uv pip install -r requirements.txt
```

### 步驟 3：啟動相依服務

如果使用 Docker Compose：

```bash
# 從專案根目錄
docker-compose -f .devcontainer/docker-compose.yml up -d postgres hasura rabbitmq
```

### 步驟 4：啟動應用

#### 啟動 API 伺服器

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### 啟動背景 Worker（另一個終端）

```bash
python consumer_worker.py
```

### 步驟 5：驗證

- **API 文件**：http://localhost:8000/docs
- **健康檢查**：http://localhost:8000/health
- **Hasura Console**：http://localhost:8080

## 🔧 環境變數

### 必需變數

| 變數名稱              | 說明                | 預設值 | 範例                                |
| --------------------- | ------------------- | ------ | ----------------------------------- |
| `HASURA_GRAPHQL_URL`  | Hasura GraphQL 端點 | -      | `http://hasura:8080/v1/graphql`     |
| `HASURA_ADMIN_SECRET` | Hasura 管理員密鑰   | -      | `myadminsecret`                     |
| `RABBITMQ_URL`        | RabbitMQ 連線 URL   | -      | `amqp://guest:guest@rabbitmq:5672/` |

### 可選變數

| 變數名稱         | 說明               | 預設值    |
| ---------------- | ------------------ | --------- |
| `AUTH0_DOMAIN`   | Auth0 租戶域名     | -         |
| `AUTH0_AUDIENCE` | Auth0 API Audience | -         |
| `LOG_LEVEL`      | 日誌級別           | `INFO`    |
| `API_HOST`       | API 伺服器主機     | `0.0.0.0` |
| `API_PORT`       | API 伺服器連接埠   | `8000`    |

### 在程式碼中使用

```python
from core.config import config

# 存取設定檔
hasura_url = config.HASURA_GRAPHQL_URL
rabbitmq_url = config.RABBITMQ_URL
log_level = config.LOG_LEVEL
```

## 🧩 核心模組說明

### 1. `config.py` - 設定檔管理

**職責**：載入和管理環境變數

```python
from core.config import config

# 存取設定檔值
print(config.HASURA_GRAPHQL_URL)
print(config.RABBITMQ_URL)
```

**特性**：

- 自動從 `.env` 檔案載入環境變數
- 類型驗證
- 預設值處理

### 2. `logger.py` - 日誌系統

**職責**：設定檔和提供日誌記錄器

```python
from core.logger import logger

# 記錄不同級別的日誌
logger.debug("Debug message")
logger.info("Info message")
logger.warning("Warning message")
logger.error("Error message")
logger.critical("Critical message")

# 記錄異常
try:
    # 一些操作
    pass
except Exception as e:
    logger.exception("An error occurred")
```

**特性**：

- 彩色主控台輸出
- 日誌輪轉
- 結構化日誌
- 異常追蹤

### 3. `context.py` - 應用程式上下文

**職責**：提供共享資源的存取介面

```python
from core.context import AppContext

# 在路由中使用
@router.get("/data")
async def get_data(ctx: AppContext = Depends(get_context)):
    # 存取 Hasura
    result = await ctx.hasura_client.execute(query)

    # 發布 RabbitMQ 訊息
    await ctx.rabbitmq_producer.publish(topic="event", data={})

    # 使用日誌
    ctx.logger.info("Data retrieved")

    return result
```

**包含資源**：

- `hasura_client` - Hasura GraphQL 用戶端
- `rabbitmq_producer` - RabbitMQ 發布者
- `logger` - 日誌記錄器

### 4. `rabbitmq.py` - RabbitMQ 用戶端

**職責**：管理 RabbitMQ 連線和訊息發布

#### 發布者 (Producer)

```python
from core.rabbitmq import RabbitMQProducer

producer = RabbitMQProducer(rabbitmq_url)
await producer.connect()

# 發布訊息
await producer.publish(
    topic="user.created",
    data={
        "user_id": "123",
        "email": "user@example.com",
        "timestamp": "2024-01-01T00:00:00Z"
    }
)

await producer.close()
```

#### 消費者 (Consumer)

```python
from core.rabbitmq import RabbitMQConsumer

async def message_handler(data: dict):
    print(f"Received: {data}")

consumer = RabbitMQConsumer(rabbitmq_url)
await consumer.connect()
await consumer.subscribe("user.created", message_handler)
```

**特性**：

- 自動重連
- 訊息持久化
- 錯誤處理
- 主題路由

### 5. `hasura_client.py` - Hasura GraphQL 用戶端

**職責**：與 Hasura GraphQL API 互動

#### 查詢 (Query)

```python
from core.hasura_client import HasuraClient

client = HasuraClient(
    url=config.HASURA_GRAPHQL_URL,
    admin_secret=config.HASURA_ADMIN_SECRET
)

# 執行查詢
query = """
query GetUsers {
    users(limit: 10) {
        id
        name
        email
    }
}
"""
result = await client.execute(query)
users = result["users"]
```

#### 變異 (Mutation)

```python
mutation = """
mutation CreateUser($name: String!, $email: String!) {
    insert_users_one(object: {name: $name, email: $email}) {
        id
        name
        email
        created_at
    }
}
"""
variables = {"name": "John Doe", "email": "john@example.com"}
result = await client.execute(mutation, variables)
new_user = result["insert_users_one"]
```

**特性**：

- 自動認證（使用 Admin Secret）
- 錯誤處理
- 支援變數
- 支援訂閱 (Subscriptions)

### 6. `dependencies.py` - FastAPI 相依注入

**職責**：提供 FastAPI 路由的相依注入

```python
from fastapi import Depends
from core.dependencies import get_context
from core.context import AppContext

@router.get("/endpoint")
async def my_endpoint(ctx: AppContext = Depends(get_context)):
    # ctx 包含所有共享資源
    result = await ctx.hasura_client.execute(query)
    return result
```

## 🧩 模組開發指南

請參閱詳細的 [模組開發指南](modules/README.md)，了解：

- 模組標準結構
- 如何建立新模組（9 步驟指南）
- 檔案職責說明（router、schemas、services、consumer）
- 模組間相依管理
- 最佳實踐和範例程式碼

### 快速建立新模組

```bash
# 1. 建立模組目錄
cd backend/modules
mkdir my_module
cd my_module

# 2. 建立必需檔案
touch __init__.py router.py schemas.py services.py

# 3. （可選）建立消費者
touch consumer.py
```

詳細步驟請參閱 [modules/README.md](modules/README.md)。

## 📖 API 詳細文件

### 主要端點

#### 1. 根端點

**GET /**

**說明**：API 根端點，返回歡迎訊息

**回應**：

```json
{
  "message": "Welcome to the API"
}
```

#### 2. 健康檢查

**GET /health**

**說明**：檢查 API 伺服器健康狀態

**回應**：

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### 3. Auth0 JWT Claim

**POST /api/auth/auth0/jwt_claim**

**說明**：處理 Auth0 JWT 驗證和使用者資訊

**請求頭**：

```
Authorization: Bearer <jwt_token>
```

**請求體**：

```json
{
  "user_id": "auth0|123456",
  "email": "user@example.com",
  "name": "John Doe"
}
```

**回應**：

```json
{
  "success": true,
  "user": {
    "id": "auth0|123456",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**錯誤回應**：

```json
{
  "detail": "Invalid token"
}
```

### API 文件

啟動應用後，造訪自動生成的 API 文件：

- **Swagger UI**：http://localhost:8000/docs
- **ReDoc**：http://localhost:8000/redoc
- **OpenAPI JSON**：http://localhost:8000/openapi.json

## 🔔 RabbitMQ 事件系統

### 事件命名規範

建議使用以下格式：`<module>.<entity>.<action>`

範例：

- `auth.user.created` - 使用者建立事件
- `auth.user.updated` - 使用者更新事件
- `notification.email.sent` - Email 發送事件
- `order.payment.completed` - 支付完成事件

### 發布事件

在任何路由或服務中：

```python
from core.dependencies import get_context
from core.context import AppContext

@router.post("/create-user")
async def create_user(user_data: dict, ctx: AppContext = Depends(get_context)):
    # 建立使用者邏輯...

    # 發布事件
    await ctx.rabbitmq_producer.publish(
        topic="auth.user.created",
        data={
            "user_id": user.id,
            "email": user.email,
            "timestamp": str(datetime.utcnow())
        }
    )

    return {"success": True}
```

### 消費事件

#### 步驟 1：建立消費者函式

在 `modules/my_module/consumer.py` 中：

```python
from core.logger import logger
from core.context import AppContext

async def handle_user_created(data: dict, ctx: AppContext):
    """處理使用者建立事件"""
    logger.info(f"User created event received: {data}")

    user_id = data.get("user_id")

    # 執行業務邏輯（例如發送歡迎郵件）
    mutation = """
    mutation SendWelcomeEmail($user_id: String!) {
        insert_emails_one(object: {
            user_id: $user_id,
            type: "welcome",
            status: "pending"
        }) {
            id
        }
    }
    """
    await ctx.hasura_client.execute(mutation, {"user_id": user_id})

    logger.info(f"Welcome email queued for user: {user_id}")
```

#### 步驟 2：註冊消費者

在 `consumer_worker.py` 中：

```python
from modules.my_module.consumer import handle_user_created

# 註冊事件處理器
consumer.register("auth.user.created", handle_user_created)
```

### 事件列表

| 事件主題            | 觸發時機       | 資料結構                 |
| ------------------- | -------------- | ------------------------ |
| `auth.user.created` | 新使用者註冊   | `{user_id, email, name}` |
| `auth.user.updated` | 使用者資訊更新 | `{user_id, changes}`     |
| `auth.user.deleted` | 使用者刪除     | `{user_id}`              |

## 🔗 Hasura 整合

### GraphQL 查詢範例

#### 查詢使用者列表

```python
query = """
query GetUsers($limit: Int!, $offset: Int!) {
    users(limit: $limit, offset: $offset, order_by: {created_at: desc}) {
        id
        name
        email
        created_at
    }
}
"""
variables = {"limit": 10, "offset": 0}
result = await ctx.hasura_client.execute(query, variables)
```

#### 查詢單一使用者

```python
query = """
query GetUser($id: String!) {
    users_by_pk(id: $id) {
        id
        name
        email
        profile {
            bio
            avatar_url
        }
    }
}
"""
variables = {"id": "user_123"}
result = await ctx.hasura_client.execute(query, variables)
```

#### 建立使用者

```python
mutation = """
mutation CreateUser($object: users_insert_input!) {
    insert_users_one(object: $object) {
        id
        name
        email
        created_at
    }
}
"""
variables = {
    "object": {
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
    }
}
result = await ctx.hasura_client.execute(mutation, variables)
```

#### 更新使用者

```python
mutation = """
mutation UpdateUser($id: String!, $changes: users_set_input!) {
    update_users_by_pk(pk_columns: {id: $id}, _set: $changes) {
        id
        name
        email
        updated_at
    }
}
"""
variables = {
    "id": "user_123",
    "changes": {"name": "Jane Doe"}
}
result = await ctx.hasura_client.execute(mutation, variables)
```

### 認證流程

Hasura 使用 JWT 進行認證。應用程式使用 Admin Secret 進行管理操作。

```python
# HasuraClient 自動添加認證頭
client = HasuraClient(
    url=config.HASURA_GRAPHQL_URL,
    admin_secret=config.HASURA_ADMIN_SECRET
)

# 所有請求都會包含 x-hasura-admin-secret 頭
result = await client.execute(query)
```

## ⚙️ 背景 Worker 說明

### Worker 架構

`consumer_worker.py` 是一個獨立的背景程序，負責：

1. 連線到 RabbitMQ
2. 監聽指定的事件主題
3. 處理接收到的訊息
4. 執行非同步任務

### 啟動 Worker

```bash
python consumer_worker.py
```

### Worker 生命週期

```python
# consumer_worker.py 簡化版本

import asyncio
from core.config import config
from core.consumer import Consumer
from modules.auth.consumer import handle_user_created

async def main():
    # 初始化消費者
    consumer = Consumer(rabbitmq_url=config.RABBITMQ_URL)

    # 註冊事件處理器
    consumer.register("auth.user.created", handle_user_created)

    # 啟動消費者
    await consumer.start()

    # 保持運行
    await asyncio.Event().wait()

if __name__ == "__main__":
    asyncio.run(main())
```

### 監控 Worker

#### 查看日誌

```bash
tail -f logs/consumer_worker.log
```

#### 檢查 RabbitMQ 狀態

造訪 RabbitMQ Management UI：http://localhost:15672

- 用戶名：`guest`
- 密碼：`guest`

### 故障恢復

Worker 具有自動重連功能。如果 RabbitMQ 連線中斷，Worker 會自動嘗試重新連線。

## 🧪 測試指南

### 單元測試

```bash
# 安裝測試相依套件
pip install pytest pytest-asyncio httpx

# 運行測試
pytest tests/ -v
```

### 測試範例

```python
# tests/test_auth.py
import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

@pytest.mark.asyncio
async def test_auth_jwt_claim():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/auth/auth0/jwt_claim",
            json={"user_id": "test_123", "email": "test@example.com"}
        )
        assert response.status_code == 200
```

### 整合測試

```bash
# 啟動測試環境
docker-compose -f docker-compose.test.yml up -d

# 運行集成測試
pytest tests/integration/ -v

# 清理
docker-compose -f docker-compose.test.yml down
```

## 📦 部署指南

### Docker 化

#### 建立 Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### 建置映像檔

```bash
docker build -t my-app-backend:latest .
```

#### 運行容器

```bash
docker run -d \
  --name backend \
  -p 8000:8000 \
  --env-file .env \
  my-app-backend:latest
```

### 生產部署

詳細的部署指南請參閱 [docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md)。

## 🐛 疑難排解

### 常見問題

#### 1. RabbitMQ 連接失敗

**症狀**：

```
ERROR | Failed to connect to RabbitMQ
```

**解決方案**：

- 檢查 RabbitMQ 是否正在運行：`docker ps | grep rabbitmq`
- 驗證 `RABBITMQ_URL` 環境變數是否正確
- 檢查網路連線：`telnet localhost 5672`

#### 2. Hasura 認證失敗

**症狀**：

```
ERROR | Hasura authentication failed
```

**解決方案**：

- 確認 `HASURA_ADMIN_SECRET` 與 Hasura 設定檔一致
- 檢查 `HASURA_GRAPHQL_URL` 是否正確
- 造訪 Hasura Console 驗證：http://localhost:8080

#### 3. 模組導入錯誤

**症狀**：

```
ModuleNotFoundError: No module named 'core'
```

**解決方案**：

- 確保從 `backend/` 目錄運行應用
- 檢查 Python 路徑：
  ```bash
  export PYTHONPATH="${PYTHONPATH}:$(pwd)"
  ```

#### 4. FastAPI 啟動失敗

**症狀**：

- `uvicorn` 命令失敗
- 連接埠被佔用
- 相依套件錯誤

**解決方案**：

**檢查連接埠**：

```bash
# 檢查連接埠 8000 是否被佔用
lsof -i :8000

# 或使用
netstat -an | grep 8000
```

**更換連接埠**：

```bash
uvicorn main:app --port 8001
```

**檢查相依套件**：

```bash
pip check
# 檢查相依套件衝突

pip install --upgrade -r requirements.txt
# 更新相依套件
```

**啟用詳細日誌**：

```bash
uvicorn main:app --log-level debug
```

#### 5. Consumer Worker 不處理事件

**症狀**：

- Worker 啟動成功但不處理訊息
- RabbitMQ 中有訊息但未被消費

**解決方案**：

**檢查 Consumer 註冊**：

```python
# consumer_worker.py
from modules.auth.consumer import handle_user_created

consumer.register("auth.user.created", handle_user_created)

print("Registered consumers:", consumer.topics)
```

**檢查訊息路由**：

```bash
# 造訪 RabbitMQ Management UI
open http://localhost:15672

# 查看 Queues 標籤
# 確認訊息是否進入正確的佇列
```

**測試事件發布**：

```python
# 在 Python 交互式環境中
from core.rabbitmq import RabbitMQProducer
import asyncio

async def test():
    producer = RabbitMQProducer("amqp://guest:guest@localhost:5672/")
    await producer.connect()
    await producer.publish("auth.user.created", {"test": "data"})
    await producer.close()

asyncio.run(test())
```

**查看 Worker 日誌**：

```bash
python consumer_worker.py
# 觀察日誌輸出
```

### 日誌分析

查看詳細日誌：

```bash
# 查看最近的日誌
tail -f logs/app.log

# 搜尋錯誤
grep ERROR logs/app.log

# 搜尋特定使用者的日誌
grep "user_123" logs/app.log
```

## 📚 更多資源

- [FastAPI 官方文件](https://fastapi.tiangolo.com/)
- [Pydantic 文件](https://docs.pydantic.dev/)
- [aio-pika 文件](https://aio-pika.readthedocs.io/)
- [Hasura 文件](https://hasura.io/docs/)
- [RabbitMQ 教學](https://www.rabbitmq.com/getstarted.html)

## 🤝 需要幫助？

- 查看 [模組開發指南](modules/README.md)
- 參閱 [API 文件](../docs/API.md)
- 閱讀 [架構設計](../docs/ARCHITECTURE.md)
- 查看 [疑難排解指南](../docs/TROUBLESHOOTING.md)

---

**Happy Coding! 🚀**
