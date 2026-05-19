FROM dunglas/frankenphp:1-php8.2

RUN install-php-extensions pdo_mysql zip pcntl

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Clean the default FrankenPHP files to allow composer create-project to run in an empty directory
RUN rm -rf * .* 2>/dev/null || true

# Create fresh Laravel project
RUN composer create-project laravel/laravel . --prefer-dist --no-interaction

# Install Sanctum for API auth
RUN composer require laravel/sanctum --no-interaction

# Copy custom application files (merges with existing Laravel scaffolding)
COPY bootstrap/app.php bootstrap/app.php
COPY config/cors.php config/cors.php
COPY routes/api.php routes/api.php
COPY app/Models/ app/Models/
COPY app/Http/Controllers/MemberController.php app/Http/Controllers/MemberController.php
COPY app/Http/Controllers/CheckInController.php app/Http/Controllers/CheckInController.php
COPY app/Http/Controllers/SettingsController.php app/Http/Controllers/SettingsController.php
COPY app/Http/Controllers/AuthController.php app/Http/Controllers/AuthController.php
COPY database/migrations/ database/migrations/
COPY database/seeders/DatabaseSeeder.php database/seeders/DatabaseSeeder.php
COPY .env.docker .env

RUN php artisan key:generate

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY Caddyfile /etc/caddy/Caddyfile

ENV FRANKENPHP_DOCUMENT_ROOT=/app/public

ENTRYPOINT ["/entrypoint.sh"]
CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile"]
