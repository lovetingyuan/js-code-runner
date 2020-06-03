<template>
  <iframe ref="iframeRef" :srcdoc="srcDoc" hidden></iframe>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import dedent from 'dedent'

const stringify = () => {
  const undefMark = Math.random()
  const nanMark = Math.random()
  const infMark = Math.random()
  const negInfMark = Math.random()
  const markMap = Object.create(null)
  function isPlainObject(obj) {
    if (typeof obj !== 'object' || obj === null) return false
    let proto = Object.getPrototypeOf(obj)
    if (proto === null) return true
    let baseProto = proto

    while (Object.getPrototypeOf(baseProto) !== null) {
      baseProto = Object.getPrototypeOf(baseProto)
    }
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
    // if (value instanceof Date) {
    //   return value + '_' + value.getTime()
    // }
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
    return collection.map(vals => {
      if (!vals.length) {
        return '\n'
      }
      return vals.map(val => _string(val)).join('\n')
    }).map(result => {
      let done = false
      while (!done) {
        Object.keys(markMap).forEach(id => {
          result = result.replace(id, markMap[id])
        })
        done = !Object.keys(markMap).find(id => result.includes(id))
      }
      return result
    })
  }
  return stringify
}

const scriptEndTag = '</' + 'script>' // prevent sfc parse error
const setup = (props, { emit }) => {
  const iframeRef = ref(null)
  const srcDoc = ref('')
  onMounted(() => {
    window.addEventListener('message', (evt) => {
      if (evt.data && evt.data.type === 'code_result') {
        emit('change', evt.data.payload)
      }
    })
  })
  watch(
    () => props.code,
    (code) => {
      const _code = dedent`
    window.log = (...args) => {
      log.collection.push(args)
    }
    log.collection = [];
    log.stringify = (STRINGIFY)();
    window.onerror = (err) => {
      window.parent.postMessage({
        type: 'code_result',
        payload: err.message
      }, '*')
    }
    try {
      ${props.code};
      window.parent.postMessage({
        type: 'code_result',
        payload: log.stringify(log.collection)
      }, '*')
    } catch (err) {
      // console.error(err)
      window.parent.postMessage({
        type: 'code_result',
        payload: err.message
      }, '*')
    }
    `
      srcDoc.value = '<script>' + _code.replace('STRINGIFY', stringify.toString()) + scriptEndTag
    },
    {
      immediate: true
    }
  )

  return {
    iframeRef,
    srcDoc
  }
}

export default {
  name: 'CodeSandbox',
  setup,
  props: {
    code: String
  }
}
</script>
