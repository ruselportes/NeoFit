#!/bin/bash
set -e

# Default env vars if not set
DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-3306}"
DB_DATABASE="${DB_DATABASE:-neofit}"
DB_USERNAME="${DB_USERNAME:-neofit}"
DB_PASSWORD="${DB_PASSWORD:-neofit}"
PORT="${PORT:-8000}"

echo "Waiting for MySQL at ${DB_HOST}:${DB_PORT}..."
while ! php -r "try { new PDO('mysql:host=' . getenv('DB_HOST') . ';port=' . getenv('DB_PORT') . ';dbname=' . getenv('DB_DATABASE'), getenv('DB_USERNAME'), getenv('DB_PASSWORD')); echo 'ok'; } catch(Exception \$e) { exit(1); }" 2>/dev/null; do
    sleep 1
done

echo "MySQL is ready! Running migrations..."
php artisan migrate --force
php artisan db:seed --force

echo "Starting Laravel server on port ${PORT}..."
php artisan serve --host=0.0.0.0 --port="${PORT}" --no-reload
