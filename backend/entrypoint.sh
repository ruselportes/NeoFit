#!/bin/bash
set -e

echo "Waiting for MySQL..."
while ! php -r "try { new PDO('mysql:host=db;port=3306;dbname=neofit', 'neofit', 'neofit'); echo 'ok'; } catch(Exception \$e) { exit(1); }" 2>/dev/null; do
    sleep 1
done

echo "MySQL is ready! Running migrations..."
php artisan migrate --force
php artisan db:seed --force

echo "Starting Laravel server..."
php artisan serve --host=0.0.0.0 --port=8000
