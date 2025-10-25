# ================================
# Stage 1: Build
# ================================
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build

# ================================
# Stage 2: Production
# ================================
FROM node:18-alpine AS production
WORKDIR /app

# Install dumb-init & curl (for signal/health)
RUN apk add --no-cache dumb-init curl

# Non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Copy only what’s needed
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/data ./data

USER nestjs

# ✅ Cloud RunはPORT=8080を使う
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

# ✅ Health check uses dynamic PORT
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8080}/ || exit 1

# ✅ Run built app (dist/main.js)
CMD ["dumb-init", "node", "dist/main.js"]
