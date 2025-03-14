#!/bin/bash

echo "Waiting for system to be ready..."
sleep 2

echo "Running database migrations..."
flask db upgrade

echo "Starting Gunicorn server with CORS support..."
exec gunicorn --bind 0.0.0.0:5000 --workers 3 wsgi:app