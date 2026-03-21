# Coolify 部署指南

本指南說明如何在 Coolify 平台上部署此全端應用程式。

## 什麼是 Coolify？

[Coolify](https://coolify.io/) 是一個開源的自託管平台即服務 (PaaS)，可以輕鬆部署和管理應用程式，類似於 Heroku 或 Vercel。

## 環境變數命名規則

本專案使用 Coolify 的 `SERVICE_*` 命名規則，這些變數會在部署時自動生成隨機值：

- `SERVICE_USER_*` - 使用者名稱（Coolify 會自動生成）
- `SERVICE_PASSWORD_*` - 密碼（Coolify 會自動生成強密碼）
- `SERVICE_FQDN_*` - 完整域名（Coolify 會根據您的設定生成）

## 部署步驟

### 1. 準備 Coolify 環境

確保您已經安裝並設定好 Coolify：
- [Coolify 安裝指南](https://coolify.io/docs/installation)
- 至少需要一個 Coolify 伺服器節點

### 2. 新增專案到 Coolify

1. 登入 Coolify Dashboard
2. 點擊 "New Project"
3. 選擇 "Docker Compose" 部署方式
4. 連接您的 Git Repository 或上傳 `docker-compose.yaml`

### 3. 設定環境變數

在 Coolify 中設定以下**必要**環境變數：

#### Auth0 配置（必填）
```
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
```

#### 自動生成的變數（Coolify 會自動處理）
這些變數**留空**，Coolify 會自動生成：
```
SERVICE_USER_POSTGRES=          # 留空，自動生成
SERVICE_PASSWORD_POSTGRES=      # 留空，自動生成
SERVICE_PASSWORD_HASURA_ADMIN=  # 留空，自動生成
SERVICE_USER_RABBITMQ=          # 留空，自動生成
SERVICE_PASSWORD_RABBITMQ=      # 留空，自動生成
```

#### 資料庫配置
```
POSTGRES_DB=hasura
```

#### 應用程式配置
```
HASURA_GRAPHQL_ENABLE_CONSOLE=false  # 生產環境建議關閉
HASURA_GRAPHQL_DEV_MODE=false        # 生產環境建議關閉
```

### 4. 設定域名

在 Coolify 中為每個服務設定域名：

- **Frontend**: `app.yourdomain.com`
- **Backend API**: `api.yourdomain.com`
- **Hasura GraphQL**: `graphql.yourdomain.com`
- **RabbitMQ Management**: `rabbitmq.yourdomain.com`

設定域名後，更新以下環境變數：

```
VITE_API_URL=https://api.yourdomain.com
VITE_HASURA_ENDPOINT=https://graphql.yourdomain.com/v1/graphql
HASURA_ENDPOINT=http://hasura:8080/v1/graphql  # 內部使用 service name
```

### 5. 設定持久化儲存

確保在 Coolify 中為以下服務啟用持久化儲存：

- **PostgreSQL**: `/var/lib/postgresql/data`
- **RabbitMQ**: `/var/lib/rabbitmq`

### 6. 部署應用程式

1. 在 Coolify 中點擊 "Deploy"
2. Coolify 會自動：
   - 生成所有 `SERVICE_*` 變數的隨機值
   - 建置 Docker images
   - 啟動所有服務
   - 配置反向代理和 SSL 憑證

### 7. 驗證部署

部署完成後，檢查以下服務：

```bash
# 檢查 Frontend
curl https://app.yourdomain.com

# 檢查 Backend API
curl https://api.yourdomain.com/health

# 檢查 Hasura
curl https://graphql.yourdomain.com/healthz
```

## 生產環境配置建議

### 安全性設定

1. **關閉開發模式**：
```
HASURA_GRAPHQL_DEV_MODE=false
HASURA_GRAPHQL_ENABLE_CONSOLE=false
```

2. **使用強密碼**：
   - Coolify 會自動為所有 `SERVICE_PASSWORD_*` 變數生成強密碼
   - 確保不要在程式碼中硬編碼密碼

3. **限制 Console 訪問**：
   - 如果需要啟用 Hasura Console，考慮使用 HTTP Basic Auth
   - 或者只在需要時臨時啟用

### 效能優化

1. **資料庫連接池**：
   - 根據您的負載調整 PostgreSQL 連接數
   - 在 Hasura 中設定適當的連接池大小

2. **資源限制**：
```yaml
# 在 docker-compose.yaml 中為每個服務設定資源限制
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 1G
    reservations:
      cpus: '0.5'
      memory: 512M
```

### 監控和日誌

1. **啟用日誌收集**：
   - Coolify 會自動收集所有容器日誌
   - 可在 Dashboard 中查看即時日誌

2. **設定健康檢查**：
   - 所有服務都已配置 healthcheck
   - Coolify 會自動監控並在服務失敗時重啟

3. **設定告警**：
   - 在 Coolify 中配置告警通知
   - 當服務不健康時接收通知

## 備份策略

### 自動備份

在 Coolify 中設定定期備份：

1. **PostgreSQL 備份**：
```bash
# Coolify 可以設定定期執行備份腳本
docker-compose exec postgres pg_dump -U $SERVICE_USER_POSTGRES hasura > backup.sql
```

2. **Volume 備份**：
   - Coolify 支援自動 volume 快照
   - 建議每天進行備份

### 手動備份

```bash
# 匯出 PostgreSQL
docker-compose exec postgres pg_dump -U postgres hasura > backup-$(date +%Y%m%d).sql

# 匯出 Hasura Metadata
docker-compose exec hasura hasura metadata export

# 備份 volumes
docker run --rm -v postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-backup.tar.gz /data
```

## 更新和維護

### 更新應用程式

1. **推送新程式碼**：
```bash
git push origin main
```

2. **Coolify 自動部署**：
   - 如果啟用了 Auto-deploy，Coolify 會自動偵測更改並重新部署
   - 或者在 Dashboard 中手動觸發部署

### 更新 Docker Images

```bash
# 更新到最新版本的 Hasura
# 修改 docker-compose.yaml 中的 image 版本
image: hasura/graphql-engine:v2.37.0  # 更新版本號

# 在 Coolify 中重新部署
```

### 零停機更新

Coolify 支援滾動更新：
1. 新容器啟動並通過健康檢查
2. 流量切換到新容器
3. 舊容器關閉

## 故障排除

### 常見問題

#### 1. 環境變數未生成

**問題**: `SERVICE_*` 變數沒有自動生成值

**解決方案**:
- 確保變數名稱格式正確（`SERVICE_PASSWORD_*`）
- 在 Coolify 中手動設定或重新部署專案

#### 2. 資料庫連接失敗

**問題**: Backend 無法連接到 PostgreSQL

**解決方案**:
```bash
# 檢查 PostgreSQL 是否正常運行
docker-compose logs postgres

# 檢查網路連接
docker-compose exec backend ping postgres
```

#### 3. Hasura Migration 失敗

**問題**: Hasura 啟動時 migration 失敗

**解決方案**:
```bash
# 手動執行 migration
docker-compose exec hasura hasura migrate apply

# 檢查 migration 狀態
docker-compose exec hasura hasura migrate status
```

### 查看日誌

在 Coolify Dashboard 中：
1. 進入專案頁面
2. 選擇服務
3. 查看 "Logs" 標籤

或使用 CLI：
```bash
# 查看特定服務日誌
docker-compose logs -f backend
docker-compose logs -f hasura
docker-compose logs -f postgres
```

## 成本優化

### 資源調整建議

根據流量調整資源分配：

**低流量** (< 100 使用者/天):
- PostgreSQL: 512MB RAM
- Hasura: 512MB RAM
- Backend: 256MB RAM
- Frontend: 256MB RAM
- RabbitMQ: 256MB RAM

**中流量** (100-1000 使用者/天):
- PostgreSQL: 1GB RAM
- Hasura: 1GB RAM
- Backend: 512MB RAM
- Frontend: 512MB RAM
- RabbitMQ: 512MB RAM

**高流量** (> 1000 使用者/天):
- 考慮水平擴展
- 使用負載平衡器
- 獨立的資料庫伺服器

## 擴展建議

當應用程式成長時：

1. **水平擴展 Backend**:
   - 增加 Backend 容器數量
   - 使用 Coolify 的負載平衡功能

2. **資料庫優化**:
   - 考慮使用 PostgreSQL 的主從複製
   - 或使用託管資料庫服務（如 Neon, Supabase）

3. **快取層**:
   - 新增 Redis 用於快取
   - 降低資料庫負載

4. **CDN**:
   - 使用 CDN 加速靜態資源
   - Cloudflare, AWS CloudFront 等

## 相關資源

- [Coolify 官方文檔](https://coolify.io/docs)
- [Hasura 生產環境指南](https://hasura.io/docs/latest/deployment/production-checklist/)
- [FastAPI 部署文檔](https://fastapi.tiangolo.com/deployment/)
- [Docker Compose 最佳實踐](https://docs.docker.com/compose/production/)

## 支援

如有問題：
1. 查看 Coolify 社群論壇
2. 檢查專案的 GitHub Issues
3. 聯繫技術支援團隊
