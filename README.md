# Last CLI

Interactive CLI to run common Last tasks from anywhere.

## Install

```bash
cd ~/bin/last-cli
npm install
./install.sh
```

- Creates symlink `last` at `/usr/local/bin/last` -> `~/bin/last-cli/last.sh`
- After install, run `which last` and `last` to open the menu

## Uninstall

```bash
cd ~/bin/last-cli
./uninstall.sh
# or
sudo rm /usr/local/bin/last
```

To remove everything:
```bash
rm -rf ~/bin/last-cli
```

## Usage and commands

Run `last` and pick from the menu:

- Delete OpenAPI: remove all generated OpenAPI files (confirms)
- Migrate Dev: run migrations on dev database
- Migrate Test: run migrations on test database
- Recreate Database Dev: drop and recreate dev database (confirms)
- Recreate Database Test: drop and recreate test database (confirms)
- Run All: start all services
- Run Local: start local setup
- Run Tests: run test suite
- Tunnel MySQL: open SSH tunnel to MySQL
- Quit: exit the CLI

## Troubleshooting

Command not found: ensure `/usr/local/bin` is in `PATH`.
```bash
echo $PATH | grep /usr/local/bin    # to verify if is present
export PATH="/usr/local/bin:$PATH"  # add to .zshrc
source ~/.zshrc                     # reload .zshrc
```

Permission denied: make scripts executable.
```bash
chmod +x ~/bin/last-cli/*.sh
```

Dependencies missing: install npm packages.
```bash
cd ~/bin/last-cli
npm install
```
