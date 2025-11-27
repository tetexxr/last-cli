import fs from 'fs'
import os from 'os'
import path from 'path'
import inquirer from 'inquirer'

const CONFIG_PATH = path.join(os.homedir(), '.last-cli.json')

export function loadConfig(): string | null {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      return null
    }
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8')
    const parsed = JSON.parse(raw)
    return typeof parsed.projectRoot === 'string' ? parsed.projectRoot : null
  } catch {
    return null
  }
}

export function saveConfig(projectRoot: string): void {
  const payload = { projectRoot }
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(payload, null, 2))
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
          const stat = fs.statSync(input)
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
  saveConfig(projectRoot)
  return projectRoot
}

export async function getProjectRoot(): Promise<string> {
  const existing = loadConfig()
  if (existing) {
    return existing
  }
  return await promptForProjectRoot()
}
