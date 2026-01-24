<template>
  <v-autocomplete
    v-model="selectedUsersIds"
    :label="label"
    :items="availableUsers"
    item-title="name"
    item-value="id"
    :loading="loading"
    autocomplete="off"
    chips
    closable-chips
    :multiple="multiple"
  >
    <template #chip="{'props': chipProps, item}">
      <v-chip
        v-bind="chipProps"
        :prepend-avatar="item.raw.photoUrl || '/default-avatar.webp'"
        :text="item.raw.name"
      />
    </template>

    <template #[`item`]="{'props': itemProps, item}">
      <v-list-item
        v-bind="itemProps"
        :prepend-avatar="item.raw.photoUrl || '/default-avatar.webp'"
        :text="item.raw.name"
      />
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
import type User from '~/types/user'

interface Props {
  label?: string
  selectedIds?: string[]
  multiple?: boolean
  teamId?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Select Users',
})

const selectedUsers = defineModel<User | User[]>({ required: true })
const userStore = useUserStore()
const teamStore = useTeamStore()
const { users } = storeToRefs(userStore)
const { teamMembers } = storeToRefs(teamStore)

const selectedUsersIds = ref<string[]>([])
const loading = ref(false)

const availableUsers = computed(() => {
  // Jeśli teamId jest podane, filtruj użytkowników do członków teamu
  if (props.teamId) {
    const teamMemberIds = teamMembers.value
      .filter(m => m.team_id === props.teamId)
      .map(m => m.user_id)

    return users.value.filter(u => teamMemberIds.includes(u.id))
  }

  return users.value
})

onBeforeMount(async () => {
  loading.value = true
  try {
    await userStore.fetchUsers()
    // if (props.teamId) {
    //   await teamStore.fetchTeamMembers(props.teamId)
    // }
  }
  finally {
    loading.value = false
  }

  if (props.selectedIds) {
    selectedUsersIds.value = props.selectedIds
  }
})

watch(selectedUsersIds, () => {
  const selected = users.value.filter(u => selectedUsersIds.value.includes(u.id))
  if (props.multiple) {
    selectedUsers.value = selected
  }
  else {
    selectedUsers.value = selected[0] || ({} as User)
  }
}, { immediate: true })
</script>
