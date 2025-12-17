<template>
  <TeamPage>
    <v-card
      v-if="team && teamMembersLoaded"
      class="pa-8"
    >
      <v-card-title>
        <div class="flex gap-4 items-center">
          <TeamIcon
            :size="80"
            :team="team"
          />

          <h1 class="text-4xl tracking-wider font-bold">
            Team Overview
          </h1>
        </div>
      </v-card-title>

      <v-card-text
        class="flex flex-col gap-4 max-w-220"
      >
        <h2 class="text-2xl tracking-wider py-4">
          Settings
        </h2>

        <div class="flex gap-2 items-center">
          <v-text-field
            v-model="teamName"
            label="Team Name"
            variant="outlined"
            :disabled="!teamNameEdit"
            hide-details
          />

          <v-btn
            hide-details
            variant="tonal"
            :color="teamNameEdit
              ? 'green'
              : 'primary'"
            :icon="teamNameEdit
              ? 'mdi-check-bold'
              : 'mdi-pencil'"
            @click="teamNameEdit = !teamNameEdit"
          />
        </div>

        <div
          v-if="teamMembersLoaded"
          class="flex gap-2 items-center"
        >
          <UserSelect
            v-model="teamMembers"
            :selected-ids="teamStore.teamMembers.map(member => member.user_id)"
            :disabled="!teamMembersEdit"
            variant="outlined"
            hide-details
            label="Team Members"
          />

          <v-btn
            hide-details
            variant="tonal"
            :color="teamMembersEdit
              ? 'green'
              : 'primary'"
            :icon="teamMembersEdit
              ? 'mdi-check-bold'
              : 'mdi-pencil'"
            @click="teamMembersEdit = !teamMembersEdit"
          />
        </div>

        <h2 class="text-2xl tracking-wider py-4">
          Statistics
        </h2>

        <span>TODO</span>
      </v-card-text>
    </v-card>
  </TeamPage>
</template>

<script setup lang="ts">
import type User from '~/types/user'

const route = useRoute()
const teamId = route.params.id as string

const teamStore = useTeamStore()
const { team } = storeToRefs(teamStore)

const teamName = ref('')
const teamNameEdit = ref(false)
const teamMembersEdit = ref(false)
const teamMembers = ref<User[]>([])
const teamMembersLoaded = ref(false)
const teamMembersLoading = ref(false)

onMounted(async () => {
  teamMembersLoading.value = true

  await teamStore.fetchTeam(teamId)
  if (team.value) {
    teamName.value = team.value.name
  }

  await teamStore.fetchTeamMembers(teamId)
  teamMembersLoading.value = false

  teamMembersLoaded.value = true
})

watch(teamNameEdit, async (newVal) => {
  if (!newVal && team.value && teamName.value !== team.value.name) {
    await teamStore.updateTeam(team.value.id, { name: teamName.value })
  }
})

watch(teamMembersEdit, async (newVal) => {
  if (!newVal && team.value) {
    const selectedUserIds = teamMembers.value.map(u => u.id)
    const currentMemberIds = teamStore.teamMembers.map(m => m.user_id)

    if (selectedUserIds.sort().toString() === currentMemberIds.sort().toString()) {
      return
    }

    const usersToAdd = selectedUserIds.filter(id => !currentMemberIds.includes(id))
    const usersToRemove = currentMemberIds.filter(id => !selectedUserIds.includes(id))

    await teamStore.addTeamMembers(team.value.id, usersToAdd)
    await teamStore.removeTeamMembers(team.value.id, usersToRemove)
  }
})
</script>
