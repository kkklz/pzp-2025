<template>
  <div
    v-if="user"
    class="mt-10 md:mx-8 sm:mx-1 lg:mx-48!"
  >
    <h1
      class="text-4xl mb-8"
    >
      Welcome to TASK HUB,
      <br>

      <span class="font-extrabold">{{ user.name }}</span>
    </h1>

    <v-card
      class="pa-8"
      :loading="teamsLoading"
    >
      <v-card-title>
        <h2 class="text-3xl mb-4">
          Your Teams
        </h2>
      </v-card-title>

      <v-divider />

      <div
        v-if="teams"
        class="rounded-lg flex flex-row flex-wrap gap-4"
      >
        <NuxtLink
          v-for="team in teams"
          :key="team.id"
          class="pa-4 text-center rounded-lg flex flex-col gap-2 w-30 cursor-pointer transition-opacity ease-in items-center justify-center hover:opacity-80"
          :to="`/team/${team.id}`"
        >
          <TeamIcon
            :team="team"
            :size="60"
          />

          <span class="block">
            {{ team.name }}
          </span>
        </NuxtLink>
      </div>

      <v-divider />

      <v-card-actions class="mt-4">
        <v-btn
          variant="tonal"
          to="/newteam"
        >
          Create New Team
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
// const authStore = useAuthStore()
const teamStore = useTeamStore()

const { user } = storeToRefs(userStore)
// const { loading: authLoading } = storeToRefs(authStore)
const { teams, loading: teamsLoading } = storeToRefs(teamStore)

watch(user, async (newUser) => {
  if (newUser) {
    await teamStore.fetchUserTeams(newUser.id)
  }
}, { immediate: true })
</script>
