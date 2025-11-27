#!/bin/zsh

echo "Installing Last CLI..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Create a symlink in /usr/local/bin
INSTALL_PATH="/usr/local/bin/last"

# Check if /usr/local/bin exists
if [ ! -d "/usr/local/bin" ]; then
    echo "/usr/local/bin does not exist. Creating it..."
    sudo mkdir -p /usr/local/bin
fi

# Remove existing symlink if it exists
if [ -L "$INSTALL_PATH" ]; then
    echo "Removing existing installation..."
    sudo rm "$INSTALL_PATH"
fi

# Create the symlink
echo "Creating symlink..."
sudo ln -s "$SCRIPT_DIR/last.sh" "$INSTALL_PATH"

# Verify installation
if [ -L "$INSTALL_PATH" ]; then
    echo "Last CLI installed successfully."
    echo
    echo "You can now run 'last' from anywhere in your terminal."
    echo
    echo "Try it: last"
else
    echo "Installation failed."
    exit 1
fi
