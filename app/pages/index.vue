<template>
  <div
    v-if="user"
    class="mt-10 md:mx-8 sm:mx-1 lg:mx-48!"
  >
    <div class="mb-10 p-6 rounded-md shadow-xl from-blue-600 to-pink-500 via-purple-600 bg-gradient-to-r">
      <div class="flex gap-4 items-center">
        <div>
          <h1 class="text-4xl text-white tracking-wide font-light">
            Welcome to <span class="font-black">TASK HUB</span>,
          </h1>

          <p class="text-4xl tracking-wider font-extrabold mt-2">
            {{ user.name }}
          </p>

          <p class="text-sm text-white/70 mt-2">
            Ready to conquer your tasks today?
          </p>
        </div>
      </div>
    </div>

    <v-card class="pa-6">
      <div class="mb-6 flex items-center justify-between">
        <div class="flex gap-3 items-center">
          <v-icon
            icon="mdi-account-group"
            size="28"
            class="text-purple-400"
          />

          <h2 class="text-2xl font-bold">
            Your Teams
          </h2>
        </div>

        <v-btn
          variant="flat"
          color="primary"
          to="/newteam"
          prepend-icon="mdi-plus"
        >
          New Team
        </v-btn>
      </div>

      <v-divider class="mb-6" />

      <div
        v-if="teamsLoading"
        class="flex flex-wrap gap-4"
      >
        <v-skeleton-loader
          v-for="i in 3"
          :key="i"
          type="avatar, text"
          width="120"
        />
      </div>

      <div
        v-else-if="teams && teams.length > 0"
        class="gap-4 grid grid-cols-1 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4"
      >
        <NuxtLink
          v-for="team in teams"
          :key="team.id"
          class="bg-surface-light p-4 rounded-md flex flex-col gap-3 cursor-pointer transition-all ease-in items-center hover-opacity-80 hover:shadow-lg"
          :to="`/team/${team.id}`"
        >
          <TeamIcon
            :team="team"
            :size="56"
          />

          <span class="text-sm font-medium text-center w-full truncate">
            {{ team.name }}
          </span>
        </NuxtLink>
      </div>

      <div
        v-else
        class="py-12 text-center"
      >
        <v-icon
          icon="mdi-account-group-outline"
          size="64"
          class="text-gray-500 mb-4"
        />

        <p class="text-lg text-gray-400 mb-2">
          No teams yet
        </p>

        <p class="text-sm text-gray-500">
          Create your first team to get started!
        </p>
      </div>
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
