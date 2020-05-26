const postcssPlugin = require('rollup-plugin-postcss')
const path = require('path')
const fs = require('fs')
const urlPlugin = require("postcss-url")
const dist = path.resolve(__dirname, 'src/app/monaco')
if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist)
}

const resolve = file => path.posix.join(dist, file)

module.exports = [{
  input: './node_modules/monaco-editor/esm/vs/editor/editor.main.js',
  output: {
    dir: dist,
    format: 'es'
  },
  plugins: [
    postcssPlugin({
      extract: resolve('editor.css'),
      sourceMap: false,
      plugins: [
        urlPlugin({
          url(arg) {
            if (!arg.url.startsWith('data:')) {
              fs.copyFileSync(arg.absolutePath, resolve(arg.pathname))
            }
            return arg.url
          },
          // basePath: path.resolve('node_modules/bootstrap'),
          // assetsPath: path.resolve('monaco'),
          useHash: false
        })
      ]
    })
  ]
}, {
  input: './node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js',
  output: {
    file: resolve('tsWorker.js'),
    format: 'iife'
  }
}, {
  input: './node_modules/monaco-editor/esm/vs/editor/editor.worker.js',
  output: {
    file: resolve('editorWorker.js'),
    format: 'iife'
  }
}];
