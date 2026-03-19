FROM node:18-alpine AS base
WORKDIR /app

# ---- Dependencies (Production) ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# ---- Build (Includes DevDependencies) ----
FROM base AS build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --production

# ---- Development Workflow ----
FROM base AS development
COPY package.json package-lock.json ./
RUN npm install
COPY . .
# Keep container running with start:dev
CMD ["npm", "run", "start:dev"]

# ---- Production Runtime ----
FROM base AS production
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/package.json ./package.json

USER nestjs
EXPOSE 3000

# Health check utilizing built-in or custom route
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "dist/main.js"]
