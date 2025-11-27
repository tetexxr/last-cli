#!/bin/zsh

echo "Uninstalling Last CLI..."

INSTALL_PATH="/usr/local/bin/last"

# Check if the symlink exists
if [ -L "$INSTALL_PATH" ]; then
    sudo rm "$INSTALL_PATH"
    echo "Last CLI uninstalled successfully."
else
    echo "Last CLI is not installed."
    exit 1
fi

