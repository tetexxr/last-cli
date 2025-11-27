#!/usr/bin/env node
import { execSync } from 'child_process'

import inquirer from 'inquirer'
import ora from 'ora'
import { Command } from './types'
import { commands } from './commands'
import { getProjectRoot, promptForProjectRoot } from './config'

async function main(): Promise<void> {
  try {
    const projectRoot = await getProjectRoot()

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

    await executeCommand(selectedCommand, projectRoot)
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message)
    }
    throw error
  }
}

async function executeCommand(command: Command, projectRoot: string): Promise<void> {
  if (command.requiresConfirmation) {
    const confirmed = await confirm(command)
    if (!confirmed) {
      console.log('Operation cancelled')
      return
    }
  }
  if (command.command === 'exit') {
    console.log('Exit Last CLI')
    process.exit(0)
  }
  if (command.command === '__change_project_root__') {
    const updated = await promptForProjectRoot(projectRoot)
    console.log(`Project root updated to: ${updated}`)
    return
  }

  const spinner = ora(`Executing: ${command.name}`).start()
  try {
    execSync(command.command, {
      stdio: 'inherit',
      shell: '/bin/zsh',
      cwd: projectRoot
    })
    spinner.succeed(`${command.name} completed successfully`)
  } catch (error) {
    spinner.fail(`${command.name} failed`)
    if (error instanceof Error) {
      console.error('Error:', error.message)
    }
    process.exit(1)
  }
}

async function confirm(cmd: Command): Promise<boolean> {
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
