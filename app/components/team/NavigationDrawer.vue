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
      >
        <span class="font-black"># </span>

        <span>{{ chat.name }}</span>
      </v-list-item>

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
</template>

<script setup lang="ts">
const route = useRoute()
const teamId = route.params.teamId as string
const teamStore = useTeamStore()
const { team } = storeToRefs(teamStore)

const dialog = ref(false)
const chatStore = useChatStore()
const { chats } = storeToRefs(chatStore)

onMounted(async () => {
  await teamStore.fetchTeam(teamId)
  await chatStore.fetchTeamChats(teamId)
})
</script>
