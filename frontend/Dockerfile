# 前端建置 Dockerfile
FROM node:22-alpine AS builder

# 設定工作目錄
WORKDIR /app

# 宣告構建參數
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_API_URL
ARG VITE_HASURA_ENDPOINT

# 複製 package 檔案
COPY package*.json ./

# 安裝所有依賴
RUN npm ci

# 複製原始碼
COPY . .

# 建置前端 (設定環境變數以便 Vite 可以讀取)
RUN VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN \
    VITE_AUTH0_CLIENT_ID=$VITE_AUTH0_CLIENT_ID \
    VITE_API_URL=$VITE_API_URL \
    VITE_HASURA_ENDPOINT=$VITE_HASURA_ENDPOINT \
    npm run build

# 生產階段 - 使用 nginx 提供靜態檔案服務
FROM nginx:alpine AS production

# 安裝 curl 用於 health check
RUN apk add --no-cache curl

# 複製建置結果到 nginx 目錄
COPY --from=builder /app/dist /usr/share/nginx/html

# 複製 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露 port 3000
EXPOSE 3000

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"]
