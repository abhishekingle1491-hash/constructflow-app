# Stage 1: Compile React Frontend Assets
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY resources/ ./resources/
COPY public/ ./public/
COPY vite.config.* ./
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Stage 2: Production Laravel + PHP-FPM Container
FROM php:8.3-fpm-alpine
WORKDIR /var/www/constructflow

# Install system libraries & PHP extensions for MySQL, Redis, and Queues
RUN apk add --no-cache libpng-dev libzip-dev oniguruma-dev $PHPIZE_DEPS \
    && docker-php-ext-install pdo_mysql mbstring zip exif pcntl bcmath gd \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del $PHPIZE_DEPS

# Tune PHP-FPM for 512MB RAM (Start worker processes only when traffic arrives)
RUN echo "pm = ondemand" >> /usr/local/etc/php-fpm.d/zz-custom.conf \
    && echo "pm.max_children = 5" >> /usr/local/etc/php-fpm.d/zz-custom.conf

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

COPY . .
COPY --from=frontend /app/public/build ./public/build

RUN chown -R www-data:www-data /var/www/constructflow/storage /var/www/constructflow/bootstrap/cache
USER www-data
EXPOSE 9000
CMD ["php-fpm"]