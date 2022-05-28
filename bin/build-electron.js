const { fchownSync } = require('fs')
var fs = require('fs/promises')
var path = require('path')
var electronBuilder = require('electron-builder')

async function createElectronApp() {
  const source = path.resolve(__dirname, '../dist/apps/easybsb-server/package.json')
  const target = path.resolve(__dirname, `../dist/apps/easybsb-electron/package.json`)

  await fs.copyFile(source, target)
  await updatePackageJson(target)

  await electronBuilder.build({
    config: {
      removePackageScripts: true,
      files: [
        {
          from: path.resolve(__dirname, '..', 'dist/apps/easybsb-server'),
          to: 'easy-bsb',
          filter: ['!package.json'],
        },
        {
          from: path.resolve(__dirname, '..', 'dist/apps/easybsb-electron'),
          to: '',
          filter: ['!dist', '!node_modules,', '**/*.js', '**/*.js.map', 'package.json']
        }
      ],
      directories: {
        output: path.resolve(__dirname, '../dist/electron'),
        app: path.resolve(__dirname, '../dist/apps/easybsb-electron'),
        buildResources: (__dirname, '../dist/tmp/electron')
      },
    }
  })
}

/**
 * merge root packageJSON data into new generated package.json file
 * to use title, description, overrides and the electron devDependency
 * we need to build the project otherwise installation will fail directly
 */
async function updatePackageJson(source) {
  const rootPackageJson = path.resolve(__dirname, '..', 'package.json')
  const packageJson = JSON.parse(await fs.readFile(source))

  const {devDependencies, overrides} = JSON.parse(await fs.readFile(rootPackageJson))
  const update = Object.assign(
    {},
    packageJson,
    {
      overrides: {
        ...(packageJson.overrides ?? {}),
        ...overrides
      },
      devDependencies: {
        ...packageJson.devDependencies,
        electron: devDependencies.electron ?? '19.0.1'
      }
    }
  );

  fs.writeFile(source, JSON.stringify(update, null, 2))
}

createElectronApp()
