FROM node:18-bookworm-slim AS base

FROM base AS deps
WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends curl ca-certificates && \
    rm -rf /var/lib/apt/lists/*


COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

RUN if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
     elif [ -f package-lock.json ]; then npm ci; \
     elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
     else echo "Lockfile not found." && exit 1; fi


FROM base AS builder
WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# TODO: Currently this means that any changes trigger a rebuild, even if its not
# nextjs related code. SHould aim to only copy the nextjs stuff
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN if [ -f yarn.lock ]; then yarn build; \
     elif [ -f package-lock.json ]; then npm run build; \
     elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
     else echo "Lockfile not found." && exit 1; fi

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000 HOSTNAME=0.0.0.0
ENV PATH=/usr/local/bin:$PATH

RUN apt-get update && \
    apt-get install -y --no-install-recommends docker.io

# RUN curl -fsSL https://ollama.com/install.sh | sh

# Create non-root user
# RUN groupadd --system --gid 1001 nodejs && \
#     useradd --system --uid 1001 --gid nodejs --home-dir /nonexistent --no-create-home nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# COPY --from=builder /app/dcc-runner ./.next/dcc-runner

# USER nextjs

# EXPOSE 3000

RUN apt-get install -y --no-install-recommends curl iproute2

CMD ["node", "server.js"]

# COPY entrypoint.sh /entrypoint.sh
# CMD ["/entrypoint.sh"]
