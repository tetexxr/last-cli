import { ChildProcess, execSync, spawn } from 'child_process'
import { fileURLToPath } from 'url'
import path from 'path'
import readline, { Key } from 'readline'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function launchAll(projectRoot: string): void {
  console.log('Launching all Last services in iTerm...')

  const appleScript = `
    tell application "iTerm"
      activate

      tell current window to create tab with default profile
      set tb1 to current session of current window
      tell current session of current window to write text "cd ${projectRoot}/server && yarn events-processor-dev"

      tell current window to create tab with default profile
      set tb2 to current session of current window
      tell current session of current window to write text "cd ${__dirname} && npx tsx launch-all.ts --server-manager ${projectRoot}"

      tell current window to create tab with default profile
      tell current session of current window to write text "cd ${projectRoot}/support && yarn dev"
      set tb3 to current session of current window

      tell current window to create tab with default profile
      tell current session of current window to write text "cd ${projectRoot}/admin && yarn dev"
      set tb4 to current session of current window

      tell current window to create tab with default profile
      tell current session of current window to write text "cd ${projectRoot}/pos && yarn dev"
      set tb5 to current session of current window

      tell tb1 to set name to "Kafka"
      tell tb2 to set name to "Server"
      tell tb3 to set name to "Support"
      tell tb4 to set name to "Admin"
      tell tb5 to set name to "POS"
    end tell
  `

  try {
    execSync('osascript', {
      input: appleScript,
      stdio: ['pipe', 'inherit', 'inherit'],
      shell: '/bin/zsh'
    })

    console.log('All services launched successfully!')
    console.log('\nCheck your iTerm window for the following tabs:')
    console.log('  • Kafka (events-processor-dev)')
    console.log('  • Server (with auto-restart controls)')
    console.log('  • Support')
    console.log('  • Admin')
    console.log('  • POS')
  } catch (error) {
    throw new Error(`Failed to launch iTerm: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Server Manager functionality (runs when called with --server-manager flag)
export async function runServerManager(projectRoot: string): Promise<void> {
  const serverPath = path.join(projectRoot, 'server')

  // Change to server directory
  process.chdir(serverPath)

  console.log('Starting yarn dev in loop mode.')
  console.log('Controls:')
  console.log('  Ctrl+C: Exit completely')
  console.log('  Ctrl+R: Restart the process after 10 seconds')
  console.log('  Ctrl+O: Run yarn openapi and restart the process')
  console.log('  Ctrl+K: Run migrations and restart the process')

  // Configure readline to capture key presses
  readline.emitKeypressEvents(process.stdin)
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true)
  }

  let yarnProcess: ChildProcess | null = null
  let autoRestart = true

  // Function to start the yarn dev process
  function startDevProcess(): void {
    if (!autoRestart) return

    console.log('Starting yarn dev...')
    yarnProcess = spawn('yarn', ['dev'], { stdio: 'inherit' })

    yarnProcess.on('close', (code: number) => {
      console.log(`Process exited with code ${code}.`)
      yarnProcess = null

      if (autoRestart) {
        console.log('Restarting in 2 seconds...')
        setTimeout(startDevProcess, 2000)
      }
    })
  }

  // Function to stop the current process
  function stopProcess(): Promise<boolean> {
    return new Promise(resolve => {
      if (yarnProcess) {
        console.log('Stopping current process...')
        autoRestart = false

        yarnProcess.on('close', () => {
          resolve(true)
        })

        yarnProcess.kill()
        yarnProcess = null
      } else {
        resolve(false)
      }
    })
  }

  // Function to run yarn openapi
  function runOpenApi(): Promise<void> {
    console.log('Running yarn openapi...')
    const openApiProcess = spawn('yarn', ['openapi'], { stdio: 'inherit' })

    return new Promise(resolve => {
      openApiProcess.on('close', () => {
        console.log('Yarn openapi completed.')
        resolve()
      })
    })
  }

  // Function to run migrations
  function runMigrations(): Promise<void> {
    console.log('Running migrations...')
    const migrationsProcess = spawn('yarn', ['knex', 'migrate:latest'], { stdio: 'inherit' })

    return new Promise(resolve => {
      migrationsProcess.on('close', () => {
        console.log('Migrations completed.')
        resolve()
      })
    })
  }

  // Handle key presses
  process.stdin.on('keypress', async (_str: string, key: Key) => {
    if (!key) return

    // Ctrl+C - Exit the script
    if (key.ctrl && key.name === 'c') {
      console.log('\nExiting...')
      autoRestart = false
      if (yarnProcess) {
        yarnProcess.kill()
      }
      process.exit(0)
    }

    // Ctrl+R - Restart after 10 seconds
    if (key.ctrl && key.name === 'r') {
      await stopProcess()
      console.log('Restarting in 10 seconds...')
      setTimeout(() => {
        autoRestart = true
        startDevProcess()
      }, 10000)
    }

    // Ctrl+O - Run openapi and restart
    if (key.ctrl && key.name === 'o') {
      await stopProcess()
      await runOpenApi()
      autoRestart = true
      startDevProcess()
    }

    // Ctrl+K - Run migrations and restart
    if (key.ctrl && key.name === 'k') {
      await stopProcess()
      await runMigrations()
      autoRestart = true
      startDevProcess()
    }
  })

  // Start the initial process
  startDevProcess()
}

// CLI entry point when run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)

  if (args[0] === '--server-manager' && args[1]) {
    runServerManager(args[1])
  }
}
