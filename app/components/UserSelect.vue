<template>
  <v-autocomplete
    v-model="selectedUsersIds"
    label="Select Users"
    :items="users"
    item-title="name"
    item-value="id"
    :loading="usersLoading"
    autocomplete="off"
    chips
    closable-chips
    multiple
  >
    <template #chip="{props, item}">
      <v-chip
        v-bind="props"
        :prepend-avatar="item.raw.photoUrl || '/default-avatar.webp'"
        :text="item.raw.name"
      />
    </template>

    <template #[`item`]="{props, item}">
      <v-list-item
        v-bind="props"
        :prepend-avatar="item.raw.photoUrl || '/default-avatar.webp'"
        :text="item.raw.name"
      />
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
import type User from '~/types/user'

const { selectedIds } = defineProps<{
  selectedIds?: string[]
}>()

const selectedUsers = defineModel<User[]>({ required: true })
const userStore = useUserStore()
const { users, loading: usersLoading } = storeToRefs(userStore)

const selectedUsersIds = ref<string[]>([])

onBeforeMount(async () => {
  await userStore.fetchUsers()
  if (selectedIds) {
    selectedUsersIds.value = selectedIds
  }
})

watch(selectedUsersIds, () => {
  selectedUsers.value = users.value.filter(u => selectedUsersIds.value.includes(u.id))
}, { immediate: true })
</script>
