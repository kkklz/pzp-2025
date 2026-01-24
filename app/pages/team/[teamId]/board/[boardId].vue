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
      <v-card-title class="d-flex text-white px-8 py-4 items-center justify-between">
        <h2>{{ board?.name || "Board" }}</h2>

        <v-btn
          icon="mdi-plus"
          variant="tonal"
          @click="handleOpenCreateTask"
        />
      </v-card-title>

      <v-divider />

      <v-card-text class="gap-8 grid grid-cols-3 h-full w-full items-start overflow-y-auto">
        <v-card
          v-for="task in tasks"
          :key="task.id"
          variant="outlined"
          class="min-h-[500px]"
        >
          <v-card-title class="d-flex items-center justify-between">
            <h2>{{ task.title }}</h2>

            <div class="flex gap-2 items-center">
              <p class="text-gray-400 text-sm!">
                {{ new Date(task.created_at).toLocaleDateString() }}
              </p>

              <v-tooltip
                :text="getTaskCreatorName(task.created_by)"
                location="bottom"
              >
                <template #activator="{props}">
                  <v-avatar
                    :image="getTaskCreatorPhotoUrl(task.created_by)"
                    size="25"
                    v-bind="props"
                  />
                </template>
              </v-tooltip>

              <v-btn
                variant="plain"
                density="compact"
              >
                <v-icon
                  icon="mdi-dots-vertical"
                  size="24"
                  class="cursor-pointer"
                />

                <v-menu activator="parent">
                  <v-list>
                    <v-list-item
                      link
                      @click="handleOpenEditTask(task)"
                    >
                      <span class="mdi mdi-square-edit-outline" />
                      Edit
                    </v-list-item>

                    <v-list-item
                      link
                      class="text-error"
                      @click="handleOpenDeleteTask(task)"
                    >
                      <span class="mdi mdi-delete" />
                      Delete
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-btn>
            </div>
          </v-card-title>

          <v-card-text>
            <div class="d-flex mb-3 items-center justify-between">
              <p>Due date: {{ new Date(task.due_date).toLocaleDateString() }}</p>

              <v-chip
                :text="task.status"
                size="small"
                variant="tonal"
              />
            </div>

            <p class="bg-surface-bright mt-2 pa-2 rounded-md max-h-[300px] min-h-[100px] overflow-y-auto">
              {{ task.description }}
            </p>

            <div
              v-if="getTaskAssignees(task.id).value.length > 0"
              class="d-flex mt-4 gap-2 items-center"
            >
              <span class="text-sm text-gray-400">Assignees:</span>

              <div class="d-flex gap-1">
                <v-tooltip
                  v-for="assignee in getTaskAssignees(task.id).value"
                  :key="assignee.id"
                  :text="getAssigneeUserName(assignee.user_id)"
                  location="bottom"
                >
                  <template #activator="{props}">
                    <v-avatar
                      :image="getAssigneePhotoUrl(assignee.user_id)"
                      size="28"
                      v-bind="props"
                    />
                  </template>
                </v-tooltip>
              </div>
            </div>
          </v-card-text>
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
