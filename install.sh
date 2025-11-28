#!/bin/sh

set -e

REPO_URL="https://github.com/tetexxr/last-cli.git"
INSTALL_DIR="$HOME/.last-cli"
SYMLINK_PATH="/usr/local/bin/last"

echo "Installing Last CLI..."

# Clone or update repo in ~/.last-cli
if [ -d "$INSTALL_DIR" ]; then
    echo "Directory $INSTALL_DIR already exists."
    echo "Updating repository..."
    git -C "$INSTALL_DIR" pull
else
    echo "Cloning repository into $INSTALL_DIR..."
    git clone "$REPO_URL" "$INSTALL_DIR"
fi

# Install dependencies
cd "$INSTALL_DIR"
echo "Installing dependencies with npm..."
npm install

# Create symlink
if [ ! -d "/usr/local/bin" ]; then
    echo "/usr/local/bin does not exist. Creating it..."
    sudo mkdir -p /usr/local/bin
fi
if [ -L "$SYMLINK_PATH" ]; then
    echo "Removing existing symlink..."
    sudo rm "$SYMLINK_PATH"
fi
echo "Creating symlink..."
sudo ln -s "$INSTALL_DIR/last.sh" "$SYMLINK_PATH"

if [ -L "$SYMLINK_PATH" ]; then
    echo "\nLast CLI installed successfully."
    echo "You can now run 'last' from anywhere in your terminal."
    echo "Try it: last"
else
    echo "Installation failed."
    exit 1
fi
