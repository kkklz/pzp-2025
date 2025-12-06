<template>
  <v-app theme="dark">
    <AppBar />

    <NuxtPage />
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
let unsubscribe: ReturnType<typeof authStore.setupAuthListener> | null = null

onMounted(() => {
  unsubscribe = authStore.setupAuthListener()
})

onUnmounted(async () => {
  if (unsubscribe) {
    (await unsubscribe)()
  }
})
</script>
