<template>
  <v-dialog
    v-model="isOpen"
    max-width="400"
  >
    <v-card class="pa-4">
      <v-card-title>
        <v-icon :color="iconColor">
          {{ icon }}
        </v-icon>
        {{ title }}
      </v-card-title>

      <v-card-text>
        {{ message }}
      </v-card-text>

      <v-card-actions>
        <v-btn
          variant="text"
          @click="handleCancel"
        >
          {{ cancelText }}
        </v-btn>

        <v-btn
          :color="confirmColor"
          variant="flat"
          :loading="loading"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  confirmColor?: string
  icon?: string
  iconColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Are you sure?',
  message: 'This action cannot be undone.',
  confirmText: 'Yes',
  cancelText: 'No',
  confirmColor: 'error',
  icon: 'mdi-alert-circle-outline',
  iconColor: 'error',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const { title, message, confirmText, cancelText, confirmColor, icon, iconColor } = toRefs(props)

const isOpen = defineModel<boolean>({ default: false })
const loading = ref(false)

function handleConfirm() {
  emit('confirm')
  isOpen.value = false
}

function handleCancel() {
  emit('cancel')
  isOpen.value = false
}
</script>
