var fs = require('fs/promises')
var path = require('path')

const sourceDir = path.resolve(__dirname, '../apps/server/src/typeorm/migrations')
const targetDir = path.resolve(__dirname, '../dist/apps/server/migrations')

// copy all migrations
async function copyMigrations() {
  await fs.mkdir(path.resolve(targetDir), { recursive: true })
  const migrations = await fs.readdir(sourceDir)

  for (const migration of migrations) {
    if (migration === '.' || migration === '..') {
      continue;
    }

    const source = path.join(sourceDir, migration)
    const target = path.join(targetDir, migration)

    await fs.copyFile(source, target)
  }
}

copyMigrations()
