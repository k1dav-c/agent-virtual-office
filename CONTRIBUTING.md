# 貢獻指南

感謝您對本專案的興趣！我們歡迎任何形式的貢獻，包括但不限於：

- 🐛 回報 Bug
- 💡 提出新功能建議
- 📝 改善文檔
- 🔧 提交代碼修復或新功能
- 🎨 改善 UI/UX

## 📚 目錄

- [行為準則](#行為準則)
- [如何開始](#如何開始)
- [開發工作流程](#開發工作流程)
- [代碼風格](#代碼風格)
- [提交規範](#提交規範)
- [Pull Request 流程](#pull-request-流程)
- [測試要求](#測試要求)
- [文檔更新](#文檔更新)

## 🤝 行為準則

### 我們的承諾

為了營造一個開放且友善的環境，我們承諾讓參與專案和社群的每個人都能獲得無騷擾的體驗，無論其：

- 年齡、體型、殘疾、族裔
- 性別認同與表達
- 經驗水平、教育程度、社經地位
- 國籍、個人外貌、種族、宗教
- 性取向

### 我們的標準

有助於創造正面環境的行為包括：

- ✅ 使用友善和包容的語言
- ✅ 尊重不同的觀點和經驗
- ✅ 優雅地接受建設性批評
- ✅ 關注對社群最有利的事情
- ✅ 對其他社群成員表示同理心

不可接受的行為包括：

- ❌ 使用性化的語言或圖像
- ❌ 惡意評論或人身攻擊
- ❌ 公開或私下騷擾
- ❌ 未經許可發布他人的私人資訊
- ❌ 其他可被合理認為不適當的行為

## 🚀 如何開始

### 1. Fork 專案

點擊 GitHub 頁面右上角的 "Fork" 按鈕。

### 2. 克隆您的 Fork

```bash
git clone https://github.com/YOUR-USERNAME/discord-manager-full.git
cd discord-manager-full
```

### 3. 添加上游遠端

```bash
git remote add upstream https://github.com/ORIGINAL-OWNER/discord-manager-full.git
```

### 4. 設定開發環境

參照 [README.md](README.md) 的快速開始指南設定開發環境。

### 5. 創建分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

## 🔄 開發工作流程

### 1. 保持同步

在開始工作前，確保您的 fork 是最新的：

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### 2. 進行更改

在您的分支上進行修改：

```bash
git checkout feature/your-feature-name
# 進行代碼修改...
```

### 3. 提交更改

```bash
git add .
git commit -m "feat: add new feature"
```

### 4. 推送到 GitHub

```bash
git push origin feature/your-feature-name
```

### 5. 創建 Pull Request

在 GitHub 上創建從您的分支到主專案 `main` 分支的 Pull Request。

## 🎨 代碼風格

### 前端 (TypeScript/React)

遵循 [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

**使用 ESLint 和 Prettier**：

```bash
cd frontend

# 檢查代碼風格
npm run lint

# 自動修復
npm run lint:fix

# 格式化代碼
npm run format
```

**命名規範**：

```typescript
// 元件：PascalCase
const UserProfile: React.FC = () => { ... }

// 函式和變數：camelCase
const getUserData = () => { ... }
const userData = ...

// 常數：UPPER_SNAKE_CASE
const API_BASE_URL = "https://api.example.com"

// 私有屬性：前綴 _
private _internalState = ...

// 類型/介面：PascalCase
interface UserData { ... }
type UserId = string
```

**TypeScript 最佳實踐**：

```typescript
// ✅ 好的做法
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = async (id: string): Promise<User> => {
  // ...
};

// ❌ 避免
const getUser = async (id: any): Promise<any> => {
  // ...
};
```

### 後端 (Python)

遵循 [PEP 8](https://www.python.org/dev/peps/pep-0008/) 風格指南

**使用 Black 和 isort**：

```bash
cd backend

# 格式化代碼
black .

# 排序 imports
isort .

# 檢查類型
mypy .
```

**命名規範**：

```python
# 類別：PascalCase
class UserService:
    pass

# 函式和變數：snake_case
def get_user_data():
    pass

user_data = ...

# 常數：UPPER_SNAKE_CASE
API_BASE_URL = "https://api.example.com"

# 私有屬性/方法：前綴 _
def _internal_method():
    pass
```

**Python 最佳實踐**：

```python
# ✅ 好的做法
from typing import List, Dict, Optional

def get_users(limit: int = 10) -> List[Dict[str, str]]:
    """
    取得使用者列表

    Args:
        limit: 返回的最大使用者數量

    Returns:
        使用者資料列表
    """
    # ...

# ❌ 避免
def get_users(limit=10):
    # 沒有類型提示
    # 沒有文檔字串
    pass
```

### SQL/GraphQL

```sql
-- SQL：使用大寫關鍵字，snake_case 表名
SELECT id, name, email
FROM users
WHERE created_at > '2024-01-01'
ORDER BY created_at DESC;
```

```graphql
# GraphQL：camelCase 欄位名
query GetUsers($limit: Int!) {
  users(limit: $limit, orderBy: { createdAt: DESC }) {
    id
    name
    email
    createdAt
  }
}
```

## 📝 提交規範

我們使用 [Conventional Commits](https://www.conventionalcommits.org/) 規範。

### 提交訊息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type（類型）

| Type       | 說明                         | 範例                                        |
| ---------- | ---------------------------- | ------------------------------------------- |
| `feat`     | 新功能                       | `feat(auth): add password reset`            |
| `fix`      | Bug 修復                     | `fix(api): handle null user data`           |
| `docs`     | 文檔更新                     | `docs(readme): update setup instructions`   |
| `style`    | 代碼格式（不影響功能）       | `style: format with prettier`               |
| `refactor` | 重構（不新增功能或修復 Bug） | `refactor(user): simplify validation logic` |
| `perf`     | 效能改善                     | `perf(db): add index on user_id`            |
| `test`     | 測試相關                     | `test(auth): add login tests`               |
| `chore`    | 建置或輔助工具               | `chore: update dependencies`                |

### Scope（範圍）

可選，指出更改的範圍：

- `auth` - 身份驗證
- `api` - API 端點
- `ui` - 使用者介面
- `db` - 資料庫
- `deps` - 依賴
- `config` - 配置

### Subject（主題）

- 使用祈使句（"add" 而非 "added"）
- 首字母小寫
- 結尾不加句號
- 盡量在 50 字元內

### Body（內文）

可選，詳細說明更改的原因和內容。

### Footer（頁腳）

可選，用於引用 Issue 或標註破壞性變更。

### 範例

```bash
# 簡單提交
git commit -m "feat(auth): add login with Google"

# 完整提交
git commit -m "feat(auth): add login with Google

Implement Google OAuth2 authentication flow using Auth0.
Users can now sign in with their Google accounts.

Closes #123"

# 破壞性變更
git commit -m "feat(api): change user endpoint structure

BREAKING CHANGE: User API endpoint now returns nested user object
instead of flat structure. Frontend code needs to be updated."
```

## 🔀 Pull Request 流程

### 1. 創建 Pull Request

在 GitHub 上創建 Pull Request，並：

- 使用清晰的標題（遵循提交規範）
- 在描述中說明更改的原因和內容
- 引用相關的 Issue（`Closes #123`）
- 添加截圖（如果是 UI 更改）

### 2. PR 模板

```markdown
## 更改描述

簡要說明此 PR 的更改內容。

## 更改類型

- [ ] Bug 修復
- [ ] 新功能
- [ ] 文檔更新
- [ ] 重構
- [ ] 其他（請說明）

## 測試

說明如何測試此更改。

## 檢查清單

- [ ] 代碼遵循專案的代碼風格
- [ ] 已執行 linter 且無錯誤
- [ ] 已添加/更新測試
- [ ] 所有測試通過
- [ ] 已更新相關文檔
- [ ] 提交訊息遵循規範

## 相關 Issue

Closes #(issue number)

## 截圖（如適用）

（添加截圖）
```

### 3. Code Review

- 維護者會審查您的代碼
- 請耐心等待回饋
- 根據回饋進行必要的修改
- 更新 PR（推送到相同分支）

### 4. 合併

- 通過審查後，維護者會合併您的 PR
- 您的貢獻將被記錄在專案歷史中
- 感謝您的貢獻！🎉

## 🧪 測試要求

### 前端測試

```bash
cd frontend

# 運行所有測試
npm test

# 運行特定測試文件
npm test -- UserProfile.test.tsx

# 生成覆蓋率報告
npm test -- --coverage
```

**測試原則**：

- 每個元件應有對應的測試文件
- 測試用戶互動和邊界情況
- 使用 `@testing-library/react` 進行測試

**範例**：

```typescript
// UserProfile.test.tsx
import { render, screen } from '@testing-library/react';
import UserProfile from './UserProfile';

describe('UserProfile', () => {
  it('displays user name', () => {
    const user = { name: 'John Doe', email: 'john@example.com' };
    render(<UserProfile user={user} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('displays user email', () => {
    const user = { name: 'John Doe', email: 'john@example.com' };
    render(<UserProfile user={user} />);
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
```

### 後端測試

```bash
cd backend

# 運行所有測試
pytest

# 運行特定測試文件
pytest tests/test_auth.py

# 生成覆蓋率報告
pytest --cov=. --cov-report=html
```

**測試原則**：

- 每個模組應有對應的測試文件
- 測試正常情況和錯誤情況
- 使用 fixtures 管理測試資料

**範例**：

```python
# tests/test_auth.py
import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_jwt_claim_success():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/auth/auth0/jwt_claim",
            json={
                "user_id": "auth0|123",
                "email": "test@example.com",
                "name": "Test User"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["user"]["email"] == "test@example.com"

@pytest.mark.asyncio
async def test_jwt_claim_missing_fields():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/auth/auth0/jwt_claim",
            json={"user_id": "auth0|123"}  # 缺少 email
        )
        assert response.status_code == 400
```

## 📖 文檔更新

當您的更改影響到使用方式時，請更新相關文檔：

### 需要更新的文檔

- **README.md**：專案概覽、快速開始
- **backend/README.md**：後端 API、模組說明
- **frontend/README.md**：前端元件、使用方式
- **docs/API.md**：API 端點說明
- **docs/ARCHITECTURE.md**：架構變更
- **CHANGELOG.md**：版本變更記錄

### 文檔風格

- 使用清晰、簡潔的語言
- 提供代碼範例
- 包含截圖（如適用）
- 使用 Markdown 格式

## 🐛 回報 Bug

### 提交 Bug Report 前

1. 檢查是否已有相同的 Issue
2. 確認問題在最新版本中仍存在
3. 嘗試找出問題的根本原因

### Bug Report 模板

```markdown
## Bug 描述

清晰簡潔地描述 Bug。

## 重現步驟

1. 前往 '...'
2. 點擊 '...'
3. 捲動到 '...'
4. 看到錯誤

## 預期行為

描述您預期應該發生什麼。

## 實際行為

描述實際發生了什麼。

## 截圖

如適用，添加截圖幫助解釋問題。

## 環境

- OS: [例如 macOS 12.0]
- Browser: [例如 Chrome 97]
- Version: [例如 1.0.0]

## 額外資訊

任何其他關於問題的資訊。
```

## 💡 提出新功能

### Feature Request 模板

```markdown
## 功能描述

清晰簡潔地描述您想要的功能。

## 問題

這個功能解決了什麼問題？

## 建議的解決方案

描述您希望如何實現這個功能。

## 替代方案

描述您考慮過的其他解決方案。

## 額外資訊

任何其他關於功能請求的資訊或截圖。
```

## 📞 獲取幫助

如果您有任何問題：

- 📖 查看 [文檔](docs/)
- 💬 在 Issue 中提問
- 📧 聯繫維護者

## 🎉 貢獻者

感謝所有貢獻者的付出！

（專案會自動生成貢獻者列表）

## 📄 授權

提交貢獻即表示您同意您的代碼在專案的 MIT 授權下發布。

---

**再次感謝您的貢獻！您的參與讓這個專案變得更好！🚀**
