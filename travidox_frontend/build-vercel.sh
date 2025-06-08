#!/bin/bash

# Print environment information
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Operating system: $(uname -a)"

# Remove any Windows-specific dependencies
echo "Cleaning Windows-specific dependencies..."
node clean.js

# Remove package-lock.json if it exists
if [ -f package-lock.json ]; then
    echo "Removing package-lock.json..."
    rm package-lock.json
fi

# Install dependencies for Linux
echo "Installing dependencies for Linux..."
npm install --platform=linux --arch=x64 --no-optional

# Fix import paths
echo "Fixing import paths..."
node vercel-fix-imports.js

# Build the application
echo "Building the application..."
NODE_OPTIONS="--max-old-space-size=4096" npm run build

echo "Build process completed!" 