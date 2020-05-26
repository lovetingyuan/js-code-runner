// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.Api = {
  get process () {
    return process
  },
  get electron () {
    return require('electron')
  },
  get Env () {
    return JSON.stringify(process.env, null, 2)
  },
  reload () {
    const { remote } = require('electron')
    remote.app.relaunch()
    remote.app.exit()
  }
}
