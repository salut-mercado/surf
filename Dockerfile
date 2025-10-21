# ---------- Builder ----------
FROM node:20-bookworm-slim AS builder
WORKDIR /app

# Build-time inputs
ARG VITE_API_URL
ARG NPMRC_CONTENTS=""

# Make VITE_ env visible to Vite during build
ENV VITE_API_URL=${VITE_API_URL}

# Enable pnpm (locked version from package.json)
RUN corepack enable && corepack prepare pnpm@10.6.3 --activate

# Optional private registry access: write .npmrc before install
RUN if [ -n "$NPMRC_CONTENTS" ]; then printf "%s" "$NPMRC_CONTENTS" > .npmrc; fi

# Install deps using lockfile for reproducible builds
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build
COPY . .
RUN pnpm build && rm -f .npmrc

# ---------- Runtime ----------
FROM nginx:1.27-alpine AS runtime

# Nginx config for SPA + immutable assets
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Static site
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
