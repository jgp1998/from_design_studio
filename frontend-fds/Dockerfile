FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
RUN apk add --no-cache libc6-compat

WORKDIR /app

# ---- Builder Stage ----
FROM base AS builder
RUN pnpm add -g turbo
COPY . .
ARG APP_NAME
RUN turbo prune --scope=${APP_NAME} --docker

# ---- Installer Stage ----
FROM base AS installer
WORKDIR /app

# First install dependencies
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
ARG APP_NAME
RUN pnpm turbo run build --filter=${APP_NAME}...

# ---- Runner Stage ----
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

ARG APP_NAME
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV APP_NAME=${APP_NAME}

# Copy output traces
COPY --from=installer --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/static ./apps/${APP_NAME}/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/${APP_NAME}/public ./apps/${APP_NAME}/public

CMD node apps/${APP_NAME}/server.js
