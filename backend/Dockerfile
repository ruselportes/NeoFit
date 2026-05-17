FROM php:8.2-cli

RUN apt-get update && apt-get install -y git unzip libzip-dev \
    && docker-php-ext-install pdo pdo_mysql zip \
    && apt-get clean

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/laravel

# Create fresh Laravel project
RUN composer create-project laravel/laravel . --prefer-dist --no-interaction

# Install Sanctum for API auth
RUN composer require laravel/sanctum --no-interaction
RUN php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider" || true

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

EXPOSE 8000
ENTRYPOINT ["/entrypoint.sh"]
