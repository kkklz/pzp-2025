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

      <v-list-subheader>Chats</v-list-subheader>

      <v-list-item to="/">
        <span class="font-black">#</span> Test Chat 1
      </v-list-item>

      <v-divider class="mt-2" />

      <v-list-subheader>Task Boards</v-list-subheader>

      <v-list-item to="/">
        <span class="font-black">#</span> Test Board 1
      </v-list-item>

      <v-divider class="mt-2" />

      <v-list-subheader>Notes</v-list-subheader>

      <v-list-item to="/">
        <span class="font-black">#</span> Test Notes 1
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const route = useRoute()
const teamId = route.params.teamId as string
const teamStore = useTeamStore()
const { team } = storeToRefs(teamStore)

onMounted(async () => {
  await teamStore.fetchTeam(teamId)
})
</script>
