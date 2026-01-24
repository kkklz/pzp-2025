<template>
  <v-dialog
    v-model="model"
    max-width="600px"
  >
    <v-card>
      <v-card-title>Create {{ type }}</v-card-title>

      <v-form
        v-model="isFormValid"
        validate-on="lazy"
        @submit.prevent="handleCreate"
      >
        <v-card-text>
          <v-text-field
            v-model="name"
            :label="`${type.charAt(0).toUpperCase() + type.slice(1)} Name`"
            required
            :rules="teamNameRules"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            text
            @click="model = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="primary"
            :disabled="!isFormValid"
            type="submit"
            @click="model = false"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: 'chat' | 'board' | 'notes'
  teamId: string
  onConfirm?: (name: string) => Promise<void>
}>()

const model = defineModel<boolean>({ required: true })
const { type, teamId, onConfirm } = toRefs(props)

const chatStore = useChatStore()
const boardStore = useBoardStore()

const name = ref('')
const isFormValid = ref<boolean | null>(null)
const isLoading = ref(false)
const { teamNameRules } = useValidationRules()

async function handleCreate() {
  if (!isFormValid.value)
    return

  isLoading.value = true
  try {
    // If custom onConfirm is provided, use it
    if (onConfirm?.value) {
      await onConfirm.value(name.value)
    }
    else {
      // Default handlers for built-in types
      if (type.value === 'chat') {
        await chatStore.addChat({ name: name.value, team_id: teamId.value })
        await chatStore.fetchTeamChats(teamId.value)
      }
      else if (type.value === 'board') {
        await boardStore.addBoard({ name: name.value, team_id: teamId.value })
        await boardStore.fetchTeamBoards(teamId.value)
      }
    }
    model.value = false
    name.value = ''
  }
  finally {
    isLoading.value = false
  }
}
</script>
