#!/usr/bin/env node
import { execSync } from 'child_process'
import path from 'path'

import inquirer from 'inquirer'
import ora from 'ora'
import { Command, CommandEntry, Config, Option } from './types'
import chalk from 'chalk'
import { options } from './options'
import * as config from './config'
import { launchAll } from './launch-all'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main(): Promise<void> {
  try {
    const configuration = await loadConfiguration()
    await autoUpdate(configuration)

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

    await executeOption(selectedOption, configuration.projectRoot)
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message)
    }
    throw error
  }
}

async function loadConfiguration(): Promise<Config> {
  const configuration = config.loadConfig()
  if (configuration) {
    return configuration
  }
  const projectRoot = await config.promptForProjectRoot()
  const newConfig: Config = {
    projectRoot: projectRoot,
    lastUpdateDate: new Date().toISOString()
  }
  config.saveConfig(newConfig)
  return newConfig
}

async function autoUpdate(configuration: Config | null): Promise<void> {
  if (config.shouldAutoUpdate(configuration)) {
    const spinner = ora('Checking for updates...\n').start()
    const option = options.find(o => o.id === 'id:update')
    if (!configuration || !option) {
      spinner.fail('No configuration or option found')
      return
    }
    try {
      await executeOption(option, configuration.projectRoot)
      spinner.succeed('Project updated successfully')
    } catch {
      spinner.warn('Auto-update failed, continuing...')
    }
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

  const spinner = ora(`Executing: ${option.name}\n`).start()
  try {
    for (const commandEntry of option.commands) {
      const command = toCommand(commandEntry, projectRoot)

      if (command.cmd === 'cmd:launch-all') {
        spinner.stop()
        launchAll(projectRoot)
        process.exit(0)
      }
      if (command.cmd === 'cmd:change-project-root') {
        spinner.stop()
        const updated = await config.promptForProjectRoot(projectRoot)
        console.log(`Project root updated to: ${updated}`)
        process.exit(0)
      }
      if (command.cmd === 'cmd:set-last-update-date') {
        config.saveConfig({ lastUpdateDate: new Date().toISOString() })
        continue
      }
      if (command.cmd === 'cmd:help') {
        spinner.stop()
        options.forEach(option => console.log(`\n${chalk.white.bold(option.name)}\n  ${option.description}`))
        process.exit(0)
      }
      if (command.cmd === 'cmd:exit') {
        spinner.stop()
        process.exit(0)
      }

      execSync(command.cmd, {
        stdio: 'inherit',
        shell: '/bin/zsh',
        cwd: command.cwd
      })
    }
    spinner.succeed(`${option.name} completed`)
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'signal' in error && error.signal === 'SIGINT') {
      spinner.info(`${option.name} stopped`)
      process.exit(0)
    }
    spinner.fail(`${option.name} failed`)
    if (error instanceof Error) {
      console.error('Error:', error.message)
    }
    process.exit(1)
  }
}

function toCommand(commandEntry: CommandEntry, projectRoot: string): Command {
  if (typeof commandEntry === 'string') {
    return {
      cmd: commandEntry,
      cwd: projectRoot
    }
  } else if (commandEntry.cwd === '__cli_dir__') {
    return {
      cmd: commandEntry.cmd,
      cwd: __dirname
    }
  } else {
    return {
      cmd: commandEntry.cmd,
      cwd: path.join(projectRoot, commandEntry.cwd ?? '')
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
