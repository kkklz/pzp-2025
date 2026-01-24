<template>
  <TeamPage>
    <v-alert
      v-if="error"
      type="error"
      closable
    >
      {{ error.message }}
    </v-alert>

    <v-skeleton-loader
      v-if="loading"
      type="card"
    />

    <NoteEditor
      v-else-if="note"
      :note="note"
      :saving="saving"
      @save-title="handleSaveTitle"
      @save-content="handleSaveContent"
    />
  </TeamPage>
</template>

<script setup lang="ts">
const loading = ref(false)
const saving = ref(false)

const route = useRoute()
const teamId = route.params.teamId as string
const noteId = route.params.noteId as string

const teamStore = useTeamStore()

const noteStore = useNoteStore()
const { note, error } = storeToRefs(noteStore)

async function handleSaveTitle(title: string) {
  saving.value = true
  await noteStore.updateNote(noteId, { title })
  await noteStore.fetchTeamNotes(teamId)
  saving.value = false
}

async function handleSaveContent(content: string) {
  saving.value = true
  await noteStore.updateNote(noteId, { content: content || '' })
  saving.value = false
}

onBeforeMount(async () => {
  loading.value = true
  await Promise.all([
    noteStore.fetchNoteById(noteId),
    teamStore.fetchTeamMembers(teamId),
  ])

  if (!note.value) {
    await navigateTo('/error')
  }
  loading.value = false
})
</script>
