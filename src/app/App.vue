<template>
  <div id="code">
    <MonacoEditor v-if="showEditor" ref="editorRef" @change="onCodeChange"></MonacoEditor>
  </div>
  <div id="result">
    <pre ref="resultRef"></pre>
  </div>
</template>

<script>
import MonacoEditor from "./components/MonacoEditor.vue";
import Split from "split.js";
import { ref, onMounted, onBeforeUnmount, nextTick, reactive } from 'vue'

const setup = () => {
  const code = ref('var a = 324')
  const showEditor = ref(false)
  const editorRef = ref(null)
  const resultRef = ref(null)
  const logCollection = ref([])

  const log = (...args) => {
    logCollection.value.push(args)
  }

  window.__log = log // prevent minifier remove log

  const onCodeChange = _code => {
    if (typeof _code === 'string') {
      logCollection.value.length = 0
      try {
        eval(`(function(){${_code}})()`)
      } catch (err) {
        logCollection.value.length = 0
        resultRef.value.textContent = err.message
        return
      }
      const funcMap = {}
      const voidMark = Math.random()
      const symbolMap = {}
      let result = logCollection.value.map(vals => {
        return vals.map(val => {
          if (typeof val === 'function') {
            return val.toString()
          }
          if (val && typeof val === 'object') {
            return JSON.stringify(val, (k, v) => {
              if (typeof v === 'undefined') {
                return voidMark
              }
              if (typeof v === 'function') {
                const id = Math.random()
                funcMap[id] = v.toString()
                return id
              }
              if (typeof v === 'symbol') {
                const id = Math.random()
                symbolMap[id] = v.toString()
                return id
              }
              return v
            }, 2)
          }
          return val
        }).join('\n')
      }).join('\n\n')
      Object.keys(funcMap).forEach(id => {
        result = result.replace(id, funcMap[id])
      })
      Object.keys(symbolMap).forEach(id => {
        result = result.replace(id, symbolMap[id])
      })
      result = result.replace(new RegExp(voidMark, 'g'), 'undefined')
      resultRef.value.textContent = result
    }
  }
  let splitins
  onMounted(() => {
    splitins = Split(["#code", "#result"], {
      sizes: [61.8, 100 - 61.8],
      onDragEnd: () => {
        editorRef.value.resizeEditor();
      }
    });
    nextTick(() => {
      // delay to render editor
      showEditor.value = true;
    });
  })
  onBeforeUnmount(() => {
    splitins && splitins.destroy()
  })
  return {
    showEditor,
    code,
    onCodeChange,
    editorRef,
    resultRef
  }
}
export default {
  name: "App",
  components: {
    MonacoEditor
  },
  setup,
};
</script>

<style>
body,
html {
  height: 100%;
}
#code {
  height: 100%;
  display: inline-block;
  overflow: hidden;
}
#result {
  height: 100%;
  display: inline-block;
  background-color: antiquewhite;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 2em 2em;
  box-sizing: border-box;
}
.gutter {
  background-color: #eee;
  background-repeat: no-repeat;
  background-position: 50%;
  display: inline-block;
  height: 100%;
}

.gutter.gutter-horizontal {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==");
  cursor: col-resize;
}

.gutter.gutter-vertical {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=");
  cursor: row-resize;
}
</style>
