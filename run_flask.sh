#!/bin/bash
# Market Speed HTMX Dashboard Runner

echo "Starting Market Speed Web Dashboard (Flask + HTMX)..."
export FLASK_APP=app_v2.py
export FLASK_ENV=development
python3 app_v2.py
