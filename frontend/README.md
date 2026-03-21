# Frontend - React Application

這是一個使用 **React 19** 和 **TypeScript** 構建的現代化前端應用程式，整合了 Auth0 身分驗證、Hasura GraphQL、Tailwind CSS 等技術。

## 📚 目錄

- [技術堆疊](#技術堆疊)
- [快速開始](#快速開始)
- [專案結構](#專案結構)
- [路由設定](#路由設定)
- [環境變數](#環境變數)
- [身分驗證](#身分驗證)
- [開發指南](#開發指南)
- [GraphQL 整合](#graphql-整合)
- [樣式系統](#樣式系統)
- [建置與部署](#建置與部署)
- [疑難排解](#疑難排解)

## 🛠️ 技術堆疊

### 核心框架

- **[React 19.1](https://react.dev/)** - 最新的 React 版本，提供更好的效能和 DX
- **[TypeScript 5.5](https://www.typescriptlang.org/)** - 型別安全的 JavaScript 超集
- **[Vite 5.3](https://vitejs.dev/)** - 次世代前端建置工具，極快的 HMR

### UI 與樣式

- **[Tailwind CSS 4.1](https://tailwindcss.com/)** - Utility-First CSS 框架
- **[FontAwesome 6.5](https://fontawesome.com/)** - 圖示庫

### 路由與狀態管理

- **[React Router 6.25](https://reactrouter.com/)** - 聲明式路由管理

### 身份驗證

- **[Auth0 React SDK 2.4](https://auth0.com/docs/libraries/auth0-react)** - 企業級身分驗證解決方案

### API 與數據

- **[GraphQL 16.11](https://graphql.org/)** - 查詢語言
- **[graphql-request 7.2](https://github.com/jasonkuhrt/graphql-request)** - 輕量級 GraphQL 用戶端
- **[graphql-ws 6.0](https://github.com/enisdenjo/graphql-ws)** - WebSocket 客戶端，用於 GraphQL Subscriptions

## 🚀 快速開始

### 先決條件

- Node.js 18+ 和 npm
- Auth0 帳號（用於身份驗證配置）
- 後端服務和 Hasura 正在運行

### 安裝相依套件

```bash
cd frontend
npm install
```

### 環境變數設定

1. 複製環境變數範例檔案：

   ```bash
   cp .env.example .env
   ```

2. 編輯 `.env` 檔案，填入您的配置：

   ```env
   # Auth0 Configuration
   VITE_AUTH0_DOMAIN=your-domain.auth0.com
   VITE_AUTH0_CLIENT_ID=your-client-id

   # API Backend URL
   VITE_API_URL=http://localhost:8000

   # Hasura GraphQL Endpoint
   VITE_HASURA_ENDPOINT=http://localhost:8080/v1/graphql
   ```

### 啟動開發伺服器

```bash
npm run dev
```

應用程式將在 http://localhost:5173 啟動。

## 📁 專案結構

```
frontend/
├── src/
│   ├── pages/                      # 頁面元件
│   │   ├── LoginPage.tsx           # 登入頁面（公開）
│   │   ├── HomePage.tsx            # 首頁（需身份驗證）
│   │   └── AdminPage.tsx           # 管理員頁面（需管理員權限）
│   │
│   ├── components/                 # 可重用元件
│   │   ├── AdminAuthWrapper.tsx    # 管理員權限包裝器
│   │   ├── AdminLayout.tsx         # 管理員頁面佈局
│   │   ├── LoginButton.tsx         # Auth0 登入按鈕
│   │   ├── LogoutButton.tsx        # Auth0 登出按鈕
│   │   └── ui/                     # 基礎 UI 元件
│   │       └── Button.tsx          # 通用按鈕元件
│   │
│   ├── config/                     # 設定檔
│   │   └── auth0.ts                # Auth0 設定檔
│   │
│   ├── App.tsx                     # 主應用程式與路由配置
│   ├── index.tsx                   # React 應用入口點
│   └── vite-env.d.ts               # Vite 環境變數型別定義
│
├── public/                         # 靜態資源
│   └── favicon.ico                 # 網站圖示
│
├── index.html                      # HTML 模板
├── vite.config.ts                  # Vite 配置
├── tailwind.config.js              # Tailwind CSS 配置
├── tsconfig.json                   # TypeScript 設定檔
├── tsconfig.node.json              # Node.js TypeScript 設定檔
├── package.json                    # 專案依賴與腳本
├── .env.example                    # 環境變數範例
└── README.md                       # 本文檔
```

## 🛤️ 路由設定

應用程式使用 React Router 進行路由管理，定義在 `App.tsx` 中：

### 路由列表

| 路徑     | 元件        | 權限要求        | 說明                               |
| -------- | ----------- | --------------- | ---------------------------------- |
| `/`      | `LoginPage` | 公開            | 登入頁面，未登入使用者的入口       |
| `/home`  | `HomePage`  | 需登入          | 使用者首頁，所有已登入使用者可訪問 |
| `/admin` | `AdminPage` | 需登入 + 管理員 | 管理員專用頁面                     |

### 權限保護

- **公開路由**：任何人都可以存取（例如 `/`）
- **受保護路由**：需要 Auth0 登入（使用 `withAuthenticationRequired` HOC）
- **管理員路由**：需要登入並擁有管理員權限（使用 `AdminAuthWrapper` 包裝）

### 路由範例

```tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";

// 受保護的首頁
const ProtectedHomePage = withAuthenticationRequired(HomePage, {
  onRedirecting: () => <div>Loading...</div>,
});

// 受保護的管理員頁面
const ProtectedAdminPage = withAuthenticationRequired(AdminPage, {
  onRedirecting: () => <div>Loading...</div>,
});

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<ProtectedHomePage />} />
        <Route path="/admin" element={<ProtectedAdminPage />} />
      </Routes>
    </Router>
  );
}
```

## 🔧 環境變數

所有環境變數都使用 `VITE_` 前綴，這是 Vite 的要求。

### 必需變數

| 變數名稱               | 說明                     | 範例值                             |
| ---------------------- | ------------------------ | ---------------------------------- |
| `VITE_AUTH0_DOMAIN`    | Auth0 租戶域名           | `your-tenant.auth0.com`            |
| `VITE_AUTH0_CLIENT_ID` | Auth0 應用程式 Client ID | `abc123xyz...`                     |
| `VITE_API_URL`         | 後端 API 基礎 URL        | `http://localhost:8000`            |
| `VITE_HASURA_ENDPOINT` | Hasura GraphQL 端點      | `http://localhost:8080/v1/graphql` |

### 在代碼中使用

```typescript
// 使用 import.meta.env 存取環境變數
const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
const apiUrl = import.meta.env.VITE_API_URL;

// TypeScript 型別定義 (vite-env.d.ts)
interface ImportMetaEnv {
  readonly VITE_AUTH0_DOMAIN: string;
  readonly VITE_AUTH0_CLIENT_ID: string;
  readonly VITE_API_URL: string;
  readonly VITE_HASURA_ENDPOINT: string;
}
```

## 🔐 身分驗證

### Auth0 整合

應用程式使用 Auth0 進行身分驗證和授權管理。

#### 1. Auth0 設定檔 (`src/config/auth0.ts`)

```typescript
import { Auth0ProviderOptions } from "@auth0/auth0-react";

export const auth0Config: Auth0ProviderOptions = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: window.location.origin,
  },
};
```

#### 2. 應用程式包裝 (`src/index.tsx`)

```typescript
import { Auth0Provider } from '@auth0/auth0-react';
import { auth0Config } from './config/auth0';

root.render(
  <Auth0Provider {...auth0Config}>
    <App />
  </Auth0Provider>
);
```

#### 3. 使用 Auth0 Hook

```typescript
import { useAuth0 } from "@auth0/auth0-react";

function MyComponent() {
  const {
    isAuthenticated, // 是否已登入
    isLoading, // 是否正在載入
    user, // 使用者資訊
    loginWithRedirect, // 登入方法
    logout, // 登出方法
    getAccessTokenSilently, // 取得 Access Token
  } = useAuth0();

  // ... 元件邏輯
}
```

#### 4. 取得 JWT Token

```typescript
import { useAuth0 } from "@auth0/auth0-react";

function useApiRequest() {
  const { getAccessTokenSilently } = useAuth0();

  async function makeRequest() {
    const token = await getAccessTokenSilently();

    const response = await fetch("http://localhost:8000/api/endpoint", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  }

  return { makeRequest };
}
```

### 權限管理

#### 檢查管理員權限

在 `AdminAuthWrapper` 元件中實現：

```typescript
import { useAuth0 } from '@auth0/auth0-react';

function AdminAuthWrapper({ children }) {
  const { user, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 檢查使用者是否為管理員
  const isAdmin = user?.['custom:role'] === 'admin';

  if (!isAdmin) {
    return <div>Access Denied. Admin privileges required.</div>;
  }

  return <>{children}</>;
}
```

## 🛠️ 開發指南

### 添加新頁面

#### 步驟 1：創建頁面元件

在 `src/pages/` 目錄下創建新檔案：

```tsx
// src/pages/ProfilePage.tsx
import { FC } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const ProfilePage: FC = () => {
  const { user } = useAuth0();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <img
          src={user?.picture}
          alt="Profile"
          className="w-24 h-24 rounded-full"
        />
        <h2 className="text-xl font-semibold mt-4">{user?.name}</h2>
        <p className="text-gray-600">{user?.email}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
```

#### 步驟 2：添加路由

在 `App.tsx` 中註冊新路由：

```tsx
import ProfilePage from "./pages/ProfilePage";

// 如果需要身分驗證保護
const ProtectedProfilePage = withAuthenticationRequired(ProfilePage, {
  onRedirecting: () => <div>Loading...</div>,
});

// 在 Routes 中添加
<Route path="/profile" element={<ProtectedProfilePage />} />;
```

### 添加新元件

#### 創建可重用元件

```tsx
// src/components/ui/Card.tsx
import { FC, ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const Card: FC<CardProps> = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
};

export default Card;
```

#### 使用元件

```tsx
import Card from "../components/ui/Card";

<Card title="User Stats">
  <p>Total Users: 1,234</p>
  <p>Active Today: 567</p>
</Card>;
```

### 呼叫後端 API

#### 使用 Fetch API

```typescript
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";

function useUserData() {
  const { getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const token = await getAccessTokenSilently();

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();
      setData(result);
    }

    fetchData();
  }, [getAccessTokenSilently]);

  return data;
}
```

## 🔗 GraphQL 整合

### 使用 graphql-request

```typescript
import { GraphQLClient } from "graphql-request";
import { useAuth0 } from "@auth0/auth0-react";

function useGraphQLClient() {
  const { getAccessTokenSilently } = useAuth0();

  async function query(queryString: string, variables?: any) {
    const token = await getAccessTokenSilently();

    const client = new GraphQLClient(import.meta.env.VITE_HASURA_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return client.request(queryString, variables);
  }

  return { query };
}
```

### 查詢範例

```typescript
import { gql } from 'graphql-request';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      created_at
    }
  }
`;

function UserList() {
  const { query } = useGraphQLClient();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      const data = await query(GET_USERS);
      setUsers(data.users);
    }

    loadUsers();
  }, []);

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### GraphQL Subscriptions (WebSocket)

```typescript
import { createClient } from "graphql-ws";

const wsClient = createClient({
  url: "ws://localhost:8080/v1/graphql",
  connectionParams: async () => {
    const token = await getAccessTokenSilently();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  },
});

// 訂閱範例
const SUBSCRIBE_TO_MESSAGES = gql`
  subscription OnNewMessage {
    messages(order_by: { created_at: desc }, limit: 1) {
      id
      content
      created_at
    }
  }
`;
```

## 🎨 樣式系統

### Tailwind CSS

專案使用 Tailwind CSS 4.1 進行樣式設計。

#### 常用類別

```tsx
// 佈局
<div className="container mx-auto px-4">
  {/* 容器 */}
</div>

// 間距
<div className="p-4 m-2">     // padding: 1rem, margin: 0.5rem
<div className="mt-8 mb-4">   // margin-top: 2rem, margin-bottom: 1rem

// 文字
<h1 className="text-3xl font-bold text-gray-900">
<p className="text-sm text-gray-600">

// 按鈕
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">

// 響應式設計
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

#### 自訂設定檔

在 `tailwind.config.js` 中擴展預設設定檔：

```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        secondary: "#10B981",
      },
    },
  },
  plugins: [],
};
```

## 📦 建置與部署

### 開發模式

```bash
npm run dev
```

### 生產構建

```bash
npm run build
```

構建產物將位於 `dist/` 目錄。

### 預覽生產構建

```bash
npm run preview
```

### 部署到靜態託管

構建完成後，可以將 `dist/` 目錄部署到任何靜態託管服務：

- **Vercel**

  ```bash
  npm install -g vercel
  vercel --prod
  ```

- **Netlify**

  ```bash
  npm install -g netlify-cli
  netlify deploy --prod --dir=dist
  ```

- **AWS S3 + CloudFront**
  ```bash
  aws s3 sync dist/ s3://your-bucket-name/
  ```

### 環境變數（生產環境）

在部署平台設定以下環境變數：

```
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-production-client-id
VITE_API_URL=https://api.yourdomain.com
VITE_HASURA_ENDPOINT=https://hasura.yourdomain.com/v1/graphql
```

## 🐛 疑難排解

### 常見問題

#### 1. Auth0 登入失敗

**症狀**：點擊登入按鈕後無反應或顯示錯誤

**解決方案**：

- 檢查 `.env` 中的 `VITE_AUTH0_DOMAIN` 和 `VITE_AUTH0_CLIENT_ID` 是否正確
- 確認 Auth0 主控台中的 Allowed Callback URLs 包含 `http://localhost:5173`
- 確認 Auth0 主控台中的 Allowed Web Origins 包含 `http://localhost:5173`

#### 2. GraphQL 查詢失敗

**症狀**：GraphQL 請求返回 401 或 403 錯誤

**解決方案**：

- 確認 JWT Token 正確取得：
  ```typescript
  const token = await getAccessTokenSilently();
  console.log("Token:", token);
  ```
- 檢查 Hasura 的 JWT 設定檔是否正確
- 驗證 Auth0 的 Audience 設定檔

#### 3. CORS 錯誤

**症狀**：瀏覽器控制台顯示 CORS policy 錯誤

**解決方案**：

- 確認後端 FastAPI 已啟用 CORS：

  ```python
  from fastapi.middleware.cors import CORSMiddleware

  app.add_middleware(
      CORSMiddleware,
      allow_origins=["http://localhost:5173"],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```

#### 4. Vite 構建錯誤

**症狀**：`npm run build` 失敗

**解決方案**：

- 清除快取並重新安裝：
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- 檢查 TypeScript 錯誤：
  ```bash
  npx tsc --noEmit
  ```

#### 5. 環境變數未載入

**症狀**：`import.meta.env.VITE_*` 回傳 undefined

**解決方案**：

- 確認環境變數使用 `VITE_` 前綴
- 重新啟動開發伺服器
- 檢查 `.env` 檔案是否在正確的位置（`frontend/` 目錄）

### 除錯技巧

#### 1. 查看 Auth0 狀態

```typescript
const { isAuthenticated, isLoading, user, error } = useAuth0();

console.log("Auth Status:", {
  isAuthenticated,
  isLoading,
  user,
  error,
});
```

#### 2. 網路請求除錯

```typescript
// 在發送請求前記錄資訊
console.log("Making request to:", url);
console.log("Headers:", headers);
console.log("Body:", body);

// 記錄回應
const response = await fetch(url, options);
console.log("Response status:", response.status);
console.log("Response data:", await response.json());
```

#### 3. 使用 React DevTools

安裝 [React Developer Tools](https://react.dev/learn/react-developer-tools) 瀏覽器外掛程式來檢查元件狀態和 Props。

## 📚 更多資源

- [React 官方文檔](https://react.dev/)
- [TypeScript 手冊](https://www.typescriptlang.org/docs/)
- [Vite 指南](https://vitejs.dev/guide/)
- [Tailwind CSS 文檔](https://tailwindcss.com/docs)
- [Auth0 React SDK](https://auth0.com/docs/libraries/auth0-react)
- [React Router 教學](https://reactrouter.com/en/main/start/tutorial)

## 🤝 貢獻

如果您想為前端專案貢獻程式碼，請參閱專案根目錄的 [CONTRIBUTING.md](../CONTRIBUTING.md)。

---

**Happy Coding! 🚀**
