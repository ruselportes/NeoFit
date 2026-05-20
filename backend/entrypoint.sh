#!/bin/bash
set -e

# Default env vars if not set
export DB_HOST="${DB_HOST:-db}"
export DB_PORT="${DB_PORT:-3306}"
export DB_DATABASE="${DB_DATABASE:-neofit}"
export DB_USERNAME="${DB_USERNAME:-neofit}"
export DB_PASSWORD="${DB_PASSWORD:-neofit}"
export PORT="${PORT:-8000}"

echo "Waiting for MySQL at ${DB_HOST}:${DB_PORT}..."
while ! php -r "try { new PDO('mysql:host=' . getenv('DB_HOST') . ';port=' . getenv('DB_PORT') . ';dbname=' . getenv('DB_DATABASE'), getenv('DB_USERNAME'), getenv('DB_PASSWORD')); echo 'ok'; } catch(Exception \$e) { exit(1); }" 2>/dev/null; do
    sleep 1
done

echo "MySQL is ready! Running migrations..."
php artisan migrate --force
php artisan db:seed --force

# Export SERVER_NAME to tell FrankenPHP to bind to the correct port with HTTP
export SERVER_NAME="http://:${PORT:-8000}"

exec "$@"
