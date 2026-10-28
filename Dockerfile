# build environment
FROM node:24-alpine AS build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

ARG CUSTOM_ENVIRONMENT=develop
ENV CUSTOM_ENVIRONMENT=${CUSTOM_ENVIRONMENT}
ARG BUILD_VERSION
ENV BUILD_VERSION=${BUILD_VERSION}
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}

# Corepack picks the pnpm version pinned in package.json ("packageManager")
RUN corepack enable

# Copy package manager files first to leverage cache
COPY crm-v2/package.json crm-v2/pnpm-lock.yaml crm-v2/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Then copy only necessary source files
COPY crm-v2/src/ ./src/
COPY crm-v2/public/ ./public/
COPY crm-v2/index.html ./
COPY crm-v2/tsconfig.json crm-v2/tsconfig.app.json crm-v2/tsconfig.node.json ./
COPY crm-v2/vite.config.ts ./
# Vite loads .env / .env.<mode> from cwd; mode comes from CUSTOM_ENVIRONMENT (Jenkins --build-arg).
COPY crm-v2/.env* ./
RUN pnpm exec tsc -b && pnpm exec vite build --mode ${CUSTOM_ENVIRONMENT}

# production environment
FROM nginxinc/nginx-unprivileged
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
