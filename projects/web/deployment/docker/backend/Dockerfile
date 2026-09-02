FROM composer:2 AS composer
WORKDIR /app
COPY apps/backend/composer.json \
     apps/backend/composer.lock \
     ./
RUN composer install \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts

FROM php:8.3-fpm-alpine
WORKDIR /var/www/html

RUN apk add --no-cache \
    nginx \
    supervisor \
    icu-dev \
    oniguruma-dev \
    libzip-dev \
    zip \
    unzip \
    bash

RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    intl \
    bcmath \
    opcache

COPY --from=composer \
    /app/vendor \
    ./vendor

COPY apps/backend/ ./

COPY deployment/docker/backend/nginx.conf \
    /etc/nginx/http.d/default.conf

COPY deployment/docker/backend/supervisord.conf \
    /etc/supervisord.conf

RUN mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    storage/api-docs \
    bootstrap/cache

RUN chown -R www-data:www-data \
    storage \
    bootstrap/cache

RUN chmod -R 775 \
    storage \
    bootstrap/cache

RUN php artisan package:discover --no-interaction || true
# El contrato OpenAPI viaja dentro de la imagen (regenerable en runtime con
# `php artisan l5-swagger:generate` tras cambiar anotaciones).
RUN php artisan l5-swagger:generate || true
RUN php artisan storage:link || true
RUN php artisan config:clear || true

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]