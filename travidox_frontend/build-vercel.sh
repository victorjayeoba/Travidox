#!/bin/bash
set -e

# Optional: run any import fix or prep
echo "Fixing imports..."
# Or whatever you call that step

echo "Running build..."
npm run build
