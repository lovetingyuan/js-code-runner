// Modules to control application life and create native browser window
const { app, BrowserWindow, globalShortcut } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
require('./menu')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.maximize()
  // and load the index.html of the app.
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000/')
    mainWindow.webContents.openDevTools()
    globalShortcut.register('CommandOrControl+R', function () {
      mainWindow.reload()
    })
    globalShortcut.register('CommandOrControl+Shift+R', function () {
      app.relaunch()
      app.exit()
    })
  } else {
    mainWindow.loadFile('dist/web/index.html')
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
