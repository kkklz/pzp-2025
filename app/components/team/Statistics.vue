<template>
  <v-card
    :loading="loading"
    variant="flat"
  >
    <h2 class="text-2xl tracking-wider py-4">
      Team Statistics
    </h2>

    <v-row>
      <v-col
        cols="6"
        sm="3"
      >
        <div class="stat-card pa-4 text-center">
          <v-icon
            size="32"
            color="primary"
            class="mb-2"
          >
            mdi-account-group
          </v-icon>

          <div class="text-h4 font-weight-bold">
            {{ membersCount }}
          </div>

          <div class="text-caption text-medium-emphasis">
            Members
          </div>
        </div>
      </v-col>

      <v-col
        cols="6"
        sm="3"
      >
        <div class="stat-card pa-4 text-center">
          <v-icon
            size="32"
            color="success"
            class="mb-2"
          >
            mdi-chat
          </v-icon>

          <div class="text-h4 font-weight-bold">
            {{ chatsCount }}
          </div>

          <div class="text-caption text-medium-emphasis">
            Chats
          </div>
        </div>
      </v-col>

      <v-col
        cols="6"
        sm="3"
      >
        <div class="stat-card pa-4 text-center">
          <v-icon
            size="32"
            color="warning"
            class="mb-2"
          >
            mdi-clipboard-list
          </v-icon>

          <div class="text-h4 font-weight-bold">
            {{ boardsCount }}
          </div>

          <div class="text-caption text-medium-emphasis">
            Task Boards
          </div>
        </div>
      </v-col>

      <v-col
        cols="6"
        sm="3"
      >
        <div class="stat-card pa-4 text-center">
          <v-icon
            size="32"
            color="info"
            class="mb-2"
          >
            mdi-note-text
          </v-icon>

          <div class="text-h4 font-weight-bold">
            {{ notesCount }}
          </div>

          <div class="text-caption text-medium-emphasis">
            Notes
          </div>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  teamId: string
}

const props = defineProps<Props>()

const teamStore = useTeamStore()
const chatStore = useChatStore()
const boardStore = useBoardStore()
const noteStore = useNoteStore()

const { teamMembers } = storeToRefs(teamStore)
const { chats } = storeToRefs(chatStore)
const { boards } = storeToRefs(boardStore)
const { notes } = storeToRefs(noteStore)

const loading = ref(false)

const membersCount = computed(() => teamMembers.value.length)
const chatsCount = computed(() => chats.value.length)
const boardsCount = computed(() => boards.value.length)
const notesCount = computed(() => notes.value.length)

onMounted(async () => {
  loading.value = true
  await Promise.all([
    teamStore.fetchTeamMembers(props.teamId),
    chatStore.fetchTeamChats(props.teamId),
    boardStore.fetchTeamBoards(props.teamId),
    noteStore.fetchTeamNotes(props.teamId),
  ])
  loading.value = false
})
</script>

<style scoped>
.stat-card {
  background-color: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 8px;
}
</style>
