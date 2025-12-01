export type Option = {
  id: string
  name: string
  description: string
  requiresConfirmation?: boolean
  commands: CommandEntry[]
}

export type CommandEntry = string | Command

export type Command = {
  cmd: string
  cwd?: string
}

export type Config = {
  projectRoot: string
  lastUpdateDate: string
}
