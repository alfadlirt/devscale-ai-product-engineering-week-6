FROM node:22-bookworm-slim AS base
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
WORKDIR /app

FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/platform/package.json apps/platform/package.json
COPY packages/agents/package.json packages/agents/package.json
RUN pnpm install --frozen-lockfile

FROM dependencies AS builder
COPY . .
ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN pnpm build

FROM base AS api
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/prisma.config.ts ./apps/api/prisma.config.ts
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/packages/agents ./packages/agents
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
WORKDIR /app/apps/api
EXPOSE 8000
CMD ["sh", "-c", "pnpm exec prisma migrate deploy && pnpm start"]

FROM base AS web
COPY --from=builder /app/apps/platform/dist ./apps/platform/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/platform/node_modules ./apps/platform/node_modules
COPY --from=builder /app/apps/platform/package.json ./apps/platform/package.json
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
WORKDIR /app/apps/platform
EXPOSE 4173
CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "4173"]
