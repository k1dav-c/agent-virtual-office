# Backend Modules 說明

這個目錄包含應用程式的業務邏輯模組，每個模組代表一個獨立的功能領域。模組化的架構使得程式碼更易於維護、測試和擴充。

## 📚 目錄

- [現有模組](#現有模組)
- [模組標準結構](#模組標準結構)
- [檔案職責說明](#檔案職責說明)
- [如何建立新模組](#如何建立新模組)
- [模組間相依性管理](#模組間相依性管理)
- [最佳實踐](#最佳實踐)
- [範例程式碼](#範例程式碼)

## 📦 現有模組

### `/auth` - 身分驗證模組

**功能**：處理使用者身分驗證相關的業務邏輯

**包含功能**：

- Auth0 JWT 驗證
- 使用者資訊處理
- 權限管理
- Auth0 Webhook 事件處理

**主要端點**：

- `POST /api/auth/auth0/jwt_claim` - 處理 Auth0 JWT Claims

**事件消費**：

- `auth.user.created` - 處理新使用者創建事件
- `auth.user.updated` - 處理使用者資訊更新事件

## 🏗️ 模組標準結構

每個模組都應該遵循以下標準結構：

```
modules/
└── my_module/                    # 模組目錄（使用 snake_case 命名）
    ├── __init__.py               # 模組初始化，導出 router
    ├── router.py                 # FastAPI 路由定義
    ├── schemas.py                # Pydantic 資料模型
    ├── services.py               # 業務邏輯與服務層
    └── consumer.py               # RabbitMQ 事件消費者（可選）
```

### 必需檔案

| 檔案          | 必需    | 說明                     |
| ------------- | ------- | ------------------------ |
| `__init__.py` | ✅ 是   | 模組初始化，導出 router  |
| `router.py`   | ✅ 是   | 定義 HTTP API 端點       |
| `schemas.py`  | ✅ 是   | Pydantic 數據模型定義    |
| `services.py` | ✅ 是   | 業務邏輯實現             |
| `consumer.py` | ⚠️ 可選 | 非同步事件處理（如需要） |

## 📝 檔案職責說明

### 1. `__init__.py` - 模組初始化

**職責**：

- 導出模組的 router，使其可以在 `main.py` 中註冊
- 可選：導出常用的類別或函式

**範例**：

```python
"""
My Module - 模組說明

這個模組負責處理 XXX 功能。
"""
from .router import router

__all__ = ["router"]
```

### 2. `router.py` - API 路由定義

**職責**：

- 定義 HTTP 端點（GET, POST, PUT, DELETE 等）
- 處理請求驗證（透過 Pydantic schemas）
- 調用 services 層處理業務邏輯
- 返回格式化的響應

**關鍵要點**：

- 使用 FastAPI 的 `APIRouter`
- 使用依賴注入 (`Depends`) 取得 `AppContext`
- 定義清晰的端點路徑和 HTTP 方法
- 使用 Pydantic 模型進行請求/響應驗證
- 添加適當的文檔字串和標籤

**範例**：

```python
from fastapi import APIRouter, Depends, HTTPException, status
from core.dependencies import get_context
from core.context import AppContext
from .schemas import MyRequest, MyResponse
from .services import MyService

router = APIRouter()

@router.post("/action", response_model=MyResponse, status_code=status.HTTP_200_OK)
async def perform_action(
    request: MyRequest,
    ctx: AppContext = Depends(get_context)
):
    """
    執行某個操作

    - **field1**: 第一個欄位說明
    - **field2**: 第二個欄位說明
    """
    try:
        result = await MyService.process(request, ctx)
        return MyResponse(success=True, data=result)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/status", response_model=dict)
async def get_status(ctx: AppContext = Depends(get_context)):
    """取得模組狀態"""
    return {"status": "operational", "module": "my_module"}
```

### 3. `schemas.py` - 資料模型

**職責**：

- 定義 API 請求/回應的資料結構
- 數據驗證規則
- 類型註解
- 預設值設定

**關鍵要點**：

- 使用 Pydantic 的 `BaseModel`
- 添加欄位驗證（`Field`）
- 提供清晰的類別名稱（例如：`CreateUserRequest`, `UserResponse`）
- 使用 `Config` 設定模型行為

**範例**：

```python
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime

class MyRequest(BaseModel):
    """處理操作的請求模型"""
    field1: str = Field(..., min_length=1, max_length=100, description="欄位 1 說明")
    field2: int = Field(..., ge=0, le=100, description="欄位 2 必須在 0-100 之間")
    field3: Optional[str] = Field(None, description="可選欄位")

    class Config:
        json_schema_extra = {
            "example": {
                "field1": "example value",
                "field2": 42,
                "field3": "optional value"
            }
        }

class MyResponse(BaseModel):
    """操作的響應模型"""
    success: bool = Field(..., description="操作是否成功")
    message: str = Field(default="", description="回應訊息")
    data: Optional[dict] = Field(None, description="回應資料")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class MyEntity(BaseModel):
    """資料實體模型"""
    id: str
    name: str
    email: EmailStr
    created_at: datetime
    updated_at: Optional[datetime] = None
```

### 4. `services.py` - 業務邏輯層

**職責**：

- 實現核心業務邏輯
- 與 Hasura GraphQL 互動
- 發布 RabbitMQ 事件
- 複雜的資料處理和計算

**關鍵要點**：

- 將複雜邏輯從 router 中分離
- 使用類別或函式組織程式碼
- 透過 `AppContext` 訪問共享資源（Hasura, RabbitMQ, Logger）
- 處理業務異常並返回有意義的錯誤訊息

**範例**：

```python
from core.context import AppContext
from core.logger import logger
from .schemas import MyRequest, MyEntity
from typing import Dict, List

class MyService:
    """My Module 的服務層"""

    @staticmethod
    async def process(request: MyRequest, ctx: AppContext) -> Dict:
        """
        處理業務邏輯

        Args:
            request: 請求資料
            ctx: 應用程式上下文

        Returns:
            處理結果字典

        Raises:
            ValueError: 當輸入資料無效時
        """
        logger.info(f"Processing request: {request.field1}")

        # 1. 驗證業務規則
        if request.field2 > 50:
            logger.warning(f"Field2 value too high: {request.field2}")

        # 2. 查詢 Hasura
        query = """
        query GetEntity($id: String!) {
            my_entities(where: {id: {_eq: $id}}) {
                id
                name
                created_at
            }
        }
        """
        variables = {"id": request.field1}
        result = await ctx.hasura_client.execute(query, variables)

        # 3. 處理資料
        entities = result.get("my_entities", [])
        if not entities:
            raise ValueError(f"Entity not found: {request.field1}")

        # 4. 發布事件到 RabbitMQ
        await ctx.rabbitmq_producer.publish(
            topic="my_module.action.completed",
            data={
                "entity_id": request.field1,
                "field2": request.field2,
                "timestamp": str(datetime.utcnow())
            }
        )

        logger.info(f"Action completed for entity: {request.field1}")

        return {
            "entity": entities[0],
            "processed_value": request.field2 * 2
        }

    @staticmethod
    async def get_entities(ctx: AppContext) -> List[MyEntity]:
        """取得所有實體列表"""
        query = """
        query GetAllEntities {
            my_entities(order_by: {created_at: desc}) {
                id
                name
                email
                created_at
                updated_at
            }
        }
        """
        result = await ctx.hasura_client.execute(query)
        entities = result.get("my_entities", [])

        return [MyEntity(**entity) for entity in entities]
```

### 5. `consumer.py` - 事件消費者（可選）

**職責**：

- 監聽並處理 RabbitMQ 事件
- 執行非同步背景任務
- 處理跨模組的事件通知

**關鍵要點**：

- 使用裝飾器註冊消費者
- 定義清晰的事件主題名稱（建議格式：`module.entity.action`）
- 處理異常，避免消費者崩潰
- 記錄詳細的日誌

**範例**：

```python
from core.logger import logger
from core.context import AppContext
from typing import Dict

async def handle_entity_created(data: Dict, ctx: AppContext):
    """
    處理實體創建事件

    Args:
        data: 事件資料
        ctx: 應用程式上下文
    """
    try:
        logger.info(f"Handling entity created event: {data}")

        entity_id = data.get("entity_id")
        if not entity_id:
            logger.error("Missing entity_id in event data")
            return

        # 執行業務邏輯
        mutation = """
        mutation UpdateEntity($id: String!, $processed: Boolean!) {
            update_my_entities(
                where: {id: {_eq: $id}},
                _set: {processed: $processed}
            ) {
                affected_rows
            }
        }
        """
        variables = {"id": entity_id, "processed": True}
        await ctx.hasura_client.execute(mutation, variables)

        logger.info(f"Entity processed successfully: {entity_id}")

    except Exception as e:
        logger.error(f"Error handling entity created event: {str(e)}")
        # 不要重新拋出異常，避免消費者崩潰

async def handle_entity_updated(data: Dict, ctx: AppContext):
    """處理實體更新事件"""
    logger.info(f"Handling entity updated event: {data}")
    # ... 實現邏輯
```

**註冊消費者**（在 `consumer_worker.py` 中）：

```python
from core.consumer import Consumer
from modules.my_module.consumer import handle_entity_created, handle_entity_updated

# 註冊事件處理器
consumer = Consumer(rabbitmq_url=config.RABBITMQ_URL)
consumer.register("my_module.entity.created", handle_entity_created)
consumer.register("my_module.entity.updated", handle_entity_updated)
```

## 🚀 如何建立新模組

### 完整步驟指南

#### 步驟 1：規劃模組

在開始編碼前，先明確：

- 模組名稱（使用 snake_case，例如：`user_management`）
- 功能範圍
- 需要的 API 端點
- 是否需要事件處理

#### 步驟 2：創建模組目錄結構

```bash
cd backend/modules

# 創建模組目錄
mkdir my_module

# 創建必需文件
cd my_module
touch __init__.py router.py schemas.py services.py

# 如需事件處理，創建 consumer.py
touch consumer.py
```

#### 步驟 3：定義數據模型 (`schemas.py`)

先定義 API 的輸入/輸出格式：

```python
from pydantic import BaseModel, Field
from typing import Optional

class CreateEntityRequest(BaseModel):
    """創建實體的請求"""
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None

class EntityResponse(BaseModel):
    """實體回應"""
    id: str
    name: str
    description: Optional[str]
    created_at: str
```

#### 步驟 4：實現業務邏輯 (`services.py`)

```python
from core.context import AppContext
from core.logger import logger
from .schemas import CreateEntityRequest

class MyModuleService:
    @staticmethod
    async def create_entity(request: CreateEntityRequest, ctx: AppContext):
        """創建新實體"""
        logger.info(f"Creating entity: {request.name}")

        # Hasura mutation
        mutation = """
        mutation CreateEntity($name: String!, $description: String) {
            insert_my_entities_one(object: {
                name: $name,
                description: $description
            }) {
                id
                name
                description
                created_at
            }
        }
        """
        variables = {
            "name": request.name,
            "description": request.description
        }

        result = await ctx.hasura_client.execute(mutation, variables)
        entity = result.get("insert_my_entities_one")

        # 發布事件
        await ctx.rabbitmq_producer.publish(
            topic="my_module.entity.created",
            data={"entity_id": entity["id"], "name": entity["name"]}
        )

        return entity
```

#### 步驟 5：定義路由 (`router.py`)

```python
from fastapi import APIRouter, Depends, HTTPException, status
from core.dependencies import get_context
from core.context import AppContext
from .schemas import CreateEntityRequest, EntityResponse
from .services import MyModuleService

router = APIRouter()

@router.post("/entities", response_model=EntityResponse, status_code=status.HTTP_201_CREATED)
async def create_entity(
    request: CreateEntityRequest,
    ctx: AppContext = Depends(get_context)
):
    """創建新實體"""
    try:
        entity = await MyModuleService.create_entity(request, ctx)
        return EntityResponse(**entity)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
```

#### 步驟 6：初始化模組 (`__init__.py`)

```python
"""
My Module - 模組說明

這個模組負責管理實體的創建、更新和刪除。
"""
from .router import router

__all__ = ["router"]
```

#### 步驟 7：在主應用中註冊模組

編輯 `backend/main.py`：

```python
from fastapi import FastAPI
from modules.my_module import router as my_module_router

app = FastAPI(title="My Application")

# 註冊模組路由
app.include_router(
    my_module_router,
    prefix="/api/my_module",
    tags=["My Module"]
)
```

#### 步驟 8：（可選）添加事件消費者

如果需要處理非同步事件，創建 `consumer.py`：

```python
from core.logger import logger
from core.context import AppContext

async def handle_entity_created(data: dict, ctx: AppContext):
    """處理實體創建事件"""
    logger.info(f"Entity created: {data}")
    # 實現處理邏輯
```

然後在 `consumer_worker.py` 中註冊：

```python
from modules.my_module.consumer import handle_entity_created

consumer.register("my_module.entity.created", handle_entity_created)
```

#### 步驟 9：測試模組

啟動應用並測試新端點：

```bash
# 啟動 API 伺服器
python main.py

# 在另一個終端測試
curl -X POST http://localhost:8000/api/my_module/entities \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Entity", "description": "Test description"}'
```

訪問 API 文檔：http://localhost:8000/docs

## 🔗 模組間相依性管理

### 原則

1. **最小化相依性**：模組應該盡可能獨立
2. **透過事件通訊**：使用 RabbitMQ 事件進行跨模組通訊
3. **共享資料透過 Hasura**：避免直接調用其他模組的服務層

### 跨模組通訊範例

**錯誤做法**（直接導入）：

```python
# ❌ 不推薦：直接導入其他模組的服務
from modules.other_module.services import OtherService

async def my_function():
    result = await OtherService.do_something()
```

**正確做法**（事件驅動）：

```python
# ✅ 推薦：使用事件通訊
async def my_function(ctx: AppContext):
    # 發布事件
    await ctx.rabbitmq_producer.publish(
        topic="other_module.action.requested",
        data={"param": "value"}
    )

    # 或者直接查詢 Hasura（如果只需要資料）
    query = """
    query GetData {
        other_module_data {
            id
            value
        }
    }
    """
    result = await ctx.hasura_client.execute(query)
```

## ✅ 最佳實踐

### 1. 命名規範

- **模組名稱**：`snake_case`（例如：`user_management`, `notification_service`）
- **類別名稱**：`PascalCase`（例如：`UserService`, `NotificationHandler`）
- **函式名稱**：`snake_case`（例如：`get_user`, `send_notification`）
- **常數**：`UPPER_SNAKE_CASE`（例如：`MAX_RETRIES`, `DEFAULT_TIMEOUT`）

### 2. 錯誤處理

```python
from fastapi import HTTPException, status
from core.logger import logger

@router.post("/action")
async def perform_action(request: MyRequest, ctx: AppContext = Depends(get_context)):
    try:
        result = await MyService.process(request, ctx)
        return {"success": True, "data": result}
    except ValueError as e:
        # 業務邏輯錯誤（400）
        logger.warning(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        # 未預期的錯誤（500）
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )
```

### 3. 日誌記錄

```python
from core.logger import logger

# 記錄資訊
logger.info(f"Processing request for user: {user_id}")

# 記錄警告
logger.warning(f"Rate limit approaching for user: {user_id}")

# 記錄錯誤（包含堆疊追蹤）
logger.error(f"Failed to process request: {str(e)}", exc_info=True)

# 記錄除錯資訊（僅在開發環境）
logger.debug(f"Request payload: {request.dict()}")
```

### 4. 資料驗證

```python
from pydantic import BaseModel, Field, validator

class MyRequest(BaseModel):
    email: str = Field(..., description="使用者 email")
    age: int = Field(..., ge=0, le=150, description="年齡")

    @validator('email')
    def validate_email(cls, v):
        if '@' not in v:
            raise ValueError('Invalid email format')
        return v.lower()

    @validator('age')
    def validate_age(cls, v):
        if v < 18:
            raise ValueError('User must be at least 18 years old')
        return v
```

### 5. 非同步處理

```python
# 使用 async/await
async def process_data(ctx: AppContext):
    # 並行執行多個查詢
    import asyncio

    results = await asyncio.gather(
        ctx.hasura_client.execute(query1),
        ctx.hasura_client.execute(query2),
        ctx.hasura_client.execute(query3),
    )

    return results
```

### 6. 文檔與類型提示

```python
from typing import List, Dict, Optional

async def get_entities(
    ctx: AppContext,
    limit: int = 10,
    offset: int = 0
) -> List[Dict]:
    """
    取得實體列表

    Args:
        ctx: 應用程式上下文
        limit: 返回的最大數量（預設 10）
        offset: 跳過的數量（預設 0）

    Returns:
        實體列表

    Raises:
        ValueError: 當 limit 或 offset 無效時
    """
    if limit < 0 or offset < 0:
        raise ValueError("limit and offset must be non-negative")

    # ... 實現
```

## 📋 檢查清單

創建新模組時，確保完成以下項目：

- [ ] 模組目錄結構正確（包含所有必需文件）
- [ ] `schemas.py` 定義了所有請求/響應模型
- [ ] `services.py` 實現了業務邏輯
- [ ] `router.py` 定義了 API 端點
- [ ] `__init__.py` 導出了 router
- [ ] 在 `main.py` 中註冊了模組路由
- [ ] 添加了適當的錯誤處理
- [ ] 添加了日誌記錄
- [ ] 添加了文檔字串
- [ ] 如需事件處理，創建並註冊了消費者
- [ ] 測試了所有端點
- [ ] 更新了本 README（如有新模組）

## 🤝 需要幫助？

- 查看 [backend/README.md](../README.md) 了解後端整體架構
- 參考現有的 `auth` 模組作為範例
- 查看 [API 文檔](../../docs/API.md) 了解 API 規範
- 閱讀 [架構設計](../../docs/ARCHITECTURE.md) 理解系統設計

---

**Happy Coding! 🚀**
