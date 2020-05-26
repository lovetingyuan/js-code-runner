const { moduleTransformMap } = require('./package.json')

const wrapUmdToEsm = code => {
  return `
  const module = {
    exports: {}
  };
  ${code};
  const defaultExport = module.exports;
  export default defaultExport;
  `
}

const ThirdModulePrefix = '/@modules/'

module.exports = {
  transforms: [
    {
      test: (path, query) => {
        if (path.startsWith(ThirdModulePrefix)) {
          const modulePath = path.substr(ThirdModulePrefix.length)
          if (modulePath in moduleTransformMap) return true
        }
        return false
      },
      transform: (code, isImport, isBuild, path, query) => {
        const moduleType = moduleTransformMap[path.substr(ThirdModulePrefix.length)]
        if (moduleType === 'umd' || moduleType === 'commonjs') {
          return wrapUmdToEsm(code)
        }
        return code
      }
    }
  ]
}
