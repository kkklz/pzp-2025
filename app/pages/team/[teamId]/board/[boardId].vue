<template>
  <TeamPage>
    <v-alert
      v-if="error"
      type="error"
      closable
    >
      {{ error.message }}
    </v-alert>

    <v-card
      height="80vh"
      class="d-flex flex-column"
      :loading="loading"
    >
      <v-card-title class="d-flex px-6 py-5 items-center justify-between">
        <div class="d-flex gap-4 items-center">
          <div class="p-2 rounded-xl">
            <v-icon
              icon="mdi-clipboard-list"
              size="28"
              color="primary"
            />
          </div>

          <div>
            <h2 class="text-xl tracking-wide font-bold">
              {{ board?.name || "Board" }}
            </h2>

            <p class="text-sm text-gray-400">
              {{ tasks.length }} {{ tasks.length === 1
                ? 'task'
                : 'tasks' }}
            </p>
          </div>
        </div>

        <v-btn
          prepend-icon="mdi-plus"
          color="primary"
          variant="flat"
          rounded="lg"
          @click="handleOpenCreateTask"
        >
          New Task
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6 gap-6 grid grid-cols-3 h-full w-full items-start overflow-y-auto">
        <v-card
          v-for="task in tasks"
          :key="task.id"
          variant="elevated"
          class="min-h-[420px] bg-[#121218cc]!"
          :class="[
            `border-l-4! border-l-${getStatusColor(task.status)}`,
          ]"
          :style="{'borderLeftColor': getStatusColorHex(task.status)}"
        >
          <!-- Header with gradient based on status -->
          <div
            class="px-4 py-3"
            :style="{'background': `linear-gradient(135deg, ${getStatusColorHex(task.status)}20 0%, transparent 100%)`}"
          >
            <div class="d-flex gap-2 items-start justify-between">
              <h3 class="text-lg font-semibold flex-1 line-clamp-2">
                {{ task.title }}
              </h3>

              <v-btn
                variant="text"
                density="compact"
                size="small"
                icon
              >
                <v-icon
                  icon="mdi-dots-vertical"
                  size="20"
                />

                <v-menu activator="parent">
                  <v-list density="compact">
                    <v-list-item
                      link
                      prepend-icon="mdi-pencil-outline"
                      @click="handleOpenEditTask(task)"
                    >
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>

                    <v-list-item
                      link
                      class="text-error"
                      prepend-icon="mdi-delete-outline"
                      @click="handleOpenDeleteTask(task)"
                    >
                      <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-btn>
            </div>

            <!-- Status chip -->
            <v-chip
              :text="task.status"
              size="small"
              :color="getStatusColor(task.status)"
              variant="flat"
              class="font-medium mt-2"
            >
              <template #prepend>
                <v-icon
                  :icon="getStatusIcon(task.status)"
                  size="14"
                  class="mr-1"
                />
              </template>
            </v-chip>
          </div>

          <v-divider />

          <v-card-text class="pa-4">
            <!-- Due date section -->
            <div class="d-flex mb-4 gap-2 items-center">
              <v-icon
                icon="mdi-calendar-clock"
                size="18"
                :color="isOverdue(task.due_date)
                  ? 'error'
                  : 'grey'"
              />

              <span
                class="text-sm"
                :class="isOverdue(task.due_date)
                  ? 'text-error font-medium'
                  : 'text-gray-400'"
              >
                {{ formatDueDate(task.due_date) }}
              </span>

              <v-chip
                v-if="isOverdue(task.due_date)"
                size="x-small"
                color="error"
                variant="tonal"
              >
                Overdue
              </v-chip>
            </div>

            <!-- Description -->
            <div class="my-4">
              <div class="d-flex mb-2 gap-1 items-center">
                <v-icon
                  icon="mdi-text"
                  size="16"
                  color="grey"
                />

                <span class="text-xs text-gray-500 tracking-wide uppercase">Description</span>
              </div>

              <p class="text-sm leading-relaxed rounded-lg max-h-[180px] min-h-[80px] overflow-y-auto">
                {{ task.description || 'No description provided' }}
              </p>
            </div>

            <!-- Assignees -->
            <div
              v-if="getTaskAssignees(task.id).value.length > 0"
              class="mb-4"
            >
              <div class="d-flex mb-2 gap-1 items-center">
                <v-icon
                  icon="mdi-account-group"
                  size="16"
                  color="grey"
                />

                <span class="text-xs text-gray-500 tracking-wide uppercase">Assignees</span>
              </div>

              <div class="d-flex flex-wrap gap-2">
                <v-chip
                  v-for="assignee in getTaskAssignees(task.id).value"
                  :key="assignee.id"
                  size="small"
                  variant="tonal"
                  color="primary"
                >
                  <template #prepend>
                    <v-avatar
                      :image="getAssigneePhotoUrl(assignee.user_id)"
                      size="20"
                      class="mr-1"
                    />
                  </template>
                  {{ getAssigneeUserName(assignee.user_id) }}
                </v-chip>
              </div>
            </div>
          </v-card-text>

          <!-- Footer with creator info -->
          <v-divider />

          <div class="d-flex bg-surface-variant/30 pa-3 items-center justify-between">
            <div class="d-flex gap-2 items-center">
              <v-tooltip
                :text="`Created by ${getTaskCreatorName(task.created_by)}`"
                location="bottom"
              >
                <template #activator="{props}">
                  <v-avatar
                    :image="getTaskCreatorPhotoUrl(task.created_by)"
                    size="24"
                    v-bind="props"
                  />
                </template>
              </v-tooltip>

              <span class="text-xs text-gray-500">
                {{ getTaskCreatorName(task.created_by) }}
              </span>
            </div>

            <span class="text-xs text-gray-400">
              {{ formatCreatedDate(task.created_at) }}
            </span>
          </div>
        </v-card>
      </v-card-text>
    </v-card>
  </TeamPage>

  <TaskDialog
    :open="showTaskDialog"
    :task="selectedTask"
    :team-id="teamId"
    :board-id="boardId"
    :current-user-id="currentUserTeamMemberId"
    :current-assignees="currentAssignees"
    :loading="boardStore.loading"
    @update:open="showTaskDialog = $event"
    @save="handleSaveTask"
  />

  <ConfirmDialog
    v-model="showDeleteDialog"
    title="Delete Task"
    message="Are you sure you want to delete this task?"
    confirm-text="Delete"
    confirm-color="error"
    @confirm="handleDeleteTask"
    @update:model-value="(v) => {
      showDeleteDialog = v
    }"
  />
</template>

<script setup lang="tsx">
import type { Task } from '~/types/board'
import type User from '~/types/user'

const boardStore = useBoardStore()
const { board, tasks, loading, error, taskAssignees } = storeToRefs(boardStore)
const teamStore = useTeamStore()
const { teamMembers } = storeToRefs(teamStore)
const userStore = useUserStore()
const { user, users } = storeToRefs(userStore)

const route = useRoute()
const router = useRouter()
const boardId = route.params.boardId as string
const teamId = route.params.teamId as string

const showTaskDialog = ref(false)
const selectedTask = ref<Task | null>(null)
const currentUserTeamMemberId = ref('')

const showDeleteDialog = ref(false)

function getTaskCreatorPhotoUrl(taskCreatedById: string): string {
  // Find the team_member record with this ID
  const teamMember = teamMembers.value.find(m => m.id === taskCreatedById)
  if (!teamMember)
    return '/default-avatar.webp'

  // Find the user with this user_id
  const taskCreator = users.value.find(u => u.id === teamMember.user_id)
  if (!taskCreator)
    return '/default-avatar.webp'

  return taskCreator.photoUrl || '/default-avatar.webp'
}

function getTaskCreatorName(taskCreatedById: string): string {
  const teamMember = teamMembers.value.find(m => m.id === taskCreatedById)
  if (!teamMember)
    return 'A'

  const taskCreator = users.value.find(u => u.id === teamMember.user_id)
  if (!taskCreator)
    return 'B'

  return taskCreator.name || 'C'
}

function getTaskAssignees(taskId: string) {
  return computed(() => taskAssignees.value.filter(ta => ta.task_id === taskId))
}

function getAssigneePhotoUrl(userId: string): string {
  const assigneeUser = users.value.find(u => u.id === userId)
  if (!assigneeUser)
    return '/default-avatar.webp'

  return assigneeUser.photoUrl || '/default-avatar.webp'
}

function getAssigneeUserName(userId: string): string {
  const assigneeTeamMember = teamMembers.value.find(u => u.id === userId)
  const assigneeUser = users.value.find(u => u.id === assigneeTeamMember?.user_id)
  if (!assigneeUser)
    return 'A'

  return assigneeUser.name || 'B'
}

const currentAssignees = computed(() => {
  if (!selectedTask.value)
    return []

  const taskAssigneesForTask = taskAssignees.value.filter(ta => ta.task_id === selectedTask.value!.id)

  return taskAssigneesForTask
    .map((ta) => {
      const teamMember = teamMembers.value.find(m => m.id === ta.user_id)
      if (!teamMember)
        return null
      const assigneeUser = users.value.find(u => u.id === teamMember.user_id)

      return assigneeUser
    })
    .filter((u): u is User => u !== null)
})

// Status color helpers
function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    created: 'blue-grey',
    doing: 'info',
    done: 'success',
  }

  return colors[status.toLowerCase()] || 'grey'
}

function getStatusColorHex(status: string): string {
  const colors: Record<string, string> = {
    created: '#78909C',
    doing: '#2196F3',
    done: '#4CAF50',
  }

  return colors[status.toLowerCase()] || '#9E9E9E'
}

function getStatusIcon(status: string): string {
  const icons: Record<string, string> = {
    created: 'mdi-checkbox-blank-circle-outline',
    doing: 'mdi-progress-clock',
    done: 'mdi-check-circle',
  }

  return icons[status.toLowerCase()] || 'mdi-help-circle-outline'
}

function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
}

function formatDueDate(dueDate: string): string {
  const date = new Date(dueDate)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow'
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear()
      ? 'numeric'
      : undefined,
  })
}

function formatCreatedDate(createdAt: string): string {
  const date = new Date(createdAt)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return 'Today'
  }
  if (diffDays === 1) {
    return 'Yesterday'
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function handleOpenCreateTask() {
  selectedTask.value = null
  showTaskDialog.value = true
}

function handleOpenEditTask(task: Task) {
  selectedTask.value = task
  showTaskDialog.value = true
}

function handleOpenDeleteTask(task: Task) {
  selectedTask.value = task
  showDeleteDialog.value = true
}

async function handleDeleteTask() {
  if (selectedTask.value) {
    const tAssignees = getTaskAssignees(selectedTask.value.id)
    await boardStore.deleteTask(selectedTask.value.id, tAssignees.value)
  }
}

async function handleSaveTask(data: { task: Omit<Task, 'id'>, assignees: User[] }) {
  const currentTask = selectedTask.value
  try {
    if (currentTask) {
      // Edit existing task
      await boardStore.updateTask(currentTask.id, data.task)

      // Update assignees - delete old and add new
      const oldAssignees = taskAssignees.value.filter(ta => ta.task_id === currentTask.id)
      await Promise.all(oldAssignees.map(ta => boardStore.deleteTaskAssignee(ta.id)))

      await Promise.all(data.assignees.map(async (assigneeUser) => {
        const teamMember = teamMembers.value.find(
          m => m.team_id === teamId && m.user_id === assigneeUser.id,
        )
        if (teamMember) {
          await boardStore.addTaskAssignee({
            task_id: currentTask.id,
            user_id: teamMember.id,
            created_at: new Date().toISOString(),
          })
        }
      }))

      // Refresh assignees for this task
      await boardStore.fetchTaskAssignees(currentTask.id, true)
    }
    else {
      // Create new task
      const newTaskData = await boardStore.addTask(data.task)

      await Promise.all(data.assignees.map(async (assigneeUser) => {
        const teamMember = teamMembers.value.find(
          m => m.team_id === teamId && m.user_id === assigneeUser.id,
        )
        if (teamMember) {
          await boardStore.addTaskAssignee({
            task_id: newTaskData.id,
            user_id: teamMember.id,
            created_at: new Date().toISOString(),
          })
        }
      }))

      // Fetch assignees for new task
      await boardStore.fetchTaskAssignees(newTaskData.id, true)
    }

    if (currentTask === selectedTask.value) {
      selectedTask.value = null
    }
    showTaskDialog.value = false
  }
  catch (err: any) {
    console.error(err)
  }
}

onBeforeMount(async () => {
  loading.value = true
  await Promise.all([
    boardStore.fetchBoardWithTasks(boardId),
    teamStore.fetchTeamMembers(teamId),
  ])

  // Check if board exists
  if (!board.value) {
    await router.push('/error')

    return
  }

  // Find the current user's team member ID
  const currentTeamMember = teamMembers.value.find(
    m => m.team_id === teamId && m.user_id === user.value?.id,
  )
  if (currentTeamMember) {
    currentUserTeamMemberId.value = currentTeamMember.id
  }

  await userStore.fetchUsersByIds(teamMembers.value.map(tm => tm.user_id))

  // Fetch assignees for all tasks
  await Promise.all(tasks.value.map(task => boardStore.fetchTaskAssignees(task.id)))

  loading.value = false
})

onUnmounted(() => {
  boardStore.clearStore()
})
</script>
