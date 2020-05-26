<template>
  <div id="code">
    <MonacoEditor v-if="showEditor" ref="editorRef" @change="onCodeChange"></MonacoEditor>
  </div>
  <div id="result">
    <pre>{{ codeResult }}</pre>
  </div>
</template>

<script>
import MonacoEditor from "./components/MonacoEditor.vue";
import Split from "split.js";
import { ref, onMounted, onBeforeUnmount, nextTick, reactive } from 'vue'
import serialize from 'serialize-javascript'

export default {
  name: "App",
  components: {
    MonacoEditor
  },
  setup() {
    const code = ref('var a = 324')
    const showEditor = ref(false)
    const editorRef = ref(null)
    const codeResult = ref('/* code result */')
    const logCollection = ref([])

    const log = (...args) => {
      logCollection.value.push(args)
    }

    const onCodeChange = _code => {
      if (typeof _code === 'string') {
        logCollection.value.length = 0
        try {
          eval(`(function(){${_code}})()`)
        } catch (err) {
          logCollection.value.length = 0
          codeResult.value = err.message
          return
        }
        codeResult.value = logCollection.value.map(vals => {
          return vals.map(v => {
            if (v && typeof v === 'object') {
              return serialize(v, { space: 2 })
            }
            return v
          }).join(' ')
        }).join('\n')
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
      splitins?.destroy()
    })
    return {
      showEditor,
      code,
      codeResult,
      onCodeChange,
      editorRef
    }
  },
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
