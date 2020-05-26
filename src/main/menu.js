
const isMac = process.platform === 'darwin'
const { app, Menu } = require('electron')

const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  // { role: 'viewMenu' }
  {
    role: 'about',
    submenu: [
      {
        label: 'Website',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://github.com/lovetingyuan/js-code-runner')
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
