# ================================
# Stage 1: Build
# ================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build

# ================================
# Stage 2: Production
# ================================
FROM node:20-alpine AS production
WORKDIR /app

# Puppeteer / Chromium dependencies + Notoフォント
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  font-noto \
  font-noto-cjk \
  dumb-init \
  curl

# Puppeteer runtime configuration
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV NODE_ENV=production
ENV PORT=8080
ENV APP_ENTRY=dist/src/main.js
EXPOSE 8080

# Non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/data ./data
COPY docker/entrypoint.sh /usr/local/bin/app-entrypoint.sh
RUN chmod +x /usr/local/bin/app-entrypoint.sh

USER nestjs

# ✅ Health check uses dynamic PORT
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8080}/healthz || exit 1

# ✅ Run built app with configurable entrypoint
ENTRYPOINT ["/usr/local/bin/app-entrypoint.sh"]
