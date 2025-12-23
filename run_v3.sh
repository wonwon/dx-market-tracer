#!/bin/bash

# Kill background processes on exit
trap 'kill %1; kill %2' SIGINT

echo "Starting TradeInfo v3 Development Environment..."

# Terminate existing backend processes if any
lsof -ti :8000 | xargs kill -9 2>/dev/null

# Start Backend
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000 --host 127.0.0.1 &

# Start Frontend
cd ../frontend
npm run dev -- --port 3000 &

wait
