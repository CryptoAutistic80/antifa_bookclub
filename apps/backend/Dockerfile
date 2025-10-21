# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

WORKDIR /app
RUN apk add --no-cache libc6-compat \
  && corepack enable

COPY package.json pnpm-lock.yaml nx.json tsconfig.base.json tsconfig.json ./
COPY apps ./apps
COPY libs ./libs

RUN pnpm install --frozen-lockfile
RUN pnpm exec nx build backend

FROM node:20-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app
RUN apk add --no-cache libc6-compat \
  && corepack enable

COPY --from=base /app/dist/apps ./dist/apps
COPY --from=base /app/dist/libs ./dist/libs
COPY --from=base /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=base /app/dist/apps/package.json ./package.json

RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000
CMD ["node", "dist/apps/main.js"]
