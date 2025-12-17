<template>
  <v-card class="m-8 pa-8">
    <v-card-title>Create a New Team</v-card-title>

    <v-card-text>
      <v-form
        v-model="isFormValid"
        validate-on="lazy"
        @submit.prevent="handleCreateTeam"
      >
        <v-text-field
          v-model="teamName"
          label="Team Name"
          :rules="nameRules"
          required
        />

        <UserSelect
          v-model="selectedUsers"
        />

        <v-btn
          size="large"
          variant="tonal"
          type="submit"
          class="block"
          :disabled="!isFormValid"
        >
          Create Team
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type User from '~/types/user'

const teamStore = useTeamStore()
const userStore = useUserStore()
const { team, error } = storeToRefs(teamStore)
const { user } = storeToRefs(userStore)

const { nameRules } = useValidationRules()

const teamName = ref('')
const isFormValid = ref<boolean | null>(null)
const selectedUsers = ref<User[]>([])
const createLoading = ref(false)

async function handleCreateTeam() {
  createLoading.value = true
  await teamStore.addTeam({ name: teamName.value, created_by: user.value!.id })
  if (error.value) {
    // eslint-disable-next-line no-console
    console.log(error.value)
  }
  await teamStore.addTeamMembers(team.value!.id, selectedUsers.value.map(u => u.id))
  if (error.value) {
    // eslint-disable-next-line no-console
    console.log(error.value)
  }
  createLoading.value = false

  navigateTo('/')
}
</script>
