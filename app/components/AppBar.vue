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
      width="100"
    >
      <v-btn
        v-if="!isLoggedIn"
        to="/login"
      >
        Login
      </v-btn>

      <v-btn
        v-if="!isLoggedIn"
        to="/register"
      >
        Register
      </v-btn>

      <v-btn
        v-if="isLoggedIn"
        @click="onLogout"
      >
        Logout
      </v-btn>

      <span
        v-if="isLoggedIn"
        class="font-bold m-4"
      >
        {{ user?.name }}
      </span>
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

onMounted(() => {
  loading.value = true
})
</script>
