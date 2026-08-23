# ==========================================
# مرحله ۱: Build
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# نصب pnpm
RUN npm install -g pnpm@10.12.1

# فایل‌های اصلی monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# package.json ورک‌اسپیس‌ها
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

# نصب dependencyها
RUN pnpm install --frozen-lockfile --ignore-scripts

# سورس Backend
COPY backend ./backend

# Build TypeScript
RUN pnpm --filter ./backend exec tsc

# ساخت production dependency tree
RUN pnpm --filter ./backend deploy --prod /app/deploy/backend


# ==========================================
# مرحله ۲: Production
# ==========================================
FROM node:22-alpine

WORKDIR /app

# فقط Backend production را منتقل می‌کنیم
COPY --from=builder /app/deploy/backend ./

EXPOSE 3001

CMD ["node", "dist/index.js"]