#!/usr/bin/env node
import { execSync } from 'child_process'

import inquirer from 'inquirer'
import ora from 'ora'
import { Command, CommandEntry, Option } from './types'
import chalk from 'chalk'
import { options } from './options'
import { getProjectRoot, promptForProjectRoot } from './config'

async function main(): Promise<void> {
  try {
    const projectRoot = await getProjectRoot()

    const { selectedOption } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedOption',
        message: 'Select an option to execute:',
        choices: options.map(option => ({
          name: option.name,
          value: option
        })),
        pageSize: 15
      }
    ])

    await executeOption(selectedOption, projectRoot)
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message)
    }
    throw error
  }
}

async function executeOption(option: Option, projectRoot: string): Promise<void> {
  if (option.description) {
    console.log(option.description)
  }
  if (option.requiresConfirmation) {
    const confirmed = await confirm(option)
    if (!confirmed) {
      console.log('Operation cancelled')
      process.exit(0)
    }
  }
  for (const commandEntry of option.commands) {
    const command = toCommand(commandEntry, projectRoot)

    if (command.cmd === '__help__') {
      options.forEach(option => console.log(`\n${chalk.white.bold(option.name)}\n  ${option.description}`))
      process.exit(0)
    }
    if (command.cmd === '__exit__') {
      process.exit(0)
    }
    if (command.cmd === '__change_project_root__') {
      const updated = await promptForProjectRoot(projectRoot)
      console.log(`Project root updated to: ${updated}`)
      process.exit(0)
    }

    const spinner = ora(`Executing: ${option.name}`).start()
    try {
      execSync(command.cmd, {
        stdio: 'inherit',
        shell: '/bin/zsh',
        cwd: command.cwd
      })
      spinner.succeed(`${option.name} completed successfully`)
    } catch (error) {
      spinner.fail(`${option.name} failed`)
      if (error instanceof Error) {
        console.error('Error:', error.message)
      }
      process.exit(1)
    }
  }
}

function toCommand(commandEntry: CommandEntry, projectRoot: string): Command {
  if (typeof commandEntry === 'string') {
    return {
      cmd: commandEntry,
      cwd: projectRoot
    }
  } else {
    return {
      cmd: commandEntry.cmd,
      cwd: `${projectRoot}/${commandEntry.cwd}`
    }
  }
}

async function confirm(option: Option): Promise<boolean> {
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: `This will execute "${option.name}". Are you sure?`,
      default: false
    }
  ])
  return confirmed
}

main()
