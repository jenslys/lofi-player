#!/bin/bash

set -e

echo "🔨 Building Lofi Player for Mac..."

echo "📦 Installing frontend dependencies..."
bun install

echo "🏗️ Building frontend..."
bun run build

echo "🦀 Building Tauri app..."
if command -v cargo-tauri &> /dev/null; then
    cargo tauri build
else
    echo "Installing tauri CLI..."
    cargo install tauri-cli@2.5.0
    cargo tauri build
fi

echo "✅ Build complete!"
echo "📁 Built app can be found in src-tauri/target/release/bundle/"

# List the built files
echo "📋 Built files:"
find src-tauri/target/release/bundle/ -name "*.app" -o -name "*.dmg" 2>/dev/null || echo "No bundle files found"