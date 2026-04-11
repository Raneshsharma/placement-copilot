# =============================================
# Stage 1: Dependencies
# =============================================
FROM node:22-alpine AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat python3 make g++

COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# =============================================
# Stage 2: Prisma Generate
# =============================================
FROM deps AS prisma
WORKDIR /app
COPY prisma ./prisma
RUN npx prisma generate

# =============================================
# Stage 3: Builder
# =============================================
FROM node:22-alpine AS builder
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
COPY . .

RUN npm run build

# =============================================
# Stage 4: Production Runner
# =============================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 apiuser

# Create directory for Prisma and set permissions
RUN mkdir -p /app/prisma && chown -R apiuser:nodejs /app

# Copy artifacts from builder
COPY --from=builder --chown=apiuser:nodejs /app/dist ./dist
COPY --from=builder --chown=apiuser:nodejs /app/prisma ./prisma
COPY --from=builder --chown=apiuser:nodejs /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

USER apiuser

EXPOSE 3001

# Health check is handled by docker-compose
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

CMD ["node", "dist/main.js"]
