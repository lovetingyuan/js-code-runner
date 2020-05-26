<template>
  <div class="editor-container" :style="{backgroundColor: themeColor}" ref="editorContainerRef"></div>
</template>

<script>
import "../monaco/editor.css";
import * as monaco from "../monaco/editor.main.js";
import { ref, onMounted, onBeforeUnmount } from "vue";

globalThis.MonacoEnvironment = globalThis.MonacoEnvironment || {
  getWorkerUrl(moduleId, label) {
    // if (label === "json") {
    //   return "./json.worker.js";
    // }
    // if (label === "css") {
    //   return "./css.worker.js";
    // }
    // if (label === "html") {
    //   return "./html.worker.js";
    // }
    if (label === "typescript" || label === "javascript") {
      return "../monaco/tsWorker.js";
    }
    return "../monaco/editorWorker.js";
  }
};
console.log("monaco", monaco);
const monacoEditorOptions = {
  // value: this.value,
  language: "javascript",
  theme: 'vs-dark',
  tabSize: 2,
  renderWhitespace: true,
  fontSize: 18,
  lineHeight: 30,
  letterSpacing: 0.5,
  minimap: {
    enabled: false
  },
  showUnused: true
};
export default {
  name: "MonacoEditor",
  setup(props, { emit }) {
    const themeColor = ref("");
    const editorContainerRef = ref(null);
    let editorIns;
    const resizeEditor = () => {
      editorIns?.layout();
    };
    onMounted(() => {
      editorIns = monaco.editor.create(editorContainerRef.value, {
        ...monacoEditorOptions,
        value: ""
      });
      console.log("editor", editorIns);
      editorIns.onDidChangeModelContent(e => {
        const code = editorIns.getValue();
        // this.value = code
        emit("change", code);
        // this.$emit('change', this.code)
      });
      themeColor.value = editorIns._themeService
        .getTheme()
        .colors.get("editor.background")
        .toString();
      window.addEventListener("resize", resizeEditor);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("resize", resizeEditor);
      editorIns.dispose();
    });
    return {
      themeColor,
      editorContainerRef,
      resizeEditor
    };
  }
};
</script>

<style>
.editor-container {
  height: 99vh;
  border: 1px solid #aaa;
  box-sizing: border-box;
}
.monaco-editor {
  margin-top: 1.2em;
}
</style>
