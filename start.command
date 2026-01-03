#!/bin/bash
# Move to the directory where this script is located
cd "$(dirname "$0")"

echo "========================================"
echo "   TradeInfo v3 One-Click Startup"
echo "========================================"

# Make sure the main script is executable
chmod +x run_v3.sh

# Run the startup script
./run_v3.sh
