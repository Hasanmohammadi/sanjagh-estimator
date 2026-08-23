# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

RUN corepack enable && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run frontend:build && ls -la /app

# Production stage
FROM nginx:alpine

COPY --from=builder /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]