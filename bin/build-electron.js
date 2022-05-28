const { fchownSync } = require('fs')
var fs = require('fs/promises')
var path = require('path')
var electronBuilder = require('electron-builder')

async function createElectronApp() {
  const source = path.resolve(__dirname, '../dist/apps/easybsb-server/package.json')
  const target = path.resolve(__dirname, `../dist/apps/easybsb-electron/package.json`)

  await fs.copyFile(source, target)

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

createElectronApp()
