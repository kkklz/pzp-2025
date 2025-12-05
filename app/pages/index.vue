<!-- eslint-disable no-console -->
<!-- eslint-disable vue/html-button-has-type -->
<template>
  <div>
    <div
      id="toolbar"
      class="ql-toolbar-custom"
    >
      <span class="ql-formats">
        <select class="ql-header">
          <option value="1">Header 1</option>

          <option value="2">Header 2</option>

          <option selected>Normal</option>
        </select>

        <button
          class="ql-bold"
          aria-label="Bold"
        />

        <button
          class="ql-italic"
          aria-label="Italic"
        />

        <button
          class="ql-underline"
          aria-label="Underline"
        />

        <button
          class="ql-code-block"
          aria-label="Code"
        />

        <button
          class="ql-list"
          value="ordered"
          aria-label="Ordered list"
        />

        <button
          class="ql-list"
          value="bullet"
          aria-label="Bullet list"
        />
      </span>
    </div>

    <div
      ref="quillEditor"
      class="text-lg! font-sans!"
    />
  </div>
</template>

<script setup>
import Quill from 'quill'
import { onMounted, ref } from 'vue'
import 'quill/dist/quill.bubble.css'

const quillEditor = ref(null)
const content = ref('')

onMounted(() => {
  if (quillEditor.value) {
    const quill = new Quill(quillEditor.value, {
      theme: 'bubble',
      modules: {
        toolbar: {
          container: '#toolbar',
        },
      },
    })

    // Ustaw początkową wartość
    content.value = quill.root.innerHTML

    // Aktualizuj content przy każdej zmianie
    quill.on('text-change', () => {
      content.value = quill.root.innerHTML
    })
  }
})

watch(content, (newContent) => {
  // eslint-disable-next-line no-console
  console.log('Zawartość edytora:', newContent)
})
</script>

<style scoped>
.ql-toolbar-custom {
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 10;
}
.ql-toolbar-custom .ql-formats {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: rgb(var(--v-theme-surface));
  border-radius: 12px;
  width: 100%;
}
.ql-toolbar-custom button,
.ql-toolbar-custom select {
  border: none;
  background: transparent;
  padding: 7px 12px;
  border-radius: 10px;
  color: #e3e6ee;
  font-size: 1rem;
  transition: background 0.2s, color 0.2s;
  outline: none;
}
.ql-toolbar-custom button:hover,
.ql-toolbar-custom select:hover,
.ql-toolbar-custom .ql-active,
.ql-toolbar-custom button.ql-active {
  background: #1565c0;
  color: #fff;
}
.ql-toolbar-custom .ql-formats button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5em;
  height: 1.5em;
  padding: 3px;
}
.ql-toolbar-custom .ql-formats svg {
  width: 80%;
  height: 80%;
  fill: #e3e6ee;
  transition: fill 0.2s;
}
.ql-toolbar-custom button:hover svg,
.ql-toolbar-custom button.ql-active svg {
  fill: #fff;
}
.ql-toolbar-custom select {
  background: #23272e;
  color: #e3e6ee;
  border-radius: 10px;
  padding-right: 16px;
  height: 1.2em;
  font-size: 1em;
  display: flex;
  align-items: center;
  vertical-align: middle;
}
.ql-toolbar-custom select:focus {
  box-shadow: 0 0 0 8px #1565c0;
  background: #23272e;
}
</style>

<style>
.ql-bubble, .ql-tooltip {
  background: none !important;
}

.ql-picker-options {
  background: #23272e !important;
  border-radius: 0 0 10px 10px !important;
  padding-top: 20px !important;
  opacity: 80%;
}
</style>
