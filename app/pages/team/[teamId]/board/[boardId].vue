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
          @click="openCreateTaskDialog = true"
        />
      </v-card-title>

      <v-divider />

      <v-card-text class="flex gap-3 w-full overflow-x-auto">
        <v-card
          v-for="task in tasks"
          :key="task.id"
          class="flex-shrink-0 h-full w-[350px]"
          variant="outlined"
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

              <v-icon
                icon="mdi-dots-vertical"
                size="24"
                class="p-3 rounded-full cursor-pointer"
              />
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

            <p class="bg-surface-bright mt-2 pa-2 rounded-md min-h-[300px]">
              {{ task.description }}
            </p>

            <div
              v-if="getTaskAssignees(task.id).length > 0"
              class="d-flex mt-4 gap-2 items-center"
            >
              <span class="text-sm text-gray-400">Assignees:</span>

              <div class="d-flex gap-1">
                <v-tooltip
                  v-for="assignee in getTaskAssignees(task.id)"
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

  <v-dialog
    v-model="openCreateTaskDialog"
    @after-leave="handleCloseDialog"
  >
    <v-card class="mx-auto pa-4 max-w-max min-w-[400px]">
      <v-card-title>Create Task</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleCreateTask">
          <v-text-field
            v-model="newTaskName"
            label="Task name"
            required
          />

          <v-textarea
            v-model="newTaskDescription"
            label="Description"
          />

          <v-text-field
            v-model="newTaskDueDate"
            type="date"
            label="Due date"
          />

          <v-text-field
            v-model="newTaskStatus"
            type="text"
            label="Status"
          />

          <UserSelect
            v-model="newTaskAssignees"
            :team-id="teamId"
            multiple
            label="Select assignees"
          />

          <v-card-actions class="d-flex justify-between">
            <v-btn
              @click="handleCloseDialog"
            >
              Cancel
            </v-btn>

            <v-btn
              type="submit"
              color="primary"
              variant="flat"
            >
              Create task
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="tsx">
import type User from '~/types/user'

const boardStore = useBoardStore()
const { board, tasks, loading, error, taskAssignees } = storeToRefs(boardStore)
const teamStore = useTeamStore()
const { teamMembers } = storeToRefs(teamStore)
const userStore = useUserStore()
const { user, users } = storeToRefs(userStore)

const route = useRoute()
const boardId = route.params.boardId as string
const teamId = route.params.teamId as string

const openCreateTaskDialog = ref(false)

const newTaskName = ref('')
const newTaskDescription = ref('')
const newTaskDueDate = ref('')
const newTaskAssignees = ref<User[]>([])
const newTaskStatus = ref('')

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
    return 'User'

  const taskCreator = users.value.find(u => u.id === teamMember.user_id)
  if (!taskCreator)
    return 'User'

  return taskCreator.name || 'User'
}

function getTaskAssignees(taskId: string) {
  return taskAssignees.value.filter(ta => ta.task_id === taskId)
}

function getAssigneePhotoUrl(userId: string): string {
  const assigneeUser = users.value.find(u => u.id === userId)
  if (!assigneeUser)
    return '/default-avatar.webp'

  return assigneeUser.photoUrl || '/default-avatar.webp'
}

function getAssigneeUserName(userId: string): string {
  const assigneeUser = users.value.find(u => u.id === userId)
  if (!assigneeUser)
    return 'User'

  return assigneeUser.name || 'User'
}

async function handleCreateTask() {
  try {
    if (!user.value?.id) {
      return
    }

    // Find the team_member record for the current user
    const currentTeamMember = teamMembers.value.find(
      m => m.team_id === teamId && m.user_id === user.value?.id,
    )

    if (!currentTeamMember) {
      console.error('Current user is not a member of this team')

      return
    }

    const newTaskData = await boardStore.addTask({
      board_id: boardId,
      created_by: currentTeamMember.id,
      title: newTaskName.value,
      description: newTaskDescription.value,
      status: newTaskStatus.value,
      due_date: newTaskDueDate.value,
      created_at: new Date().toISOString(),
    })

    newTaskAssignees.value.forEach(async (ta) => {
      // Find the team_member record for this assignee
      const teamMember = teamMembers.value.find(
        m => m.team_id === teamId && m.user_id === ta.id,
      )

      if (teamMember) {
        await boardStore.addTaskAssignee({
          task_id: newTaskData.id,
          user_id: teamMember.id,
          created_at: new Date().toISOString(),
        })
      }
    })
  }
  catch (err: any) {
    console.error(err)
  }
  finally {
    handleCloseDialog()
  }
}

function handleCloseDialog() {
  newTaskName.value = ''
  newTaskDescription.value = ''
  newTaskDueDate.value = ''
  newTaskAssignees.value = []
  newTaskStatus.value = ''
  openCreateTaskDialog.value = false
}

onBeforeMount(async () => {
  loading.value = true
  await Promise.all([
    boardStore.fetchBoardWithTasks(boardId),
    teamStore.fetchTeamMembers(teamId),
  ])
  await userStore.fetchUsersByIds(teamMembers.value.map(tm => tm.user_id))

  // Fetch assignees for all tasks
  await Promise.all(tasks.value.map(task => boardStore.fetchTaskAssignees(task.id)))

  loading.value = false
})

onUnmounted(() => {
  boardStore.clearStore()
})
</script>
