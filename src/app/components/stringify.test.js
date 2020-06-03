const undefMark = Math.random()
const nanMark = Math.random()
const infMark = Math.random()
const negInfMark = Math.random()
const markMap = Object.create(null)
function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false

  let proto = Object.getPrototypeOf(obj)
  // 1. edge case Object.create(null)
  if (proto === null) return true
  let baseProto = proto

  while (Object.getPrototypeOf(baseProto) !== null) {
    baseProto = Object.getPrototypeOf(baseProto)
  }
  // 2. 原型链第一个和最后一个比较
  return proto === baseProto
}

const _string = (value, indent = 2) => {
  let init = true
  // primitive: undefined, null, string, number, boolean, symbol, bigint
  if (value === undefined) {
    markMap[undefMark] = 'undefined'
    return undefMark
  }
  if (value === null || typeof value === 'string' || typeof value === 'boolean') {
    return value
  }
  if (typeof value === 'number') {
    if (isNaN(value)) {
      markMap[nanMark] = 'NaN'
      return nanMark
    }
    if (value === Infinity) {
      markMap[infMark] = 'Infinity'
      return infMark
    }
    if (value === -Infinity) {
      markMap[negInfMark] = '-Infinity'
      return negInfMark
    }
    return value
  }

  if (typeof value === 'symbol') {
    const mark = Math.random()
    markMap[mark] = value.toString()
    return mark
  }

  if (typeof value === 'bigint') {
    const mark = Math.random()
    markMap[mark] = value + 'n'
    return mark
  }
  // object: function, class, {}, [], Date, Map, Set, WeakMap, WeakSet, Proxy
  if (typeof value === 'function') {
    const mark = Math.random()
    markMap[mark] = value.toString()
    return mark
  }
  if (value instanceof Date) {
    // console.log(value)
    // const mark = Math.random()
    // markMap[mark] = `Date(${value})`
    // return mark
    return value
  }
  if (Array.isArray(value) || isPlainObject(value)) {
    let val
    try {
      val = JSON.stringify(value, (k, v) => {
        if (init) {
          init = false
          return v
        }
        return _string(v, indent + 2)
      }, indent)
      const last = val[val.length - 1]
      if (last === '}' || last === ']') {
        val = val.slice(0, -1) + ''.padStart(indent - 2, ' ') + last
      }
    } catch (err) {
      val = err.message
    }
    const mark = Math.random()
    markMap[mark] = val
    return mark
  }
  try {
    return JSON.stringify(value, null, indent)
  } catch (err) {
    return err.message
  }
}
const stringify = (collection) => {
  let result = collection.map(vals => {
    if (!vals.length) {
      return '\n'
    }
    return vals.map(val => _string(val)).join('\n')
  }).join('\n\n')
  let done = false
  while(!done) {
    Object.keys(markMap).forEach(id => {
      result = result.replace(id, markMap[id])
    })
    done = !Object.keys(markMap).find(id => result.includes(id))
  }
  return result
}
const collection = [];

const log = (...args) => {
  collection.push(args)
}
debugger
log({
  a: 341,
  b: [{
    a: 'sdfs',
    sdfs: [3423, null, Symbol('sdfsd'), new Date, false, undefined]
  }, [
    32432n, 'dsfsd'
  ]],
}, 7789n, undefined)
console.log(stringify(collection))


