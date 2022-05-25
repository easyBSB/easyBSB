var fs = require('fs/promises')
var path = require('path')
var os = require('os');

/**
 * @description copy ./dist/apps/web to ./dist/apps/server
 */
async function copyMigrations() {
  const sourceDir = path.resolve(__dirname, '../apps/server/src/typeorm/migrations')
  const targetDir = path.resolve(__dirname, '../dist/apps/server/migrations')

  try {
    await copyDirectory(sourceDir, targetDir)
  } catch (error) {
    process.stderr.write(`could not copy migrations ${os.EOL}`)
    process.stderr.write(`${error} ${os.EOL}`)
    process.exit(1)
  }
}

/**
 * @description copy ./dist/apps/web to ./dist/apps/server
 */
async function copyClient() {
  const sourceDir = path.resolve(__dirname, '../dist/apps/web')
  const targetDir = path.resolve(__dirname, '../dist/apps/server/client')

  try {
    await copyDirectory(sourceDir, targetDir)
  } catch(error) {
    process.stderr.write(`could not copy ./dist/apps/web to ./dist/apps/server/client, ensure to execute 'npm run build web' or 'npm run build:all' before ${os.EOL}`)
    process.stderr.write(`${error} ${os.EOL}`)
    process.exit(1)
  }
}

/**
 * @description copy all content from source directory to target directory same.
 * fs.cp this should copy directorys but yells EISDIR because source is a directory ...
 */
async function copyDirectory(from, to) {
  await fs.mkdir(to, { recursive: true })
  const files = await fs.readdir(from)

  for (const file of files) {
    if (file === '.' || file === '..') {
      continue
    }

    const source = path.join(from, file)
    const target = path.join(to, file)

    if ((await fs.stat(source)).isDirectory()) {
      await copyDirectory(source, target)
      continue
    }

    await fs.copyFile(source, target)
  }
}

copyMigrations()
copyClient()
