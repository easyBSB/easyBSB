var fs = require('fs/promises')
var path = require('path')
var os = require('os');
const { exec } = require('child_process');

/**
 * @description copy ./dist/apps/easybsb-client to ./dist/apps/server
 */
async function copyMigrations() {
  const sourceDir = path.resolve(__dirname, '../apps/easybsb-server/src/typeorm/migrations')
  const targetDir = path.resolve(__dirname, '../dist/apps/easybsb-server/migrations')

  try {
    await copyDirectory(sourceDir, targetDir)
  } catch (error) {
    process.stderr.write(`could not copy migrations ${os.EOL}`)
    process.stderr.write(`${error} ${os.EOL}`)
    process.exit(1)
  }
}

/**
 * @description copy ./dist/apps/easybsb-client to ./dist/apps/server
 */
async function copyClient() {
  const sourceDir = path.resolve(__dirname, '../dist/apps/easybsb-client')
  const targetDir = path.resolve(__dirname, '../dist/apps/easybsb-server/client')

  try {
    await copyDirectory(sourceDir, targetDir)
  } catch(error) {
    process.stderr.write(`could not copy ./dist/apps/easybsb-client to ./dist/apps/server/client, ensure to execute 'npm run build easybsb-client' or 'npm run build:all' before ${os.EOL}`)
    process.stderr.write(`${error} ${os.EOL}`)
    process.exit(1)
  }
}

/**
 * @description make server executable so we can run via npx for example
 */
async function makeExecutable() {
  // create bin directory on server
  fs.mkdir(path.resolve(__dirname, '../dist/apps/easybsb-server/bin'), { recursive: true })

  // move executable file to server dist directory
  fs.copyFile(
    path.resolve(__dirname, '../apps/easybsb-server/src/bin/easybsb.js'),
    path.resolve(__dirname, '../dist/apps/easybsb-server/bin/easybsb.js')
  )

  // update package.json to add bin property to manifest
  const packageJsonPath = path.resolve(__dirname, '../dist/apps/easybsb-server/package.json')
  const fileContent = JSON.parse(await fs.readFile(packageJsonPath))

  const newContent = {
    ...fileContent,
    name: 'easybsb',
    dependencies: {
      ...fileContent.dependencies,
      '@oclif/core': '1.9.0'
    },
    bin: { 'easybsb': './bin/easybsb.js' }
  }

  await fs.writeFile(packageJsonPath, JSON.stringify(newContent, null, 2));
}

/**
 * @description create tar.gz file for later use
 */
async function createPackageFile() {
  const sourceDir = path.resolve(__dirname, '../dist/apps/easybsb-server')
  const outDir = path.resolve(__dirname, `../dist/package`)
  const outFile = path.resolve(outDir, 'easybsb.tar.gz')
  
  await fs.mkdir(outDir, { recursive: true })

  await new Promise((resolve, reject) => {
    const process = exec(`tar -C ${sourceDir} -cvf ${outFile} .`)
    process.on('exit', () => resolve())
  })
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

/**
 * copy all migration files
 */
copyMigrations()

/**
 * copy client for serve static
 */
copyClient()
/**
 * ensure it is executable
 */
makeExecutable()
/**
 * create local package file
 */
createPackageFile()
