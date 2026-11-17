# ================================
# Stage 1: Build
# ================================
FROM node:26-bookworm-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build

# ================================
# Stage 2: Production
# ================================
FROM node:26-bookworm-slim AS production
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
  chromium \
  ca-certificates \
  curl \
  dumb-init \
  && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV NODE_ENV=production
ENV PORT=8080
ENV APP_ENTRY=dist/src/main.js
ENV DB_TYPE=sqlite
ENV SQLITE_PATH=/tmp/fgo-servant-quiz.db
ENV SQLITE_GCS_OBJECT=sqlite/fgo-servant-quiz.db
EXPOSE 8080

# Non-root user
RUN groupadd --gid 1001 nodejs && useradd --uid 1001 --gid nodejs --create-home --shell /bin/bash nestjs

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/data ./data
COPY --from=builder --chown=nestjs:nodejs /app/src ./src
COPY docker/entrypoint.sh /usr/local/bin/app-entrypoint.sh
RUN chmod +x /usr/local/bin/app-entrypoint.sh

USER nestjs

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8080}/healthz || exit 1

ENTRYPOINT ["/usr/local/bin/app-entrypoint.sh"]
