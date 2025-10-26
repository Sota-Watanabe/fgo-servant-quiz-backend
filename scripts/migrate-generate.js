#!/usr/bin/env node

/**
 * Helper script to wrap the TypeORM CLI `migration:generate` command.
 * Ensures the migrations directory exists and provides clearer error messages
 * when a migration name is missing.
 */

const { spawnSync } = require('node:child_process');
const { existsSync, mkdirSync } = require('node:fs');
const { resolve, join } = require('node:path');

const args = process.argv.slice(2);
const envName = process.env.npm_config_name || process.env.NAME;
let providedName = envName;

if (!providedName) {
  const positional = args.find((arg) => !arg.startsWith('-'));
  if (positional) {
    providedName = positional;
  }
}

if (!providedName) {
  console.error(
    'Migration name is required.\n' +
      'Usage: npm run migrate:generate -- --name=AddProfileQuiz\n' +
      '   or: npm run migrate:generate -- AddProfileQuiz',
  );
  process.exit(1);
}

const safeName = providedName.replace(/[/\\]/g, '');
if (!safeName) {
  console.error('Invalid migration name.');
  process.exit(1);
}

const projectRoot = resolve(__dirname, '..');
const migrationsDir = resolve(projectRoot, 'src/database/migrations');
const dataSourcePath = resolve(projectRoot, 'src/database/typeorm.config.ts');

if (!existsSync(migrationsDir)) {
  mkdirSync(migrationsDir, { recursive: true });
}

const targetPath = join(migrationsDir, safeName);

const cliBinary =
  process.platform === 'win32'
    ? resolve(projectRoot, 'node_modules/.bin/typeorm-ts-node-commonjs.cmd')
    : resolve(projectRoot, 'node_modules/.bin/typeorm-ts-node-commonjs');

const passthroughOptions = [];
for (let i = 0; i < args.length; i += 1) {
  const current = args[i];

  if (current === '-n' || current === '--name') {
    i += 1; // Skip the value that follows
    continue;
  }

  if (current.startsWith('--name=')) {
    continue;
  }

  if (!current.startsWith('-') && current === providedName) {
    continue;
  }

  passthroughOptions.push(current);
}

const child = spawnSync(
  cliBinary,
  [
    'migration:generate',
    targetPath,
    '-d',
    dataSourcePath,
    ...passthroughOptions,
  ],
  {
    stdio: 'inherit',
  },
);

if (child.error) {
  console.error(child.error.message);
  process.exit(child.status ?? 1);
}

process.exit(child.status ?? 0);
