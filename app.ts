#!/usr/bin/env node
import { execSync } from 'child_process'

import inquirer from 'inquirer'
import ora from 'ora'
import { Option } from './types'
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
  const cmd = option.commands[0]
  if (cmd === '__help__') {
    options.forEach(option =>
      console.log(`\n${chalk.white.bold(option.name)}\n  ${option.description}`)
    )
    process.exit(0)
  }
  if (cmd === '__exit__') {
    process.exit(0)
  }
  if (cmd === '__change_project_root__') {
    const updated = await promptForProjectRoot(projectRoot)
    console.log(`Project root updated to: ${updated}`)
    process.exit(0)
  }
  const spinner = ora(`Executing: ${option.name}`).start()
  try {
    execSync(cmd, {
      stdio: 'inherit',
      shell: '/bin/zsh',
      cwd: projectRoot
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
