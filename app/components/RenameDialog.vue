<template>
  <v-dialog
    v-model="isOpen"
    max-width="400"
  >
    <v-card class="pa-4">
      <v-card-title>
        Rename Chat
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="newName"
          label="New Chat Name"
          :rules="[
            v => !!v || 'Name is required',
          ]"
        />
      </v-card-text>

      <v-card-actions>
        <v-btn
          variant="text"
          @click="handleCancel"
        >
          Cancel
        </v-btn>

        <v-btn
          color="primary"
          variant="flat"
          :loading="loading"
          @click="handleConfirm"
        >
          Rename
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Props {
  chat?: any
}

const props = withDefaults(defineProps<Props>(), {
  chat: null,
})

const emit = defineEmits<{
  confirm: [newName: string]
  cancel: []
}>()

const isOpen = defineModel<boolean>({ default: false })
const newName = ref('')
const loading = ref(false)

watch(isOpen, (newVal) => {
  if (newVal && props.chat) {
    newName.value = props.chat.name
  }
})

function handleConfirm() {
  if (newName.value.trim()) {
    emit('confirm', newName.value.trim())
  }
}

function handleCancel() {
  emit('cancel')
  isOpen.value = false
}
</script>
