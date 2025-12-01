import fs from 'fs'
import os from 'os'
import path from 'path'
import inquirer from 'inquirer'
import { Config } from './types'

const CONFIG_PATH = path.join(os.homedir(), '.last-cli.json')

export function loadConfig(): Config | null {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      return null
    }
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8')
    return JSON.parse(raw) as Config
  } catch {
    return null
  }
}

export function saveConfig(config: Partial<Config>): void {
  const existingConfig = loadConfig() ?? ({} as Config)
  const payload: Config = {
    ...existingConfig,
    ...config
  } as Config
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(payload, null, 2))
}

export function shouldAutoUpdate(config: Config | null): boolean {
  if (!config) {
    return true
  }
  const lastUpdate = new Date(config.lastUpdateDate)
  const now = new Date()
  const diffInMs = now.getTime() - lastUpdate.getTime()
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
  return diffInDays > 30
}

export async function promptForProjectRoot(defaultValue?: string): Promise<string> {
  const { projectRoot } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectRoot',
      message: 'Enter the Last project root path:',
      default: defaultValue ?? '',
      validate: (input: string) => {
        if (!input || input.trim() === '') {
          return 'Path cannot be empty'
        }
        try {
          const expandedPath = input.startsWith('~')
            ? path.join(os.homedir(), input.slice(1))
            : input
          const stat = fs.statSync(expandedPath)
          if (!stat.isDirectory()) {
            return 'Path must be a directory'
          }
          return true
        } catch {
          return 'Path does not exist'
        }
      }
    }
  ])
  const expandedPath = projectRoot.startsWith('~')
    ? path.join(os.homedir(), projectRoot.slice(1))
    : projectRoot
  saveConfig({ projectRoot: expandedPath })
  return expandedPath
}
