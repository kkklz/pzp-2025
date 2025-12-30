<template>
  <v-navigation-drawer permanent>
    <v-list
      v-if="team"
      density="comfortable"
    >
      <v-list-item
        :title="team.name"
        subtitle="Click to view settings"
        :to="`/team/${team.id}`"
      >
        <template #prepend>
          <div class="mr-2">
            <TeamIcon
              :team="team"
              :size="48"
            />
          </div>
        </template>
      </v-list-item>

      <v-divider class="mt-2" />

      <div class="flex w-full justify-between">
        <v-list-subheader>
          Chats
        </v-list-subheader>

        <v-btn
          icon
          size="small"
          variant="plain"
          @click="dialog = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>

      <v-list-item
        v-for="chat in chats"
        :key="chat.id"
        :to="`/team/${team.id}/chat/${chat.id}`"
        @contextmenu.prevent="showContextMenu($event, chat)"
      >
        <span class="font-black"># </span>

        <span>{{ chat.name }}</span>
      </v-list-item>

      <v-menu
        v-model="menuVisible"
        :activator="menuActivator"
        offset-y
      >
        <v-list>
          <v-list-item @click="openRenameDialog">
            <span class="mdi mdi-square-edit-outline" />
            Rename
          </v-list-item>

          <v-list-item
            class="text-error"
            @click="openDeleteDialog"
          >
            <span class="mdi mdi-delete" />
            Delete
          </v-list-item>
        </v-list>
      </v-menu>

      <v-divider class="mt-2" />

      <v-list-subheader>Task Boards</v-list-subheader>

      <v-list-item>
        <span class="font-black">#</span> Test Board 1
      </v-list-item>

      <v-divider class="mt-2" />

      <v-list-subheader>Notes</v-list-subheader>

      <v-list-item>
        <span class="font-black">#</span> Test Notes 1
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <TeamCreateDialog
    v-if="team"
    v-model="dialog"
    type="chat"
    :team-id="team.id"
  />

  <RenameDialog
    v-model="renameDialogVisible"
    :chat="selectedChat"
    @confirm="handleRenameConfirm"
  />

  <ConfirmDialog
    v-model="deleteDialogVisible"
    title="Delete Chat"
    message="Are you sure you want to delete this chat?"
    confirm-text="Delete"
    confirm-color="error"
    @confirm="handleDeleteConfirm"
  />
</template>

<script setup lang="ts">
import type { Chat } from '~/types/chat'

const route = useRoute()
const teamId = route.params.teamId as string
const teamStore = useTeamStore()
const { team } = storeToRefs(teamStore)

const dialog = ref(false)
const chatStore = useChatStore()
const { chats } = storeToRefs(chatStore)

const menuVisible = ref(false)
const menuActivator = ref<Element | undefined>(undefined)
const selectedChat = ref<Chat | null>()

const renameDialogVisible = ref(false)
const deleteDialogVisible = ref(false)

function showContextMenu(event: MouseEvent, chat: Chat) {
  selectedChat.value = chat
  menuVisible.value = true
  menuActivator.value = event.target as Element
}

function openRenameDialog() {
  renameDialogVisible.value = true
  menuVisible.value = false
}

function openDeleteDialog() {
  deleteDialogVisible.value = true
  menuVisible.value = false
}

async function handleRenameConfirm(newName: string) {
  if (selectedChat.value) {
    await chatStore.updateChat(selectedChat.value.id, newName)
    await chatStore.fetchTeamChats(teamId)
    renameDialogVisible.value = false
    navigateTo(`/team/${teamId}/chat/${selectedChat.value.id}`)
  }
}

async function handleDeleteConfirm() {
  if (selectedChat.value) {
    await chatStore.deleteChat(selectedChat.value.id)
    await chatStore.fetchTeamChats(teamId)
    deleteDialogVisible.value = false
    navigateTo(`/team/${teamId}`)
  }
}

onMounted(async () => {
  await teamStore.fetchTeam(teamId)
  await chatStore.fetchTeamChats(teamId)
})
</script>
