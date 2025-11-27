import { Command } from './types'

export const commands: Command[] = [
  {
    name: 'Delete OpenAPI',
    description: 'Delete all OpenAPI generated files',
    command: 'find . -type d -path "*/src/openapi" -exec rm -rf {} +',
    requiresConfirmation: true
  },
  {
    name: 'Migrate Dev',
    description: 'Run migrations on dev database',
    command: 'last-scripts localdb migrate dev'
  },
  {
    name: 'Migrate Test',
    description: 'Run migrations on test database',
    command: 'last-scripts localdb migrate test'
  },
  {
    name: 'Recreate Database Dev',
    description: 'Drop and recreate dev database',
    command: 'docker exec -it last-dev-mysql-1 mysql -u root -plast -e "DROP DATABASE IF EXISTS last_dev;" && last-scripts localdb init dev',
    requiresConfirmation: true
  },
  {
    name: 'Recreate Database Test',
    description: 'Drop and recreate test database',
    command: 'docker exec -it last-dev-mysql-1 mysql -u root -plast -e "DROP DATABASE IF EXISTS last_test;" && last-scripts localdb init test',
    requiresConfirmation: true
  },
  {
    name: 'Run All',
    description: 'Run all services',
    command: 'last_run_all'
  },
  {
    name: 'Run Local',
    description: 'Run local setup',
    command: '~/work/last-app/other-last-app/personal/runner/run-last.sh'
  },
  {
    name: 'Run Tests',
    description: 'Run tests',
    command: 'last_run_tests'
  },
  {
    name: 'Tunnel MySQL',
    description: 'Create SSH tunnel to MySQL',
    command: 'last-scripts tunnel mysql'
  },
  {
    name: 'Change Last project root path',
    description: 'Update the project root path used by this CLI',
    command: '__change_project_root__'
  },
  {
    name: 'Quit',
    description: 'Exit the program',
    command: 'exit'
  }
]
