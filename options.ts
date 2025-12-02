import { Option } from './types'

export const options: Option[] = [
  {
    id: 'id:tunnel-mysql',
    name: 'Tunnel MySQL',
    description: 'Create SSH tunnel to MySQL',
    commands: [
      'last-scripts tunnel mysql'
    ]
  },
  {
    id: 'id:test',
    name: 'Test',
    description:
      'Prepare the entire setup and run all tests:' +
      '\n  - Delete OpenAPI folders' +
      '\n  - Install and update dependencies' +
      '\n  - Recreate test database' +
      '\n  - Run migrations on test database' +
      '\n  - Generate Kysely type definitions' +
      '\n  - Generate OpenAPI client libraries' +
      '\n  - Run all unit and integration test',
    commands: [
      { cmd: 'find . -type d -path "*/src/openapi" -exec rm -rf {} +', cwd: 'server' },
      { cmd: 'yarn install', cwd: 'server' },
      { cmd: 'yarn up', cwd: 'server' },
      'docker exec -it last-dev-mysql-1 mysql -u root -plast -e "DROP DATABASE IF EXISTS last_test;"',
      'last-scripts localdb init test',
      'last-scripts localdb migrate test',
      { cmd: 'yarn kysely-codegen', cwd: 'server' },
      { cmd: 'yarn openapi', cwd: 'server' },
      'yarn test'
    ]
  },
  {
    id: 'id:launch-all',
    name: 'Launch all',
    description:
      'Launch all services and applications:' +
      '\n  - Kafka' +
      '\n  - Server' +
      '\n  - Support' +
      '\n  - Admin' +
      '\n  - POS',
    commands: [
      'cmd:launch-all'
    ]
  },
  {
    id: 'id:start-docker',
    name: 'Start local Docker services',
    description:
      'Start local Docker services required for applications to work:' +
      '\n  - MySql' +
      '\n  - Redis' +
      '\n  - Mosquitto' +
      '\n  - Kafka' +
      '\n  - Kafka UI' +
      '\n  - CubeJS',
    commands: [
      { cmd: 'docker compose pull', cwd: 'last-dev' },
      { cmd: 'docker compose up -d', cwd: 'last-dev' }
    ]
  },
  {
    id: 'id:delete-events',
    name: 'Delete local Kafka events',
    description: 'Delete all Kafka events from all topics',
    commands: [
      `docker exec -i last-dev-kafka-1 /opt/bitnami/kafka/bin/kafka-delete-records.sh --bootstrap-server localhost:9092 --offset-json-file /dev/stdin <<EOF
      {
        "partitions": [
          { "topic": "background-tasks",  "partition": 0, "offset": -1 },
          { "topic": "integrated-orders", "partition": 0, "offset": -1 },
          { "topic": "internal-events",   "partition": 0, "offset": -1 },
          { "topic": "sync-events",       "partition": 0, "offset": -1 }
        ],
        "version": 1
      }
      EOF`
    ]
  },
  {
    id: 'id:delete-openapi',
    name: 'Delete OpenAPI',
    description: 'Delete all OpenAPI generated files',
    commands: [
      { cmd: 'find . -type d -path "*/src/openapi" -exec rm -rf {} +', cwd: 'server' }
    ]
  },
  {
    id: 'id:migrate-dev',
    name: 'Migrate dev',
    description: 'Run migrations on dev database',
    commands: [
      'last-scripts localdb migrate dev'
    ]
  },
  {
    id: 'id:migrate-test',
    name: 'Migrate test',
    description: 'Run migrations on test database',
    commands: [
      'last-scripts localdb migrate test'
    ]
  },
  {
    id: 'id:recreate-dev-database',
    name: 'Recreate dev database',
    description: 'Drop and recreate dev database',
    requiresConfirmation: true,
    commands: [
      'docker exec -it last-dev-mysql-1 mysql -u root -plast -e "DROP DATABASE IF EXISTS last_dev;"',
      'last-scripts localdb init dev'
    ]
  },
  {
    id: 'id:recreate-test-database',
    name: 'Recreate test database',
    description: 'Drop and recreate test database',
    requiresConfirmation: true,
    commands: [
      'docker exec -it last-dev-mysql-1 mysql -u root -plast -e "DROP DATABASE IF EXISTS last_test;"',
      'last-scripts localdb init test'
    ]
  },
  {
    id: 'id:change-project-root',
    name: 'Change project root path',
    description: 'Update the Last project root path used by this CLI',
    commands: [
      'cmd:change-project-root'
    ]
  },
  {
    id: 'id:update',
    name: 'Update',
    description: 'Update the Last CLI tool from git repository',
    commands: [
      { cmd: 'git pull origin master', cwd: '__cli_dir__' },
      { cmd: 'npm install', cwd: '__cli_dir__' },
      'cmd:set-last-update-date'
    ]
  },
  {
    id: 'id:help',
    name: 'Help',
    description: 'Show all commands and their descriptions',
    commands: [
      'cmd:help'
    ]
  },
  {
    id: 'id:exit',
    name: 'Quit',
    description: 'Exit Last CLI',
    commands: [
      'cmd:exit'
    ]
  }
]
