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

      <!-- Chats Section -->
      <div class="flex w-full justify-between">
        <v-list-subheader>
          Chats
        </v-list-subheader>

        <v-btn
          icon
          size="small"
          variant="plain"
          @click="chatDialogVisible = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>

      <v-list-item
        v-for="chat in unref(chatSection.items)"
        :key="chat.id"
        :to="`/team/${team.id}/chat/${chat.id}`"
        @contextmenu.prevent="chatSection.showContextMenu($event, chat)"
      >
        <span class="font-black"># </span>

        <span>{{ chat.name }}</span>
      </v-list-item>

      <v-menu
        :model-value="unref(chatSection.menuVisible)"
        :activator="unref(chatSection.menuActivator)"
        offset-y
        @update:model-value="(v) => {
          chatSection.menuVisible.value = v
        }"
      >
        <v-list>
          <v-list-item @click="chatSection.openRenameDialog()">
            <span class="mdi mdi-square-edit-outline" />
            Rename
          </v-list-item>

          <v-list-item
            class="text-error"
            @click="chatSection.openDeleteDialog()"
          >
            <span class="mdi mdi-delete" />
            Delete
          </v-list-item>
        </v-list>
      </v-menu>

      <v-divider class="mt-2" />

      <!-- Task Boards Section -->
      <div class="flex w-full justify-between">
        <v-list-subheader>
          Task Boards
        </v-list-subheader>

        <v-btn
          icon
          size="small"
          variant="plain"
          @click="boardDialogVisible = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>

      <v-list-item
        v-for="board in unref(boardSection.items)"
        :key="board.id"
        :to="`/team/${team.id}/board/${board.id}`"
        @contextmenu.prevent="boardSection.showContextMenu($event, board)"
      >
        <span class="font-black"># </span>

        <span>{{ board.name }}</span>
      </v-list-item>

      <v-menu
        :model-value="unref(boardSection.menuVisible)"
        :activator="unref(boardSection.menuActivator)"
        offset-y
        @update:model-value="(v) => {
          boardSection.menuVisible.value = v
        }"
      >
        <v-list>
          <v-list-item @click="boardSection.openRenameDialog()">
            <span class="mdi mdi-square-edit-outline" />
            Rename
          </v-list-item>

          <v-list-item
            class="text-error"
            @click="boardSection.openDeleteDialog()"
          >
            <span class="mdi mdi-delete" />
            Delete
          </v-list-item>
        </v-list>
      </v-menu>

      <v-divider class="mt-2" />

      <v-list-subheader>Notes</v-list-subheader>

      <v-list-item>
        <span class="font-black">#</span> Test Notes 1
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <TeamCreateDialog
    v-if="team"
    v-model="chatDialogVisible"
    type="chat"
    :team-id="team.id"
  />

  <TeamCreateDialog
    v-if="team"
    v-model="boardDialogVisible"
    type="board"
    :team-id="team.id"
  />

  <!-- Chat Rename/Delete Dialogs -->
  <RenameDialog
    :model-value="unref(chatSection.renameDialogVisible)"
    :object-name="unref(chatSection.selectedItem)?.name"
    object="Chat"
    :loading="unref(chatSection.isLoading)"
    @update:model-value="(v) => {
      chatSection.renameDialogVisible.value = v
    }"
    @confirm="chatSection.handleRenameConfirm"
  />

  <ConfirmDialog
    :model-value="unref(chatSection.deleteDialogVisible)"
    title="Delete Chat"
    message="Are you sure you want to delete this chat?"
    confirm-text="Delete"
    confirm-color="error"
    @update:model-value="(v) => {
      chatSection.deleteDialogVisible.value = v
    }"
    @confirm="chatSection.handleDeleteConfirm"
  />

  <!-- Board Rename/Delete Dialogs -->
  <RenameDialog
    :model-value="unref(boardSection.renameDialogVisible)"
    :object-name="unref(boardSection.selectedItem)?.name"
    object="Board"
    :loading="unref(boardSection.isLoading)"
    @update:model-value="(v) => {
      boardSection.renameDialogVisible.value = v
    }"
    @confirm="boardSection.handleRenameConfirm"
  />

  <ConfirmDialog
    :model-value="unref(boardSection.deleteDialogVisible)"
    title="Delete Board"
    message="Are you sure you want to delete this board?"
    confirm-text="Delete"
    confirm-color="error"
    @update:model-value="(v) => {
      boardSection.deleteDialogVisible.value = v
    }"
    @confirm="boardSection.handleDeleteConfirm"
  />
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const teamId = route.params.teamId as string
const teamStore = useTeamStore()
const { team } = storeToRefs(teamStore)

const chatDialogVisible = ref(false)
const boardDialogVisible = ref(false)

const chatStore = useChatStore()
const { chats } = storeToRefs(chatStore)

const boardStore = useBoardStore()
const { boards } = storeToRefs(boardStore)

async function handleDeleteChat(chat: any) {
  await chatStore.deleteChat(chat.id)
  // If user is on this chat's page, redirect to team page
  if (route.params.chatId === chat.id) {
    await router.push(`/team/${teamId}`)
  }
}

async function handleDeleteBoard(board: any) {
  await boardStore.deleteBoard(board.id)
  // If user is on this board's page, redirect to team page
  if (route.params.boardId === board.id) {
    await router.push(`/team/${teamId}`)
  }
}

const chatSection = useCollectionSection({
  items: chats,
  onRename: (chat, newName) => chatStore.updateChat(chat.id, newName),
  onDelete: handleDeleteChat,
  onRefetch: () => chatStore.fetchTeamChats(teamId),
})

const boardSection = useCollectionSection({
  items: boards,
  onRename: (board, newName) => boardStore.updateBoard(board.id, newName),
  onDelete: handleDeleteBoard,
  onRefetch: () => boardStore.fetchTeamBoards(teamId),
})

onMounted(async () => {
  await Promise.all([
    teamStore.fetchTeam(teamId),
    chatStore.fetchTeamChats(teamId),
    boardStore.fetchTeamBoards(teamId),
  ])
})
</script>
