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
}>()

const model = defineModel<boolean>({ required: true })
const { type, teamId } = toRefs(props)

const chatStore = useChatStore()

const name = ref('')
const isFormValid = ref<boolean | null>(null)
const { teamNameRules } = useValidationRules()

async function handleCreate() {
  if (type.value === 'chat') {
    await chatStore.addChat({ name: name.value, team_id: teamId.value })
    await chatStore.fetchTeamChats(teamId.value)
  }
}
</script>
