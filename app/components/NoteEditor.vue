<!-- eslint-disable vue/no-v-html -->
<template>
  <v-card
    class="note-editor"
    :loading="saving"
  >
    <v-card-title class="d-flex align-center">
      <v-text-field
        v-model="editableTitle"
        variant="plain"
        density="compact"
        hide-details
        class="note-title-input font-weight-bold"
        placeholder="Note title"
        @blur="saveTitle"
        @keydown.enter="saveTitle"
      />

      <v-btn-toggle
        v-model="viewMode"
        mandatory
        density="compact"
        class="mr-2"
      >
        <v-btn
          value="edit"
          size="small"
        >
          <v-icon>mdi-pencil</v-icon>

          <v-tooltip
            activator="parent"
            location="bottom"
          >
            Edit
          </v-tooltip>
        </v-btn>

        <v-btn
          value="preview"
          size="small"
        >
          <v-icon>mdi-eye</v-icon>

          <v-tooltip
            activator="parent"
            location="bottom"
          >
            Preview
          </v-tooltip>
        </v-btn>
      </v-btn-toggle>

      <v-btn
        icon
        size="small"
        variant="text"
        :loading="saving"
        @click="saveContent"
      >
        <v-icon>mdi-content-save</v-icon>

        <v-tooltip
          activator="parent"
          location="bottom"
        >
          Save
        </v-tooltip>
      </v-btn>
    </v-card-title>

    <v-divider />

    <v-card-text class="pa-0 flex-grow-1">
      <v-textarea
        v-if="viewMode === 'edit'"
        v-model="editableContent"
        variant="plain"
        class="note-content-input"
        placeholder="Start writing your note...

          Formatting:
          # Header 1
          ## Header 2
          ### Header 3
          **bold text**
          *italic text*
          ~~strikethrough~~
          `inline code`"
        auto-grow
        rows="15"
        hide-details
        @blur="saveContent"
      />

      <div
        v-else
        class="note-preview mt-4 pa-4"
        v-html="renderedContent"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Note } from '~/types/note'

interface Props {
  note: Note
  saving?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  saveTitle: [title: string]
  saveContent: [content: string]
}>()

const editableTitle = ref('')
const editableContent = ref('')
const viewMode = ref<'edit' | 'preview'>('preview')

// Watch for external note changes
watch(() => props.note, (newNote) => {
  editableTitle.value = newNote.title
  editableContent.value = newNote.content ?? ''
}, { immediate: true, deep: true })

// Simple markdown parser
const renderedContent = computed(() => {
  const html = editableContent.value
    // Escape HTML first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers (must be at start of line)
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Strikethrough
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    // Inline code
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Line breaks
    .replace(/\n/g, '<br>')

  return html
})

function saveTitle() {
  if (editableTitle.value === props.note.title)
    return

  emit('saveTitle', editableTitle.value)
}

function saveContent() {
  if (editableContent.value === (props.note.content ?? ''))
    return
  emit('saveContent', editableContent.value)
}
</script>

<style scoped>
.note-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.note-title-input :deep(input) {
  font-size: 1.5rem;
  font-weight: bold;
}

.note-content-input :deep(textarea) {
  font-size: 1rem;
  line-height: 1.6;
  padding: 16px;
}

.note-preview {
  font-size: 1rem;
  min-height: 300px;
}

.note-preview :deep(h1) {
  font-size: 2rem;
  font-weight: bold;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.note-preview :deep(h2) {
  font-size: 1.5rem;
  font-weight: bold;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.note-preview :deep(h3) {
  font-size: 1.25rem;
  font-weight: bold;
}

.note-preview :deep(strong) {
  font-weight: bold;
}

.note-preview :deep(em) {
  font-style: italic;
}

.note-preview :deep(del) {
  text-decoration: line-through;
}

.note-preview :deep(code) {
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-family: monospace;
}
</style>
