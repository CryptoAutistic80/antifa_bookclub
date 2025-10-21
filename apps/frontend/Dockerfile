# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

WORKDIR /app
RUN apk add --no-cache libc6-compat \
  && corepack enable

COPY package.json pnpm-lock.yaml nx.json tsconfig.base.json tsconfig.json ./
COPY apps ./apps
COPY libs ./libs

RUN pnpm install --frozen-lockfile
RUN pnpm exec nx build frontend

FROM node:20-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app
RUN apk add --no-cache libc6-compat \
  && corepack enable

COPY --from=base /app/apps/frontend/.next/standalone ./dist/apps/frontend
COPY --from=base /app/apps/frontend/.next/static ./dist/apps/frontend/.next/static
COPY --from=base /app/apps/frontend/public ./dist/apps/frontend/public

EXPOSE 3000
CMD ["node", "dist/apps/frontend/server.js"]
