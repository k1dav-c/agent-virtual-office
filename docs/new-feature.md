# 新增功能流程（以 Model Endpoints 為例）

本文件紀錄在 PrivStudio 中新增一個完整 CRUD 功能的標準流程。

**架構原則**：CRUD 操作由前端直接透過 Hasura GraphQL 執行（Hasura 負責權限控管）。後端僅處理需要 server-side 執行的邏輯（如 proxy 外部 API 避免 CORS）。

---

## 1. Hasura — 資料庫 & Metadata

### 1.1 建立 Migration

在 `hasura/migrations/default/` 下建立以 timestamp 開頭的資料夾：

```
hasura/migrations/default/<timestamp>_create_<table_name>/
├── up.sql
└── down.sql
```

**up.sql** — 建表、索引、註解：

```sql
CREATE TABLE public.<table_name> (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     varchar NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  -- 業務欄位 ...
  is_active   bool NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_<table_name>_user_id ON public.<table_name>(user_id);

COMMENT ON TABLE public.<table_name> IS '<表格用途說明>';
COMMENT ON COLUMN public.<table_name>.<column> IS '<欄位用途說明>';
```

> **注意**：所有 table 和業務欄位都必須加上 `COMMENT`，方便後續維護與理解。

**down.sql** — 回滾：

```sql
DROP TABLE IF EXISTS public.<table_name>;
```

### 1.2 建立 Metadata

在 `hasura/metadata/databases/default/tables/` 下新增 YAML：

**`public_<table_name>.yaml`**：

- 宣告 table tracking
- 定義 `object_relationships`（如 `user`）
- 設定 `user` role 的 select / insert / update / delete permissions
- 所有權限用 `user_id: { _eq: X-Hasura-User-Id }` 過濾
- insert 時 `set: { user_id: x-hasura-user-id }` 自動填入

**`tables.yaml`** — 加入 include：

```yaml
- "!include public_<table_name>.yaml"
```

**`public_users.yaml`** — 加入 array relationship：

```yaml
array_relationships:
  - name: <table_name>
    using:
      foreign_key_constraint_on:
        column: user_id
        table:
          name: <table_name>
          schema: public
```

### 1.3 套用

```bash
hasura migrate apply
hasura metadata apply
```

---

## 2. Frontend — React Page（含 GraphQL CRUD）

CRUD 操作由前端直接呼叫 Hasura GraphQL，使用 `createAuthenticatedHasuraClient`。

### 2.1 定義 GraphQL Operations

在頁面元件中直接定義 query/mutation 字串：

```ts
import { createAuthenticatedHasuraClient } from "@lib/graphql-client";

const LIST_QUERY = `
  query List {
    <table_name>(order_by: { created_at: desc }) {
      id
      ...fields
    }
  }
`;

const INSERT_MUTATION = `
  mutation Insert($object: <table_name>_insert_input!) {
    insert_<table_name>_one(object: $object) { id }
  }
`;

const UPDATE_MUTATION = `
  mutation Update($id: uuid!, $set: <table_name>_set_input!) {
    update_<table_name>_by_pk(pk_columns: { id: $id }, _set: $set) { id }
  }
`;

const DELETE_MUTATION = `
  mutation Delete($id: uuid!) {
    delete_<table_name>_by_pk(id: $id) { id }
  }
`;
```

### 2.2 使用方式

```ts
const gql = await createAuthenticatedHasuraClient(getIdTokenClaims);

// List
const data = await gql.request<{ <table_name>: Entity[] }>(LIST_QUERY);

// Insert（user_id 由 Hasura permission 自動填入，不需傳）
await gql.request(INSERT_MUTATION, { object: { field1, field2 } });

// Update
await gql.request(UPDATE_MUTATION, { id, set: { field1: newValue } });

// Delete
await gql.request(DELETE_MUTATION, { id });
```

### 2.3 建立頁面

在 `frontend/src/pages/` 下建立 `<Entity>Page.tsx`：

- 使用 `createAuthenticatedHasuraClient` 做 CRUD（直接打 Hasura）
- 若需要 server-side proxy（如呼叫外部 API 避免 CORS），才用 `createAuthenticatedApiClient`
- 表格列出資料，搭配 Edit / Delete 操作
- Modal 表單處理新增 / 編輯
- 遵循設計 tokens：`#527a4a`（主色）、`#e5e5e5`（邊框）、`#f7f7f7`（背景）、`#1a1a1a`（文字）

### 2.4 加入路由

**`frontend/src/App.tsx`**：

```tsx
import <Entity>Page from "./pages/<Entity>Page";

<Route
  path="/<path>"
  element={
    <ProtectedRoute>
      <MainLayout>
        <<Entity>Page />
      </MainLayout>
    </ProtectedRoute>
  }
/>
```

### 2.5 加入導航

**`frontend/src/components/MainLayout.tsx`**：

```tsx
import { fa<Icon> } from "@fortawesome/free-solid-svg-icons";

// navItems 陣列中加入：
{
  id: "<id>",
  name: "<顯示名稱>",
  icon: fa<Icon>,
  path: "/<path>",
},
```

---

## 3. Backend — FastAPI Module（僅限 Proxy / Server-side 邏輯）

只有在前端無法直接處理的情況才需要後端，例如：

- **Proxy 外部 API**：避免 CORS（如呼叫 OpenAI `/models` 端點）
- **需要 server-side secret**：如加解密、簽章
- **複雜業務邏輯**：跨多個資料來源的操作

### 3.1 模組結構

```
backend/modules/<module_name>/
├── __init__.py
├── schemas.py      # 僅 proxy 相關的 request/response schemas
├── resources.py    # 共用 helper functions、GraphQL queries（供 router 引用）
└── router.py       # 僅 proxy endpoints
```

> 不需要 `services.py`，因為 CRUD 已由前端直接操作 Hasura。
> 如果 router 中有可重用的 helper function 或 GraphQL query，應放入 `resources.py`。

### 3.2 範例：Proxy 外部 API

```python
import httpx
from fastapi import APIRouter, HTTPException, status
from core.auth import CurrentUserDep

router = APIRouter()

@router.post("/fetch-models")
async def fetch_models(data: FetchModelsRequest, user: CurrentUserDep):
    """Proxy to external API to avoid CORS."""
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(url, headers={"Authorization": f"Bearer {data.api_key}"})
        resp.raise_for_status()
        return resp.json()
```

### 3.3 註冊 Router

**`backend/modules/__init__.py`**：

```python
from . import auth, <module_name>
```

**`backend/main.py`**：

```python
from modules import auth, <module_name>
app.include_router(<module_name>.router, prefix="/api/<module_name>", tags=["..."])
```

---

## Checklist

- [ ] Hasura migration `up.sql` / `down.sql`
- [ ] Hasura metadata YAML + `tables.yaml` include
- [ ] Users table array relationship
- [ ] Frontend GraphQL queries/mutations
- [ ] Frontend page component（使用 `createAuthenticatedHasuraClient`）
- [ ] Frontend route in `App.tsx`
- [ ] Frontend nav item in `MainLayout.tsx`
- [ ] Backend proxy endpoints（如有需要）
- [ ] `hasura migrate apply && hasura metadata apply`
- [ ] TypeScript 編譯通過
