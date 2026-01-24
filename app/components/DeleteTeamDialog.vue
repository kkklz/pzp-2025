<template>
  <v-dialog
    v-model="isOpen"
    max-width="500"
  >
    <v-card class="pa-4">
      <v-card-title>
        <v-icon color="error">
          mdi-alert-circle-outline
        </v-icon>
        {{
          step === 'confirm'
            ? 'Delete Team'
            : 'Confirm Team Name'
        }}
      </v-card-title>

      <v-card-text>
        <div
          v-if="step === 'confirm'"
          class="text-sm"
        >
          <p class="text-red-600 font-semibold mb-3">
            This action cannot be undone.
          </p>

          <p class="mb-4">
            Are you sure you want to delete the team <strong>"{{ teamName }}"</strong>?
          </p>
        </div>

        <div
          v-else
          class="text-sm"
        >
          <p class="mb-3">
            Type the team name to confirm deletion:
          </p>

          <v-text-field
            v-model="confirmName"
            :label="`Team name: ${teamName}`"
            variant="outlined"
            hide-details
            @keyup.enter="handleConfirm"
          />
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn
          variant="text"
          @click="handleCancel"
        >
          Cancel
        </v-btn>

        <v-btn
          v-if="step === 'confirm'"
          color="error"
          variant="flat"
          @click="step = 'verify'"
        >
          Delete
        </v-btn>

        <v-btn
          v-else
          color="error"
          variant="flat"
          :disabled="confirmName !== teamName"
          @click="handleConfirm"
        >
          Delete Team
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Props {
  teamName?: string
}

defineProps<Props>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const isOpen = defineModel<boolean>({ default: false })
const step = ref<'confirm' | 'verify'>('confirm')
const confirmName = ref('')

watch(isOpen, (newVal) => {
  if (newVal) {
    step.value = 'confirm'
    confirmName.value = ''
  }
})

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
  isOpen.value = false
}
</script>
