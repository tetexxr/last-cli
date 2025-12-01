# Last CLI

Interactive CLI to run common Last tasks from anywhere.

## Prerequisites

Install node.js
```bash
brew install node@24
echo 'export PATH="/opt/homebrew/opt/node@24/bin:$PATH"' >> ~/.zshrc
```

## Install

To install Last CLI, run:

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/tetexxr/last-cli/master/install.sh)"
```

- This will clone the repository to `~/.last-cli`, install dependencies, and create a symlink `last` at `/usr/local/bin/last` pointing to `~/.last-cli/last.sh`.
- After install, run `which last` and `last` to open the menu.

## Uninstall

```bash
sudo rm /usr/local/bin/last
rm -rf ~/.last-cli
```

## Usage and commands

Run `last` and pick from the menu:

- **Delete OpenAPI**: Delete all OpenAPI generated files
- **Migrate dev**: Run migrations on dev database
- **Migrate test**: Run migrations on test database
- **Recreate dev database**: Drop and recreate dev database (requires confirmation)
- **Recreate test database**: Drop and recreate test database (requires confirmation)
- **Test**: Prepare the entire setup and run all tests:
  - Delete OpenAPI folders
  - Install and update dependencies
  - Recreate test database
  - Run migrations on test database
  - Generate Kysely type definitions
  - Generate OpenAPI client libraries
  - Run all unit and integration test
- **Launch all**: Launch all services and applications:
  - Kafka
  - Server
  - Support
  - Admin
  - POS
- **Tunnel MySQL**: Create SSH tunnel to MySQL
- **Change project root path**: Update the Last project root path used by this CLI
- **Update**: Update the Last CLI tool from git repository
- **Help**: Show all commands and their descriptions
- **Quit**: Exit Last CLI

## Auto update

The application automatically updates itself when it starts up if it has been one month (or more) since the last update.

## Troubleshooting

Command not found: ensure `/usr/local/bin` is in `PATH`.
```bash
echo $PATH | grep /usr/local/bin    # to verify if is present
export PATH="/usr/local/bin:$PATH"  # add to .zshrc
source ~/.zshrc                     # reload .zshrc
```


Permission denied: make scripts executable.
```bash
chmod +x ~/.last-cli/*.sh
```

Dependencies missing: install npm packages.
```bash
cd ~/.last-cli
npm install
```
