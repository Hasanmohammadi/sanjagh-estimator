# ==========================================
# مرحله ۱: Build (بیلد و استخراج dependency ها)
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# نصب pnpm (پایدارتر از corepack برای شبکه‌های ناپایدار)
RUN npm install -g pnpm@10.12.1

# کپی فایل‌های تنظیمات workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc ./

# کپی کردن package.json تمام ورک‌اسپیس‌ها برای جلوگیری از ارور pnpm
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json

# نصب تمام دیپندنسی‌ها
RUN pnpm install --frozen-lockfile --ignore-scripts

# کپی کردن سورس کدهای بک‌اند
COPY backend ./backend

WORKDIR /app

RUN pnpm --filter ./backend exec tsc
RUN pnpm --filter ./backend deploy --prod /app/deploy/backend --legacy
# ==========================================
# مرحله ۲: Production (اجرا - بسیار سبک و بدون نیاز به pnpm)
# ==========================================
FROM node:22-alpine

WORKDIR /app

# کپی کردن مستقیم خروجی مرحله قبل (نیازی به نصب هیچ چیز نیست!)
COPY --from=builder /app/deploy/backend ./

EXPOSE 3001

CMD ["node", "dist/index.js"]