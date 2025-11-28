#!/usr/bin/env node
import { execSync } from 'child_process'

import inquirer from 'inquirer'
import ora from 'ora'
import { Command } from './types'
import chalk from 'chalk'
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
        choices: commands.map((cmd) => ({ name: cmd.name, value: cmd })),
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

async function executeCommand(cmd: Command, projectRoot: string): Promise<void> {
  if (cmd.description) {
    console.log(cmd.description)
  }
  if (cmd.requiresConfirmation) {
    const confirmed = await confirm(cmd)
    if (!confirmed) {
      console.log('Operation cancelled')
      process.exit(0)
    }
  }
  if (cmd.command === '__help__') {
    commands.forEach((cmd) => {
      console.log(`\n${chalk.white.bold(cmd.name)}\n  ${cmd.description}`)
    })
    process.exit(0)
  }

  if (cmd.command === '__exit__') {
    process.exit(0)
  }
  if (cmd.command === '__change_project_root__') {
    const updated = await promptForProjectRoot(projectRoot)
    console.log(`Project root updated to: ${updated}`)
    process.exit(0)
  }

  const spinner = ora(`Executing: ${cmd.name}`).start()
  try {
    execSync(cmd.command, {
      stdio: 'inherit',
      shell: '/bin/zsh',
      cwd: projectRoot
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
