import { Command } from './types'

export const commands: Command[] = [
  {
    name: 'Delete OpenAPI',
    description: 'Delete all OpenAPI generated files',
    command: 'find . -type d -path "*/src/openapi" -exec rm -rf {} +',
    requiresConfirmation: true
  },
  {
    name: 'Migrate dev',
    description: 'Run migrations on dev database',
    command: 'last-scripts localdb migrate dev'
  },
  {
    name: 'Migrate test',
    description: 'Run migrations on test database',
    command: 'last-scripts localdb migrate test'
  },
  {
    name: 'Recreate dev database',
    description: 'Drop and recreate dev database',
    command:
      'docker exec -it last-dev-mysql-1 mysql -u root -plast -e "DROP DATABASE IF EXISTS last_dev;" && last-scripts localdb init dev',
    requiresConfirmation: true
  },
  {
    name: 'Recreate test database',
    description: 'Drop and recreate test database',
    command:
      'docker exec -it last-dev-mysql-1 mysql -u root -plast -e "DROP DATABASE IF EXISTS last_test;" && last-scripts localdb init test',
    requiresConfirmation: true
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
      '\n  - And run unit and integration test for Server',
    command: 'last_run_tests'
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
    command: '~/work/last-app/other-last-app/personal/runner/run-last.sh'
  },
  {
    name: 'Tunnel MySQL',
    description: 'Create SSH tunnel to MySQL',
    command: 'last-scripts tunnel mysql'
  },
  {
    name: 'Change project root path',
    description: 'Update the Last project root path used by this CLI',
    command: '__change_project_root__'
  },
  {
    name: 'Quit',
    description: 'Exit the program',
    command: 'exit'
  }
]
