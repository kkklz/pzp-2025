import type { QueryError } from '@supabase/supabase-js'
import type { Board, Task, TaskAssignee } from '~/types/board'
import { defineStore } from 'pinia'

export const useBoardStore = defineStore('board', () => {
  const board = ref<Board | null>(null)
  const boards = ref<Board[]>([])
  const tasks = ref<Task[]>([])
  const taskAssignees = ref<TaskAssignee[]>([])
  const error = ref<QueryError | null>(null)
  const loading = ref(false)

  const supabase = useSupabaseClient()

  const BOARDS = 'boards'
  const TASKS = 'tasks'
  const TASK_ASSIGNEES = 'task_assignees'

  function clearStore() {
    board.value = null
    tasks.value = []
    error.value = null
    loading.value = false
  }

  function sortTasks(tasksToSort: Task[]): Task[] {
    return tasksToSort.sort((a: Task, b: Task) => {
      const statusOrder: Record<Task['status'], number> = { Created: 0, Doing: 1, Done: 2 }
      const statusDiff = (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0)
      if (statusDiff !== 0)
        return statusDiff

      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    })
  }

  async function addBoard(boardData: Omit<Board, 'id' | 'created_at'>) {
    error.value = null
    loading.value = true
    const { data, error: err } = await supabase.from(BOARDS).insert({
      ...boardData,
    }).select().single()

    if (err) {
      error.value = err
    }
    else {
      board.value = data
    }

    loading.value = false
  }

  async function fetchTeamBoards(teamId: string) {
    error.value = null
    loading.value = true
    const { data, error: err } = await supabase.from(BOARDS).select().eq('team_id', teamId)

    if (err) {
      error.value = err
    }
    else {
      boards.value = data
    }
    loading.value = false
  }

  async function fetchBoardWithTasks(boardId: string) {
    error.value = null
    loading.value = true
    const { data, error: err } = await supabase.from(BOARDS).select(`
      id,
      team_id,
      name,
      created_at,
      tasks (
        id,
        board_id,
        title,
        description,
        status,
        due_date,
        created_by,
        created_at
      )  
    `).eq('id', boardId).single()

    if (err) {
      error.value = err
      loading.value = false

      return
    }

    board.value = {
      id: data.id,
      name: data.name,
      team_id: data.team_id,
      created_at: data.created_at,
    }

    tasks.value = sortTasks(data.tasks
      .map(t => ({
        id: t.id,
        board_id: t.board_id,
        title: t.title,
        description: t.description || '',
        status: t.status,
        due_date: t.due_date,
        created_by: t.created_by,
        created_at: t.created_at,
      })))

    loading.value = false
  }

  async function fetchTaskAssignees(taskId: string, refresh = false) {
    error.value = null
    loading.value = false
    const { data, error: err } = await supabase.from(TASK_ASSIGNEES).select().eq('task_id', taskId)

    if (err) {
      error.value = err
    }
    else {
      if (refresh) {
        // Remove old assignees for this task and add new ones
        taskAssignees.value = taskAssignees.value.filter(ta => ta.task_id !== taskId)
        taskAssignees.value.push(...data)
      }
      else {
        // Append new assignees, avoiding duplicates
        const existingIds = new Set(taskAssignees.value.map(ta => ta.id))
        const newAssignees = data.filter(ta => !existingIds.has(ta.id))
        taskAssignees.value.push(...newAssignees)
      }
    }

    loading.value = false
  }

  async function updateBoard(boardId: string, name: string) {
    error.value = null
    loading.value = true
    const { data, error: err } = await supabase.from(BOARDS).update({
      name,
    }).eq('id', boardId).select().single()

    if (err) {
      error.value = err
    }
    else {
      board.value = data
    }

    loading.value = false
  }

  async function deleteBoard(boardId: string) {
    error.value = null
    loading.value = true
    const { error: err } = await supabase.from(BOARDS).delete().eq('id', boardId)

    if (err) {
      error.value = err
    }
    loading.value = false
  }

  async function addTask(taskData: Omit<Task, 'id'>) {
    error.value = null
    loading.value = true
    const { data, error: err } = await supabase.from(TASKS).insert({
      ...taskData,
    }).select().single()

    if (err) {
      error.value = err
      loading.value = false
      throw err
    }
    else {
      tasks.value.push(data)
      tasks.value = sortTasks(tasks.value)
      loading.value = false

      return data
    }
  }

  async function updateTask(taskId: string, taskData: Omit<Task, 'id'>) {
    error.value = null
    loading.value = true
    const { data, error: err } = await supabase.from(TASKS).update({
      ...taskData,
    }).eq('id', taskId).select().single()

    if (err) {
      error.value = err
      loading.value = false

      throw err
    }
    else {
      tasks.value = tasks.value.map(t => (t.id === data.id
        ? data
        : t))

      tasks.value = sortTasks(tasks.value)
      loading.value = false
    }
  }

  async function deleteTask(taskId: string, tAssignees: TaskAssignee[]) {
    error.value = null
    loading.value = true

    try {
      await Promise.all(tAssignees.map(ta => deleteTaskAssignee(ta.id)))
    }
    catch (err: any) {
      error.value = err
      loading.value = false

      return
    }

    const { error: err } = await supabase.from(TASKS).delete().eq('id', taskId)

    if (err) {
      error.value = err
      loading.value = false

      throw err
    }
    tasks.value = tasks.value.filter(t => t.id !== taskId)
    loading.value = false
  }

  async function addTaskAssignee(assigneeData: Omit<TaskAssignee, 'id'>) {
    error.value = null
    loading.value = false
    const { data, error: err } = await supabase.from(TASK_ASSIGNEES).insert({
      ...assigneeData,
    }).select().single()

    if (err) {
      error.value = err
      loading.value = false
      throw err
    }
    else {
      if (!taskAssignees.value.find(ta => ta.user_id !== data.user_id))
        taskAssignees.value.push(data)
      loading.value = false
    }

    return data
  }

  async function deleteTaskAssignee(taskAssigneeId: string) {
    error.value = null
    loading.value = false
    const { error: err } = await supabase.from(TASK_ASSIGNEES).delete().eq('id', taskAssigneeId)

    if (err) {
      error.value = err
      loading.value = false

      throw err
    }
    loading.value = false
  }

  return {
    board,
    boards,
    tasks,
    taskAssignees,
    error,
    loading,
    clearStore,
    addBoard,
    fetchTeamBoards,
    fetchBoardWithTasks,
    fetchTaskAssignees,
    updateBoard,
    deleteBoard,
    addTask,
    updateTask,
    deleteTask,
    addTaskAssignee,
    deleteTaskAssignee,
  }
})
