import { Option } from './types'

export const options: Option[] = [
  {
    name: 'Delete OpenAPI',
    description: 'Delete all OpenAPI generated files',
    commands: [
      { cmd: 'find . -type d -path "*/src/openapi" -exec rm -rf {} +', cwd: 'server' }
    ]
  },
  {
    name: 'Migrate dev',
    description: 'Run migrations on dev database',
    commands: [
      'last-scripts localdb migrate dev'
    ]
  },
  {
    name: 'Migrate test',
    description: 'Run migrations on test database',
    commands: [
      'last-scripts localdb migrate test'
    ]
  },
  {
    name: 'Recreate dev database',
    description: 'Drop and recreate dev database',
    requiresConfirmation: true,
    commands: [
      'docker exec -it last-dev-mysql-1 mysql -u root -plast -e "DROP DATABASE IF EXISTS last_dev;" && last-scripts localdb init dev'
    ]
  },
  {
    name: 'Recreate test database',
    description: 'Drop and recreate test database',
    requiresConfirmation: true,
    commands: [
      'docker exec -it last-dev-mysql-1 mysql -u root -plast -e "DROP DATABASE IF EXISTS last_test;" && last-scripts localdb init test'
    ]
  },
  {
    name: 'Test',
    description:
      'Prepare the entire setup and run all tests:' +
      '\n  - Delete OpenAPI folders' +
      '\n  - Install and update dependencies' +
      '\n  - Recreate test database' +
      '\n  - Run migrations on test database' +
      '\n  - Generate Kysely type definitions' +
      '\n  - Generate OpenAPI client libraries' +
      '\n  - Run unit and integration test for Server',
    commands: [
      { cmd: 'find . -type d -path "*/src/openapi" -exec rm -rf {} +', cwd: 'server' },
      { cmd: 'yarn install', cwd: 'server' },
      { cmd: 'yarn up', cwd: 'server' },
      'docker exec -it last-dev-mysql-1 mysql -u root -plast -e "DROP DATABASE IF EXISTS last_test;" && last-scripts localdb init test',
      'last-scripts localdb migrate test',
      { cmd: 'yarn kysely-codegen', cwd: 'server' },
      { cmd: 'yarn openapi', cwd: 'server' },
      { cmd: 'yarn test-all', cwd: 'server' }
    ]
  },
  {
    name: 'Launch all',
    description:
      'Launch all services and applications:' +
      '\n  - Kafka' +
      '\n  - Server' +
      '\n  - Support' +
      '\n  - Admin' +
      '\n  - POS',
    commands: [
      '__launch_all__'
    ]
  },
  {
    name: 'Tunnel MySQL',
    description: 'Create SSH tunnel to MySQL',
    commands: [
      'last-scripts tunnel mysql'
    ]
  },
  {
    name: 'Change project root path',
    description: 'Update the Last project root path used by this CLI',
    commands: [
      '__change_project_root__'
    ]
  },
  {
    name: 'Update',
    description: 'Update the Last CLI tool from git repository',
    commands: [
      '__update__'
    ]
  },
  {
    name: 'Help',
    description: 'Show all commands and their descriptions',
    commands: [
      '__help__'
    ]
  },
  {
    name: 'Quit',
    description: 'Exit Last CLI',
    commands: [
      '__exit__'
    ]
  }
]
