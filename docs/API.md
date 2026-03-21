# API 文檔

完整的 REST API 端點文檔。

## 📚 目錄

- [API 概覽](#api-概覽)
- [認證](#認證)
- [端點列表](#端點列表)
- [錯誤處理](#錯誤處理)
- [速率限制](#速率限制)

## 🌐 API 概覽

### 基礎 URL

- **開發環境**：`http://localhost:8000`
- **生產環境**：`https://api.yourdomain.com`

### API 版本

當前版本：**v1**

### 內容類型

所有請求和響應都使用 JSON 格式：

```
Content-Type: application/json
```

### 互動式文檔

啟動應用後可訪問自動生成的文檔：

- **Swagger UI**：http://localhost:8000/docs
- **ReDoc**：http://localhost:8000/redoc
- **OpenAPI Schema**：http://localhost:8000/openapi.json

## 🔐 認證

### JWT Bearer Token

大多數端點需要 Auth0 JWT Token：

```http
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 取得 Token

前端透過 Auth0 SDK 取得：

```typescript
const { getAccessTokenSilently } = useAuth0();
const token = await getAccessTokenSilently();
```

### Token 結構

JWT Token 包含以下 claims：

```json
{
  "sub": "auth0|123456789",
  "email": "user@example.com",
  "name": "John Doe",
  "iss": "https://your-domain.auth0.com/",
  "aud": "your-api-audience",
  "iat": 1234567890,
  "exp": 1234571490
}
```

## 📋 端點列表

### 系統端點

#### 1. 根端點

**GET /**

返回 API 歡迎訊息。

**請求範例**：

```bash
curl http://localhost:8000/
```

**響應**：

```json
{
  "message": "Welcome to the API",
  "version": "1.0.0",
  "documentation": "/docs"
}
```

---

#### 2. 健康檢查

**GET /health**

檢查 API 伺服器健康狀態。

**請求範例**：

```bash
curl http://localhost:8000/health
```

**響應 (200 OK)**：

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "services": {
    "hasura": "connected",
    "rabbitmq": "connected"
  }
}
```

---

### 認證端點

#### 3. 處理 Auth0 JWT Claim

**POST /api/auth/auth0/jwt_claim**

處理 Auth0 JWT Token，驗證使用者並同步資料到資料庫。

**認證**：需要 JWT Token

**請求頭**：

```
Authorization: Bearer <token>
Content-Type: application/json
```

**請求體**：

```json
{
  "user_id": "auth0|123456789",
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://example.com/avatar.jpg"
}
```

**請求範例**：

```bash
curl -X POST http://localhost:8000/api/auth/auth0/jwt_claim \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "auth0|123456789",
    "email": "user@example.com",
    "name": "John Doe"
  }'
```

**響應 (200 OK)**：

```json
{
  "success": true,
  "message": "User authenticated successfully",
  "user": {
    "id": "auth0|123456789",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://example.com/avatar.jpg",
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

**錯誤響應 (401 Unauthorized)**：

```json
{
  "detail": "Invalid or expired token"
}
```

**錯誤響應 (400 Bad Request)**：

```json
{
  "detail": "Missing required fields: user_id, email"
}
```

---

### 使用者端點（範例）

#### 4. 取得使用者資訊

**GET /api/users/{user_id}**

取得指定使用者的詳細資訊。

**認證**：需要 JWT Token

**路徑參數**：

- `user_id` (string): 使用者 ID

**請求範例**：

```bash
curl -X GET http://localhost:8000/api/users/auth0|123456789 \
  -H "Authorization: Bearer <token>"
```

**響應 (200 OK)**：

```json
{
  "id": "auth0|123456789",
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://example.com/avatar.jpg",
  "role": "user",
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

**錯誤響應 (404 Not Found)**：

```json
{
  "detail": "User not found"
}
```

---

#### 5. 更新使用者資訊

**PUT /api/users/{user_id}**

更新使用者資訊。

**認證**：需要 JWT Token（使用者本人或管理員）

**路徑參數**：

- `user_id` (string): 使用者 ID

**請求體**：

```json
{
  "name": "Jane Doe",
  "picture": "https://example.com/new-avatar.jpg"
}
```

**請求範例**：

```bash
curl -X PUT http://localhost:8000/api/users/auth0|123456789 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe"
  }'
```

**響應 (200 OK)**：

```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "id": "auth0|123456789",
    "email": "user@example.com",
    "name": "Jane Doe",
    "updated_at": "2024-01-01T13:00:00Z"
  }
}
```

---

## ⚠️ 錯誤處理

### 錯誤響應格式

所有錯誤響應遵循統一格式：

```json
{
  "detail": "Error message describing what went wrong",
  "error_code": "ERROR_CODE",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### HTTP 狀態碼

| 狀態碼 | 說明                  | 使用場景                       |
| ------ | --------------------- | ------------------------------ |
| 200    | OK                    | 請求成功                       |
| 201    | Created               | 資源創建成功                   |
| 400    | Bad Request           | 請求參數錯誤                   |
| 401    | Unauthorized          | 未提供或無效的認證 Token       |
| 403    | Forbidden             | 沒有權限訪問資源               |
| 404    | Not Found             | 資源不存在                     |
| 409    | Conflict              | 資源衝突（例如：重複的 email） |
| 422    | Unprocessable Entity  | 資料驗證失敗                   |
| 429    | Too Many Requests     | 超過速率限制                   |
| 500    | Internal Server Error | 伺服器內部錯誤                 |
| 503    | Service Unavailable   | 服務暫時不可用                 |

### 常見錯誤代碼

| 錯誤代碼                 | HTTP 狀態 | 說明                            |
| ------------------------ | --------- | ------------------------------- |
| `INVALID_TOKEN`          | 401       | JWT Token 無效或過期            |
| `MISSING_FIELDS`         | 400       | 缺少必需欄位                    |
| `USER_NOT_FOUND`         | 404       | 使用者不存在                    |
| `PERMISSION_DENIED`      | 403       | 沒有權限執行操作                |
| `DUPLICATE_EMAIL`        | 409       | Email 已被使用                  |
| `RATE_LIMIT_EXCEEDED`    | 429       | 超過 API 呼叫限制               |
| `DATABASE_ERROR`         | 500       | 資料庫操作失敗                  |
| `EXTERNAL_SERVICE_ERROR` | 500       | 外部服務（Hasura/RabbitMQ）錯誤 |

### 錯誤範例

#### 驗證錯誤 (422)

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "invalid email format",
      "type": "value_error.email"
    }
  ]
}
```

#### 認證錯誤 (401)

```json
{
  "detail": "Could not validate credentials",
  "error_code": "INVALID_TOKEN"
}
```

#### 權限錯誤 (403)

```json
{
  "detail": "You do not have permission to perform this action",
  "error_code": "PERMISSION_DENIED"
}
```

## 🚦 速率限制

### 限制規則

| 端點類型 | 限制   | 時間窗口 |
| -------- | ------ | -------- |
| 認證端點 | 10 次  | 1 分鐘   |
| 讀取端點 | 100 次 | 1 分鐘   |
| 寫入端點 | 30 次  | 1 分鐘   |

### 速率限制標頭

響應包含速率限制資訊：

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

### 超過限制

當超過速率限制時，API 返回 429 狀態碼：

```json
{
  "detail": "Rate limit exceeded. Please try again in 30 seconds.",
  "error_code": "RATE_LIMIT_EXCEEDED",
  "retry_after": 30
}
```

## 📖 使用範例

### JavaScript/TypeScript

```typescript
import { useAuth0 } from "@auth0/auth0-react";

async function callAPI() {
  const { getAccessTokenSilently } = useAuth0();
  const token = await getAccessTokenSilently();

  const response = await fetch("http://localhost:8000/api/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail);
  }

  return response.json();
}
```

### Python

```python
import requests

def call_api(token: str):
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    response = requests.get(
        'http://localhost:8000/api/users/me',
        headers=headers
    )

    response.raise_for_status()
    return response.json()
```

### cURL

```bash
# 儲存 token
TOKEN="your-jwt-token"

# 呼叫 API
curl -X GET http://localhost:8000/api/users/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

## 🔗 GraphQL API

透過 Hasura 提供的 GraphQL API：

### 端點

- **HTTP**：http://localhost:8080/v1/graphql
- **WebSocket**：ws://localhost:8080/v1/graphql

### 認證

使用相同的 JWT Token：

```
Authorization: Bearer <token>
```

### 查詢範例

```graphql
query GetUsers {
  users(limit: 10, order_by: { created_at: desc }) {
    id
    name
    email
    created_at
  }
}
```

詳細的 GraphQL 查詢請參閱 [Hasura Console](http://localhost:8080) 的 API Explorer。

## 🤝 需要幫助？

- 查看 [後端開發指南](../backend/README.md)
- 閱讀 [架構設計](ARCHITECTURE.md)
- 參考 [故障排除指南](TROUBLESHOOTING.md)

---

**Happy Coding! 🚀**
