# =============================================================================
# Dockerfile para Website Frontend (React + Vite)
# Build multi-stage: Node para build, Nginx para servir estáticos
# =============================================================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json y lock files
COPY ../../../../package*.json ./
COPY ../../../../pnpm-lock.yaml ./
COPY ../../../../pnpm-workspace.yaml ./
COPY ../../../../packages/design-system/package.json ./packages/design-system/
COPY ../../../../apps/website/src/frontend/package.json ./apps/website/src/frontend/

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY ../../../../packages/design-system ./packages/design-system
COPY ../../../../apps/website/src/frontend ./apps/website/src/frontend

# Build del design-system primero
WORKDIR /app/packages/design-system
RUN pnpm run build

# Build del website frontend
WORKDIR /app/apps/website/src/frontend
RUN pnpm run build

# Stage 2: Nginx para servir estáticos
FROM nginx:alpine

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build desde el stage anterior
COPY --from=builder /app/apps/website/src/frontend/dist /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
