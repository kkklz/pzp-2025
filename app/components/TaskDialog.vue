<template>
  <v-dialog
    v-model="isOpen"
    @after-leave="handleClose"
  >
    <v-card class="mx-auto pa-4 max-w-max min-w-[400px]">
      <v-card-title>
        {{ isEditMode
          ? 'Edit Task'
          : 'Create Task' }}
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="formData.title"
            label="Task name"
            required
            :rules="[
              v => !!v || 'Task name is required',
            ]"
          />

          <v-textarea
            v-model="formData.description"
            label="Description"
          />

          <v-text-field
            v-model="formData.due_date"
            type="date"
            label="Due date"
          />

          <v-select
            v-model="formData.status"
            label="Status"
            :items="[
              'Created',
              'Doing',
              'Done',
            ]"
          />

          <UserSelect
            v-model="selectedAssignees"
            :team-id="teamId"
            multiple
            label="Select assignees"
            :selected-ids="unref(selectedAssignees.map(sa => sa.id))"
          />

          <v-card-actions class="d-flex justify-between">
            <v-btn
              @click="handleClose"
            >
              Cancel
            </v-btn>

            <v-btn
              type="submit"
              color="primary"
              variant="flat"
              :loading="loading"
            >
              {{ isEditMode
                ? 'Update task'
                : 'Create task' }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Task } from '~/types/board'
import type User from '~/types/user'

interface Props {
  open: boolean
  teamId: string
  boardId: string
  task?: Task | null
  currentUserId?: string
  currentAssignees?: User[]
  loading?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'save', data: { task: Omit<Task, 'id'>, assignees: User[] }): void
}

const props = withDefaults(defineProps<Props>(), {
  task: null,
  currentUserId: '',
  currentAssignees: () => [],
})

const emit = defineEmits<Emits>()

const isOpen = computed({
  get: () => props.open,
  set: value => emit('update:open', value),
})

const isEditMode = computed(() => !!props.task)

const dateWeekAhead = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().split('T')[0] as string

const formData = ref({
  title: '',
  description: '',
  due_date: dateWeekAhead,
  status: 'Created',
})

const selectedAssignees = ref<User[]>([])

watch(() => props.open, (newVal) => {
  if (newVal && props.task) {
    // Initialize form with existing task data
    const dueDate = (props.task.due_date.includes('T')
      ? props.task.due_date.split('T')[0]
      : props.task.due_date) as string
    formData.value = {
      title: props.task.title,
      description: props.task.description || '',
      due_date: dueDate,
      status: props.task.status,
    }
    selectedAssignees.value = [...(props.currentAssignees || [])]
  }
  else if (newVal) {
    // Reset form for new task
    formData.value = {
      title: '',
      description: '',
      due_date: dateWeekAhead,
      status: 'Created',
    }
    selectedAssignees.value = []
  }
})

watch(() => props.currentAssignees, (newAssignees) => {
  if (props.task && newAssignees) {
    selectedAssignees.value = [...newAssignees]
  }
}, { deep: true })

function handleSubmit() {
  const taskData: Omit<Task, 'id'> = {
    board_id: props.boardId,
    title: formData.value.title,
    description: formData.value.description,
    status: formData.value.status,
    due_date: formData.value.due_date,
    created_by: props.task?.created_by || props.currentUserId || '',
    created_at: props.task?.created_at || new Date().toISOString(),
  }

  emit('save', {
    task: taskData,
    assignees: selectedAssignees.value,
  })
}

function handleClose() {
  isOpen.value = false
  formData.value = {
    title: '',
    description: '',
    due_date: dateWeekAhead,
    status: 'Created',
  }
  selectedAssignees.value = []
}
</script>
