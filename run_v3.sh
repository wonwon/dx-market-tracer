#!/bin/bash

# Kill background processes on exit
trap 'kill %1; kill %2' SIGINT

echo "Starting TradeInfo v3 Development Environment..."

# Terminate existing backend and frontend processes if any
echo "Checking for existing processes on ports 8000 and 3000..."
lsof -ti :8000,3000 | xargs kill -9 2>/dev/null

# Start Backend
echo "Starting Backend (FastAPI)..."
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000 --host 127.0.0.1 &

# Start Frontend
echo "Starting Frontend (Next.js)..."
cd ../frontend
npm run dev -- --port 3000 &

# Automatically open the browser after a short delay
(
  sleep 3
  echo "Opening browser at http://localhost:3000..."
  open http://localhost:3000
) &

echo "Services are starting. Press Ctrl+C to stop."
wait
