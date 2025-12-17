<template>
  <v-app-bar
    class="app-bar"
    flat
  >
    <template #prepend>
      <NuxtLink
        to="/"
        class="ml-4 no-underline flex gap-2 items-center"
      >
        <v-icon
          icon="mdi-check-all"
          size="32"
          class="text-purple-500"
        />

        <span class="text-xl text-transparent font-bold from-blue-500 to-pink-500 via-purple-500 bg-gradient-to-r bg-clip-text">
          TASK HUB
        </span>
      </NuxtLink>
    </template>

    <v-spacer />

    <v-skeleton-loader
      :loading="loading"
      type="list-item"
      width="250"
    >
      <div class="mr-4 flex gap-2 items-center">
        <template v-if="!isLoggedIn">
          <v-btn
            to="/login"
            variant="text"
            class="text-white/80 hover:text-white"
          >
            Login
          </v-btn>

          <v-btn
            to="/register"
            variant="flat"
            color="purple"
            class="rounded-full"
          >
            Register
          </v-btn>
        </template>

        <template v-else>
          <v-menu
            open-on-hover
            :close-on-content-click="false"
          >
            <template #activator="{props}">
              <v-btn
                v-bind="props"
                variant="text"
                class="pa-1 rounded-full h-fit!"
              >
                <v-avatar size="36">
                  <v-img :src="user?.photoUrl || '/default-avatar.webp'" />
                </v-avatar>

                <span class="font-medium ml-2 hidden sm:inline">{{ user?.name }}</span>

                <v-icon
                  icon="mdi-chevron-down"
                  size="20"
                  class="ml-1"
                />
              </v-btn>
            </template>

            <v-card
              min-width="220"
              class="mt-2 rounded-lg"
            >
              <v-card-text class="pb-0">
                <div class="mb-3 flex gap-3 items-center">
                  <v-avatar size="48">
                    <v-img :src="user?.photoUrl || '/default-avatar.webp'" />
                  </v-avatar>

                  <div>
                    <p class="text-base font-bold">
                      {{ user?.name }}
                    </p>

                    <p class="text-sm text-gray-400">
                      {{ user?.email }}
                    </p>
                  </div>
                </div>
              </v-card-text>

              <v-divider />

              <v-list density="compact">
                <v-list-item
                  prepend-icon="mdi-account-outline"
                  to="/profile"
                >
                  Profile
                </v-list-item>

                <v-list-item
                  prepend-icon="mdi-cog-outline"
                  to="/settings"
                >
                  Settings
                </v-list-item>
              </v-list>

              <v-divider />

              <v-list density="compact">
                <v-list-item
                  prepend-icon="mdi-logout"
                  class="text-red-400!"
                  @click="onLogout"
                >
                  Logout
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </template>
      </div>
    </v-skeleton-loader>
  </v-app-bar>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const authStore = useAuthStore()
const { loading } = storeToRefs(authStore)
const isLoggedIn = computed(() => user.value !== null)

function onLogout() {
  authStore.logout()
  navigateTo('/login')
}
</script>

<style scoped>
.app-bar {
  background: rgba(18, 18, 24, 0.8) !important;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
