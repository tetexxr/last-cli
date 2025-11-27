#!/usr/bin/env node
import { execSync } from 'child_process'

import inquirer from 'inquirer'
import ora from 'ora'
import { Command } from './types'
import { commands } from './commands'

const PROJECT_ROOT = '/Users/tete/work/last-app/git/last'

async function main() {
  try {
    const { selectedCommand } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedCommand',
        message: 'Select a command to execute:',
        choices: commands.map((cmd) => ({
          name: `${cmd.name} - ${cmd.description}`,
          value: cmd
        })),
        pageSize: 15
      }
    ])

    if (selectedCommand.command === 'exit') {
      console.log('Exit last-cli')
      process.exit(0)
    }

    await executeCommand(selectedCommand)
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message)
    }
    throw error
  }
}

async function executeCommand(cmd: Command) {
  if (cmd.requiresConfirmation) {
    const confirmed = await confirm(cmd)
    if (!confirmed) {
      console.log('Operation cancelled')
      return
    }
  }

  const spinner = ora(`Executing: ${cmd.name}`).start()
  try {
    execSync(cmd.command, {
      stdio: 'inherit',
      shell: '/bin/zsh',
      cwd: PROJECT_ROOT
    })
    spinner.succeed(`${cmd.name} completed successfully`)
  } catch (error) {
    spinner.fail(`${cmd.name} failed`)
    if (error instanceof Error) {
      console.error('Error:', error.message)
    }
    process.exit(1)
  }
}

async function confirm(cmd: Command) {
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: `This will execute "${cmd.name}". Are you sure?`,
      default: false
    }
  ])
  return confirmed
}

main()
