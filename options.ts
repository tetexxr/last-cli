import { Option } from './types'

export const options: Option[] = [
  {
    name: 'Delete OpenAPI',
    description: 'Delete all OpenAPI generated files',
    requiresConfirmation: true,
    commands: [
      'find . -type d -path "*/src/openapi" -exec rm -rf {} +'
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
      '\n  - And run unit and integration test for Server',
    commands: [
      'last_run_tests'
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
      '~/work/last-app/other-last-app/personal/runner/run-last.sh'
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
    name: 'Help',
    description: 'Show all commands and their descriptions',
    commands: [
      '__help__'
    ]
  },
  {
    name: 'Quit',
    description: 'Exit the program',
    commands: [
      '__exit__'
    ]
  }
]
