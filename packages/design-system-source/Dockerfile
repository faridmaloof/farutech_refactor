# ================================================================
# Dockerfile — DASHBOARD FaruTech (panel admin empresarial)
# Base: @farutech/dashboard (projects/dashboard del workspace)
# Multi-stage: build Node (Vite) → Nginx estático
# ================================================================

# ---- Stage 1: Build ----
FROM node:22-alpine AS builder

WORKDIR /build

# Instalar dependencias (sin el .npmrc del host: no hay deps @farutech)
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

COPY . .

# URL de la API (inyectada por docker compose -> build.args)
ARG VITE_API_URL=http://api.farutech.local
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# ---- Stage 2: Runtime ----
FROM nginx:stable-alpine

COPY --from=builder /build/dist /usr/share/nginx/html

RUN { \
    echo 'server {'; \
    echo '    listen 80;'; \
    echo '    root /usr/share/nginx/html;'; \
    echo '    index index.html;'; \
    echo '    charset utf-8;'; \
    echo '    location / {'; \
    echo '        try_files $uri $uri/ /index.html;'; \
    echo '    }'; \
    echo '    location = /index.html {'; \
    echo '        add_header Cache-Control "no-cache, no-store, must-revalidate";'; \
    echo '        add_header Pragma "no-cache";'; \
    echo '        expires 0;'; \
    echo '    }'; \
    echo '    location /assets/ {'; \
    echo '        add_header Cache-Control "public, max-age=31536000, immutable";'; \
    echo '    }'; \
    echo '}'; \
    } > /etc/nginx/conf.d/default.conf

EXPOSE 80