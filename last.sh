#!/bin/zsh

# Resolve the actual script location (following symlinks)
SCRIPT_PATH="$(readlink -f "$0" 2>/dev/null || readlink "$0" 2>/dev/null || echo "$0")"
SCRIPT_DIR="$(cd "$(dirname "$SCRIPT_PATH")" && pwd)"

# Execute the TypeScript file using tsx
cd "$SCRIPT_DIR" && npx tsx last.ts
