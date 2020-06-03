<template>
  <div id="code">
    <MonacoEditor v-if="showEditor" ref="editorRef" @change="onCodeChange"></MonacoEditor>
  </div>
  <div id="result">
    <pre v-for="ret of results" :key="ret">{{ret}}</pre>
  </div>
  <CodeSandbox :code="code" @change="onResult"></CodeSandbox>
</template>

<script>
import MonacoEditor from "./components/MonacoEditor.vue";
import CodeSandbox from './components/CodeSandbox.vue';
import Split from "split.js";
import { ref, onMounted, onBeforeUnmount, nextTick, reactive } from 'vue'

const setup = () => {
  const code = ref('var a = 324')
  const showEditor = ref(false)
  const editorRef = ref(null)
  const results = ref([])

  const onCodeChange = _code => {
    if (typeof _code === 'string') {
      code.value = `(function(){${_code}})()`
    }
  }

  const onResult = ret => {
    if (typeof ret === 'string') {
      results.value = [ret]
    } else {
      results.value = ret
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
    results,
    onResult
  }
}
export default {
  name: "App",
  components: {
    MonacoEditor,
    CodeSandbox
  },
  setup,
};
</script>

<style>
body,
html {
  height: 100%;
}
#app {
  height: 100%;
  overflow: hidden;
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
  overflow: auto;
  padding: 2em 2em;
  box-sizing: border-box;
}
#result pre {
  border-bottom: 1px solid skyblue;
  padding-bottom: 10px;
  padding-left: 12px;
  padding-right: 12px;;
  margin: 24px 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe WPC", "Segoe UI",
    HelveticaNeue-Light, Ubuntu, "Droid Sans", sans-serif;
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
