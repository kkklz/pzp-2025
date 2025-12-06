<template>
  <v-app-bar>
    <v-app-bar-title>
      <NuxtLink to="/">
        TASK HUB
      </NuxtLink>
    </v-app-bar-title>

    <v-skeleton-loader
      :loading="loading"
      type="list-item"
      width="350"
    >
      <v-list class="flex">
        <v-list-item
          v-if="!isLoggedIn"
          to="/login"
        >
          Login
        </v-list-item>

        <v-list-item
          v-if="!isLoggedIn"
          to="/register"
        >
          Register
        </v-list-item>

        <v-list-item
          v-if="isLoggedIn"
          class="font-bold m-4"
          :prepend-avatar="user?.photoUrl || '/default-avatar.webp'"
        >
          {{ user?.name }}
          <v-list-item-subtitle>
            {{ user?.email }}
          </v-list-item-subtitle>

          <v-menu
            activator="parent"
            density="compact"
          >
            <v-list density="compact">
              <v-list-item
                v-if="isLoggedIn"
                @click="onLogout"
              >
                Logout
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item>
      </v-list>
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
