# =============================================================================
# Dockerfile para Website Backend (Laravel 11 + PHP 8.3)
# Usa imagen oficial de PHP con FPM para producción
# =============================================================================

FROM php:8.3-fpm-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    icu-dev \
    oniguruma-dev \
    libxml2-dev \
    libzip-dev \
    git \
    curl \
    zip \
    unzip

# Instalar extensiones de PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        gd \
        pdo_mysql \
    && docker-php-ext-install -j$(nproc) \
        intl \
        opcache \
        zip \
        bcmath \
        mbstring \
        xml \
        soap \
        pcntl

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar código fuente
COPY . .

# Instalar dependencias de PHP
RUN composer install --optimize-autoloader --no-dev

# Configurar permisos
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Exponer puerto 9000 (FPM)
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD php artisan schedule:list || exit 1

CMD ["php-fpm"]
